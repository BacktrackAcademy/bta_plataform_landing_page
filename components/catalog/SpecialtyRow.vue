<script setup lang="ts">
import type { PublicSpecialtyCard } from '~/interfaces/public'
import { ArrowRight } from 'lucide-vue-next'

defineProps<{ specialty: PublicSpecialtyCard }>()
</script>

<template>
  <NuxtLink
    :to="`/especialidad/${specialty.slug}`"
    class="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 border-b border-gray-border py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink lg:grid-cols-[minmax(0,1fr)_auto_40px]"
  >
    <span class="min-w-0">
      <span class="block font-oswald text-[clamp(22px,2.2vw,30px)] font-medium uppercase leading-tight tracking-[.01em] transition-colors duration-200 group-hover:text-bta-pink">{{ specialty.name }}</span>
      <span v-if="specialty.summary" class="mt-1.5 line-clamp-2 block text-[15px] leading-relaxed text-white/60">{{ specialty.summary }}</span>
    </span>
    <span class="text-right font-inconsolata text-sm text-white/55">
      {{ specialty.courses_count }} {{ specialty.courses_count === 1 ? 'curso' : 'cursos' }}<template v-if="formatDuration(specialty.total_duration_seconds)"> · {{ formatDuration(specialty.total_duration_seconds) }}</template>
    </span>
    <span class="hidden justify-end transition-all duration-200 group-hover:translate-x-1 group-hover:text-bta-pink lg:flex"><ArrowRight :size="20" /></span>
  </NuxtLink>
</template>
