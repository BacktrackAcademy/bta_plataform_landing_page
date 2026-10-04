<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

// Filtro de categorías en una sola línea con scroll horizontal (en vez de 3 filas de chips).
const props = defineProps<{
  items: { slug: string, name: string, count: number }[]
  allTo: string
  basePath: string
  active?: string
}>()

const scroller = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)

function update() {
  const el = scroller.value
  if (!el)
    return
  atStart.value = el.scrollLeft <= 4
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
}
function scrollBy(dir: 1 | -1) {
  const el = scroller.value
  if (el)
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' })
}

onMounted(() => {
  const el = scroller.value
  if (!el)
    return
  // La categoría activa queda visible al entrar.
  el.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ inline: 'center', block: 'nearest' })
  update()
  const ro = new ResizeObserver(update)
  ro.observe(el)
  onBeforeUnmount(() => ro.disconnect())
})

const chip = 'inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-3 text-[13px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink'
const on = 'border-bta-pink bg-bta-pink/15 text-white'
const off = 'border-white/10 text-white/70 hover:border-white/30 hover:text-white'
const isActive = (slug?: string) => (props.active ?? '') === (slug ?? '')
</script>

<template>
  <nav aria-label="Categorías" class="mt-10 flex items-center gap-3">
    <span class="hidden shrink-0 font-inconsolata text-[13px] text-white/45 sm:block"><span class="text-bta-pink">$</span> filtrar</span>

    <div class="relative min-w-0 flex-1">
      <div
        ref="scroller"
        class="cat-scroll flex gap-2 overflow-x-auto py-1"
        :class="{ 'is-start': atStart, 'is-end': atEnd }"
        @scroll.passive="update"
      >
        <NuxtLink :to="allTo" :class="[chip, isActive() ? on : off]" :aria-current="isActive() ? 'page' : undefined">
          Todos
        </NuxtLink>
        <NuxtLink
          v-for="c in items"
          :key="c.slug"
          :to="`${basePath}/${c.slug}`"
          :class="[chip, isActive(c.slug) ? on : off]"
          :aria-current="isActive(c.slug) ? 'page' : undefined"
        >
          {{ c.name }} <span class="text-white/40">{{ c.count }}</span>
        </NuxtLink>
      </div>
    </div>

    <div class="hidden shrink-0 gap-1 md:flex">
      <button type="button" aria-label="Categorías anteriores" class="grid size-8 place-items-center rounded-md border border-white/10 text-white/60 transition-colors hover:border-white/30 hover:text-white disabled:opacity-30" :disabled="atStart" @click="scrollBy(-1)">
        <ChevronLeft :size="16" />
      </button>
      <button type="button" aria-label="Más categorías" class="grid size-8 place-items-center rounded-md border border-white/10 text-white/60 transition-colors hover:border-white/30 hover:text-white disabled:opacity-30" :disabled="atEnd" @click="scrollBy(1)">
        <ChevronRight :size="16" />
      </button>
    </div>
  </nav>
</template>

<style>
.cat-scroll {
  scrollbar-width: none;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 28px, #000 calc(100% - 28px), transparent);
  mask-image: linear-gradient(90deg, transparent, #000 28px, #000 calc(100% - 28px), transparent);
}
.cat-scroll.is-start {
  -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 28px), transparent);
  mask-image: linear-gradient(90deg, #000 calc(100% - 28px), transparent);
}
.cat-scroll.is-end {
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 28px);
  mask-image: linear-gradient(90deg, transparent, #000 28px);
}
.cat-scroll.is-start.is-end { -webkit-mask-image: none; mask-image: none; }
.cat-scroll::-webkit-scrollbar { display: none; }
</style>
