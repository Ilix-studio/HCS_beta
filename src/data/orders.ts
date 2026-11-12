import type { Order } from '../types'

export const orders: Order[] = [
  {
    id: 'ORD-1001', customerId: 'pt1', items: [{ productId: 'p1', quantity: 2, unitPrice: 24 }, { productId: 'p17', quantity: 1, unitPrice: 118 }],
    subtotal: 166, discount: 0, delivery: 0, tax: 8.3, total: 174.3, status: 'delivered', address: '12 Lake View Road, Pune 411001', deliveryMethod: 'Standard', paymentMethod: 'UPI',
    tracking: 'TRK778120', placedAt: '2026-10-12', packedItems: ['p1', 'p17'],
    timeline: [{ status: 'placed', at: '2026-10-12' }, { status: 'packed', at: '2026-10-13' }, { status: 'dispatched', at: '2026-10-13' }, { status: 'delivered', at: '2026-10-15' }],
  },
  {
    id: 'ORD-1002', customerId: 'pt1', items: [{ productId: 'p25', quantity: 3, unitPrice: 40 }], subtotal: 120, discount: 0, delivery: 40, tax: 6, total: 166, status: 'verification',
    address: '12 Lake View Road, Pune 411001', deliveryMethod: 'Standard', paymentMethod: 'Card', prescriptionId: 'rx1', placedAt: '2026-11-10', packedItems: [],
    timeline: [{ status: 'placed', at: '2026-11-10' }, { status: 'verification', at: '2026-11-10' }],
  },
  {
    id: 'ORD-1003', customerId: 'pt2', items: [{ productId: 'p38', quantity: 1, unitPrice: 199 }], subtotal: 199, discount: 0, delivery: 40, tax: 9.95, total: 248.95, status: 'placed',
    address: '45 Palm Avenue, Bengaluru 560001', deliveryMethod: 'Standard', paymentMethod: 'Cash on Delivery', placedAt: '2026-11-11', packedItems: [], timeline: [{ status: 'placed', at: '2026-11-11' }],
  },
]
