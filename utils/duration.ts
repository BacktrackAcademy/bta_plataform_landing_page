/** 77388 -> "21 h 29 min". Sin segundos: es una duración orientativa. */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60)
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0)
    return `${m} min`
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}
