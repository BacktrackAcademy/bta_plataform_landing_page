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

  runtimeConfig: {
    public: {
      // Public API used by the landing (/landing/* endpoints). Override with NUXT_PUBLIC_API_BASE_URL
      apiBaseUrl: '',
      // Base URL of the platform app (login, sign-up, courses, dashboard...). Override with NUXT_PUBLIC_PLATFORM_URL
      platformUrl: 'http://localhost:4321',
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
})
