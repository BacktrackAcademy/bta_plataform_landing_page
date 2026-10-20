<script setup lang="ts">
const listing = useArticlesListing()
await listing.ready
</script>

<template>
  <CatalogArticlesListing :l="listing" />
</template>
