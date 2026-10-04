<script setup lang="ts">
// CAPA 4 · iluminación ambiental: magenta de marca + un toque frío. Solo opacity (respira muy despacio).
defineProps<{ side?: 'left' | 'right' | 'center' | 'none' }>()
</script>

<template>
  <div v-if="side !== 'none'" class="cy-glow" :data-side="side ?? 'center'" aria-hidden="true" />
</template>
