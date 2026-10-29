<script setup lang="ts">
const listing = useSkillsListing()
await listing.ready
</script>

<template>
  <CatalogSkillsListing :l="listing" />
</template>
