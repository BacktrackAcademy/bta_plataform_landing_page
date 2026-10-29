import type { SkillDifficulty, SkillResourceType, SkillTool } from '~/interfaces/skills'

export const RESOURCE_TYPE_LABELS: Record<SkillResourceType, string> = {
  ai_skill: 'AI Skill',
  prompt: 'Prompt',
  workflow: 'Workflow',
  automation: 'Automation',
  agent_configuration: 'Agent Configuration',
}

export const TOOL_LABELS: Record<SkillTool, string> = {
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  gemini: 'Gemini',
  cursor: 'Cursor',
  codex: 'OpenAI Codex',
  universal: 'Universal',
}

export const DIFFICULTY_LABELS: Record<SkillDifficulty, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
}

export const SORT_LABELS: Record<string, string> = {
  recent: 'Más recientes',
  popular: 'Más populares',
  rated: 'Mejor valoradas',
  downloads: 'Más descargadas',
  saved: 'Más guardadas',
}

export const LICENSE_LABELS: Record<string, string> = {
  'mit': 'MIT',
  'apache-2.0': 'Apache 2.0',
  'gpl-3.0': 'GPL 3.0',
  'cc-by-4.0': 'CC BY 4.0',
  'cc0-1.0': 'CC0 1.0',
  'all-rights-reserved': 'Todos los derechos reservados',
}

export const LICENSE_URLS: Record<string, string> = {
  'mit': 'https://opensource.org/license/mit',
  'apache-2.0': 'https://www.apache.org/licenses/LICENSE-2.0',
  'gpl-3.0': 'https://www.gnu.org/licenses/gpl-3.0.html',
  'cc-by-4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'cc0-1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
}

/** Formato compacto de contadores: 1 250 → "1,2 k". */
export function compactNumber(n: number): string {
  return new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}
