import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { HeartPulse, Menu, Search, ShieldCheck, Truck, Upload, X } from 'lucide-react'
import { categories } from '../../data/categories'
import { cn } from '../../lib/utils'
import { CartButton, NotificationCenter, RoleSwitcher, UserMenu } from './Topbar'
import { useNotifUser } from './hooks'
import { Toaster } from './Toaster'
import { ThemeToggle } from '../../theme/ThemeToggle'

const links = [
  { to: '/dashboard', label: 'Home' },
  { to: '/catalog', label: 'Shop' },
  { to: '/orders', label: 'My Orders' },
  { to: '/prescriptions', label: 'Prescriptions' },
  { to: '/subscriptions', label: 'Subscriptions' },
  { to: '/reports', label: 'Lab Reports' },
]

/** Customer-facing storefront shell: promo strip, top navigation, category rail and footer — no sidebar. */
export function CustomerLayout() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const notifUser = useNotifUser()
  const linkCls = ({ isActive }: { isActive: boolean }) => cn('rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap', isActive ? 'bg-navy-50 text-navy-800' : 'text-slate-600 hover:bg-slate-100')
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="no-print bg-navy-900 px-4 py-1.5 text-center text-xs text-navy-100"><Truck className="mr-1 inline h-3.5 w-3.5" />Free standard delivery on orders above ₹500 · Use code <b className="text-white">HEALTH10</b> for 10% off</div>
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <button aria-label="Open menu" className="cursor-pointer rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-navy-800"><span className="rounded-lg bg-navy-700 p-1.5 text-white"><HeartPulse className="h-5 w-5" /></span><span className="hidden sm:inline">MediCart<span className="text-teal-600">Health</span></span></Link>
          <form role="search" className="relative mx-2 max-w-2xl flex-1" onSubmit={(e) => { e.preventDefault(); nav(`/catalog?q=${encodeURIComponent(q)}`) }}>
            <Search className="absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search medicines" placeholder="Search medicines, brands, health products…" className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pr-24 pl-10 text-sm focus:border-teal-600 focus:bg-white focus:outline-2 focus:outline-teal-600/30" />
            <button type="submit" className="absolute top-1.5 right-1.5 cursor-pointer rounded-full bg-teal-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-teal-700">Search</button>
          </form>
          <div className="ml-auto flex items-center gap-1">
            <Link to="/prescriptions/upload" className="mr-1 hidden items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 xl:flex"><Upload className="h-4 w-4" />Upload Rx</Link>
            <div className="hidden lg:block"><RoleSwitcher className="w-36 py-1" /></div>
            <div className="mr-1 hidden sm:block"><ThemeToggle /></div><CartButton /><NotificationCenter userId={notifUser} /><UserMenu />
          </div>
        </div>
        <nav aria-label="Main navigation" className="mx-auto hidden max-w-7xl gap-1 px-4 pb-2 lg:flex">{links.map((l) => <NavLink key={l.to} to={l.to} end className={linkCls}>{l.label}</NavLink>)}</nav>
        {pathname.startsWith('/catalog') && (
          <div className="border-t border-slate-100 bg-white"><div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2">{categories.map((c) => <Link key={c.id} to={`/catalog?category=${c.id}`} className="rounded-full border border-slate-200 px-3 py-1 text-xs whitespace-nowrap text-slate-600 hover:border-teal-600 hover:text-teal-700">{c.name}</Link>)}</div></div>
        )}
      </header>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white p-4"><button aria-label="Close menu" className="absolute top-4 right-3 cursor-pointer" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            <nav aria-label="Mobile navigation" className="mt-8 flex flex-col gap-1">{[...links, { to: '/prescriptions/upload', label: 'Upload prescription' }, { to: '/doctors', label: 'Doctors' }, { to: '/manufacturers', label: 'Manufacturers' }].map((l) => <NavLink key={l.to} to={l.to} end onClick={() => setOpen(false)} className={linkCls}>{l.label}</NavLink>)}</nav>
            <div className="mt-4"><RoleSwitcher className="w-full" /></div></aside></div>
      )}
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6"><Outlet /></main>
      <footer className="no-print border-t border-slate-200 bg-white px-4 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 text-sm text-slate-600 sm:grid-cols-3">
          <div><div className="mb-2 flex items-center gap-2 font-semibold text-navy-800"><HeartPulse className="h-5 w-5 text-teal-600" />MediCart Health</div><p className="text-xs text-slate-500">Medicines, prescriptions, refills and lab reports in one place.</p></div>
          <div><div className="mb-2 font-medium text-slate-800">Shop</div><ul className="space-y-1"><li><Link to="/catalog">All products</Link></li><li><Link to="/manufacturers">Manufacturers</Link></li><li><Link to="/doctors">Doctors</Link></li></ul></div>
          <div><div className="mb-2 font-medium text-slate-800">Your account</div><ul className="space-y-1"><li><Link to="/orders">My orders</Link></li><li><Link to="/subscriptions">Subscriptions</Link></li><li><Link to="/settings">Account settings</Link></li></ul></div>
        </div>
        <p className="mx-auto mt-6 flex max-w-7xl items-center gap-1.5 text-xs text-slate-400"><ShieldCheck className="h-3.5 w-3.5" />Demo prototype · mock data only · prescriptions and reports are not legally valid or real medical records.</p>
      </footer>
      <Toaster />
    </div>
  )
}
