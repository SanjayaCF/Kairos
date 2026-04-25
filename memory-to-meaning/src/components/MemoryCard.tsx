import { useState } from "react"
import { Calendar, MapPin, Tag, Quote, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { MemoryEvent } from "../types"

const emotionStyles: Record<string, { label: string; className: string }> = {
  positive:    { label: "positive",    className: "text-amber-400 bg-amber-400/10" },
  excited:     { label: "excited",     className: "text-amber-300 bg-amber-300/10" },
  neutral:     { label: "neutral",     className: "text-ink-400 bg-ink-700" },
  tense:       { label: "tense",       className: "text-coral-400 bg-coral-400/10" },
  melancholic: { label: "melancholic", className: "text-teal-300 bg-teal-300/10" },
}

const modalAccentColors: Record<string, string> = {
  amber: "border-t-amber-400",
  teal:  "border-t-teal-400",
  coral: "border-t-coral-400",
}

function formatDate(date: string | null): string {
  if (!date) return ""
  try {
    return new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  } catch {
    return date
  }
}

function formatDateShort(date: string | null): string {
  if (!date) return ""
  try {
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  } catch {
    return date
  }
}

function MemoryCardDetail({
  event,
  color,
  onClose,
}: {
  event: MemoryEvent
  color: "amber" | "teal" | "coral"
  onClose: () => void
}) {
  const emotion = emotionStyles[event.emotion] ?? emotionStyles.neutral

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        onClick={e => e.stopPropagation()}
        className={`bg-ink-800 border border-ink-600 border-t-2 ${modalAccentColors[color]} rounded-2xl p-7 max-w-lg w-full relative max-h-[85vh] overflow-y-auto scrollbar-thin`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-ink-400 hover:text-ink-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h3 className="font-display text-2xl text-ink-50 leading-snug mb-4 pr-8">
          {event.title}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-5">
          {event.date && (
            <span className="flex items-center gap-1.5 text-sm text-ink-400 font-sans">
              <Calendar size={13} className="text-ink-500 flex-shrink-0" />
              {formatDate(event.date)}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1.5 text-sm text-ink-400 font-sans">
              <MapPin size={13} className="text-ink-500 flex-shrink-0" />
              {event.location}
            </span>
          )}
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-sans font-medium capitalize ${emotion.className}`}>
            {emotion.label}
          </span>
        </div>

        <div className="h-px bg-ink-700 mb-5" />

        {/* Summary */}
        <p className="font-sans text-base text-ink-200 leading-relaxed mb-5">
          {event.summary}
        </p>

        {/* Raw snippet */}
        {event.rawSnippet && (
          <div className="flex items-start gap-3 pl-4 border-l-2 border-ink-600 mb-5">
            <Quote size={12} className="text-ink-500 mt-1 flex-shrink-0" />
            <p className="font-display italic text-base text-ink-400 leading-relaxed">
              "{event.rawSnippet}"
            </p>
          </div>
        )}

        {/* Topics */}
        {event.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {event.topics.map(topic => (
              <span
                key={topic}
                className="flex items-center gap-1 px-2.5 py-1 bg-ink-700 rounded-full text-xs text-ink-300 font-sans"
              >
                <Tag size={9} />
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* People */}
        {event.people.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.people.map(person => (
              <span
                key={person}
                className="px-3 py-1 bg-ink-700 border border-ink-600 rounded-full text-xs text-ink-300 font-sans"
              >
                {person}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export function MemoryCard({
  event,
  color,
}: {
  event: MemoryEvent
  color: "amber" | "teal" | "coral"
}) {
  const [open, setOpen] = useState(false)
  const emotion = emotionStyles[event.emotion] ?? emotionStyles.neutral

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="border border-ink-600 rounded-xl bg-ink-800/60 hover:border-ink-400 hover:bg-ink-800 transition-colors duration-200 p-4 cursor-pointer"
      >
        <h4 className="font-display text-base text-ink-50 mb-2 leading-snug">{event.title}</h4>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400 font-sans mb-3">
          {event.date && (
            <span className="flex items-center gap-1">
              <Calendar size={10} className="flex-shrink-0" />
              {formatDateShort(event.date)}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin size={10} className="flex-shrink-0" />
              {event.location}
            </span>
          )}
        </div>

        <p className="font-sans text-xs text-ink-400 leading-relaxed mb-3 line-clamp-2">
          {event.summary}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {event.people.map(person => (
              <span
                key={person}
                className="px-2 py-0.5 bg-ink-700 border border-ink-600 rounded-full text-xs text-ink-300 font-sans"
              >
                {person}
              </span>
            ))}
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-medium capitalize flex-shrink-0 ${emotion.className}`}>
            {emotion.label}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <MemoryCardDetail
            event={event}
            color={color}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
