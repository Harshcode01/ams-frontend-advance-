// // import { useMemo, useState } from 'react'
// // import Navbar from '../components/Navbar'
// // import Sidebar from '../components/Sidebar'
// // import DashboardCard from '../components/DashboardCard'
// // import { addEmployee, getEmployees, getLeaveStats, getLeaves, setLeaveStatus } from '../hooks/useAuth'

// // export default function AdminDashboard() {
// //   const [_, force] = useState(0) // re-render trigger
// //   const stats = getLeaveStats()
// //   const employees = getEmployees()
// //   const leaves = getLeaves()

// //   const onAddEmployee = (e) => {
// //     e.preventDefault()
// //     const form = new FormData(e.currentTarget)
// //     const emp = {
// //       name: form.get('name'),
// //       email: form.get('email'),
// //       password: form.get('password'),
// //       phone: form.get('phone'),
// //       role: form.get('role'),
// //       department: form.get('department'),
// //       joinDate: form.get('joinDate'),
// //       salary: form.get('salary'),
// //       status: 'Active',
// //       address: form.get('address'),
// //     }
// //     addEmployee(emp)
// //     e.currentTarget.reset()
// //     force(x => x + 1)
// //   }

// //   const approve = (id) => { setLeaveStatus(id, 'Approved'); force(x=>x+1) }
// //   const decline = (id) => { setLeaveStatus(id, 'Declined'); force(x=>x+1) }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Navbar />
// //       <div className="max-w-6xl mx-auto mt-4 grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-4">
// //         <Sidebar />
// //         <main className="space-y-6">
// //           <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// //             <DashboardCard title="Employees" value={employees.length} />
// //             <DashboardCard title="Total Requests" value={stats.total} />
// //             <DashboardCard title="Approved" value={stats.approved} />
// //             <DashboardCard title="Pending" value={stats.pending} />
// //           </section>

// //           <section className="bg-white rounded-xl border p-4">
// //             <h2 className="font-semibold mb-3">Add Employee</h2>
// //             <form onSubmit={onAddEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //               <input name="name" placeholder="Full name" className="border rounded-lg px-3 py-2" required />
// //               <input name="email" placeholder="Email" className="border rounded-lg px-3 py-2" required />
// //               <input name="password" placeholder="Password" className="border rounded-lg px-3 py-2" required />
// //               <input name="phone" placeholder="Phone" className="border rounded-lg px-3 py-2" />
// //               <input name="role" placeholder="Role (e.g., Developer)" className="border rounded-lg px-3 py-2" />
// //               <input name="department" placeholder="Department" className="border rounded-lg px-3 py-2" />
// //               <input name="joinDate" type="date" className="border rounded-lg px-3 py-2" />
// //               <input name="salary" placeholder="Salary" className="border rounded-lg px-3 py-2" />
// //               <textarea name="address" placeholder="Address" className="md:col-span-2 border rounded-lg px-3 py-2" />
// //               <div className="md:col-span-2">
// //                 <button className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700">Save Employee</button>
// //               </div>
// //             </form>
// //           </section>

// //           <section className="bg-white rounded-xl border p-4">
// //             <h2 className="font-semibold mb-3">Employees</h2>
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full text-sm">
// //                 <thead>
// //                   <tr className="text-left border-b">
// //                     <th className="py-2 pr-4">Name</th>
// //                     <th className="py-2 pr-4">Email</th>
// //                     <th className="py-2 pr-4">Role</th>
// //                     <th className="py-2 pr-4">Department</th>
// //                     <th className="py-2 pr-4">Joined</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {employees.map(e => (
// //                     <tr key={e.id} className="border-b last:border-0">
// //                       <td className="py-2 pr-4">{e.name}</td>
// //                       <td className="py-2 pr-4">{e.email}</td>
// //                       <td className="py-2 pr-4">{e.role}</td>
// //                       <td className="py-2 pr-4">{e.department}</td>
// //                       <td className="py-2 pr-4">{e.joinDate || '-'}</td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </section>

// //           <section className="bg-white rounded-xl border p-4">
// //             <h2 className="font-semibold mb-3">Leave Requests</h2>
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full text-sm">
// //                 <thead>
// //                   <tr className="text-left border-b">
// //                     <th className="py-2 pr-4">Employee</th>
// //                     <th className="py-2 pr-4">Type</th>
// //                     <th className="py-2 pr-4">From</th>
// //                     <th className="py-2 pr-4">To</th>
// //                     <th className="py-2 pr-4">Reason</th>
// //                     <th className="py-2 pr-4">Status</th>
// //                     <th className="py-2 pr-4">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {leaves.map(l => (
// //                     <tr key={l.id} className="border-b last:border-0">
// //                       <td className="py-2 pr-4">{l.employeeName}</td>
// //                       <td className="py-2 pr-4">{l.type}</td>
// //                       <td className="py-2 pr-4">{l.fromDate}</td>
// //                       <td className="py-2 pr-4">{l.toDate}</td>
// //                       <td className="py-2 pr-4">{l.reason}</td>
// //                       <td className="py-2 pr-4">
// //                         <span className={
// //                           'px-2 py-1 rounded text-xs ' +
// //                           (l.status === 'Approved' ? 'bg-green-100 text-green-700' :
// //                            l.status === 'Declined' ? 'bg-rose-100 text-rose-700' :
// //                            'bg-amber-100 text-amber-700')
// //                         }>{l.status}</span>
// //                       </td>
// //                       <td className="py-2 pr-4 space-x-2">
// //                         <button onClick={()=>approve(l.id)} className="px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700">Approve</button>
// //                         <button onClick={()=>decline(l.id)} className="px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700">Decline</button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </section>
// //         </main>
// //       </div>
// //     </div>
// //   )
// // }




// // //Optional: src/pages/AdminDashboard.jsx (only if you want admin to approve/reject force leaves now)  **************

// // //This adds a new section that lists force leave requests and lets admin approve/reject them.***********

// // //If you don’t want admin action yet, skip this file.**********************************





// import Navbar from '../components/Navbar';
// import { useState } from 'react';
// import { getAllEmployees, getLeaveRequests } from '../hooks/useAuth';
// import { getAllForceLeaves, setForceLeaveStatus } from '../hooks/useForceLeave';

// export default function AdminDashboard() {
// const employees = getAllEmployees();
// const leaveRequests = getLeaveRequests();
// const forceLeaves = getAllForceLeaves();
// const [_, force] = useState(0);

// const onApproveForce = (id) => {
// setForceLeaveStatus(id, 'Approved');
// force((x) => x + 1);
// };

// const onRejectForce = (id) => {
// setForceLeaveStatus(id, 'Rejected');
// force((x) => x + 1);
// };

// return (
// <div className="min-h-screen bg-gray-50">
// <Navbar />


//   <div className="max-w-5xl mx-auto p-4 space-y-6">
//     {/* Existing sections like Employees, Calendar, Leave Requests remain as-is */}

//     {/* New: Force Leave Requests */}
//     <section className="bg-white rounded-xl border p-4">
//       <h2 className="font-semibold mb-3">Force Leave Requests</h2>
//       {forceLeaves.length === 0 ? (
//         <p className="text-sm text-gray-600">No force leave requests.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="text-left border-b">
//                 <th className="py-2 pr-4">Employee</th>
//                 <th className="py-2 pr-4">Dates</th>
//                 <th className="py-2 pr-4">Deduction</th>
//                 <th className="py-2 pr-4">Status</th>
//                 <th className="py-2 pr-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {forceLeaves.map((r) => (
//                 <tr key={r.id} className="border-b last:border-0">
//                   <td className="py-2 pr-4">{r.employeeName}</td>
//                   <td className="py-2 pr-4">{r.dates.join(', ')}</td>
//                   <td className="py-2 pr-4">{r.deduction ? `₹ ${r.deduction}` : '-'}</td>
//                   <td className="py-2 pr-4">
//                     <span
//                       className={
//                         'px-2 py-1 rounded text-xs ' +
//                         (r.status === 'Approved'
//                           ? 'bg-green-100 text-green-700'
//                           : r.status === 'Rejected'
//                           ? 'bg-rose-100 text-rose-700'
//                           : 'bg-amber-100 text-amber-700')
//                       }
//                     >
//                       {r.status}
//                     </span>
//                   </td>
//                   <td className="py-2 pr-4 space-x-2">
//                     <button
//                       onClick={() => onApproveForce(r.id)}
//                       className="px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => onRejectForce(r.id)}
//                       className="px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700"
//                     >
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </section>
//   </div>
// </div>

// );
// }


//*****************************new code ***********************




// import React, { useEffect, useMemo, useState } from 'react';
// import Navbar from '../components/Navbar';

// export default function AdminDashboard() {
// // LocalStorage readers (frontend-only)
// const readLS = (key, fallback) => {
// try {
// const raw = localStorage.getItem(key);
// return raw ? JSON.parse(raw) : fallback;
// } catch {
// return fallback;
// }
// };

// // Adjust keys if your app uses different names
// const employeesLS = readLS('employees', []);
// const leavesLS = readLS('leaves', []); // if your key differs, update here
// const attendanceLS = readLS('attendanceDaily', []); // optional: if you track daily present

// const todayISO = new Date().toISOString().slice(0, 10);
// const dateNDaysAgo = (n) => {
// const d = new Date();
// d.setDate(d.getDate() - n + 1);
// return d.toISOString().slice(0, 10);
// };

// // Analytics state
// const [range, setRange] = useState(30);
// const [kpis, setKpis] = useState({
// totalEmployees: 0,
// todaysPresent: 0,
// todaysLeaves: 0,
// pendingRequests: 0
// });
// const [chartData, setChartData] = useState([]);

// useEffect(() => {
// // KPIs
// const totalEmployees = employeesLS.length;


// const todaysLeaveEntries = leavesLS.filter((l) => l.fromDate <= todayISO && l.toDate >= todayISO);
// const todaysLeaves = todaysLeaveEntries.length;

// const pendingRequests = leavesLS.filter((l) => l.status === 'Pending').length;

// // Present heuristic: use attendanceDaily if available, else approximate
// const attendanceToday = attendanceLS.find((d) => d.date === todayISO);
// const todaysPresent = attendanceToday
//   ? attendanceToday.present
//   : Math.max(totalEmployees - todaysLeaves, 0);

// setKpis({ totalEmployees, todaysPresent, todaysLeaves, pendingRequests });

// // Chart series for last N days
// const startISO = dateNDaysAgo(range);
// const points = [];
// const cursor = new Date(startISO);
// const end = new Date(todayISO);

// while (cursor <= end) {
//   const iso = cursor.toISOString().slice(0, 10);
//   const leavesCount = leavesLS.filter((l) => l.fromDate <= iso && l.toDate >= iso).length;
//   const presentCount = (() => {
//     const rec = attendanceLS.find((d) => d.date === iso);
//     return rec ? rec.present : Math.max(totalEmployees - leavesCount, 0);
//   })();
//   points.push({ date: iso, present: presentCount, leaves: leavesCount });
//   cursor.setDate(cursor.getDate() + 1);
// }

// setChartData(points);

// }, [range, employeesLS.length, leavesLS.length, attendanceLS.length]);

// return (
// <div className="min-h-screen bg-gray-50">
// <Navbar />


//   <div className="max-w-6xl mx-auto p-4 space-y-6">
//     {/* Analytics (new) */}
//     <section className="bg-white rounded-xl border p-4">
//       <div className="flex items-center justify-between">
//         <h2 className="font-semibold">Analytics</h2>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setRange(7)}
//             className={`px-3 py-1.5 rounded border text-sm ${range === 7 ? 'bg-gray-100' : ''}`}
//           >
//             7d
//           </button>
//           <button
//             onClick={() => setRange(14)}
//             className={`px-3 py-1.5 rounded border text-sm ${range === 14 ? 'bg-gray-100' : ''}`}
//           >
//             14d
//           </button>
//           <button
//             onClick={() => setRange(30)}
//             className={`px-3 py-1.5 rounded border text-sm ${range === 30 ? 'bg-gray-100' : ''}`}
//           >
//             30d
//           </button>
//         </div>
//       </div>

//       {/* KPI tiles */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
//         <KpiTile label="Total Employees" value={kpis.totalEmployees} hint="+/- 7d trend" />
//         <KpiTile label="Today’s Present" value={kpis.todaysPresent} hint="% of expected" />
//         <KpiTile label="Today’s Leaves" value={kpis.todaysLeaves} hint="incl. pending" />
//         <KpiTile label="Pending Requests" value={kpis.pendingRequests} hint="aging >48h" />
//       </div>

//       {/* Simple bar stack chart (placeholder, no chart lib) */}
//       <div className="mt-5">
//         <ChartAttendanceVsLeave data={chartData} />
//       </div>
//     </section>

//     {/* Your existing sections below remain unchanged (Calendar, Leave Requests, etc.) */}
//     {/* Example placeholders — keep your current content as-is */}
//     <section className="bg-white rounded-xl border p-4">
//       <h2 className="font-semibold mb-3">Calendar</h2>
//       <p className="text-sm text-gray-600">[Your existing calendar section remains here]</p>
//     </section>

//     <section className="bg-white rounded-xl border p-4">
//       <h2 className="font-semibold mb-3">Leave Requests</h2>
//       <p className="text-sm text-gray-600">[Your existing leave requests section remains here]</p>
//     </section>
//   </div>
// </div>


// );
// }

// // Small local components to avoid extra files
// function KpiTile({ label, value, hint }) {
// return (
// <div className="border rounded-lg p-3">
// <div className="text-xs text-gray-500">{label}</div>
// <div className="text-2xl font-semibold">{value ?? '-'}</div>
// <div className="text-xs text-gray-400">{hint}</div>
// </div>
// );
// }

// function ChartAttendanceVsLeave({ data }) {
// return (
// <div className="border rounded-lg p-3">
// <div className="flex items-center justify-between mb-2">
// <h3 className="font-medium">Attendance vs Leaves</h3>
// <div className="text-xs text-gray-500">Last {data.length} days</div>
// </div>


//   {data.length === 0 ? (
//     <div className="text-sm text-gray-500">No data</div>
//   ) : (
//     <div
//       className="h-40 grid gap-1 overflow-x-auto"
//       style={{ gridTemplateColumns: `repeat(${data.length}, minmax(4px, 1fr))` }}
//     >
//       {data.map((d) => {
//         const total = Math.max(d.present + d.leaves, 1);
//         const presentPct = Math.round((d.present / total) * 100);
//         const leavePct = 100 - presentPct;
//         return (
//           <div key={d.date} className="flex flex-col justify-end">
//             <div
//               className="bg-rose-400"
//               style={{ height: `${leavePct}%` }}
//               title={`${d.date} -  Leaves: ${d.leaves}`}
//             />
//             <div
//               className="bg-indigo-500"
//               style={{ height: `${presentPct}%` }}
//               title={`${d.date} -  Present: ${d.present}`}
//             />
//           </div>
//         );
//       })}
//     </div>
//   )}

//   <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
//     <span className="inline-flex items-center gap-1">
//       <span className="w-2 h-2 bg-indigo-500 inline-block rounded-sm" /> Present
//     </span>
//     <span className="inline-flex items-center gap-1">
//       <span className="w-2 h-2 bg-rose-400 inline-block rounded-sm" /> Leaves
//     </span>
//   </div>
// </div>

// );
// }


// //**************************************new code********************************

