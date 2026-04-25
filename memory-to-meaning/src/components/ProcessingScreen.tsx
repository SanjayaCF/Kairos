import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { processingMessages, Language } from "../i18n"

export function ProcessingScreen({ language }: { language: Language }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  
  const messages = processingMessages[language]

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 1500)

    const startTime = Date.now()
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / 8000) * 90, 90)
      setProgress(newProgress)
    }, 100)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [messages.length])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-ink-900">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
        
        <div className="h-8 overflow-hidden relative w-96 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.p 
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-display text-xl text-ink-100 absolute"
            >
              {messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="w-64 h-0.5 bg-ink-700 rounded-full overflow-hidden mt-4">
          <div 
            className="h-full bg-amber-400 transition-all duration-[100ms] ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
