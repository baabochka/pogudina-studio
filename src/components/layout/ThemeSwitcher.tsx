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
    <label className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
      <span>Theme</span>
      <select
        value={theme}
        onChange={(event) => setTheme(event.target.value as Theme)}
        className="rounded-full border border-border bg-background px-3 py-2 text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
