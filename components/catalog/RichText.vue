<script setup lang="ts">
// HTML autoral ya saneado por la API (lista blanca de tags/atributos). Único lugar donde se usa v-html.
defineProps<{ html: string }>()
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="font-plex prose prose-pre:font-inconsolata prose-code:font-inconsolata prose-invert max-w-none text-white/80 prose-headings:font-oswald prose-headings:text-white prose-a:text-bta-pink prose-strong:text-white prose-li:marker:text-bta-pink" v-html="html" />
</template>
