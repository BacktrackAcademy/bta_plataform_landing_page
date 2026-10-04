<script setup lang="ts">
import type { Specialty } from '~/interfaces/degrees.response'
import { ArrowRight, Clock, Layers } from 'lucide-vue-next'

const props = defineProps<{ specialty: Specialty, index: number }>()

const LEVEL_BARS: Record<string, number> = { Básico: 1, Intermedio: 2, Avanzado: 3 }
const bars = computed(() => LEVEL_BARS[props.specialty.level] ?? 0)
const href = computed(() => `/especialidad/${props.specialty.slug}`)
const coursesLabel = computed(() => {
  const n = props.specialty.courses.length
  return `${n} ${n === 1 ? 'curso' : 'cursos'}`
})

const { el, visible } = useReveal()
</script>

<template>
  <article
    ref="el"
    class="group relative border-t border-gray-border transition-[opacity,transform,background-color] duration-700 ease-out hover:bg-white/[.015]"
    :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'"
  >
    <!-- imagen como ambientación, no como banner -->
    <img
      v-if="specialty.image_url"
      :src="specialty.image_url"
      alt=""
      loading="lazy"
      decoding="async"
      width="262"
      height="300"
      class="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[300px] object-cover opacity-[.22] transition-opacity duration-500 [mask-image:linear-gradient(to_left,black,transparent)] group-hover:opacity-35 lg:block"
    >

    <div class="container relative grid gap-x-16 gap-y-8 py-[clamp(40px,5vw,72px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <header class="lg:pr-6">
        <div class="font-inconsolata text-[13px] text-white/45">
          {{ String(index + 1).padStart(2, '0') }}
        </div>
        <h2 class="mt-2 text-balance font-oswald text-[clamp(28px,3vw,40px)] font-medium leading-[1.1]">
          <NuxtLink
            :to="href"
            class="transition-colors duration-200 after:absolute after:inset-0 after:z-0 group-hover:text-bta-pink focus-visible:outline-none focus-visible:underline"
          >
            {{ specialty.name }}
          </NuxtLink>
        </h2>
        <p class="mt-4 line-clamp-4 max-w-[520px] text-pretty leading-relaxed text-white/65">
          {{ specialty.description }}
        </p>

        <ul class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55">
          <li class="flex items-center gap-1.5">
            <Clock :size="14" :stroke-width="1.75" aria-hidden="true" />
            <span class="sr-only">Duración:</span>{{ formatDuration(specialty.duration_seconds) }}
          </li>
          <li v-if="specialty.level" class="flex items-center gap-2">
            <span class="flex items-end gap-[2px]" aria-hidden="true">
              <span
                v-for="n in 3"
                :key="n"
                class="w-[3px] rounded-sm"
                :class="[n <= bars ? 'bg-bta-pink' : 'bg-white/25', ['h-1.5', 'h-2.5', 'h-3.5'][n - 1]]"
              />
            </span>
            <span class="sr-only">Nivel:</span>{{ specialty.level }}
          </li>
          <li class="flex items-center gap-1.5">
            <Layers :size="14" :stroke-width="1.75" aria-hidden="true" />
            {{ coursesLabel }}
          </li>
        </ul>

        <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <NuxtLink
            :to="href"
            class="relative z-10 inline-flex h-11 items-center gap-2 rounded-md border border-gray-border px-5 text-sm font-medium text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink"
          >
            Ver especialidad
            <ArrowRight :size="16" class="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </NuxtLink>
          <span class="text-sm" :class="specialty.is_free ? 'font-medium text-emerald-400' : 'text-white/75'">
            {{ specialty.is_free ? 'Gratis' : `USD ${specialty.price}` }}
          </span>
        </div>
      </header>

      <div class="relative z-10 min-w-0 self-center">
        <h3 class="mb-5 text-xs font-medium uppercase tracking-[.12em] text-white/45">
          Ruta de aprendizaje
        </h3>
        <SpecialtiesLearningPath :courses="specialty.courses" :label="`Cursos de ${specialty.name}`" :visible="visible" />
      </div>
    </div>
  </article>
</template>
