import { ArrowRight } from "lucide-react"
import { i18n, Language } from "../i18n"
import { LanguageToggle } from "./LanguageToggle"

export function LandingPage({ onStart, language, toggleLanguage }: { onStart: () => void, language: Language, toggleLanguage: () => void }) {
  const t = i18n[language]

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(239,159,39,0.06) 0%, transparent 70%)" }}
      />
      
      <LanguageToggle language={language} toggleLanguage={toggleLanguage} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-12">
        <span className="text-sm font-sans font-medium text-amber-400 uppercase tracking-widest">
          {t.heroTag}
        </span>
        
        <div className="space-y-6">
          <h1 className="font-display text-5xl md:text-6xl font-normal text-ink-50 leading-tight tracking-tight">
            {t.heroTitle1}
            <br />
            <span className="text-amber-400">{t.heroTitle2}</span>
          </h1>
          <p className="font-sans text-lg text-ink-200 max-w-xl mx-auto leading-relaxed">
            {t.heroSub}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 text-ink-900 
                       font-sans font-medium text-base rounded-xl hover:bg-amber-300 
                       transition-colors duration-200"
          >
            {t.begin}
            <ArrowRight size={16} />
          </button>
          <span className="font-sans text-sm text-ink-400">
            {t.noAccount}
          </span>
        </div>
      </div>
    </div>
  )
}
