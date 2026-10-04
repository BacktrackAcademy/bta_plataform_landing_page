// Tipos de la API pública de Rails (/api/v1/public/*). Contrato: bta_plataform/docs/public_api.md

export interface PublicAuthorRef {
  username: string
  name: string
  avatar_url: string | null
}

export interface PublicAuthorCard extends PublicAuthorRef {
  headline: string | null
  aboutme: string | null
  articles_count: number
  courses_count: number
}

export interface PublicRef {
  slug: string
  name: string
}

export interface PublicCourseCard {
  slug: string
  title: string
  summary: string | null
  level: string | null
  specialty: PublicRef | null
  category: PublicRef | null
  instructor: PublicAuthorRef | null
  image_url: string | null
  image_thumb_url: string | null
  duration_seconds: number
  lessons_count: number
  students_count: number
  is_free: boolean
  coming_soon: boolean
  updated_at: string
}

export interface PublicSpecialtyCard {
  slug: string
  name: string
  summary: string | null
  level: string | null
  courses_count: number
  total_duration_seconds: number
  is_free: boolean
  image_url: string | null
  icon_url: string | null
  wallpaper_url: string | null
  updated_at: string
}

export interface PublicArticleCard {
  slug: string
  title: string
  summary: string | null
  category: PublicRef | null
  author: PublicAuthorRef | null
  image_url: string | null
  image_thumb_url: string | null
  published_at: string
  updated_at: string
}

export interface Paginated<T> {
  data: T[]
  pagination: { current_page: number, per_page: number, total_pages: number, total_entries: number }
}
