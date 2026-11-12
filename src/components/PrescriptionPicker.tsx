import { Link } from 'react-router-dom'
import { FileText, Upload } from 'lucide-react'
import { selectCartPrescription, useAppDispatch, useAppSelector } from '../store'
import { formatDate } from '../lib/utils'
import { PrescriptionStatusBadge } from './StatusBadges'
import { Card } from './ui'

/** Lets a patient attach one of their existing prescriptions to the cart. Only verified or pending-verification prescriptions qualify. */
export function PrescriptionPicker() {
  const dispatch = useAppDispatch()
  const patientId = useAppSelector((s) => s.session.patientId)
  const selected = useAppSelector((s) => s.cart.prescriptionId)
  const list = useAppSelector((s) => s.prescriptions).filter((p) => p.patientId === patientId)
  return (
    <Card className="border-amber-200 bg-amber-50/40">
      <h2 className="mb-1 flex items-center gap-2 font-semibold text-navy-900"><FileText className="h-4 w-4" />Prescription required</h2>
      <p className="mb-3 text-sm text-slate-600">Your cart contains prescription-only medicines. Attach a prescription — it must be verified before the order can be packed.</p>
      <div className="space-y-2">
        {list.length === 0 && <p className="text-sm text-slate-500">You have no prescriptions on file.</p>}
        {list.map((p) => {
          const usable = p.status === 'verified' || p.status === 'awaiting_verification'
          return (
            <label key={p.id} className={`flex items-start gap-3 rounded-lg border bg-white p-3 text-sm ${usable ? 'cursor-pointer' : 'opacity-60'} ${selected === p.id ? 'border-teal-600 ring-1 ring-teal-600' : 'border-slate-200'}`}>
              <input type="radio" name="rx" disabled={!usable} checked={selected === p.id} onChange={() => dispatch(selectCartPrescription(p.id))} className="mt-1" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-medium">{p.doctorName} · {formatDate(p.date)}</span><PrescriptionStatusBadge status={p.status} /></div>
                <div className="text-slate-500">{p.medicines.map((m) => m.name).join(', ') || 'No medicines extracted'}</div>
              </div>
            </label>
          )
        })}
      </div>
      <Link to="/prescriptions/upload?returnTo=/cart" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:underline"><Upload className="h-4 w-4" />Upload a new prescription</Link>
    </Card>
  )
}
