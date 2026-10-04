<script setup lang="ts">
// Barra de CTA fija en móvil (el panel lateral solo existe en escritorio).
defineProps<{ href: string, label: string }>()
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-bta-dark-blue/95 p-3 backdrop-blur lg:hidden">
    <a :href="href" class="inline-flex h-12 w-full items-center justify-center rounded-md bg-[#D60E6A] font-medium text-white transition-colors hover:bg-[#B80C5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink">{{ label }}</a>
  </div>
</template>
