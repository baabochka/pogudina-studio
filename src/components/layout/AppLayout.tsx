import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import vpLogo from "../../assets/VP_logo.svg";
import { Container } from "../ui/Container";

const navItems = [
  { to: "/projects", label: "Projects" },
  { to: "/games", label: "Games" },
  { to: "/about", label: "About" },
];

export function AppLayout() {
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 0);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-[color:var(--header-bg)] bg-[color:color-mix(in_srgb,var(--header-bg)_88%,transparent)] text-white backdrop-blur-[10px]">
        <Container className="flex h-14 items-center justify-between gap-4 md:h-16">
          <Link
            to="/"
            aria-label="Valentina Pogudina homepage"
            onClick={handleLogoClick}
            className="logo inline-flex w-fit items-center rounded-md py-2"
          >
            <img src={vpLogo} alt="VP studio" className="h-7 w-auto md:h-6" />
          </Link>
          <div className="flex items-center">
            <nav aria-label="Primary navigation" className="nav">
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
                            : "text-[rgba(255,255,255,0.85)] hover:text-[#ffffff]",
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

      <main className="flex-1">
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
            className="utilityLink items-center gap-1 font-medium"
          >
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </Container>
      </footer>
    </div>
  );
}
