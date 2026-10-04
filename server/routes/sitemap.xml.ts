interface Entry { slug: string, updated_at: string | null }
interface SitemapPayload {
  specialties: Entry[]
  courses: Entry[]
  articles: Entry[]
  discussions: Entry[]
  authors: Entry[]
  profiles: Entry[]
}
interface FiltersPayload {
  specialties: { slug: string, courses_count: number }[]
  categories: { slug: string, courses_count: number }[]
  levels: { slug: string, courses_count: number }[]
  article_categories: { slug: string }[]
  discussion_categories: { slug: string }[]
}

const MAX_URLS = 50000
const STATIC_PAGES = ['/', '/cursos', '/especialidades', '/articulos', '/debates', '/precios', '/team', '/security', '/preguntas-frecuentes', '/privacy_policy', '/terms_of_use']

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

// Una sola fuente de verdad: los slugs salen de la API pública de Rails (nada de listas a mano que se desactualicen).
export default defineEventHandler(async (event) => {
  const { origin, canIndex } = siteInfo(event)
  if (!canIndex)
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })

  const baseURL = useRuntimeConfig(event).public.apiBaseUrl
  let data: SitemapPayload
  let filters: FiltersPayload
  try {
    ;[data, filters] = await Promise.all([
      $fetch<SitemapPayload>('/public/sitemap', { baseURL }),
      $fetch<FiltersPayload>('/public/filters', { baseURL }),
    ])
  }
  catch {
    // Mejor no publicar nada que un sitemap incompleto: Google reintenta.
    setHeader(event, 'Cache-Control', 'no-store')
    throw createError({ statusCode: 503, statusMessage: 'Sitemap no disponible' })
  }

  const urls: { loc: string, lastmod?: string | null }[] = STATIC_PAGES.map(p => ({ loc: p }))
  const add = (entries: Entry[] | undefined, toPath: (slug: string) => string) =>
    (entries ?? []).forEach(e => urls.push({ loc: toPath(e.slug), lastmod: e.updated_at }))

  add(data.specialties, s => `/especialidad/${encodeURIComponent(s)}`)
  add(data.courses, s => `/curso/${encodeURIComponent(s)}`)
  add(data.articles, s => `/articulo/${encodeURIComponent(s)}`)
  add(data.discussions, s => `/debate/${encodeURIComponent(s)}`)
  add(data.authors, s => `/autor/${encodeURIComponent(s)}`)
  add(data.profiles, s => `/@${encodeURIComponent(s)}`)
  // Cursos por tema / especialidad: solo con 2+ cursos (la página con menos se marca noindex).
  ;(filters.specialties ?? []).filter(c => c.courses_count >= 2).forEach(c => urls.push({ loc: `/cursos/especialidad/${encodeURIComponent(c.slug)}` }))
  ;(filters.categories ?? []).filter(c => c.courses_count >= 2).forEach(c => urls.push({ loc: `/cursos/tema/${encodeURIComponent(c.slug)}` }))
  ;(filters.levels ?? []).filter(c => c.courses_count >= 2).forEach(c => urls.push({ loc: `/cursos/nivel/${encodeURIComponent(c.slug)}` }))
  ;(filters.article_categories ?? []).forEach(c => urls.push({ loc: `/articulos/categoria/${encodeURIComponent(c.slug)}` }))
  ;(filters.discussion_categories ?? []).forEach(c => urls.push({ loc: `/debates/categoria/${encodeURIComponent(c.slug)}` }))

  const body = urls.slice(0, MAX_URLS).map(u =>
    `  <url><loc>${esc(origin + u.loc)}</loc>${u.lastmod ? `<lastmod>${esc(u.lastmod)}</lastmod>` : ''}</url>`,
  ).join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
})
