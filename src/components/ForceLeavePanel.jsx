import React, { useMemo, useState } from 'react';
import { getActiveUser, getEmployeeById, getEmployeeLeaves } from '../hooks/useAuth';
import { submitForceLeave, getEmployeeForceLeaves } from '../hooks/useForceLeave';

function dateRangeToArray(fromDate, toDate) {
if (!fromDate || !toDate) return [];
const start = new Date(fromDate);
const end = new Date(toDate);
const out = [];
const d = new Date(start);
while (d <= end) {
out.push(d.toISOString().slice(0, 10));
d.setDate(d.getDate() + 1);
}
return out;
}

function collectRejectedDates(leaves) {
const rejected = new Set();
leaves.forEach((l) => {
if (l.status === 'Declined') {
dateRangeToArray(l.fromDate, l.toDate).forEach((day) => rejected.add(day));
}
// If you later track per-day outcomes, include only rejected days here.
});
return Array.from(rejected).sort();
}

export default function ForceLeavePanel() {
const user = getActiveUser();
const employee = user?.id ? getEmployeeById(user.id) : null;
const leaves = employee ? getEmployeeLeaves(employee.id) : [];
const [selected, setSelected] = useState([]);
const [msg, setMsg] = useState('');

const rejectedDays = useMemo(() => collectRejectedDates(leaves), [leaves]);
const myForceLeaves = employee ? getEmployeeForceLeaves(employee.id) : [];
const monthlySalary = Number(employee?.salary) || 0;
const daySalary = monthlySalary > 0 ? monthlySalary / 30 : 0;
const deduction = Math.round(daySalary * selected.length);

if (!employee) {
return <div className="text-sm text-gray-600">No employee profile found.</div>;
}

if (rejectedDays.length === 0) {
return <div className="text-sm text-gray-600">No admin-rejected days to convert to Force Leave.</div>;
}

const toggle = (date) => {
setSelected((prev) => (prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]));
};

const submit = () => {
if (selected.length === 0) {
setMsg('Please select at least one day.');
return;
}
const res = submitForceLeave({
employeeId: employee.id,
employeeName: employee.name,
rejectedDates: selected,
salary: monthlySalary
});
if (res.ok) {
setSelected([]);
setMsg('Force leave submitted for admin confirmation.');
} else {
setMsg(res.message || 'Submit failed.');
}
};

return (
<div className="bg-white rounded-xl border p-4">
<h3 className="font-semibold mb-2">Forcefully Leave</h3>

  {msg && <p className="text-sm mb-2 text-indigo-700">{msg}</p>}

  <p className="text-sm text-gray-600 mb-3">
    Select from your admin-rejected days and submit as Force Leave for approval. Estimated deduction uses monthly salary ÷ 30.
  </p>

  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4">
    {rejectedDays.map((d) => (
      <button
        key={d}
        type="button"
        onClick={() => toggle(d)}
        className={`px-2 py-1 rounded border text-sm ${
          selected.includes(d) ? 'bg-amber-100 border-amber-300' : 'bg-gray-50 hover:bg-gray-100'
        }`}
        title={d}
      >
        {d}
      </button>
    ))}
  </div>

  <div className="flex items-center justify-between mb-3">
    <div className="text-sm">
      Selected: {selected.length} day(s)
      {daySalary > 0 ? ` -  Est. deduction: ₹ ${deduction}` : ''}
    </div>
    <button
      type="button"
      onClick={submit}
      className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
    >
      Submit Force Leave
    </button>
  </div>

  {myForceLeaves.length > 0 && (
    <div className="mt-4">
      <h4 className="font-medium text-sm mb-2">My Force Leave Requests</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4">Dates</th>
              <th className="py-2 pr-4">Deduction</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {myForceLeaves.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-2 pr-4">{r.dates.join(', ')}</td>
                <td className="py-2 pr-4">{r.deduction ? `₹ ${r.deduction}` : '-'}</td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      'px-2 py-1 rounded text-xs ' +
                      (r.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : r.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700')
                    }
                  >
                    {r.status}
                  </span>
                </td>
                <td className="py-2 pr-4">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
</div>


);
}