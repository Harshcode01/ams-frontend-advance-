import { Link, useNavigate } from 'react-router-dom'
import { getActiveUser, logout, getLeaveStats } from '../hooks/useAuth'

export default function Navbar() {
  const navigate = useNavigate()
  const user = getActiveUser()
  const stats = getLeaveStats()

  const onLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold">AMS</Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/employee-login" className="text-gray-700 hover:text-indigo-600">Employee Login</Link>
          <span className="text-gray-500">Requests: {stats.total} • Approved: {stats.approved} • Pending: {stats.pending} • Declined: {stats.declined}</span>
          {user && <button onClick={onLogout} className="px-3 py-1.5 bg-gray-100 rounded-md hover:bg-gray-200">Logout</button>}
        </div>
      </div>
    </nav>
  )
}
