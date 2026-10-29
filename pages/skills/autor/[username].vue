<script setup lang="ts">
const listing = useSkillsListing({ type: 'autor', slug: String(useRoute().params.username) })
await listing.ready
</script>

<template>
  <CatalogSkillsListing :l="listing" />
</template>
