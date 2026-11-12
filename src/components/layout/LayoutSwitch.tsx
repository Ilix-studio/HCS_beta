import { useAppSelector } from '../../store'
import { AppLayout } from './AppLayout'
import { CustomerLayout } from './CustomerLayout'

/** Patients get the customer-facing storefront shell; staff roles get the admin sidebar shell. */
export function LayoutSwitch() {
  const role = useAppSelector((s) => s.session.role)
  return role === 'patient' ? <CustomerLayout /> : <AppLayout />
}
