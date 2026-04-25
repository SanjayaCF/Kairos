import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle } from "lucide-react"
import type { ParsedMemory, MonadProofResult } from "../types"
import { saveMemoryProof } from "../lib/monad"

const MonadIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <img src="/image.png" alt="Monad" style={{ width: size, height: size }} className={className} />
)

export function MonadModal({
  isOpen,
  onClose,
  memory,
  walletAddress,
  onConnectWallet,
  onProofSaved,
}: {
  isOpen: boolean
  onClose: () => void
  memory: ParsedMemory | null
  walletAddress: string | null
  onConnectWallet: () => Promise<void>
  onProofSaved: (proof: MonadProofResult) => void
}) {
  const [saving, setSaving] = useState(false)
  const [monadError, setMonadError] = useState<string | null>(null)

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  // Reset error when modal opens
  useEffect(() => {
    if (isOpen) setMonadError(null)
  }, [isOpen])

  if (!memory) return null

  const proof = memory.monadProof

  const handleSaveToMonad = async () => {
    if (!walletAddress) return
    setSaving(true)
    setMonadError(null)
    try {
      const result = await saveMemoryProof(
        memory.storySummary,
        memory.insight,
        memory.period
      )
      onProofSaved(result)
    } catch (err: any) {
      if (err?.message?.includes("User rejected")) {
        setMonadError("Transaction cancelled.")
      } else {
        setMonadError("Transaction failed. Check your MON balance.")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg bg-ink-900 border border-[#836EF9]/30 rounded-2xl shadow-[0_8px_32px_rgba(131,110,249,0.1)] flex flex-col overflow-hidden"
          >
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#836EF9]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-ink-400 hover:text-ink-100 hover:bg-ink-800 rounded-full transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="p-6 relative z-10">
              {/* Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#836EF9]/20 flex items-center justify-center text-[#836EF9]">
                  <MonadIcon size={16} />
                </div>
                <span className="text-xs font-sans font-semibold text-[#836EF9] uppercase tracking-widest">
                  Monad Proof of Memory
                </span>
              </div>

              {/* State 1 — not connected */}
              {!walletAddress && !proof && (
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="text-sm font-medium text-ink-50 mb-1">
                      Secure your story on the blockchain
                    </p>
                    <p className="text-xs text-ink-400 leading-relaxed">
                      Only a cryptographic hash is stored on Monad. Your personal content remains 100% private.
                    </p>
                  </div>
                  <button
                    onClick={onConnectWallet}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-[#836EF9]/50 rounded-xl text-sm font-medium text-[#836EF9] hover:bg-[#836EF9]/10 transition-all shadow-[0_0_15px_rgba(131,110,249,0.15)] hover:shadow-[0_0_25px_rgba(131,110,249,0.25)]"
                  >
                    Connect Wallet
                  </button>
                  {monadError && (
                    <div className="flex items-center gap-2 text-coral-400 text-xs">
                      <AlertCircle size={12} />
                      {monadError}
                    </div>
                  )}
                </div>
              )}

              {/* State 2 — connected, not saved */}
              {walletAddress && !proof && (
                <div>
                  <div className="flex flex-col gap-5 mb-2">
                    <div>
                      <p className="text-xs text-ink-400 mb-1">Connected as</p>
                      <p className="text-sm text-ink-100 font-mono bg-ink-950 px-2 py-1 rounded-md border border-ink-800 inline-block">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </p>
                    </div>
                    <button
                      onClick={handleSaveToMonad}
                      disabled={saving}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#836EF9] text-white font-medium text-sm rounded-xl hover:bg-[#6c55f5] transition-all shadow-[0_0_20px_rgba(131,110,249,0.3)] hover:shadow-[0_0_30px_rgba(131,110,249,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_0_20px_rgba(131,110,249,0.3)]"
                    >
                      <MonadIcon size={16} />
                      {saving ? "Sealing..." : "Seal on Monad"}
                    </button>
                  </div>

                  {/* Fake progress bar while saving */}
                  {saving && (
                    <div className="w-full h-1 bg-ink-950 rounded-full overflow-hidden mt-4 border border-ink-800">
                      <div className="h-full bg-[#836EF9] animate-pulse w-3/4 shadow-[0_0_10px_#836EF9]" />
                    </div>
                  )}

                  {/* Error state */}
                  {monadError && (
                    <div className="flex items-center gap-2 mt-4 text-coral-400 text-xs">
                      <AlertCircle size={12} />
                      {monadError}
                    </div>
                  )}
                </div>
              )}

              {/* State 3 — saved successfully */}
              {proof && (
                <div>
                  <div className="flex items-center gap-2 mb-4 text-[#836EF9]">
                    <CheckCircle size={18} />
                    <span className="text-base font-semibold">Cryptographically Sealed</span>
                  </div>

                  <div className="space-y-3 mb-5 p-4 bg-ink-950/50 rounded-xl border border-[#836EF9]/20">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-ink-500 uppercase tracking-wider">Transaction</span>
                      <a
                        href={proof.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#836EF9] hover:text-[#A392FF] font-mono underline underline-offset-4 transition-colors"
                      >
                        {proof.txHash.slice(0, 10)}...{proof.txHash.slice(-8)} ↗
                      </a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-ink-500 uppercase tracking-wider">Content Hash</span>
                      <span className="text-sm text-ink-300 font-mono bg-ink-900 px-2 py-0.5 rounded">
                        {proof.contentHash.slice(0, 10)}...{proof.contentHash.slice(-8)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-ink-500 uppercase tracking-wider">Network</span>
                      <span className="text-sm text-ink-300 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse" />
                        Monad Testnet
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-ink-500 leading-relaxed">
                    This hash is a cryptographic fingerprint of your story. 
                    Anyone can verify this memory existed at this moment — 
                    without seeing its contents.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
