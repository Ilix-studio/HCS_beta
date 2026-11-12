import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import type { Product } from '../types'
import { addToCart, toggleWishlist, useAppDispatch, useAppSelector } from '../store'
import { useManufacturers, useToast } from '../lib/hooks'
import { formatCurrency, manufacturerName, productImage } from '../lib/utils'
import { AvailabilityBadge, RxBadge } from './StatusBadges'
import { Button } from './ui'

export function ProductCard({ product, list }: { product: Product; list?: boolean }) {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const mfrs = useManufacturers()
  const wished = useAppSelector((s) => s.catalog.wishlist.includes(product.id))
  const out = product.availability === 'out_of_stock'
  const add = () => { dispatch(addToCart({ productId: product.id })); toast('success', `${product.brand} added to cart`) }
  return (
    <article className={`flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md ${list ? 'flex-row' : 'flex-col'}`}>
      <Link to={`/catalog/${product.id}`} className={`relative block shrink-0 bg-slate-50 ${list ? 'w-32 sm:w-44' : 'aspect-square'}`}>
        <img src={productImage(product)} alt={product.brand} loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute top-2 left-2"><RxBadge product={product} /></span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/catalog/${product.id}`} className="block truncate font-semibold text-navy-900 hover:text-teal-700">{product.brand}</Link>
            <p className="truncate text-xs text-slate-500">{product.generic}</p>
          </div>
          <button onClick={() => { dispatch(toggleWishlist(product.id)); toast('info', wished ? 'Removed from wishlist' : 'Saved to wishlist') }} aria-pressed={wished} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} className="cursor-pointer rounded-full p-1.5 hover:bg-slate-100">
            <Heart className={`h-4 w-4 ${wished ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">{manufacturerName(product.manufacturerId, mfrs)}</p>
        <p className="mt-1 text-xs text-slate-600">{product.strength !== '—' && `${product.strength} · `}{product.dosageForm} · {product.packSize}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <div>
            <span className="text-lg font-semibold text-navy-900">{formatCurrency(product.price)}</span>
            {product.mrp > product.price && <span className="ml-1.5 text-xs text-slate-400 line-through">{formatCurrency(product.mrp)}</span>}
          </div>
          <AvailabilityBadge availability={product.availability} />
        </div>
        <Button size="sm" className="mt-3" disabled={out} onClick={add}><ShoppingCart className="h-4 w-4" />{out ? 'Unavailable' : 'Add to Cart'}</Button>
      </div>
    </article>
  )
}
