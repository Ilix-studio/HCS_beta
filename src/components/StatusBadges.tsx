import type { Availability, OrderStatus, PrescriptionStatus, Product } from '../types'
import { Badge, type Tone } from './ui'
import { orderLabel } from '../lib/labels'

const rxTone: Record<PrescriptionStatus, Tone> = { uploaded: 'gray', processing: 'blue', awaiting_verification: 'amber', verified: 'green', rejected: 'red' }
const rxLabel: Record<PrescriptionStatus, string> = { uploaded: 'Uploaded', processing: 'Processing', awaiting_verification: 'Awaiting Verification', verified: 'Verified', rejected: 'Rejected' }
export const PrescriptionStatusBadge = ({ status }: { status: PrescriptionStatus }) => <Badge tone={rxTone[status]}>{rxLabel[status]}</Badge>

const orderTone: Record<OrderStatus, Tone> = { placed: 'blue', verification: 'amber', packed: 'teal', dispatched: 'teal', delivered: 'green', cancelled: 'red' }
export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => <Badge tone={orderTone[status]}>{orderLabel[status]}</Badge>

const availTone: Record<Availability, Tone> = { in_stock: 'green', low_stock: 'amber', out_of_stock: 'red' }
const availLabel: Record<Availability, string> = { in_stock: 'In stock', low_stock: 'Low stock', out_of_stock: 'Out of stock' }
export const AvailabilityBadge = ({ availability }: { availability: Availability }) => <Badge tone={availTone[availability]}>{availLabel[availability]}</Badge>

export const RxBadge = ({ product }: { product: Product }) =>
  product.prescriptionRequired ? <Badge tone="red">Rx required</Badge> : <Badge tone="gray">OTC</Badge>
