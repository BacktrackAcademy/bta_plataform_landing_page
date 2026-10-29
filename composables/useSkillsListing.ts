import type { LocationQueryValue } from 'vue-router'
import type { Paginated } from '~/interfaces/public'
import type { SkillCard, SkillFilters } from '~/interfaces/skills'

const PER_PAGE = 12
const one = (v: LocationQueryValue | LocationQueryValue[] | undefined) => (Array.isArray(v) ? v[0] : v) || ''

export interface SkillFacet { type: 'categoria' | 'autor', slug: string }

/** Parámetros de filtro que viven en la query (?q=, ?tipo=…): cambian el listado pero NO se indexan. */
const FILTER_KEYS = ['q', 'tipo', 'herramienta', 'nivel', 'orden'] as const

/**
 * Datos + SEO de /skills, /skills/categoria/:slug y /skills/autor/:username.
 * Categoría y autor son RUTAS indexables; búsqueda, tipo, herramienta, nivel y orden son query → noindex.
 * Facet inexistente o ?pagina= fuera de rango → 404 real.
 */
export function useSkillsListing(facet?: SkillFacet) {
  const route = useRoute()
  const router = useRouter()
  const abs = useSiteUrl()
  const basePath = facet ? `/skills/${facet.type}/${facet.slug}` : '/skills'
  const page = computed(() => Math.max(1, Number.parseInt(String(route.query.pagina ?? '1')) || 1))
  const f = computed(() => Object.fromEntries(FILTER_KEYS.map(k => [k, one(route.query[k]).slice(0, 100)])) as Record<(typeof FILTER_KEYS)[number], string>)
  const hasFilters = computed(() => FILTER_KEYS.some(k => !!f.value[k]))

  // Sin `await` aquí (se perdería el contexto de Nuxt para useSeo): la página hace `await listing.ready`.
  const filtersReq = usePublicApi<SkillFilters>('/skills/filters')
  const skillsReq = usePublicApi<Paginated<SkillCard>>('/skills', {
    query: computed(() => ({
      per_page: PER_PAGE,
      page: page.value,
      q: f.value.q || undefined,
      type: f.value.tipo || undefined,
      tool: f.value.herramienta || undefined,
      difficulty: f.value.nivel || undefined,
      sort: f.value.orden || undefined,
      category: facet?.type === 'categoria' ? facet.slug : undefined,
      author: facet?.type === 'autor' ? facet.slug : undefined,
    })),
  })

  const filters = computed(() => filtersReq.data.value)
  const skills = computed(() => skillsReq.data.value?.data ?? [])
  const pagination = computed(() => skillsReq.data.value?.pagination)
  const category = computed(() => (facet?.type === 'categoria' ? filters.value?.categories.find(c => c.slug === facet.slug) : undefined))
  const authorName = computed(() => (facet?.type === 'autor' ? skills.value[0]?.author.display_name : undefined))
  const facetName = computed(() => category.value?.name ?? authorName.value ?? '')
  const heading = computed(() => {
    if (category.value)
      return `Skills de ${category.value.name}`
    return authorName.value ? `Skills de ${authorName.value}` : 'Skills creadas por hackers, para hackers.'
  })
  const intro = computed(() => {
    if (category.value)
      return category.value.description || `Prompts, skills de IA y automatizaciones de ${category.value.name} compartidas por la comunidad.`
    if (authorName.value)
      return `Skills, prompts y automatizaciones que ${authorName.value} ha compartido con la comunidad de Backtrack Academy.`
    return 'Explora herramientas, prompts y automatizaciones compartidas por la comunidad para potenciar tus conocimientos en ciberseguridad.'
  })

  const pageTo = (p: number) => ({ path: basePath, query: { ...route.query, pagina: p > 1 ? String(p) : undefined } })

  /** Aplica filtros de query y vuelve a la página 1. */
  function setFilters(patch: Partial<Record<(typeof FILTER_KEYS)[number], string>>) {
    const query: Record<string, string> = { ...route.query as Record<string, string> }
    delete query.pagina
    for (const [k, v] of Object.entries(patch)) {
      if (v)
        query[k] = v
      else delete query[k]
    }
    return router.push({ path: basePath, query })
  }

  useSeo(() => ({
    title: category.value
      ? `Skills y prompts de ${category.value.name} para IA`
      : authorName.value ? `Skills de ${authorName.value}` : 'Skills de ciberseguridad e IA: prompts y automatizaciones',
    description: category.value
      ? `Biblioteca de skills, prompts y automatizaciones de ${category.value.name} creadas por la comunidad. Descárgalas y úsalas con Claude, ChatGPT, Gemini o Cursor.`
      : authorName.value
        ? `Skills, prompts y automatizaciones de ciberseguridad publicadas por ${authorName.value} en Backtrack Skills.`
        : 'Biblioteca colaborativa de skills, prompts y automatizaciones de ciberseguridad para Claude, ChatGPT, Gemini, Cursor y Codex. Creadas por hackers, para hackers.',
    path: page.value === 1 ? basePath : `${basePath}?pagina=${page.value}`,
    noindex: hasFilters.value || !skills.value.length,
    jsonLd: [
      breadcrumbSchema(abs, [
        { name: 'Inicio', path: '/' },
        { name: 'Skills', path: '/skills' },
        ...(facetName.value ? [{ name: facetName.value, path: basePath }] : []),
      ]),
      itemListSchema(abs, skills.value.map(s => ({ name: s.title, path: `/skills/${s.slug}` }))),
    ],
  }))

  const status = skillsReq.status
  const ready = Promise.all([filtersReq, skillsReq]).then(() => {
    const err = filtersReq.error.value || skillsReq.error.value
    if (err)
      throw createError({ statusCode: err.statusCode === 404 ? 404 : 503, statusMessage: 'Servicio no disponible', fatal: true })
    const outOfRange = import.meta.server && pagination.value && pagination.value.total_pages > 0 && page.value > pagination.value.total_pages
    if ((facet?.type === 'categoria' && !category.value) || (facet?.type === 'autor' && !skills.value.length && !hasFilters.value) || outOfRange)
      throw createError({ statusCode: 404, statusMessage: 'No encontrado', fatal: true })
  })

  return reactive({ facet, f, hasFilters, skills, pagination, filters, category, facetName, heading, intro, pageTo, setFilters, status, ready })
}
