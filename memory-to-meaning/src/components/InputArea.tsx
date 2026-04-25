import { useState, useEffect } from "react"
import { FileText, BookOpen, Tag, Sparkles, Eye, Trash2, Mic, MicOff, FlaskConical } from "lucide-react"
import { i18n, Language } from "../i18n"
import { LanguageToggle } from "./LanguageToggle"
import type { HistoryItem } from "../types"

const MonadIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <img src="/image.png" alt="Monad" style={{ width: size, height: size }} className={className} />
)

const DEMO_TEXT = `April 14 — 11:42 PM
Raka: yo are you still up
Me: yeah cant sleep
Raka: same. deadline is tomorrow and i havent started the deck
Me: lol same. also i forgot i said id meet mira for coffee at 10
Raka: you should cancel
Me: i cant she already moved her morning for it

April 15 — 10:15 AM
finally met mira at kopitiam jalan malioboro. she looks tired. she said she just came back from surabaya. we talked for almost two hours about leaving our jobs. she wants to go freelance. i said maybe next year. the coffee was actually good.

April 15 — 2:34 PM
finished the deck somehow. sent it at 2:30. boss replied "looks good" which means nothing. spent 80k on lunch after because i felt like i deserved it.

April 16
restday. didnt do anything. watched two episodes of something i wont remember. felt weird. not sad exactly. just like the week passed and i dont know what i have to show for it.

April 17 — 9:00 AM
standup call. three people were late. we talked about the same blockers as last week. i said nothing. after the call raka messaged and said "bro that was painful"`

export function InputArea({
  onSubmit,
  error,
  language,
  toggleLanguage,
  history,
  onDeleteHistory,
  onViewHistory,
  onOpenMonad,
}: {
  onSubmit: (text: string) => void
  error: string | null
  language: Language
  toggleLanguage: () => void
  history: HistoryItem[]
  onDeleteHistory: (id: string) => void
  onViewHistory: (item: HistoryItem) => void
  onOpenMonad: (item: HistoryItem) => void
}) {
  const [text, setText] = useState("")
  const [activeTab, setActiveTab] = useState<"history" | "examples">(history.length > 0 ? "history" : "examples")
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  const t = i18n[language]

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const rec = new SpeechRecognition()
      rec.continuous = true
      rec.interimResults = true

      rec.onresult = (event: any) => {
        let finalTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " "
          }
        }
        if (finalTranscript) {
          setText(prev => prev + finalTranscript)
        }
      }

      rec.onerror = () => setIsRecording(false)
      rec.onend = () => setIsRecording(false)

      setRecognition(rec)
    }
  }, [])

  const toggleRecording = () => {
    if (!recognition) {
      alert("Voice input is not supported in your browser.")
      return
    }
    if (isRecording) {
      recognition.stop()
    } else {
      recognition.lang = language === "id" ? "id-ID" : "en-US"
      recognition.start()
      setIsRecording(true)
    }
  }

  const handleSubmit = () => {
    if (text.trim().length >= 50) {
      if (isRecording && recognition) recognition.stop()
      onSubmit(text)
    }
  }


  const charCount = text.trim().length
  const canSubmit = charCount >= 50

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto flex flex-col justify-center relative">
      <LanguageToggle language={language} toggleLanguage={toggleLanguage} />

      <div className="flex flex-col lg:flex-row gap-10 mt-12">

        {/* Left: textarea */}
        <div className="w-full lg:w-[60%] flex flex-col">
          <div className="relative">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full h-[28rem] bg-ink-800 border border-ink-600 rounded-2xl
                         p-6 pb-16 font-sans text-base text-ink-100 placeholder:text-ink-500
                         resize-none focus:outline-none focus:border-amber-500
                         transition-colors duration-200 leading-relaxed"
              placeholder={t.placeholder}
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className={`text-xs font-sans ${charCount > 0 && !canSubmit ? "text-amber-500" : "text-ink-500"}`}>
                {charCount > 0 ? `${charCount} chars` : ""}
              </span>
              <button
                onClick={toggleRecording}
                className={`pointer-events-auto p-2.5 rounded-full transition-colors ${
                  isRecording
                    ? "bg-coral-500/20 text-coral-400 hover:bg-coral-500/30 animate-pulse"
                    : "bg-ink-700 text-ink-400 hover:bg-ink-600 hover:text-amber-400"
                }`}
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full mt-4 py-4 bg-amber-400 text-ink-900 font-sans font-medium text-base rounded-xl
                       hover:bg-amber-300 transition-colors flex items-center justify-center gap-2
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles size={16} />
            {t.extract}
          </button>

          {error && (
            <p className="text-coral-400 text-sm mt-3 font-sans">{t.error}</p>
          )}
          {charCount > 0 && !canSubmit && (
            <p className="text-amber-500 text-sm mt-3 font-sans">{t.minChars}</p>
          )}
        </div>

        {/* Right: sidebar */}
        <div className="w-full lg:w-[40%] flex flex-col" style={{ height: "28rem" }}>
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-ink-700 mb-5 flex-shrink-0">
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-3 font-sans font-medium text-sm transition-colors border-b-2 relative top-[1px] ${
                activeTab === "history"
                  ? "text-amber-400 border-amber-400"
                  : "text-ink-400 border-transparent hover:text-ink-200"
              }`}
            >
              {t.historyTitle}
              {history.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-ink-700 rounded-full text-[10px] text-ink-400">
                  {history.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("examples")}
              className={`pb-3 font-sans font-medium text-sm transition-colors border-b-2 relative top-[1px] ${
                activeTab === "examples"
                  ? "text-amber-400 border-amber-400"
                  : "text-ink-400 border-transparent hover:text-ink-200"
              }`}
            >
              {t.examplesTitle}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {/* Examples tab */}
            {activeTab === "examples" && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-ink-800 border border-ink-600 rounded-xl flex-shrink-0">
                    <FileText className="text-amber-400" size={18} />
                  </div>
                  <div>
                    <h3 className="font-display text-base text-ink-50 mb-0.5">{t.whatsappTitle}</h3>
                    <p className="font-sans text-sm text-ink-400">{t.whatsappSub}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-ink-800 border border-ink-600 rounded-xl flex-shrink-0">
                    <BookOpen className="text-teal-400" size={18} />
                  </div>
                  <div>
                    <h3 className="font-display text-base text-ink-50 mb-0.5">{t.journalTitle}</h3>
                    <p className="font-sans text-sm text-ink-400">{t.journalSub}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-ink-800 border border-ink-600 rounded-xl flex-shrink-0">
                    <Tag className="text-coral-400" size={18} />
                  </div>
                  <div>
                    <h3 className="font-display text-base text-ink-50 mb-0.5">{t.notesTitle}</h3>
                    <p className="font-sans text-sm text-ink-400">{t.notesSub}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-ink-700">
                  <button
                    onClick={() => setText(DEMO_TEXT)}
                    className="flex items-center gap-2 text-sm font-sans text-ink-300 hover:text-amber-400 transition-colors"
                  >
                    <FlaskConical size={14} />
                    {t.tryDemo}
                  </button>
                </div>
              </div>
            )}

            {/* History tab */}
            {activeTab === "history" && (
              <div className="space-y-3">
                {history.length === 0 ? (
                  <p className="text-ink-500 text-sm font-sans mt-2">{t.noHistory}</p>
                ) : (
                  history.map(item => (
                    <div
                      key={item.id}
                      className="bg-ink-800 border border-ink-600 rounded-xl p-4 hover:border-ink-500 transition-colors"
                    >
                      <h4 className="font-display text-sm text-ink-50 mb-1">{item.memory.period}</h4>
                      <p className="font-sans text-xs text-ink-400 line-clamp-2 mb-2 leading-relaxed">
                        {item.memory.insight}
                      </p>
                      <p className="font-sans text-[10px] text-ink-500 mb-3">
                        {new Date(item.timestamp).toLocaleString(language === "id" ? "id-ID" : "en-US")}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-ink-700">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onViewHistory(item)}
                            className="flex items-center gap-1 text-xs font-sans text-amber-400 hover:text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <Eye size={11} />
                            {t.viewBtn}
                          </button>
                          <button
                            onClick={() => onDeleteHistory(item.id)}
                            className="flex items-center gap-1 text-xs font-sans text-ink-400 hover:text-coral-400 bg-ink-700 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <Trash2 size={11} />
                            {t.deleteBtn}
                          </button>
                        </div>
                        <button
                          onClick={() => onOpenMonad(item)}
                          className={`flex items-center gap-1.5 text-xs font-sans px-2.5 py-1 rounded-lg transition-colors border ${
                            item.memory.monadProof 
                              ? "text-[#836EF9] border-[#836EF9]/30 bg-[#836EF9]/5 hover:bg-[#836EF9]/10" 
                              : "text-ink-400 border-ink-600 hover:text-[#A392FF] hover:border-[#836EF9]/50 hover:bg-[#836EF9]/10"
                          }`}
                          title={item.memory.monadProof ? "View Seal Receipt" : "Seal on Monad"}
                        >
                          <MonadIcon size={12} />
                          {item.memory.monadProof && <span>Sealed</span>}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
