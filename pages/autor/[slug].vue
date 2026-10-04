<script setup lang="ts">
import type { PublicAuthor } from '~/interfaces/public'

const route = useRoute()
const abs = useSiteUrl()
const slug = String(route.params.slug)

const { data } = await usePublicResource<PublicAuthor>(() => `/authors/${slug}`)
const a = computed(() => data.value!)
const path = `/autor/${slug}`

const role = computed(() => {
  if (a.value.courses_count && a.value.articles_count)
    return 'Instructor y autor'
  return a.value.courses_count ? 'Instructor' : 'Autor'
})
const links = computed(() => Object.entries(a.value.links ?? {}).filter(([, url]) => !!url) as [string, string][])
const labels: Record<string, string> = { twitter: 'X / Twitter', linkedin: 'LinkedIn', facebook: 'Facebook' }

useSeo(() => ({
  title: `${a.value.name}: ${role.value.toLowerCase()} en Backtrack Academy`,
  description: a.value.aboutme || a.value.headline || `${a.value.name} es ${role.value.toLowerCase()} en Backtrack Academy. Conoce sus cursos y artículos de ciberseguridad.`,
  path,
  image: a.value.avatar_url,
  type: 'profile',
  jsonLd: [
    breadcrumbSchema(abs, [{ name: 'Inicio', path: '/' }, { name: a.value.name, path }]),
    profilePageSchema(abs, {
      path,
      name: a.value.name,
      headline: a.value.headline,
      description: a.value.aboutme,
      image: a.value.avatar_url,
      sameAs: links.value.map(([, url]) => url),
    }),
  ],
}))

const h2 = 'font-oswald text-[clamp(26px,3vw,36px)] font-medium leading-tight'
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue font-inconsolata text-white">
    <CyberBackground variant="topology" intensity="faint" glow="right" />
    <div class="container pb-[clamp(72px,9vw,128px)] pt-10">
      <CatalogBreadcrumbs :items="[{ name: 'Inicio', to: '/' }, { name: a.name }]" />

      <header class="mt-12 flex flex-col gap-x-10 gap-y-6 sm:flex-row sm:items-start">
        <span class="grid size-24 shrink-0 place-items-center overflow-hidden rounded-full border border-gray-border bg-bta-section font-oswald text-3xl text-white/50">
          <img v-if="a.avatar_url" :src="a.avatar_url" :alt="a.name" width="96" height="96" fetchpriority="high" decoding="async" class="size-full object-cover">
          <template v-else>{{ initials(a.name) }}</template>
        </span>
        <div class="max-w-[760px]">
          <p class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink">
            {{ role }}
          </p>
          <h1 class="mt-3 text-balance font-oswald text-[clamp(34px,5vw,64px)] font-semibold uppercase leading-[1]">
            {{ a.name }}
          </h1>
          <p v-if="a.headline" class="mt-3 text-lg text-white/70">
            {{ a.headline }}
          </p>
          <p v-if="a.aboutme" class="font-plex mt-5 max-w-[640px] text-pretty leading-relaxed text-white/75">
            {{ a.aboutme }}
          </p>
          <ul class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-inconsolata text-sm text-white/60">
            <li v-if="a.courses_count">
              <span class="text-white">{{ a.courses_count }}</span> {{ a.courses_count === 1 ? 'curso' : 'cursos' }}
            </li>
            <li v-if="a.articles_count">
              <span class="text-white">{{ a.articles_count }}</span> {{ a.articles_count === 1 ? 'artículo' : 'artículos' }}
            </li>
            <li v-for="[key, url] in links" :key="key">
              <a :href="url" target="_blank" rel="noopener nofollow me" class="text-bta-pink hover:underline">{{ labels[key] ?? key }}</a>
            </li>
          </ul>
        </div>
      </header>

      <section v-if="a.courses.length" id="cursos" class="mt-20">
        <h2 :class="h2">
          Cursos de {{ a.name }}
        </h2>
        <div class="mt-8 grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-x-5 gap-y-6">
          <CatalogCourseCard v-for="c in a.courses" :key="c.slug" :course="c" />
        </div>
      </section>

      <section v-if="a.articles.length" id="articulos" class="mt-20">
        <h2 :class="h2">
          Artículos de {{ a.name }}
        </h2>
        <div class="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <CatalogArticleCard v-for="r in a.articles" :key="r.slug" :article="r" />
        </div>
      </section>
    </div>
  </div>
</template>
