import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CheckIcon, BellIcon, XIcon } from './icons'

type ToastKind = 'success' | 'error' | 'info'
interface Toast {
  id: number
  kind: ToastKind
  message: string
}

interface ToastAPI {
  success: (m: string) => void
  error: (m: string) => void
  info: (m: string) => void
}

const ToastContext = createContext<ToastAPI | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const seq = useRef(0)

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = ++seq.current
    setToasts((t) => [...t, { id, kind, message }])
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3200)
  }, [])

  const api: ToastAPI = {
    success: (m) => push('success', m),
    error: (m) => push('error', m),
    info: (m) => push('info', m),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto flex max-w-[440px] flex-col items-center gap-2 px-4 pt-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full animate-toast-in items-center gap-3 rounded-2xl border border-hairline bg-surface px-4 py-3 shadow-lift"
            role="status"
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${
                t.kind === 'success'
                  ? 'bg-green'
                  : t.kind === 'error'
                    ? 'bg-coral'
                    : 'bg-plum'
              }`}
            >
              {t.kind === 'error' ? (
                <XIcon width={15} height={15} />
              ) : t.kind === 'success' ? (
                <CheckIcon width={15} height={15} />
              ) : (
                <BellIcon width={15} height={15} />
              )}
            </span>
            <p className="text-sm font-semibold text-ink">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastAPI {
  const api = useContext(ToastContext)
  if (!api) throw new Error('useToast must be used within <ToastProvider>')
  return api
}
