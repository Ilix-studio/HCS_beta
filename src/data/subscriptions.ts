import type { Subscription } from '../types'

export const subscriptions: Subscription[] = [
  {
    id: 'sub1', customerId: 'pt1', items: [{ productId: 'p25', quantity: 2 }], frequency: 'monthly', status: 'active', startDate: '2026-08-15', nextDispatch: '2026-11-15',
    address: '12 Lake View Road, Pune 411001', reminders: { dispatch: true, refill: true, payment: true }, prescriptionId: 'rx1',
    history: [{ date: '2026-08-15', note: 'Dispatched 1 delivery' }, { date: '2026-09-15', note: 'Dispatched 1 delivery' }, { date: '2026-10-15', note: 'Dispatched 1 delivery' }],
  },
  {
    id: 'sub2', customerId: 'pt1', items: [{ productId: 'p19', quantity: 1 }], frequency: 'weekly', status: 'paused', startDate: '2026-09-01', nextDispatch: '2026-11-18',
    address: '12 Lake View Road, Pune 411001', reminders: { dispatch: true, refill: false, payment: true }, history: [{ date: '2026-09-01', note: 'Subscription created' }],
  },
]
