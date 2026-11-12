import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, Eye, ImagePlus, Pencil, Plus, Trash2 } from 'lucide-react'
import { removeProduct, setManufacturer, upsertManufacturer, upsertProduct, useAppDispatch, useAppSelector } from '../store'
import { categories } from '../data/categories'
import { DEMO_TODAY, categoryName, formatCurrency, formatDate, productImage, readFileAsDataUrl, uid } from '../lib/utils'
import { useToast } from '../lib/hooks'
import type { Availability, Manufacturer, Product } from '../types'
import { AvailabilityBadge, RxBadge } from '../components/StatusBadges'
import { Badge, Button, Card, DataTable, EmptyState, Field, Input, Modal, PageHeader, Select, StatCard, Textarea } from '../components/ui'

const useMine = () => {
  const id = useAppSelector((s) => s.session.manufacturerId)
  const mfr = useAppSelector((s) => s.catalog.manufacturers).find((m) => m.id === id)
  const products = useAppSelector((s) => s.catalog.products).filter((p) => p.manufacturerId === id)
  return { mfr, products, id }
}

const profileSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  description: z.string().min(20, 'Describe the company in at least 20 characters'),
  headquarters: z.string().min(2, 'Headquarters is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(8, 'Enter a phone number'),
  website: z.string().url('Enter a full URL, e.g. https://example.com'),
  registration: z.string().min(5, 'Registration number is required'),
  categories: z.string().min(1, 'Select at least one product category'),
})
type ProfileValues = z.infer<typeof profileSchema>

function ProfileForm({ mfr, creating, onClose }: { mfr?: Manufacturer; creating: boolean; onClose: () => void }) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: creating ? { categories: 'tablets' } : { ...mfr, categories: mfr?.categories.join(',') },
  })
  const [color] = useState(mfr?.color ?? '#1d3f7a')
  const save = (v: ProfileValues) => {
    const id = creating ? uid('m').toLowerCase() : mfr!.id
    dispatch(upsertManufacturer({ ...v, id, color: creating ? '#0d9488' : color, categories: v.categories.split(',').filter(Boolean) }))
    if (creating) dispatch(setManufacturer(id))
    toast('success', creating ? 'Manufacturer profile created' : 'Profile updated')
    onClose()
  }
  return (
    <form onSubmit={handleSubmit(save)} noValidate className="grid gap-3 sm:grid-cols-2">
      <Field label="Company name" error={errors.name?.message}><Input {...register('name')} /></Field>
      <Field label="Headquarters" error={errors.headquarters?.message}><Input {...register('headquarters')} /></Field>
      <div className="sm:col-span-2"><Field label="Description" error={errors.description?.message}><Textarea rows={3} {...register('description')} /></Field></div>
      <Field label="Contact email" error={errors.email?.message}><Input {...register('email')} /></Field>
      <Field label="Phone" error={errors.phone?.message}><Input {...register('phone')} /></Field>
      <Field label="Website" error={errors.website?.message}><Input {...register('website')} /></Field>
      <Field label="Business registration (mock)" error={errors.registration?.message}><Input {...register('registration')} /></Field>
      <div className="sm:col-span-2"><Field label="Product categories (hold Ctrl/Cmd for multiple)" error={errors.categories?.message}>
        <select multiple size={5} className="w-full rounded-lg border border-slate-300 p-2 text-sm" aria-label="Product categories" defaultValue={mfr?.categories ?? ['tablets']} onChange={(e) => setValue('categories', [...e.target.selectedOptions].map((o) => o.value).join(','), { shouldValidate: true })}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <input type="hidden" {...register('categories')} /></Field></div>
      <div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit">{creating ? 'Create profile' : 'Save profile'}</Button></div>
    </form>
  )
}

export function ManufacturerDashboard() {
  const { mfr, products } = useMine()
  const [modal, setModal] = useState<'edit' | 'create' | null>(null)
  const active = products.filter((p) => p.status === 'active')
  const cats = [...new Set(products.map((p) => p.categoryId))]
  const recent = [...products].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6)
  if (!mfr) return <EmptyState title="No manufacturer profile" action={<Button onClick={() => setModal('create')}>Create profile</Button>} />
  return (
    <div>
      <PageHeader title={mfr.name} subtitle={`${mfr.headquarters} · Reg. ${mfr.registration}`} actions={<><Button variant="outline" onClick={() => setModal('create')}><Building2 className="h-4 w-4" />Register new company</Button><Button variant="outline" onClick={() => setModal('edit')}><Pencil className="h-4 w-4" />Edit profile</Button><Link to={`/manufacturers/${mfr.id}`}><Button><Eye className="h-4 w-4" />Public profile</Button></Link></>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Listed medicines" value={products.length} /><StatCard label="Active listings" value={active.length} /><StatCard label="Pending listings" value={products.length - active.length} /><StatCard label="Product categories" value={cats.length} /></div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><h2 className="mb-3 font-semibold text-navy-900">Recent product activity</h2>{recent.length === 0 ? <p className="text-sm text-slate-500">No products yet.</p> : <ul className="divide-y divide-slate-100 text-sm">{recent.map((p) => <li key={p.id} className="flex justify-between py-2"><span>{p.brand}</span><span className="text-slate-500">Updated {formatDate(p.updatedAt)} · <Badge tone={p.status === 'active' ? 'green' : 'amber'}>{p.status}</Badge></span></li>)}</ul>}</Card>
        <Card><h2 className="mb-3 font-semibold text-navy-900">Categories</h2><div className="flex flex-wrap gap-2">{cats.map((c) => <Badge key={c} tone="teal">{categoryName(c)}</Badge>)}{cats.length === 0 && <p className="text-sm text-slate-500">None yet.</p>}</div><Link to="/manufacturer/products"><Button className="mt-4"><Plus className="h-4 w-4" />Manage products</Button></Link></Card>
      </div>
      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'create' ? 'Register manufacturer' : 'Edit manufacturer profile'} wide>
        {modal && <ProfileForm key={modal} mfr={modal === 'edit' ? mfr : undefined} creating={modal === 'create'} onClose={() => setModal(null)} />}
      </Modal>
    </div>
  )
}

const productSchema = z.object({
  brand: z.string().min(2, 'Brand name is required'),
  generic: z.string().min(2, 'Generic name is required'),
  categoryId: z.string().min(1),
  composition: z.string().min(2, 'Composition is required'),
  strength: z.string().min(1, 'Strength is required (use — if not applicable)'),
  dosageForm: z.string().min(2, 'Select a dosage form'),
  packSize: z.string().min(2, 'Packaging info is required'),
  mrp: z.coerce.number().positive('MRP must be greater than 0'),
  price: z.coerce.number().positive('Selling price must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  availability: z.enum(['in_stock', 'low_stock', 'out_of_stock']),
  prescriptionRequired: z.enum(['yes', 'no']),
  description: z.string().min(10, 'Add a short description'),
}).refine((v) => v.price <= v.mrp, { path: ['price'], message: 'Selling price cannot exceed MRP' })
type ProductInput = z.input<typeof productSchema>
type ProductValues = z.output<typeof productSchema>
const forms = ['Tablet', 'Capsule', 'Syrup', 'Cream', 'Solution', 'Powder', 'Injection', 'Device', 'Kit', 'Strips']

function ProductForm({ product, mfrId, onClose }: { product?: Product; mfrId: string; onClose: () => void }) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [image, setImage] = useState(product?.image)
  const { register, handleSubmit, formState: { errors } } = useForm<ProductInput, unknown, ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? { ...product, prescriptionRequired: product.prescriptionRequired ? 'yes' : 'no' } : { categoryId: 'tablets', dosageForm: 'Tablet', availability: 'in_stock', prescriptionRequired: 'no', stock: 100 },
  })
  const save = (v: ProductValues) => {
    const { prescriptionRequired, ...rest } = v
    dispatch(upsertProduct({
      popularity: 50, safety: 'Read the label and patient information leaflet. Consult a doctor or pharmacist if unsure.', ...product, ...rest,
      id: product?.id ?? uid('p').toLowerCase(), manufacturerId: mfrId, prescriptionRequired: prescriptionRequired === 'yes', image, status: product?.status ?? 'pending', updatedAt: DEMO_TODAY,
      availability: rest.availability as Availability,
    }))
    toast('success', product ? 'Listing updated' : 'Listing submitted — pending approval')
    onClose()
  }
  const onImage = async (f?: File) => {
    if (!f) return
    if (!f.type.startsWith('image/') || f.size > 500_000) return toast('error', 'Choose an image under 500 KB.')
    setImage(await readFileAsDataUrl(f))
  }
  return (
    <form onSubmit={handleSubmit(save)} noValidate className="grid gap-3 sm:grid-cols-2">
      <Field label="Brand name" error={errors.brand?.message}><Input {...register('brand')} /></Field>
      <Field label="Generic name" error={errors.generic?.message}><Input {...register('generic')} /></Field>
      <Field label="Category"><Select {...register('categoryId')}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
      <Field label="Dosage form" error={errors.dosageForm?.message}><Select {...register('dosageForm')}>{forms.map((f) => <option key={f}>{f}</option>)}</Select></Field>
      <Field label="Composition" error={errors.composition?.message}><Input {...register('composition')} /></Field>
      <Field label="Strength" error={errors.strength?.message}><Input {...register('strength')} /></Field>
      <Field label="Packaging" error={errors.packSize?.message}><Input placeholder="Strip of 10" {...register('packSize')} /></Field>
      <Field label="Stock units" error={errors.stock?.message}><Input type="number" {...register('stock')} /></Field>
      <Field label="MRP (₹)" error={errors.mrp?.message}><Input type="number" step="0.01" {...register('mrp')} /></Field>
      <Field label="Selling price (₹)" error={errors.price?.message}><Input type="number" step="0.01" {...register('price')} /></Field>
      <Field label="Availability"><Select {...register('availability')}><option value="in_stock">In stock</option><option value="low_stock">Low stock</option><option value="out_of_stock">Out of stock</option></Select></Field>
      <Field label="Prescription requirement"><Select {...register('prescriptionRequired')}><option value="no">OTC</option><option value="yes">Prescription required</option></Select></Field>
      <div className="sm:col-span-2"><Field label="Description" error={errors.description?.message}><Textarea rows={3} {...register('description')} /></Field></div>
      <div className="flex items-center gap-3 sm:col-span-2">
        {image ? <img src={image} alt="Product" className="h-16 w-16 rounded-lg object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-400"><ImagePlus className="h-6 w-6" /></div>}
        <label className="text-sm"><span className="mb-1 block font-medium">Product image (optional)</span><input type="file" accept="image/*" onChange={(e) => onImage(e.target.files?.[0])} /></label>
        {image && <Button type="button" size="sm" variant="ghost" onClick={() => setImage(undefined)}>Remove</Button>}
      </div>
      <div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit">{product ? 'Save changes' : 'Add medicine'}</Button></div>
    </form>
  )
}

export function ManufacturerProducts() {
  const { mfr, products, id } = useMine()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  if (!mfr) return <EmptyState title="Create a manufacturer profile first" action={<Link to="/manufacturer/dashboard"><Button>Go to dashboard</Button></Link>} />
  return (
    <div>
      <PageHeader title="Product Management" subtitle={`${products.length} listings for ${mfr.name}`} actions={<Button onClick={() => setEditing('new')}><Plus className="h-4 w-4" />Add medicine</Button>} />
      <DataTable rows={products} rowKey={(p) => p.id} empty="No products listed yet." filter={{ placeholder: 'Search your products…', match: (p, q) => `${p.brand} ${p.generic}`.toLowerCase().includes(q) }} columns={[
        { key: 'img', header: '', render: (p) => <img src={productImage(p)} alt="" className="h-10 w-10 rounded object-cover" /> },
        { key: 'brand', header: 'Product', sort: (p) => p.brand, render: (p) => <div><div className="font-medium">{p.brand}</div><div className="text-xs text-slate-500">{p.generic} · {p.strength}</div></div> },
        { key: 'cat', header: 'Category', sort: (p) => p.categoryId, render: (p) => categoryName(p.categoryId) },
        { key: 'price', header: 'Price / MRP', sort: (p) => p.price, render: (p) => <span>{formatCurrency(p.price)} <span className="text-slate-400 line-through">{formatCurrency(p.mrp)}</span></span> },
        { key: 'rx', header: 'Rx', render: (p) => <RxBadge product={p} /> },
        { key: 'stock', header: 'Availability', render: (p) => <AvailabilityBadge availability={p.availability} /> },
        { key: 'status', header: 'Listing', sort: (p) => p.status, render: (p) => <Badge tone={p.status === 'active' ? 'green' : 'amber'}>{p.status}</Badge> },
        { key: 'act', header: '', render: (p) => <div className="flex gap-1"><Button size="sm" variant="outline" aria-label={`Edit ${p.brand}`} onClick={() => setEditing(p)}><Pencil className="h-3.5 w-3.5" /></Button><Button size="sm" variant="outline" aria-label={`Remove ${p.brand}`} onClick={() => setDeleting(p)}><Trash2 className="h-3.5 w-3.5 text-red-600" /></Button></div> },
      ]} />
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add medicine' : 'Edit listing'} wide>
        {editing && <ProductForm product={editing === 'new' ? undefined : editing} mfrId={id} onClose={() => setEditing(null)} />}
      </Modal>
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Remove listing">
        <p className="text-sm">Remove <strong>{deleting?.brand}</strong> from the catalog? This cannot be undone.</p>
        <div className="mt-4 flex justify-end gap-2"><Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button><Button variant="danger" onClick={() => { if (deleting) { dispatch(removeProduct(deleting.id)); toast('success', 'Listing removed') } setDeleting(null) }}>Remove</Button></div>
      </Modal>
    </div>
  )
}
