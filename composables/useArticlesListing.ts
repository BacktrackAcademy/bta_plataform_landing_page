import type { LocationQueryValue } from 'vue-router'
import type { Paginated, PublicArticleCard, PublicFilters } from '~/interfaces/public'

const PER_PAGE = 9
const one = (v: LocationQueryValue | LocationQueryValue[] | undefined) => (Array.isArray(v) ? v[0] : v) || ''

export interface ArticleFacet { type: 'categoria' | 'autor', slug: string }

/**
 * Datos + SEO compartidos por /articulos, /articulos/categoria/:slug y /articulos/autor/:username.
 * Categoría y autor son RUTAS; la búsqueda (?q=) es query y no se indexa. Facet inexistente o `?pagina=` fuera de
 * rango → 404 real. Paginación simple indexable con canonical propio.
 */
export function useArticlesListing(facet?: ArticleFacet) {
  const route = useRoute()
  const abs = useSiteUrl()
  const page = computed(() => Math.max(1, Number.parseInt(String(route.query.pagina ?? '1')) || 1))
  const router = useRouter()
  const basePath = facet ? `/articulos/${facet.type}/${facet.slug}` : '/articulos'
  const q = computed(() => one(route.query.q).slice(0, 100))

  // Ambas requests salen en paralelo y NO se hace `await` aquí: tras un await, un composable pierde el contexto de
  // Nuxt (useSeo fallaría). El `await` lo hace la página con `await listing.ready`, donde sí se conserva.
  const filtersReq = usePublicApi<PublicFilters>('/filters')
  const articlesReq = usePublicApi<Paginated<PublicArticleCard>>('/articles', {
    query: computed(() => ({
      per_page: PER_PAGE,
      page: page.value,
      q: q.value || undefined,
      category: facet?.type === 'categoria' ? facet.slug : undefined,
      author: facet?.type === 'autor' ? facet.slug : undefined,
    })),
  })

  const categories = computed(() => filtersReq.data.value?.article_categories ?? [])
  const authors = computed(() => filtersReq.data.value?.article_authors ?? [])
  const category = computed(() => (facet?.type === 'categoria' ? categories.value.find(c => c.slug === facet.slug) : undefined))
  const author = computed(() => (facet?.type === 'autor' ? authors.value.find(a => a.username === facet.slug) : undefined))
  const facetName = computed(() => category.value?.name ?? author.value?.name ?? '')
  const articles = computed(() => articlesReq.data.value?.data ?? [])
  const pagination = computed(() => articlesReq.data.value?.pagination)
  const pageTo = (p: number) => ({ path: basePath, query: { ...route.query, pagina: p > 1 ? String(p) : undefined } })
  const heading = computed(() => {
    if (category.value)
      return `Artículos de ${category.value.name}`
    return author.value ? `Artículos de ${author.value.name}` : 'Artículos de ciberseguridad'
  })
  const intro = computed(() => {
    if (category.value)
      return `Técnicas, herramientas y novedades sobre ${category.value.name} escritas por profesionales de la industria.`
    if (author.value)
      return `Todo lo que ${author.value.name} ha publicado sobre ciberseguridad en Backtrack Academy.`
    return 'Técnicas, herramientas y novedades de ciberseguridad escritas por quienes trabajan en el campo.'
  })

  function search(value: string) {
    const query: Record<string, string> = { ...route.query as Record<string, string> }
    delete query.pagina
    if (value)
      query.q = value
    else delete query.q
    return router.push({ path: basePath, query })
  }

  useSeo(() => ({
    title: category.value ? `${heading.value}: técnicas y noticias` : author.value ? heading.value : 'Artículos de ciberseguridad y hacking ético',
    description: category.value
      ? `Artículos técnicos sobre ${category.value.name} escritos por profesionales de la ciberseguridad. Aprende técnicas, herramientas y novedades.`
      : author.value
        ? `Artículos de ciberseguridad escritos por ${author.value.name}.`
        : 'Artículos técnicos sobre ciberseguridad, hacking ético, malware y pentesting escritos por profesionales de la industria.',
    path: q.value || page.value === 1 ? basePath : `${basePath}?pagina=${page.value}`,
    // /autor/:slug ya es la página canónica del autor: este listado no se indexa para no duplicarla.
    noindex: !!q.value || !articles.value.length || facet?.type === 'autor',
    jsonLd: [
      breadcrumbSchema(abs, [
        { name: 'Inicio', path: '/' },
        { name: 'Artículos', path: '/articulos' },
        ...(facetName.value ? [{ name: facetName.value, path: basePath }] : []),
      ]),
      itemListSchema(abs, articles.value.map(a => ({ name: a.title, path: `/articulo/${a.slug}` }))),
    ],
  }))

  const status = articlesReq.status
  // Errores de API → 503; categoría inexistente o ?pagina= fuera de rango → 404 real.
  const ready = Promise.all([filtersReq, articlesReq]).then(() => {
    const err = filtersReq.error.value || articlesReq.error.value
    if (err)
      throw createError({ statusCode: err.statusCode === 404 ? 404 : 503, statusMessage: 'Servicio no disponible', fatal: true })
    const outOfRange = import.meta.server && pagination.value && pagination.value.total_pages > 0 && page.value > pagination.value.total_pages
    if ((facet && !facetName.value) || outOfRange)
      throw createError({ statusCode: 404, statusMessage: 'No encontrado', fatal: true })
  })

  return reactive({ facet, q, articles, pagination, categories, authors, facetName, heading, intro, pageTo, search, status, ready })
}
