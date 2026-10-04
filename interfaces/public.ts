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

export interface PublicSpecialty extends PublicSpecialtyCard {
  // HTML saneado por la API. Mapeo editorial (igual que la vista legada de Rails):
  // description = Acerca de · goals = Objetivos · learn = Habilidades · aptitude = Conocimientos previos
  // work = Herramientas · why = Por qué esta especialidad
  description: string | null
  goals: string | null
  learn: string | null
  why: string | null
  work: string | null
  aptitude: string | null
  tools: string | null
  requirements: string | null
  area: string | null
  courses: PublicCourseCard[]
  instructors: PublicAuthorRef[]
}

export interface PublicSyllabusUnit {
  title: string
  lessons_count: number
  lessons: { title: string, duration: string | null, is_free: boolean }[]
}

export interface PublicCourse extends PublicCourseCard {
  description: string | null
  goals: string | null
  benefits: string | null
  keywords: string | null
  wallpaper_url: string | null
  rating: { average: number | null, count: number }
  syllabus: PublicSyllabusUnit[]
  created_at: string
}

export interface PublicFilters {
  levels: { slug: string, name: string, courses_count: number }[]
  specialties: { slug: string, name: string, courses_count: number }[]
  categories: { slug: string, name: string, courses_count: number }[]
  instructors: { username: string, name: string, courses_count: number }[]
  article_categories: { slug: string, name: string, articles_count: number }[]
  discussion_categories: { slug: string, name: string, discussions_count: number }[]
}

export interface PublicArticle extends PublicArticleCard {
  body_html: string | null
  keywords: string | null
  reading_time_minutes: number | null
  author: PublicAuthorCardLite | null
  related_articles: PublicArticleCard[]
  related_course: PublicCourseCard | null
  related_specialty: PublicSpecialtyCard | null
}

export interface PublicAuthorCardLite extends PublicAuthorRef {
  headline: string | null
  aboutme: string | null
}

export interface PublicPerson {
  name: string
  avatar_url: string | null
}

export interface PublicDiscussionCard {
  slug: string
  title: string
  excerpt: string | null
  category: PublicRef | null
  author: PublicPerson | null
  answers_count: number
  resolved: boolean
  created_at: string
  last_comment_at: string | null
}

export interface PublicDiscussion extends PublicDiscussionCard {
  body_html: string | null
  course: { slug: string, title: string } | null
  updated_at: string
  answers: { author: PublicPerson | null, body_html: string | null, created_at: string }[]
}

export interface PublicAuthor extends PublicAuthorCard {
  links: { twitter?: string, linkedin?: string, facebook?: string }
  articles: PublicArticleCard[]
  courses: PublicCourseCard[]
}
