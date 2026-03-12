export function extractSvgBody(svg: string): string {
  const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>\s*$/)
  return match ? match[1] : svg
}
