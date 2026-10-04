<script setup lang="ts">
const abs = useSiteUrl()

useHead({
  htmlAttrs: {
    lang: 'es',
    class: 'dark',
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  ],
  meta: [{ name: 'theme-color', content: '#070916' }],
  titleTemplate: titleChunk =>
    titleChunk ? `${titleChunk} | Backtrack Academy` : 'Backtrack Academy | Formación avanzada en ciberseguridad',
  script: [
    // Identidad de la marca para buscadores: una vez en todo el sitio.
    { type: 'application/ld+json', key: 'site-jsonld', innerHTML: jsonLdString([organizationSchema(abs), websiteSchema(abs)]) },
  ],
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
