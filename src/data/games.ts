import pawsThinkGamePreview from '../assets/PawsThinkGamePreview.png'
import hideSqueakGamePreview from '../assets/HideSqueakGamePreview.png'
import hideSqueakSettingsPreview from '../assets/HideSqueakSettings.png'

export type Game = {
  detailDescription: string
  description: string
  eyebrow?: string
  previewAlt: string
  previewImage: string
  previewImageFit?: 'contain' | 'cover'
  previewImagePosition?: string
  previewSecondaryAlt?: string
  previewSecondaryImage?: string
  previewSecondaryImageFit?: 'contain' | 'cover'
  previewSecondaryImagePosition?: string
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
    previewImageFit: 'cover',
    previewImagePosition: 'center top',
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
  {
    slug: 'hide-and-squeak',
    title: 'Hide & Squeak',
    previewImage: hideSqueakGamePreview,
    previewAlt: 'Hide & Squeak game preview',
    previewImageFit: 'contain',
    previewImagePosition: 'center top',
    previewSecondaryImage: hideSqueakSettingsPreview,
    previewSecondaryAlt: 'Hide & Squeak settings and board layout',
    previewSecondaryImageFit: 'contain',
    previewSecondaryImagePosition: 'center top',
    previewVariant: 'landscape',
    summary:
      'A spatial reasoning puzzle where players follow movement commands across a grid and identify the mouse’s final destination.',
    description:
      'The game blends procedural round generation, readable board logic, multiple input modes, hint support, previous-round review, and a timed mode that rewards accurate path tracking.',
    tags: ['React', 'TypeScript', 'Puzzle', 'Accessibility'],
    eyebrow: 'New game',
    detailDescription:
      'Hide & Squeak is a grid puzzle about tracking a hidden mouse through a generated command sequence. Depending on difficulty, players either click the final board cell, choose from plausible coordinate options, or type the destination directly using A1-style labels, while the board generation system balances item density, distractor quality, and visual variety.',
  },
]

export function getGameBySlug(slug?: string) {
  return games.find((game) => game.slug === slug)
}
