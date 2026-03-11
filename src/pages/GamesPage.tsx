import { CardDemo } from '../cards/demo/CardDemo'
import { Section } from '../components/ui/Section'

export function GamesPage() {
  return (
    <Section
      eyebrow="Games"
      title="A small reusable card system for future game prototypes."
      description="This demo validates shared palette rules, semantic illustration tokens, and SVG-based rendering for multiple card types."
    >
      <CardDemo />
    </Section>
  )
}
