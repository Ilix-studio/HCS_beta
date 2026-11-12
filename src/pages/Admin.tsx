import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'
import { Check, ClipboardCheck, Package, Pill, Truck } from 'lucide-react'
import { upsertProduct, useAppDispatch, useAppSelector } from '../store'
import { baseCustomers, monthlyOrders, prescriptionsByMonth } from '../data/dashboardStats'
import { manufacturerName, formatDate } from '../lib/utils'
import { useToast } from '../lib/hooks'
import { OrderStatusBadge, PrescriptionStatusBadge } from '../components/StatusBadges'
import { Button, Card, DataTable, PageHeader, StatCard } from '../components/ui'

export default function Admin() {
  const orders = useAppSelector((s) => s.orders)
  const rx = useAppSelector((s) => s.prescriptions)
  const subs = useAppSelector((s) => s.subscriptions)
  const reports = useAppSelector((s) => s.reports)
  const { products, manufacturers } = useAppSelector((s) => s.catalog)
  const dispatch = useAppDispatch()
  const toast = useToast()
  const pending = products.filter((p) => p.status === 'pending')
  const chartData = monthlyOrders.map((m, i, arr) => (i === arr.length - 1 ? { ...m, orders: m.orders + orders.length } : m))
  return (
    <div>
      <PageHeader title="Admin Overview" subtitle="Platform-wide metrics (mock analytics plus live demo data)." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total customers" value={baseCustomers + 5} /><StatCard label="Total orders" value={orders.length + 1060} />
        <StatCard label="Pending prescriptions" value={rx.filter((r) => r.status === 'awaiting_verification').length} /><StatCard label="Active subscriptions" value={subs.filter((s) => s.status === 'active').length} />
        <StatCard label="Manufacturers" value={manufacturers.length} /><StatCard label="Listed medicines" value={products.filter((p) => p.status === 'active').length} />
        <StatCard label="Pending reports" value={reports.filter((r) => r.status === 'pending').length} /><StatCard label="Pending listings" value={pending.length} />
      </div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[['/fulfillment/dashboard', 'Process orders', Truck], ['/prescriptions', 'Verify prescriptions', ClipboardCheck], ['/orders', 'All orders', Package], ['/catalog', 'Browse catalog', Pill]].map(([to, label, Icon]) => {
          const I = Icon as typeof Truck
          return <Link key={String(to)} to={String(to)} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 font-medium text-navy-800 shadow-sm hover:border-teal-600"><I className="h-5 w-5 text-teal-600" />{String(label)}</Link>
        })}
      </div>
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card><h2 className="mb-3 font-semibold text-navy-900">Recent orders</h2><ul className="divide-y divide-slate-100 text-sm">{orders.slice(0, 5).map((o) => <li key={o.id} className="flex items-center justify-between py-2"><Link className="font-medium text-teal-700 hover:underline" to={`/orders/${o.id}`}>{o.id}</Link><span className="text-slate-500">{formatDate(o.placedAt)}</span><OrderStatusBadge status={o.status} /></li>)}</ul></Card>
        <Card><h2 className="mb-3 font-semibold text-navy-900">Recent prescriptions</h2><ul className="divide-y divide-slate-100 text-sm">{rx.slice(0, 5).map((r) => <li key={r.id} className="flex items-center justify-between py-2"><span>{r.doctorName}</span><span className="text-slate-500">{formatDate(r.date)}</span><PrescriptionStatusBadge status={r.status} /></li>)}</ul></Card>
      </div>
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card><h2 className="mb-3 font-semibold text-navy-900">Orders per month</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="orders" fill="var(--chart-bar)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
        <Card><h2 className="mb-3 font-semibold text-navy-900">Prescriptions processed</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={prescriptionsByMonth}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line dataKey="count" stroke="#0d9488" strokeWidth={2} /></LineChart></ResponsiveContainer></div></Card>
      </div>
      <h2 className="mb-3 font-semibold text-navy-900">Pending product listings</h2>
      <DataTable rows={pending} rowKey={(p) => p.id} empty="No listings awaiting approval." columns={[
        { key: 'b', header: 'Product', render: (p) => p.brand }, { key: 'm', header: 'Manufacturer', render: (p) => manufacturerName(p.manufacturerId, manufacturers) }, { key: 'd', header: 'Submitted', render: (p) => formatDate(p.updatedAt) },
        { key: 'a', header: '', render: (p) => <Button size="sm" variant="secondary" onClick={() => { dispatch(upsertProduct({ ...p, status: 'active' })); toast('success', `${p.brand} approved`) }}><Check className="h-3.5 w-3.5" />Approve</Button> },
      ]} />
    </div>
  )
}
