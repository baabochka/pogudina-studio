import pawsThinkGamePreview from '../assets/PawsThinkGamePreview.png'

export type Game = {
  detailDescription: string
  description: string
  eyebrow?: string
  previewAlt: string
  previewImage: string
  previewVariant: 'portrait' | 'landscape' | 'square'
  slug: string
  summary: string
  tags: string[]
  title: string
}

export const games: Game[] = [
  {
    slug: 'paws-and-think',
    title: 'Paws and Think',
    previewImage: pawsThinkGamePreview,
    previewAlt: 'Paws and Think game preview',
    previewVariant: 'portrait',
    summary:
      'A quick deduction game built around color logic, visual pattern recognition, and a race against the clock.',
    description:
      'Match original object colors, eliminate impossible answers, and solve each card before time runs out. It’s playful on the surface, but built around clear logic and fast visual reasoning.',
    tags: ['React', 'SVG', 'Puzzle', 'Mobile'],
    eyebrow: 'Featured game',
    detailDescription:
      'A playful logic game built around color matching, quick deduction, and a little bit of pressure from the clock. Each card shows two objects, but only one token can be the correct answer. Sometimes the answer is an object shown on the card in its original color. If neither object is in its original color, you solve the puzzle by eliminating the objects on the card and the objects whose original colors are already visible. The one token left is the answer.',
  },
]

export function getGameBySlug(slug?: string) {
  return games.find((game) => game.slug === slug)
}
