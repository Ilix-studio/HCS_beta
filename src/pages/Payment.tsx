import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Banknote, CreditCard, Landmark, Loader2, Lock, Smartphone } from 'lucide-react'
import { addNotification, addOrder, addSubscription, clearCart, decrementStock, useAppDispatch, useAppSelector } from '../store'
import { useCart } from '../lib/cart'
import { useAddresses, formatAddress } from '../lib/addresses'
import { useToast } from '../lib/hooks'
import { DEMO_TODAY, addDays, addMonths, formatCurrency, newOrderId, uid } from '../lib/utils'
import type { Order, Subscription } from '../types'
import { OrderSummary } from './Cart'
import { Button, Card, Field, Input, PageHeader, Select } from '../components/ui'

type Method = 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery'
const methods: { id: Method; icon: typeof Smartphone }[] = [{ id: 'UPI', icon: Smartphone }, { id: 'Card', icon: CreditCard }, { id: 'Net Banking', icon: Landmark }, { id: 'Cash on Delivery', icon: Banknote }]

export default function Payment() {
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const toast = useToast()
  const cart = useCart()
  const { selected, patientId } = useAddresses()
  const orderType = useAppSelector((s) => s.cart.orderType) ?? 'once'
  const deliveryMethod = useAppSelector((s) => s.cart.deliveryMethod) ?? 'standard'
  const [method, setMethod] = useState<Method>('UPI')
  const [upi, setUpi] = useState('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [bank, setBank] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [paying, setPaying] = useState(false)
  const [done, setDone] = useState(false)

  if (!done && (cart.lines.length === 0 || !cart.rxOk || !selected)) return <Navigate to={cart.lines.length === 0 ? '/cart' : '/checkout'} replace />

  const validate = () => {
    const e: Record<string, string> = {}
    if (method === 'UPI' && !/^[\w.-]{2,}@[a-z]{2,}$/i.test(upi)) e.upi = 'Enter a valid UPI ID, e.g. name@bank'
    if (method === 'Card') {
      if (!/^\d{16}$/.test(card.number.replace(/\s/g, ''))) e.number = 'Enter a 16-digit card number'
      if (card.name.trim().length < 2) e.name = 'Enter the name on the card'
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) e.expiry = 'Use MM/YY'
      if (!/^\d{3}$/.test(card.cvv)) e.cvv = '3 digits'
    }
    if (method === 'Net Banking' && !bank) e.bank = 'Select your bank'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const place = () => {
    if (!selected) return
    const id = newOrderId()
    const needsVerification = cart.needsRx && cart.prescription?.status !== 'verified'
    const status: Order['status'] = needsVerification ? 'verification' : 'placed'
    const order: Order = {
      id, customerId: patientId, items: cart.lines.map((l) => ({ productId: l.product.id, quantity: l.quantity, unitPrice: l.product.price })),
      ...cart.totals, status, address: formatAddress(selected), deliveryMethod, paymentMethod: method,
      prescriptionId: cart.needsRx ? cart.prescription?.id : undefined, placedAt: DEMO_TODAY, packedItems: [],
      timeline: status === 'verification' ? [{ status: 'placed', at: DEMO_TODAY }, { status: 'verification', at: DEMO_TODAY }] : [{ status: 'placed', at: DEMO_TODAY }],
    }
    let subId = ''
    if (orderType !== 'once') {
      subId = uid('sub')
      const sub: Subscription = {
        id: subId, customerId: patientId, items: cart.lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })), frequency: orderType, status: 'active', startDate: DEMO_TODAY,
        nextDispatch: orderType === 'weekly' ? addDays(DEMO_TODAY, 7) : addMonths(DEMO_TODAY, 1), address: formatAddress(selected), reminders: { dispatch: true, refill: true, payment: true },
        prescriptionId: cart.needsRx ? cart.prescription?.id : undefined, history: [{ date: DEMO_TODAY, note: `Subscription created from order ${id}` }],
      }
      dispatch(addSubscription(sub))
    }
    setDone(true)
    dispatch(addOrder(order))
    dispatch(decrementStock(order.items))
    dispatch(addNotification({ id: uid('n'), userId: patientId, type: 'order', title: 'Order placed', message: `Order ${id} was placed successfully.`, date: DEMO_TODAY, read: false, link: `/orders/${id}` }))
    dispatch(clearCart())
    nav(`/order-success/${id}${subId ? `?sub=${subId}` : ''}`)
  }

  const pay = () => {
    if (!validate()) return
    if (method === 'Cash on Delivery') return place()
    setPaying(true)
    setTimeout(() => { toast('success', 'Payment successful (demo)'); place() }, 2200)
  }

  return (
    <div>
      <PageHeader title="Payment" subtitle="Step 2 of 2 — demo payment. No real money is charged and no card details are stored." />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card>
            <div role="radiogroup" aria-label="Payment method" className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {methods.map(({ id, icon: Icon }) => (
                <button key={id} role="radio" aria-checked={method === id} onClick={() => { setMethod(id); setErrors({}) }} className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg border p-3 text-xs font-medium ${method === id ? 'border-teal-600 bg-teal-50 text-teal-700 ring-1 ring-teal-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}><Icon className="h-5 w-5" />{id}</button>
              ))}
            </div>
            {method === 'UPI' && <Field label="UPI ID" error={errors.upi} hint="Demo: any value like demo@upi"><Input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="name@bank" /></Field>}
            {method === 'Card' && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2"><Field label="Card number" error={errors.number} hint="Demo: 4242 4242 4242 4242"><Input inputMode="numeric" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="4242 4242 4242 4242" /></Field></div>
                <div className="sm:col-span-2"><Field label="Name on card" error={errors.name}><Input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} /></Field></div>
                <Field label="Expiry" error={errors.expiry}><Input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="MM/YY" maxLength={5} /></Field>
                <Field label="CVV" error={errors.cvv}><Input inputMode="numeric" type="password" maxLength={3} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} /></Field>
              </div>
            )}
            {method === 'Net Banking' && <Field label="Select bank" error={errors.bank}><Select value={bank} onChange={(e) => setBank(e.target.value)}><option value="">Choose your bank…</option>{['Demo Bank of India', 'Sample National Bank', 'Example Co-operative Bank'].map((b) => <option key={b}>{b}</option>)}</Select></Field>}
            {method === 'Cash on Delivery' && <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Pay in cash when your order arrives. Prescription-only items are handed over after verification.</p>}
          </Card>
          <Card className="text-sm"><div className="font-medium">Delivering to</div><div className="text-slate-600">{selected && `${selected.name} · ${formatAddress(selected)} · ${selected.phone}`}</div>
            {orderType !== 'once' && <div className="mt-2 text-teal-700">This will also create a {orderType} subscription.</div>}</Card>
        </div>
        <Card className="h-fit space-y-4">
          <h2 className="font-semibold text-navy-900">Order summary</h2>
          <OrderSummary cart={cart} />
          <Button className="w-full" disabled={paying} onClick={pay}><Lock className="h-4 w-4" />{method === 'Cash on Delivery' ? 'Place order' : `Pay ${formatCurrency(cart.totals.total)}`}</Button>
        </Card>
      </div>
      {paying && <div role="alert" className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-3 bg-slate-900/60 text-white"><Loader2 className="h-10 w-10 animate-spin" /><p className="font-medium">Processing payment (demo)…</p><p className="text-sm text-slate-200">Please don't close this page</p></div>}
    </div>
  )
}
