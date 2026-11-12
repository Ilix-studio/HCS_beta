import type { OrderStatus } from '../types'

export const orderLabel: Record<OrderStatus, string> = { placed: 'Placed', verification: 'Prescription Verification', packed: 'Packed', dispatched: 'Dispatched', delivered: 'Delivered', cancelled: 'Cancelled' }
