import { useEffect, useId, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import vpLogo from "../../assets/VP_logo.svg";
import { Container } from "../ui/Container";

const navItems = [
  { to: "/projects", label: "Projects" },
  { to: "/games", label: "Games" },
  { to: "/about", label: "About" },
];
const resumeHref = `${import.meta.env.BASE_URL}resume.pdf`;

function ScrollToTop({ pathname }: { pathname: string }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export function AppLayout() {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const mobileNavId = useId();

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen min-w-0 max-w-full flex-col overflow-x-clip bg-background text-foreground">
      <ScrollToTop pathname={location.pathname} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-[var(--space-4)] focus:left-[var(--space-4)] focus:z-50 focus:rounded-[var(--radius-md)] focus:bg-surface focus:px-[var(--space-4)] focus:py-[var(--space-3)] focus:text-foreground focus:shadow-[var(--shadow-card)]"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-40 max-w-full overflow-x-clip border-b border-[color:var(--header-bg)] bg-[color:color-mix(in_srgb,var(--header-bg)_88%,transparent)] text-white backdrop-blur-[10px]">
        <Container className="relative flex h-11 min-w-0 max-w-full items-center justify-between gap-2 px-3 sm:h-12 sm:gap-2 sm:px-4 md:h-16 md:gap-4 md:px-[var(--space-container-inline-md)] lg:px-[var(--space-container-inline-lg)]">
          <Link
            to="/"
            aria-label="Valentina Pogudina homepage"
            onClick={handleLogoClick}
            className="logo inline-flex shrink-0 items-center rounded-md py-1.5 sm:py-2"
          >
            <img src={vpLogo} alt="" className="h-4.5 w-auto sm:h-5 md:h-6" />
          </Link>

          <button
            type="button"
            className="navLink ml-auto inline-flex items-center rounded-md px-2 py-1.5 text-[0.78rem] font-medium tracking-[0.08px] text-[rgba(255,255,255,0.9)] hover:text-white focus-visible:text-white sm:hidden"
            aria-expanded={isMobileNavOpen}
            aria-controls={mobileNavId}
            aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMobileNavOpen((current) => !current)}
          >
            Menu
          </button>

          <nav
            aria-label="Primary navigation"
            className="nav ml-auto hidden min-w-0 max-w-full sm:block"
          >
            <ul className="flex min-w-0 max-w-full flex-wrap items-center justify-end gap-4 md:gap-8">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "navLink px-1 py-2 text-[0.82rem] tracking-[0.1px] md:text-sm md:tracking-[0.2px]",
                        isActive
                          ? "text-white"
                          : "text-[rgba(255,255,255,0.85)] hover:text-white focus-visible:text-white",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="hidden md:list-item">
                <a
                  href={resumeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Resume (opens in a new tab)"
                  className="navLink inline-flex items-center gap-1 px-1 py-2 text-sm tracking-[0.2px] text-[rgba(255,255,255,0.8)] hover:text-white focus-visible:text-white"
                >
                  Resume <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </nav>

          <div
            id={mobileNavId}
            className={[
              "absolute left-3 right-3 top-[calc(100%-4px)] rounded-2xl border border-white/12 bg-[color:color-mix(in_srgb,var(--header-bg)_96%,black)] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.22)] sm:hidden",
              isMobileNavOpen ? "block" : "hidden",
            ].join(" ")}
          >
            <nav aria-label="Mobile primary navigation">
              <ul className="grid gap-1">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        [
                          "navLink navLinkNoUnderline block rounded-xl px-3 py-2 text-sm font-medium",
                          isActive
                            ? "bg-white/12 text-white"
                            : "text-[rgba(255,255,255,0.88)] hover:bg-white/8 hover:text-white focus-visible:bg-white/8 focus-visible:text-white",
                        ].join(" ")
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </header>

      <main id="main-content" className="min-w-0 max-w-full flex-1 overflow-x-clip">
        <Outlet />
      </main>

      <footer className="border-t border-border/70 bg-[color:color-mix(in_srgb,var(--surface)_96%,white)]">
        <Container className="flex flex-col gap-3 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5 leading-6">
            <p className="font-medium text-[color:color-mix(in_srgb,var(--foreground)_70%,white)]">
              Valentina Pogudina — Front-End Engineer
            </p>
            <p>React · TypeScript · Accessibility</p>
          </div>
          <a
            href="https://www.linkedin.com/in/valentina-pogudina-64992860/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn (opens in a new tab)"
            className="utilityLink items-center gap-1 font-medium"
          >
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </Container>
      </footer>
    </div>
  );
}
