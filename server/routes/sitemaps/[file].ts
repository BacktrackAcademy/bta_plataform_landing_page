import type { SitemapEntry } from '../../utils/sitemap'

interface FiltersPayload {
  specialties: { slug: string, courses_count: number }[]
  categories: { slug: string, courses_count: number }[]
  levels: { slug: string, courses_count: number }[]
  article_categories: { slug: string }[]
  discussion_categories: { slug: string }[]
}

const STATIC_PAGES = ['/', '/cursos', '/especialidades', '/articulos', '/debates', '/precios', '/team', '/security', '/preguntas-frecuentes', '/privacy_policy', '/terms_of_use']

// /sitemaps/paginas.xml  → estáticas + listados por tema/especialidad/nivel/categoría
// /sitemaps/cursos-2.xml → página 2 de cursos (ver SITEMAP_TYPES)
export default defineEventHandler(async (event) => {
  const { origin, canIndex } = siteInfo(event)
  if (!canIndex)
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })

  const file = getRouterParam(event, 'file') ?? ''
  const baseURL = useRuntimeConfig(event).public.apiBaseUrl
  const urls: { loc: string, lastmod?: string | null }[] = []

  if (file === 'paginas.xml') {
    let filters: FiltersPayload
    try {
      filters = await $fetch<FiltersPayload>('/public/filters', { baseURL })
    }
    catch {
      sitemapUnavailable(event)
    }
    STATIC_PAGES.forEach(p => urls.push({ loc: p }))
    // Cursos por tema / especialidad / nivel: solo con 2+ cursos (la página con menos se marca noindex).
    ;(filters.specialties ?? []).filter(c => c.courses_count >= 2).forEach(c => urls.push({ loc: `/cursos/especialidad/${encodeURIComponent(c.slug)}` }))
    ;(filters.categories ?? []).filter(c => c.courses_count >= 2).forEach(c => urls.push({ loc: `/cursos/tema/${encodeURIComponent(c.slug)}` }))
    ;(filters.levels ?? []).filter(c => c.courses_count >= 2).forEach(c => urls.push({ loc: `/cursos/nivel/${encodeURIComponent(c.slug)}` }))
    ;(filters.article_categories ?? []).forEach(c => urls.push({ loc: `/articulos/categoria/${encodeURIComponent(c.slug)}` }))
    ;(filters.discussion_categories ?? []).forEach(c => urls.push({ loc: `/debates/categoria/${encodeURIComponent(c.slug)}` }))
  }
  else {
    const m = /^([a-z]+)-([1-9]\d{0,3})\.xml$/.exec(file)
    const def = m && SITEMAP_TYPES[m[1]]
    if (!m || !def)
      throw createError({ statusCode: 404, statusMessage: 'Not Found' })

    let data: { entries: SitemapEntry[] }
    try {
      data = await $fetch<{ entries: SitemapEntry[] }>('/public/sitemap', { baseURL, query: { type: def.type, page: m[2] } })
    }
    catch {
      sitemapUnavailable(event)
    }
    // Una página fuera de rango (el catálogo se achicó) es 404, no un sitemap vacío.
    if (!data.entries?.length)
      throw createError({ statusCode: 404, statusMessage: 'Not Found' })
    data.entries.forEach(e => urls.push({ loc: def.toPath(e.slug), lastmod: e.updated_at }))
  }

  const body = urls.map(u =>
    `  <url><loc>${xmlEscape(origin + u.loc)}</loc>${u.lastmod ? `<lastmod>${xmlEscape(u.lastmod)}</lastmod>` : ''}</url>`,
  ).join('\n')
  return sendXml(event, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`)
})
