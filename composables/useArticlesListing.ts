import type { Paginated, PublicArticleCard, PublicFilters } from '~/interfaces/public'

const PER_PAGE = 9

/**
 * Datos + SEO compartidos por /articulos y /articulos/categoria/:slug.
 * Categoría inexistente o `?pagina=` fuera de rango → 404 real. Paginación simple indexable con canonical propio.
 */
export function useArticlesListing(categorySlug?: string) {
  const route = useRoute()
  const abs = useSiteUrl()
  const page = computed(() => Math.max(1, Number.parseInt(String(route.query.pagina ?? '1')) || 1))
  const basePath = categorySlug ? `/articulos/categoria/${categorySlug}` : '/articulos'

  // Ambas requests salen en paralelo y NO se hace `await` aquí: tras un await, un composable pierde el contexto de
  // Nuxt (useSeo fallaría). El `await` lo hace la página con `await listing.ready`, donde sí se conserva.
  const filtersReq = usePublicApi<PublicFilters>('/filters')
  const articlesReq = usePublicApi<Paginated<PublicArticleCard>>('/articles', {
    query: computed(() => ({ per_page: PER_PAGE, page: page.value, category: categorySlug })),
  })

  const categories = computed(() => filtersReq.data.value?.article_categories ?? [])
  const category = computed(() => categories.value.find(c => c.slug === categorySlug))
  const articles = computed(() => articlesReq.data.value?.data ?? [])
  const pagination = computed(() => articlesReq.data.value?.pagination)
  const pageTo = (p: number) => ({ path: basePath, query: { pagina: p > 1 ? String(p) : undefined } })
  const heading = computed(() => (category.value ? `Artículos de ${category.value.name}` : 'Artículos de ciberseguridad'))

  useSeo(() => ({
    title: category.value ? `${heading.value}: técnicas y noticias` : 'Artículos de ciberseguridad y hacking ético',
    description: category.value
      ? `Artículos técnicos sobre ${category.value.name} escritos por profesionales de la ciberseguridad. Aprende técnicas, herramientas y novedades.`
      : 'Artículos técnicos sobre ciberseguridad, hacking ético, malware y pentesting escritos por profesionales de la industria.',
    path: page.value === 1 ? basePath : `${basePath}?pagina=${page.value}`,
    noindex: !articles.value.length,
    jsonLd: [
      breadcrumbSchema(abs, [
        { name: 'Inicio', path: '/' },
        { name: 'Artículos', path: '/articulos' },
        ...(category.value ? [{ name: category.value.name, path: basePath }] : []),
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
    if ((categorySlug && !category.value) || outOfRange)
      throw createError({ statusCode: 404, statusMessage: 'No encontrado', fatal: true })
  })

  return { articles, pagination, categories, category, heading, pageTo, status, ready }
}
