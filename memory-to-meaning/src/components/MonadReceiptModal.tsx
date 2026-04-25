import { motion, AnimatePresence } from "framer-motion"
import { Link, X, CheckCircle2 } from "lucide-react"
import { i18n, Language } from "../i18n"

export function MonadReceiptModal({ 
  hashHex, 
  onClose,
  language
}: { 
  hashHex: string | null
  onClose: () => void 
  language: Language
}) {
  const t = i18n[language]
  
  if (!hashHex) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-ink-800 border border-ink-600 rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-ink-400 hover:text-ink-100 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-teal-400/10 rounded-full flex items-center justify-center mb-6 border border-teal-400/20">
              <CheckCircle2 size={32} className="text-teal-400" />
            </div>
            
            <h3 className="font-display text-2xl text-ink-50 mb-2">{t.monadSealed}</h3>
            <p className="font-sans text-sm text-ink-300 mb-8 leading-relaxed">
              {t.monadDesc}
            </p>
            
            <div className="w-full bg-ink-900 rounded-xl p-4 border border-ink-700 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2 text-ink-400">
                <Link size={14} />
                <span className="text-xs font-sans uppercase tracking-widest font-medium">{t.monadHash}</span>
              </div>
              <code className="text-amber-400 font-mono text-xs break-all text-center">
                {hashHex}
              </code>
            </div>
            
            <p className="text-[10px] text-ink-500 mt-6 font-sans uppercase tracking-widest">
              {t.poweredBy}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
