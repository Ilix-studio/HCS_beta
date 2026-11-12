import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Address, DeliveryMethod, LabReport, OrderType, Manufacturer, Notification, Order, OrderStatus, Prescription, PrescriptionStatus, Product, Subscription, UserRole } from '../types'
import { products as seedProducts } from '../data/products'
import { manufacturers as seedManufacturers } from '../data/manufacturers'
import { orders as seedOrders } from '../data/orders'
import { prescriptions as seedPrescriptions } from '../data/prescriptions'
import { subscriptions as seedSubscriptions } from '../data/subscriptions'
import { labReports as seedReports } from '../data/labReports'
import { notifications as seedNotifications } from '../data/notifications'
import { DEMO_TODAY } from '../lib/utils'
import { addresses as seedAddresses } from '../data/addresses'

export interface SessionState {
  role: UserRole
  patientId: string
  doctorId: string
  manufacturerId: string
}
export const session = createSlice({
  name: 'session',
  initialState: { role: 'patient', patientId: 'pt1', doctorId: 'd1', manufacturerId: 'm1' } as SessionState,
  reducers: {
    setRole: (s, a: PayloadAction<UserRole>) => { s.role = a.payload },
    setPatient: (s, a: PayloadAction<string>) => { s.patientId = a.payload },
    setManufacturer: (s, a: PayloadAction<string>) => { s.manufacturerId = a.payload },
  },
})

export interface CartState {
  items: { productId: string; quantity: number }[]
  coupon: string | null
  prescriptionId: string | null
  addressId: string | null
  deliveryMethod: DeliveryMethod
  orderType: OrderType
}
const emptyCart: CartState = { items: [], coupon: null, prescriptionId: null, addressId: null, deliveryMethod: 'standard', orderType: 'once' }
export const cart = createSlice({
  name: 'cart',
  initialState: emptyCart,
  reducers: {
    addToCart: (s, a: PayloadAction<{ productId: string; quantity?: number }>) => {
      const found = s.items.find((i) => i.productId === a.payload.productId)
      if (found) found.quantity += a.payload.quantity ?? 1
      else s.items.push({ productId: a.payload.productId, quantity: a.payload.quantity ?? 1 })
    },
    addManyToCart: (s, a: PayloadAction<{ productId: string; quantity: number }[]>) => {
      for (const it of a.payload) {
        const found = s.items.find((i) => i.productId === it.productId)
        if (found) found.quantity = Math.max(found.quantity, it.quantity)
        else s.items.push(it)
      }
    },
    setQuantity: (s, a: PayloadAction<{ productId: string; quantity: number }>) => {
      const found = s.items.find((i) => i.productId === a.payload.productId)
      if (found) found.quantity = Math.max(1, a.payload.quantity)
    },
    removeFromCart: (s, a: PayloadAction<string>) => { s.items = s.items.filter((i) => i.productId !== a.payload) },
    applyCoupon: (s, a: PayloadAction<string | null>) => { s.coupon = a.payload },
    selectCartPrescription: (s, a: PayloadAction<string | null>) => { s.prescriptionId = a.payload },
    setCheckoutOptions: (s, a: PayloadAction<Partial<Pick<CartState, 'addressId' | 'deliveryMethod' | 'orderType'>>>) => { Object.assign(s, a.payload) },
    clearCart: () => emptyCart,
  },
})

export const addresses = createSlice({
  name: 'addresses',
  initialState: seedAddresses as Address[],
  reducers: {
    addAddress: (s, a: PayloadAction<Address>) => {
      const first = !s.some((x) => x.customerId === a.payload.customerId)
      const makeDefault = a.payload.isDefault || first
      if (makeDefault) s.forEach((x) => { if (x.customerId === a.payload.customerId) x.isDefault = false })
      s.push({ ...a.payload, isDefault: makeDefault })
    },
    setDefaultAddress: (s, a: PayloadAction<string>) => {
      const target = s.find((x) => x.id === a.payload)
      if (!target) return
      s.forEach((x) => { if (x.customerId === target.customerId) x.isDefault = x.id === target.id })
    },
    removeAddress: (s, a: PayloadAction<string>) => {
      const target = s.find((x) => x.id === a.payload)
      if (!target) return
      const rest = s.filter((x) => x.id !== a.payload)
      if (target.isDefault) { const next = rest.find((x) => x.customerId === target.customerId); if (next) next.isDefault = true }
      return rest
    },
  },
})

export interface CatalogState { products: Product[]; manufacturers: Manufacturer[]; wishlist: string[] }
export const catalog = createSlice({
  name: 'catalog',
  initialState: { products: seedProducts, manufacturers: seedManufacturers, wishlist: [] } as CatalogState,
  reducers: {
    toggleWishlist: (s, a: PayloadAction<string>) => {
      s.wishlist = s.wishlist.includes(a.payload) ? s.wishlist.filter((x) => x !== a.payload) : [...s.wishlist, a.payload]
    },
    upsertProduct: (s, a: PayloadAction<Product>) => {
      const i = s.products.findIndex((p) => p.id === a.payload.id)
      if (i >= 0) s.products[i] = a.payload
      else s.products.unshift(a.payload)
    },
    removeProduct: (s, a: PayloadAction<string>) => { s.products = s.products.filter((p) => p.id !== a.payload) },
    upsertManufacturer: (s, a: PayloadAction<Manufacturer>) => {
      const i = s.manufacturers.findIndex((m) => m.id === a.payload.id)
      if (i >= 0) s.manufacturers[i] = a.payload
      else s.manufacturers.push(a.payload)
    },
    decrementStock: (s, a: PayloadAction<{ productId: string; quantity: number }[]>) => {
      for (const { productId, quantity } of a.payload) {
        const p = s.products.find((x) => x.id === productId)
        if (!p) continue
        p.stock = Math.max(0, p.stock - quantity)
        p.availability = p.stock === 0 ? 'out_of_stock' : p.stock < 20 ? 'low_stock' : 'in_stock'
      }
    },
  },
})

export const orders = createSlice({
  name: 'orders',
  initialState: seedOrders as Order[],
  reducers: {
    addOrder: (s, a: PayloadAction<Order>) => { s.unshift(a.payload) },
    setOrderStatus: (s, a: PayloadAction<{ id: string; status: OrderStatus }>) => {
      const o = s.find((x) => x.id === a.payload.id)
      if (!o) return
      o.status = a.payload.status
      o.timeline.push({ status: a.payload.status, at: DEMO_TODAY })
      if (a.payload.status === 'dispatched' && !o.tracking) o.tracking = 'TRK' + Math.floor(100000 + Math.random() * 900000)
    },
    togglePacked: (s, a: PayloadAction<{ id: string; productId: string }>) => {
      const o = s.find((x) => x.id === a.payload.id)
      if (!o) return
      o.packedItems = o.packedItems.includes(a.payload.productId) ? o.packedItems.filter((p) => p !== a.payload.productId) : [...o.packedItems, a.payload.productId]
    },
    setTracking: (s, a: PayloadAction<{ id: string; tracking: string }>) => {
      const o = s.find((x) => x.id === a.payload.id)
      if (o) o.tracking = a.payload.tracking
    },
  },
})

export const prescriptions = createSlice({
  name: 'prescriptions',
  initialState: seedPrescriptions as Prescription[],
  reducers: {
    addPrescription: (s, a: PayloadAction<Prescription>) => { s.unshift(a.payload) },
    setPrescriptionStatus: (s, a: PayloadAction<{ id: string; status: PrescriptionStatus; reason?: string }>) => {
      const p = s.find((x) => x.id === a.payload.id)
      if (!p) return
      p.status = a.payload.status
      p.rejectionReason = a.payload.reason
      if (a.payload.status === 'verified') p.validUntil = '2027-02-12'
    },
  },
})

export const subscriptions = createSlice({
  name: 'subscriptions',
  initialState: seedSubscriptions as Subscription[],
  reducers: {
    addSubscription: (s, a: PayloadAction<Subscription>) => { s.unshift(a.payload) },
    updateSubscription: (s, a: PayloadAction<{ id: string; changes: Partial<Subscription>; note?: string }>) => {
      const sub = s.find((x) => x.id === a.payload.id)
      if (!sub) return
      Object.assign(sub, a.payload.changes)
      if (a.payload.note) sub.history.unshift({ date: DEMO_TODAY, note: a.payload.note })
    },
  },
})

export const reports = createSlice({
  name: 'reports',
  initialState: seedReports as LabReport[],
  reducers: {
    addReport: (s, a: PayloadAction<LabReport>) => { s.unshift(a.payload) },
    publishReport: (s, a: PayloadAction<string>) => {
      const r = s.find((x) => x.id === a.payload)
      if (r) r.status = 'published'
    },
  },
})

export const notifications = createSlice({
  name: 'notifications',
  initialState: seedNotifications as Notification[],
  reducers: {
    addNotification: (s, a: PayloadAction<Notification>) => { s.unshift(a.payload) },
    markRead: (s, a: PayloadAction<string>) => {
      const n = s.find((x) => x.id === a.payload)
      if (n) n.read = true
    },
    markAllRead: (s, a: PayloadAction<string>) => { s.forEach((n) => { if (n.userId === a.payload) n.read = true }) },
  },
})

export interface Toast { id: string; kind: 'success' | 'error' | 'info'; message: string }
export const toasts = createSlice({
  name: 'toasts',
  initialState: [] as Toast[],
  reducers: {
    pushToast: (s, a: PayloadAction<Toast>) => { s.push(a.payload) },
    dismissToast: (s, a: PayloadAction<string>) => s.filter((t) => t.id !== a.payload),
  },
})
