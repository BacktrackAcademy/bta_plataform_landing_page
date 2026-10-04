<script setup lang="ts">
const listing = useCoursesListing({ type: 'nivel', slug: String(useRoute().params.slug) })
await listing.ready
</script>

<template>
  <CatalogCoursesListing :l="listing" />
</template>
