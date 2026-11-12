import { Route, Routes } from 'react-router-dom'
import { LayoutSwitch } from './components/layout/LayoutSwitch'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Platform from './pages/Platform'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import OrderSuccess from './pages/OrderSuccess'
import Orders, { OrderDetail } from './pages/Orders'
import Prescriptions from './pages/Prescriptions'
import PrescriptionUpload from './pages/PrescriptionUpload'
import Subscriptions from './pages/Subscriptions'
import Reports, { ReportViewer } from './pages/Reports'
import { Doctors, Manufacturers } from './pages/Directories'
import ManufacturerProfile from './pages/ManufacturerProfile'
import { DoctorDashboard, NewPrescription } from './pages/DoctorPortal'
import { ManufacturerDashboard, ManufacturerProducts } from './pages/ManufacturerPortal'
import Fulfillment from './pages/Fulfillment'
import Admin from './pages/Admin'
import Settings from './pages/Settings'
import { EmptyState } from './components/ui'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/platform" element={<Platform />} />
      <Route element={<LayoutSwitch />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/prescriptions/upload" element={<PrescriptionUpload />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/:reportId" element={<ReportViewer />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/prescriptions/new" element={<NewPrescription />} />
        <Route path="/manufacturers" element={<Manufacturers />} />
        <Route path="/manufacturers/:manufacturerId" element={<ManufacturerProfile />} />
        <Route path="/manufacturer/dashboard" element={<ManufacturerDashboard />} />
        <Route path="/manufacturer/products" element={<ManufacturerProducts />} />
        <Route path="/fulfillment/dashboard" element={<Fulfillment />} />
        <Route path="/admin/dashboard" element={<Admin />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<EmptyState title="Page not found" message="The page you requested does not exist." />} />
      </Route>
    </Routes>
  )
}
