import { NavLink, Outlet } from 'react-router-dom'

import { Container } from '../ui/Container'
import { ThemeSwitcher } from './ThemeSwitcher'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/games', label: 'Games' },
]

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only left-4 top-4 z-50 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:absolute"
      >
        Skip to main content
      </a>

      <header className="border-b border-border bg-surface/90 backdrop-blur">
        <Container className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Front-End Engineer
            </p>
            <NavLink to="/" className="text-2xl font-semibold text-foreground">
              Valentina Pogudina
            </NavLink>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <nav aria-label="Primary navigation">
              <ul className="flex flex-wrap items-center gap-2">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        [
                          'inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
                        ].join(' ')
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <ThemeSwitcher />
          </div>
        </Container>
      </header>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface">
        <Container className="flex flex-col gap-2 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>Valentina Pogudina | Front-End Engineer | React, TypeScript, accessibility.</p>
          <p>baabochka@gmail.com | 631 245 2798</p>
        </Container>
      </footer>
    </div>
  )
}
