import { useState } from 'react'
import { Check, Eye, X } from 'lucide-react'
import { addNotification, setPrescriptionStatus, useAppDispatch, useAppSelector } from '../store'
import { useToast } from '../lib/hooks'
import { DEMO_TODAY, formatDate, uid } from '../lib/utils'
import { patients } from '../data/patients'
import type { Prescription, PrescriptionStatus } from '../types'
import { FilePreview } from '../components/FilePreview'
import { PrescriptionStatusBadge } from '../components/StatusBadges'
import { Button, DataTable, EmptyState, Modal, PageHeader, Tabs, Textarea } from '../components/ui'

export function PrescriptionView({ rx }: { rx: Prescription }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid gap-2 sm:grid-cols-2">
        <div><span className="text-slate-500">Doctor</span><div className="font-medium">{rx.doctorName}</div></div>
        <div><span className="text-slate-500">Patient</span><div className="font-medium">{patients.find((p) => p.id === rx.patientId)?.name}</div></div>
        <div><span className="text-slate-500">Date</span><div className="font-medium">{formatDate(rx.date)}</div></div>
        <div><span className="text-slate-500">Status</span><div><PrescriptionStatusBadge status={rx.status} /></div></div>
        {rx.validUntil && <div><span className="text-slate-500">Valid until</span><div className="font-medium">{formatDate(rx.validUntil)}</div></div>}
        {rx.diagnosis && <div><span className="text-slate-500">Diagnosis</span><div className="font-medium">{rx.diagnosis}</div></div>}
      </div>
      {rx.rejectionReason && <p className="rounded-lg bg-red-50 p-3 text-red-800">Rejected: {rx.rejectionReason}</p>}
      <table className="w-full text-left"><thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="p-2">Medicine</th><th className="p-2">Strength</th><th className="p-2">Dosage</th><th className="p-2">Frequency</th><th className="p-2">Duration</th><th className="p-2">Qty</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{rx.medicines.map((m) => <tr key={m.id}><td className="p-2 font-medium">{m.name}</td><td className="p-2">{m.strength}</td><td className="p-2">{m.dosage}</td><td className="p-2">{m.frequency}</td><td className="p-2">{m.duration}</td><td className="p-2">{m.quantity}</td></tr>)}</tbody></table>
      {rx.source === 'upload' && <FilePreview url={rx.fileUrl} type={rx.fileType} name={rx.fileName} />}
    </div>
  )
}

export default function Prescriptions() {
  const { role, patientId } = useAppSelector((s) => s.session)
  const all = useAppSelector((s) => s.prescriptions)
  const dispatch = useAppDispatch()
  const toast = useToast()
  const staff = role === 'fulfillment' || role === 'admin'
  const mine = staff ? all : all.filter((p) => p.patientId === patientId)
  const [tab, setTab] = useState<'all' | PrescriptionStatus>('all')
  const [view, setView] = useState<Prescription | null>(null)
  const [reject, setReject] = useState<Prescription | null>(null)
  const [reason, setReason] = useState('')
  const rows = tab === 'all' ? mine : mine.filter((p) => p.status === tab)
  const count = (s: PrescriptionStatus) => mine.filter((p) => p.status === s).length

  const decide = (rx: Prescription, status: PrescriptionStatus, why?: string) => {
    dispatch(setPrescriptionStatus({ id: rx.id, status, reason: why }))
    dispatch(addNotification({ id: uid('n'), userId: rx.patientId, type: 'prescription', title: status === 'verified' ? 'Prescription verified' : 'Prescription rejected', message: status === 'verified' ? 'Your prescription was verified by a pharmacist.' : `Your prescription was rejected: ${why}`, date: DEMO_TODAY, read: false, link: '/prescriptions' }))
    toast(status === 'verified' ? 'success' : 'info', `Prescription ${status}`)
  }

  return (
    <div>
      <PageHeader title="Prescription Management" subtitle={staff ? 'Review and verify patient prescriptions.' : 'Your uploaded and doctor-issued prescriptions.'} />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'all', label: 'All', count: mine.length }, { id: 'awaiting_verification', label: 'Awaiting verification', count: count('awaiting_verification') }, { id: 'verified', label: 'Verified', count: count('verified') }, { id: 'rejected', label: 'Rejected', count: count('rejected') }]} />
      {rows.length === 0 ? <EmptyState title="No prescriptions" message="Prescriptions will appear here once they are issued or submitted." /> : (
        <DataTable rows={rows} rowKey={(r) => r.id} filter={{ placeholder: 'Search doctor or medicine…', match: (r, q) => r.doctorName.toLowerCase().includes(q) || r.medicines.some((m) => m.name.toLowerCase().includes(q)) }} columns={[
          { key: 'id', header: 'ID', sort: (r) => r.id, render: (r) => r.id },
          ...(staff ? [{ key: 'patient', header: 'Patient', render: (r: Prescription) => patients.find((p) => p.id === r.patientId)?.name }] : []),
          { key: 'doctor', header: 'Doctor', sort: (r) => r.doctorName, render: (r) => r.doctorName },
          { key: 'date', header: 'Date', sort: (r) => r.date, render: (r) => formatDate(r.date) },
          { key: 'src', header: 'Source', render: (r) => (r.source === 'upload' ? 'Uploaded' : 'Doctor-issued') },
          { key: 'meds', header: 'Medicines', render: (r) => r.medicines.map((m) => m.name).join(', ') },
          { key: 'status', header: 'Status', sort: (r) => r.status, render: (r) => <PrescriptionStatusBadge status={r.status} /> },
          { key: 'act', header: '', render: (r) => (
            <div className="flex gap-1">
              <Button size="sm" variant="outline" aria-label={`View ${r.id}`} onClick={() => setView(r)}><Eye className="h-3.5 w-3.5" />View</Button>
              {r.status === 'awaiting_verification' && <>
                <Button size="sm" variant="secondary" disabled={!staff} title={staff ? undefined : 'Only a pharmacist or admin can approve'} aria-label={`Approve ${r.id}`} onClick={() => decide(r, 'verified')}><Check className="h-3.5 w-3.5" />Approve</Button>
                <Button size="sm" variant="danger" disabled={!staff} title={staff ? undefined : 'Only a pharmacist or admin can reject'} aria-label={`Reject ${r.id}`} onClick={() => { setReject(r); setReason('') }}><X className="h-3.5 w-3.5" />Reject</Button>
              </>}
            </div>
          ) },
        ]} />
      )}
      <Modal open={!!view} onClose={() => setView(null)} title={`Prescription ${view?.id ?? ''}`} wide>{view && <PrescriptionView rx={view} />}</Modal>
      <Modal open={!!reject} onClose={() => setReject(null)} title="Reject prescription">
        <Textarea rows={3} placeholder="Reason for rejection (required)" aria-label="Rejection reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        <div className="mt-3 flex justify-end gap-2"><Button variant="outline" onClick={() => setReject(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => { if (!reason.trim()) { toast('error', 'Enter a reason'); return } if (reject) decide(reject, 'rejected', reason.trim()); setReject(null) }}>Reject</Button></div>
      </Modal>
    </div>
  )
}
