import { useEffect } from 'react'
import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { dismissToast, useAppDispatch, useAppSelector } from '../../store'
import type { Toast } from '../../store/slices'

function ToastItem({ toast }: { toast: Toast }) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const t = setTimeout(() => dispatch(dismissToast(toast.id)), 3500)
    return () => clearTimeout(t)
  }, [dispatch, toast.id])
  const Icon = toast.kind === 'success' ? CheckCircle2 : toast.kind === 'error' ? XCircle : Info
  const color = toast.kind === 'success' ? 'text-emerald-600' : toast.kind === 'error' ? 'text-red-600' : 'text-navy-600'
  return (
    <div role="status" className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-lg">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
      <span>{toast.message}</span>
    </div>
  )
}

export function Toaster() {
  const toasts = useAppSelector((s) => s.toasts)
  return <div className="no-print fixed right-4 bottom-4 z-[60] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">{toasts.map((t) => <ToastItem key={t.id} toast={t} />)}</div>
}
