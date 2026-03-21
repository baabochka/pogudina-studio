import { tagChipClassName } from '../ui/contentStyles'

type TagListProps = {
  items: string[]
}

export function TagList({ items }: TagListProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className={tagChipClassName}>
          {item}
        </li>
      ))}
    </ul>
  )
}
