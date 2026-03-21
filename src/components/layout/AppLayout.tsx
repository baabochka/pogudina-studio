import { useEffect } from "react";
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

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ScrollToTop pathname={location.pathname} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-[var(--space-4)] focus:left-[var(--space-4)] focus:z-50 focus:rounded-[var(--radius-md)] focus:bg-surface focus:px-[var(--space-4)] focus:py-[var(--space-3)] focus:text-foreground focus:shadow-[var(--shadow-card)]"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-40 border-b border-[color:var(--header-bg)] bg-[color:color-mix(in_srgb,var(--header-bg)_88%,transparent)] text-white backdrop-blur-[10px]">
        <Container className="flex h-14 items-center justify-between gap-4 md:h-16">
          <Link
            to="/"
            aria-label="Valentina Pogudina homepage"
            onClick={handleLogoClick}
            className="logo inline-flex w-fit items-center rounded-md py-2"
          >
            <img src={vpLogo} alt="" className="h-7 w-auto md:h-6" />
          </Link>
          <nav aria-label="Primary navigation" className="nav ml-auto">
            <ul className="flex flex-wrap items-center gap-6 md:gap-8">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "navLink px-1 py-2 text-sm tracking-[0.2px]",
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
        </Container>
      </header>

      <main id="main-content" className="flex-1">
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
