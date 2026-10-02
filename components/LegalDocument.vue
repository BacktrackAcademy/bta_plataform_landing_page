<script setup lang="ts">
defineProps<{ title: string, html: string }>()
</script>

<template>
  <div class="bg-bta-dark-blue py-24">
    <div class="w-full xl:w-8/12 mx-auto px-4">
      <h1 class="text-white text-center text-3xl font-oswald pt-16 pb-10 leading-normal">
        {{ title }}
      </h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <article
        class="prose prose-invert max-w-none font-inconsolata prose-headings:font-oswald prose-headings:uppercase prose-a:text-bta-pink prose-p:text-gray-300 prose-li:text-gray-300 prose-li:marker:text-bta-pink"
        v-html="html"
      />
    </div>
  </div>
</template>
