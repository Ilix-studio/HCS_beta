import type { Product } from '../types'
import { categories } from '../data/categories'
import { manufacturers } from '../data/manufacturers'

export const DEMO_TODAY = '2026-11-12'

export const formatCurrency = (n: number) =>
  '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })

export const formatDate = (iso: string) =>
  new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export const newOrderId = () => 'ORD-' + Date.now().toString().slice(-5)

export const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const addDays = (iso: string, days: number) => {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return toIso(d)
}

export const addMonths = (iso: string, months: number) => {
  const d = new Date(iso + 'T00:00:00')
  d.setMonth(d.getMonth() + months)
  return toIso(d)
}

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')

export const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id
export const manufacturerName = (id: string, list = manufacturers) => list.find((m) => m.id === id)?.name ?? 'Unknown'

const glyphs: Record<string, string> = {
  tablets: '<rect x="70" y="95" width="100" height="50" rx="25" fill="#fff"/><path d="M120 95v50" stroke="#94a3b8" stroke-width="3"/>',
  capsules: '<rect x="65" y="100" width="110" height="42" rx="21" fill="#fff"/><rect x="120" y="100" width="55" height="42" rx="21" fill="#fbbf24"/>',
  syrups: '<rect x="95" y="70" width="50" height="95" rx="10" fill="#fff"/><rect x="105" y="55" width="30" height="18" rx="4" fill="#94a3b8"/><rect x="95" y="105" width="50" height="35" fill="#f87171" opacity=".7"/>',
  device: '<rect x="80" y="75" width="80" height="90" rx="12" fill="#fff"/><circle cx="120" cy="115" r="22" fill="none" stroke="#0d9488" stroke-width="6"/><path d="M120 115l12-10" stroke="#be123c" stroke-width="4"/>',
  kit: '<rect x="70" y="90" width="100" height="70" rx="10" fill="#fff"/><path d="M120 105v40M100 125h40" stroke="#dc2626" stroke-width="10"/>',
  tube: '<path d="M90 80h60l-8 80h-44z" fill="#fff"/><rect x="100" y="64" width="40" height="18" rx="4" fill="#94a3b8"/>',
}

const glyphFor = (p: Product) => {
  const cat = categories.find((c) => c.id === p.categoryId)
  if (cat?.group === 'supply') return p.categoryId.includes('kit') ? glyphs.kit : glyphs.device
  if (p.dosageForm === 'Capsule') return glyphs.capsules
  if (p.dosageForm === 'Syrup' || p.dosageForm === 'Solution') return glyphs.syrups
  if (p.dosageForm === 'Cream') return glyphs.tube
  return glyphs.tablets
}

export const productImage = (p: Product): string => {
  if (p.image) return p.image
  const color = manufacturers.find((m) => m.id === p.manufacturerId)?.color ?? '#1d3f7a'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".18"/><stop offset="1" stop-color="${color}" stop-opacity=".5"/></linearGradient></defs><rect width="240" height="240" fill="url(#g)"/><g>${glyphFor(p)}</g><text x="120" y="206" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="700" fill="${color}">${p.brand.replace(/&/g, '&amp;').slice(0, 22)}</text></svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

export const doctorImage = (d: { id: string; skin: string; hair: string }): string => {
  const bg = ['#c6efe7', '#d9e4f5', '#fde9c8', '#e4dcf7', '#fbd5d5'][Number(d.id.replace(/\D/g, '')) % 5]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="${bg}"/><path d="M30 200c0-45 30-65 70-65s70 20 70 65z" fill="#fff"/><path d="M88 135l12 30 12-30z" fill="#0d9488"/><rect x="88" y="108" width="24" height="28" rx="8" fill="${d.skin}"/><ellipse cx="100" cy="82" rx="30" ry="34" fill="${d.skin}"/><path d="M68 80c-2-30 18-42 34-40 18 0 32 14 30 40-6-14-14-20-32-20s-26 6-32 20z" fill="${d.hair}"/><circle cx="90" cy="86" r="2.6" fill="#222"/><circle cx="110" cy="86" r="2.6" fill="#222"/><path d="M92 99q8 6 16 0" stroke="#7a3b2e" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M76 150q-6 20 6 28M124 150q6 20-6 28" stroke="#94a3b8" stroke-width="3" fill="none"/></svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

export const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(r.error)
    r.readAsDataURL(file)
  })

export const downloadDataUrl = (url: string, name: string) => {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
}

export const downloadText = (text: string, name: string, type = 'text/plain') => {
  const url = URL.createObjectURL(new Blob([text], { type }))
  downloadDataUrl(url, name)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
