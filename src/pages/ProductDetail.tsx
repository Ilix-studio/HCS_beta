import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Minus, Plus, ShieldAlert, ShoppingCart } from 'lucide-react'
import { addToCart, useAppDispatch } from '../store'
import { useManufacturers, useProducts, useToast } from '../lib/hooks'
import { categoryName, formatCurrency, productImage } from '../lib/utils'
import { AvailabilityBadge, RxBadge } from '../components/StatusBadges'
import { Button, Card, EmptyState } from '../components/ui'

export default function ProductDetail() {
  const { productId } = useParams()
  const product = useProducts().find((p) => p.id === productId)
  const mfr = useManufacturers().find((m) => m.id === product?.manufacturerId)
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const toast = useToast()
  const [qty, setQty] = useState(1)
  if (!product) return <EmptyState title="Product not found" action={<Button onClick={() => nav('/catalog')}>Back to catalog</Button>} />
  const out = product.availability === 'out_of_stock'
  const spec: [string, string][] = [
    ['Generic name', product.generic], ['Composition', product.composition], ['Strength', product.strength], ['Dosage form', product.dosageForm],
    ['Pack size', product.packSize], ['Category', categoryName(product.categoryId)], ['Stock', out ? 'Out of stock' : `${product.stock} units`],
  ]
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white"><img src={productImage(product)} alt={product.brand} className="aspect-square w-full object-cover" /></div>
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-2"><RxBadge product={product} /><AvailabilityBadge availability={product.availability} /></div>
          <h1 className="text-2xl font-semibold text-navy-900">{product.brand}</h1>
          <p className="text-slate-500">{product.generic} · by {mfr ? <Link className="text-teal-700 hover:underline" to={`/manufacturers/${mfr.id}`}>{mfr.name}</Link> : 'Unknown'}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-navy-900">{formatCurrency(product.price)}</span>
            {product.mrp > product.price && <><span className="text-slate-400 line-through">{formatCurrency(product.mrp)}</span><span className="text-sm font-medium text-emerald-700">{Math.round((1 - product.price / product.mrp) * 100)}% off MRP</span></>}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-slate-300">
              <button aria-label="Decrease quantity" className="cursor-pointer p-2" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center text-sm" aria-live="polite">{qty}</span>
              <button aria-label="Increase quantity" className="cursor-pointer p-2" onClick={() => setQty(Math.min(product.stock || 1, qty + 1))}><Plus className="h-4 w-4" /></button>
            </div>
            <Button disabled={out} onClick={() => { dispatch(addToCart({ productId: product.id, quantity: qty })); toast('success', `${qty} × ${product.brand} added to cart`) }}><ShoppingCart className="h-4 w-4" />Add to Cart</Button>
            <Button variant="outline" disabled={out} onClick={() => { dispatch(addToCart({ productId: product.id, quantity: qty })); nav('/cart') }}>Buy now</Button>
          </div>
        </div>
        {product.prescriptionRequired && (
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <div><strong>Prescription required.</strong> A valid prescription must be attached before checkout. You can upload one or choose an existing prescription at the cart. <Link className="underline" to="/prescriptions/upload">Upload prescription</Link></div>
          </div>
        )}
        <Card>
          <h2 className="mb-2 font-semibold text-navy-900">Description</h2>
          <p className="text-sm text-slate-600">{product.description}</p>
        </Card>
        <Card>
          <h2 className="mb-2 font-semibold text-navy-900">Product details</h2>
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">{spec.map(([k, v]) => <div key={k}><dt className="text-slate-500">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl>
        </Card>
        {mfr && <Card><h2 className="mb-2 font-semibold text-navy-900">Manufacturer</h2><p className="text-sm"><strong>{mfr.name}</strong> · {mfr.headquarters}</p><p className="text-sm text-slate-600">{mfr.description}</p></Card>}
        <Card><h2 className="mb-2 font-semibold text-navy-900">Safety information</h2><p className="text-sm text-slate-600">{product.safety}</p><p className="mt-2 text-xs text-slate-400">No dosage recommendations are provided here. Follow your doctor's or pharmacist's instructions.</p></Card>
      </div>
    </div>
  )
}
