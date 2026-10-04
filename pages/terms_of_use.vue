<script setup lang="ts">
import LegalDocument from '@/components/LegalDocument.vue'
import html from '~/assets/legal/terms.html?raw'

useSeo({
  title: 'Términos de servicio',
  description: 'Términos de servicio de Backtrack Academy: condiciones de uso de la plataforma, suscripciones y certificados.',
  path: '/terms_of_use',
})
</script>

<template>
  <LegalDocument title="Términos de servicio de Backtrack Academy" :html="html" />
</template>
