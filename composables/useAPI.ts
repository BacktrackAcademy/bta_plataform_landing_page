import type { UseFetchOptions } from '#app'

export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const config = useRuntimeConfig()
  return useFetch(url, {
    baseURL: config.public.apiBaseUrl,
    ...options,
  })
}
