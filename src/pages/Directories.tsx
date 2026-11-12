import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { useAppSelector } from '../store'
import { categoryName } from '../lib/utils'
import { NearbyDoctors } from '../components/NearbyDoctors'
import { Badge, Card, PageHeader } from '../components/ui'

export function Doctors() {
  return (
    <div>
      <PageHeader title="Doctors" subtitle="Registered practitioners near you (mock registrations)." />
      <NearbyDoctors />
    </div>
  )
}

export function Manufacturers() {
  const mfrs = useAppSelector((s) => s.catalog.manufacturers)
  const products = useAppSelector((s) => s.catalog.products)
  return (
    <div>
      <PageHeader title="Manufacturers" subtitle="Browse manufacturer profiles and their product catalogs." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mfrs.map((m) => (
          <Link key={m.id} to={`/manufacturers/${m.id}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <div className="mb-2 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold text-white" style={{ background: m.color }}>{m.name[0]}</div><div><h2 className="font-semibold text-navy-900">{m.name}</h2><p className="text-xs text-slate-500"><Building2 className="mr-1 inline h-3 w-3" />{m.headquarters}</p></div></div>
              <p className="line-clamp-2 text-sm text-slate-600">{m.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">{m.categories.slice(0, 4).map((c) => <Badge key={c}>{categoryName(c)}</Badge>)}</div>
              <p className="mt-3 text-xs text-slate-500">{products.filter((p) => p.manufacturerId === m.id && p.status === 'active').length} listed products</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
