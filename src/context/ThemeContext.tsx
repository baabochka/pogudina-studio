/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

export const themes = ['light', 'dark', 'forest', 'sunset'] as const

export type Theme = (typeof themes)[number]

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const STORAGE_KEY = 'portfolio-theme'
const DEFAULT_THEME: Theme = 'light'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function isTheme(value: string | null): value is Theme {
  return value !== null && themes.includes(value as Theme)
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY)
  if (isTheme(storedTheme)) {
    return storedTheme
  }

  const htmlTheme = document.documentElement.dataset.theme
  if (isTheme(htmlTheme ?? null)) {
    return htmlTheme as Theme
  }

  return DEFAULT_THEME
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider.')
  }

  return context
}
