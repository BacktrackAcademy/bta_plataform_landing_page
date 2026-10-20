<script setup lang="ts">
const listing = useArticlesListing({ type: 'categoria', slug: String(useRoute().params.slug) })
await listing.ready
</script>

<template>
  <CatalogArticlesListing :l="listing" />
</template>
