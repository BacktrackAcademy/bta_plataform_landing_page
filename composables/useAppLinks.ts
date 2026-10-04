/**
 * Links hacia la app autenticada (app.backtrackacademy.com). El sitio público NO conoce la sesión:
 * todos los CTA van a la app y ella decide (autenticado → continúa; si no → login/registro → continúa).
 * `redirect` conserva la intención (ej. un curso) y solo viaja si pasa `safeAppRedirect`.
 */
export function useAppLinks() {
  const platformUrl = usePlatformUrl()

  function withRedirect(path: string, redirect?: string | null) {
    const safe = safeAppRedirect(redirect)
    return platformUrl(safe ? `${path}?redirect=${encodeURIComponent(safe)}` : path)
  }

  return {
    appUrl: platformUrl,
    loginUrl: (redirect?: string | null) => withRedirect('/login', redirect),
    signupUrl: (redirect?: string | null) => withRedirect('/crear-cuenta', redirect),
  }
}
