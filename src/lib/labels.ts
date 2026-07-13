import type {
  GoalCategory,
  ProofMethod,
  Frequency,
  Consequence,
} from '../types'

export const CATEGORY_META: Record<
  GoalCategory,
  { label: string; emoji: string; defaultProof: ProofMethod }
> = {
  sat: { label: 'SAT', emoji: '📈', defaultProof: 'screenshot' },
  school: { label: 'School', emoji: '📚', defaultProof: 'photo' },
  skill: { label: 'Skill', emoji: '🛠️', defaultProof: 'video' },
  mindset: { label: 'Mindset', emoji: '🧠', defaultProof: 'honest_checkin' },
  character: { label: 'Character', emoji: '🌱', defaultProof: 'honest_checkin' },
  other: { label: 'Other', emoji: '✨', defaultProof: 'screenshot' },
}

export const CATEGORY_ORDER: GoalCategory[] = [
  'sat',
  'school',
  'skill',
  'mindset',
  'character',
  'other',
]

export const PROOF_META: Record<
  ProofMethod,
  { label: string; emoji: string; hint: string }
> = {
  screenshot: { label: 'Screenshot', emoji: '🖼️', hint: 'Upload a screenshot' },
  photo: { label: 'Photo', emoji: '📷', hint: 'Snap a photo of the work' },
  video: { label: 'Video', emoji: '🎥', hint: 'A short clip, ≤ 60s' },
  voice_note: { label: 'Voice note', emoji: '🎙️', hint: 'Say it out loud' },
  focus_session: { label: 'Focus session', emoji: '⏱️', hint: 'A timed focus block' },
  link: { label: 'Link', emoji: '🔗', hint: 'Paste a URL as proof' },
  honest_checkin: { label: 'Honest check-in', emoji: '🤝', hint: 'Just be honest' },
}

export const PROOF_ORDER: ProofMethod[] = [
  'screenshot',
  'photo',
  'video',
  'voice_note',
  'focus_session',
  'link',
  'honest_checkin',
]

export const FREQ_META: Record<Frequency, { label: string; sub: string }> = {
  daily: { label: 'Every day', sub: '7 days a week' },
  weekdays: { label: 'Weekdays', sub: 'Mon–Fri' },
}

export const CONSEQUENCE_META: Record<
  Consequence,
  { label: string; help: string; emoji: string }
> = {
  meter_hit: {
    label: 'Pulse takes a hit',
    help: 'A miss knocks 10 off the circle pulse for 24h.',
    emoji: '💔',
  },
  streak_break: {
    label: 'Streak resets',
    help: 'Miss a day and your streak goes back to zero.',
    emoji: '🔥',
  },
  forfeit: {
    label: 'A small forfeit',
    help: 'You owe the circle something small and kind.',
    emoji: '🎭',
  },
}
