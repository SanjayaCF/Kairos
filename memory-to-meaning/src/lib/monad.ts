import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  defineChain,
} from "viem"
import type { MonadProofResult, ParsedMemory } from "../types"

// ─── Chain definition ───────────────────────────────────────────────────────

export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://testnet.monadexplorer.com",
    },
  },
})

// ─── Contract config ─────────────────────────────────────────────────────────

// TODO: Replace with your actual deployed contract address from Remix
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`

const ABI = [
  {
    name: "saveMemory",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_contentHash", type: "bytes32" },
      { name: "_period", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "getAllProofs",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "contentHash", type: "bytes32" },
          { name: "timestamp", type: "uint256" },
          { name: "period", type: "string" },
        ],
      },
    ],
  },
] as const

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MonadProof {
  contentHash: string
  timestamp: number
  period: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function hashText(text: string): Promise<`0x${string}`> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hexString = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
  return `0x${hexString}` as `0x${string}`
}

function getWalletClient() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found. Please install MetaMask.")
  }
  return createWalletClient({
    chain: monadTestnet,
    transport: custom(window.ethereum),
  })
}

function getPublicClient() {
  return createPublicClient({
    chain: monadTestnet,
    transport: http("https://testnet-rpc.monad.xyz"),
  })
}

// ─── Connect wallet ───────────────────────────────────────────────────────────

export async function connectWallet(): Promise<string> {
  const client = getWalletClient()
  const [address] = await client.requestAddresses()
  return address
}

// ─── Save memory proof ────────────────────────────────────────────────────────

export async function saveMemoryProof(
  storySummary: string,
  insight: string,
  period: string
): Promise<MonadProofResult> {
  const walletClient = getWalletClient()
  const [address] = await walletClient.requestAddresses()

  // Hash the story summary + insight together
  const contentToHash = `${storySummary}\n${insight}`
  const contentHash = await hashText(contentToHash)

  // Use a mock response if the address hasn't been set yet to prevent crashing
  if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.warn("Using mock Monad transaction. Please update CONTRACT_ADDRESS in src/lib/monad.ts!")
    await new Promise(r => setTimeout(r, 2000))
    const mockTxHash = "0x" + Math.random().toString(16).slice(2, 66).padEnd(64, '0')
    return {
      txHash: mockTxHash,
      explorerUrl: `https://testnet.monadexplorer.com/tx/${mockTxHash}`,
      contentHash,
    }
  }

  const txHash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "saveMemory",
    args: [contentHash, period],
    account: address,
    chain: monadTestnet,
  })

  return {
    txHash,
    explorerUrl: `https://testnet.monadexplorer.com/tx/${txHash}`,
    contentHash,
  }
}

// Support for the old signature while we transition
export async function saveToMonad(memory: ParsedMemory): Promise<string> {
  const result = await saveMemoryProof(memory.storySummary, memory.insight, memory.period)
  return result.contentHash
}

// ─── Fetch existing proofs (optional — for showing history) ───────────────────

export async function fetchProofs(address: string): Promise<MonadProof[]> {
  const publicClient = getPublicClient()

  if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    return []
  }

  const raw = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getAllProofs",
    args: [address as `0x${string}`],
  }) as Array<{ contentHash: `0x${string}`; timestamp: bigint; period: string }>

  return raw.map(p => ({
    contentHash: p.contentHash,
    timestamp: Number(p.timestamp),
    period: p.period,
  }))
}
