// Stable-ish id generator. Uses crypto.randomUUID when available (browser),
// falls back to a monotonic counter so it also works in plain test envs.
let counter = 0

export function newId(prefix = 'id'): string {
  const g = globalThis as { crypto?: { randomUUID?: () => string } }
  if (g.crypto?.randomUUID) return `${prefix}_${g.crypto.randomUUID()}`
  counter += 1
  return `${prefix}_${counter.toString(36)}_${counter}`
}
