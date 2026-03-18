type ImageBlockProps = {
  src: string
  alt: string
  caption?: string
}

export function ImageBlock({ src, alt, caption }: ImageBlockProps) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-border/80 bg-surface">
      <img src={src} alt={alt} className="w-full object-cover" />
      {caption ? (
        <figcaption className="border-t border-border/80 px-5 py-4 text-sm leading-6 text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
