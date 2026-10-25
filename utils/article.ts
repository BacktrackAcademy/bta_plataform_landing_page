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

const INLINE_TAGS = ['strong', 'b', 'em', 'i', 'a', 'span', 'code', 'u', 's', 'sub', 'sup', 'mark']
function visibleText(h: string) {
  return decode(h.replace(/<[^>]*>/g, '')).replace(/\xA0/g, ' ').trim()
}
function balanced(h: string) {
  return INLINE_TAGS.every(t =>
    (h.match(new RegExp(`<${t}(?:\\s[^>]*)?>`, 'gi')) ?? []).length === (h.match(new RegExp(`</${t}>`, 'gi')) ?? []).length)
}

/**
 * El editor escribe el punto aparte como `<br>` dentro de un mismo `<p>`, así que la separación entre párrafos no se ve.
 * Un doble `<br>`, o un `<br>` entre oraciones (cierre de oración antes y mayúscula, número o ¿¡ después), se convierte
 * en un párrafo propio. Los saltos de línea de listas o líneas sueltas se mantienen. El texto no cambia.
 */
export function splitParagraphBreaks(html: string): string {
  return html.replace(/<p(\s[^>]*)?>([\s\S]*?)<\/p>/gi, (match, attrs: string | undefined, inner: string) => {
    if (!/<br/i.test(inner))
      return match
    const parts: string[] = []
    const re = /(?:<br\s*\/?>\s*)+/gi
    let cur = ''
    let pos = 0
    for (let br = re.exec(inner); br; br = re.exec(inner)) {
      const seg = cur + inner.slice(pos, br.index)
      const prev = visibleText(seg)
      const next = visibleText(inner.slice(re.lastIndex))
      const double = (br[0].match(/<br/gi) ?? []).length >= 2
      const sentence = /[.!?:…)»”"]$/.test(prev) && /^[¿¡A-ZÁÉÍÓÚÑ0-9"“«(]/.test(next)
      if (prev && next && balanced(seg) && (double || sentence)) {
        parts.push(seg.trim())
        cur = ''
      }
      else {
        cur = seg + br[0]
      }
      pos = re.lastIndex
    }
    parts.push((cur + inner.slice(pos)).trim())
    return parts.filter(Boolean).map(p => `<p${attrs ?? ''}>${p}</p>`).join('')
  })
}

/** HTML (ya saneado) → texto plano, para JSON-LD y resúmenes. */
export function htmlToText(html: string | null | undefined, max = 5000): string {
  return decode((html ?? '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim().slice(0, max)
}

/**
 * Parte el HTML de un artículo largo en dos mitades para insertar un CTA a mitad de lectura.
 * Corta justo antes de un <h2> cercano a la mitad (nunca dentro de un bloque); si no hay suficientes <h2>,
 * corta tras un </p> cerca del 45 %. Artículos cortos → una sola pieza (el CTA final basta).
 */
export function splitArticleHtml(html: string): [string, string | null] {
  if (html.length < 5000)
    return [html, null]
  const h2s = [...html.matchAll(/<h2[\s>]/gi)].map(m => m.index ?? 0)
  if (h2s.length >= 3) {
    const target = html.length / 2
    const at = h2s.slice(1).reduce((best, i) => (Math.abs(i - target) < Math.abs(best - target) ? i : best), h2s[1]!)
    return [html.slice(0, at), html.slice(at)]
  }
  const target = Math.floor(html.length * 0.45)
  const close = html.indexOf('</p>', target)
  if (close === -1 || close > html.length * 0.7)
    return [html, null]
  return [html.slice(0, close + 4), html.slice(close + 4)]
}
