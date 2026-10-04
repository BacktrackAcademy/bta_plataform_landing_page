import { indexingAllowed } from '../../utils/indexing'

/** Origen canónico (sin barra final) y si este despliegue puede indexarse. */
export function siteInfo(event: Parameters<typeof useRuntimeConfig>[0]) {
  const { siteUrl, allowIndexing } = useRuntimeConfig(event).public
  const origin = String(siteUrl || 'https://backtrackacademy.com').replace(/\/$/, '')
  return { origin, canIndex: indexingAllowed(origin, allowIndexing) }
}
