import { themes, useTheme, type Theme } from '../../context/ThemeContext'

const themeLabels: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  forest: 'Forest',
  sunset: 'Sunset',
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <label className="flex items-center gap-3 text-sm font-medium text-white">
      <span>Theme</span>
      <select
        value={theme}
        onChange={(event) => setTheme(event.target.value as Theme)}
        className="rounded-xl border border-white/25 bg-[var(--game-teal-dark)] px-3 py-2 text-white transition hover:bg-[var(--game-teal-light)]"
        aria-label="Select color theme"
      >
        {themes.map((themeOption) => (
          <option key={themeOption} value={themeOption}>
            {themeLabels[themeOption]}
          </option>
        ))}
      </select>
    </label>
  )
}
