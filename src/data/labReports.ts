import type { DiagnosticCenter, LabReport } from '../types'

export const diagnosticCenters: DiagnosticCenter[] = [
  { id: 'dc1', name: 'Precision Diagnostics', city: 'Pune', phone: '+91 20 5550 7700' },
  { id: 'dc2', name: 'LifeLine Imaging Centre', city: 'Bengaluru', phone: '+91 80 5550 8800' },
]

export const reportCategories = ['Complete Blood Count (CBC)', 'Lipid Profile', 'Blood Glucose', 'Liver Function Test', 'Kidney Function Test', 'Thyroid Profile', 'Urine Analysis', 'X-ray', 'MRI', 'CT Scan']

export const labReports: LabReport[] = [
  { id: 'lr1', patientId: 'pt1', centerId: 'dc1', title: 'CBC – Routine', category: 'Complete Blood Count (CBC)', date: '2026-11-02', status: 'published', summary: 'Mock report. All sample values within the demo reference ranges.', kind: 'pdf' },
  { id: 'lr2', patientId: 'pt1', centerId: 'dc1', title: 'Lipid Profile', category: 'Lipid Profile', date: '2026-10-18', status: 'published', summary: 'Mock report. Demo values only; not real patient data.', kind: 'pdf' },
  { id: 'lr3', patientId: 'pt1', centerId: 'dc1', title: 'Fasting Blood Glucose', category: 'Blood Glucose', date: '2026-09-28', status: 'published', summary: 'Mock report. Demo values only.', kind: 'pdf' },
  { id: 'lr4', patientId: 'pt1', centerId: 'dc2', title: 'Chest X-ray (PA view)', category: 'X-ray', date: '2026-09-10', status: 'published', summary: 'Mock imaging record. Illustration only.', kind: 'image' },
  { id: 'lr5', patientId: 'pt1', centerId: 'dc1', title: 'Thyroid Profile', category: 'Thyroid Profile', date: '2026-11-10', status: 'pending', summary: 'Sample received; result awaited.', kind: 'pdf' },
  { id: 'lr6', patientId: 'pt2', centerId: 'dc2', title: 'MRI – Knee', category: 'MRI', date: '2026-10-25', status: 'published', summary: 'Mock imaging record.', kind: 'image' },
]
