<script setup lang="ts">
import type { PublicCourseCard } from '~/interfaces/public'
import { Eye, PlayCircle } from 'lucide-vue-next'

defineProps<{ course: PublicCourseCard, priority?: boolean }>()
</script>

<template>
  <NuxtLink
    :to="`/curso/${course.slug}`"
    class="gc group flex flex-col overflow-hidden rounded-lg border border-[#262a47] bg-[#12152b] font-inconsolata text-white shadow-[0_0_0_1px_rgba(0,0,0,.2)] transition-all duration-200 hover:-translate-y-0.5 hover:border-bta-pink/50 hover:shadow-[0_8px_30px_-12px_rgba(236,16,117,.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink"
  >
    <!-- portada con velo oscuro y rejilla, como en la plataforma -->
    <div class="relative aspect-[16/8] overflow-hidden border-b border-[#262a47] bg-[#0b0d1f]">
      <img
        v-if="course.image_thumb_url || course.image_url"
        :src="course.image_thumb_url || course.image_url!"
        :alt="course.title"
        width="640"
        height="320"
        :loading="priority ? 'eager' : 'lazy'"
        decoding="async"
        class="h-full w-full object-cover opacity-80 transition duration-300 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-[#12152b] via-[#12152b]/30 to-transparent" />
      <span
        v-if="course.is_free || course.coming_soon"
        class="absolute right-3 top-3 rounded bg-black/55 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm"
        :class="course.coming_soon ? 'text-white/70' : 'text-emerald-400'"
      >
        {{ course.coming_soon ? 'Próximamente' : 'Gratis' }}
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4">
      <h3 class="text-balance font-oswald text-[19px] font-medium uppercase leading-tight tracking-wide transition-colors duration-200 group-hover:text-bta-pink">
        {{ course.title }}
      </h3>

      <div v-if="course.instructor" class="flex items-center gap-2.5">
        <span class="gc-av size-9">
          <img
            v-if="course.instructor.avatar_url"
            :src="course.instructor.avatar_url"
            alt=""
            width="36"
            height="36"
            loading="lazy"
            class="gc-avimg"
          >
          <span v-else class="gc-avimg grid place-items-center text-sm font-bold text-white">{{ course.instructor.name.charAt(0) }}</span>
          <span class="gc-avtint" />
          <span class="gc-avscan" />
        </span>
        <span class="truncate text-[13px] text-white/80">{{ course.instructor.name }}</span>
      </div>

      <p v-if="course.summary" class="line-clamp-2 text-[13px] leading-snug text-white/50">
        {{ course.summary }}
      </p>

      <div class="mt-auto flex items-center gap-4 border-t border-[#262a47] pt-3 text-[12px] text-white/55">
        <span v-if="course.students_count" class="flex items-center gap-1.5" title="Estudiantes">
          <Eye :size="14" /> {{ course.students_count }}
        </span>
        <span v-if="course.lessons_count" class="flex items-center gap-1.5" title="Lecciones">
          <PlayCircle :size="14" /> {{ course.lessons_count }} lecciones
        </span>
        <span v-if="course.level" class="ml-auto rounded bg-bta-pink/15 px-2 py-0.5 font-bold uppercase tracking-wider text-bta-pink">
          {{ course.level }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
