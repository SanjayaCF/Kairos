import { Signal } from "lucide-react"
import { i18n, Language } from "../i18n"

export function InsightPanel({ insight, language }: { insight: string; language: Language }) {
  const t = i18n[language]
  return (
    <div className="border border-amber-500/30 bg-amber-500/5 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Signal size={14} className="text-amber-400" />
        <span className="text-xs font-sans font-medium text-amber-400 uppercase tracking-widest">
          {t.insight}
        </span>
      </div>
      <p className="font-display text-lg text-ink-50 leading-relaxed">
        "{insight}"
      </p>
    </div>
  )
}
