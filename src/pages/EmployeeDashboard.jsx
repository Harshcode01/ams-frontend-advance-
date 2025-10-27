import Navbar from '../components/Navbar'
import { getActiveUser, getEmployeeById, getEmployeeLeaves, submitLeave } from '../hooks/useAuth'
import { useState } from 'react'

export default function EmployeeDashboard() {
  const user = getActiveUser()
  const employee = user?.id ? getEmployeeById(user.id) : null
  const [_, force] = useState(0)

  const onSubmit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    submitLeave({
      employeeId: employee.id,
      employeeName: employee.name,
      type: f.get('type'),
      fromDate: f.get('fromDate'),
      toDate: f.get('toDate'),
      reason: f.get('reason')
    })
    e.currentTarget.reset()
    force(x=>x+1)
  }

  const leaves = employee ? getEmployeeLeaves(employee.id) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-semibold mb-3">My Profile</h2>
          {employee ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Name:</span> {employee.name}</div>
              <div><span className="text-gray-500">Email:</span> {employee.email}</div>
              <div><span className="text-gray-500">Phone:</span> {employee.phone || '-'}</div>
              <div><span className="text-gray-500">Role:</span> {employee.role || '-'}</div>
              <div><span className="text-gray-500">Department:</span> {employee.department || '-'}</div>
              <div><span className="text-gray-500">Joined:</span> {employee.joinDate || '-'}</div>
              <div className="md:col-span-2"><span className="text-gray-500">Address:</span> {employee.address || '-'}</div>
            </div>
          ) : <p className="text-sm text-gray-600">No profile found.</p>}
        </section>

        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-semibold mb-3">Request Leave</h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select name="type" className="border rounded-lg px-3 py-2">
              <option>Casual</option>
              <option>Sick</option>
              <option>Unpaid</option>
            </select>
            <input type="date" name="fromDate" className="border rounded-lg px-3 py-2" required />
            <input type="date" name="toDate" className="border rounded-lg px-3 py-2" required />
            <input name="reason" placeholder="Reason" className="md:col-span-2 border rounded-lg px-3 py-2" required />
            <div className="md:col-span-2">
              <button className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700">Submit</button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-semibold mb-3">My Leave Requests</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">From</th>
                  <th className="py-2 pr-4">To</th>
                  <th className="py-2 pr-4">Reason</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(l => (
                  <tr key={l.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{l.type}</td>
                    <td className="py-2 pr-4">{l.fromDate}</td>
                    <td className="py-2 pr-4">{l.toDate}</td>
                    <td className="py-2 pr-4">{l.reason}</td>
                    <td className="py-2 pr-4">
                      <span className={
                        'px-2 py-1 rounded text-xs ' +
                        (l.status === 'Approved' ? 'bg-green-100 text-green-700' :
                         l.status === 'Declined' ? 'bg-rose-100 text-rose-700' :
                         'bg-amber-100 text-amber-700')
                      }>{l.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}



//********************new code here ************************************************


import Navbar from '../components/Navbar';
import { getActiveUser, getEmployeeById, getEmployeeLeaves, submitLeave } from '../hooks/useAuth';
import { useState } from 'react';
import ForceLeavePanel from '../components/ForceLeavePanel';

export default function EmployeeDashboard() {
const user = getActiveUser();
const employee = user?.id ? getEmployeeById(user.id) : null;
const [_, force] = useState(0);

const onSubmit = (e) => {
e.preventDefault();
const f = new FormData(e.currentTarget);
submitLeave({
employeeId: employee.id,
employeeName: employee.name,
type: f.get('type'),
fromDate: f.get('fromDate'),
toDate: f.get('toDate'),
reason: f.get('reason')
});
e.currentTarget.reset();
force((x) => x + 1);
};

const leaves = employee ? getEmployeeLeaves(employee.id) : [];

return (
<div className="min-h-screen bg-gray-50">
<Navbar />
<div className="max-w-4xl mx-auto p-4 space-y-6">
<section className="bg-white rounded-xl border p-4">
<h2 className="font-semibold mb-3">My Profile</h2>
{employee ? (
<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
<div>
<span className="text-gray-500">Name:</span> {employee.name}
</div>
<div>
<span className="text-gray-500">Email:</span> {employee.email}
</div>
<div>
<span className="text-gray-500">Phone:</span> {employee.phone || '-'}
</div>
<div>
<span className="text-gray-500">Role:</span> {employee.role || '-'}
</div>
<div>
<span className="text-gray-500">Department:</span> {employee.department || '-'}
</div>
<div>
<span className="text-gray-500">Joined:</span> {employee.joinDate || '-'}
</div>
<div className="md:col-span-2">
<span className="text-gray-500">Address:</span> {employee.address || '-'}
</div>
</div>
) : (
<p className="text-sm text-gray-600">No profile found.</p>
)}
</section>

    <section className="bg-white rounded-xl border p-4">
      <h2 className="font-semibold mb-3">Request Leave</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select name="type" className="border rounded-lg px-3 py-2">
          <option>Casual</option>
          <option>Sick</option>
          <option>Unpaid</option>
        </select>
        <input type="date" name="fromDate" className="border rounded-lg px-3 py-2" required />
        <input type="date" name="toDate" className="border rounded-lg px-3 py-2" required />
        <input
          name="reason"
          placeholder="Reason"
          className="md:col-span-2 border rounded-lg px-3 py-2"
          required
        />
        <div className="md:col-span-2">
          <button className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700">
            Submit
          </button>
        </div>
      </form>
    </section>

    <section className="bg-white rounded-xl border p-4">
      <h2 className="font-semibold mb-3">My Leave Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">From</th>
              <th className="py-2 pr-4">To</th>
              <th className="py-2 pr-4">Reason</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l.id} className="border-b last:border-0">
                <td className="py-2 pr-4">{l.type}</td>
                <td className="py-2 pr-4">{l.fromDate}</td>
                <td className="py-2 pr-4">{l.toDate}</td>
                <td className="py-2 pr-4">{l.reason}</td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      'px-2 py-1 rounded text-xs ' +
                      (l.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : l.status === 'Declined'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700')
                    }
                  >
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    {/* New: Forcefully Leave Panel (employee-side) */}
    <section className="bg-white rounded-xl border p-4">
      <ForceLeavePanel />
    </section>
  </div>
</div>

);
}