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
