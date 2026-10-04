/**
 * ¿Este despliegue puede indexarse? Solo el dominio de producción (backtrackacademy.com) o un opt-in explícito
 * (NUXT_PUBLIC_ALLOW_INDEXING=true). Staging, previews y localhost nunca se indexan por accidente.
 */
export function indexingAllowed(siteUrl: string, flag?: boolean | string | null): boolean {
  if (flag === true || flag === 'true')
    return true
  try {
    return new URL(siteUrl).hostname === 'backtrackacademy.com'
  }
  catch {
    return false
  }
}
