import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react'
import { categories } from '../data/categories'
import { useFakeLoading, useManufacturers, useProducts } from '../lib/hooks'
import { manufacturerName } from '../lib/utils'
import { ProductCard } from '../components/ProductCard'
import { Button, EmptyState, Field, Input, PageHeader, Select, Skeleton } from '../components/ui'

type Sort = 'popularity' | 'price_asc' | 'price_desc' | 'name'

export default function Catalog({ lockedManufacturer }: { lockedManufacturer?: string } = {}) {
  const products = useProducts()
  const mfrs = useManufacturers()
  const loading = useFakeLoading()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [group, setGroup] = useState<'all' | 'medicine' | 'supply'>('all')
  const [cat, setCat] = useState(params.get('category') ?? '')
  const [mfr, setMfr] = useState(lockedManufacturer ?? '')
  const [rx, setRx] = useState<'all' | 'otc' | 'rx'>('all')
  const [avail, setAvail] = useState<'all' | 'in'>('all')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [sort, setSort] = useState<Sort>('popularity')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const list = products.filter((p) => {
      if (p.status !== 'active') return false
      const c = categories.find((x) => x.id === p.categoryId)
      if (group !== 'all' && c?.group !== group) return false
      if (cat && p.categoryId !== cat) return false
      if (mfr && p.manufacturerId !== mfr) return false
      if (rx === 'otc' && p.prescriptionRequired) return false
      if (rx === 'rx' && !p.prescriptionRequired) return false
      if (avail === 'in' && p.availability === 'out_of_stock') return false
      if (min && p.price < Number(min)) return false
      if (max && p.price > Number(max)) return false
      if (!term) return true
      return [p.brand, p.generic, p.composition, p.dosageForm, manufacturerName(p.manufacturerId, mfrs)].some((s) => s.toLowerCase().includes(term))
    })
    const cmp: Record<Sort, (a: typeof list[number], b: typeof list[number]) => number> = {
      popularity: (a, b) => b.popularity - a.popularity,
      price_asc: (a, b) => a.price - b.price,
      price_desc: (a, b) => b.price - a.price,
      name: (a, b) => a.brand.localeCompare(b.brand),
    }
    return list.sort(cmp[sort])
  }, [products, mfrs, q, group, cat, mfr, rx, avail, min, max, sort])

  const clear = () => { setParams({}); setGroup('all'); setCat(''); setMfr(lockedManufacturer ?? ''); setRx('all'); setAvail('all'); setMin(''); setMax('') }
  const visibleCats = categories.filter((c) => group === 'all' || c.group === group)

  const filters = (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <Field label="Type">
        <Select value={group} onChange={(e) => { setGroup(e.target.value as typeof group); setCat('') }}>
          <option value="all">Medicines & supplies</option><option value="medicine">Medicines</option><option value="supply">Medical supplies</option>
        </Select>
      </Field>
      <Field label="Category">
        <Select value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{visibleCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
      </Field>
      {!lockedManufacturer && (
        <Field label="Manufacturer">
          <Select value={mfr} onChange={(e) => setMfr(e.target.value)}><option value="">All manufacturers</option>{mfrs.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</Select>
        </Field>
      )}
      <Field label="Prescription">
        <Select value={rx} onChange={(e) => setRx(e.target.value as typeof rx)}><option value="all">All</option><option value="otc">OTC only</option><option value="rx">Prescription required</option></Select>
      </Field>
      <Field label="Availability">
        <Select value={avail} onChange={(e) => setAvail(e.target.value as typeof avail)}><option value="all">All</option><option value="in">Available only</option></Select>
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Min ₹"><Input type="number" min={0} value={min} onChange={(e) => setMin(e.target.value)} /></Field>
        <Field label="Max ₹"><Input type="number" min={0} value={max} onChange={(e) => setMax(e.target.value)} /></Field>
      </div>
      <Button variant="outline" className="w-full" onClick={clear}>Clear filters</Button>
    </div>
  )

  return (
    <div>
      {!lockedManufacturer && <PageHeader title="Medicine Catalog" subtitle="Medicines and medical supplies from verified manufacturers." />}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input className="max-w-sm flex-1" placeholder="Search name, brand, generic, composition, manufacturer…" aria-label="Search catalog" value={q} onChange={(e) => { const next = new URLSearchParams(params); if (e.target.value) next.set('q', e.target.value); else next.delete('q'); setParams(next, { replace: true }) }} />
        <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal className="h-4 w-4" />Filters</Button>
        <Select aria-label="Sort" className="w-44" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
          <option value="popularity">Most popular</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="name">Name A–Z</option>
        </Select>
        <div className="flex overflow-hidden rounded-lg border border-slate-300">
          <button aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => setView('grid')} className={`cursor-pointer p-2 ${view === 'grid' ? 'bg-navy-700 text-white' : 'bg-white'}`}><LayoutGrid className="h-4 w-4" /></button>
          <button aria-label="List view" aria-pressed={view === 'list'} onClick={() => setView('list')} className={`cursor-pointer p-2 ${view === 'list' ? 'bg-navy-700 text-white' : 'bg-white'}`}><List className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <div className={showFilters ? 'block' : 'hidden lg:block'}>{filters}</div>
        <div>
          <p className="mb-3 text-sm text-slate-500" aria-live="polite">{loading ? 'Loading…' : `${results.length} product${results.length === 1 ? '' : 's'}`}</p>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-80" />)}</div>
          ) : results.length === 0 ? (
            <EmptyState title="No products match" message="Try a different search term or clear some filters." action={<Button onClick={clear}>Clear filters</Button>} />
          ) : (
            <div className={view === 'grid' ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-3'}>
              {results.map((p) => <ProductCard key={p.id} product={p} list={view === 'list'} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
