export interface TocItem { id: string, text: string, level: 2 | 3 }

const ENTITIES: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': '\'', '&nbsp;': ' ' }
const decode = (s: string) => s.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, m => ENTITIES[m] ?? m)

function slugify(text: string) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

/**
 * Prepara el HTML (ya saneado por la API) de un artículo para lectura:
 * - ids en h2/h3 (solo [a-z0-9-], nunca texto crudo) y la tabla de contenidos correspondiente;
 * - imágenes con lazy-loading (el contenido es largo y el LCP es la imagen principal).
 */
export function prepareArticleHtml(html: string): { html: string, toc: TocItem[] } {
  const toc: TocItem[] = []
  const used = new Set<string>()
  const withIds = html.replace(/<(h[23])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (match, tag: string, attrs: string | undefined, inner: string) => {
    const text = decode(inner.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim()
    if (!text)
      return match
    const base = slugify(text) || 'seccion'
    let id = base
    for (let n = 2; used.has(id); n++)
      id = `${base}-${n}`
    used.add(id)
    toc.push({ id, text, level: tag.toLowerCase() === 'h2' ? 2 : 3 })
    return `<${tag}${(attrs ?? '').replace(/\sid="[^"]*"/i, '')} id="${id}">${inner}</${tag}>`
  })
  return { html: withIds.replace(/<img(?![^>]*\sloading=)/gi, '<img loading="lazy" decoding="async"'), toc }
}

/** HTML (ya saneado) → texto plano, para JSON-LD y resúmenes. */
export function htmlToText(html: string | null | undefined, max = 5000): string {
  return decode((html ?? '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim().slice(0, max)
}
