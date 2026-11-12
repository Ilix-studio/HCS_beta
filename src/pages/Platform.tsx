import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Bike, Eye, EyeOff, Globe, HeartPulse, Factory, Monitor, Smartphone, type LucideIcon } from 'lucide-react'
import { setRole, useAppDispatch } from '../store'
import { homeByRole } from '../components/layout/nav'
import { ThemeToggle } from '../theme/ThemeToggle'
import { MarketResearch } from '../components/MarketResearch'
import { sources } from '../data/marketResearch'
import { Badge, Button, Card } from '../components/ui'
import type { UserRole } from '../types'

interface PlatformRow {
  name: string
  stores?: string
  icon: LucideIcon
  users: string
  features: string[]
  status: 'prototype' | 'planned'
  demo?: { role: UserRole; label: string }
  /** Approx. build cost in INR lakh (1 lakh = ₹100,000). 'quoted' = range seen in vendor blogs; 'estimate' = my own rough range. */
  cost: { low: number; high: number; basis: 'quoted' | 'estimate' }
}

const SHARED_COST = { low: 8, high: 20 }

const inr = (lakh: number) => (lakh >= 100 ? `${+(lakh / 100).toFixed(2)} crore` : `${lakh} lakh`)
const range = (low: number, high: number) => `₹${low}–${high >= 100 ? inr(high) : high + ' lakh'}`

const platforms: PlatformRow[] = [
  {
    name: 'Customer Mobile App', stores: 'iOS & Android', icon: Smartphone, users: 'Patients & customers', status: 'planned',
    features: ['Medicine search, cart and checkout', 'Prescription upload with AI extraction (simulated)', 'Weekly and monthly subscriptions with reminders', 'Order tracking and lab reports'],
    cost: { low: 4, high: 10, basis: 'quoted' },
  },
  {
    name: 'Delivery Partner App', stores: 'iOS & Android', icon: Bike, users: 'Delivery partners', status: 'planned',
    features: ['Assigned deliveries and routes', 'Pickup and drop-off confirmation', 'Live status updates to the customer', 'Delivery history'],
    cost: { low: 1.5, high: 3, basis: 'quoted' },
  },
  {
    name: 'Sales & Admin Web App', icon: Monitor, users: 'Administrators, fulfillment centers and sales teams', status: 'prototype', demo: { role: 'admin', label: 'Open admin demo' },
    features: ['Order, packing and dispatch management', 'Prescription verification (approve / reject)', 'Lab report publishing', 'Platform analytics and listing approvals'],
    cost: { low: 6, high: 15, basis: 'estimate' },
  },
  {
    name: 'Customer Web App', icon: Globe, users: 'Patients & customers', status: 'prototype', demo: { role: 'patient', label: 'Open customer demo' },
    features: ['Medicine catalog and product details', 'Cart, address book, checkout and demo payment', 'Prescriptions, subscriptions and lab reports', 'Nearby doctors and consultation requests'],
    cost: { low: 4, high: 10, basis: 'estimate' },
  },
  {
    name: 'Doctor Portal', stores: 'Web', icon: HeartPulse, users: 'Doctors', status: 'prototype', demo: { role: 'doctor', label: 'Open doctor demo' },
    features: ['Search patients and the medicine catalog', 'Digital prescription editor with preview', 'Print / download'],
    cost: { low: 3, high: 8, basis: 'estimate' },
  },
  {
    name: 'Manufacturer Portal', stores: 'Web', icon: Factory, users: 'Medicine manufacturers', status: 'prototype', demo: { role: 'manufacturer', label: 'Open manufacturer demo' },
    features: ['Company profile and public page', 'Add, edit and remove product listings', 'Listing dashboard'],
    cost: { low: 3, high: 8, basis: 'estimate' },
  },
]

export default function Platform() {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const [showCost, setShowCost] = useState(false)
  const totalLow = platforms.reduce((n, p) => n + p.cost.low, 0) + SHARED_COST.low
  const totalHigh = platforms.reduce((n, p) => n + p.cost.high, 0) + SHARED_COST.high
  const open = (role: UserRole) => { dispatch(setRole(role)); nav(homeByRole[role]) }
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-navy-800"><span className="rounded-lg bg-navy-700 p-1.5 text-white"><HeartPulse className="h-5 w-5" /></span>MediCart<span className="text-teal-600">Health</span></Link>
          <div className="flex items-center gap-2"><ThemeToggle /><Link to="/"><Button variant="outline" size="sm">Home</Button></Link><Button size="sm" onClick={() => open('patient')}>Open demo<ArrowRight className="h-4 w-4" /></Button></div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <p className="mb-2 text-xs font-semibold tracking-widest text-teal-600 uppercase">Platform</p>
        <h1 className="text-3xl font-semibold text-navy-900 md:text-4xl">Where the platform will be available</h1>
        <p className="mt-3 max-w-2xl text-slate-600">One platform, several apps — one for each audience. The web apps below are working in this prototype with mock data; the mobile apps are planned and not yet built.</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-500">{showCost ? 'Approximate one-time build cost (India agency rates, INR).' : 'Cost to build is hidden.'}</p>
          <Button variant="outline" size="sm" aria-pressed={showCost} onClick={() => setShowCost((v) => !v)}>{showCost ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}{showCost ? 'Hide approx. cost' : 'Show approx. cost'}</Button>
        </div>

        <div className="mt-3 hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-50 text-xs text-slate-600 uppercase"><tr><th className="px-5 py-3 font-semibold">Module / Platform</th><th className="px-5 py-3 font-semibold">Users</th><th className="px-5 py-3 font-semibold">Key features</th><th className="px-5 py-3 font-semibold">Status</th>{showCost && <th className="px-5 py-3 font-semibold">Approx. cost to build</th>}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {platforms.map((p) => (
                <tr key={p.name} className="align-top">
                  <td className="px-5 py-5"><div className="flex items-start gap-3"><span className="rounded-lg bg-teal-50 p-2 text-teal-700"><p.icon className="h-5 w-5" /></span><div><div className="font-semibold text-navy-900">{p.name}</div>{p.stores && <div className="text-slate-500">({p.stores})</div>}</div></div></td>
                  <td className="px-5 py-5 text-slate-600">{p.users}</td>
                  <td className="px-5 py-5"><ul className="list-disc space-y-1 pl-4 text-slate-600">{p.features.map((f) => <li key={f}>{f}</li>)}</ul></td>
                  <td className="px-5 py-5"><Badge tone={p.status === 'prototype' ? 'green' : 'amber'}>{p.status === 'prototype' ? 'Working prototype' : 'Planned'}</Badge>
                    {p.demo && <div className="mt-3"><Button size="sm" variant="outline" onClick={() => open(p.demo!.role)}>{p.demo.label}</Button></div>}</td>
                  {showCost && <td className="px-5 py-5"><div className="font-semibold whitespace-nowrap text-navy-900">{range(p.cost.low, p.cost.high)}</div><div className="mt-1 text-xs text-slate-500">{p.cost.basis === 'quoted' ? 'Range quoted by vendors' : 'My rough estimate'}</div></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-4 md:hidden">
          {platforms.map((p) => (
            <Card key={p.name}>
              <div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><span className="rounded-lg bg-teal-50 p-2 text-teal-700"><p.icon className="h-5 w-5" /></span><div><div className="font-semibold text-navy-900">{p.name}</div>{p.stores && <div className="text-sm text-slate-500">({p.stores})</div>}</div></div><Badge tone={p.status === 'prototype' ? 'green' : 'amber'}>{p.status === 'prototype' ? 'Prototype' : 'Planned'}</Badge></div>
              <p className="mt-3 text-sm text-slate-500">For {p.users.toLowerCase()}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
              {showCost && <p className="mt-3 text-sm"><b>Approx. cost:</b> {range(p.cost.low, p.cost.high)} <span className="text-xs text-slate-500">({p.cost.basis === 'quoted' ? 'vendor-quoted' : 'estimate'})</span></p>}
              {p.demo && <Button className="mt-4" size="sm" variant="outline" onClick={() => open(p.demo!.role)}>{p.demo.label}</Button>}
            </Card>
          ))}
        </div>

        {showCost && (
          <Card className="mt-4 space-y-2 text-sm">
            <div className="flex flex-wrap justify-between gap-2"><span>Shared backend, APIs, integrations and compliance (needed by every app above)</span><b className="text-navy-900">{range(SHARED_COST.low, SHARED_COST.high)}</b></div>
            <div className="flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-2 text-base font-semibold text-navy-900"><span>Total, all platforms (approx.)</span><span>{range(totalLow, totalHigh)}</span></div>
            <p className="text-xs text-slate-500">1 lakh = ₹100,000. Excludes running costs (cloud, SMS, payment fees, support), marketing, app-store fees and drug-licence / legal costs. "Vendor-quoted" ranges come from agency blogs ({' '}
              <a className="text-teal-700 hover:underline" href={sources.codingclave.url} target="_blank" rel="noreferrer">Codingclave</a>, <a className="text-teal-700 hover:underline" href={sources.techgropse.url} target="_blank" rel="noreferrer">TechGropse</a>, <a className="text-teal-700 hover:underline" href={sources.zenesys.url} target="_blank" rel="noreferrer">Zenesys</a>) which have a commercial interest and vary widely; the other ranges are my own rough estimates, not sourced. Get several quotes against a fixed scope.</p>
          </Card>
        )}

        <MarketResearch />
      </main>
      <footer className="px-4 py-8 text-center text-xs text-slate-400">Demo prototype · mock data only. Planned apps are not built and features may change.</footer>
    </div>
  )
}
