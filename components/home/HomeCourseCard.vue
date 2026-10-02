<script setup lang="ts">
import { CirclePlay, Users } from 'lucide-vue-next'

export interface HomeCourse {
  slug: string
  title: string
  description: string
  instructor: string
  image?: string
  students: number
  classes: number
  price: number
  level: 'beginner' | 'intermediate' | 'advanced'
}

const props = defineProps<{ course: HomeCourse }>()
const platformUrl = usePlatformUrl()

const LEVELS = {
  beginner: { label: 'Principiante', bars: 1 },
  intermediate: { label: 'Intermedio', bars: 2 },
  advanced: { label: 'Avanzado', bars: 3 },
} as const

const level = computed(() => LEVELS[props.course.level])
const students = computed(() => props.course.students.toLocaleString('es-CL'))
</script>

<template>
  <NuxtLink
    :to="platformUrl(`/cursos/${course.slug}`)"
    class="group flex flex-col overflow-hidden rounded-lg border border-gray-border bg-bta-section text-white transition-colors duration-200 hover:border-white/30"
  >
    <div class="relative aspect-video overflow-hidden border-b border-white/5 bg-white/5">
      <img
        v-if="course.image"
        :src="course.image"
        :alt="course.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      >
      <span class="absolute left-3 top-3 flex h-[26px] items-center gap-2 rounded border border-gray-border bg-bta-dark-blue/80 px-2.5 text-xs">
        <span class="flex items-end gap-[2px]" aria-hidden="true">
          <span
            v-for="i in 3"
            :key="i"
            class="w-[3px] rounded-sm"
            :class="[i <= level.bars ? 'bg-bta-pink' : 'bg-white/25', ['h-1.5', 'h-2.5', 'h-3.5'][i - 1]]"
          />
        </span>
        {{ level.label }}
      </span>
    </div>

    <div class="flex flex-1 flex-col px-5 pt-5">
      <h3 class="text-balance font-oswald text-2xl font-medium leading-tight transition-colors duration-200 group-hover:text-bta-pink">
        {{ course.title }}
      </h3>
      <div class="mt-2 text-sm text-white/70">
        {{ course.instructor }}
      </div>
      <div class="mt-4 h-[3px] w-10 bg-bta-pink transition-all duration-300 group-hover:w-16" />
      <p class="mt-4 line-clamp-2 text-sm leading-relaxed text-white/55">
        {{ course.description }}
      </p>
    </div>

    <div class="mt-5 flex items-center gap-[18px] border-t border-white/5 px-5 py-3.5 text-[13px] text-white/55">
      <span class="flex items-center gap-1.5"><Users :size="14" :stroke-width="1.75" />{{ students }} estudiantes</span>
      <span class="flex items-center gap-1.5"><CirclePlay :size="14" :stroke-width="1.75" />{{ course.classes }} clases</span>
      <span class="ml-auto text-[15px] font-semibold text-white">USD {{ course.price }}</span>
    </div>
  </NuxtLink>
</template>
