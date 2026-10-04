<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)

useSeo({
  title: notFound.value ? 'Página no encontrada' : 'Servicio no disponible',
  description: 'Backtrack Academy: formación avanzada en ciberseguridad.',
  noindex: true,
})
</script>

<template>
  <NuxtLayout name="default">
    <section class="container flex min-h-[60vh] flex-col items-start justify-center py-24 font-plex text-white">
      <p class="font-inconsolata text-sm text-bta-pink">
        {{ error.statusCode }}
      </p>
      <h1 class="mt-3 text-balance font-oswald text-[clamp(36px,5vw,64px)] font-medium leading-[1.05]">
        {{ notFound ? 'No encontramos esta página' : 'Estamos con problemas, vuelve en un momento' }}
      </h1>
      <p class="mt-5 max-w-[520px] text-pretty text-white/70">
        {{ notFound ? 'El enlace puede haber cambiado. Explora nuestros cursos y especialidades.' : 'No pudimos cargar el contenido. Intenta de nuevo en unos minutos.' }}
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <NuxtLink to="/cursos" class="inline-flex h-12 items-center rounded-md bg-[#D60E6A] px-6 font-medium text-white transition-colors hover:bg-[#B80C5B]" @click="clearError()">
          Ver cursos
        </NuxtLink>
        <NuxtLink to="/" class="inline-flex h-12 items-center rounded-md border border-gray-border px-6 font-medium text-white transition-colors hover:bg-white/5" @click="clearError()">
          Ir al inicio
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>
