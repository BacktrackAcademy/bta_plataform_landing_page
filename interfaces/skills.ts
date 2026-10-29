// Tipos de la API pública de Backtrack Skills (/api/v1/public/skills*). Contrato: bta_plataform/docs/skills.md

export type SkillResourceType = 'ai_skill' | 'prompt' | 'workflow' | 'automation' | 'agent_configuration'
export type SkillTool = 'claude' | 'chatgpt' | 'gemini' | 'cursor' | 'codex' | 'universal'
export type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface SkillAuthor {
  display_name: string
  /** Solo si la persona tiene perfil público; si no, null y no hay enlace. */
  username: string | null
  avatar_url: string | null
  public: boolean
}

export interface SkillCard {
  id: number
  slug: string
  title: string
  summary: string
  category: { id: number, name: string, slug: string }
  resource_type: SkillResourceType
  difficulty: SkillDifficulty
  language: string
  tools: SkillTool[]
  tags: { name: string, slug: string }[]
  author: SkillAuthor
  rating: { average: number | null, count: number }
  downloads_count: number
  favorites_count: number
  comments_count: number
  featured: boolean
  version: string
  published_at: string | null
}

export interface SkillExample {
  title: string
  use_case: string | null
  instructions: string | null
  input_example: string | null
  output_example: string | null
}

export interface SkillDetail extends SkillCard {
  description: string | null
  requirements: string | null
  /** HTML saneado por la API: lo único que se inyecta con v-html. */
  description_html: string
  requirements_html: string
  content: string
  content_html: string
  license: string
  github_url: string | null
  views_count: number
  updated_at: string
  examples: SkillExample[]
  versions: { version: string, changelog: string | null, created_at: string }[]
  files: { id: number, filename: string, content_type: string, byte_size: number }[]
  related: SkillCard[]
}

export interface SkillStats { skills: number, creators: number, downloads: number, categories: number }

export interface SkillFilters {
  categories: { name: string, slug: string, description: string | null, count: number }[]
  resource_types: SkillResourceType[]
  tools: SkillTool[]
  difficulties: SkillDifficulty[]
  languages: string[]
  sorts: string[]
  stats: SkillStats
}

export interface SkillReviewComment {
  id: number
  parent_id: number | null
  content: string | null
  removed: boolean
  author: { display_name: string, username: string | null, avatar_url: string | null } | null
  created_at: string
  edited_at: string | null
  replies?: SkillReviewComment[]
}

export interface SkillReviews {
  rating: { average: number | null, count: number, distribution: Record<string, number> }
  comments_count: number
  comments: { data: SkillReviewComment[], pagination: { current_page: number, total_pages: number, total_entries: number } }
}
