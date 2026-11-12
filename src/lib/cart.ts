import { useMemo } from 'react'
import { useAppSelector } from '../store'
import { useProducts } from './hooks'
import { computeTotals, DELIVERY_FEES } from './pricing'

export const useCart = (override?: keyof typeof DELIVERY_FEES) => {
  const { items, coupon, prescriptionId, deliveryMethod } = useAppSelector((s) => s.cart)
  const method = override ?? deliveryMethod ?? 'standard'
  const products = useProducts()
  const prescriptions = useAppSelector((s) => s.prescriptions)
  return useMemo(() => {
    const lines = items.flatMap((i) => {
      const product = products.find((p) => p.id === i.productId)
      return product ? [{ product, quantity: i.quantity }] : []
    })
    const needsRx = lines.some((l) => l.product.prescriptionRequired)
    const prescription = prescriptions.find((p) => p.id === prescriptionId)
    const rxOk = !needsRx || (!!prescription && (prescription.status === 'verified' || prescription.status === 'awaiting_verification'))
    return { lines, coupon, needsRx, prescription, rxOk, totals: computeTotals(lines, coupon, method) }
  }, [items, coupon, products, prescriptions, prescriptionId, method])
}
