/**
 * Valida el destino que viaja en `?redirect=` hacia la app (login / crear-cuenta).
 * Lista blanca de prefijos + solo paths relativos al origen: nada de open redirects.
 * La app VUELVE a validar con la misma regla antes de redirigir (la landing no es la barrera de seguridad).
 */
export const APP_REDIRECT_PREFIXES = [
  '/especialidades',
  '/especialidad',
  '/cursos',
  '/curso',
  '/suscripciones',
  '/dashboard',
] as const

export function safeAppRedirect(path?: string | null): string | null {
  if (!path || typeof path !== 'string' || path.length > 300)
    return null
  // Debe ser un path absoluto del mismo origen: "/x", jamás "//host", "/\host", "https:", "javascript:".
  if (path[0] !== '/' || path[1] === '/' || path[1] === '\\')
    return null
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001F\u007F\\]/.test(path))
    return null
  const [pathname] = path.split(/[?#]/)
  if (pathname.split('/').some(seg => seg === '..' || seg === '.'))
    return null
  const allowed = APP_REDIRECT_PREFIXES.some(p => pathname === p || pathname.startsWith(`${p}/`))
  return allowed ? path : null
}
