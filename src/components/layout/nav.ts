import { Building2, ClipboardList, FileText, FlaskConical, LayoutDashboard, Package, Pill, Repeat, Settings, Stethoscope, Truck, Users, type LucideIcon } from 'lucide-react'
import type { UserRole } from '../../types'

export interface NavItem { to: string; label: string; icon: LucideIcon }

const common: NavItem[] = [
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/manufacturers', label: 'Manufacturers', icon: Building2 },
  { to: '/settings', label: 'Account Settings', icon: Settings },
]

export const navByRole: Record<UserRole, NavItem[]> = {
  patient: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/catalog', label: 'Medicine Catalog', icon: Pill },
    { to: '/orders', label: 'My Orders', icon: Package },
    { to: '/prescriptions', label: 'Prescriptions', icon: FileText },
    { to: '/subscriptions', label: 'Subscriptions', icon: Repeat },
    { to: '/reports', label: 'Lab Reports', icon: FlaskConical },
    ...common,
  ],
  doctor: [
    { to: '/doctor/dashboard', label: 'Doctor Dashboard', icon: LayoutDashboard },
    { to: '/doctor/prescriptions/new', label: 'New Prescription', icon: ClipboardList },
    { to: '/catalog', label: 'Medicine Catalog', icon: Pill },
    ...common,
  ],
  manufacturer: [
    { to: '/manufacturer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/manufacturer/products', label: 'My Products', icon: Pill },
    { to: '/catalog', label: 'Medicine Catalog', icon: Pill },
    ...common,
  ],
  fulfillment: [
    { to: '/fulfillment/dashboard', label: 'Fulfillment', icon: Truck },
    { to: '/catalog', label: 'Medicine Catalog', icon: Pill },
    ...common,
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Admin Overview', icon: LayoutDashboard },
    { to: '/fulfillment/dashboard', label: 'Fulfillment', icon: Truck },
    { to: '/catalog', label: 'Medicine Catalog', icon: Pill },
    { to: '/prescriptions', label: 'Prescriptions', icon: FileText },
    { to: '/subscriptions', label: 'Subscriptions', icon: Repeat },
    { to: '/orders', label: 'Orders', icon: Users },
    ...common,
  ],
}

export const homeByRole: Record<UserRole, string> = {
  patient: '/dashboard', doctor: '/doctor/dashboard', manufacturer: '/manufacturer/dashboard', fulfillment: '/fulfillment/dashboard', admin: '/admin/dashboard',
}

export const roleLabel: Record<UserRole, string> = { patient: 'Patient', doctor: 'Doctor', manufacturer: 'Manufacturer', fulfillment: 'Fulfillment Center', admin: 'Administrator' }
