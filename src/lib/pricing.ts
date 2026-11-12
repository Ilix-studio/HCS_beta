import type { Product } from '../types'

export const COUPONS: Record<string, { label: string; rate: number }> = {
  HEALTH10: { label: '10% off', rate: 0.1 },
  WELCOME5: { label: '5% off', rate: 0.05 },
}
export const TAX_RATE = 0.05
export const FREE_DELIVERY_ABOVE = 500
export const DELIVERY_FEES = { standard: 40, express: 90, pickup: 0 } as const

export interface Totals { subtotal: number; discount: number; delivery: number; tax: number; total: number }

export const computeTotals = (
  lines: { product: Product; quantity: number }[],
  coupon: string | null,
  method: keyof typeof DELIVERY_FEES = 'standard',
): Totals => {
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0)
  const discount = coupon && COUPONS[coupon] ? +(subtotal * COUPONS[coupon].rate).toFixed(2) : 0
  const base = DELIVERY_FEES[method]
  const delivery = lines.length === 0 || (subtotal >= FREE_DELIVERY_ABOVE && method === 'standard') ? 0 : base
  const tax = +((subtotal - discount) * TAX_RATE).toFixed(2)
  return { subtotal, discount, delivery, tax, total: +(subtotal - discount + delivery + tax).toFixed(2) }
}
