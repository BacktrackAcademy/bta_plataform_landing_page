<script setup lang="ts">
const { articles, pagination, categories, pageTo, ready } = useArticlesListing()
await ready
</script>

<template>
  <CatalogArticlesListing
    title="Conocimiento técnico para profesionales"
    intro="Técnicas, herramientas y novedades de ciberseguridad escritas por quienes trabajan en el campo."
    :articles="articles"
    :categories="categories"
    :pagination="pagination"
    :page-to="pageTo"
    :crumbs="[{ name: 'Inicio', to: '/' }, { name: 'Artículos' }]"
  />
</template>
