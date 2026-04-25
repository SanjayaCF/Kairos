import { useState, useEffect } from "react"
import { LandingPage } from "./components/LandingPage"
import { InputArea } from "./components/InputArea"
import { ProcessingScreen } from "./components/ProcessingScreen"
import { ResultScreen } from "./components/ResultScreen"
import { MonadModal } from "./components/MonadModal"
import { analyzeMemory } from "./lib/claude"
import { connectWallet } from "./lib/monad"
import type { AppState, ParsedMemory, HistoryItem, MonadProofResult } from "./types"
import type { Language } from "./i18n"

export default function App() {
  const [state, setState] = useState<AppState>("landing")
  const [memory, setMemory] = useState<ParsedMemory | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Global Monad State
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [activeMonadItem, setActiveMonadItem] = useState<{ id: string | null, memory: ParsedMemory | null }>({ id: null, memory: null })

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("kairos-language")
    return saved === "id" || saved === "en" ? saved : "en"
  })

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("kairos-history")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem("kairos-language", language)
  }, [language])

  useEffect(() => {
    localStorage.setItem("kairos-history", JSON.stringify(history))
  }, [history])

  const handleSubmit = async (text: string) => {
    setState("processing")
    setError(null)
    try {
      const result = await analyzeMemory(text, language)
      setMemory(result)
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        rawText: text,
        memory: result,
      }
      setHistory(prev => [newItem, ...prev])
      setState("result")
    } catch (err) {
      setError(err instanceof Error ? err.message : "error")
      setState("input")
    }
  }

  const handleReset = () => {
    setMemory(null)
    setState("input")
  }

  const handleViewHistory = (item: HistoryItem) => {
    setMemory(item.memory)
    setState("result")
  }

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  const toggleLanguage = () => {
    setLanguage(prev => (prev === "en" ? "id" : "en"))
  }

  // Global Monad Handlers
  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet()
      setWalletAddress(address)
    } catch (err) {
      console.error("Wallet connection failed", err)
      throw err
    }
  }

  const handleProofSaved = (proof: MonadProofResult) => {
    const { id, memory: currentMemory } = activeMonadItem
    
    // If saving from a history item, update the history array
    if (id) {
      setHistory(prev => prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            memory: { ...item.memory, monadProof: proof }
          }
        }
        return item
      }))
    }
    
    // Also update the current active result memory if it matches
    if (memory && memory.storySummary === currentMemory?.storySummary) {
      setMemory({ ...memory, monadProof: proof })
    }

    // Update the active item state so the modal updates immediately
    if (currentMemory) {
      setActiveMonadItem({
        id,
        memory: { ...currentMemory, monadProof: proof }
      })
    }
  }

  return (
    <div className="min-h-screen bg-ink-900">
      {state === "landing" && (
        <LandingPage onStart={() => setState("input")} language={language} toggleLanguage={toggleLanguage} />
      )}
      {state === "input" && (
        <InputArea
          onSubmit={handleSubmit}
          error={error}
          language={language}
          toggleLanguage={toggleLanguage}
          history={history}
          onDeleteHistory={handleDeleteHistory}
          onViewHistory={handleViewHistory}
          onOpenMonad={(item) => setActiveMonadItem({ id: item.id, memory: item.memory })}
        />
      )}
      {state === "processing" && <ProcessingScreen language={language} />}
      {state === "result" && memory && (
        <ResultScreen 
          memory={memory} 
          onReset={handleReset} 
          language={language}
          onOpenMonad={() => setActiveMonadItem({ id: history.find(h => h.memory.storySummary === memory.storySummary)?.id || null, memory })}
        />
      )}

      {/* Global Monad Modal */}
      <MonadModal
        isOpen={activeMonadItem.memory !== null}
        onClose={() => setActiveMonadItem({ id: null, memory: null })}
        memory={activeMonadItem.memory}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
        onProofSaved={handleProofSaved}
      />
    </div>
  )
}
