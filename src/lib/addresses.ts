import { useAppSelector } from '../store'
import type { Address } from '../types'

export const formatAddress = (a: Pick<Address, 'line' | 'pincode'>) => `${a.line} ${a.pincode}`.trim()

/** The current patient's saved addresses and the one selected for checkout (falls back to the default). */
export const useAddresses = () => {
  const patientId = useAppSelector((s) => s.session.patientId)
  const all = useAppSelector((s) => s.addresses)
  const selectedId = useAppSelector((s) => s.cart.addressId)
  const list = all.filter((a) => a.customerId === patientId)
  const selected = list.find((a) => a.id === selectedId) ?? list.find((a) => a.isDefault) ?? list[0]
  return { list, selected, patientId }
}
