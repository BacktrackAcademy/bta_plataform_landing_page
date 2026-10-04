<script setup lang="ts">
import type { PublicArticle } from '~/interfaces/public'
import { ArrowRight, Clock } from 'lucide-vue-next'

const route = useRoute()
const abs = useSiteUrl()
const { signupUrl } = useAppLinks()
const slug = String(route.params.slug)

const { data } = await usePublicResource<PublicArticle>(() => `/articles/${slug}`)
const a = computed(() => data.value!)

const path = `/articulo/${slug}`
const body = computed(() => prepareArticleHtml(a.value.body_html ?? ''))
const showToc = computed(() => body.value.toc.length >= 3)

// Del artículo a la adquisición: especialidad relacionada (preferida) → curso → catálogo.
const cta = computed(() => {
  if (a.value.related_specialty)
    return { label: 'Explorar especialidad', to: `/especialidad/${a.value.related_specialty.slug}`, name: a.value.related_specialty.name }
  if (a.value.related_course)
    return { label: 'Ver curso', to: `/curso/${a.value.related_course.slug}`, name: a.value.related_course.title }
  return { label: 'Explorar cursos', to: '/cursos', name: null }
})

useSeo(() => ({
  title: a.value.title,
  description: a.value.summary || `Artículo de ${a.value.author?.name ?? 'Backtrack Academy'} sobre ${a.value.category?.name ?? 'ciberseguridad'}.`,
  path,
  image: a.value.image_url,
  type: 'article',
  publishedTime: a.value.published_at,
  modifiedTime: a.value.updated_at,
  jsonLd: [
    breadcrumbSchema(abs, [
      { name: 'Inicio', path: '/' },
      { name: 'Artículos', path: '/articulos' },
      ...(a.value.category ? [{ name: a.value.category.name, path: `/articulos/categoria/${a.value.category.slug}` }] : []),
      { name: a.value.title, path },
    ]),
    articleSchema(abs, {
      path,
      headline: a.value.title,
      description: a.value.summary,
      image: a.value.image_url,
      published: a.value.published_at,
      modified: a.value.updated_at,
      author: a.value.author ? { name: a.value.author.name, path: `/autor/${a.value.author.username}` } : null,
      section: a.value.category?.name,
    }),
  ],
}))

const btnPrimary = 'inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#D60E6A] px-6 font-medium text-white transition-colors duration-200 hover:bg-[#B80C5B] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink focus-visible:ring-offset-2 focus-visible:ring-offset-bta-dark-blue'
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue font-inconsolata text-white">
    <CyberBackground variant="http" intensity="faint" glow="right" />
    <article class="container pb-[clamp(56px,7vw,96px)] pt-10">
      <CatalogBreadcrumbs
        :items="[
          { name: 'Inicio', to: '/' },
          { name: 'Artículos', to: '/articulos' },
          ...(a.category ? [{ name: a.category.name, to: `/articulos/categoria/${a.category.slug}` }] : []),
          { name: a.title },
        ]"
      />

      <!-- CABECERA -->
      <header class="mx-auto mt-10 max-w-[760px]">
        <NuxtLink v-if="a.category" :to="`/articulos/categoria/${a.category.slug}`" class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink hover:underline">
          {{ a.category.name }}
        </NuxtLink>
        <h1 class="mt-4 text-balance font-oswald text-[clamp(32px,4.6vw,60px)] font-semibold leading-[1.04]">
          {{ a.title }}
        </h1>
        <p v-if="a.summary" class="font-plex mt-5 text-pretty text-xl leading-relaxed text-white/75">
          {{ a.summary }}
        </p>
        <div class="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-white/60">
          <NuxtLink v-if="a.author" :to="`/autor/${a.author.username}`" class="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink">
            <span class="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-gray-border bg-bta-section text-xs text-white/50">
              <img v-if="a.author.avatar_url" :src="a.author.avatar_url" :alt="a.author.name" width="36" height="36" class="size-full object-cover">
              <template v-else>{{ initials(a.author.name) }}</template>
            </span>
            <span class="font-medium text-white group-hover:text-bta-pink">{{ a.author.name }}</span>
          </NuxtLink>
          <time :datetime="a.published_at">{{ formatDate(a.published_at) }}</time>
          <span v-if="a.reading_time_minutes" class="flex items-center gap-1.5"><Clock :size="14" /> {{ a.reading_time_minutes }} min de lectura</span>
        </div>
      </header>

      <figure v-if="a.image_url" class="mx-auto mt-10 max-w-[960px] overflow-hidden rounded-lg border border-white/5 bg-white/5">
        <img :src="a.image_url" :alt="a.title" width="960" height="540" fetchpriority="high" decoding="async" class="aspect-[16/9] w-full object-cover">
      </figure>

      <!-- CUERPO + TABLA DE CONTENIDOS -->
      <div class="mt-12 grid gap-x-12 gap-y-8 lg:grid-cols-[240px_minmax(0,720px)] lg:justify-center">
        <aside v-if="showToc" class="lg:order-first">
          <details class="rounded-lg border border-gray-border bg-bta-section lg:sticky lg:top-28 lg:border-0 lg:bg-transparent" open>
            <summary class="cursor-pointer list-none px-4 py-3 font-oswald text-sm uppercase tracking-[.08em] text-white/70 lg:cursor-default lg:px-0 lg:pt-0">
              En este artículo
            </summary>
            <ol class="space-y-2 px-4 pb-4 text-sm lg:px-0">
              <li v-for="t in body.toc" :key="t.id" :class="t.level === 3 ? 'pl-4' : ''">
                <a :href="`#${t.id}`" class="text-white/60 transition-colors hover:text-bta-pink">{{ t.text }}</a>
              </li>
            </ol>
          </details>
        </aside>
        <div class="min-w-0" :class="showToc ? '' : 'lg:col-start-2'">
          <CatalogRichText v-if="body.html" :html="body.html" class="prose-lg prose-headings:scroll-mt-28 prose-img:rounded-lg prose-pre:overflow-x-auto" />

          <!-- CTA hacia la academia -->
          <section class="mt-16 rounded-lg border border-gray-border bg-bta-section p-[clamp(24px,4vw,40px)]">
            <h2 class="text-balance font-oswald text-2xl font-medium leading-tight sm:text-3xl">
              ¿Quieres aprender estas técnicas en profundidad?
            </h2>
            <p v-if="cta.name" class="mt-3 text-white/65">
              Continúa con <span class="text-white">{{ cta.name }}</span> y practica con laboratorios guiados.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <NuxtLink :to="cta.to" :class="btnPrimary">
                {{ cta.label }} <ArrowRight :size="18" />
              </NuxtLink>
              <a :href="signupUrl(cta.to.startsWith('/especialidad') || cta.to.startsWith('/curso') ? cta.to : undefined)" class="inline-flex h-12 items-center rounded-md border border-gray-border px-6 font-medium transition-colors hover:bg-white/5">
                Crear cuenta
              </a>
            </div>
          </section>

          <!-- AUTOR -->
          <section v-if="a.author" class="mt-12 flex gap-5 border-t border-gray-border pt-10">
            <span class="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border border-gray-border bg-bta-section text-white/50">
              <img v-if="a.author.avatar_url" :src="a.author.avatar_url" :alt="a.author.name" width="64" height="64" loading="lazy" class="size-full object-cover">
              <template v-else>{{ initials(a.author.name) }}</template>
            </span>
            <div class="min-w-0">
              <p class="text-xs uppercase tracking-wide text-white/45">
                Escrito por
              </p>
              <NuxtLink :to="`/autor/${a.author.username}`" class="font-oswald text-2xl font-medium transition-colors hover:text-bta-pink">
                {{ a.author.name }}
              </NuxtLink>
              <p v-if="a.author.headline" class="mt-0.5 text-sm text-white/60">
                {{ a.author.headline }}
              </p>
              <p v-if="a.author.aboutme" class="font-plex mt-3 text-pretty text-[15px] leading-relaxed text-white/70">
                {{ a.author.aboutme }}
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>

    <!-- RELACIONADOS -->
    <section v-if="a.related_course || a.related_articles.length" class="border-t border-white/5">
      <div class="container py-[clamp(56px,7vw,96px)]">
        <div v-if="a.related_course" class="mb-16 grid items-center gap-x-10 gap-y-6 md:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <h2 class="font-oswald text-[clamp(26px,3vw,36px)] font-medium leading-tight">
              Curso relacionado
            </h2>
            <p class="mt-2 max-w-[460px] text-white/65">
              Lleva lo que leíste a la práctica con un curso guiado.
            </p>
          </div>
          <CatalogCourseCard :course="a.related_course" />
        </div>
        <template v-if="a.related_articles.length">
          <h2 class="font-oswald text-[clamp(26px,3vw,36px)] font-medium leading-tight">
            Sigue leyendo
          </h2>
          <div class="mt-8 grid gap-x-8 gap-y-10 md:grid-cols-3">
            <CatalogArticleCard v-for="r in a.related_articles" :key="r.slug" :article="r" />
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
