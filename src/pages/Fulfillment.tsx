import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Package, Send, Truck, Upload } from 'lucide-react'
import { addNotification, addReport, publishReport, setOrderStatus, setPrescriptionStatus, setTracking, togglePacked, useAppDispatch, useAppSelector } from '../store'
import { diagnosticCenters, reportCategories } from '../data/labReports'
import { patients } from '../data/patients'
import { DEMO_TODAY, formatCurrency, formatDate, readFileAsDataUrl, uid } from '../lib/utils'
import { useProducts, useToast } from '../lib/hooks'
import type { Order } from '../types'
import { OrderTimeline } from './Orders'
import { OrderStatusBadge, PrescriptionStatusBadge } from '../components/StatusBadges'
import { Badge, Button, Card, DataTable, Field, Input, Modal, PageHeader, Select, StatCard, Tabs, Textarea } from '../components/ui'
import Prescriptions from './Prescriptions'

function OrderModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const order = useAppSelector((s) => s.orders).find((o) => o.id === orderId) as Order
  const rx = useAppSelector((s) => s.prescriptions).find((p) => p.id === order.prescriptionId)
  const products = useProducts()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [tracking, setTrack] = useState(order.tracking ?? '')
  const allPacked = order.items.every((i) => order.packedItems.includes(i.productId))
  const rxBlocked = !!rx && rx.status !== 'verified'
  const notify = (title: string, message: string) => dispatch(addNotification({ id: uid('n'), userId: order.customerId, type: 'order', title, message, date: DEMO_TODAY, read: false, link: `/orders/${order.id}` }))
  const move = (status: Order['status'], msg: string) => { dispatch(setOrderStatus({ id: order.id, status })); notify(`Order ${msg}`, `Your order ${order.id} is now ${msg}.`); toast('success', `Order ${msg}`) }
  return (
    <Modal open onClose={onClose} title={`Order ${order.id}`} wide>
      <div className="grid gap-5 md:grid-cols-[1fr_240px]">
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap items-center gap-2"><OrderStatusBadge status={order.status} /><span className="text-slate-500">{patients.find((p) => p.id === order.customerId)?.name} · {formatDate(order.placedAt)} · {formatCurrency(order.total)}</span></div>
          <p><strong>Ship to:</strong> {order.address} ({order.deliveryMethod})</p>
          {rx && (
            <div className={`rounded-lg border p-3 ${rxBlocked ? 'border-amber-300 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
              <div className="flex items-center justify-between"><strong>Prescription {rx.id}</strong><PrescriptionStatusBadge status={rx.status} /></div>
              {rxBlocked && rx.status === 'awaiting_verification' && <div className="mt-2 flex gap-2"><Button size="sm" variant="secondary" onClick={() => { dispatch(setPrescriptionStatus({ id: rx.id, status: 'verified' })); dispatch(setOrderStatus({ id: order.id, status: 'placed' })); toast('success', 'Prescription verified') }}>Verify prescription</Button>
                <Button size="sm" variant="danger" onClick={() => { dispatch(setPrescriptionStatus({ id: rx.id, status: 'rejected', reason: 'Illegible or invalid' })); dispatch(setOrderStatus({ id: order.id, status: 'cancelled' })); toast('info', 'Prescription rejected; order cancelled') }}>Reject</Button></div>}
              {rxBlocked && rx.status !== 'awaiting_verification' && <p className="mt-1 text-xs">Order cannot be packed until the prescription is verified.</p>}
            </div>
          )}
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">{order.items.map((i) => (
            <li key={i.productId} className="flex items-center gap-3 p-3"><input type="checkbox" aria-label={`Packed ${i.productId}`} disabled={order.status === 'dispatched' || order.status === 'delivered' || order.status === 'cancelled'} checked={order.packedItems.includes(i.productId)} onChange={() => dispatch(togglePacked({ id: order.id, productId: i.productId }))} />
              <span className="flex-1">{products.find((p) => p.id === i.productId)?.brand} × {i.quantity}</span><Badge tone={order.packedItems.includes(i.productId) ? 'green' : 'gray'}>{order.packedItems.includes(i.productId) ? 'Packed' : 'To pack'}</Badge></li>))}</ul>
          <div className="flex flex-wrap items-end gap-2">
            <Field label="Tracking number"><Input value={tracking} onChange={(e) => setTrack(e.target.value)} placeholder="e.g. TRK123456" /></Field>
            <Button variant="outline" onClick={() => { dispatch(setTracking({ id: order.id, tracking })); toast('success', 'Tracking updated') }}>Save tracking</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled={order.status !== 'placed' || !allPacked || rxBlocked} onClick={() => move('packed', 'packed')}><Package className="h-4 w-4" />Mark order packed</Button>
            <Button variant="secondary" disabled={order.status !== 'packed'} onClick={() => move('dispatched', 'dispatched')}><Truck className="h-4 w-4" />Dispatch</Button>
            <Button variant="outline" disabled={order.status !== 'dispatched'} onClick={() => move('delivered', 'delivered')}>Mark delivered</Button>
          </div>
        </div>
        <div><h3 className="mb-3 font-semibold text-navy-900">Timeline</h3><OrderTimeline order={order} /></div>
      </div>
    </Modal>
  )
}

const reportSchema = z.object({
  patientId: z.string().min(1, 'Select a patient'),
  centerId: z.string().min(1),
  category: z.string().min(1, 'Select a category'),
  title: z.string().min(3, 'Enter a report title'),
  date: z.string().min(1, 'Select the report date'),
  summary: z.string().min(5, 'Add a short summary'),
})
type ReportValues = z.infer<typeof reportSchema>

function ReportUpload() {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const reports = useAppSelector((s) => s.reports)
  const [file, setFile] = useState<File | null>(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReportValues>({ resolver: zodResolver(reportSchema), defaultValues: { centerId: 'dc1', date: DEMO_TODAY, patientId: '', category: '' } })
  const submit = async (v: ReportValues) => {
    if (!file) return toast('error', 'Attach a PDF or image report file.')
    if (!/^(application\/pdf|image\/)/.test(file.type)) return toast('error', 'Only PDF or image files are accepted.')
    const fileUrl = file.size < 400_000 ? await readFileAsDataUrl(file) : undefined
    const id = uid('lr')
    dispatch(addReport({ id, ...v, status: 'published', kind: file.type === 'application/pdf' ? 'pdf' : 'image', fileUrl }))
    dispatch(addNotification({ id: uid('n'), userId: v.patientId, type: 'report', title: 'Report published', message: `Your ${v.title} report is ready to view.`, date: DEMO_TODAY, read: false, link: `/reports/${id}` }))
    toast('success', 'Report published to patient portal'); reset(); setFile(null)
  }
  const pending = reports.filter((r) => r.status === 'pending')
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card><form onSubmit={handleSubmit(submit)} noValidate className="grid gap-3 sm:grid-cols-2">
        <Field label="Patient" error={errors.patientId?.message}><Select {...register('patientId')}><option value="">Select patient…</option>{patients.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}</Select></Field>
        <Field label="Diagnostic centre"><Select {...register('centerId')}>{diagnosticCenters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
        <Field label="Category" error={errors.category?.message}><Select {...register('category')}><option value="">Select category…</option>{reportCategories.map((c) => <option key={c}>{c}</option>)}</Select></Field>
        <Field label="Report date" error={errors.date?.message}><Input type="date" {...register('date')} /></Field>
        <div className="sm:col-span-2"><Field label="Report title" error={errors.title?.message}><Input {...register('title')} /></Field></div>
        <div className="sm:col-span-2"><Field label="Summary" error={errors.summary?.message}><Textarea rows={2} {...register('summary')} /></Field></div>
        <div className="sm:col-span-2"><Field label="Report file (PDF or image)"><input type="file" accept=".pdf,image/*" aria-label="Report file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></Field></div>
        <div className="sm:col-span-2"><Button type="submit"><Upload className="h-4 w-4" />Upload & publish</Button></div>
      </form></Card>
      <Card><h2 className="mb-3 font-semibold text-navy-900">Pending reports</h2>
        {pending.length === 0 ? <p className="text-sm text-slate-500">Nothing pending.</p> : pending.map((r) => <div key={r.id} className="mb-2 flex items-center justify-between gap-2 text-sm"><span>{r.title}<br /><span className="text-xs text-slate-500">{patients.find((p) => p.id === r.patientId)?.name}</span></span><Button size="sm" variant="outline" onClick={() => { dispatch(publishReport(r.id)); toast('success', 'Report published') }}><Send className="h-3.5 w-3.5" />Publish</Button></div>)}</Card>
    </div>
  )
}

export default function Fulfillment() {
  const orders = useAppSelector((s) => s.orders)
  const [tab, setTab] = useState<'orders' | 'rx' | 'reports'>('orders')
  const [open, setOpen] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const rows = status ? orders.filter((o) => o.status === status) : orders
  return (
    <div>
      <PageHeader title="Fulfillment Center" subtitle="Process orders, verify prescriptions and publish diagnostic reports." />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Incoming" value={orders.filter((o) => o.status === 'placed').length} /><StatCard label="Awaiting Rx" value={orders.filter((o) => o.status === 'verification').length} />
        <StatCard label="Packed" value={orders.filter((o) => o.status === 'packed').length} /><StatCard label="Dispatched" value={orders.filter((o) => o.status === 'dispatched').length} />
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'orders', label: 'Orders' }, { id: 'rx', label: 'Prescription verification' }, { id: 'reports', label: 'Upload lab report' }]} />
      {tab === 'orders' && <>
        <div className="mb-3 max-w-xs"><Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{['placed', 'verification', 'packed', 'dispatched', 'delivered', 'cancelled'].map((s) => <option key={s}>{s}</option>)}</Select></div>
        <DataTable rows={rows} rowKey={(o) => o.id} columns={[
          { key: 'id', header: 'Order', sort: (o) => o.id, render: (o) => <strong>{o.id}</strong> },
          { key: 'cust', header: 'Customer', render: (o) => patients.find((p) => p.id === o.customerId)?.name },
          { key: 'date', header: 'Placed', sort: (o) => o.placedAt, render: (o) => formatDate(o.placedAt) },
          { key: 'src', header: 'Source', render: (o) => (o.source === 'subscription' ? 'Subscription' : 'Order') },
          { key: 'total', header: 'Total', sort: (o) => o.total, render: (o) => formatCurrency(o.total) },
          { key: 'status', header: 'Status', sort: (o) => o.status, render: (o) => <OrderStatusBadge status={o.status} /> },
          { key: 'act', header: '', render: (o) => <Button size="sm" variant="outline" onClick={() => setOpen(o.id)}>Manage</Button> },
        ]} /></>}
      {tab === 'rx' && <Prescriptions />}
      {tab === 'reports' && <ReportUpload />}
      {open && <OrderModal key={open} orderId={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
