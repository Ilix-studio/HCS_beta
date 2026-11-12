import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ChevronRight, HeartPulse, X } from 'lucide-react'
import { navByRole } from './nav'
import { Topbar } from './Topbar'
import { Toaster } from './Toaster'
import { useAppSelector } from '../../store'
import { cn } from '../../lib/utils'

const crumbLabels: Record<string, string> = {
  catalog: 'Catalog', cart: 'Cart', checkout: 'Checkout', payment: 'Payment', 'order-success': 'Order Successful', orders: 'Orders', prescriptions: 'Prescriptions', upload: 'Upload', subscriptions: 'Subscriptions',
  reports: 'Lab Reports', doctors: 'Doctors', doctor: 'Doctor', dashboard: 'Dashboard', new: 'New Prescription', manufacturers: 'Manufacturers', manufacturer: 'Manufacturer',
  products: 'Products', fulfillment: 'Fulfillment', admin: 'Admin', settings: 'Settings', order: 'Order',
}

function Breadcrumbs() {
  const { pathname } = useLocation()
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) return null
  return (
    <nav aria-label="Breadcrumb" className="no-print mb-4 flex flex-wrap items-center gap-1 text-xs text-slate-500">
      <Link to="/" className="hover:text-teal-700">Home</Link>
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3" />
          {i === parts.length - 1 ? <span className="font-medium text-slate-700">{crumbLabels[p] ?? p}</span> : <Link to={'/' + parts.slice(0, i + 1).join('/')} className="hover:text-teal-700">{crumbLabels[p] ?? p}</Link>}
        </span>
      ))}
    </nav>
  )
}

export function AppLayout() {
  const [open, setOpen] = useState(false)
  const role = useAppSelector((s) => s.session.role)
  const items = navByRole[role]
  const links = (
    <nav className="flex flex-col gap-1 p-3" aria-label="Main navigation">
      {items.map((it) => (
        <NavLink key={it.to + it.label} to={it.to} onClick={() => setOpen(false)}
          className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium', isActive ? 'bg-white/15 text-white' : 'text-navy-100 hover:bg-white/10')}>
          <it.icon className="h-4 w-4" />{it.label}
        </NavLink>
      ))}
    </nav>
  )
  const brand = <div className="flex items-center gap-2 px-5 py-4 text-lg font-semibold text-white"><HeartPulse className="h-6 w-6 text-teal-100" />MediCart<span className="text-teal-100">Health</span></div>
  return (
    <div className="min-h-screen lg:flex">
      <aside className="no-print hidden w-64 shrink-0 bg-navy-800 lg:block"><div className="sticky top-0">{brand}{links}</div></aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-navy-800">
            <button aria-label="Close menu" className="absolute top-4 right-3 cursor-pointer text-white" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            {brand}{links}
          </aside>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-7xl p-4 md:p-6"><Breadcrumbs /><Outlet /></main>
        <p className="no-print px-6 pb-6 text-center text-xs text-slate-400">Demo prototype · mock data only · prescriptions and reports shown here are not legally valid or real medical records.</p>
      </div>
      <Toaster />
    </div>
  )
}
