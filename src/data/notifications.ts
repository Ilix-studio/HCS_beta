import type { Notification } from '../types'

export const notifications: Notification[] = [
  { id: 'n1', userId: 'pt1', type: 'dispatch', title: 'Upcoming dispatch', message: 'Your monthly Metforin 500 subscription dispatches on 15 Nov 2026.', date: '2026-11-12', read: false, link: '/subscriptions' },
  { id: 'n2', userId: 'pt1', type: 'refill', title: 'Refill reminder', message: 'Metforin 500 is expected to run low in about 5 days.', date: '2026-11-11', read: false, link: '/subscriptions' },
  { id: 'n3', userId: 'pt1', type: 'prescription', title: 'Prescription renewal', message: 'Prescription from Dr. Arjun Sethi (Amlocard 5) expires on 02 Dec 2026.', date: '2026-11-10', read: false, link: '/prescriptions' },
  { id: 'n4', userId: 'pt1', type: 'payment', title: 'Payment reminder', message: 'Payment for your next subscription cycle is due on 14 Nov 2026.', date: '2026-11-09', read: true, link: '/subscriptions' },
  { id: 'n5', userId: 'pt1', type: 'report', title: 'Report published', message: 'Your CBC – Routine report is ready to view.', date: '2026-11-02', read: true, link: '/reports/lr1' },
]
