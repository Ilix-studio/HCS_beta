import { useEffect, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'
import { ArrowDown, ArrowUp, Inbox, X } from 'lucide-react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
const variants: Record<Variant, string> = {
  primary: 'bg-navy-700 text-white hover:bg-navy-800',
  secondary: 'bg-teal-600 text-white hover:bg-teal-700',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' }) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm',
        variants[variant],
        className,
      )}
    />
  )
}

const tones = {
  gray: 'bg-slate-100 text-slate-700',
  green: 'bg-emerald-100 text-emerald-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-navy-100 text-navy-700',
  teal: 'bg-teal-100 text-teal-700',
}
export type Tone = keyof typeof tones
export const Badge = ({ tone = 'gray', children, className }: { tone?: Tone; children: ReactNode; className?: string }) => (
  <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap', tones[tone], className)}>{children}</span>
)

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('rounded-xl border border-slate-200 bg-white p-5 shadow-sm', className)}>{children}</div>
)

export const PageHeader = ({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
    <div>
      <h1 className="text-2xl font-semibold text-navy-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
)

export const StatCard = ({ label, value, icon, hint }: { label: string; value: ReactNode; icon?: ReactNode; hint?: string }) => (
  <Card className="flex items-center gap-4">
    {icon && <div className="rounded-lg bg-teal-50 p-3 text-teal-700">{icon}</div>}
    <div>
      <div className="text-2xl font-semibold text-navy-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
      {hint && <div className="text-xs text-slate-400">{hint}</div>}
    </div>
  </Card>
)

export const Skeleton = ({ className }: { className?: string }) => <div className={cn('animate-pulse rounded-md bg-slate-200', className)} />

export const EmptyState = ({ title, message, action }: { title: string; message?: string; action?: ReactNode }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
    <Inbox className="mb-3 h-10 w-10 text-slate-300" aria-hidden />
    <h3 className="font-medium text-slate-700">{title}</h3>
    {message && <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
)

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onMouseDown={onClose} role="presentation">
      <div role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()} className={cn('max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white shadow-xl', wide ? 'max-w-3xl' : 'max-w-lg')}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="font-semibold text-navy-900">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="cursor-pointer rounded p-1 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange: (t: T) => void }) {
  return (
    <div role="tablist" className="mb-4 flex gap-1 overflow-x-auto border-b border-slate-200">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)}
          className={cn('cursor-pointer border-b-2 px-4 py-2 text-sm font-medium whitespace-nowrap', value === t.id ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800')}>
          {t.label}{t.count !== undefined && <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 text-xs">{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-teal-600 focus:outline-2 focus:outline-teal-600/30 disabled:bg-slate-50'

export const Field = ({ label, error, children, hint }: { label: string; error?: string; children: ReactNode; hint?: string }) => (
  <label className="block text-sm">
    <span className="mb-1 block font-medium text-slate-700">{label}</span>
    {children}
    {hint && !error && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    {error && <span role="alert" className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
)

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => <input ref={ref} {...p} className={cn(inputCls, className)} />)
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...p }, ref) => <select ref={ref} {...p} className={cn(inputCls, className)} />)
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...p }, ref) => <textarea ref={ref} {...p} className={cn(inputCls, className)} />)

export interface Column<T> {
  key: string
  header: string
  sort?: (row: T) => string | number
  render: (row: T) => ReactNode
}

export function DataTable<T>({ rows, columns, rowKey, empty, filter }: { rows: T[]; columns: Column<T>[]; rowKey: (r: T) => string; empty?: string; filter?: { placeholder: string; match: (r: T, q: string) => boolean } }) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [dir, setDir] = useState<1 | -1>(1)
  const [q, setQ] = useState('')
  const col = columns.find((c) => c.key === sortKey)
  let data = filter && q ? rows.filter((r) => filter.match(r, q.toLowerCase())) : rows
  if (col?.sort) {
    const get = col.sort
    data = [...data].sort((a, b) => (get(a) > get(b) ? dir : get(a) < get(b) ? -dir : 0))
  }
  return (
    <div>
      {filter && <Input className="mb-3 max-w-xs" placeholder={filter.placeholder} value={q} onChange={(e) => setQ(e.target.value)} aria-label={filter.placeholder} />}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-medium whitespace-nowrap">
                  {c.sort ? (
                    <button className="inline-flex cursor-pointer items-center gap-1 uppercase" onClick={() => { if (sortKey === c.key) setDir((d) => (d === 1 ? -1 : 1)); else { setSortKey(c.key); setDir(1) } }}>
                      {c.header}{sortKey === c.key && (dir === 1 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                    </button>
                  ) : c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((r) => (
              <tr key={rowKey(r)} className="hover:bg-slate-50">
                {columns.map((c) => <td key={c.key} className="px-4 py-3 align-middle">{c.render(r)}</td>)}
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">{empty ?? 'No records found.'}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
