<script setup lang="ts">
const { discussions, pagination, categories, pageTo, ready } = useDiscussionsListing()
await ready
</script>

<template>
  <CatalogDiscussionsListing
    title="Preguntas y respuestas de la comunidad"
    intro="Resuelve tus dudas de hacking ético y ciberseguridad con otros estudiantes y profesionales."
    :discussions="discussions"
    :categories="categories"
    :pagination="pagination"
    :page-to="pageTo"
    :crumbs="[{ name: 'Inicio', to: '/' }, { name: 'Debates' }]"
  />
</template>
