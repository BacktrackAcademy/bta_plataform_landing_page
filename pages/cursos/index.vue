<script setup lang="ts">
// Enlaces antiguos (?tema= / ?especialidad= sueltos) → 301 a la URL con ruta propia.
const q = useRoute().query
const only = (k: string) => typeof q[k] === 'string' && q[k] && Object.keys(q).every(x => x === k)
if (only('tema'))
  await navigateTo(`/cursos/tema/${encodeURIComponent(String(q.tema))}`, { redirectCode: 301 })
if (only('especialidad'))
  await navigateTo(`/cursos/especialidad/${encodeURIComponent(String(q.especialidad))}`, { redirectCode: 301 })

if (only('nivel'))
  await navigateTo(`/cursos/nivel/${encodeURIComponent(String(q.nivel))}`, { redirectCode: 301 })

const listing = useCoursesListing()
await listing.ready
</script>

<template>
  <CatalogCoursesListing :l="listing" />
</template>
