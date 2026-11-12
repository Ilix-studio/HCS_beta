import { useCallback, useEffect, useState } from 'react'
import { pushToast, useAppDispatch, useAppSelector } from '../store'
import { uid } from './utils'

export const useToast = () => {
  const dispatch = useAppDispatch()
  return useCallback(
    (kind: 'success' | 'error' | 'info', message: string) => dispatch(pushToast({ id: uid('t'), kind, message })),
    [dispatch],
  )
}

export const useSession = () => useAppSelector((s) => s.session)

export const useProducts = () => useAppSelector((s) => s.catalog.products)
export const useManufacturers = () => useAppSelector((s) => s.catalog.manufacturers)

/** Simulated async load so skeletons show briefly. */
export const useFakeLoading = (ms = 450) => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
  }, [ms])
  return loading
}
