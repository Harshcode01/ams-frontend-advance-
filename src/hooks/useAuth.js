import { storage } from '../utils/storage'

const ADMIN_CRED = { email: 'admin@ams.com', password: 'admin123' }
const KEY_ACTIVE = 'ams_active_user'
const KEY_EMPLOYEES = 'ams_employees'
const KEY_LEAVES = 'ams_leave_requests'

export function getActiveUser() {
  return storage.get(KEY_ACTIVE, null)
}

export function loginAdmin(email, password) {
  if (email === ADMIN_CRED.email && password === ADMIN_CRED.password) {
    storage.set(KEY_ACTIVE, { type: 'admin', email })
    return { ok: true }
  }
  return { ok: false, message: 'Invalid admin credentials' }
}

export function logout() {
  storage.set(KEY_ACTIVE, null)
}

export function getEmployees() {
  return storage.get(KEY_EMPLOYEES, [])
}

export function addEmployee(emp) {
  const list = getEmployees()
  const id = Date.now().toString()
  const newEmp = { id, ...emp }
  storage.set(KEY_EMPLOYEES, [newEmp, ...list])
  return newEmp
}

export function findEmployeeByLogin(email, password) {
  const list = getEmployees()
  return list.find(e => e.email === email && e.password === password) || null
}

export function loginEmployee(email, password) {
  const emp = findEmployeeByLogin(email, password)
  if (emp) {
    storage.set(KEY_ACTIVE, { type: 'employee', id: emp.id })
    return { ok: true, emp }
  }
  return { ok: false, message: 'Invalid employee credentials' }
}

export function getEmployeeById(id) {
  return getEmployees().find(e => e.id === id) || null
}

export function getLeaves() {
  return storage.get(KEY_LEAVES, [])
}

export function submitLeave(leave) {
  const id = Date.now().toString()
  const newLeave = { id, status: 'Pending', createdAt: new Date().toISOString(), ...leave }
  const list = getLeaves()
  storage.set(KEY_LEAVES, [newLeave, ...list])
  return newLeave
}

export function setLeaveStatus(id, status) {
  const list = getLeaves().map(l => l.id === id ? { ...l, status } : l)
  storage.set(KEY_LEAVES, list)
}

export function getEmployeeLeaves(employeeId) {
  return getLeaves().filter(l => l.employeeId === employeeId)
}

export function getLeaveStats() {
  const list = getLeaves()
  const total = list.length
  const approved = list.filter(l => l.status === 'Approved').length
  const pending = list.filter(l => l.status === 'Pending').length
  const declined = list.filter(l => l.status === 'Declined').length
  return { total, approved, pending, declined }
}
