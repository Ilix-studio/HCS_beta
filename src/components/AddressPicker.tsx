import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, Plus, Star, Trash2 } from 'lucide-react'
import { addAddress, removeAddress, setCheckoutOptions, setDefaultAddress, useAppDispatch } from '../store'
import { useAddresses } from '../lib/addresses'
import { useToast } from '../lib/hooks'
import { uid } from '../lib/utils'
import { Badge, Button, Field, Input, Modal, Select } from './ui'

const schema = z.object({
  label: z.enum(['Home', 'Work', 'Other']),
  name: z.string().min(2, 'Enter the recipient name'),
  phone: z.string().regex(/^[+\d][\d\s-]{8,}$/, 'Enter a valid phone number'),
  line: z.string().min(10, 'Enter the full street address and city'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  isDefault: z.boolean(),
})
type Values = z.infer<typeof schema>

function AddressForm({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { patientId, list } = useAddresses()
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { label: 'Home', isDefault: list.length === 0 } })
  const save = (v: Values) => {
    const id = uid('addr')
    dispatch(addAddress({ ...v, id, customerId: patientId }))
    dispatch(setCheckoutOptions({ addressId: id }))
    toast('success', 'Address added')
    onClose()
  }
  return (
    <form onSubmit={handleSubmit(save)} noValidate className="grid gap-3 sm:grid-cols-2">
      <Field label="Label"><Select {...register('label')}><option>Home</option><option>Work</option><option>Other</option></Select></Field>
      <Field label="Recipient name" error={errors.name?.message}><Input {...register('name')} /></Field>
      <Field label="Phone" error={errors.phone?.message}><Input {...register('phone')} /></Field>
      <Field label="Pincode" error={errors.pincode?.message}><Input inputMode="numeric" maxLength={6} {...register('pincode')} /></Field>
      <div className="sm:col-span-2"><Field label="Street address, city" error={errors.line?.message}><Input placeholder="12 Lake View Road, Pune" {...register('line')} /></Field></div>
      <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" {...register('isDefault')} />Make this my default address</label>
      <div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit">Save address</Button></div>
    </form>
  )
}

export function AddressPicker() {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { list, selected } = useAddresses()
  const [adding, setAdding] = useState(false)
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-semibold text-navy-900"><MapPin className="h-4 w-4" />Delivery address</h2><Button size="sm" variant="outline" onClick={() => setAdding(true)}><Plus className="h-3.5 w-3.5" />Add address</Button></div>
      {list.length === 0 && <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">No saved addresses yet. Add one to continue.</p>}
      <div role="radiogroup" aria-label="Delivery address" className="grid gap-2">
        {list.map((a) => (
          <div key={a.id} className={`flex items-start gap-3 rounded-lg border bg-white p-3 text-sm ${selected?.id === a.id ? 'border-teal-600 ring-1 ring-teal-600' : 'border-slate-200'}`}>
            <input type="radio" name="address" aria-label={`Deliver to ${a.label} — ${a.line}`} className="mt-1 cursor-pointer" checked={selected?.id === a.id} onChange={() => dispatch(setCheckoutOptions({ addressId: a.id }))} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{a.name}</span><Badge tone="blue">{a.label}</Badge>{a.isDefault && <Badge tone="green">Default</Badge>}</div>
              <div className="text-slate-600">{a.line} {a.pincode}</div><div className="text-xs text-slate-500">{a.phone}</div>
              <div className="mt-1 flex gap-3 text-xs">
                {!a.isDefault && <button className="flex cursor-pointer items-center gap-1 text-teal-700 hover:underline" onClick={() => { dispatch(setDefaultAddress(a.id)); toast('success', 'Default address updated') }}><Star className="h-3 w-3" />Set as default</button>}
                {list.length > 1 && <button className="flex cursor-pointer items-center gap-1 text-red-600 hover:underline" onClick={() => { dispatch(removeAddress(a.id)); toast('info', 'Address removed') }}><Trash2 className="h-3 w-3" />Remove</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal open={adding} onClose={() => setAdding(false)} title="Add delivery address">{adding && <AddressForm onClose={() => setAdding(false)} />}</Modal>
    </div>
  )
}
