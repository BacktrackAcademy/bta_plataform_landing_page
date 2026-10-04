// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-01-18',

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/eslint',
  ],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },

  runtimeConfig: {
    public: {
      // API de Rails. Termina en /api/v1: el contenido público vive en `${apiBaseUrl}/public/*` y el
      // resto del landing en `${apiBaseUrl}/landing/*`. Override: NUXT_PUBLIC_API_BASE_URL
      apiBaseUrl: '',
      // App autenticada (login, registro, estudiar, dashboard). Override: NUXT_PUBLIC_PLATFORM_URL
      platformUrl: 'http://localhost:4321',
      // Origen canónico del sitio público (canonical, og:url, JSON-LD, sitemap). Override: NUXT_PUBLIC_SITE_URL
      siteUrl: 'https://backtrackacademy.com',
      // Fuerza indexación fuera del dominio de producción (por defecto solo backtrackacademy.com se indexa). NUXT_PUBLIC_ALLOW_INDEXING
      allowIndexing: false,
    },
  },

  // El contenido sale de la API pública: se renderiza en el servidor (SEO) y se revalida en segundo plano,
  // así un artículo nuevo aparece sin redeploy y la API no recibe un request por visita.
  routeRules: {
    '/': { swr: 300 },
    '/cursos': { swr: 300 },
    '/curso/**': { swr: 300 },
    '/especialidades': { swr: 300 },
    '/especialidad/**': { swr: 300 },
    '/articulos': { swr: 300 },
    '/articulos/**': { swr: 300 },
    '/articulo/**': { swr: 300 },
    '/autor/**': { swr: 300 },
    '/precios': { swr: 300 },
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
})
