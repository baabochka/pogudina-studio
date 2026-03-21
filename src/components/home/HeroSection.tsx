import { Link } from "react-router-dom";

import headshotImage from "../../assets/headshot-hero.jpg";
import headshotImageWebp from "../../assets/headshot-hero.webp";
import { Container } from "../ui/Container";
import { getButtonClassName } from "../ui/buttonClassName";

const resumeHref = `${import.meta.env.BASE_URL}resume.pdf`;

export function HeroSection() {
  return (
    <section
      className="pt-12 pb-0 sm:pt-16 sm:pb-0 lg:pt-20 lg:pb-[var(--space-8)]"
      aria-labelledby="hero-title"
    >
      <Container className="max-w-6xl">
        <div className="grid items-start gap-6 sm:gap-8 md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:gap-16">
          <div className="max-w-[600px]">
            <h1
              id="hero-title"
              className="mb-5 max-w-[600px] text-[2.35rem] font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl sm:leading-[1.12]"
            >
              Front-end Engineer crafting thoughtful, accessible interfaces
            </h1>
            <p className="max-w-[58ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              I build polished, maintainable web applications with React,
              JavaScript, and TypeScript, focusing on usability, accessibility,
              and design systems. I also design and build interactive
              experiences, including{" "}
              <Link
                to="/games"
                className="inlineLink font-medium"
              >
                small browser games
              </Link>
              .
            </p>
            <div className="mt-5 flex flex-col gap-[var(--space-3)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-[var(--space-4)]">
              <Link
                to="/projects"
                className={[getButtonClassName(), 'min-h-11 w-full sm:w-auto'].join(' ')}
              >
                View Projects
              </Link>
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Resume (opens in a new tab)"
                className={[getButtonClassName('secondary'), 'min-h-11 w-full sm:w-auto'].join(' ')}
              >
                View Resume
              </a>
            </div>
          </div>

          <div className="mt-5 justify-self-start lg:mt-0 lg:justify-self-end">
            <Link
              to="/about"
              aria-label="Open About page"
              className="group block rounded-[20px]"
            >
              <picture>
                <source
                  srcSet={headshotImageWebp}
                  type="image/webp"
                />
                <img
                  src={headshotImage}
                  alt="Headshot portrait of Valentina Pogudina"
                  width="640"
                  height="835"
                  sizes="(min-width: 1024px) 300px, 260px"
                  className="w-full max-w-[260px] rounded-[20px] object-cover shadow-[var(--shadow-image)] transition-[transform,box-shadow] duration-[var(--duration-interactive)] ease-[var(--easing-interactive)] group-hover:scale-[1.01] group-hover:shadow-lg sm:max-w-[300px]"
                />
              </picture>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
