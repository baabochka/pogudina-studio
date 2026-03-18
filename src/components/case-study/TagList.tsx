type TagListProps = {
  items: string[]
}

export function TagList({ items }: TagListProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-[color:color-mix(in_srgb,var(--border)_82%,white)] bg-[color:color-mix(in_srgb,var(--surface-muted)_82%,white)] px-3 py-1 text-xs font-medium text-[color:color-mix(in_srgb,var(--foreground)_78%,#374151_22%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
