<script setup lang="ts">
import type { PublicCourseCard } from '~/interfaces/public'

defineProps<{ course: PublicCourseCard, priority?: boolean }>()
</script>

<template>
  <NuxtLink
    :to="`/curso/${course.slug}`"
    class="group flex flex-col overflow-hidden rounded-lg border border-gray-border bg-bta-section text-white transition-colors duration-200 hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink"
  >
    <div class="relative aspect-video overflow-hidden border-b border-white/5 bg-white/5">
      <img
        v-if="course.image_thumb_url || course.image_url"
        :src="course.image_thumb_url || course.image_url!"
        :alt="course.title"
        width="640"
        height="360"
        :loading="priority ? 'eager' : 'lazy'"
        decoding="async"
        class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      >
    </div>
    <div class="flex flex-1 flex-col gap-3 p-5">
      <p v-if="course.specialty" class="font-inconsolata text-xs uppercase tracking-wide text-bta-pink">
        {{ course.specialty.name }}
      </p>
      <h3 class="text-balance font-oswald text-2xl font-medium leading-tight transition-colors duration-200 group-hover:text-bta-pink">
        {{ course.title }}
      </h3>
      <p v-if="course.instructor" class="text-sm text-white/70">
        {{ course.instructor.name }}
      </p>
      <div class="mt-auto flex items-center gap-3 pt-3 text-[13px] text-white/60">
        <span v-if="course.level" class="flex items-center gap-2">
          <span class="flex items-end gap-[2px]" aria-hidden="true">
            <span
              v-for="i in 3"
              :key="i"
              class="w-[3px] rounded-sm"
              :class="[i <= levelBars(course.level) ? 'bg-bta-pink' : 'bg-white/25', ['h-1.5', 'h-2.5', 'h-3.5'][i - 1]]"
            />
          </span>
          {{ course.level }}
        </span>
        <span v-if="formatDuration(course.duration_seconds)" class="ml-auto font-inconsolata">
          {{ formatDuration(course.duration_seconds) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
