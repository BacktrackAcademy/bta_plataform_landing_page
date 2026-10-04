<script setup lang="ts">
import type { Specialty } from '~/interfaces/degrees.response'
import { ArrowRight } from 'lucide-vue-next'

const { siteUrl: rawSiteUrl } = useRuntimeConfig().public
const siteUrl = rawSiteUrl.replace(/\/$/, '')
const platformUrl = usePlatformUrl()

const title = 'Especialidades de Ciberseguridad'
const description = 'Rutas de aprendizaje en ciberseguridad: especialidades con cursos ordenados paso a paso, desde fundamentos hasta pentesting avanzado y seguridad web.'
const canonical = `${siteUrl}/especialidades`

useSeoMeta({
  title,
  description,
  ogTitle: `${title} | Backtrack Academy`,
  ogDescription: description,
  ogType: 'website',
  ogUrl: canonical,
  ogImage: `${siteUrl}/og-image.png`,
  twitterCard: 'summary_large_image',
  twitterTitle: `${title} | Backtrack Academy`,
  twitterDescription: description,
})

// SSR: el catálogo llega renderizado en el HTML, sin depender de sesión ni de JS
const { data, status } = await useAPI<Specialty[]>('/landing/degrees', { key: 'landing-degrees' })
const specialties = computed(() => data.value ?? [])

const levelOrder = ['Básico', 'Intermedio', 'Avanzado']
const levels = computed(() =>
  [...new Set(specialties.value.map(s => s.level).filter(Boolean))]
    .sort((a, b) => levelOrder.indexOf(a) - levelOrder.indexOf(b)),
)
const level = ref('')
const visibleSpecialties = computed(() =>
  level.value ? specialties.value.filter(s => s.level === level.value) : specialties.value,
)
const totalCourses = computed(() => visibleSpecialties.value.reduce((n, s) => n + s.courses.length, 0))
// Las rutas vienen ordenadas por la plataforma; la primera es el punto de partida sugerido
const starter = computed(() => specialties.value[0])

useHead({
  link: [{ rel: 'canonical', href: canonical }],
  script: [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': siteUrl },
          { '@type': 'ListItem', 'position': 2, 'name': 'Especialidades', 'item': canonical },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': title,
        'itemListElement': specialties.value.map((s, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'name': s.name,
          'url': `${siteUrl}/especialidad/${s.slug}`,
        })),
      },
    ]),
  }],
})

const eyebrow = 'font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink'
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue font-inconsolata text-white">
    <CyberBackground variant="recon" intensity="faint" glow="right" />
    <!-- HERO -->
    <section class="container pb-[clamp(40px,5vw,64px)] pt-[clamp(32px,5vw,72px)]">
      <nav aria-label="Migas de pan" class="mb-10 text-sm text-white/50">
        <ol class="flex items-center gap-2">
          <li>
            <NuxtLink to="/" class="hover:text-white">
              Inicio
            </NuxtLink>
          </li>
          <li aria-hidden="true">
            /
          </li>
          <li aria-current="page" class="text-white/80">
            Especialidades
          </li>
        </ol>
      </nav>
      <div :class="eyebrow">
        Especialidades
      </div>
      <h1 class="mt-3.5 max-w-[860px] text-balance font-oswald text-[clamp(36px,5.2vw,72px)] font-semibold leading-[1.02]">
        Rutas de aprendizaje en <span class="text-bta-pink">ciberseguridad</span>
      </h1>
      <p class="font-plex mt-6 max-w-[560px] text-pretty text-[clamp(17px,1.4vw,20px)] leading-relaxed text-white/70">
        Desarrolla habilidades paso a paso con cursos organizados por especialistas.
      </p>

      <div v-if="specialties.length" class="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <SpecialtiesFilters v-if="levels.length > 1" v-model="level" :options="levels" />
        <p class="text-sm text-white/45" aria-live="polite">
          {{ visibleSpecialties.length }} {{ visibleSpecialties.length === 1 ? 'ruta' : 'rutas' }} · {{ totalCourses }} cursos
        </p>
      </div>
    </section>

    <!-- LISTADO -->
    <section v-if="visibleSpecialties.length" aria-label="Catálogo de especialidades">
      <SpecialtiesCard
        v-for="(s, i) in visibleSpecialties"
        :key="s.id"
        :specialty="s"
        :index="i"
      />
    </section>

    <!-- ESTADOS VACÍO / ERROR -->
    <section v-else class="container border-t border-gray-border py-[clamp(64px,8vw,120px)]">
      <div class="max-w-[520px]">
        <h2 class="font-oswald text-3xl font-medium">
          {{ status === 'error' ? 'No pudimos cargar las especialidades' : 'Aún no hay especialidades disponibles' }}
        </h2>
        <p class="mt-3 text-white/65">
          {{ status === 'error' ? 'Intenta nuevamente en unos minutos. Mientras tanto puedes explorar el catálogo de cursos.' : 'Estamos preparando nuevas rutas. Mientras tanto puedes explorar los cursos disponibles.' }}
        </p>
        <NuxtLink
          :to="platformUrl('/cursos')"
          class="mt-8 inline-flex h-11 items-center gap-2 rounded-md border border-gray-border px-5 text-sm font-medium transition-colors duration-200 hover:bg-white/5"
        >
          Explorar cursos <ArrowRight :size="16" aria-hidden="true" />
        </NuxtLink>
      </div>
    </section>

    <!-- ¿POR DÓNDE EMPEZAR? -->
    <section v-if="starter" class="border-t border-gray-border">
      <div class="container grid items-center gap-x-16 gap-y-6 py-[clamp(56px,7vw,104px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <h2 class="text-balance font-oswald text-[clamp(28px,3vw,40px)] font-medium leading-[1.1]">
          ¿Por dónde empezar?
        </h2>
        <div>
          <p class="font-plex max-w-[560px] text-pretty leading-relaxed text-white/70">
            Las rutas están ordenadas de menor a mayor nivel. Si recién comienzas, parte por
            <NuxtLink :to="`/especialidad/${starter.slug}`" class="text-white underline underline-offset-4 hover:text-bta-pink">
              {{ starter.name }}
            </NuxtLink>
            y avanza a la siguiente cuando estés listo.
          </p>
          <NuxtLink
            :to="platformUrl('/cursos')"
            class="mt-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors duration-200 hover:text-white"
          >
            ¿Prefieres elegir cursos sueltos? Ver cursos <ArrowRight :size="16" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
