import type { Paginated, PublicDiscussionCard, PublicFilters } from '~/interfaces/public'

const PER_PAGE = 15

/**
 * Datos + SEO compartidos por /debates y /debates/categoria/:slug (mismo patrón que useArticlesListing:
 * requests en paralelo, el `await` lo hace la página con `await listing.ready`).
 */
export function useDiscussionsListing(categorySlug?: string) {
  const route = useRoute()
  const abs = useSiteUrl()
  const page = computed(() => Math.max(1, Number.parseInt(String(route.query.pagina ?? '1')) || 1))
  const basePath = categorySlug ? `/debates/categoria/${categorySlug}` : '/debates'

  const filtersReq = usePublicApi<PublicFilters>('/filters')
  const listReq = usePublicApi<Paginated<PublicDiscussionCard>>('/discussions', {
    query: computed(() => ({ per_page: PER_PAGE, page: page.value, category: categorySlug })),
  })

  const categories = computed(() => filtersReq.data.value?.discussion_categories ?? [])
  const category = computed(() => categories.value.find(c => c.slug === categorySlug))
  const discussions = computed(() => listReq.data.value?.data ?? [])
  const pagination = computed(() => listReq.data.value?.pagination)
  const pageTo = (p: number) => ({ path: basePath, query: { pagina: p > 1 ? String(p) : undefined } })
  const heading = computed(() => (category.value ? `Debates sobre ${category.value.name}` : 'Preguntas y respuestas de ciberseguridad'))

  useSeo(() => ({
    title: category.value ? `${heading.value}: preguntas y respuestas` : 'Debates: preguntas y respuestas de ciberseguridad',
    description: category.value
      ? `Preguntas y respuestas sobre ${category.value.name} de la comunidad de Backtrack Academy. Resuelve tus dudas de hacking ético.`
      : 'Resuelve tus dudas de hacking ético y ciberseguridad con la comunidad de Backtrack Academy: preguntas y respuestas de pentesters.',
    path: page.value === 1 ? basePath : `${basePath}?pagina=${page.value}`,
    noindex: !discussions.value.length,
    jsonLd: [
      breadcrumbSchema(abs, [
        { name: 'Inicio', path: '/' },
        { name: 'Debates', path: '/debates' },
        ...(category.value ? [{ name: category.value.name, path: basePath }] : []),
      ]),
    ],
  }))

  const ready = Promise.all([filtersReq, listReq]).then(() => {
    const err = filtersReq.error.value || listReq.error.value
    if (err)
      throw createError({ statusCode: err.statusCode === 404 ? 404 : 503, statusMessage: 'Servicio no disponible', fatal: true })
    const outOfRange = import.meta.server && pagination.value && pagination.value.total_pages > 0 && page.value > pagination.value.total_pages
    if ((categorySlug && !category.value) || outOfRange)
      throw createError({ statusCode: 404, statusMessage: 'No encontrado', fatal: true })
  })

  return { discussions, pagination, categories, category, heading, pageTo, ready }
}
