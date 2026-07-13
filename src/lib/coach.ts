// ---------------------------------------------------------------------------
// The Circle coach. With VITE_ANTHROPIC_KEY it asks the Anthropic Messages API
// for a goal suggestion (mind / skill / character lanes only); without a key it
// falls back to a fully-offline keyword heuristic so /coach still works in demo
// mode. Physical / fitness / medical goals are never planned — they get a warm
// "coming soon, gym-first" notice plus a mind/skill alternative.
// ---------------------------------------------------------------------------
import type { GoalCategory, ProofMethod, Frequency } from '../types'
import { CATEGORY_META } from './labels'

// The spec pins claude-sonnet-4-6 (a valid, active model). Newer Sonnet-tier
// models exist (claude-sonnet-5) — bump this one constant to upgrade.
const COACH_MODEL = 'claude-sonnet-4-6'

export interface CoachSuggestion {
  title: string
  category: GoalCategory
  proof_method: ProofMethod
  frequency: Frequency
}

export type CoachReply =
  | { kind: 'goal'; suggestion: CoachSuggestion; note?: string }
  | { kind: 'notice'; message: string; alternative?: CoachSuggestion }

const CATEGORIES: GoalCategory[] = ['sat', 'school', 'skill', 'mindset', 'character', 'other']
const PROOFS: ProofMethod[] = [
  'screenshot',
  'photo',
  'video',
  'voice_note',
  'focus_session',
  'link',
  'honest_checkin',
]

export function coachHasKey(): boolean {
  return !!import.meta.env.VITE_ANTHROPIC_KEY
}

const SYSTEM_PROMPT = `You are the Circle coach — a warm, encouraging guide who helps young people set small, meaningful goals in the MIND, SKILL, and CHARACTER lanes.

You NEVER create fitness, physical, outdoor, sports, running, lifting, weight, diet, or medical plans. Those are not live in Circle yet.

Respond with ONLY a single minified JSON object — no prose, no markdown fences.

For a normal goal request, return:
{"type":"goal","title":"<concrete, doable goal in first person>","category":"<sat|school|skill|mindset|character|other>","proof_method":"<screenshot|photo|video|voice_note|focus_session|link|honest_checkin>","frequency":"<daily|weekdays>","note":"<one short encouraging sentence>"}

If the user asks for a PHYSICAL / fitness / outdoor / running / lifting / weight / diet goal, return:
{"type":"notice","message":"<1-2 warm sentences that physical goals aren't live yet, are coming soon, and will launch gym-first for safety>","alternative":{"type":"goal","title":"...","category":"...","proof_method":"...","frequency":"...","note":"..."}}

Keep titles concrete and small. Prefer honest_checkin for mindset/character, screenshot for sat, video for skill.`

// --- Anthropic path --------------------------------------------------------

async function askAnthropic(prompt: string): Promise<CoachReply> {
  const key = import.meta.env.VITE_ANTHROPIC_KEY as string
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      // required to call the API directly from a browser
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: COACH_MODEL,
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) throw new Error(`Coach API ${res.status}`)
  const data = await res.json()
  const text: string = (data.content ?? [])
    .filter((b: { type: string }) => b.type === 'text')
    .map((b: { text: string }) => b.text)
    .join('')
    .trim()
  return parseReply(text)
}

function parseReply(text: string): CoachReply {
  // tolerate stray prose/fences around the JSON
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON in coach reply')
  const obj = JSON.parse(text.slice(start, end + 1))
  if (obj.type === 'notice') {
    return {
      kind: 'notice',
      message: String(obj.message ?? 'Physical goals are coming soon, gym-first for safety.'),
      alternative: obj.alternative ? coerceSuggestion(obj.alternative) : undefined,
    }
  }
  return { kind: 'goal', suggestion: coerceSuggestion(obj), note: obj.note ? String(obj.note) : undefined }
}

function coerceSuggestion(o: Record<string, unknown>): CoachSuggestion {
  const category = (CATEGORIES.includes(o.category as GoalCategory) ? o.category : 'mindset') as GoalCategory
  const proof_method = (PROOFS.includes(o.proof_method as ProofMethod)
    ? o.proof_method
    : CATEGORY_META[category].defaultProof) as ProofMethod
  const frequency: Frequency = o.frequency === 'weekdays' ? 'weekdays' : 'daily'
  const title = String(o.title ?? 'A small daily goal').slice(0, 120)
  return { title, category, proof_method, frequency }
}

// --- Offline heuristic -----------------------------------------------------

const PHYSICAL = [
  'run', 'jog', 'sprint', 'lift', 'gym', 'workout', 'work out', 'weight',
  'muscle', 'abs', 'cardio', 'pushup', 'push-up', 'pull-up', 'pullup', 'squat',
  'marathon', '5k', '10k', 'diet', 'calorie', 'bulk', 'bench', 'hike', 'swim',
  'bike', 'cycling', 'steps', 'yoga', 'stretch', 'lose weight',
]

const KEYWORDS: Array<{ cat: GoalCategory; words: string[] }> = [
  { cat: 'sat', words: ['sat', 'act ', 'test prep', 'bluebook', 'reading set', 'practice test', 'score'] },
  { cat: 'school', words: ['homework', 'study', 'essay', 'class', 'exam', 'quiz', 'gpa', 'assignment', 'notes', 'chapter', 'lecture', 'grade'] },
  { cat: 'skill', words: ['guitar', 'piano', 'code', 'coding', 'program', 'draw', 'paint', 'design', 'language', 'spanish', 'french', 'writing', 'portfolio', 'music', 'sketch', 'chess', 'photo'] },
  { cat: 'mindset', words: ['meditat', 'journal', 'gratitude', 'mindful', 'calm', 'breathe', 'screen', 'phone', 'scroll', 'sleep', 'wake', 'read', 'focus'] },
  { cat: 'character', words: ['kind', 'honest', 'patience', 'help', 'volunteer', 'forgive', 'listen', 'apolog', 'integrity', 'grateful', 'compassion'] },
]

function heuristic(prompt: string): CoachReply {
  const p = prompt.toLowerCase()
  const isPhysical = PHYSICAL.some((w) => p.includes(w))

  if (isPhysical) {
    return {
      kind: 'notice',
      message:
        "Love the energy — but physical goals aren't live in Circle yet. They're coming soon, and we're launching them gym-first for safety. In the meantime, here's a mind + skill goal that builds the same discipline:",
      alternative: {
        title: 'Read 15 pages before I open my phone',
        category: 'mindset',
        proof_method: 'honest_checkin',
        frequency: 'daily',
      },
    }
  }

  let category: GoalCategory = 'mindset'
  for (const { cat, words } of KEYWORDS) {
    if (words.some((w) => p.includes(w))) {
      category = cat
      break
    }
  }
  const frequency: Frequency = /weekday|school day|mon|tue|wed|thu|fri/.test(p)
    ? 'weekdays'
    : 'daily'
  const title = cleanTitle(prompt, category)
  return {
    kind: 'goal',
    suggestion: { title, category, proof_method: CATEGORY_META[category].defaultProof, frequency },
    note: 'Small and specific beats big and vague. Your circle will keep you honest 💪',
  }
}

const TEMPLATES: Record<GoalCategory, string> = {
  sat: 'Do one timed SAT section',
  school: 'Review class notes for 20 minutes',
  skill: 'Practice my craft for 20 minutes',
  mindset: 'Read 15 pages before I open my phone',
  character: 'Do one small kind thing on purpose',
  other: 'Show up for my goal today',
}

function cleanTitle(prompt: string, category: GoalCategory): string {
  const t = prompt.trim().replace(/\s+/g, ' ')
  // short/vague input -> use a template; otherwise reuse their words
  if (t.length < 6) return TEMPLATES[category]
  const first = t.charAt(0).toUpperCase() + t.slice(1)
  return first.slice(0, 120)
}

// --- public API ------------------------------------------------------------

export async function askCoach(prompt: string): Promise<CoachReply> {
  if (coachHasKey()) {
    try {
      return await askAnthropic(prompt)
    } catch {
      // graceful fallback if the API errors
      return heuristic(prompt)
    }
  }
  return heuristic(prompt)
}
