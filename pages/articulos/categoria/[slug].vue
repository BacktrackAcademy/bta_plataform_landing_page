<script setup lang="ts">
const slug = String(useRoute().params.slug)
const { articles, pagination, categories, category, heading, pageTo, ready } = useArticlesListing(slug)
await ready
</script>

<template>
  <CatalogArticlesListing
    :title="heading"
    :intro="`Técnicas, herramientas y novedades sobre ${category?.name} escritas por profesionales de la industria.`"
    :articles="articles"
    :categories="categories"
    :active-category="slug"
    :pagination="pagination"
    :page-to="pageTo"
    :crumbs="[{ name: 'Inicio', to: '/' }, { name: 'Artículos', to: '/articulos' }, { name: category?.name ?? '' }]"
  />
</template>
