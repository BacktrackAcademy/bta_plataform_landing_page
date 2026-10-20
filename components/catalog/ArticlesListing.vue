<script setup lang="ts">
import type { useArticlesListing } from '~/composables/useArticlesListing'

// Listado de artículos con menú lateral (categoría / autor = URLs propias). Búsqueda = query encima del listado.
const props = defineProps<{ l: ReturnType<typeof useArticlesListing> }>()

const search = ref(props.l.q)
let timer: ReturnType<typeof setTimeout> | undefined
watch(search, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => v.trim() !== props.l.q && props.l.search(v.trim()), 400)
})
watch(() => props.l.q, v => (search.value = v))
onBeforeUnmount(() => clearTimeout(timer))

// En móvil los grupos del menú arrancan colapsados (los enlaces siguen en el HTML).
const groups = ref<HTMLElement | null>(null)
onMounted(() => {
  if (window.matchMedia('(max-width: 1023px)').matches)
    groups.value?.querySelectorAll('details').forEach(d => d.removeAttribute('open'))
})

const field = 'h-10 rounded-md border border-gray-border bg-bta-section px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink'
const link = 'flex items-center justify-between gap-3 rounded px-2.5 py-1.5 text-[13px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink'
const on = 'bg-bta-pink/15 text-white'
const off = 'text-white/60 hover:bg-white/5 hover:text-white'
const isActive = (type: 'categoria' | 'autor', slug: string) => props.l.facet?.type === type && props.l.facet.slug === slug

const crumbs = computed(() => [
  { name: 'Inicio', to: '/' },
  ...(props.l.facet ? [{ name: 'Artículos', to: '/articulos' }, { name: props.l.facetName }] : [{ name: 'Artículos' }]),
])
const featured = computed(() => (props.l.pagination?.current_page === 1 && !props.l.q ? props.l.articles[0] : undefined))
const topAuthors = computed(() => (!props.l.facet && !props.l.q && props.l.pagination?.current_page === 1 ? props.l.authors.slice(0, 5) : []))
const rest = computed(() => (featured.value ? props.l.articles.slice(1) : props.l.articles))
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue font-inconsolata text-white">
    <CyberBackground variant="http" intensity="faint" glow="right" />
    <div class="container pb-[clamp(72px,9vw,128px)] pt-10">
      <CatalogBreadcrumbs :items="crumbs" />
      <header class="mt-10 max-w-[760px]">
        <p class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink">
          Artículos
        </p>
        <h1 class="mt-4 text-balance font-oswald text-[clamp(38px,5.4vw,76px)] font-semibold uppercase leading-[.98]">
          {{ l.facet ? l.heading : 'Conocimiento técnico para profesionales' }}
        </h1>
        <p class="mt-6 max-w-[600px] text-pretty font-plex text-lg leading-relaxed text-white/75">
          {{ l.intro }}
        </p>
      </header>

      <div class="mt-12 grid gap-x-10 gap-y-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <!-- MENÚ LATERAL -->
        <aside aria-label="Explorar artículos" class="lg:sticky lg:top-28 lg:self-start">
          <div ref="groups" class="flex flex-col gap-5">
            <NuxtLink to="/articulos" :class="[link, !l.facet ? on : off]" :aria-current="!l.facet ? 'page' : undefined">
              <span class="font-medium">Todos los artículos</span>
            </NuxtLink>

            <details v-if="l.categories.length" open class="group border-t border-white/10 pt-4">
              <summary class="flex cursor-pointer list-none items-center justify-between font-oswald text-sm uppercase tracking-wide text-white">
                <span><span class="text-bta-pink" aria-hidden="true">./</span>Categorías</span>
                <span class="text-white/40 transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
              </summary>
              <ul class="mt-3 flex flex-col gap-0.5">
                <li v-for="c in l.categories" :key="c.slug">
                  <NuxtLink :to="`/articulos/categoria/${c.slug}`" :class="[link, isActive('categoria', c.slug) ? on : off]" :aria-current="isActive('categoria', c.slug) ? 'page' : undefined">
                    <span>{{ c.name }}</span><span class="text-white/35">{{ c.articles_count }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </details>

            <details v-if="l.authors.length" open class="group border-t border-white/10 pt-4">
              <summary class="flex cursor-pointer list-none items-center justify-between font-oswald text-sm uppercase tracking-wide text-white">
                <span><span class="text-bta-pink" aria-hidden="true">./</span>Autores</span>
                <span class="text-white/40 transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
              </summary>
              <ul class="mt-3 flex max-h-72 flex-col gap-0.5 overflow-y-auto pr-1">
                <li v-for="a in l.authors" :key="a.username">
                  <NuxtLink :to="`/articulos/autor/${encodeURIComponent(a.username)}`" :class="[link, isActive('autor', a.username) ? on : off]" :aria-current="isActive('autor', a.username) ? 'page' : undefined">
                    <span class="flex min-w-0 items-center gap-2">
                      <span class="grid size-5 shrink-0 place-items-center overflow-hidden rounded-full bg-white/10 text-[10px] text-white/60">
                        <img v-if="a.avatar_url" :src="a.avatar_url" alt="" width="20" height="20" loading="lazy" class="size-full object-cover">
                        <template v-else>{{ a.name.charAt(0) }}</template>
                      </span>
                      <span class="truncate">{{ a.name }}</span>
                    </span>
                    <span class="text-white/35">{{ a.articles_count }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </details>
          </div>
        </aside>

        <!-- LISTADO -->
        <div class="min-w-0">
          <form class="flex flex-wrap items-center gap-3" role="search" aria-label="Buscar artículos" @submit.prevent="l.search(search.trim())">
            <label class="sr-only" for="a-q">Buscar artículo</label>
            <input id="a-q" v-model="search" type="search" placeholder="Buscar artículo…" class="min-w-[200px] flex-1" :class="field">
          </form>

          <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/60" aria-live="polite">
            <p>
              <span class="text-white">{{ l.pagination?.total_entries ?? 0 }}</span> {{ l.pagination?.total_entries === 1 ? 'artículo' : 'artículos' }}
            </p>
            <button v-if="l.q" type="button" class="text-bta-pink hover:underline" @click="l.search('')">
              Limpiar búsqueda
            </button>
          </div>

          <section v-if="topAuthors.length" aria-label="Escritores destacados" class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-gray-border pb-6">
            <span class="text-[13px] text-white/45"><span class="text-bta-pink">$</span> escritores</span>
            <NuxtLink v-for="a in topAuthors" :key="a.username" :to="`/articulos/autor/${encodeURIComponent(a.username)}`" class="flex items-center gap-2 text-[13px] text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink">
              <span class="grid size-7 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-xs text-white/60">
                <img v-if="a.avatar_url" :src="a.avatar_url" alt="" width="28" height="28" loading="lazy" class="size-full object-cover">
                <template v-else>{{ a.name.charAt(0) }}</template>
              </span>
              {{ a.name }} <span class="text-white/35">{{ a.articles_count }}</span>
            </NuxtLink>
          </section>

          <template v-if="l.articles.length">
            <NuxtLink
              v-if="featured"
              :to="`/articulo/${featured.slug}`"
              class="group mt-6 grid items-center gap-x-8 gap-y-6 border-b border-gray-border pb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink xl:grid-cols-2"
            >
              <div class="gc relative aspect-[16/9] overflow-hidden rounded-lg border border-[#262a47] bg-[#0b0d1f]">
                <img v-if="featured.image_url || featured.image_thumb_url" :src="(featured.image_url || featured.image_thumb_url)!" :alt="featured.title" width="960" height="540" fetchpriority="high" decoding="async" class="gc-cover h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.02]">
                <div class="gc-covertint" />
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0d1f]/70 via-transparent to-transparent" />
              </div>
              <div>
                <p class="font-inconsolata text-xs uppercase tracking-wide text-bta-pink">
                  {{ featured.category?.name }}
                </p>
                <h2 class="mt-3 text-balance font-oswald text-[clamp(26px,2.8vw,38px)] font-medium leading-[1.05] transition-colors group-hover:text-bta-pink">
                  {{ featured.title }}
                </h2>
                <p v-if="featured.summary" class="mt-4 line-clamp-3 text-pretty font-plex leading-relaxed text-white/70">
                  {{ featured.summary }}
                </p>
                <p class="mt-5 text-[13px] text-white/50">
                  <span v-if="featured.author">{{ featured.author.name }} · </span><time :datetime="featured.published_at">{{ formatDate(featured.published_at) }}</time>
                </p>
              </div>
            </NuxtLink>
            <div class="mt-8 grid gap-x-6 gap-y-10 transition-opacity sm:grid-cols-2 xl:grid-cols-3" :class="l.status === 'pending' ? 'opacity-50' : ''">
              <CatalogArticleCard v-for="a in rest" :key="a.slug" :article="a" />
            </div>
            <CatalogPagination v-if="l.pagination" :page="l.pagination.current_page" :total-pages="l.pagination.total_pages" :to="l.pageTo" />
          </template>
          <div v-else class="mt-10 rounded-lg border border-gray-border bg-bta-section p-10 text-center">
            <p class="font-oswald text-2xl">
              No encontramos artículos
            </p>
            <NuxtLink to="/articulos" class="mt-4 inline-block text-bta-pink hover:underline">
              Ver todos los artículos
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
