import type { ParsedMemory } from "../types"
import type { Language } from "../i18n"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

const EXTRACTION_PROMPT = `
You are a personal memory analyst. Your job is to read raw personal text — 
WhatsApp chats, personal notes, diary entries, or any informal writing — 
and extract structured meaning from it.

Analyze the text deeply. Find the events, the people, the emotions, the patterns.
Return ONLY valid JSON. No preamble, no explanation, no markdown fences.

The JSON must match this exact schema:
{
  "events": [
    {
      "id": "unique string",
      "title": "short memorable title for this moment (max 8 words)",
      "date": "ISO date string or null",
      "people": ["name1", "name2"],
      "location": "city or place name or null",
      "topics": ["topic1", "topic2", "topic3"],
      "emotion": "positive | neutral | tense | melancholic | excited",
      "summary": "2-3 sentence description of what happened and why it matters",
      "rawSnippet": "a short verbatim or near-verbatim excerpt from the text that best represents this event (max 30 words)"
    }
  ],
  "clusters": [
    {
      "id": "unique string",
      "theme": "theme name (max 5 words)",
      "color": "amber | teal | coral",
      "eventIds": ["id1", "id2"]
    }
  ],
  "storySummary": "A rich 3-4 sentence narrative paragraph that tells the story of this period. Write it like the opening of a memoir in the SECOND PERSON ('you', 'your'). Speak directly to the user.",
  "insight": "A single sharp sentence that reveals a pattern or truth. Write this in the SECOND PERSON as well. Example: 'You mentioned deadlines five times, always late at night.' Be specific, not generic.",
  "dominantEmotion": "one word describing the overall emotional tone",
  "period": "human-readable time period, e.g. 'early April 2025' or 'a Tuesday in March'"
}

Rules:
- Extract 3 to 8 events minimum. If the text is short, still find meaningful micro-moments.
- clusters should group related events by theme, not by date.
- Assign colors meaningfully: amber for work/goals/tension, teal for relationships/connection, coral for personal/emotional/reflective.
- The insight must be specific to THIS text — not a generic observation.
- storySummary and insight MUST be written in the SECOND PERSON ('you', 'your').
- storySummary must read beautifully, like literary prose.
- If you cannot determine a date, use null — do not guess.
- eventIds in clusters must reference real event ids you generated.
`

export async function analyzeMemory(rawText: string, language: Language): Promise<ParsedMemory> {
  const languageInstruction = language === "id" 
    ? "IMPORTANT: All generated text fields (title, summary, theme, storySummary, insight, period, and dominantEmotion) MUST be written in Indonesian (Bahasa Indonesia)."
    : "IMPORTANT: All generated text fields MUST be written in English."

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      messages: [
        {
          role: "user",
          content: `${EXTRACTION_PROMPT}\n\n${languageInstruction}\n\nHere is the text to analyze:\n\n${rawText}`,
        },
      ],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message ?? "Groq API error")
  }

  const text: string = data.choices[0].message.content
  const clean = text.replace(/```json|```/g, "").trim()
  const parsed = JSON.parse(clean)

  // Resolve cluster eventIds to actual event objects
  const eventMap = new Map(parsed.events.map((e: any) => [e.id, e]))
  
  return {
    events: parsed.events,
    clusters: parsed.clusters.map((c: any) => ({
      id: c.id,
      theme: c.theme,
      color: c.color,
      events: (c.eventIds || []).map((id: string) => eventMap.get(id)).filter(Boolean),
    })),
    storySummary: parsed.storySummary,
    insight: parsed.insight,
    dominantEmotion: parsed.dominantEmotion,
    period: parsed.period,
  }
}