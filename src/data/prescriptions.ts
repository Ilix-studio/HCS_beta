import type { Prescription } from '../types'

export const prescriptions: Prescription[] = [
  {
    id: 'rx1', patientId: 'pt1', doctorId: 'd1', doctorName: 'Dr. Meera Kapoor', date: '2026-10-20', diagnosis: 'Type 2 diabetes mellitus (follow-up)', notes: 'Review in 3 months.', status: 'verified', source: 'doctor', validUntil: '2027-01-20',
    medicines: [{ id: 'rm1', productId: 'p25', name: 'Metforin 500', strength: '500 mg', dosage: '1 tablet', frequency: 'Twice daily after meals', duration: '90 days', quantity: 180 }],
  },
  {
    id: 'rx2', patientId: 'pt1', doctorId: 'd2', doctorName: 'Dr. Arjun Sethi', date: '2026-09-02', diagnosis: 'Hypertension', status: 'verified', source: 'doctor', validUntil: '2026-12-02',
    medicines: [{ id: 'rm2', productId: 'p4', name: 'Amlocard 5', strength: '5 mg', dosage: '1 tablet', frequency: 'Once daily', duration: '90 days', quantity: 90 }],
  },
  {
    id: 'rx3', patientId: 'pt2', doctorId: 'd1', doctorName: 'Dr. Meera Kapoor', date: '2026-11-05', diagnosis: 'Upper respiratory infection', status: 'awaiting_verification', source: 'upload', fileName: 'rx-handwritten.png', medicines: [{ id: 'rm3', productId: 'p9', name: 'Amoxiclav 625', strength: '625 mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', quantity: 10, confidence: 0.71 }],
  },
]
