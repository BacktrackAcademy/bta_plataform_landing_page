<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

// Enlaces reales (<a href>) para que los buscadores recorran el listado.
const props = defineProps<{ page: number, totalPages: number, to: (page: number) => RouteLocationRaw }>()

const pages = computed(() => {
  const out: (number | '…')[] = []
  const win = new Set([1, props.totalPages, props.page - 1, props.page, props.page + 1])
  for (let p = 1; p <= props.totalPages; p++) {
    if (win.has(p))
      out.push(p)
    else if (out[out.length - 1] !== '…')
      out.push('…')
  }
  return out
})

const base = 'inline-flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm transition-colors'
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Paginación" class="mt-12 flex flex-wrap items-center justify-center gap-2 text-white">
    <NuxtLink v-if="page > 1" :to="to(page - 1)" rel="prev" class="border-gray-border hover:bg-white/5" :class="[base]">
      Anterior
    </NuxtLink>
    <template v-for="(p, i) in pages" :key="`${p}-${i}`">
      <span v-if="p === '…'" class="px-1 text-white/40">…</span>
      <NuxtLink
        v-else
        :to="to(p)"
        :aria-current="p === page ? 'page' : undefined"
        :class="[base, p === page ? 'border-bta-pink bg-bta-pink/15' : 'border-gray-border hover:bg-white/5']"
      >
        {{ p }}
      </NuxtLink>
    </template>
    <NuxtLink v-if="page < totalPages" :to="to(page + 1)" rel="next" class="border-gray-border hover:bg-white/5" :class="[base]">
      Siguiente
    </NuxtLink>
  </nav>
</template>
