/** Respuesta de GET /landing/degrees: especialidades con su ruta de cursos ya ordenada. */
export interface Specialty {
  id: number
  slug: string
  name: string
  area: string
  level: string
  description: string
  image_url: string | null
  is_free: boolean
  price: number
  duration_seconds: number
  courses: SpecialtyCourse[]
}

export interface SpecialtyCourse {
  slug: string
  title: string
  is_free: boolean
  /** Ícono del curso (blanco sobre transparente). Puede faltar: el nodo cae a un punto. */
  icon_url?: string | null
  duration_seconds: number
}
