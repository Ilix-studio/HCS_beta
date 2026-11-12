import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, MapPin, PackageCheck, Sparkles, Truck } from 'lucide-react'
import type { PrescriptionMedicine } from '../types'
import type { OcrResult } from '../lib/ocr'
import { useProducts } from '../lib/hooks'
import { buildLines, deliveryEstimate, linesTotals, type RxLine } from '../lib/rxPricing'
import { formatCurrency } from '../lib/utils'
import { Badge } from './ui'

const STEPS = ['Scanning document', 'Reading text', 'Identifying medicines', 'Matching with catalog', 'Checking availability', 'Estimating delivery to your location']
const STEP_MS = 650

/** Animated "AI reading" sequence shown while the (simulated) analysis runs. */
export function AiReading({ result, onDone }: { result: OcrResult; onDone: () => void }) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (step >= STEPS.length) { const t = setTimeout(onDone, 500); return () => clearTimeout(t) }
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [step, onDone])
  const found = step >= 3 ? result.medicines : []
  return (
    <div className="space-y-4" aria-live="polite">
      <div className="flex items-center gap-2 text-sm font-medium text-navy-800"><Sparkles className="h-4 w-4 animate-pulse text-teal-600" />AI is reading your prescription (simulated)</div>
      <ol className="space-y-2">
        {STEPS.map((label, i) => (
          <li key={label} className={`flex items-center gap-2 text-sm transition-opacity ${i > step ? 'opacity-30' : ''}`}>
            {i < step ? <CheckCircle2 className="h-4 w-4 text-teal-600" /> : i === step ? <Loader2 className="h-4 w-4 animate-spin text-navy-600" /> : <span className="h-4 w-4 rounded-full border border-slate-300" />}
            <span className={i === step ? 'font-medium text-navy-800' : 'text-slate-600'}>{label}{i === step && '…'}</span>
          </li>
        ))}
      </ol>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-600 transition-all duration-500" style={{ width: `${Math.min(100, (step / STEPS.length) * 100)}%` }} /></div>
      {found.length > 0 && (
        <ul className="space-y-2">
          {found.map((m, i) => (
            <li key={m.id} style={{ animationDelay: `${i * 150}ms` }} className="animate-pop flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <span><b>{m.name}</b> <span className="text-slate-500">{m.strength} · {m.frequency}</span></span>
              <Badge tone={m.confidence < 0.8 ? 'amber' : 'green'}>{Math.round(m.confidence * 100)}%</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const statusBadge = (s: RxLine['status']) =>
  s === 'available' ? <Badge tone="green">In stock</Badge> : s === 'low' ? <Badge tone="amber">Low stock</Badge> : s === 'unavailable' ? <Badge tone="red">Unavailable</Badge> : <Badge tone="gray">Not in catalog</Badge>

/** Availability, estimated total and delivery ETA for the medicines on the (editable) review screen. */
export function AvailabilitySummary({ meds, address }: { meds: PrescriptionMedicine[]; address: string }) {
  const products = useProducts()
  const lines = buildLines(meds, products)
  const [checked, setChecked] = useState(0)
  useEffect(() => {
    if (checked >= lines.length) return
    const t = setTimeout(() => setChecked((c) => c + 1), 500)
    return () => clearTimeout(t)
  }, [checked, lines.length])
  const done = checked >= lines.length
  const totals = linesTotals(lines)
  const eta = deliveryEstimate(address)
  const blocked = lines.some((l) => l.status === 'unavailable' || l.status === 'unmatched')

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-900"><PackageCheck className="h-4 w-4 text-teal-600" />Availability & estimated total</h3>
      <ul className="divide-y divide-slate-200 text-sm">
        {lines.map((l, i) => (
          <li key={l.med.id} className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0"><div className="truncate font-medium">{l.med.name || 'Unnamed medicine'}</div>{l.product && <div className="text-xs text-slate-500">{l.packs} × {l.product.packSize} · {formatCurrency(l.product.price)} each</div>}</div>
            <div className="flex items-center gap-3">
              {i < checked ? <>{statusBadge(l.status)}<span className="w-16 text-right font-medium">{l.status === 'unavailable' || l.status === 'unmatched' ? '—' : formatCurrency(l.amount)}</span></> : <span className="flex items-center gap-1.5 text-xs text-slate-500"><Loader2 className="h-3.5 w-3.5 animate-spin" />Checking…</span>}
            </div>
          </li>
        ))}
      </ul>
      {done && (
        <div className="animate-pop space-y-1 border-t border-slate-200 pt-3 text-sm">
          <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-slate-600">Delivery</span><span>{totals.delivery ? formatCurrency(totals.delivery) : 'Free'}</span></div>
          <div className="flex justify-between"><span className="text-slate-600">Tax (5% GST)</span><span>{formatCurrency(totals.tax)}</span></div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-navy-900"><span>Estimated total</span><span>{formatCurrency(totals.total)}</span></div>
          {blocked && <p className="flex items-start gap-1.5 pt-1 text-xs text-amber-800"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />Some items can't be fulfilled right now and are excluded from the total.</p>}
          <div className="mt-3 flex items-start gap-3 rounded-lg bg-white p-3 ring-1 ring-slate-200">
            <Truck className="mt-0.5 h-5 w-5 text-teal-600" />
            <div><div className="font-medium">Delivery by {eta.label}</div><div className="text-xs text-slate-500">{eta.detail}</div><div className="mt-1 flex items-start gap-1 text-xs text-slate-600"><MapPin className="mt-0.5 h-3 w-3 shrink-0" />{address}</div></div>
          </div>
          <p className="pt-1 text-xs text-slate-400">Estimate only. Prescription-only items ship after pharmacist verification.</p>
        </div>
      )}
    </div>
  )
}

export type { PrescriptionMedicine }
