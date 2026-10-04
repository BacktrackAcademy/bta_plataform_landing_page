// Constructores de JSON-LD (schema.org). Reciben `abs` = (path) => URL absoluta del sitio público.
type Abs = (path?: string) => string

export function organizationSchema(abs: Abs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': abs('/#organization'),
    'name': 'Backtrack Academy',
    'url': abs('/'),
    'logo': abs('/favicon.svg'),
    'sameAs': [
      'https://www.facebook.com/BackTrackAcademy/',
      'https://www.instagram.com/backtrackacademy/',
      'https://www.linkedin.com/company/backtrack-academy/',
    ],
  }
}

export function websiteSchema(abs: Abs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs('/#website'),
    'url': abs('/'),
    'name': 'Backtrack Academy',
    'inLanguage': 'es',
    'publisher': { '@id': abs('/#organization') },
  }
}

export function breadcrumbSchema(abs: Abs, items: { name: string, path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'name': item.name,
      'item': abs(item.path),
    })),
  }
}

/** Especialidad/curso como schema.org Course. `parts` = cursos que la componen. */
export function courseSchema(abs: Abs, c: {
  path: string
  name: string
  description?: string | null
  level?: string | null
  seconds?: number | null
  image?: string | null
  instructors?: { name: string, path: string }[]
  parts?: { name: string, path: string }[]
  isFree?: boolean
  rating?: { average: number | null, count: number } | null
  partOf?: { name: string, path: string } | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': abs(c.path),
    'url': abs(c.path),
    'name': c.name,
    ...(c.description ? { description: c.description } : {}),
    'inLanguage': 'es',
    ...(c.level ? { educationalLevel: c.level } : {}),
    ...(c.image ? { image: c.image } : {}),
    'provider': { '@type': 'EducationalOrganization', 'name': 'Backtrack Academy', 'url': abs('/') },
    ...(c.instructors?.length
      ? { author: c.instructors.map(i => ({ '@type': 'Person', 'name': i.name, 'url': abs(i.path) })) }
      : {}),
    ...(c.parts?.length
      ? { hasPart: c.parts.map(p => ({ '@type': 'Course', 'name': p.name, 'url': abs(p.path), 'provider': { '@type': 'EducationalOrganization', 'name': 'Backtrack Academy' } })) }
      : {}),
    ...(c.seconds ? { timeRequired: isoDuration(c.seconds) } : {}),
    ...(c.isFree ? { isAccessibleForFree: true } : {}),
    ...(c.rating?.count && c.rating.average
      ? { aggregateRating: { '@type': 'AggregateRating', 'ratingValue': c.rating.average, 'ratingCount': c.rating.count, 'bestRating': 5, 'worstRating': 1 } }
      : {}),
    ...(c.partOf ? { isPartOf: { '@type': 'Course', 'name': c.partOf.name, 'url': abs(c.partOf.path) } } : {}),
  }
}

export function itemListSchema(abs: Abs, items: { name: string, path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': items.map((item, i) => ({ '@type': 'ListItem', 'position': i + 1, 'name': item.name, 'url': abs(item.path) })),
  }
}
