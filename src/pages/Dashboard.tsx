import { Link } from 'react-router-dom'
import { FileText, FlaskConical, Package, Pill, Repeat, Upload } from 'lucide-react'
import { useAppSelector } from '../store'
import { categories } from '../data/categories'
import { patients } from '../data/patients'
import { formatDate } from '../lib/utils'
import { OrderStatusBadge, PrescriptionStatusBadge } from '../components/StatusBadges'
import { NearbyDoctors } from '../components/NearbyDoctors'
import { Card, PageHeader, StatCard } from '../components/ui'

export default function Dashboard() {
  const { patientId } = useAppSelector((s) => s.session)
  const patient = patients.find((p) => p.id === patientId)
  const orders = useAppSelector((s) => s.orders).filter((o) => o.customerId === patientId)
  const rx = useAppSelector((s) => s.prescriptions).filter((p) => p.patientId === patientId)
  const subs = useAppSelector((s) => s.subscriptions).filter((s) => s.customerId === patientId && s.status === 'active')
  const reports = useAppSelector((s) => s.reports).filter((r) => r.patientId === patientId)
  const quick = [
    { to: '/catalog', label: 'Order medicines', icon: Pill }, { to: '/prescriptions/upload', label: 'Upload prescription', icon: Upload },
    { to: '/subscriptions', label: 'Manage subscriptions', icon: Repeat }, { to: '/reports', label: 'View lab reports', icon: FlaskConical },
  ]
  return (
    <div>
      <PageHeader title={`Welcome back, ${patient?.name.split(' ')[0]}`} subtitle="Your medicines, prescriptions and reports in one place." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Orders" value={orders.length} icon={<Package className="h-5 w-5" />} />
        <StatCard label="Prescriptions" value={rx.length} icon={<FileText className="h-5 w-5" />} hint={`${rx.filter((r) => r.status === 'awaiting_verification').length} awaiting verification`} />
        <StatCard label="Active subscriptions" value={subs.length} icon={<Repeat className="h-5 w-5" />} hint={subs[0] ? `Next: ${formatDate(subs[0].nextDispatch)}` : undefined} />
        <StatCard label="Lab reports" value={reports.filter((r) => r.status === 'published').length} icon={<FlaskConical className="h-5 w-5" />} hint={`${reports.filter((r) => r.status === 'pending').length} pending`} />
      </div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quick.map((q) => <Link key={q.to} to={q.to} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 font-medium text-navy-800 shadow-sm hover:border-teal-600"><q.icon className="h-5 w-5 text-teal-600" />{q.label}</Link>)}
      </div>
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card><h2 className="mb-3 font-semibold text-navy-900">Recent orders</h2>
          {orders.length === 0 ? <p className="text-sm text-slate-500">No orders yet.</p> : <ul className="divide-y divide-slate-100 text-sm">{orders.slice(0, 4).map((o) => <li key={o.id} className="flex items-center justify-between py-2"><Link className="font-medium text-teal-700 hover:underline" to={`/orders/${o.id}`}>{o.id}</Link><span className="text-slate-500">{formatDate(o.placedAt)}</span><OrderStatusBadge status={o.status} /></li>)}</ul>}</Card>
        <Card><h2 className="mb-3 font-semibold text-navy-900">Recent prescriptions</h2>
          {rx.length === 0 ? <p className="text-sm text-slate-500">No prescriptions yet.</p> : <ul className="divide-y divide-slate-100 text-sm">{rx.slice(0, 4).map((r) => <li key={r.id} className="flex items-center justify-between py-2"><span>{r.doctorName}</span><span className="text-slate-500">{formatDate(r.date)}</span><PrescriptionStatusBadge status={r.status} /></li>)}</ul>}</Card>
      </div>
      <div className="mb-6"><NearbyDoctors showFilter={false} limit={4} /></div>
      <Card>
        <h2 className="mb-3 font-semibold text-navy-900">Shop medical supplies</h2>
        <div className="flex flex-wrap gap-2">{categories.filter((c) => c.group === 'supply').map((c) => <Link key={c.id} to={`/catalog?category=${c.id}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm hover:border-teal-600 hover:text-teal-700">{c.name}</Link>)}</div>
      </Card>
    </div>
  )
}
