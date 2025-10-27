import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from '../pages/AdminLogin.jsx'
import AdminDashboard from '../pages/AdminDashboard.jsx'
import EmployeeLogin from '../pages/EmployeeLogin.jsx'
import EmployeeDashboard from '../pages/EmployeeDashboard.jsx'
import { getActiveUser } from '../hooks/useAuth.js'

function AdminGuard({ children }) {
  const user = getActiveUser()
  if (user?.type === 'admin') return children
  return <Navigate to="/admin-login" replace />
}

function EmployeeGuard({ children }) {
  const user = getActiveUser()
  if (user?.type === 'employee') return children
  return <Navigate to="/employee-login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin-login" replace />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
      <Route path="/employee-login" element={<EmployeeLogin />} />
      <Route path="/employee" element={<EmployeeGuard><EmployeeDashboard /></EmployeeGuard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
