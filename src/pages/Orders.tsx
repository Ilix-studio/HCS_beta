import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Circle, PartyPopper } from 'lucide-react'
import { useAppSelector } from '../store'
import { useProducts } from '../lib/hooks'
import { formatCurrency, formatDate } from '../lib/utils'
import type { Order, OrderStatus } from '../types'
import { OrderStatusBadge } from '../components/StatusBadges'
import { orderLabel } from '../lib/labels'
import { Button, Card, DataTable, EmptyState, PageHeader } from '../components/ui'

const steps: OrderStatus[] = ['placed', 'packed', 'dispatched', 'delivered']

export function OrderTimeline({ order }: { order: Order }) {
  const reached = (s: OrderStatus) => order.timeline.find((t) => t.status === s)
  return (
    <ol className="space-y-4">
      {order.status === 'verification' && <li className="flex gap-3 text-sm"><Circle className="h-5 w-5 text-amber-500" /><div><div className="font-medium">Prescription verification in progress</div><div className="text-slate-500">Your order is held until a pharmacist verifies the prescription.</div></div></li>}
      {steps.map((s) => {
        const at = reached(s)
        return (
          <li key={s} className="flex gap-3 text-sm">
            {at ? <CheckCircle2 className="h-5 w-5 text-teal-600" /> : <Circle className="h-5 w-5 text-slate-300" />}
            <div><div className={at ? 'font-medium' : 'text-slate-400'}>{orderLabel[s]}</div>{at && <div className="text-slate-500">{formatDate(at.at)}</div>}</div>
          </li>
        )
      })}
    </ol>
  )
}

export function OrderDetail() {
  const { orderId } = useParams()
  const [params] = useSearchParams()
  const order = useAppSelector((s) => s.orders).find((o) => o.id === orderId)
  const products = useProducts()
  const nav = useNavigate()
  if (!order) return <EmptyState title="Order not found" action={<Button onClick={() => nav('/orders')}>Back to orders</Button>} />
  return (
    <div>
      {params.get('placed') && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"><PartyPopper className="h-6 w-6" /><div><div className="font-semibold">Order confirmed!</div><div className="text-sm">Thank you. Your order {order.id} has been placed. Track its progress below.</div></div></div>
      )}
      <PageHeader title={`Order ${order.id}`} subtitle={`Placed ${formatDate(order.placedAt)}`} actions={<OrderStatusBadge status={order.status} />} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card className="p-0">
            <table className="w-full text-sm"><thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase"><tr><th className="px-4 py-3">Item</th><th className="px-4 py-3">Qty</th><th className="px-4 py-3 text-right">Amount</th></tr></thead>
              <tbody className="divide-y divide-slate-100">{order.items.map((i) => <tr key={i.productId}><td className="px-4 py-3">{products.find((p) => p.id === i.productId)?.brand ?? i.productId}</td><td className="px-4 py-3">{i.quantity}</td><td className="px-4 py-3 text-right">{formatCurrency(i.unitPrice * i.quantity)}</td></tr>)}</tbody></table>
            <div className="space-y-1 border-t border-slate-200 p-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount</span><span>−{formatCurrency(order.discount)}</span></div>}
              <div className="flex justify-between"><span>Delivery</span><span>{order.delivery ? formatCurrency(order.delivery) : 'Free'}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
            </div>
          </Card>
          <Card className="text-sm"><div><strong>Deliver to:</strong> {order.address}</div><div><strong>Method:</strong> {order.deliveryMethod} · <strong>Payment:</strong> {order.paymentMethod}</div>{order.prescriptionId && <div><strong>Prescription:</strong> <Link className="text-teal-700 underline" to="/prescriptions">{order.prescriptionId}</Link></div>}</Card>
        </div>
        <Card><h2 className="mb-4 font-semibold text-navy-900">Order tracking</h2><OrderTimeline order={order} />{order.tracking && <p className="mt-4 text-sm text-slate-600">Tracking no: <strong>{order.tracking}</strong></p>}</Card>
      </div>
    </div>
  )
}

export default function Orders() {
  const { role, patientId } = useAppSelector((s) => s.session)
  const all = useAppSelector((s) => s.orders)
  const orders = role === 'patient' ? all.filter((o) => o.customerId === patientId) : all
  return (
    <div>
      <PageHeader title={role === 'patient' ? 'My Orders' : 'All Orders'} actions={<Link to="/catalog"><Button variant="outline">Continue shopping</Button></Link>} />
      {orders.length === 0 ? <EmptyState title="No orders yet" message="Orders you place will appear here." action={<Link to="/catalog"><Button>Browse catalog</Button></Link>} /> : (
        <DataTable rows={orders} rowKey={(o) => o.id} filter={{ placeholder: 'Search by order ID…', match: (o, q) => o.id.toLowerCase().includes(q) }} columns={[
          { key: 'id', header: 'Order', sort: (o) => o.id, render: (o) => <Link className="font-medium text-teal-700 hover:underline" to={`/orders/${o.id}`}>{o.id}</Link> },
          { key: 'date', header: 'Placed', sort: (o) => o.placedAt, render: (o) => formatDate(o.placedAt) },
          { key: 'items', header: 'Items', render: (o) => o.items.reduce((n, i) => n + i.quantity, 0) },
          { key: 'total', header: 'Total', sort: (o) => o.total, render: (o) => formatCurrency(o.total) },
          { key: 'status', header: 'Status', sort: (o) => o.status, render: (o) => <OrderStatusBadge status={o.status} /> },
        ]} />
      )}
    </div>
  )
}
