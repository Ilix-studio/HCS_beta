import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, BellRing, Calendar, History, Pause, Pencil, Play, Plus, SkipForward, Truck, XCircle } from 'lucide-react'
import { addNotification, addOrder, addSubscription, updateSubscription, useAppDispatch, useAppSelector } from '../store'
import { useProducts, useToast } from '../lib/hooks'
import { DEMO_TODAY, addDays, addMonths, formatCurrency, formatDate, newOrderId, productImage, uid } from '../lib/utils'
import { computeTotals } from '../lib/pricing'
import { patients } from '../data/patients'
import type { Product, Subscription, SubscriptionFrequency } from '../types'
import { Badge, Button, Card, EmptyState, Field, Input, Modal, PageHeader, Select, StatCard, Tabs } from '../components/ui'

const advance = (iso: string, f: SubscriptionFrequency) => (f === 'weekly' ? addDays(iso, 7) : addMonths(iso, 1))
const cyclesPerMonth = (f: SubscriptionFrequency) => (f === 'weekly' ? 4.33 : 1)

const useSubscriptionTools = () => {
  const prescriptions = useAppSelector((s) => s.prescriptions)
  const products = useProducts()
  const rxCheck = (sub: Pick<Subscription, 'items' | 'prescriptionId' | 'nextDispatch'>): string | null => {
    const needs = sub.items.some((i) => products.find((p) => p.id === i.productId)?.prescriptionRequired)
    if (!needs) return null
    const rx = prescriptions.find((p) => p.id === sub.prescriptionId)
    if (!rx) return 'A prescription is required for this subscription.'
    if (rx.status !== 'verified') return 'Prescription is not verified yet.'
    if (rx.validUntil && rx.validUntil < sub.nextDispatch) return `Prescription expires ${formatDate(rx.validUntil)} — renewal needed before next dispatch.`
    return null
  }
  return { rxCheck, products, prescriptions }
}

function SubscriptionForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { rxCheck, products, prescriptions } = useSubscriptionTools()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const patientId = useAppSelector((s) => s.session.patientId)
  const address = patients.find((p) => p.id === patientId)?.address ?? ''
  const [lines, setLines] = useState<{ productId: string; quantity: number }[]>([{ productId: 'p25', quantity: 1 }])
  const [frequency, setFrequency] = useState<SubscriptionFrequency>('monthly')
  const [start, setStart] = useState(DEMO_TODAY)
  const [next, setNext] = useState(addDays(DEMO_TODAY, 3))
  const [addr, setAddr] = useState(address)
  const [rem, setRem] = useState({ dispatch: true, refill: true, payment: true })
  const [rxId, setRxId] = useState('')
  const myRx = prescriptions.filter((p) => p.patientId === patientId && p.status === 'verified')
  const draft = { items: lines, prescriptionId: rxId || undefined, nextDispatch: next }
  const rxError = rxCheck(draft)
  const monthly = lines.reduce((s, l) => s + (products.find((p) => p.id === l.productId)?.price ?? 0) * l.quantity, 0) * cyclesPerMonth(frequency)

  const submit = () => {
    if (lines.length === 0) return toast('error', 'Add at least one medicine.')
    if (next < start) return toast('error', 'Next dispatch cannot be before the start date.')
    if (addr.trim().length < 10) return toast('error', 'Enter a delivery address.')
    if (rxError) return toast('error', rxError)
    const sub: Subscription = { id: uid('sub'), customerId: patientId, items: lines, frequency, status: 'active', startDate: start, nextDispatch: next, address: addr, reminders: rem, prescriptionId: rxId || undefined, history: [{ date: DEMO_TODAY, note: 'Subscription created' }] }
    dispatch(addSubscription(sub))
    toast('success', `${frequency === 'weekly' ? 'Weekly' : 'Monthly'} subscription created`)
    onClose()
  }
  return (
    <Modal open={open} onClose={onClose} title="New subscription" wide>
      <div className="space-y-4">
        {lines.map((l, i) => (
          <div key={i} className="flex flex-wrap items-end gap-2">
            <div className="min-w-48 flex-1"><Field label={i === 0 ? 'Medicine' : ''}><Select aria-label={`Medicine ${i + 1}`} value={l.productId} onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, productId: e.target.value } : x)))}>
              {products.filter((p) => p.status === 'active' && p.availability !== 'out_of_stock').map((p) => <option key={p.id} value={p.id}>{p.brand} — {formatCurrency(p.price)}{p.prescriptionRequired ? ' (Rx)' : ''}</option>)}</Select></Field></div>
            <div className="w-24"><Field label={i === 0 ? 'Qty' : ''}><Input aria-label={`Quantity ${i + 1}`} type="number" min={1} value={l.quantity} onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, quantity: Math.max(1, Number(e.target.value)) } : x)))} /></Field></div>
            {lines.length > 1 && <Button variant="ghost" size="sm" onClick={() => setLines(lines.filter((_, j) => j !== i))}>Remove</Button>}
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setLines([...lines, { productId: 'p1', quantity: 1 }])}><Plus className="h-3.5 w-3.5" />Add another medicine</Button>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Delivery frequency"><Select value={frequency} onChange={(e) => setFrequency(e.target.value as SubscriptionFrequency)}><option value="weekly">Weekly</option><option value="monthly">Monthly</option></Select></Field>
          <Field label="Start date"><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
          <Field label="Next dispatch"><Input type="date" value={next} min={start} onChange={(e) => setNext(e.target.value)} /></Field>
        </div>
        <Field label="Delivery address"><Input value={addr} onChange={(e) => setAddr(e.target.value)} /></Field>
        {lines.some((l) => products.find((p) => p.id === l.productId)?.prescriptionRequired) && (
          <Field label="Prescription (required for Rx medicines)" error={rxError ?? undefined}>
            <Select value={rxId} onChange={(e) => setRxId(e.target.value)}><option value="">Select a verified prescription…</option>{myRx.map((r) => <option key={r.id} value={r.id}>{r.doctorName} · {formatDate(r.date)}{r.validUntil ? ` · valid to ${formatDate(r.validUntil)}` : ''}</option>)}</Select>
          </Field>
        )}
        <fieldset className="flex flex-wrap gap-4 text-sm"><legend className="mb-1 font-medium">Reminders</legend>
          {([['dispatch', 'Upcoming dispatch'], ['refill', 'Refill reminders'], ['payment', 'Payment reminders']] as const).map(([k, label]) => (
            <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={rem[k]} onChange={(e) => setRem({ ...rem, [k]: e.target.checked })} />{label}</label>))}
        </fieldset>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3"><span className="text-sm text-slate-600">Estimated monthly cost: <strong className="text-navy-900">{formatCurrency(Math.round(monthly))}</strong></span><div className="flex gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={submit}>Create subscription</Button></div></div>
      </div>
    </Modal>
  )
}

function EditModal({ sub, onClose }: { sub: Subscription | null; onClose: () => void }) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const products = useProducts()
  const [frequency, setFrequency] = useState(sub?.frequency ?? 'monthly')
  const [address, setAddress] = useState(sub?.address ?? '')
  const [qty, setQty] = useState<Record<string, number>>(Object.fromEntries((sub?.items ?? []).map((i) => [i.productId, i.quantity])))
  if (!sub) return null
  return (
    <Modal open onClose={onClose} title="Edit subscription">
      <div className="space-y-4">
        <Field label="Frequency"><Select value={frequency} onChange={(e) => setFrequency(e.target.value as SubscriptionFrequency)}><option value="weekly">Weekly</option><option value="monthly">Monthly</option></Select></Field>
        {sub.items.map((i) => <Field key={i.productId} label={`Quantity — ${products.find((p) => p.id === i.productId)?.brand}`}><Input type="number" min={1} value={qty[i.productId]} onChange={(e) => setQty({ ...qty, [i.productId]: Math.max(1, Number(e.target.value)) })} /></Field>)}
        <Field label="Delivery address"><Input value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            if (address.trim().length < 10) return toast('error', 'Enter a valid address')
            dispatch(updateSubscription({ id: sub.id, changes: { frequency, address, items: sub.items.map((i) => ({ ...i, quantity: qty[i.productId] })) }, note: 'Subscription details updated' }))
            toast('success', 'Subscription updated'); onClose()
          }}>Save changes</Button></div>
      </div>
    </Modal>
  )
}

function SubscriptionCard({ sub, onEdit, onHistory }: { sub: Subscription; onEdit: () => void; onHistory: () => void }) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { rxCheck, products } = useSubscriptionTools()
  const issue = rxCheck(sub)
  const items = sub.items.flatMap((i) => { const p = products.find((x) => x.id === i.productId); return p ? [{ p, q: i.quantity }] : [] })
  const monthly = Math.round(items.reduce((s, l) => s + l.p.price * l.q, 0) * cyclesPerMonth(sub.frequency))
  const set = (changes: Partial<Subscription>, note: string, msg: string) => { dispatch(updateSubscription({ id: sub.id, changes, note })); toast('success', msg) }
  const tone = sub.status === 'active' ? 'green' : sub.status === 'paused' ? 'amber' : 'red'

  const dispatchNow = () => {
    if (issue) return toast('error', `Dispatch blocked: ${issue}`)
    const totals = computeTotals(items.map((l) => ({ product: l.p, quantity: l.q })), null, 'standard')
    dispatch(addOrder({ id: newOrderId(), customerId: sub.customerId, items: items.map((l) => ({ productId: l.p.id, quantity: l.q, unitPrice: l.p.price })), ...totals, status: 'placed', address: sub.address, deliveryMethod: 'Standard', paymentMethod: 'Subscription', prescriptionId: sub.prescriptionId, placedAt: DEMO_TODAY, packedItems: [], timeline: [{ status: 'placed', at: DEMO_TODAY }], source: 'subscription' }))
    dispatch(updateSubscription({ id: sub.id, changes: { nextDispatch: advance(sub.nextDispatch, sub.frequency) }, note: `Dispatched delivery (${formatCurrency(totals.total)})` }))
    toast('success', 'Delivery dispatched — order created for fulfillment')
  }
  return (
    <Card className={sub.status === 'cancelled' ? 'opacity-60' : ''}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex gap-2">{items.map((l) => <img key={l.p.id} src={productImage(l.p as Product)} alt={l.p.brand} className="h-12 w-12 rounded-lg object-cover" />)}</div>
        <div className="flex gap-2"><Badge tone={tone}>{sub.status}</Badge><Badge tone="blue">{sub.frequency}</Badge></div>
      </div>
      <h3 className="mt-3 font-semibold text-navy-900">{items.map((l) => `${l.p.brand} × ${l.q}`).join(', ')}</h3>
      <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div><dt className="text-slate-500">Next delivery</dt><dd className="font-medium">{sub.status === 'cancelled' ? '—' : sub.status === 'paused' ? 'Paused' : formatDate(sub.nextDispatch)}</dd></div>
        <div><dt className="text-slate-500">Est. monthly cost</dt><dd className="font-medium">{formatCurrency(monthly)}</dd></div>
        <div className="col-span-2"><dt className="text-slate-500">Address</dt><dd>{sub.address}</dd></div>
      </dl>
      {issue && sub.status !== 'cancelled' && <p role="alert" className="mt-3 flex gap-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-900"><AlertTriangle className="h-4 w-4 shrink-0" />{issue} <Link className="underline" to="/prescriptions/upload">Upload renewal</Link></p>}
      {sub.status !== 'cancelled' && (
        <div className="mt-4 flex flex-wrap gap-2">
          {sub.status === 'active' ? <Button size="sm" variant="outline" onClick={() => set({ status: 'paused' }, 'Subscription paused', 'Subscription paused')}><Pause className="h-3.5 w-3.5" />Pause</Button>
            : <Button size="sm" variant="secondary" onClick={() => set({ status: 'active' }, 'Subscription resumed', 'Subscription resumed')}><Play className="h-3.5 w-3.5" />Resume</Button>}
          <Button size="sm" variant="outline" disabled={sub.status !== 'active'} onClick={() => set({ nextDispatch: advance(sub.nextDispatch, sub.frequency) }, 'Skipped next delivery', 'Next delivery skipped')}><SkipForward className="h-3.5 w-3.5" />Skip next</Button>
          <Button size="sm" variant="outline" onClick={onEdit}><Pencil className="h-3.5 w-3.5" />Edit</Button>
          <Button size="sm" variant="outline" disabled={sub.status !== 'active'} onClick={dispatchNow}><Truck className="h-3.5 w-3.5" />Dispatch now (demo)</Button>
          <Button size="sm" variant="outline" onClick={onHistory}><History className="h-3.5 w-3.5" />History</Button>
          <Button size="sm" variant="danger" onClick={() => { if (confirm('Cancel this subscription?')) set({ status: 'cancelled' }, 'Subscription cancelled', 'Subscription cancelled') }}><XCircle className="h-3.5 w-3.5" />Cancel</Button>
        </div>
      )}
      {sub.status === 'cancelled' && <Button size="sm" variant="outline" className="mt-4" onClick={onHistory}><History className="h-3.5 w-3.5" />History</Button>}
    </Card>
  )
}

export default function Subscriptions() {
  const { role, patientId } = useAppSelector((s) => s.session)
  const all = useAppSelector((s) => s.subscriptions)
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { products } = useSubscriptionTools()
  const subs = role === 'patient' ? all.filter((s) => s.customerId === patientId) : all
  const [tab, setTab] = useState<'active' | 'paused' | 'cancelled'>('active')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Subscription | null>(null)
  const [history, setHistory] = useState<Subscription | null>(null)
  const active = subs.filter((s) => s.status === 'active')
  const upcoming = [...active].sort((a, b) => a.nextDispatch.localeCompare(b.nextDispatch))
  const monthly = active.reduce((sum, s) => sum + s.items.reduce((t, i) => t + (products.find((p) => p.id === i.productId)?.price ?? 0) * i.quantity, 0) * cyclesPerMonth(s.frequency), 0)

  const simulate = () => {
    const sub = upcoming[0]
    if (!sub) return toast('info', 'No active subscriptions to remind about.')
    const name = products.find((p) => p.id === sub.items[0].productId)?.brand
    const mk = (type: 'dispatch' | 'refill' | 'payment' | 'prescription', title: string, message: string) => dispatch(addNotification({ id: uid('n'), userId: sub.customerId, type, title, message, date: DEMO_TODAY, read: false, link: '/subscriptions' }))
    if (sub.reminders.dispatch) mk('dispatch', 'Upcoming dispatch', `${name} dispatches on ${formatDate(sub.nextDispatch)}.`)
    if (sub.reminders.refill) mk('refill', 'Refill reminder', `${name} is due for a refill soon.`)
    if (sub.reminders.payment) mk('payment', 'Payment reminder', `Payment for the next ${name} cycle is due before dispatch.`)
    mk('prescription', 'Prescription renewal', 'Check that your prescription is valid for upcoming dispatches.')
    toast('success', 'Reminders sent — open the bell icon to view them')
  }

  return (
    <div>
      <PageHeader title="Subscriptions" subtitle="Recurring weekly or monthly medicine deliveries." actions={<><Button variant="outline" onClick={simulate}><BellRing className="h-4 w-4" />Simulate reminders</Button>{role === 'patient' && <Button onClick={() => setCreating(true)}><Plus className="h-4 w-4" />New subscription</Button>}</>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Active subscriptions" value={active.length} icon={<Calendar className="h-5 w-5" />} />
        <StatCard label="Next delivery" value={upcoming[0] ? formatDate(upcoming[0].nextDispatch) : '—'} icon={<Truck className="h-5 w-5" />} />
        <StatCard label="Est. monthly cost" value={formatCurrency(Math.round(monthly))} />
      </div>
      {upcoming.length > 0 && (
        <Card className="mb-6"><h2 className="mb-3 font-semibold text-navy-900">Upcoming dispatches</h2>
          <ul className="divide-y divide-slate-100 text-sm">{upcoming.map((s) => <li key={s.id} className="flex justify-between py-2"><span>{s.items.map((i) => products.find((p) => p.id === i.productId)?.brand).join(', ')}</span><span className="text-slate-600">{formatDate(s.nextDispatch)} · {s.frequency}</span></li>)}</ul></Card>
      )}
      <Tabs value={tab} onChange={setTab} tabs={(['active', 'paused', 'cancelled'] as const).map((t) => ({ id: t, label: t[0].toUpperCase() + t.slice(1), count: subs.filter((s) => s.status === t).length }))} />
      {subs.filter((s) => s.status === tab).length === 0 ? <EmptyState title={`No ${tab} subscriptions`} action={tab === 'active' && role === 'patient' ? <Button onClick={() => setCreating(true)}>Create one</Button> : undefined} /> : (
        <div className="grid gap-4 lg:grid-cols-2">{subs.filter((s) => s.status === tab).map((s) => <SubscriptionCard key={s.id} sub={s} onEdit={() => setEditing(s)} onHistory={() => setHistory(s)} />)}</div>
      )}
      {creating && <SubscriptionForm open onClose={() => setCreating(false)} />}
      {editing && <EditModal key={editing.id} sub={editing} onClose={() => setEditing(null)} />}
      <Modal open={!!history} onClose={() => setHistory(null)} title="Subscription history">
        <ul className="space-y-2 text-sm">{history?.history.map((h, i) => <li key={i} className="flex justify-between border-b border-slate-100 pb-2"><span>{h.note}</span><span className="text-slate-500">{formatDate(h.date)}</span></li>)}</ul>
      </Modal>
    </div>
  )
}
