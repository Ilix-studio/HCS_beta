import type { PrescriptionMedicine } from '../types'

/**
 * SIMULATED OCR / vision extraction. No real handwriting recognition happens here;
 * results are canned fixtures chosen by the demo so reviewers can see how uncertain output is handled.
 */
export interface OcrField { value: string; confidence: number }
export interface OcrResult {
  handwritten: boolean
  overall: number
  doctor: OcrField
  patient: OcrField
  date: OcrField
  medicines: (PrescriptionMedicine & { confidence: number })[]
  unrecognized: string[]
}

export const LOW_CONFIDENCE = 0.8

export const simulateOcr = (handwritten: boolean, patientName: string): OcrResult =>
  handwritten
    ? {
        handwritten, overall: 0.68,
        doctor: { value: 'Dr. M. Kap??r', confidence: 0.58 },
        patient: { value: patientName, confidence: 0.9 },
        date: { value: '2026-11-05', confidence: 0.74 },
        medicines: [
          { id: 'o1', name: 'Amoxiclav 625', strength: '625 mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', quantity: 10, confidence: 0.71 },
          { id: 'o2', name: 'Pantosec 4?', strength: '40 mg', dosage: '1 tablet', frequency: 'Once daily before food', duration: '5 days', quantity: 5, confidence: 0.52 },
        ],
        unrecognized: ['"Cef…xo"', '"b.d. x ?d"', '"SOS"'],
      }
    : {
        handwritten, overall: 0.96,
        doctor: { value: 'Dr. Meera Kapoor', confidence: 0.98 },
        patient: { value: patientName, confidence: 0.97 },
        date: { value: '2026-11-05', confidence: 0.99 },
        medicines: [
          { id: 'o1', name: 'Metforin 500', strength: '500 mg', dosage: '1 tablet', frequency: 'Twice daily after meals', duration: '30 days', quantity: 60, confidence: 0.96 },
          { id: 'o2', name: 'Amlocard 5', strength: '5 mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', quantity: 30, confidence: 0.94 },
        ],
        unrecognized: [],
      }
