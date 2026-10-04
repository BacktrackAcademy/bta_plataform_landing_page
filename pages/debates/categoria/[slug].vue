<script setup lang="ts">
const slug = String(useRoute().params.slug)
const { discussions, pagination, categories, category, heading, pageTo, ready } = useDiscussionsListing(slug)
await ready
</script>

<template>
  <CatalogDiscussionsListing
    :title="heading"
    :intro="`Preguntas y respuestas sobre ${category?.name} de la comunidad de Backtrack Academy.`"
    :discussions="discussions"
    :categories="categories"
    :active-category="slug"
    :pagination="pagination"
    :page-to="pageTo"
    :crumbs="[{ name: 'Inicio', to: '/' }, { name: 'Debates', to: '/debates' }, { name: category?.name ?? '' }]"
  />
</template>
