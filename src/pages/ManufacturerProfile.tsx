import { useNavigate, useParams } from 'react-router-dom'
import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import { useManufacturers } from '../lib/hooks'
import { categoryName } from '../lib/utils'
import { Badge, Button, Card, EmptyState } from '../components/ui'
import Catalog from './Catalog'

export default function ManufacturerProfile() {
  const { manufacturerId } = useParams()
  const m = useManufacturers().find((x) => x.id === manufacturerId)
  const nav = useNavigate()
  if (!m) return <EmptyState title="Manufacturer not found" action={<Button onClick={() => nav('/manufacturers')}>Back to manufacturers</Button>} />
  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-xl text-3xl font-bold text-white" style={{ background: m.color }} aria-label="Company logo">{m.name[0]}</div>
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-2xl font-semibold text-navy-900">{m.name}</h1>
          <p className="text-sm text-slate-600">{m.description}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
            <span><MapPin className="mr-1 inline h-3.5 w-3.5" />{m.headquarters}</span><span><Mail className="mr-1 inline h-3.5 w-3.5" />{m.email}</span><span><Phone className="mr-1 inline h-3.5 w-3.5" />{m.phone}</span>
            <a className="text-teal-700 hover:underline" href={m.website} target="_blank" rel="noreferrer"><Globe className="mr-1 inline h-3.5 w-3.5" />Website</a>
          </div>
          <div className="flex flex-wrap items-center gap-1">{m.categories.map((c) => <Badge key={c} tone="teal">{categoryName(c)}</Badge>)}<Badge>Reg. {m.registration} (mock)</Badge></div>
        </div>
      </Card>
      <h2 className="text-lg font-semibold text-navy-900">Product catalog</h2>
      <Catalog lockedManufacturer={m.id} />
    </div>
  )
}
