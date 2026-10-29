<script setup lang="ts">
const listing = useSkillsListing({ type: 'categoria', slug: String(useRoute().params.slug) })
await listing.ready
</script>

<template>
  <CatalogSkillsListing :l="listing" />
</template>
