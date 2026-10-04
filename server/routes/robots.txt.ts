export default defineEventHandler((event) => {
  const { origin, canIndex } = siteInfo(event)
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  // Los filtros y paginaciones se controlan con meta robots/canonical (si se bloquearan aquí, Google no vería el noindex).
  return canIndex
    ? `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n'
})
