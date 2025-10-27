import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginEmployee } from '../hooks/useAuth'

export default function EmployeeLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    const res = loginEmployee(email, password)
    if (res.ok) navigate('/employee')
    else setError(res.message || 'Login failed')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Employee Login</h1>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="w-full border rounded-lg px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" className="w-full border rounded-lg px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700">Login</button>
        </form>
        <div className="mt-4 text-sm">
          <span className="text-gray-600">Admin?</span>{' '}
          <Link className="text-indigo-600 hover:underline" to="/admin-login">Go to Admin Login</Link>
        </div>
      </div>
    </div>
  )
}
