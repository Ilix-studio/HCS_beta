import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, Menu, RotateCcw, Search, ShoppingCart, UserCircle } from 'lucide-react'
import { markAllRead, markRead, resetDemo, setRole, useAppDispatch, useAppSelector } from '../../store'
import { homeByRole, roleLabel } from './nav'
import { useNotifUser, useOutside, useUserName } from './hooks'
import type { UserRole } from '../../types'
import { Select } from '../ui'
import { ThemeToggle } from '../../theme/ThemeToggle'
import { formatDate } from '../../lib/utils'


export function NotificationCenter({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const ref = useOutside(() => setOpen(false))
  const items = useAppSelector((s) => s.notifications).filter((n) => n.userId === userId)
  const unread = items.filter((n) => !n.read).length
  return (
    <div ref={ref} className="relative">
      <button aria-label={`Notifications (${unread} unread)`} onClick={() => setOpen(!open)} className="relative cursor-pointer rounded-lg p-2 text-slate-600 hover:bg-slate-100">
        <Bell className="h-5 w-5" />
        {unread > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 max-w-[90vw] rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
            <span className="font-medium">Notifications</span>
            <button className="cursor-pointer text-xs text-teal-700 hover:underline" onClick={() => dispatch(markAllRead(userId))}>Mark all read</button>
          </div>
          <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
            {items.length === 0 && <li className="px-4 py-6 text-center text-sm text-slate-500">You're all caught up.</li>}
            {items.map((n) => (
              <li key={n.id}>
                <button className={`w-full cursor-pointer px-4 py-3 text-left hover:bg-slate-50 ${n.read ? '' : 'bg-teal-50/50'}`}
                  onClick={() => { dispatch(markRead(n.id)); setOpen(false); if (n.link) nav(n.link) }}>
                  <div className="text-sm font-medium text-navy-900">{n.title}</div>
                  <div className="text-xs text-slate-600">{n.message}</div>
                  <div className="mt-1 text-[11px] text-slate-400">{formatDate(n.date)}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function RoleSwitcher({ className = 'w-44 py-1.5' }: { className?: string }) {
  const role = useAppSelector((s) => s.session.role)
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  return (
    <label className="flex items-center gap-2 text-xs text-slate-500">
      <span className="whitespace-nowrap">Demo role</span>
      <Select aria-label="Demo role switcher" className={className} value={role} onChange={(e) => { const r = e.target.value as UserRole; dispatch(setRole(r)); nav(homeByRole[r]) }}>
        {(Object.keys(roleLabel) as UserRole[]).map((r) => <option key={r} value={r}>{roleLabel[r]}</option>)}
      </Select>
    </label>
  )
}


export function UserMenu() {
  const role = useAppSelector((s) => s.session.role)
  const nav = useNavigate()
  const [menu, setMenu] = useState(false)
  const menuRef = useOutside(() => setMenu(false))
  const userName = useUserName()
  return (
    <div ref={menuRef} className="relative">
      <button onClick={() => setMenu(!menu)} className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100" aria-haspopup="menu" aria-expanded={menu}>
        <UserCircle className="h-7 w-7 text-navy-600" />
        <span className="hidden text-left text-sm leading-tight sm:block"><span className="block font-medium">{userName}</span><span className="block text-xs text-slate-500">{roleLabel[role]}</span></span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
      {menu && (
        <div role="menu" className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-xl">
          <div className="border-b border-slate-100 px-4 py-2 md:hidden"><RoleSwitcher className="w-full" /></div>
          <button role="menuitem" className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 hover:bg-slate-50" onClick={() => { setMenu(false); nav('/settings') }}><UserCircle className="h-4 w-4" />Account settings</button>
          <button role="menuitem" className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 hover:bg-slate-50" onClick={resetDemo}><RotateCcw className="h-4 w-4" />Reset demo data</button>
          <button role="menuitem" className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 hover:bg-slate-50" onClick={() => { setMenu(false); nav('/') }}><LogOut className="h-4 w-4" />Sign out (demo)</button>
        </div>
      )}
    </div>
  )
}

export function CartButton() {
  const cartCount = useAppSelector((s) => s.cart.items.reduce((n, i) => n + i.quantity, 0))
  return (
    <Link to="/cart" aria-label={`Cart (${cartCount} items)`} className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100">
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-bold text-white">{cartCount}</span>}
    </Link>
  )
}


export function Topbar({ onMenu }: { onMenu: () => void }) {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const notifUser = useNotifUser()
  return (
    <header className="no-print sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
      <button aria-label="Open menu" className="cursor-pointer rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={onMenu}><Menu className="h-5 w-5" /></button>
      <form className="relative max-w-xl flex-1" onSubmit={(e) => { e.preventDefault(); nav(`/catalog?q=${encodeURIComponent(q)}`) }} role="search">
        <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search medicines" placeholder="Search medicines, brands, generics…" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm focus:border-teal-600 focus:bg-white focus:outline-2 focus:outline-teal-600/30" />
      </form>
      <div className="ml-auto flex items-center gap-1">
        <div className="hidden md:block"><RoleSwitcher /></div>
        <ThemeToggle />
        <CartButton />
        <NotificationCenter userId={notifUser} />
        <UserMenu />
      </div>
    </header>
  )
}
