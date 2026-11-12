import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { resetDemo, setPatient, useAppDispatch, useAppSelector } from '../store'
import { patients } from '../data/patients'
import { useToast } from '../lib/hooks'
import { Button, Card, Field, Input, PageHeader, Select } from '../components/ui'

const schema = z.object({ name: z.string().min(2, 'Name is required'), email: z.string().email('Enter a valid email'), phone: z.string().min(8, 'Enter a phone number'), address: z.string().min(10, 'Enter your full address') })

export default function Settings() {
  const { role, patientId } = useAppSelector((s) => s.session)
  const dispatch = useAppDispatch()
  const toast = useToast()
  const p = patients.find((x) => x.id === patientId)!
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({ resolver: zodResolver(schema), defaultValues: { name: p.name, email: p.email, phone: p.phone, address: p.address } })
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Account Settings" subtitle="Demo profile — changes are not saved to a server." />
      {role === 'patient' && <Card><Field label="Demo patient account"><Select value={patientId} onChange={(e) => dispatch(setPatient(e.target.value))}>{patients.map((x) => <option key={x.id} value={x.id}>{x.name} ({x.id})</option>)}</Select></Field></Card>}
      <Card><form className="grid gap-3 sm:grid-cols-2" noValidate onSubmit={handleSubmit(() => toast('success', 'Profile saved (demo)'))}>
        <Field label="Name" error={errors.name?.message}><Input {...register('name')} /></Field><Field label="Email" error={errors.email?.message}><Input {...register('email')} /></Field>
        <Field label="Phone" error={errors.phone?.message}><Input {...register('phone')} /></Field><Field label="Address" error={errors.address?.message}><Input {...register('address')} /></Field>
        <div className="sm:col-span-2"><Button type="submit" disabled={!isDirty}>Save changes</Button></div></form></Card>
      <Card><h2 className="mb-2 font-semibold text-navy-900">Demo data</h2><p className="mb-3 text-sm text-slate-600">All data lives in your browser's LocalStorage. Reset to restore the original mock data.</p><Button variant="danger" onClick={resetDemo}>Reset demo data</Button></Card>
    </div>
  )
}
