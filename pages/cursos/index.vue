<script setup lang="ts">
import type { LocationQueryValue } from 'vue-router'
import type { Paginated, PublicCourseCard, PublicFilters } from '~/interfaces/public'

const PER_PAGE = 12
const route = useRoute()
const router = useRouter()
const abs = useSiteUrl()

const one = (v: LocationQueryValue | LocationQueryValue[] | undefined) => (Array.isArray(v) ? v[0] : v) || ''

// El estado vive en la URL (?especialidad=&nivel=&tema=&instructor=&q=&gratis=1&pagina=): enlazable y renderizable en el servidor.
const state = computed(() => ({
  q: one(route.query.q).slice(0, 100),
  especialidad: one(route.query.especialidad),
  nivel: one(route.query.nivel),
  tema: one(route.query.tema),
  instructor: one(route.query.instructor),
  gratis: one(route.query.gratis) === '1',
  pagina: Math.max(1, Number.parseInt(one(route.query.pagina)) || 1),
}))
const hasFilters = computed(() => !!(state.value.q || state.value.especialidad || state.value.nivel || state.value.tema || state.value.instructor || state.value.gratis))

const apiQuery = computed(() => ({
  per_page: PER_PAGE,
  page: state.value.pagina,
  q: state.value.q || undefined,
  specialty: state.value.especialidad || undefined,
  level: state.value.nivel || undefined,
  category: state.value.tema || undefined,
  instructor: state.value.instructor || undefined,
  free: state.value.gratis ? 'true' : undefined,
}))

const { data: result, status } = await usePublicResource<Paginated<PublicCourseCard>>('/courses', { query: apiQuery })
const { data: filters } = usePublicApi<PublicFilters>('/filters')

const courses = computed(() => result.value?.data ?? [])
const pagination = computed(() => result.value?.pagination)

// ?pagina= fuera de rango: 404 real en el servidor (no una página vacía indexable).
if (import.meta.server && pagination.value && pagination.value.total_pages > 0 && state.value.pagina > pagination.value.total_pages)
  throw createError({ statusCode: 404, statusMessage: 'No encontrado', fatal: true })

function go(patch: Record<string, string | undefined>) {
  const query: Record<string, string | undefined> = { ...route.query as Record<string, string>, ...patch }
  if (!('pagina' in patch))
    delete query.pagina
  for (const k of Object.keys(query)) {
    if (!query[k])
      delete query[k]
  }
  return router.push({ path: '/cursos', query })
}
const pageTo = (p: number) => ({ path: '/cursos', query: { ...route.query, pagina: p > 1 ? String(p) : undefined } })

// Búsqueda con debounce: no se dispara una request por tecla.
const search = ref(state.value.q)
let timer: ReturnType<typeof setTimeout> | undefined
watch(search, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => v !== state.value.q && go({ q: v.trim() || undefined }), 400)
})
watch(() => state.value.q, v => (search.value = v))
onBeforeUnmount(() => clearTimeout(timer))

// Una combinación de filtros no es una página nueva para Google: noindex + canonical al catálogo.
// La paginación simple sí se indexa, con canonical propio.
useSeo(() => ({
  title: 'Cursos de ciberseguridad y hacking ético',
  description: 'Catálogo de cursos de ciberseguridad, pentesting y hacking ético. Filtra por especialidad, nivel, tema o instructor y empieza hoy.',
  path: hasFilters.value || state.value.pagina === 1 ? '/cursos' : `/cursos?pagina=${state.value.pagina}`,
  noindex: hasFilters.value || !courses.value.length,
  jsonLd: [
    breadcrumbSchema(abs, [{ name: 'Inicio', path: '/' }, { name: 'Cursos', path: '/cursos' }]),
    itemListSchema(abs, courses.value.map(c => ({ name: c.title, path: `/curso/${c.slug}` }))),
  ],
}))

const field = 'h-11 w-full rounded-md border border-gray-border bg-bta-section px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink'
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue font-inconsolata text-white">
    <CyberBackground variant="scan" intensity="faint" glow="right" />
    <div class="container pb-[clamp(72px,9vw,128px)] pt-10">
      <CatalogBreadcrumbs :items="[{ name: 'Inicio', to: '/' }, { name: 'Cursos' }]" />
      <header class="mt-10 max-w-[760px]">
        <p class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink">
          Cursos
        </p>
        <h1 class="mt-4 text-balance font-oswald text-[clamp(38px,5.4vw,76px)] font-semibold uppercase leading-[.98]">
          Aprende ciberseguridad haciendo
        </h1>
        <p class="mt-6 max-w-[600px] text-pretty text-lg leading-relaxed text-white/75">
          Cursos prácticos creados por profesionales de la industria. Filtra por especialidad, nivel, tema o instructor.
        </p>
      </header>

      <!-- FILTROS -->
      <form class="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-6" role="search" aria-label="Filtrar cursos" @submit.prevent="go({ q: search.trim() || undefined })">
        <label class="sr-only" for="f-q">Buscar curso</label>
        <input id="f-q" v-model="search" type="search" placeholder="Buscar curso…" class="sm:col-span-2 lg:col-span-2" :class="[field]">
        <template v-if="filters">
          <div>
            <label class="sr-only" for="f-esp">Especialidad</label>
            <select id="f-esp" :class="field" :value="state.especialidad" @change="go({ especialidad: ($event.target as HTMLSelectElement).value })">
              <option value="">
                Todas las especialidades
              </option>
              <option v-for="o in filters.specialties.filter(s => s.courses_count)" :key="o.slug" :value="o.slug">
                {{ o.name }} ({{ o.courses_count }})
              </option>
            </select>
          </div>
          <div>
            <label class="sr-only" for="f-niv">Nivel</label>
            <select id="f-niv" :class="field" :value="state.nivel" @change="go({ nivel: ($event.target as HTMLSelectElement).value })">
              <option value="">
                Todos los niveles
              </option>
              <option v-for="o in filters.levels" :key="o.slug" :value="o.slug">
                {{ o.name }} ({{ o.courses_count }})
              </option>
            </select>
          </div>
          <div>
            <label class="sr-only" for="f-tema">Tema</label>
            <select id="f-tema" :class="field" :value="state.tema" @change="go({ tema: ($event.target as HTMLSelectElement).value })">
              <option value="">
                Todos los temas
              </option>
              <option v-for="o in filters.categories" :key="o.slug" :value="o.slug">
                {{ o.name }} ({{ o.courses_count }})
              </option>
            </select>
          </div>
          <div>
            <label class="sr-only" for="f-inst">Instructor</label>
            <select id="f-inst" :class="field" :value="state.instructor" @change="go({ instructor: ($event.target as HTMLSelectElement).value })">
              <option value="">
                Todos los instructores
              </option>
              <option v-for="o in filters.instructors" :key="o.username" :value="o.username">
                {{ o.name }} ({{ o.courses_count }})
              </option>
            </select>
          </div>
        </template>
      </form>

      <div class="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-white/60" aria-live="polite">
        <p>
          <span class="text-white">{{ pagination?.total_entries ?? 0 }}</span> {{ pagination?.total_entries === 1 ? 'curso' : 'cursos' }}
        </p>
        <div class="flex items-center gap-5">
          <label class="flex cursor-pointer items-center gap-2">
            <input type="checkbox" class="size-4 accent-[#EC1075]" :checked="state.gratis" @change="go({ gratis: ($event.target as HTMLInputElement).checked ? '1' : undefined })">
            Solo gratuitos
          </label>
          <button v-if="hasFilters" type="button" class="text-bta-pink hover:underline" @click="router.push('/cursos')">
            Limpiar filtros
          </button>
        </div>
      </div>

      <!-- LISTADO -->
      <div v-if="courses.length" class="mt-8 grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-x-5 gap-y-6 transition-opacity" :class="status === 'pending' ? 'opacity-50' : ''">
        <CatalogCourseCard v-for="c in courses" :key="c.slug" :course="c" />
      </div>
      <div v-else class="mt-14 rounded-lg border border-gray-border bg-bta-section p-10 text-center">
        <p class="font-oswald text-2xl">
          No encontramos cursos con esos filtros
        </p>
        <button type="button" class="mt-4 text-bta-pink hover:underline" @click="router.push('/cursos')">
          Ver todos los cursos
        </button>
      </div>

      <CatalogPagination v-if="pagination" :page="pagination.current_page" :total-pages="pagination.total_pages" :to="pageTo" />
    </div>
  </div>
</template>
