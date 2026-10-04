<script setup lang="ts">
// Migas visibles; el JSON-LD (BreadcrumbList) lo emite cada página con `breadcrumbSchema`.
defineProps<{ items: { name: string, to?: string }[] }>()
</script>

<template>
  <nav aria-label="Migas de pan" class="font-inconsolata text-[13px] text-white/50">
    <ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
      <li v-for="(item, i) in items" :key="item.name" class="flex items-center gap-2">
        <NuxtLink v-if="item.to" :to="item.to" class="transition-colors hover:text-white">
          {{ item.name }}
        </NuxtLink>
        <span v-else aria-current="page" class="text-white/80">{{ item.name }}</span>
        <span v-if="i < items.length - 1" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>
