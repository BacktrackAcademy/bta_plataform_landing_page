<script setup lang="ts">
const listing = useArticlesListing({ type: 'autor', slug: String(useRoute().params.slug) })
await listing.ready
</script>

<template>
  <CatalogArticlesListing :l="listing" />
</template>
