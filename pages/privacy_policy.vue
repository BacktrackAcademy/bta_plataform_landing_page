<script setup lang="ts">
import LegalDocument from '@/components/LegalDocument.vue'
import html from '~/assets/legal/privacy.html?raw'

useSeo({
  title: 'Política de privacidad',
  description: 'Política de privacidad de Backtrack Academy: qué datos recopilamos, cómo los usamos y cuáles son tus derechos.',
  path: '/privacy_policy',
})
</script>

<template>
  <LegalDocument title="Política de privacidad de Backtrack Academy" :html="html" />
</template>
