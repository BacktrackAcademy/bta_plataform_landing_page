<script setup lang="ts">
import type { useCoursesListing } from '~/composables/useCoursesListing'

// Listado de cursos con menú lateral de enlaces (tema / especialidad = URLs propias, rastreables por Google).
// Búsqueda, nivel y "solo gratuitos" son filtros de query encima del listado.
const props = defineProps<{ l: ReturnType<typeof useCoursesListing> }>()

const search = ref(props.l.state.q)
let timer: ReturnType<typeof setTimeout> | undefined
watch(search, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => v !== props.l.state.q && props.l.go({ q: v.trim() || undefined }), 400)
})
watch(() => props.l.state.q, v => (search.value = v))
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
const isActive = (type: 'tema' | 'especialidad', slug: string) => props.l.facet?.type === type && props.l.facet.slug === slug
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue font-inconsolata text-white">
    <CyberBackground variant="scan" intensity="faint" glow="right" />
    <div class="container pb-[clamp(72px,9vw,128px)] pt-10">
      <CatalogBreadcrumbs
        :items="[
          { name: 'Inicio', to: '/' },
          ...(l.facet ? [{ name: 'Cursos', to: '/cursos' }, { name: l.facetName }] : [{ name: 'Cursos' }]),
        ]"
      />
      <header class="mt-10 max-w-[760px]">
        <p class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink">
          Cursos
        </p>
        <h1 class="mt-4 text-balance font-oswald text-[clamp(38px,5.4vw,76px)] font-semibold uppercase leading-[.98]">
          {{ l.heading }}
        </h1>
        <p class="mt-6 max-w-[600px] text-pretty font-plex text-lg leading-relaxed text-white/75">
          {{ l.intro }}
        </p>
      </header>

      <div class="mt-12 grid gap-x-10 gap-y-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <!-- MENÚ LATERAL -->
        <aside aria-label="Explorar cursos" class="lg:sticky lg:top-28 lg:self-start">
          <div ref="groups" class="flex flex-col gap-5">
            <NuxtLink to="/cursos" :class="[link, !l.facet ? on : off]" :aria-current="!l.facet ? 'page' : undefined">
              <span class="font-medium">Todos los cursos</span>
            </NuxtLink>

            <details v-if="l.specialties.length" open class="group border-t border-white/10 pt-4">
              <summary class="flex cursor-pointer list-none items-center justify-between font-oswald text-sm uppercase tracking-wide text-white">
                <span><span class="text-bta-pink" aria-hidden="true">./</span>Especialidades</span>
                <span class="text-white/40 transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
              </summary>
              <ul class="mt-3 flex flex-col gap-0.5">
                <li v-for="s in l.specialties" :key="s.slug">
                  <NuxtLink :to="`/cursos/especialidad/${s.slug}`" :class="[link, isActive('especialidad', s.slug) ? on : off]" :aria-current="isActive('especialidad', s.slug) ? 'page' : undefined">
                    <span>{{ s.name }}</span><span class="text-white/35">{{ s.courses_count }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </details>

            <details v-if="l.topics.length" open class="group border-t border-white/10 pt-4">
              <summary class="flex cursor-pointer list-none items-center justify-between font-oswald text-sm uppercase tracking-wide text-white">
                <span><span class="text-bta-pink" aria-hidden="true">./</span>Temas</span>
                <span class="text-white/40 transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
              </summary>
              <ul class="mt-3 flex flex-col gap-0.5">
                <li v-for="t in l.topics" :key="t.slug">
                  <NuxtLink :to="`/cursos/tema/${t.slug}`" :class="[link, isActive('tema', t.slug) ? on : off]" :aria-current="isActive('tema', t.slug) ? 'page' : undefined">
                    <span>{{ t.name }}</span><span class="text-white/35">{{ t.courses_count }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </details>
          </div>
        </aside>

        <!-- LISTADO -->
        <div class="min-w-0">
          <form class="flex flex-wrap items-center gap-3" role="search" aria-label="Filtrar cursos" @submit.prevent="l.go({ q: search.trim() || undefined })">
            <label class="sr-only" for="f-q">Buscar curso</label>
            <input id="f-q" v-model="search" type="search" placeholder="Buscar curso…" class="min-w-[200px] flex-1" :class="field">
            <label class="sr-only" for="f-niv">Nivel</label>
            <select id="f-niv" :class="field" :value="l.state.nivel" @change="l.go({ nivel: ($event.target as HTMLSelectElement).value })">
              <option value="">
                Todos los niveles
              </option>
              <option v-for="o in l.levels" :key="o.slug" :value="o.slug">
                {{ o.name }} ({{ o.courses_count }})
              </option>
            </select>
          </form>

          <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/60" aria-live="polite">
            <p>
              <span class="text-white">{{ l.pagination?.total_entries ?? 0 }}</span> {{ l.pagination?.total_entries === 1 ? 'curso' : 'cursos' }}
            </p>
            <div class="flex items-center gap-5">
              <label class="flex cursor-pointer items-center gap-2">
                <input type="checkbox" class="size-4 accent-[#EC1075]" :checked="l.state.gratis" @change="l.go({ gratis: ($event.target as HTMLInputElement).checked ? '1' : undefined })">
                Solo gratuitos
              </label>
              <button v-if="l.hasFilters" type="button" class="text-bta-pink hover:underline" @click="l.go({ q: undefined, nivel: undefined, gratis: undefined })">
                Limpiar filtros
              </button>
            </div>
          </div>

          <div v-if="l.courses.length" class="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-x-5 gap-y-6 transition-opacity" :class="l.status === 'pending' ? 'opacity-50' : ''">
            <CatalogCourseCard v-for="c in l.courses" :key="c.slug" :course="c" />
          </div>
          <div v-else class="mt-10 rounded-lg border border-gray-border bg-bta-section p-10 text-center">
            <p class="font-oswald text-2xl">
              No encontramos cursos con esos filtros
            </p>
            <NuxtLink to="/cursos" class="mt-4 inline-block text-bta-pink hover:underline">
              Ver todos los cursos
            </NuxtLink>
          </div>

          <CatalogPagination v-if="l.pagination" :page="l.pagination.current_page" :total-pages="l.pagination.total_pages" :to="l.pageTo" />
        </div>
      </div>
    </div>
  </div>
</template>
