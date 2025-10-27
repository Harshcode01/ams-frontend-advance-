export default function DashboardCard({ title, value, className = '' }) {
  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm ${className}`}>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  )
}
