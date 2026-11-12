import { FileText } from 'lucide-react'

export function FilePreview({ url, type, name, className = 'h-72' }: { url?: string; type?: string; name?: string; className?: string }) {
  if (!url) return <div className={`flex ${className} flex-col items-center justify-center rounded-lg bg-slate-100 text-slate-500`}><FileText className="mb-2 h-8 w-8" /><span className="text-sm">{name ?? 'Preview unavailable'}</span><span className="text-xs">(file too large to keep in demo storage)</span></div>
  if (type === 'application/pdf') return <object data={url} type="application/pdf" className={`w-full ${className} rounded-lg border border-slate-200`} aria-label={name ?? 'PDF preview'}><a href={url} download={name}>Download PDF</a></object>
  return <img src={url} alt={name ?? 'Preview'} className={`w-full ${className} rounded-lg border border-slate-200 bg-slate-50 object-contain`} />
}
