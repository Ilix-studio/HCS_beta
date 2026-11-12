import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import * as s from './slices'

const KEY = 'hcs-demo-state-v1'
const persisted = ['session', 'cart', 'addresses', 'catalog', 'orders', 'prescriptions', 'subscriptions', 'reports', 'notifications'] as const

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : undefined
  } catch {
    return undefined
  }
}

const rootReducer = combineReducers({
    session: s.session.reducer,
    cart: s.cart.reducer,
    addresses: s.addresses.reducer,
    catalog: s.catalog.reducer,
    orders: s.orders.reducer,
    prescriptions: s.prescriptions.reducer,
    subscriptions: s.subscriptions.reducer,
    reports: s.reports.reducer,
    notifications: s.notifications.reducer,
    toasts: s.toasts.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: load() as Partial<ReturnType<typeof rootReducer>> | undefined,
})

store.subscribe(() => {
  try {
    const state = store.getState()
    const out: Record<string, unknown> = {}
    for (const k of persisted) out[k] = state[k]
    localStorage.setItem(KEY, JSON.stringify(out))
  } catch {
    /* storage full or unavailable: demo continues without persistence */
  }
})

export const resetDemo = () => {
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
  location.reload()
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const { setRole, setPatient, setManufacturer } = s.session.actions
export const { addAddress, setDefaultAddress, removeAddress } = s.addresses.actions
export const { addToCart, addManyToCart, setCheckoutOptions, setQuantity, removeFromCart, applyCoupon, selectCartPrescription, clearCart } = s.cart.actions
export const { toggleWishlist, upsertProduct, removeProduct, upsertManufacturer, decrementStock } = s.catalog.actions
export const { addOrder, setOrderStatus, togglePacked, setTracking } = s.orders.actions
export const { addPrescription, setPrescriptionStatus } = s.prescriptions.actions
export const { addSubscription, updateSubscription } = s.subscriptions.actions
export const { addReport, publishReport } = s.reports.actions
export const { addNotification, markRead, markAllRead } = s.notifications.actions
export const { pushToast, dismissToast } = s.toasts.actions
