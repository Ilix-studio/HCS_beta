import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, ShoppingCart, Trash2, UploadCloud } from 'lucide-react'
import { addManyToCart, addNotification, addPrescription, selectCartPrescription, setCheckoutOptions, useAppDispatch, useAppSelector } from '../store'
import { useProducts, useToast } from '../lib/hooks'
import { LOW_CONFIDENCE, simulateOcr, type OcrResult } from '../lib/ocr'
import { DEMO_TODAY, readFileAsDataUrl, uid } from '../lib/utils'
import { patients } from '../data/patients'
import type { PrescriptionMedicine } from '../types'
import { FilePreview } from '../components/FilePreview'
import { AiReading, AvailabilitySummary } from '../components/RxAnalysis'
import { AddressPicker } from '../components/AddressPicker'
import { OrderTypeSelector } from '../components/OrderTypeSelector'
import { buildLines } from '../lib/rxPricing'
import { formatAddress, useAddresses } from '../lib/addresses'
import { Badge, Button, Card, Input, PageHeader } from '../components/ui'

const ACCEPT = ['image/jpeg', 'image/png', 'application/pdf']
type Stage = 'select' | 'uploading' | 'processing' | 'review'
const MAX_PERSIST = 400_000

const cellCls = (c?: number) => (c !== undefined && c < LOW_CONFIDENCE ? 'border-amber-400 bg-amber-50' : '')

export default function PrescriptionUpload() {
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const toast = useToast()
  const [params] = useSearchParams()
  const returnTo = params.get('returnTo')
  const patientId = useAppSelector((s) => s.session.patientId)
  const patientRec = patients.find((p) => p.id === patientId)
  const patientName = patientRec?.name ?? ''
  const patientAddress = patientRec?.address ?? ''
  const products = useProducts()
  const { selected } = useAddresses()
  const inputRef = useRef<HTMLInputElement>(null)

  const [stage, setStage] = useState<Stage>('select')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>()
  const [progress, setProgress] = useState(0)
  const [drag, setDrag] = useState(false)
  const [mode, setMode] = useState<'auto' | 'printed' | 'handwritten'>('auto')
  const [ocr, setOcr] = useState<OcrResult | null>(null)
  const [doctor, setDoctor] = useState('')
  const [patient, setPatient] = useState('')
  const [date, setDate] = useState('')
  const [meds, setMeds] = useState<PrescriptionMedicine[]>([])

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  const pick = (f: File | undefined) => {
    if (!f) return
    if (!ACCEPT.includes(f.type)) { toast('error', 'Unsupported file. Upload a JPG, PNG or PDF.'); return }
    if (f.size > 10 * 1024 * 1024) { toast('error', 'File is larger than 10 MB.'); return }
    setFile(f); setPreviewUrl(URL.createObjectURL(f)); setOcr(null); setStage('select')
  }
  const reset = () => { setFile(null); setPreviewUrl(undefined); setOcr(null); setStage('select'); setProgress(0); if (inputRef.current) inputRef.current.value = '' }

  const start = () => {
    if (!file) return
    setStage('uploading'); setProgress(0)
    let p = 0
    const up = setInterval(() => {
      p += 20
      setProgress(p)
      if (p >= 100) {
        clearInterval(up)
        const handwritten = mode === 'handwritten' || (mode === 'auto' && /hand|scribble|note/i.test(file.name))
        setOcr(simulateOcr(handwritten, patientName))
        setStage('processing')
      }
    }, 300)
  }

  const finish = useCallback(() => {
    if (!ocr) return
    setDoctor(ocr.doctor.value); setPatient(ocr.patient.value); setDate(ocr.date.value); setMeds(ocr.medicines)
    setStage('review')
  }, [ocr])

  const setMed = (id: string, key: keyof PrescriptionMedicine, value: string) =>
    setMeds((ms) => ms.map((m) => (m.id === id ? { ...m, [key]: key === 'quantity' ? Number(value) || 0 : value, confidence: 1 } : m)))

  const save = async (): Promise<string | null> => {
    if (!file || !ocr) return null
    if (!doctor.trim() || !meds.length || meds.some((m) => !m.name.trim())) { toast('error', 'Doctor name and medicine names are required.'); return null }
    const dataUrl = file.size < MAX_PERSIST ? await readFileAsDataUrl(file) : undefined
    const id = uid('RX')
    dispatch(addPrescription({
      id, patientId, doctorName: doctor, date, source: 'upload', status: 'awaiting_verification', fileName: file.name, fileUrl: dataUrl, fileType: file.type,
      medicines: meds.map((m) => ({ ...m, productId: products.find((p) => p.brand.toLowerCase() === m.name.trim().toLowerCase())?.id })),
    }))
    dispatch(addNotification({ id: uid('n'), userId: patientId, type: 'prescription', title: 'Prescription submitted', message: 'Your prescription is awaiting pharmacist verification.', date: DEMO_TODAY, read: false, link: '/prescriptions' }))
    return id
  }

  const submit = async () => {
    const id = await save()
    if (!id) return
    if (returnTo) dispatch(selectCartPrescription(id))
    toast('success', 'Prescription submitted for verification')
    nav(returnTo ?? '/prescriptions')
  }

  const toCheckout = async () => {
    const items = buildLines(meds, products).flatMap((l) => (l.product && l.status !== 'unavailable' ? [{ productId: l.product.id, quantity: l.packs }] : []))
    if (items.length === 0) return toast('error', 'None of these medicines can be added to the cart right now.')
    if (!selected) return toast('error', 'Add or select a delivery address first.')
    const id = await save()
    if (!id) return
    dispatch(addManyToCart(items))
    dispatch(selectCartPrescription(id))
    dispatch(setCheckoutOptions({ addressId: selected.id }))
    toast('success', `${items.length} medicine${items.length > 1 ? 's' : ''} added to cart`)
    nav('/checkout')
  }

  const stages: { id: Stage; label: string }[] = [{ id: 'select', label: 'Uploaded' }, { id: 'processing', label: 'Processing' }, { id: 'review', label: 'Awaiting Verification' }]
  const stageIdx = stage === 'select' || stage === 'uploading' ? 0 : stage === 'processing' ? 1 : 2

  return (
    <div>
      <PageHeader title="Upload Prescription" subtitle="Upload a prescription, review the simulated AI extraction, then submit for pharmacist verification." />
      <div className="mb-4 rounded-lg border border-navy-100 bg-navy-50 p-3 text-sm text-navy-800">This is a <strong>simulated</strong> AI recognition demo — no real OCR is performed. Extracted data is never treated as an approved prescription; a pharmacist must verify it before prescription-only medicines are dispensed.</div>
      <ol className="mb-6 flex flex-wrap gap-2 text-xs">{stages.map((s, i) => <li key={s.id} className={`rounded-full px-3 py-1 ${i <= stageIdx && file ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{i + 1}. {s.label}</li>)}</ol>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold text-navy-900">Prescription file</h2>
          {!file ? (
            <div onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]) }}
              className={`flex h-72 flex-col items-center justify-center rounded-xl border-2 border-dashed text-center ${drag ? 'border-teal-600 bg-teal-50' : 'border-slate-300'}`}>
              <UploadCloud className="mb-2 h-10 w-10 text-slate-400" />
              <p className="text-sm font-medium">Drag & drop a prescription here</p>
              <p className="mb-3 text-xs text-slate-500">JPG, PNG or PDF · up to 10 MB</p>
              <Button variant="outline" onClick={() => inputRef.current?.click()}>Choose file</Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-lg">
                <FilePreview url={previewUrl} type={file.type} name={file.name} className="h-72" />
                {stage === 'processing' && <div className="pointer-events-none absolute inset-x-0 animate-scan border-t-2 border-teal-500 bg-teal-400/20 py-2" aria-hidden />}
              </div>
              <div className="flex items-center justify-between gap-2 text-sm"><span className="truncate">{file.name}</span>
                {(stage === 'select' || stage === 'review') && <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}><RefreshCw className="h-3.5 w-3.5" />Replace</Button><Button size="sm" variant="ghost" onClick={reset}><Trash2 className="h-3.5 w-3.5" />Remove</Button></div>}
              </div>
              {stage === 'uploading' && <div><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-teal-600 transition-all" style={{ width: `${progress}%` }} /></div><p className="mt-1 text-xs text-slate-500">Uploading… {progress}%</p></div>}
              {stage === 'processing' && <p className="flex items-center gap-2 text-sm text-navy-700"><Loader2 className="h-4 w-4 animate-spin" />Analysing prescription (simulated)…</p>}
              {stage === 'select' && (
                <div className="space-y-3">
                  <label className="block text-sm"><span className="mb-1 block font-medium">Simulate as</span>
                    <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
                      <option value="auto">Auto (filename containing "hand" → handwritten)</option><option value="printed">Printed, clear</option><option value="handwritten">Handwritten, uncertain</option>
                    </select></label>
                  <Button className="w-full" onClick={start}>Upload & analyse</Button>
                </div>
              )}
            </div>
          )}
          <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="sr-only" aria-label="Prescription file" onChange={(e) => pick(e.target.files?.[0])} />
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold text-navy-900">Extracted details</h2>
          {stage === 'processing' && ocr ? <AiReading result={ocr} onDone={finish} /> : stage !== 'review' || !ocr ? <p className="text-sm text-slate-500">Extracted information will appear here after analysis.</p> : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={ocr.overall >= LOW_CONFIDENCE ? 'green' : 'amber'}>Overall confidence {Math.round(ocr.overall * 100)}%</Badge>
                {ocr.handwritten && <Badge tone="amber"><AlertTriangle className="h-3 w-3" />Handwriting — manual review needed</Badge>}
              </div>
              {ocr.unrecognized.length > 0 && <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><strong>Unrecognised words:</strong> {ocr.unrecognized.join(', ')}</div>}
              <div className="grid gap-3 sm:grid-cols-3">
                {([['Doctor', doctor, setDoctor, ocr.doctor.confidence, 'text'], ['Patient', patient, setPatient, ocr.patient.confidence, 'text'], ['Date', date, setDate, ocr.date.confidence, 'date']] as const).map(([label, val, set, conf, type]) => (
                  <label key={label} className="text-sm"><span className="mb-1 flex justify-between font-medium">{label}<span className={`text-xs ${conf < LOW_CONFIDENCE ? 'text-amber-700' : 'text-slate-400'}`}>{Math.round(conf * 100)}%</span></span>
                    <Input type={type} value={val} onChange={(e) => set(e.target.value)} className={cellCls(conf)} /></label>
                ))}
              </div>
              <div className="space-y-3">
                {meds.map((m, i) => (
                  <div key={m.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs"><span className="font-medium">Medicine {i + 1}</span><span className={(m.confidence ?? 1) < LOW_CONFIDENCE ? 'text-amber-700' : 'text-slate-400'}>Confidence {Math.round((m.confidence ?? 1) * 100)}%</span></div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {([['name', 'Medicine'], ['strength', 'Strength'], ['dosage', 'Dosage'], ['frequency', 'Frequency'], ['duration', 'Duration'], ['quantity', 'Quantity']] as const).map(([k, label]) => (
                        <label key={k} className="text-xs"><span className="mb-0.5 block text-slate-500">{label}</span><Input aria-label={`${label} ${i + 1}`} value={String(m[k])} onChange={(e) => setMed(m.id, k, e.target.value)} className={cellCls(m.confidence)} /></label>
                      ))}
                    </div>
                    <button className="mt-2 cursor-pointer text-xs text-red-600 hover:underline" onClick={() => setMeds((ms) => ms.filter((x) => x.id !== m.id))}>Remove medicine</button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => setMeds((ms) => [...ms, { id: uid('m'), name: '', strength: '', dosage: '', frequency: '', duration: '', quantity: 1, confidence: 1 }])}>+ Add medicine</Button>
              </div>
              <AvailabilitySummary meds={meds} address={selected ? formatAddress(selected) : patientAddress} />
              <div className="space-y-4 rounded-xl border border-slate-200 p-4">
                <AddressPicker />
                <OrderTypeSelector />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button onClick={toCheckout}><ShoppingCart className="h-4 w-4" />Add to cart & checkout</Button>
                <Button variant="outline" onClick={submit}><CheckCircle2 className="h-4 w-4" />Submit for verification only</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
