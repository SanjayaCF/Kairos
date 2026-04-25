import { useState, useRef } from "react"
import { RotateCcw, BookOpen, Link, Share, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import html2canvas from "html2canvas"
import { InsightPanel } from "./InsightPanel"
import { MemoryCard } from "./MemoryCard"
import { Timeline } from "./Timeline"
import { ShareModal } from "./ShareModal"
import type { ParsedMemory } from "../types"
import { i18n, Language } from "../i18n"

const MonadIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <img src="/image.png" alt="Monad" style={{ width: size, height: size }} className={className} />
)

const clusterTextColors = {
  amber: "text-amber-400",
  teal:  "text-teal-400",
  coral: "text-coral-400",
}

const clusterBorderColors = {
  amber: "border-t-amber-400/40",
  teal:  "border-t-teal-400/40",
  coral: "border-t-coral-400/40",
}

export function ResultScreen({
  memory,
  onReset,
  language,
}: {
  memory: ParsedMemory
  onReset: () => void
  language: Language
  onOpenMonad: () => void
}) {
  const t = i18n[language]
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

  const proof = memory.monadProof

  const eventColorMap = memory.clusters.reduce((acc, cluster) => {
    cluster.events.forEach(event => {
      acc[event.id] = cluster.color
    })
    return acc
  }, {} as Record<string, "amber" | "teal" | "coral">)




  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto py-12 relative">
      <ShareModal 
        memory={memory} 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        language={language} 
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
      >
        <div>
          <p className="text-xs font-sans font-medium text-ink-400 uppercase tracking-widest mb-1">
            {t.yourStoryFrom}
          </p>
          <h2 className="font-display text-2xl text-ink-50">{memory.period}</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-3 py-2 border border-ink-600 rounded-xl text-sm text-ink-300 hover:border-amber-500 hover:text-amber-400 transition-colors disabled:opacity-50"
            onClick={() => setIsShareModalOpen(true)}
            title={t.shareBtn || t.exportBtn}
          >
            <Share size={14} />
            <span className="hidden sm:inline text-xs">{t.shareBtn || t.exportBtn}</span>
          </button>

          <button
            className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-sm transition-colors ${
              proof 
                ? "border-[#836EF9]/30 bg-[#836EF9]/5 text-[#836EF9]" 
                : "border-ink-600 text-[#836EF9] hover:border-[#836EF9]/50 hover:bg-[#836EF9]/10"
            }`}
            onClick={onOpenMonad}
            title={proof ? "View Seal Receipt" : "Seal on Monad"}
          >
            <MonadIcon size={14} />
            <span className="hidden sm:inline text-xs font-medium">
              {proof ? "Sealed" : "Seal on Monad"}
            </span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 text-sm text-ink-400 hover:text-ink-200 transition-colors"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline text-xs">{t.newAnalysis}</span>
          </button>
        </div>
      </motion.div>

      {/* Exportable content */}
      <div ref={exportRef} className="space-y-8">

        {/* Story summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={14} className="text-ink-400" />
            <span className="text-xs font-sans font-medium text-ink-400 uppercase tracking-widest">
              {t.yourStory}
            </span>
          </div>
          <p className="font-display text-xl text-ink-100 leading-relaxed max-w-2xl">
            {memory.storySummary}
          </p>
        </motion.div>

        {/* Insight */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InsightPanel insight={memory.insight} language={language} />
        </motion.div>

        {/* Cluster grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {memory.clusters.map((cluster, i) => (
            <motion.div
              key={cluster.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`bg-ink-800 border border-ink-600 border-t-2 ${clusterBorderColors[cluster.color]} rounded-2xl p-5`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-sans font-medium uppercase tracking-widest ${clusterTextColors[cluster.color]}`}>
                  {cluster.theme}
                </span>
                <span className="text-xs text-ink-500 font-sans">
                  {cluster.events.length} {t.moments}
                </span>
              </div>
              <div className="space-y-3">
                {cluster.events.slice(0, 3).map(event => (
                  <MemoryCard key={event.id} event={event} color={cluster.color} />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-ink-800 border border-ink-600 rounded-2xl p-6"
        >
          <Timeline events={memory.events} eventColorMap={eventColorMap} language={language} />
        </motion.div>

      </div>
    </div>
  )
}
