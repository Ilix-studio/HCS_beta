import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeContextValue {
  theme: Theme
  resolved: 'light' | 'dark'
  setTheme: (t: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
