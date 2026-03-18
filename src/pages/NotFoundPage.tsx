import { Link } from 'react-router-dom'

import { Section } from '../components/ui/Section'

export function NotFoundPage() {
  return (
    <Section
      eyebrow="404"
      title="That page does not exist."
      description="The wildcard route keeps broken links from dumping visitors into a blank screen."
    >
      <Link className="utilityLink items-center text-sm font-semibold" to="/">
        Go back home
      </Link>
    </Section>
  )
}
