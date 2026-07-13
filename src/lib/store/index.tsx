import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import type { DB, User } from '../../types'
import { supabase, isDemo } from '../supabase'
import { MockStore } from './mockStore'
import { SupabaseStore } from './supabaseStore'
import type { Store } from './types'
import { userById } from '../selectors'

export type { Store } from './types'

export function createStore(): Store {
  if (supabase) return new SupabaseStore(supabase)
  return new MockStore()
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const ref = useRef<Store | null>(null)
  if (!ref.current) ref.current = createStore()
  const store = ref.current

  const [ready, setReady] = useState(isDemo)

  useEffect(() => {
    let alive = true
    store.ready().then(async () => {
      if (!alive) return
      // Miss-handling job: mark yesterday's missed on every app load.
      try {
        await store.runMissHandling()
      } catch {
        /* best-effort */
      }
      setReady(true)
    })
    return () => {
      alive = false
    }
  }, [store])

  if (!ready) {
    return (
      <div className="app-frame items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted">
          <div className="h-10 w-10 animate-breathe rounded-full border-4 border-hairline border-t-coral" />
          <p className="font-display text-sm">warming up your circle…</p>
        </div>
      </div>
    )
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const s = useContext(StoreContext)
  if (!s) throw new Error('useStore must be used inside <StoreProvider>')
  return s
}

/** Subscribe to the whole DB snapshot; re-renders on any mutation. */
export function useDB(): DB {
  const store = useStore()
  return useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.getSnapshot(),
  )
}

export function useCurrentUser(): User | undefined {
  const db = useDB()
  return userById(db, db.currentUserId)
}

export function useIsDemo(): boolean {
  return useStore().isDemo
}

/** Convenience: a stable `today` for the current render pass. */
export function useToday(): string {
  // recomputed per mount; fine for a session-scoped app.
  return useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])
}
