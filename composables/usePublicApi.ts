import type { UseFetchOptions } from '#app'

/**
 * Cliente de la API pública de Rails (`/api/v1/public/*`): solo lectura, sin login ni cookies.
 * Es la única fuente de contenido del sitio (cursos, especialidades, artículos, autores).
 */
export function usePublicApi<T>(path: string | (() => string), options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig()
  return useFetch<T>(() => `/public${typeof path === 'function' ? path() : path}`, {
    baseURL: config.public.apiBaseUrl,
    ...options,
  } as UseFetchOptions<T>)
}

/**
 * Igual que `usePublicApi` pero convierte el error en una página de error real:
 * 404 de la API → 404 HTTP (importante para SEO), cualquier otro fallo → 503 (no se indexa).
 */
export async function usePublicResource<T>(path: string | (() => string), options: UseFetchOptions<T> = {}) {
  const res = await usePublicApi<T>(path, options)
  if (res.error.value) {
    const notFound = res.error.value.statusCode === 404
    throw createError({
      statusCode: notFound ? 404 : 503,
      statusMessage: notFound ? 'No encontrado' : 'Servicio no disponible',
      fatal: true,
    })
  }
  return res
}
