import { NavLink, useParams } from 'react-router-dom'
import { useDB, useCurrentUser } from '../lib/store'
import { circlesForUser } from '../lib/selectors'
import { HomeIcon, ChatIcon, PartnerIcon, LoadIcon, CoachIcon } from './icons'
import type { ReactNode } from 'react'

function Item({
  to,
  label,
  icon,
  end,
}: {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-bold transition-colors ${
          isActive ? 'text-coral' : 'text-muted hover:text-plum'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}

export function BottomNav() {
  const db = useDB()
  const me = useCurrentUser()
  const params = useParams()
  const circles = me ? circlesForUser(db, me.id) : []
  // Home/Chat point at the circle in the URL, else the user's first circle.
  const circleId = params.id ?? circles[0]?.id
  const homeTo = circleId ? `/c/${circleId}` : '/circles/new'
  const chatTo = circleId ? `/c/${circleId}/chat` : '/circles/new'

  return (
    <nav className="sticky bottom-0 z-30 mt-auto flex items-stretch border-t border-hairline bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <Item to={homeTo} end label="Circle" icon={<HomeIcon width={22} height={22} />} />
      <Item to="/partner" label="Backing" icon={<PartnerIcon width={22} height={22} />} />
      <Item to="/coach" label="Coach" icon={<CoachIcon width={22} height={22} />} />
      <Item to="/load" label="Load" icon={<LoadIcon width={22} height={22} />} />
      <Item to={chatTo} label="Chat" icon={<ChatIcon width={22} height={22} />} />
    </nav>
  )
}
