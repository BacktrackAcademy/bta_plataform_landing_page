import type { MaybeRefOrGetter } from 'vue'

export interface SeoOptions {
  title: string
  description: string
  /** Path canónico ("/curso/xyz"). Por defecto, la ruta actual sin query. */
  path?: string
  /** Imagen OG: absoluta o path del sitio. Por defecto /og-image.png. */
  image?: string | null
  type?: 'website' | 'article' | 'profile'
  /** noindex, follow (filtros, páginas sin valor SEO, estados de error). */
  noindex?: boolean
  publishedTime?: string | null
  modifiedTime?: string | null
  jsonLd?: object | object[] | null
}

/** Serializa JSON-LD de forma segura dentro de <script>: `<` escapado, el contenido viene de la API. */
export function jsonLdString(data: object | object[]) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/**
 * SEO por página: title, description, canonical absoluto, Open Graph, Twitter Card, robots y JSON-LD.
 * Un solo lugar para que todas las páginas públicas queden consistentes.
 */
export function useSeo(options: MaybeRefOrGetter<SeoOptions>) {
  const abs = useSiteUrl()
  const route = useRoute()
  const o = () => toValue(options)
  const canonical = computed(() => abs(o().path ?? route.path))
  const image = computed(() => {
    const img = o().image || '/og-image.png'
    return /^https?:\/\//.test(img) ? img : abs(img)
  })

  useSeoMeta({
    title: () => o().title,
    description: () => o().description,
    robots: () => (o().noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'),
    ogTitle: () => o().title,
    ogDescription: () => o().description,
    ogType: () => o().type ?? 'website',
    ogUrl: canonical,
    ogImage: image,
    ogSiteName: 'Backtrack Academy',
    ogLocale: 'es_LA',
    twitterCard: 'summary_large_image',
    twitterTitle: () => o().title,
    twitterDescription: () => o().description,
    twitterImage: image,
    articlePublishedTime: () => o().publishedTime ?? undefined,
    articleModifiedTime: () => o().modifiedTime ?? undefined,
  })

  useHead(() => ({
    link: [{ rel: 'canonical', href: canonical.value }],
    script: o().jsonLd
      ? [{ type: 'application/ld+json', innerHTML: jsonLdString(o().jsonLd as object), key: 'page-jsonld' }]
      : [],
  }))
}
