import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const link = 'block px-3 py-2 rounded-md hover:bg-gray-100'
  const active = ({ isActive }) => isActive ? link + ' bg-gray-100 font-medium' : link
  return (
    <aside className="w-56 border-r bg-white p-3">
      <nav className="space-y-1 text-sm">
        <NavLink className={active} to="/admin">Overview</NavLink>
        <NavLink className={active} to="/admin?tab=employees">Employees</NavLink>
        <NavLink className={active} to="/admin?tab=leaves">Leaves</NavLink>
      </nav>
    </aside>
  )
}
