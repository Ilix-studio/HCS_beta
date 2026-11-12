import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, MapPin, Navigation, Star, Video } from 'lucide-react'
import { addNotification, useAppDispatch, useAppSelector } from '../store'
import { doctors } from '../data/doctors'
import { DEMO_TODAY, doctorImage, formatCurrency, formatDate, uid } from '../lib/utils'
import { useToast } from '../lib/hooks'
import type { Doctor } from '../types'
import { Badge, Button, Field, Input, Modal, Select, Textarea } from './ui'

const slots = ['09:00', '10:30', '12:00', '14:30', '16:00', '18:00']

function ConsultModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const patientId = useAppSelector((s) => s.session.patientId)
  const [mode, setMode] = useState<'video' | 'clinic'>('video')
  const [date, setDate] = useState(DEMO_TODAY)
  const [slot, setSlot] = useState(slots[0])
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const book = () => {
    if (date < DEMO_TODAY) return setError('Choose today or a future date.')
    if (reason.trim().length < 5) return setError('Briefly describe the reason for your visit.')
    dispatch(addNotification({ id: uid('n'), userId: patientId, type: 'order', title: 'Consultation booked', message: `${mode === 'video' ? 'Video consultation' : 'Clinic visit'} with ${doctor.name} on ${formatDate(date)} at ${slot}.`, date: DEMO_TODAY, read: false }))
    toast('success', `Consultation requested with ${doctor.name}`)
    setDone(true)
  }

  return (
    <Modal open onClose={onClose} title={done ? 'Request sent' : `Consult ${doctor.name}`}>
      {done ? (
        <div className="space-y-3 text-sm"><p>Your {mode === 'video' ? 'video consultation' : 'clinic visit'} request for <b>{formatDate(date)}</b> at <b>{slot}</b> has been sent to {doctor.name}.</p><p className="text-xs text-slate-500">Demo only — no real appointment is created.</p><div className="flex justify-end"><Button onClick={onClose}>Done</Button></div></div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"><img src={doctorImage(doctor)} alt="" className="h-12 w-12 rounded-full" /><div className="text-sm"><div className="font-medium">{doctor.name}</div><div className="text-slate-500">{doctor.specialty} · {formatCurrency(doctor.fee)} consultation</div></div></div>
          <fieldset className="flex gap-3 text-sm"><legend className="mb-1 font-medium">Consultation type</legend>
            {([['video', 'Video consult'], ['clinic', 'In-clinic visit']] as const).map(([v, l]) => <label key={v} className={`flex flex-1 cursor-pointer items-center gap-2 rounded-lg border p-3 ${mode === v ? 'border-teal-600 bg-teal-50' : 'border-slate-300'}`}><input type="radio" name="mode" checked={mode === v} onChange={() => setMode(v)} />{l}</label>)}</fieldset>
          <div className="grid grid-cols-2 gap-3"><Field label="Date"><Input type="date" min={DEMO_TODAY} value={date} onChange={(e) => setDate(e.target.value)} /></Field><Field label="Time slot"><Select value={slot} onChange={(e) => setSlot(e.target.value)}>{slots.map((s) => <option key={s}>{s}</option>)}</Select></Field></div>
          <Field label="Reason for visit" error={error}><Textarea rows={3} value={reason} onChange={(e) => { setReason(e.target.value); setError('') }} /></Field>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={book}>Confirm request</Button></div>
        </div>
      )}
    </Modal>
  )
}

export function DoctorCard({ doctor, onConsult }: { doctor: Doctor; onConsult: (d: Doctor) => void }) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-3">
        <img src={doctorImage(doctor)} alt={`Portrait of ${doctor.name}`} className="h-20 w-20 shrink-0 rounded-xl object-cover" loading="lazy" />
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-navy-900">{doctor.name}</h3>
          <Badge tone="teal" className="mt-1">{doctor.specialty}</Badge>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{doctor.rating} · {doctor.experience} yrs exp.</p>
        </div>
      </div>
      <div className="mt-3 space-y-1.5 text-sm text-slate-600">
        <p className="flex items-start gap-2"><GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />{doctor.degrees}</p>
        <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /><span>{doctor.location} <span className="font-medium text-teal-700">· {doctor.distanceKm} km away</span></span></p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4"><span className="text-sm font-semibold text-navy-900">{formatCurrency(doctor.fee)}</span><Button size="sm" onClick={() => onConsult(doctor)}><Video className="h-4 w-4" />Consult now</Button></div>
    </article>
  )
}

export function NearbyDoctors({ limit = 10, showFilter = true, id }: { limit?: number; showFilter?: boolean; id?: string }) {
  const [specialty, setSpecialty] = useState('')
  const [target, setTarget] = useState<Doctor | null>(null)
  const list = [...doctors].filter((d) => !specialty || d.specialty === specialty).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit)
  return (
    <section id={id}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div><p className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-widest text-teal-600 uppercase"><Navigation className="h-3.5 w-3.5" />Near you · Pune (demo location)</p><h2 className="text-2xl font-semibold text-navy-900 md:text-3xl">{limit >= doctors.length ? `${doctors.length} doctors near you` : 'Doctors near you'}</h2></div>
        <div className="flex items-center gap-3">
          {showFilter && <Select aria-label="Filter by specialty" className="w-48" value={specialty} onChange={(e) => setSpecialty(e.target.value)}><option value="">All specialties</option>{[...new Set(doctors.map((d) => d.specialty))].map((s) => <option key={s}>{s}</option>)}</Select>}
          <Link to="/doctors" className="text-sm font-medium text-teal-700 hover:underline">View all →</Link>
        </div>
      </div>
      {list.length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No doctors match that specialty nearby.</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{list.map((d) => <DoctorCard key={d.id} doctor={d} onConsult={setTarget} />)}</div>}
      {target && <ConsultModal key={target.id} doctor={target} onClose={() => setTarget(null)} />}
    </section>
  )
}
