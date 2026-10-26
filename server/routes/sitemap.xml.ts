import type { SitemapSummary } from '../utils/sitemap'

// Índice de sitemaps. Los slugs salen de la API pública de Rails (nada de listas a mano que se desactualicen).
export default defineEventHandler(async (event) => {
  const { origin, canIndex } = siteInfo(event)
  if (!canIndex)
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })

  let summary: SitemapSummary
  try {
    summary = await $fetch<SitemapSummary>('/public/sitemap/summary', { baseURL: useRuntimeConfig(event).public.apiBaseUrl })
  }
  catch {
    sitemapUnavailable(event)
  }

  const files = ['paginas.xml']
  for (const [name, { type }] of Object.entries(SITEMAP_TYPES)) {
    const pages = Math.ceil((summary.types[type]?.count ?? 0) / summary.per_page)
    for (let n = 1; n <= pages; n++)
      files.push(`${name}-${n}.xml`)
  }

  const body = files.map(f => `  <sitemap><loc>${xmlEscape(`${origin}/sitemaps/${f}`)}</loc></sitemap>`).join('\n')
  return sendXml(event, `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>`)
})
