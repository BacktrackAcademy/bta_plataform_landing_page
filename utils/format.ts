/** 5400 → "1 h 30 min"; 2700 → "45 min"; 0 → "". */
export function formatDuration(seconds?: number | null): string {
  const total = Math.round(Number(seconds) || 0)
  if (total <= 0)
    return ''
  const h = Math.floor(total / 3600)
  const m = Math.round((total % 3600) / 60)
  if (h === 0)
    return `${Math.max(m, 1)} min`
  return m ? `${h} h ${m} min` : `${h} h`
}

export function formatDate(iso?: string | null): string {
  if (!iso)
    return ''
  return new Date(iso).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

/** Barras de nivel (1–3) a partir del nombre que entrega la API ("Básico", "Intermedio", "Avanzado"…). */
export function levelBars(level?: string | null): number {
  const n = (level || '').toLowerCase()
  if (n.includes('avanz') || n.includes('exper'))
    return 3
  if (n.includes('inter'))
    return 2
  return 1
}

export function initials(name?: string | null): string {
  return (name || '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('')
}

/** Duración ISO 8601 para schema.org (`timeRequired`): 5400 → "PT1H30M". */
export function isoDuration(seconds?: number | null): string | undefined {
  const total = Math.round(Number(seconds) || 0)
  if (total <= 0)
    return undefined
  const h = Math.floor(total / 3600)
  const m = Math.round((total % 3600) / 60)
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}` || undefined
}
