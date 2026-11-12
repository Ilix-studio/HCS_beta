import { Repeat, ShoppingBag } from 'lucide-react'
import { setCheckoutOptions, useAppDispatch, useAppSelector } from '../store'
import type { OrderType } from '../types'

const options: { id: OrderType; title: string; text: string; icon: typeof Repeat }[] = [
  { id: 'once', title: 'One-time order', text: 'Just this delivery', icon: ShoppingBag },
  { id: 'weekly', title: 'Weekly subscription', text: 'Repeat every week', icon: Repeat },
  { id: 'monthly', title: 'Monthly subscription', text: 'Repeat every month', icon: Repeat },
]

export function OrderTypeSelector() {
  const dispatch = useAppDispatch()
  const value = useAppSelector((s) => s.cart.orderType) ?? 'once'
  return (
    <fieldset>
      <legend className="mb-2 font-semibold text-navy-900">Order type</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((o) => (
          <label key={o.id} className={`flex cursor-pointer items-start gap-2 rounded-lg border bg-white p-3 text-sm ${value === o.id ? 'border-teal-600 ring-1 ring-teal-600' : 'border-slate-200'}`}>
            <input type="radio" name="orderType" className="mt-1" checked={value === o.id} onChange={() => dispatch(setCheckoutOptions({ orderType: o.id }))} />
            <span><span className="flex items-center gap-1.5 font-medium"><o.icon className="h-3.5 w-3.5 text-teal-600" />{o.title}</span><span className="text-xs text-slate-500">{o.text}</span></span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
