<script setup lang="ts">
import type { SpecialtyCourse } from '~/interfaces/degrees.response'

// En mobile la ruta es vertical y se colapsa; en md+ es un riel horizontal desplazable.
const props = defineProps<{ courses: SpecialtyCourse[], label: string, visible: boolean }>()

const COLLAPSED = 4
const expanded = ref(false)
const hiddenCount = computed(() => Math.max(0, props.courses.length - COLLAPSED))
</script>

<template>
  <div>
    <ol
      :aria-label="label"
      class="path relative flex flex-col md:grid md:grid-flow-col md:auto-cols-[minmax(150px,1fr)] md:overflow-x-auto md:pb-3"
    >
      <li
        v-for="(course, i) in courses"
        :key="course.slug"
        class="path-node group/node relative"
        :class="[i >= COLLAPSED && !expanded ? 'hidden md:block' : 'block']"
      >
        <!-- conector: vertical en mobile, horizontal en md+ (sale del borde del círculo) -->
        <span
          v-if="i < courses.length - 1"
          aria-hidden="true"
          class="absolute left-5 top-10 h-full w-px bg-gray-border md:left-10 md:top-5 md:h-px md:w-[calc(100%-2.5rem)]"
        />
        <NuxtLink
          :to="`/curso/${course.slug}`"
          class="relative flex gap-4 pb-6 outline-none md:block md:gap-0 md:pb-0 md:pr-4"
        >
          <span
            aria-hidden="true"
            class="node-dot relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-white/25 bg-bta-dark-blue transition-all duration-300 group-hover/node:border-bta-pink group-hover/node:shadow-[0_0_14px_-2px_rgba(236,16,117,.6)] group-focus-within/node:border-bta-pink"
            :class="visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
            :style="{ transitionDelay: `${Math.min(i, 8) * 70}ms` }"
          >
            <img
              v-if="course.icon_url"
              :src="course.icon_url"
              alt=""
              width="20"
              height="20"
              loading="lazy"
              class="size-5 object-contain opacity-80 transition-opacity duration-300 group-hover/node:opacity-100"
            >
            <span v-else class="size-[7px] rounded-full bg-white/50 transition-colors duration-300 group-hover/node:bg-bta-pink" />
          </span>
          <span class="block md:mt-4">
            <span class="block font-inconsolata text-xs text-white/40">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="mt-0.5 block text-pretty text-sm leading-snug text-white/85 transition-colors duration-200 group-hover/node:text-white group-focus-visible/node:text-white md:line-clamp-3">
              {{ course.title }}
            </span>
            <span class="mt-1 block text-xs text-white/45">{{ formatDuration(course.duration_seconds) }}</span>
          </span>
        </NuxtLink>
      </li>
    </ol>
    <button
      v-if="hiddenCount > 0"
      type="button"
      :aria-expanded="expanded"
      class="mt-1 text-sm text-white/70 underline-offset-4 hover:text-white hover:underline md:hidden"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Mostrar menos' : `Ver ${hiddenCount} cursos más` }}
    </button>
  </div>
</template>

<style scoped>
.path {
  scrollbar-width: thin;
  scrollbar-color: #36364e transparent;
}
.path-node:focus-within a { @apply rounded; box-shadow: 0 0 0 2px #EC1075; }
@media (prefers-reduced-motion: reduce) {
  .node-dot { transition: none !important; }
}
</style>
