import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './context'

const KEY = 'hcs-theme'
const query = '(prefers-color-scheme: dark)'

const readStored = (): Theme => {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' || v === 'system' ? v : 'system'
  } catch {
    return 'system'
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStored)
  const [systemDark, setSystemDark] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark')
    document.documentElement.style.colorScheme = resolved
  }, [resolved])

  const value = useMemo(() => ({
    theme, resolved,
    setTheme: (t: Theme) => {
      setThemeState(t)
      try { localStorage.setItem(KEY, t) } catch { /* storage unavailable */ }
    },
  }), [theme, resolved])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
