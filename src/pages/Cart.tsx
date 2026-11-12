import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { applyCoupon, removeFromCart, setQuantity, useAppDispatch } from '../store'
import { useCart } from '../lib/cart'
import { COUPONS } from '../lib/pricing'
import { useToast } from '../lib/hooks'
import { formatCurrency, productImage } from '../lib/utils'
import { PrescriptionPicker } from '../components/PrescriptionPicker'
import { RxBadge } from '../components/StatusBadges'
import { Button, Card, EmptyState, Input, PageHeader } from '../components/ui'

export function OrderSummary({ cart }: { cart: ReturnType<typeof useCart> }) {
  const t = cart.totals
  const row = (label: string, v: string, cls = '') => <div className={`flex justify-between text-sm ${cls}`}><span className="text-slate-600">{label}</span><span>{v}</span></div>
  return (
    <div className="space-y-2">
      {row('Subtotal', formatCurrency(t.subtotal))}
      {t.discount > 0 && row(`Discount (${cart.coupon})`, '−' + formatCurrency(t.discount), 'text-emerald-700')}
      {row('Delivery', t.delivery === 0 ? 'Free' : formatCurrency(t.delivery))}
      {row('Tax (5% GST)', formatCurrency(t.tax))}
      <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-navy-900"><span>Total</span><span>{formatCurrency(t.total)}</span></div>
    </div>
  )
}

export default function Cart() {
  const cart = useCart()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const nav = useNavigate()
  const [code, setCode] = useState('')

  if (cart.lines.length === 0) return <EmptyState title="Your cart is empty" message="Browse the catalog to add medicines and supplies." action={<Button onClick={() => nav('/catalog')}><ShoppingBag className="h-4 w-4" />Browse catalog</Button>} />

  const apply = () => {
    const c = code.trim().toUpperCase()
    if (COUPONS[c]) { dispatch(applyCoupon(c)); toast('success', `Coupon ${c} applied (${COUPONS[c].label})`) } else toast('error', 'Invalid coupon code. Try HEALTH10.')
  }
  return (
    <div>
      <PageHeader title="Shopping Cart" subtitle={`${cart.lines.length} item${cart.lines.length > 1 ? 's' : ''}`} />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card className="divide-y divide-slate-100 p-0">
            {cart.lines.map(({ product: p, quantity }) => (
              <div key={p.id} className="flex gap-4 p-4">
                <img src={productImage(p)} alt="" className="h-20 w-20 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <Link to={`/catalog/${p.id}`} className="font-medium text-navy-900 hover:text-teal-700">{p.brand}</Link>
                  <div className="text-xs text-slate-500">{p.generic} · {p.packSize}</div>
                  <div className="mt-1"><RxBadge product={p} /></div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center rounded-lg border border-slate-300">
                      <button aria-label={`Decrease ${p.brand}`} className="cursor-pointer p-1.5" onClick={() => dispatch(setQuantity({ productId: p.id, quantity: quantity - 1 }))}><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-8 text-center text-sm">{quantity}</span>
                      <button aria-label={`Increase ${p.brand}`} className="cursor-pointer p-1.5" onClick={() => dispatch(setQuantity({ productId: p.id, quantity: Math.min(p.stock, quantity + 1) }))}><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <button className="flex cursor-pointer items-center gap-1 text-xs text-red-600 hover:underline" onClick={() => { dispatch(removeFromCart(p.id)); toast('info', `${p.brand} removed`) }}><Trash2 className="h-3.5 w-3.5" />Remove</button>
                  </div>
                </div>
                <div className="text-right font-semibold">{formatCurrency(p.price * quantity)}</div>
              </div>
            ))}
          </Card>
          {cart.needsRx && <PrescriptionPicker />}
        </div>
        <Card className="h-fit space-y-4">
          <h2 className="font-semibold text-navy-900">Order summary</h2>
          <div className="flex gap-2"><Input placeholder="Coupon (HEALTH10)" aria-label="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} /><Button variant="outline" onClick={apply}>Apply</Button></div>
          {cart.coupon && <button className="cursor-pointer text-xs text-teal-700 underline" onClick={() => dispatch(applyCoupon(null))}>Remove coupon {cart.coupon}</button>}
          <OrderSummary cart={cart} />
          {cart.needsRx && !cart.rxOk && <p role="alert" className="rounded-lg bg-amber-50 p-2 text-xs text-amber-800">Attach a verified or pending prescription to continue.</p>}
          <Button className="w-full" disabled={!cart.rxOk} onClick={() => nav('/checkout')}>Proceed to checkout</Button>
          <p className="text-xs text-slate-400">Free standard delivery above ₹500. Demo checkout only — no real payments.</p>
        </Card>
      </div>
    </div>
  )
}
