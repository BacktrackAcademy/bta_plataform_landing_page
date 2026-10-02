/** Builds an absolute URL to a page of the platform app (login, courses, dashboard...). */
export function usePlatformUrl() {
  const base = useRuntimeConfig().public.platformUrl.replace(/\/$/, '')
  return (path: string) => `${base}${path}`
}
