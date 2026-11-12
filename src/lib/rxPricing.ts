import type { Product, PrescriptionMedicine } from '../types'
import { addDays, DEMO_TODAY, formatDate } from './utils'
import { computeTotals, type Totals } from './pricing'

export const HUB_CITY = 'Pune'

export interface RxLine {
  med: PrescriptionMedicine
  product?: Product
  packs: number
  amount: number
  status: 'available' | 'low' | 'unavailable' | 'unmatched'
}

export const matchProduct = (name: string, products: Product[]) => {
  const n = name.trim().toLowerCase()
  if (!n) return undefined
  return products.find((p) => p.status === 'active' && (p.brand.toLowerCase() === n || p.generic.toLowerCase() === n))
}

/** Packs needed for the prescribed quantity, using the trailing number of the pack size ("Strip of 10" → 10). */
export const packsNeeded = (product: Product, quantity: number) => {
  const per = Number(product.packSize.match(/(\d+)\s*(?:ml|g)?$/i)?.[1] ?? 1) || 1
  return Math.max(1, Math.ceil(Math.max(1, quantity) / per))
}

export const buildLines = (meds: PrescriptionMedicine[], products: Product[]): RxLine[] =>
  meds.map((med) => {
    const product = matchProduct(med.name, products)
    if (!product) return { med, packs: 0, amount: 0, status: 'unmatched' }
    const packs = packsNeeded(product, med.quantity)
    const status = product.availability === 'out_of_stock' || product.stock < packs ? 'unavailable' : product.availability === 'low_stock' ? 'low' : 'available'
    return { med, product, packs, amount: status === 'unavailable' ? 0 : product.price * packs, status }
  })

export const linesTotals = (lines: RxLine[]): Totals =>
  computeTotals(lines.filter((l) => l.product && l.status !== 'unavailable').map((l) => ({ product: l.product!, quantity: l.packs })), null, 'standard')

export const cityOf = (address: string) => address.replace(/\s*\d{6}\s*$/, '').split(',').pop()?.trim() ?? ''

export const deliveryEstimate = (address: string) => {
  const city = cityOf(address)
  const local = city.toLowerCase() === HUB_CITY.toLowerCase()
  const days = local ? 1 : 3
  return { city, local, label: local ? `Tomorrow, ${formatDate(addDays(DEMO_TODAY, days))}` : `${formatDate(addDays(DEMO_TODAY, days))} – ${formatDate(addDays(DEMO_TODAY, days + 1))}`, detail: local ? `Same-city delivery from our ${HUB_CITY} hub` : `Shipped from our ${HUB_CITY} hub to ${city}` }
}
