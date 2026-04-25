import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Share2, Check } from "lucide-react"
import html2canvas from "html2canvas"
import type { ParsedMemory } from "../types"
import { i18n, Language } from "../i18n"

const TwitterIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
)

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
)

const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)

export function ShareModal({
  memory,
  isOpen,
  onClose,
  language,
}: {
  memory: ParsedMemory
  isOpen: boolean
  onClose: () => void
  language: Language
}) {
  const t = i18n[language]
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedText, setCopiedText] = useState("")

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#100E0A",
        scale: 2,
        logging: false,
      })
      return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
    } catch (e) {
      console.error("Canvas generation failed", e)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    const blob = await generateImage()
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = `kairos-story-${Date.now()}.png`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleNativeShare = async () => {
    const blob = await generateImage()
    if (!blob) return
    const file = new File([blob], `kairos-story-${Date.now()}.png`, { type: 'image/png' })
    if (typeof navigator.share === 'function' && 'canShare' in navigator && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: t.yourStory,
        text: memory.storySummary.slice(0, 100) + '...',
        files: [file]
      })
    }
  }

  const copyImageToClipboard = async (blob: Blob) => {
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
        return true
      }
    } catch (e) {
      console.error("Clipboard write failed", e)
    }
    return false
  }

  const handleSocialShare = async (platform: 'twitter' | 'instagram' | 'facebook') => {
    const blob = await generateImage()
    if (!blob) return

    const copied = await copyImageToClipboard(blob)
    
    if (platform === 'twitter') {
      if (copied) setCopiedText("Image copied! Paste it in your tweet.")
      setTimeout(() => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out my Kairos story! ⏳")}`, '_blank')
        setCopiedText("")
      }, 2000)
    } else if (platform === 'instagram') {
      handleDownload()
      setCopiedText("Image downloaded! Open Instagram to share.")
      setTimeout(() => setCopiedText(""), 3000)
    } else if (platform === 'facebook') {
      if (copied) setCopiedText("Image copied! Paste it in your post.")
      setTimeout(() => {
        window.open(`https://www.facebook.com/`, '_blank')
        setCopiedText("")
      }, 2000)
    }
  }

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

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
            className="relative w-full max-w-lg bg-ink-900 border border-ink-700 rounded-2xl shadow-2xl flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-ink-400 hover:text-ink-100 hover:bg-ink-800 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-6 pb-2 border-b border-ink-800">
              <h3 className="text-lg font-display text-ink-50">{t.shareBtn || "Share Story"}</h3>
              <p className="text-sm text-ink-400 mt-1">
                Choose how you want to share your Kairos analysis.
              </p>
            </div>

            <div className="p-6 bg-ink-950 flex justify-center overflow-hidden">
              {/* The Share Card to capture */}
              <div 
                ref={cardRef} 
                className="w-full max-w-sm bg-ink-900 rounded-2xl border border-ink-700 p-6 relative overflow-hidden flex flex-col"
                style={{ aspectRatio: '4/5' }}
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-display text-xl text-amber-400 tracking-wider">KAIROS</div>
                    <div className="text-xs font-sans font-medium text-ink-400 uppercase tracking-widest px-3 py-1 bg-ink-800 rounded-full">
                      {memory.period}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center gap-6">
                    <div>
                      <p className="font-display text-xl text-ink-50 leading-relaxed line-clamp-6">
                        "{memory.storySummary}"
                      </p>
                    </div>

                    <div className="p-4 bg-ink-950/50 rounded-xl border border-ink-800">
                      <span className="text-xs font-sans font-medium text-amber-500/80 uppercase tracking-widest block mb-2">
                        {t.insight || "Insight"}
                      </span>
                      <p className="text-sm text-ink-300 line-clamp-3">
                        {memory.insight}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {copiedText && (
                <div className="flex items-center justify-center gap-2 text-sm text-amber-400 bg-amber-400/10 py-2 rounded-lg">
                  <Check size={16} />
                  <span>{copiedText}</span>
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleSocialShare('twitter')}
                  disabled={isGenerating}
                  className="flex flex-col items-center gap-2 p-3 text-ink-400 hover:text-ink-50 hover:bg-ink-800 rounded-xl transition-colors disabled:opacity-50"
                  title="Share to X (Twitter)"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-ink-800 rounded-full">
                    <TwitterIcon size={20} />
                  </div>
                  <span className="text-xs font-medium">X</span>
                </button>

                <button
                  onClick={() => handleSocialShare('instagram')}
                  disabled={isGenerating}
                  className="flex flex-col items-center gap-2 p-3 text-ink-400 hover:text-pink-400 hover:bg-ink-800 rounded-xl transition-colors disabled:opacity-50"
                  title="Share to Instagram"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-ink-800 rounded-full">
                    <InstagramIcon size={20} />
                  </div>
                  <span className="text-xs font-medium">Instagram</span>
                </button>

                <button
                  onClick={() => handleSocialShare('facebook')}
                  disabled={isGenerating}
                  className="flex flex-col items-center gap-2 p-3 text-ink-400 hover:text-blue-400 hover:bg-ink-800 rounded-xl transition-colors disabled:opacity-50"
                  title="Share to Facebook"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-ink-800 rounded-full">
                    <FacebookIcon size={20} />
                  </div>
                  <span className="text-xs font-medium">Facebook</span>
                </button>

                {typeof navigator.share === 'function' && 'canShare' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    disabled={isGenerating}
                    className="flex flex-col items-center gap-2 p-3 text-ink-400 hover:text-ink-50 hover:bg-ink-800 rounded-xl transition-colors disabled:opacity-50"
                    title="More options"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-ink-800 rounded-full">
                      <Share2 size={20} />
                    </div>
                    <span className="text-xs font-medium">More</span>
                  </button>
                )}

                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="flex flex-col items-center gap-2 p-3 text-ink-400 hover:text-teal-400 hover:bg-ink-800 rounded-xl transition-colors disabled:opacity-50"
                  title="Download Image"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-ink-800 rounded-full">
                    <Download size={20} />
                  </div>
                  <span className="text-xs font-medium">Download</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
