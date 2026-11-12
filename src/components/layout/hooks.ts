import { useEffect, useRef } from 'react'
import { useAppSelector } from '../../store'
import { patients } from '../../data/patients'
import { doctors } from '../../data/doctors'
import { roleLabel } from './nav'

export function useOutside(close: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [close])
  return ref
}

export function useUserName() {
  const { role, patientId, doctorId, manufacturerId } = useAppSelector((s) => s.session)
  const mfrs = useAppSelector((s) => s.catalog.manufacturers)
  if (role === 'patient') return patients.find((p) => p.id === patientId)?.name ?? ''
  if (role === 'doctor') return doctors.find((d) => d.id === doctorId)?.name ?? ''
  if (role === 'manufacturer') return mfrs.find((m) => m.id === manufacturerId)?.name ?? ''
  return roleLabel[role]
}

export const useNotifUser = () => {
  const { role, patientId } = useAppSelector((s) => s.session)
  return role === 'patient' ? patientId : 'staff'
}
