// URL canónica única: sin `www.` y sin barra final (/cursos/ → /cursos), con 301. Evita contenido duplicado.
// Además, los despliegues que no son producción responden X-Robots-Tag: noindex (staging, previews).
export default defineEventHandler((event) => {
  const { origin, canIndex } = siteInfo(event)
  if (!canIndex)
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')

  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true })
  const site = new URL(origin)
  let host = url.host
  let path = url.pathname
  let redirect = false

  if (url.hostname === `www.${site.hostname}`) {
    host = site.host
    redirect = true
  }
  if (path.length > 1 && path.endsWith('/')) {
    path = path.replace(/\/+$/, '') || '/'
    redirect = true
  }
  if (redirect)
    return sendRedirect(event, `${site.protocol}//${host}${path}${url.search}`, 301)
})
