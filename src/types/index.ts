export type UserRole = 'patient' | 'doctor' | 'manufacturer' | 'fulfillment' | 'admin'

export interface Category {
  id: string
  name: string
  group: 'medicine' | 'supply'
}

export interface Manufacturer {
  id: string
  name: string
  description: string
  headquarters: string
  email: string
  phone: string
  website: string
  registration: string
  categories: string[]
  color: string
}

export type Availability = 'in_stock' | 'low_stock' | 'out_of_stock'
export type ListingStatus = 'active' | 'pending'

export interface Product {
  id: string
  brand: string
  generic: string
  manufacturerId: string
  categoryId: string
  composition: string
  strength: string
  dosageForm: string
  packSize: string
  mrp: number
  price: number
  stock: number
  availability: Availability
  prescriptionRequired: boolean
  description: string
  safety: string
  popularity: number
  status: ListingStatus
  image?: string
  updatedAt: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  email: string
  address: string
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  registration: string
  clinic: string
  experience: number
  email: string
  degrees: string
  location: string
  distanceKm: number
  rating: number
  fee: number
  skin: string
  hair: string
}

export type PrescriptionStatus = 'uploaded' | 'processing' | 'awaiting_verification' | 'verified' | 'rejected'

export interface PrescriptionMedicine {
  id: string
  productId?: string
  name: string
  strength: string
  dosage: string
  frequency: string
  duration: string
  quantity: number
  confidence?: number
}

export interface Prescription {
  id: string
  patientId: string
  doctorId?: string
  doctorName: string
  date: string
  diagnosis?: string
  notes?: string
  medicines: PrescriptionMedicine[]
  status: PrescriptionStatus
  source: 'upload' | 'doctor'
  fileName?: string
  fileUrl?: string
  fileType?: string
  rejectionReason?: string
  validUntil?: string
}

export interface OrderItem {
  productId: string
  quantity: number
  unitPrice: number
}

export type OrderStatus = 'placed' | 'verification' | 'packed' | 'dispatched' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  customerId: string
  items: OrderItem[]
  subtotal: number
  discount: number
  delivery: number
  tax: number
  total: number
  status: OrderStatus
  address: string
  deliveryMethod: string
  paymentMethod: string
  prescriptionId?: string
  tracking?: string
  placedAt: string
  packedItems: string[]
  timeline: { status: OrderStatus; at: string }[]
  source?: 'order' | 'subscription'
}

export type SubscriptionFrequency = 'weekly' | 'monthly'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled'

export interface Subscription {
  id: string
  customerId: string
  items: { productId: string; quantity: number }[]
  frequency: SubscriptionFrequency
  status: SubscriptionStatus
  startDate: string
  nextDispatch: string
  address: string
  reminders: { dispatch: boolean; refill: boolean; payment: boolean }
  history: { date: string; note: string }[]
  prescriptionId?: string
}

export type ReportStatus = 'published' | 'pending'

export interface LabReport {
  id: string
  patientId: string
  centerId: string
  title: string
  category: string
  date: string
  status: ReportStatus
  summary: string
  kind: 'pdf' | 'image'
  fileUrl?: string
}

export interface DiagnosticCenter {
  id: string
  name: string
  city: string
  phone: string
}

export interface Notification {
  id: string
  userId: string
  type: 'dispatch' | 'refill' | 'payment' | 'prescription' | 'report' | 'order'
  title: string
  message: string
  date: string
  read: boolean
  link?: string
}

export interface Address {
  id: string
  customerId: string
  label: 'Home' | 'Work' | 'Other'
  name: string
  phone: string
  line: string
  pincode: string
  isDefault: boolean
}

export type OrderType = 'once' | 'weekly' | 'monthly'
export type DeliveryMethod = 'standard' | 'express' | 'pickup'
