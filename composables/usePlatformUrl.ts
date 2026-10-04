/** Builds an absolute URL to a page of the platform app (app.backtrackacademy.com). */
export function usePlatformUrl() {
  const base = useRuntimeConfig().public.platformUrl.replace(/\/$/, '')
  return (path: string) => `${base}${path}`
}
