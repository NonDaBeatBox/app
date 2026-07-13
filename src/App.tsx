import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useCurrentUser, useDB } from './lib/store'
import { circlesForUser } from './lib/selectors'

import Login from './screens/Login'
import NewCircle from './screens/NewCircle'
import JoinCircle from './screens/JoinCircle'
import CircleHome from './screens/CircleHome'
import NewGoal from './screens/NewGoal'
import Checkin from './screens/Checkin'
import Partner from './screens/Partner'
import Load from './screens/Load'
import Chat from './screens/Chat'
import Coach from './screens/Coach'
import Pricing from './screens/Pricing'
import Settings from './screens/Settings'

/** Gate protected routes behind sign-in. */
function RequireAuth({ children }: { children: ReactNode }) {
  const me = useCurrentUser()
  const location = useLocation()
  if (!me) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

/** Land signed-in users on their circle (or the create flow if they have none). */
function Root() {
  const me = useCurrentUser()
  const db = useDB()
  if (!me) return <Navigate to="/login" replace />
  const circles = circlesForUser(db, me.id)
  return <Navigate to={circles[0] ? `/c/${circles[0].id}` : '/circles/new'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pricing" element={<Pricing />} />

      <Route
        path="/circles/new"
        element={
          <RequireAuth>
            <NewCircle />
          </RequireAuth>
        }
      />
      <Route
        path="/join/:id"
        element={
          <RequireAuth>
            <JoinCircle />
          </RequireAuth>
        }
      />
      <Route
        path="/c/:id"
        element={
          <RequireAuth>
            <CircleHome />
          </RequireAuth>
        }
      />
      <Route
        path="/c/:id/goal/new"
        element={
          <RequireAuth>
            <NewGoal />
          </RequireAuth>
        }
      />
      <Route
        path="/c/:id/chat"
        element={
          <RequireAuth>
            <Chat />
          </RequireAuth>
        }
      />
      <Route
        path="/checkin/:goalId"
        element={
          <RequireAuth>
            <Checkin />
          </RequireAuth>
        }
      />
      <Route
        path="/partner"
        element={
          <RequireAuth>
            <Partner />
          </RequireAuth>
        }
      />
      <Route
        path="/load"
        element={
          <RequireAuth>
            <Load />
          </RequireAuth>
        }
      />
      <Route
        path="/coach"
        element={
          <RequireAuth>
            <Coach />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
