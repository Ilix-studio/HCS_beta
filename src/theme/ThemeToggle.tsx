import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme, type Theme } from './context'

const options: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <div role="radiogroup" aria-label="Theme" className="flex overflow-hidden rounded-lg border border-slate-300 bg-white">
      {options.map(({ id, label, icon: Icon }) => (
        <button key={id} role="radio" aria-checked={theme === id} aria-label={`${label} theme`} title={`${label} theme`} onClick={() => setTheme(id)}
          className={`cursor-pointer p-1.5 ${theme === id ? 'bg-navy-700 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
