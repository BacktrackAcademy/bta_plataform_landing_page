<script setup lang="ts">
import type { PublicArticle, PublicFilters } from '~/interfaces/public'
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
// El CTA de mitad de lectura se ubica con el HTML original; después se separan los puntos aparte en párrafos.
const parts = computed(() => splitArticleHtml(body.value.html).map(h => (h ? splitParagraphBreaks(h) : h)) as [string, string | null])

// Si el artículo no trae curso ni especialidad relacionados, su categoría lleva al tema de cursos equivalente
// (en vez de caer al catálogo completo). Las categorías sin equivalente directo se asocian a la más cercana.
const TOPIC_ALIAS: Record<string, string> = {
  'wireless-attacks': 'auditorias-wireless',
  'exploitation-tools': 'pentesting',
  'reverse-engineering': 'pentesting',
  'information-gathering': 'pentesting',
}
const needsFallback = !a.value.related_specialty && !a.value.related_course
const { data: filters } = needsFallback
  ? await usePublicApi<PublicFilters>('/filters')
  : { data: ref<PublicFilters | null>(null) }
const topic = computed(() => {
  const slug = a.value.category?.slug
  if (!slug)
    return null
  const target = TOPIC_ALIAS[slug] ?? slug
  return filters.value?.categories.find(c => c.slug === target && c.courses_count >= 2) ?? null
})

// Del artículo a la adquisición: especialidad relacionada (preferida) → curso → tema de la categoría → catálogo.
const cta = computed(() => {
  if (a.value.related_specialty)
    return { label: 'Explorar especialidad', to: `/especialidad/${a.value.related_specialty.slug}`, name: a.value.related_specialty.name }
  if (a.value.related_course)
    return { label: 'Ver curso', to: `/curso/${a.value.related_course.slug}`, name: a.value.related_course.title }
  if (topic.value)
    return { label: 'Ver cursos del tema', to: `/cursos/tema/${topic.value.slug}`, name: topic.value.name }
  return { label: 'Explorar cursos', to: '/cursos', name: null }
})
const ctaSignup = computed(() => signupUrl(/^\/(especialidad|curso)\//.test(cta.value.to) ? cta.value.to : undefined))

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

// Índice: carril lateral en desktop y botón con panel en tablet/mobile; solo aparece mientras se lee el cuerpo.
const bodyEl = ref<HTMLElement | null>(null)
const activeId = ref('')
const inBody = ref(false)
const progress = ref(0)
const sheetOpen = ref(false)
function onScroll() {
  const doc = document.documentElement
  progress.value = Math.min(100, Math.max(0, (window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight)) * 100))
  let current = ''
  for (const t of body.value.toc) {
    const el = document.getElementById(t.id)
    if (el && el.getBoundingClientRect().top < 160)
      current = t.id
  }
  activeId.value = current
  const r = bodyEl.value?.getBoundingClientRect()
  inBody.value = !!r && r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.4
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const btnPrimary = 'inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#D60E6A] px-6 font-medium text-white transition-colors duration-200 hover:bg-[#B80C5B] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink focus-visible:ring-offset-2 focus-visible:ring-offset-bta-dark-blue'
</script>

<template>
  <div class="ar relative isolate bg-bta-dark-blue font-inconsolata text-white">
    <div class="ar-progress" :style="{ width: `${progress}%` }" aria-hidden="true" />
    <CyberBackground variant="scan" intensity="faint" glow="right" />
    <article>
      <!-- Hero con la misma línea que el detalle de curso: fondo cyber, portada atenuada, eyebrow, título en mayúsculas e información -->
      <section class="relative overflow-hidden border-b border-white/5">
        <img v-if="a.image_url" :src="a.image_url" alt="" width="1280" height="720" fetchpriority="high" decoding="async" class="absolute inset-0 h-full w-full object-cover opacity-20">
        <div class="absolute inset-0 bg-gradient-to-b from-bta-dark-blue/40 to-bta-dark-blue" />
        <div class="container relative pb-[clamp(48px,6vw,88px)] pt-10">
          <CatalogBreadcrumbs
            :items="[
              { name: 'Inicio', to: '/' },
              { name: 'Artículos', to: '/articulos' },
              ...(a.category ? [{ name: a.category.name, to: `/articulos/categoria/${a.category.slug}` }] : []),
              { name: a.title },
            ]"
          />
          <header class="mt-12 max-w-[980px]">
            <p class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink">
              Artículo<template v-if="a.category">
                · {{ a.category.name }}
              </template>
            </p>
            <h1 class="ar-title mt-4 text-balance font-oswald text-[clamp(34px,5vw,64px)] font-semibold uppercase">
              {{ a.title }}
            </h1>
            <div class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-white/60">
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
        </div>
      </section>

      <!-- Cuerpo: el campo Descripción no se muestra; el contenido empieza directo después de la información. -->
      <div ref="bodyEl" class="ar-col ar-body">
        <!-- Portada visible dentro del artículo (en el hero va atenuada de fondo) -->
        <figure v-if="a.image_url" class="mb-10 overflow-hidden rounded-lg border border-white/10">
          <img :src="a.image_url" :alt="a.title" width="1280" height="720" decoding="async" class="h-auto w-full object-cover">
        </figure>
        <CatalogRichText v-if="parts[0]" :html="parts[0]" class="prose-lg prose-headings:scroll-mt-28 prose-img:rounded-lg prose-pre:overflow-x-auto" />

        <!-- CTA a mitad de lectura: discreto, solo en artículos largos -->
        <aside v-if="parts[1]" class="my-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-lg border border-gray-border bg-bta-section p-6">
          <div class="min-w-0">
            <p class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink">
              Sigue aprendiendo
            </p>
            <p class="font-plex mt-1.5 text-pretty text-white/85">
              <template v-if="cta.name">
                Profundiza en este tema con <span class="font-medium text-white">{{ cta.name }}</span>.
              </template>
              <template v-else>
                Explora los cursos de Backtrack Academy.
              </template>
            </p>
          </div>
          <NuxtLink :to="cta.to" class="inline-flex h-11 shrink-0 items-center gap-2 rounded-md border border-bta-pink px-5 font-medium text-white transition-colors hover:bg-bta-pink/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink">
            {{ cta.label }} <ArrowRight :size="16" />
          </NuxtLink>
        </aside>

        <CatalogRichText v-if="parts[1]" :html="parts[1]" class="prose-lg prose-headings:scroll-mt-28 prose-img:rounded-lg prose-pre:overflow-x-auto" />
      </div>

      <div class="ar-col mt-16">
        <!-- CTA hacia la academia -->
        <section class="rounded-lg border border-gray-border bg-bta-section p-[clamp(24px,4vw,40px)]">
          <h2 class="text-balance font-oswald text-2xl font-medium leading-tight sm:text-3xl">
            ¿Quieres aprender estas técnicas en profundidad?
          </h2>
          <p v-if="cta.name" class="mt-3 text-white/65">
            Continúa tu ruta con <span class="text-white">{{ cta.name }}</span>.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink :to="cta.to" :class="btnPrimary">
              {{ cta.label }} <ArrowRight :size="18" />
            </NuxtLink>
            <a :href="ctaSignup" class="inline-flex h-12 items-center rounded-md border border-gray-border px-6 font-medium transition-colors hover:bg-white/5">
              Crear cuenta
            </a>
          </div>
        </section>

        <!-- AUTOR -->
        <section v-if="a.author" class="mt-12 flex gap-5 border-t border-gray-border pt-10 max-sm:flex-col max-sm:gap-3.5">
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
    </article>

    <!-- ÍNDICE: carril lateral (≥1280 px) -->
    <nav v-if="showToc" class="ar-rail" :class="{ off: !inBody }" aria-label="Índice del artículo">
      <div class="ar-panel">
        <p class="ar-panel-h">
          En este artículo
        </p>
        <ol class="ar-toc">
          <li v-for="(t, i) in body.toc" :key="t.id">
            <a :href="`#${t.id}`" :class="{ on: activeId === t.id }" :aria-current="activeId === t.id ? 'location' : undefined" @click="($event.currentTarget as HTMLElement).blur()">
              <span class="n">{{ String(i + 1).padStart(2, '0') }}</span><span>{{ t.text }}</span>
            </a>
          </li>
        </ol>
      </div>
      <div class="ar-ticks" aria-hidden="true">
        <span v-for="t in body.toc" :key="t.id" :class="{ on: activeId === t.id }" />
      </div>
    </nav>
    <!-- ÍNDICE: botón y panel inferior (tablet y mobile) -->
    <template v-if="showToc">
      <button type="button" class="ar-fab" :class="{ off: !inBody || sheetOpen }" aria-haspopup="dialog" :aria-expanded="sheetOpen" @click="sheetOpen = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>Índice
      </button>
      <template v-if="sheetOpen">
        <button type="button" class="ar-scrim" aria-label="Cerrar índice" @click="sheetOpen = false" />
        <div class="ar-sheet" role="dialog" aria-label="Índice del artículo">
          <div class="ar-sheet-h">
            <p class="ar-panel-h">
              En este artículo
            </p>
            <button type="button" class="ar-close" aria-label="Cerrar índice" @click="sheetOpen = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <ol class="ar-toc">
            <li v-for="(t, i) in body.toc" :key="t.id">
              <a :href="`#${t.id}`" :class="{ on: activeId === t.id }" @click="sheetOpen = false">
                <span class="n">{{ String(i + 1).padStart(2, '0') }}</span><span>{{ t.text }}</span>
              </a>
            </li>
          </ol>
        </div>
      </template>
    </template>

    <!-- RELACIONADOS -->
    <section v-if="a.related_course || a.related_articles.length" class="mt-[clamp(56px,7vw,96px)] border-t border-white/5">
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

<style scoped>
/* Columna editorial aprobada: 960 px para breadcrumb, título, información y cuerpo; la portada usa 1116 px. */
.ar-col { max-width: 1136px; margin-left: auto; margin-right: auto; padding-left: 32px; padding-right: 32px; box-sizing: content-box; }
.ar-wide { max-width: 1116px; margin-left: auto; margin-right: auto; padding-left: 32px; padding-right: 32px; box-sizing: content-box; }
/* Interlineado local del H1 para que las tildes no se monten. */
.ar-title { line-height: 1.05; hyphens: manual; overflow-wrap: normal; }
.ar-body { margin-top: 48px; overflow-wrap: break-word; }
.ar-body :deep(.prose > :first-child) { margin-top: 0; }
.ar-body :deep(a) { overflow-wrap: anywhere; }
/* Bloques de código con la presentación aprobada; desplazamiento horizontal interno en pantallas angostas. */
.ar-body :deep(pre) { margin: 1.75em 0; padding: 1em 1.5em; border: 1px solid #262a47; border-radius: 8px; background: #0b0d1f; color: #dbe2ff; font-size: .8888889em; line-height: 1.75; overflow-x: auto; white-space: pre; }
.ar-body :deep(pre code) { background: none; border: 0; padding: 0; color: inherit; font-size: inherit; }
/* PNG con transparencia: la plantilla no agrega fondo, borde ni relleno. */
.ar-body :deep(img) { max-width: 100%; height: auto; object-fit: contain; background: transparent; border: 0; box-shadow: none; }
.ar-body :deep(table) { display: block; overflow-x: auto; }
.ar-progress { position: fixed; left: 0; top: 0; height: 3px; background: #ec1075; z-index: 80; transition: width .12s linear; }
/* Índice */
.ar-rail { position: fixed; right: 22px; top: 50%; transform: translateY(-50%); z-index: 40; display: flex; flex-direction: column; align-items: flex-end; transition: opacity .25s; }
.ar-rail.off, .ar-fab.off { opacity: 0; pointer-events: none; }
.ar-ticks { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; padding: 14px 4px; }
.ar-ticks span { display: block; width: 16px; height: 2px; border-radius: 2px; background: rgba(255, 255, 255, .28); transition: width .2s, background .2s; }
.ar-ticks span.on { width: 26px; background: #ec1075; }
.ar-panel { position: absolute; right: 30px; top: 50%; transform: translate(8px, -50%); width: 288px; padding: 16px 8px 12px; border: 1px solid #262a47; border-radius: 8px; background: rgba(18, 21, 43, .97); box-shadow: 0 18px 40px -20px rgba(0, 0, 0, .7); opacity: 0; pointer-events: none; transition: opacity .2s, transform .2s; }
.ar-rail:hover .ar-panel, .ar-rail:focus-within .ar-panel { opacity: 1; pointer-events: auto; transform: translate(0, -50%); }
.ar-panel-h { font-family: 'Oswald', sans-serif; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: rgba(255, 255, 255, .5); padding: 0 10px 8px; margin: 0; }
.ar-toc { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px; }
.ar-toc a { display: flex; gap: 10px; padding: 8px 10px; border-radius: 6px; font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; line-height: 1.35; color: rgba(255, 255, 255, .7); }
.ar-toc a:hover { background: rgba(255, 255, 255, .04); color: #fff; }
.ar-toc a.on { color: #fff; background: rgba(236, 16, 117, .1); }
.ar-toc .n { font-family: 'Inconsolata', monospace; font-size: 12px; color: rgba(255, 255, 255, .5); padding-top: 2px; }
.ar-toc a.on .n { color: #ec1075; }
.ar-fab { display: none; position: fixed; right: 16px; bottom: 20px; z-index: 60; align-items: center; gap: 8px; height: 44px; padding: 0 16px; border: 1px solid #262a47; border-radius: 999px; background: rgba(18, 21, 43, .96); box-shadow: 0 10px 30px -10px rgba(0, 0, 0, .8); font-family: 'Inconsolata', monospace; font-size: 14px; color: #fff; cursor: pointer; transition: opacity .25s; }
.ar-sheet { position: fixed; left: 0; right: 0; bottom: 0; z-index: 70; max-height: 70vh; overflow-y: auto; padding: 16px 12px 24px; border-top: 1px solid #262a47; border-radius: 14px 14px 0 0; background: #12152b; box-shadow: 0 -20px 40px -10px rgba(0, 0, 0, .8); }
.ar-sheet-h { display: flex; align-items: center; justify-content: space-between; padding: 4px 10px 12px; }
.ar-sheet-h .ar-panel-h { padding: 0; }
.ar-close { width: 40px; height: 40px; border: 1px solid #262a47; border-radius: 8px; background: transparent; color: #fff; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.ar-scrim { position: fixed; inset: 0; z-index: 65; background: rgba(7, 9, 22, .6); border: 0; padding: 0; cursor: pointer; }
@media (max-width: 1279px) { .ar-rail { display: none; } .ar-fab { display: inline-flex; } }
@media (min-width: 1280px) { .ar-sheet, .ar-scrim { display: none; } }
@media (max-width: 640px) {
  .ar-col, .ar-wide { padding-left: 16px; padding-right: 16px; }
  .ar-body { margin-top: 36px; }
  .ar-body :deep(pre) { padding: .9em 1.1em; }
}
@media (prefers-reduced-motion: reduce) { .ar-progress, .ar-panel, .ar-ticks span, .ar-rail, .ar-fab { transition: none; } }
</style>
