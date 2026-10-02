<script setup lang="ts">
import LegalDocument from '@/components/LegalDocument.vue'
import html from '~/assets/legal/privacy.html?raw'

useSeoMeta({ title: 'Política de privacidad' })
</script>

<template>
  <LegalDocument title="Política de privacidad de Backtrack Academy" :html="html" />
</template>
