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

// Filas fijas de beneficios: una sola fuente para home y /precios.
export function planFeatures(p: Plan): [string, boolean][] {
  const paid = !p.free
  return [
    [p.free ? 'Acceso a cursos gratuitos' : 'Acceso a todos nuestros cursos', true],
    [`${p.opportunities} ${p.opportunities === 1 ? 'oportunidad' : 'oportunidades'} para exámenes`, p.opportunities > 0],
    [p.vouchers > 0 ? `${p.vouchers} ${p.vouchers === 1 ? 'especialidad' : 'especialidades'} a elección` : 'Especialidades', p.vouchers > 0],
    [`${p.vouchers} ${p.vouchers === 1 ? 'voucher' : 'vouchers'} para especialidades`, p.vouchers > 0],
    ['Certificados de aprobación', paid],
    ['Estudia con acompañamiento', paid],
    ['Comunidad en Discord', paid],
  ]
}

// El plan Free se registra; los de pago caen primero en el carrito de la app (tras login/registro).
export function planCtaPath(p: Plan): string | null {
  return p.free ? null : `/suscripciones/carrito?plan=${p.id}`
}
