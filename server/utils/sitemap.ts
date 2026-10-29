// Sitemap partido en varios archivos (límite del protocolo: 50.000 URLs / 50 MB por archivo).
// /sitemap.xml es un índice → /sitemaps/paginas.xml (estáticas + listados) y /sitemaps/<tipo>-<n>.xml (una página de Rails por archivo).

export interface SitemapSummary { per_page: number, types: Record<string, { count: number }> }
export interface SitemapEntry { slug: string, updated_at: string | null }

/** Archivo público → tipo de la API de Rails + ruta pública. */
export const SITEMAP_TYPES: Record<string, { type: string, toPath: (slug: string) => string }> = {
  especialidades: { type: 'specialties', toPath: s => `/especialidad/${encodeURIComponent(s)}` },
  cursos: { type: 'courses', toPath: s => `/curso/${encodeURIComponent(s)}` },
  articulos: { type: 'articles', toPath: s => `/articulo/${encodeURIComponent(s)}` },
  debates: { type: 'discussions', toPath: s => `/debate/${encodeURIComponent(s)}` },
  autores: { type: 'authors', toPath: s => `/autor/${encodeURIComponent(s)}` },
  skills: { type: 'skills', toPath: s => `/skills/${encodeURIComponent(s)}` },
  skillcategorias: { type: 'skill_categories', toPath: s => `/skills/categoria/${encodeURIComponent(s)}` },
  perfiles: { type: 'profiles', toPath: s => `/@${encodeURIComponent(s)}` },
}

export const xmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

export function sendXml(event: Parameters<typeof setHeader>[0], xml: string) {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  return `<?xml version="1.0" encoding="UTF-8"?>\n${xml}\n`
}

/** Mejor no publicar nada que un sitemap incompleto: Google reintenta. */
export function sitemapUnavailable(event: Parameters<typeof setHeader>[0]): never {
  setHeader(event, 'Cache-Control', 'no-store')
  throw createError({ statusCode: 503, statusMessage: 'Sitemap no disponible' })
}
