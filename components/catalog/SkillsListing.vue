<script setup lang="ts">
import type { useSkillsListing } from '~/composables/useSkillsListing'

// Biblioteca de skills: categoría / autor = URLs propias; búsqueda, tipo, herramienta, nivel y orden = query (noindex).
const props = defineProps<{ l: ReturnType<typeof useSkillsListing> }>()
const { loginUrl } = useAppLinks()

const search = ref(props.l.f.q)
let timer: ReturnType<typeof setTimeout> | undefined
watch(search, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => v.trim() !== props.l.f.q && props.l.setFilters({ q: v.trim() }), 400)
})
watch(() => props.l.f.q, v => (search.value = v))
onBeforeUnmount(() => clearTimeout(timer))

const field = 'h-10 rounded-md border border-gray-border bg-bta-section px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink'
const link = 'flex items-center justify-between gap-3 rounded px-2.5 py-1.5 text-[13px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink'
const on = 'bg-bta-pink/15 text-white'
const off = 'text-white/60 hover:bg-white/5 hover:text-white'
const isHome = computed(() => !props.l.facet)
const crumbs = computed(() => [
  { name: 'Inicio', to: '/' },
  ...(props.l.facet ? [{ name: 'Skills', to: '/skills' }, { name: props.l.facetName }] : [{ name: 'Skills' }]),
])
const stats = computed(() => props.l.filters?.stats)
const statItems = computed(() => stats.value
  ? [
      { label: 'Skills publicadas', value: stats.value.skills },
      { label: 'Creadores', value: stats.value.creators },
      { label: 'Descargas', value: stats.value.downloads },
      { label: 'Categorías', value: stats.value.categories },
    ]
  : [])
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue font-inconsolata text-white">
    <CyberBackground variant="http" intensity="faint" glow="right" />
    <div class="container pb-[clamp(72px,9vw,128px)] pt-10">
      <CatalogBreadcrumbs :items="crumbs" />
      <header class="mt-10 max-w-[1120px]">
        <p class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink">
          Backtrack Skills
        </p>
        <h1 class="mt-4 text-balance font-oswald text-[clamp(38px,5.4vw,76px)] font-semibold uppercase leading-[1.14] sm:leading-[1.12]">
          {{ l.heading }}
        </h1>
        <p class="mt-6 max-w-[640px] text-pretty font-plex text-lg leading-relaxed text-white/75">
          {{ l.intro }}
        </p>
        <div v-if="isHome" class="mt-8 flex flex-wrap gap-3">
          <a href="#biblioteca" class="inline-flex h-12 items-center justify-center rounded-md bg-[#D60E6A] px-6 font-medium text-white transition-colors hover:bg-[#B80C5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink">Explorar skills</a>
          <a :href="loginUrl('/skills/nueva')" rel="nofollow" class="inline-flex h-12 items-center justify-center rounded-md border border-gray-border px-6 font-medium text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink">Publicar una skill</a>
        </div>
        <!-- Cifras reales de la API; si no hay datos no se pinta nada. -->
        <dl v-if="isHome && statItems.length" class="mt-10 grid max-w-[640px] grid-cols-2 gap-4 sm:grid-cols-4">
          <div v-for="s in statItems" :key="s.label" class="border-l border-bta-pink/60 pl-3">
            <dt class="text-[12px] uppercase tracking-wide text-white/50">
              {{ s.label }}
            </dt>
            <dd class="font-oswald text-3xl">
              {{ compactNumber(s.value) }}
            </dd>
          </div>
        </dl>
      </header>

      <div id="biblioteca" class="mt-12 grid scroll-mt-28 gap-x-10 gap-y-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside aria-label="Categorías de skills" class="lg:sticky lg:top-28 lg:self-start">
          <NuxtLink to="/skills" :class="[link, isHome ? on : off]" :aria-current="isHome ? 'page' : undefined">
            <span class="font-medium">Todas las skills</span>
          </NuxtLink>
          <div class="mt-4 border-t border-white/10 pt-4">
            <p class="font-oswald text-sm uppercase tracking-wide">
              <span class="text-bta-pink" aria-hidden="true">./</span>Categorías
            </p>
            <ul class="mt-3 flex flex-col gap-0.5">
              <li v-for="c in l.filters?.categories" :key="c.slug">
                <NuxtLink :to="`/skills/categoria/${c.slug}`" :class="[link, l.facet?.type === 'categoria' && l.facet.slug === c.slug ? on : off]" :aria-current="l.facet?.type === 'categoria' && l.facet.slug === c.slug ? 'page' : undefined">
                  <span>{{ c.name }}</span><span class="text-white/35">{{ c.count }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </aside>

        <div class="min-w-0">
          <form class="flex flex-wrap items-center gap-3" role="search" aria-label="Buscar skills" @submit.prevent="l.setFilters({ q: search.trim() })">
            <label class="sr-only" for="s-q">Buscar skill</label>
            <input id="s-q" v-model="search" type="search" placeholder="Buscar por nombre, contenido, etiqueta o autor…" class="min-w-[220px] flex-1" :class="field">
            <label class="sr-only" for="s-tipo">Tipo de recurso</label>
            <select id="s-tipo" :value="l.f.tipo" :class="field" @change="l.setFilters({ tipo: ($event.target as HTMLSelectElement).value })">
              <option value="">
                Todos los tipos
              </option>
              <option v-for="t in l.filters?.resource_types" :key="t" :value="t">
                {{ RESOURCE_TYPE_LABELS[t] }}
              </option>
            </select>
            <label class="sr-only" for="s-tool">Compatibilidad</label>
            <select id="s-tool" :value="l.f.herramienta" :class="field" @change="l.setFilters({ herramienta: ($event.target as HTMLSelectElement).value })">
              <option value="">
                Cualquier herramienta
              </option>
              <option v-for="t in l.filters?.tools" :key="t" :value="t">
                {{ TOOL_LABELS[t] }}
              </option>
            </select>
            <label class="sr-only" for="s-nivel">Nivel técnico</label>
            <select id="s-nivel" :value="l.f.nivel" :class="field" @change="l.setFilters({ nivel: ($event.target as HTMLSelectElement).value })">
              <option value="">
                Todos los niveles
              </option>
              <option v-for="d in l.filters?.difficulties" :key="d" :value="d">
                {{ DIFFICULTY_LABELS[d] }}
              </option>
            </select>
            <label class="sr-only" for="s-orden">Ordenar por</label>
            <select id="s-orden" :value="l.f.orden || 'recent'" :class="field" @change="l.setFilters({ orden: ($event.target as HTMLSelectElement).value === 'recent' ? '' : ($event.target as HTMLSelectElement).value })">
              <option v-for="s in l.filters?.sorts" :key="s" :value="s">
                {{ SORT_LABELS[s] }}
              </option>
            </select>
          </form>

          <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/60" aria-live="polite">
            <p>
              <span class="text-white">{{ l.pagination?.total_entries ?? 0 }}</span> {{ l.pagination?.total_entries === 1 ? 'skill' : 'skills' }}
            </p>
            <button v-if="l.hasFilters" type="button" class="text-bta-pink hover:underline" @click="l.setFilters({ q: '', tipo: '', herramienta: '', nivel: '', orden: '' })">
              Limpiar filtros
            </button>
          </div>

          <template v-if="l.skills.length">
            <div class="mt-6 grid gap-x-6 gap-y-8 transition-opacity sm:grid-cols-2 xl:grid-cols-3" :class="l.status === 'pending' ? 'opacity-50' : ''">
              <CatalogSkillCard v-for="s in l.skills" :key="s.slug" :skill="s" />
            </div>
            <CatalogPagination v-if="l.pagination" :page="l.pagination.current_page" :total-pages="l.pagination.total_pages" :to="l.pageTo" />
          </template>
          <div v-else class="mt-10 rounded-lg border border-gray-border bg-bta-section p-10 text-center">
            <p class="font-oswald text-2xl">
              {{ l.hasFilters ? 'Ninguna skill coincide con tu búsqueda' : 'Aún no hay skills publicadas' }}
            </p>
            <p v-if="!l.hasFilters" class="mt-2 font-plex text-white/60">
              Sé la primera persona en compartir una con la comunidad.
            </p>
            <NuxtLink to="/skills" class="mt-4 inline-block text-bta-pink hover:underline">
              Ver todas las skills
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
