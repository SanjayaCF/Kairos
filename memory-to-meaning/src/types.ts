export type AppState = "landing" | "input" | "processing" | "result"

export interface MonadProofResult {
  txHash: string
  explorerUrl: string
  contentHash: string
}

export interface MemoryEvent {
  id: string
  title: string
  date: string | null        // ISO date string or null
  people: string[]
  location: string | null
  topics: string[]
  emotion: "positive" | "neutral" | "tense" | "melancholic" | "excited"
  summary: string
  rawSnippet: string         // short excerpt from the original text
}

export interface MemoryCluster {
  id: string
  theme: string              // e.g. "Work & Deadlines"
  color: "amber" | "teal" | "coral"
  events: MemoryEvent[]
}

export interface ParsedMemory {
  events: MemoryEvent[]
  clusters: MemoryCluster[]
  storySummary: string
  insight: string            // the sharp one-liner
  dominantEmotion: string
  period: string             // e.g. "early April 2025"
  monadProof?: MonadProofResult // Optional field populated after save
}

export interface HistoryItem {
  id: string
  timestamp: number
  rawText: string
  memory: ParsedMemory
}
