import type { LocationQueryValue } from 'vue-router'
import type { Paginated, PublicCourseCard, PublicFilters } from '~/interfaces/public'

const PER_PAGE = 12
/** Mínimo de cursos para que una página de tema/especialidad se indexe (menos = contenido pobre). */
const MIN_INDEXABLE = 2

const one = (v: LocationQueryValue | LocationQueryValue[] | undefined) => (Array.isArray(v) ? v[0] : v) || ''

export type CourseFacet = { type: 'tema' | 'especialidad' | 'nivel', slug: string }

/**
 * Datos + SEO compartidos por /cursos, /cursos/tema/:slug y /cursos/especialidad/:slug.
 * Tema, especialidad y nivel son RUTAS (indexables, en el sitemap). Búsqueda y "solo gratuitos" siguen en la
 * query (?q=&gratis=1) y no se indexan. Facet inexistente o ?pagina= fuera de rango → 404 real.
 */
export function useCoursesListing(facet?: CourseFacet) {
  const route = useRoute()
  const router = useRouter()
  const abs = useSiteUrl()

  const basePath = facet ? `/cursos/${facet.type}/${facet.slug}` : '/cursos'
  const state = computed(() => ({
    q: one(route.query.q).slice(0, 100),
    gratis: one(route.query.gratis) === '1',
    pagina: Math.max(1, Number.parseInt(one(route.query.pagina)) || 1),
  }))
  const hasFilters = computed(() => !!(state.value.q || state.value.gratis))

  // Sin `await` aquí (se perdería el contexto de Nuxt para useSeo): la página hace `await listing.ready`.
  const filtersReq = usePublicApi<PublicFilters>('/filters')
  const coursesReq = usePublicApi<Paginated<PublicCourseCard>>('/courses', {
    query: computed(() => ({
      per_page: PER_PAGE,
      page: state.value.pagina,
      q: state.value.q || undefined,
      level: facet?.type === 'nivel' ? facet.slug : undefined,
      free: state.value.gratis ? 'true' : undefined,
      specialty: facet?.type === 'especialidad' ? facet.slug : undefined,
      category: facet?.type === 'tema' ? facet.slug : undefined,
    })),
  })

  const filters = computed(() => filtersReq.data.value)
  const specialties = computed(() => (filters.value?.specialties ?? []).filter(s => s.courses_count > 0))
  const topics = computed(() => (filters.value?.categories ?? []).filter(s => s.courses_count > 0))
  const levels = computed(() => filters.value?.levels ?? [])
  const facetName = computed(() => {
    if (!facet)
      return ''
    const list = facet.type === 'tema' ? filters.value?.categories : facet.type === 'nivel' ? filters.value?.levels : filters.value?.specialties
    return list?.find(i => i.slug === facet.slug)?.name.trim() ?? ''
  })

  const courses = computed(() => coursesReq.data.value?.data ?? [])
  const pagination = computed(() => coursesReq.data.value?.pagination)

  const heading = computed(() => {
    if (!facet)
      return 'Aprende ciberseguridad haciendo'
    if (facet.type === 'nivel')
      return `Cursos de nivel ${facetName.value}`
    return facet.type === 'tema' ? `Cursos de ${facetName.value}` : `Cursos de la especialidad ${facetName.value}`
  })
  const intro = computed(() => {
    if (!facet)
      return 'Cursos prácticos creados por profesionales de la industria. Explora por especialidad o por tema.'
    if (facet.type === 'nivel')
      return `Cursos de ciberseguridad de nivel ${facetName.value.toLowerCase()}, creados por profesionales de la industria. Elige según tu experiencia.`
    return facet.type === 'tema'
      ? `Cursos prácticos de ${facetName.value} creados por profesionales de la industria, con teoría, práctica y certificado.`
      : `Todos los cursos de la especialidad ${facetName.value}, creados por profesionales de la industria.`
  })

  const pageTo = (p: number) => ({ path: basePath, query: { ...route.query, pagina: p > 1 ? String(p) : undefined } })

  function go(patch: Record<string, string | undefined>) {
    const query: Record<string, string | undefined> = { ...route.query as Record<string, string>, ...patch }
    if (!('pagina' in patch))
      delete query.pagina
    for (const k of Object.keys(query)) {
      if (!query[k])
        delete query[k]
    }
    return router.push({ path: basePath, query })
  }

  useSeo(() => ({
    title: facet
      ? (facet.type === 'tema'
          ? `Cursos de ${facetName.value}: hacking ético y ciberseguridad`
          : facet.type === 'nivel' ? `Cursos de ciberseguridad nivel ${facetName.value}` : `Cursos de ${facetName.value}`)
      : 'Cursos de ciberseguridad y hacking ético',
    description: facet
      ? `${intro.value} Empieza hoy en Backtrack Academy.`
      : 'Catálogo de cursos de ciberseguridad, pentesting y hacking ético. Explora por especialidad o tema y empieza hoy.',
    // Filtros de la query = misma página para Google (canonical a la base). Paginación simple: canonical propio.
    path: hasFilters.value || state.value.pagina === 1 ? basePath : `${basePath}?pagina=${state.value.pagina}`,
    noindex: hasFilters.value || !courses.value.length || (!!facet && (pagination.value?.total_entries ?? 0) < MIN_INDEXABLE),
    jsonLd: [
      breadcrumbSchema(abs, [
        { name: 'Inicio', path: '/' },
        { name: 'Cursos', path: '/cursos' },
        ...(facet ? [{ name: facetName.value, path: basePath }] : []),
      ]),
      itemListSchema(abs, courses.value.map(c => ({ name: c.title, path: `/curso/${c.slug}` }))),
    ],
  }))

  const status = coursesReq.status
  const ready = Promise.all([filtersReq, coursesReq]).then(() => {
    const err = filtersReq.error.value || coursesReq.error.value
    if (err) {
      const notFound = (err as { statusCode?: number }).statusCode === 404
      throw createError({ statusCode: notFound ? 404 : 503, statusMessage: notFound ? 'No encontrado' : 'Servicio no disponible', fatal: true })
    }
    const outOfRange = pagination.value && pagination.value.total_pages > 0 && state.value.pagina > pagination.value.total_pages
    const unknownFacet = facet && !facetName.value
    if (import.meta.server && (outOfRange || unknownFacet))
      throw createError({ statusCode: 404, statusMessage: 'No encontrado', fatal: true })
  })

  return reactive({
    facet, basePath, state, hasFilters, specialties, topics, levels, facetName, courses, pagination,
    heading, intro, pageTo, go, status, ready,
  })
}
