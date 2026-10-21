export interface Plan {
  id: number
  name: string
  price: number
  old_price: number
  months?: number
  monthly_price: number | null
  discount_percent: number
  recommended: boolean
  opportunities: number
  vouchers: number
  /** Plan gratuito: es el registro, no existe como producto en la API. */
  free?: boolean
}

export const FREE_PLAN: Plan = {
  id: 0,
  name: 'Free',
  price: 0,
  old_price: 0,
  monthly_price: null,
  discount_percent: 0,
  recommended: false,
  opportunities: 0,
  vouchers: 0,
  free: true,
}

// Free primero, luego los de pago de menor a mayor duración (mensual, anual).
export function withFreePlan(paid: Plan[]): Plan[] {
  return [FREE_PLAN, ...[...paid].sort((a, b) => (a.months ?? 0) - (b.months ?? 0))]
}

export interface PlanRow {
  /** Etiqueta en la tabla comparativa. */
  label: string
  /** Texto en la tarjeta del plan; null = solo aparece en la tabla. */
  card: string | null
  ok: boolean
  /** Valor corto para la tabla (número); vacío = solo check. */
  value?: string
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

// Beneficios por plan: una sola fuente para home y /precios (tarjetas y tabla comparativa).
export function planRows(p: Plan): PlanRow[] {
  const paid = !p.free
  const exams = p.opportunities > 0
  const specialties = p.vouchers > 0
  return [
    { label: 'Acceso a cursos', card: p.free ? 'Acceso a cursos gratuitos' : 'Acceso a todos nuestros cursos', ok: true, value: p.free ? 'Solo gratuitos' : '' },
    { label: 'Estudia desde cualquier dispositivo', card: null, ok: true },
    { label: 'Retoma justo donde lo dejaste', card: 'Retomas justo donde lo dejaste', ok: true },
    { label: 'Aprende haciendo, con ejemplos prácticos', card: 'Aprendes haciendo, no solo teoría', ok: true },
    { label: 'Un curso nuevo cada mes', card: 'Un curso nuevo cada mes', ok: true },
    { label: 'Rinde exámenes al terminar cada curso', card: exams ? `${plural(p.opportunities, 'oportunidad', 'oportunidades')} para exámenes` : 'Exámenes', ok: exams, value: exams ? String(p.opportunities) : '' },
    { label: 'Tus oportunidades no caducan mientras tengas el plan', card: null, ok: paid },
    { label: 'Especialidades completas con examen final', card: specialties ? `${plural(p.vouchers, 'especialidad', 'especialidades')} con examen final` : 'Especialidades', ok: specialties, value: specialties ? String(p.vouchers) : '' },
    { label: 'Ruta de aprendizaje por especialidad', card: null, ok: specialties },
    { label: 'Certificado verificable online', card: 'Certificados verificables', ok: paid },
  ]
}

export function planFeatures(p: Plan): [string, boolean][] {
  return planRows(p).filter(r => r.card).map(r => [r.card as string, r.ok])
}

// El plan Free se registra; los de pago caen primero en el carrito de la app (tras login/registro).
export function planCtaPath(p: Plan): string | null {
  return p.free ? null : `/suscripciones/carrito?plan=${p.id}`
}
