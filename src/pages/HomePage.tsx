import { HeroSection } from "../components/home/HeroSection";
import { HomepageCard } from "../components/projects/HomepageCard";
import { Section } from "../components/ui/Section";
import { projects } from "../data/projects";

export function HomePage() {
  return (
    <>
      <HeroSection />

      <Section
        eyebrow="Featured Work"
        title="Enterprise UI, accessibility, and design systems"
        description="These projects reflect product ownership, cross-team delivery, and the ability to connect design intent with production-ready implementation."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <HomepageCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>
    </>
  );
}
