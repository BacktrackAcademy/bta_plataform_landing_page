/** Origen canónico del sitio público (canonical, og:url, JSON-LD, sitemap). Sin `www`, sin barra final. */
export function useSiteUrl() {
  const base = String(useRuntimeConfig().public.siteUrl || 'https://backtrackacademy.com').replace(/\/$/, '')
  return (path = '') => `${base}${path}`
}
