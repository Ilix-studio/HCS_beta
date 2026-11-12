import { Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch, setCheckoutOptions, useAppSelector } from '../store'
import { useCart } from '../lib/cart'
import { useAddresses } from '../lib/addresses'
import { DELIVERY_FEES } from '../lib/pricing'
import { useToast } from '../lib/hooks'
import type { DeliveryMethod } from '../types'
import { OrderSummary } from './Cart'
import { AddressPicker } from '../components/AddressPicker'
import { OrderTypeSelector } from '../components/OrderTypeSelector'
import { Button, Card, Field, PageHeader, Select } from '../components/ui'

export default function Checkout() {
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const toast = useToast()
  const cart = useCart()
  const { selected } = useAddresses()
  const method = useAppSelector((s) => s.cart.deliveryMethod) ?? 'standard'

  if (cart.lines.length === 0 || !cart.rxOk) return <Navigate to="/cart" replace />

  const next = () => {
    if (!selected) return toast('error', 'Add or select a delivery address to continue.')
    dispatch(setCheckoutOptions({ addressId: selected.id }))
    nav('/payment')
  }

  return (
    <div>
      <PageHeader title="Checkout" subtitle="Step 1 of 2 — delivery details. No payment is processed in this demo." />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card><AddressPicker /></Card>
          <Card>
            <Field label="Delivery method">
              <Select value={method} onChange={(e) => dispatch(setCheckoutOptions({ deliveryMethod: e.target.value as DeliveryMethod }))}>
                <option value="standard">Standard (2–4 days) — ₹{DELIVERY_FEES.standard}, free above ₹500</option>
                <option value="express">Express (next day) — ₹{DELIVERY_FEES.express}</option>
                <option value="pickup">Store pickup — free</option>
              </Select>
            </Field>
          </Card>
          <Card><OrderTypeSelector /></Card>
          {cart.needsRx && <Card className="text-sm"><strong>Prescription:</strong> {cart.prescription?.doctorName} · status <em>{cart.prescription?.status.replace('_', ' ')}</em>. {cart.prescription?.status !== 'verified' && 'The order will be held until the prescription is verified.'}</Card>}
        </div>
        <Card className="h-fit space-y-4">
          <h2 className="font-semibold text-navy-900">Order summary</h2>
          <ul className="space-y-1 text-sm text-slate-600">{cart.lines.map((l) => <li key={l.product.id}>{l.product.brand} × {l.quantity}</li>)}</ul>
          <OrderSummary cart={cart} />
          <Button className="w-full" onClick={next}>Continue to payment</Button>
        </Card>
      </div>
    </div>
  )
}
