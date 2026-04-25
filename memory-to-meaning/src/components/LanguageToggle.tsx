import type { Language } from "../i18n"

export function LanguageToggle({ 
  language, 
  toggleLanguage 
}: { 
  language: Language
  toggleLanguage: () => void 
}) {
  return (
    <div 
      onClick={toggleLanguage}
      className="absolute top-6 right-6 flex items-center bg-ink-800 border border-ink-600 rounded-full p-1 cursor-pointer w-16 h-8 z-20 hover:border-amber-400 transition-colors"
    >
      <div 
        className={`absolute w-6 h-6 bg-amber-400 rounded-full transition-transform duration-300 ease-out ${language === "id" ? "translate-x-8" : "translate-x-0"}`} 
      />
      <div className="w-full flex justify-between px-1.5 text-[10px] font-sans font-bold z-10 pointer-events-none">
        <span className={`${language === "en" ? "text-ink-900" : "text-ink-400"} transition-colors duration-300`}>EN</span>
        <span className={`${language === "id" ? "text-ink-900" : "text-ink-400"} transition-colors duration-300`}>ID</span>
      </div>
    </div>
  )
}
