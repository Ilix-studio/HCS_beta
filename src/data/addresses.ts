import type { Address } from '../types'
import { patients } from './patients'

/** One default "Home" address per demo patient, derived from the patient record. */
export const addresses: Address[] = patients.map((p) => ({
  id: `addr-${p.id}`, customerId: p.id, label: 'Home', name: p.name, phone: p.phone,
  line: p.address.replace(/\s*\d{6}\s*$/, ''), pincode: p.address.match(/\d{6}$/)?.[0] ?? '', isDefault: true,
}))
