import { Link } from "react-router-dom";

import headshotImage from "../../assets/headshot.jpg";
import { Container } from "../ui/Container";

export function HeroSection() {
  return (
    <section
      className="pt-16 pb-0 sm:pt-20 sm:pb-0 lg:pt-24 lg:pb-8"
      aria-labelledby="hero-title"
    >
      <Container className="max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 sm:gap-8 md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:gap-16">
          <div className="max-w-[600px]">
            <h1
              id="hero-title"
              className="mb-6 max-w-[600px] text-[2.35rem] font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl sm:leading-[1.12]"
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
                className="inlineLink font-medium focus-visible:outline-none"
              >
                small browser games
              </Link>
              .
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                to="/projects"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_30px_-18px_color-mix(in_srgb,var(--primary)_65%,transparent)] transition duration-180 hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px sm:min-h-11 sm:w-auto"
              >
                View Projects
              </Link>
            </div>
          </div>

          <div className="mt-6 justify-self-start lg:mt-0 lg:justify-self-end">
            <Link
              to="/about"
              aria-label="Open About page"
              className="group block focus-visible:rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <img
                src={headshotImage}
                alt="Headshot portrait of Valentina Pogudina"
                className="w-full max-w-[260px] rounded-[20px] object-cover shadow-[0_30px_60px_-32px_rgba(15,23,42,0.4)] transition duration-200 ease-out group-hover:scale-[1.01] group-hover:shadow-lg sm:max-w-[300px]"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
