<script setup lang="ts">
import LegalDocument from '@/components/LegalDocument.vue'
import html from '~/assets/legal/terms.html?raw'

useSeoMeta({ title: 'Términos de servicio' })
</script>

<template>
  <LegalDocument title="Términos de servicio de Backtrack Academy" :html="html" />
</template>
