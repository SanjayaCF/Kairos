import { Fragment } from "react"
import { GitBranch } from "lucide-react"
import type { MemoryEvent } from "../types"
import { i18n, Language } from "../i18n"

const bgColors = {
  amber: "bg-amber-400",
  teal:  "bg-teal-400",
  coral: "bg-coral-400",
}

function formatDate(date: string | null, fallback: string): string {
  if (!date) return fallback
  try {
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  } catch {
    return date
  }
}

export function Timeline({
  events,
  eventColorMap,
  language,
}: {
  events: MemoryEvent[]
  eventColorMap: Record<string, "amber" | "teal" | "coral">
  language: Language
}) {
  const t = i18n[language]

  const sortedEvents = [...events].sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return a.date.localeCompare(b.date)
  })

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <GitBranch size={14} className="text-ink-400" />
        <span className="text-xs font-sans font-medium text-ink-400 uppercase tracking-widest">
          Timeline
        </span>
      </div>

      <div className="overflow-x-auto pb-3 scrollbar-thin">
        <div className="min-w-max px-2">
          {/* Dots + connectors row */}
          <div className="flex items-center">
            {sortedEvents.map((event, index) => {
              const color = eventColorMap[event.id] || "amber"
              const isLast = index === sortedEvents.length - 1
              return (
                <Fragment key={`dot-${event.id}`}>
                  <div className="w-28 flex justify-center flex-shrink-0">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${bgColors[color]} hover:scale-125 transition-transform cursor-pointer`}
                    />
                  </div>
                  {!isLast && (
                    <div className="w-12 h-[2px] bg-ink-700 flex-shrink-0" />
                  )}
                </Fragment>
              )
            })}
          </div>

          {/* Labels row */}
          <div className="flex items-start mt-3">
            {sortedEvents.map((event, index) => {
              const isLast = index === sortedEvents.length - 1
              return (
                <Fragment key={`label-${event.id}`}>
                  <div className="w-28 text-center px-2 flex-shrink-0">
                    <p className="text-xs font-sans font-medium text-ink-200 truncate leading-tight">
                      {event.title}
                    </p>
                    <p className="text-[10px] font-sans text-ink-400 mt-1">
                      {formatDate(event.date, t.unknown)}
                    </p>
                  </div>
                  {!isLast && <div className="w-12 flex-shrink-0" />}
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
