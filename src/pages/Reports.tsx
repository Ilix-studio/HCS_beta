import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Download, FileText, FlaskConical, Image as ImageIcon } from 'lucide-react'
import { useAppSelector } from '../store'
import { diagnosticCenters, reportCategories } from '../data/labReports'
import { patients } from '../data/patients'
import { downloadDataUrl, formatDate } from '../lib/utils'
import { makePdfBlob, mockImageReport } from '../lib/pdf'
import type { LabReport } from '../types'
import { FilePreview } from '../components/FilePreview'
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select, StatCard } from '../components/ui'

const center = (id: string) => diagnosticCenters.find((c) => c.id === id)

function reportFile(r: LabReport): { url: string; type: string; name: string } {
  if (r.fileUrl) return { url: r.fileUrl, type: r.kind === 'pdf' ? 'application/pdf' : 'image/*', name: `${r.id}.${r.kind === 'pdf' ? 'pdf' : 'png'}` }
  if (r.kind === 'image') return { url: mockImageReport(r.title, r.category), type: 'image/svg+xml', name: `${r.id}.svg` }
  const p = patients.find((x) => x.id === r.patientId)
  const blob = makePdfBlob(`${center(r.centerId)?.name ?? 'Diagnostic Centre'} - ${r.title}`, [
    'MOCK REPORT - DEMO DATA ONLY, NOT A REAL MEDICAL RECORD', '', `Patient: ${p?.name} (${r.patientId})`, `Report date: ${formatDate(r.date)}`, `Category: ${r.category}`, '', 'Summary:', r.summary, '',
    'Parameter            Result      Reference (demo)', 'Sample value A        12.4        11.0 - 15.0', 'Sample value B        4.8         4.0 - 5.5', 'Sample value C        98          70 - 110',
  ])
  return { url: URL.createObjectURL(blob), type: 'application/pdf', name: `${r.id}.pdf` }
}

export function ReportViewer() {
  const { reportId } = useParams()
  const report = useAppSelector((s) => s.reports).find((r) => r.id === reportId)
  const nav = useNavigate()
  const file = useMemo(() => (report && report.status === 'published' ? reportFile(report) : null), [report])
  if (!report) return <EmptyState title="Report not found" action={<Button onClick={() => nav('/reports')}>Back to reports</Button>} />
  const c = center(report.centerId)
  return (
    <div>
      <PageHeader title={report.title} subtitle={`${report.category} · ${formatDate(report.date)}`} actions={file && <Button onClick={() => downloadDataUrl(file.url, file.name)}><Download className="h-4 w-4" />Download</Button>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {file ? <FilePreview url={file.url} type={file.type} name={file.name} className="h-[70vh]" /> : <EmptyState title="Report pending" message="This report has not been published yet." />}
        <Card className="h-fit space-y-2 text-sm">
          <h2 className="font-semibold text-navy-900">Report details</h2>
          <div><span className="text-slate-500">Patient</span><div>{patients.find((p) => p.id === report.patientId)?.name}</div></div>
          <div><span className="text-slate-500">Diagnostic centre</span><div>{c?.name}, {c?.city}</div><div className="text-slate-500">{c?.phone}</div></div>
          <div><span className="text-slate-500">Summary</span><div>{report.summary}</div></div>
          <Badge tone={report.status === 'published' ? 'green' : 'amber'}>{report.status}</Badge>
        </Card>
      </div>
    </div>
  )
}

export default function Reports() {
  const patientId = useAppSelector((s) => s.session.patientId)
  const all = useAppSelector((s) => s.reports).filter((r) => r.patientId === patientId)
  const [cat, setCat] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [group, setGroup] = useState<'date' | 'category'>('date')
  const published = all.filter((r) => r.status === 'published')
  const rows = published.filter((r) => (!cat || r.category === cat) && (!from || r.date >= from) && (!to || r.date <= to)).sort((a, b) => b.date.localeCompare(a.date))
  const groups = rows.reduce<Record<string, LabReport[]>>((acc, r) => { const k = group === 'date' ? r.date.slice(0, 7) : r.category; (acc[k] ??= []).push(r); return acc }, {})
  const label = (k: string) => (group === 'date' ? new Date(k + '-01T00:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : k)

  return (
    <div>
      <PageHeader title="Lab Reports" subtitle="Securely view and download your diagnostic reports." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total reports" value={all.length} icon={<FlaskConical className="h-5 w-5" />} />
        <StatCard label="Published" value={published.length} />
        <StatCard label="Pending" value={all.length - published.length} />
      </div>
      {all.some((r) => r.status === 'pending') && <Card className="mb-6 border-amber-200 bg-amber-50/50"><h2 className="mb-2 font-semibold text-navy-900">Pending reports</h2>{all.filter((r) => r.status === 'pending').map((r) => <div key={r.id} className="flex justify-between text-sm"><span>{r.title}</span><span className="text-slate-500">Collected {formatDate(r.date)} · {center(r.centerId)?.name}</span></div>)}</Card>}
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <Field label="Category"><Select value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{reportCategories.map((c) => <option key={c}>{c}</option>)}</Select></Field>
        <Field label="From"><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
        <Field label="To"><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
        <Field label="Group by"><Select value={group} onChange={(e) => setGroup(e.target.value as typeof group)}><option value="date">Date</option><option value="category">Diagnostic category</option></Select></Field>
      </div>
      {rows.length === 0 ? <EmptyState title="No reports found" message="Adjust the filters or wait for your diagnostic centre to publish a report." /> : Object.entries(groups).map(([k, list]) => (
        <section key={k} className="mb-6"><h2 className="mb-2 text-sm font-semibold text-slate-500 uppercase">{label(k)}</h2>
          <div className="grid gap-3 md:grid-cols-2">{list.map((r) => (
            <Card key={r.id} className="flex items-center gap-4">
              <div className="rounded-lg bg-navy-50 p-3 text-navy-700">{r.kind === 'pdf' ? <FileText className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}</div>
              <div className="min-w-0 flex-1"><div className="truncate font-medium">{r.title}</div><div className="text-xs text-slate-500">{formatDate(r.date)} · {center(r.centerId)?.name}</div></div>
              <Link to={`/reports/${r.id}`}><Button size="sm" variant="outline">View</Button></Link>
            </Card>))}</div></section>
      ))}
    </div>
  )
}
