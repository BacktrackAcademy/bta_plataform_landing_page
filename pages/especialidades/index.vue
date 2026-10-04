<script setup lang="ts">
import type { PublicSpecialtyCard } from '~/interfaces/public'
import { ArrowRight } from 'lucide-vue-next'

const abs = useSiteUrl()
const { data } = await usePublicResource<{ data: PublicSpecialtyCard[] }>('/specialties')
const specialties = computed(() => (data.value?.data ?? []).filter(s => s.courses_count > 0))

useSeo(() => ({
  title: 'Especialidades de ciberseguridad y hacking ético',
  description: 'Rutas de aprendizaje completas en ciberseguridad: pentesting, hacking ético y más. Cada especialidad reúne los cursos necesarios, en orden, con certificado.',
  path: '/especialidades',
  jsonLd: [
    breadcrumbSchema(abs, [{ name: 'Inicio', path: '/' }, { name: 'Especialidades', path: '/especialidades' }]),
    itemListSchema(abs, specialties.value.map(s => ({ name: s.name, path: `/especialidad/${s.slug}` }))),
  ],
}))
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue font-inconsolata text-white">
    <CyberBackground variant="recon" intensity="faint" glow="right" />
    <div class="container pb-[clamp(72px,9vw,128px)] pt-10">
      <CatalogBreadcrumbs :items="[{ name: 'Inicio', to: '/' }, { name: 'Especialidades' }]" />
      <header class="mt-10 max-w-[760px]">
        <p class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink">
          Especialidades
        </p>
        <h1 class="mt-4 text-balance font-oswald text-[clamp(38px,5.4vw,76px)] font-semibold uppercase leading-[.98]">
          Rutas completas para tu carrera en ciberseguridad
        </h1>
        <p class="mt-6 max-w-[600px] text-pretty text-lg leading-relaxed text-white/75">
          Cada especialidad reúne, en orden, los cursos que necesitas para dominar un área: teoría, práctica, examen y certificado.
        </p>
      </header>

      <div v-if="specialties.length" class="mt-14 border-t border-gray-border">
        <CatalogSpecialtyRow v-for="s in specialties" :key="s.slug" :specialty="s" />
      </div>
      <p v-else class="mt-14 text-white/60">
        Estamos preparando nuevas especialidades.
      </p>

      <div class="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-lg border border-gray-border bg-bta-section p-[clamp(24px,4vw,40px)]">
        <div>
          <h2 class="font-oswald text-2xl font-medium">
            ¿Prefieres empezar por un tema puntual?
          </h2>
          <p class="mt-1 text-white/65">
            Explora el catálogo completo y filtra por nivel, tema o instructor.
          </p>
        </div>
        <NuxtLink to="/cursos" class="inline-flex h-12 items-center gap-2 rounded-md border border-gray-border px-6 font-medium transition-colors hover:bg-white/5">
          Ver todos los cursos <ArrowRight :size="18" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
