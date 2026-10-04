export interface Plan {
  id: number
  name: string
  price: number
  old_price: number
  monthly_price: number | null
  discount_percent: number
  recommended: boolean
  opportunities: number
  vouchers: number
}

// Filas fijas de beneficios por posición (anual, semestral, mensual): una sola fuente para home y /precios.
export function planFeatures(p: Plan, i: number): [string, boolean][] {
  return [
    ['Acceso a todos nuestros cursos', true],
    [`${p.opportunities} oportunidades para exámenes`, true],
    [['2 especialidades a elección', '1 especialidad a elección', 'Especialidades'][i] ?? 'Especialidades', i < 2],
    [`${p.vouchers} vouchers para especialidades`, p.vouchers > 0],
    ['Certificados de aprobación', true],
    ['Estudia con acompañamiento', i < 2],
    ['Comunidad en Discord', i < 2],
  ]
}
