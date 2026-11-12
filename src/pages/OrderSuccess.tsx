import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Check, MapPin, Repeat, Truck } from 'lucide-react'
import { useAppSelector } from '../store'
import { useProducts } from '../lib/hooks'
import { deliveryEstimate } from '../lib/rxPricing'
import { formatCurrency, formatDate } from '../lib/utils'
import { Button, Card, EmptyState } from '../components/ui'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const [params] = useSearchParams()
  const nav = useNavigate()
  const order = useAppSelector((s) => s.orders).find((o) => o.id === orderId)
  const sub = useAppSelector((s) => s.subscriptions).find((x) => x.id === params.get('sub'))
  const products = useProducts()
  if (!order) return <EmptyState title="Order not found" action={<Button onClick={() => nav('/orders')}>Go to orders</Button>} />
  const eta = deliveryEstimate(order.address)
  return (
    <div className="mx-auto max-w-2xl space-y-5 text-center">
      <div className="pt-6">
        <div className="animate-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-10 w-10" strokeWidth={3} /></div>
        <h1 className="mt-4 text-2xl font-semibold text-navy-900">Order successful!</h1>
        <p className="mt-1 text-slate-600">Thank you — your order <b>{order.id}</b> has been placed{order.paymentMethod !== 'Cash on Delivery' ? ' and payment received (demo)' : ''}.</p>
      </div>
      <Card className="space-y-3 text-left text-sm">
        <ul className="divide-y divide-slate-100">{order.items.map((i) => <li key={i.productId} className="flex justify-between py-1.5"><span>{products.find((p) => p.id === i.productId)?.brand} × {i.quantity}</span><span>{formatCurrency(i.unitPrice * i.quantity)}</span></li>)}</ul>
        <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold"><span>Total ({order.paymentMethod})</span><span>{formatCurrency(order.total)}</span></div>
        <div className="flex items-start gap-2 text-slate-600"><Truck className="mt-0.5 h-4 w-4 text-teal-600" />Estimated delivery: <b className="text-slate-800">{eta.label}</b></div>
        <div className="flex items-start gap-2 text-slate-600"><MapPin className="mt-0.5 h-4 w-4 text-teal-600" />{order.address}</div>
        {order.status === 'verification' && <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-900">Your prescription is awaiting pharmacist verification. The order will be packed once it is approved.</p>}
      </Card>
      {sub && (
        <Card className="border-teal-200 bg-teal-50/50 text-left text-sm">
          <div className="flex items-center gap-2 font-semibold text-navy-900"><Repeat className="h-4 w-4 text-teal-600" />{sub.frequency === 'weekly' ? 'Weekly' : 'Monthly'} subscription created</div>
          <p className="mt-1 text-slate-600">Next dispatch on <b>{formatDate(sub.nextDispatch)}</b>. You'll get reminders before each delivery and can pause, skip or edit it anytime.</p>
          <Link to="/subscriptions"><Button className="mt-3" variant="secondary" size="sm"><Repeat className="h-3.5 w-3.5" />View subscription</Button></Link>
        </Card>
      )}
      <div className="flex flex-wrap justify-center gap-3 pb-6"><Link to={`/orders/${order.id}`}><Button>Track order</Button></Link><Link to="/orders"><Button variant="outline">My orders</Button></Link><Link to="/catalog"><Button variant="outline">Continue shopping</Button></Link></div>
    </div>
  )
}
