<script setup lang="ts">
import type { PublicSpecialty } from '~/interfaces/public'
import { ArrowRight, Clock, Layers } from 'lucide-vue-next'

const route = useRoute()
const abs = useSiteUrl()
const { signupUrl } = useAppLinks()
const slug = String(route.params.slug)

const { data: specialty } = await usePublicResource<PublicSpecialty>(() => `/specialties/${slug}`)
const s = computed(() => specialty.value!)

const path = `/especialidad/${slug}`
const startUrl = computed(() => signupUrl(path))
const cover = computed(() => s.value.wallpaper_url || s.value.image_url)
const duration = computed(() => formatDuration(s.value.total_duration_seconds))

// Bloques editoriales, en el orden y con los títulos de la ficha original. Solo se muestran los que existen.
const sections = computed(() => [
  { id: 'acerca', title: 'Acerca de esta especialidad', html: s.value.description },
  { id: 'objetivos', title: 'Qué lograrás', html: s.value.goals },
  { id: 'habilidades', title: 'Qué habilidades aprenderás', html: s.value.learn },
  { id: 'por-que', title: '¿Por qué esta especialidad?', html: s.value.why },
  { id: 'conocimientos', title: 'Conocimientos previos', html: s.value.aptitude },
  { id: 'herramientas', title: 'Herramientas que usarás', html: s.value.work },
].filter(b => b.html))

useSeo(() => ({
  title: `${s.value.name}: especialidad en ciberseguridad`,
  description: s.value.summary || `Especialidad ${s.value.name} de Backtrack Academy: ${s.value.courses_count} cursos de ciberseguridad con instructores de la industria y certificado.`,
  path,
  image: cover.value,
  modifiedTime: s.value.updated_at,
  jsonLd: [
    breadcrumbSchema(abs, [{ name: 'Inicio', path: '/' }, { name: 'Especialidades', path: '/especialidades' }, { name: s.value.name, path }]),
    courseSchema(abs, {
      path,
      name: s.value.name,
      description: s.value.summary,
      level: s.value.level,
      seconds: s.value.total_duration_seconds,
      image: cover.value,
      isFree: s.value.is_free,
      instructors: s.value.instructors.map(i => ({ name: i.name, path: `/autor/${i.username}` })),
      parts: s.value.courses.map(c => ({ name: c.title, path: `/curso/${c.slug}` })),
    }),
  ],
}))

const btnPrimary = 'inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#D60E6A] px-6 font-medium text-white transition-colors duration-200 hover:bg-[#B80C5B] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink focus-visible:ring-offset-2 focus-visible:ring-offset-bta-dark-blue'
const prose = 'prose prose-invert max-w-none text-white/80 prose-headings:font-oswald prose-headings:text-white prose-a:text-bta-pink prose-strong:text-white prose-li:marker:text-bta-pink'
</script>

<template>
  <div class="bg-bta-dark-blue pb-24 font-plex text-white lg:pb-0">
    <!-- HERO -->
    <section class="relative overflow-hidden border-b border-white/5">
      <img
        v-if="cover"
        :src="cover"
        alt=""
        width="1200"
        height="600"
        fetchpriority="high"
        decoding="async"
        class="absolute inset-0 h-full w-full object-cover opacity-25"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-bta-dark-blue/40 to-bta-dark-blue" />
      <div class="container relative pb-[clamp(56px,7vw,96px)] pt-10">
        <CatalogBreadcrumbs :items="[{ name: 'Inicio', to: '/' }, { name: 'Especialidades', to: '/especialidades' }, { name: s.name }]" />
        <div class="mt-12 max-w-[820px]">
          <p class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink">
            Especialidad<template v-if="s.level">
              · {{ s.level }}
            </template>
          </p>
          <h1 class="mt-4 text-balance font-oswald text-[clamp(36px,5.4vw,76px)] font-semibold uppercase leading-[.98]">
            {{ s.name }}
          </h1>
          <p v-if="s.summary" class="mt-6 max-w-[640px] text-pretty text-lg leading-relaxed text-white/75">
            {{ s.summary }}
          </p>
          <ul class="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-inconsolata text-sm text-white/70">
            <li class="flex items-center gap-2">
              <Layers :size="16" class="text-bta-pink" /> {{ s.courses_count }} {{ s.courses_count === 1 ? 'curso' : 'cursos' }}
            </li>
            <li v-if="duration" class="flex items-center gap-2">
              <Clock :size="16" class="text-bta-pink" /> {{ duration }} de contenido
            </li>
            <li v-if="s.is_free" class="text-emerald-400">
              Gratis
            </li>
          </ul>
          <div class="mt-10 flex flex-wrap gap-3">
            <a :href="startUrl" :class="btnPrimary">
              Comenzar especialidad <ArrowRight :size="18" />
            </a>
            <a href="#temario" class="inline-flex h-12 items-center rounded-md px-6 font-medium transition-colors hover:bg-white/5">
              Ver temario
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTENIDO -->
    <div class="container grid gap-x-16 gap-y-16 py-[clamp(56px,7vw,104px)] lg:grid-cols-[minmax(0,1fr)_320px]">
      <div class="min-w-0 space-y-16">
        <section v-for="b in sections" :id="b.id" :key="b.id">
          <h2 class="font-oswald text-[clamp(26px,3vw,36px)] font-medium leading-tight">
            {{ b.title }}
          </h2>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="mt-5" :class="prose" v-html="b.html" />
        </section>

        <section v-if="s.courses.length" id="temario">
          <h2 class="font-oswald text-[clamp(26px,3vw,36px)] font-medium leading-tight">
            Temario: {{ s.courses.length }} {{ s.courses.length === 1 ? 'curso' : 'cursos' }} en orden
          </h2>
          <ol class="mt-8 border-t border-gray-border">
            <li v-for="(c, i) in s.courses" :key="c.slug" class="border-b border-gray-border">
              <NuxtLink
                :to="`/curso/${c.slug}`"
                class="group grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink sm:grid-cols-[48px_minmax(0,1fr)_auto]"
              >
                <span class="font-inconsolata text-sm text-white/45">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="min-w-0">
                  <span class="block font-oswald text-xl font-medium leading-snug transition-colors group-hover:text-bta-pink">{{ c.title }}</span>
                  <span v-if="c.summary" class="mt-1 line-clamp-2 block text-[15px] leading-relaxed text-white/60">{{ c.summary }}</span>
                  <span v-if="c.coming_soon" class="mt-2 inline-block rounded bg-white/10 px-2 py-0.5 text-xs text-white/70">Próximamente</span>
                </span>
                <span class="col-start-2 mt-2 font-inconsolata text-[13px] text-white/50 sm:col-start-3 sm:mt-0 sm:text-right">
                  <template v-if="c.level">{{ c.level }}<br></template>
                  <template v-if="c.lessons_count">{{ c.lessons_count }} clases</template><template v-if="formatDuration(c.duration_seconds)"> · {{ formatDuration(c.duration_seconds) }}</template>
                </span>
              </NuxtLink>
            </li>
          </ol>
        </section>

        <section v-if="s.instructors.length" id="instructores">
          <h2 class="font-oswald text-[clamp(26px,3vw,36px)] font-medium leading-tight">
            {{ s.instructors.length === 1 ? 'Instructor' : 'Instructores' }}
          </h2>
          <ul class="mt-6 flex flex-wrap gap-x-10 gap-y-5">
            <li v-for="i in s.instructors" :key="i.username">
              <NuxtLink :to="`/autor/${i.username}`" class="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink">
                <span class="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border border-gray-border bg-bta-section font-oswald text-white/50">
                  <img v-if="i.avatar_url" :src="i.avatar_url" :alt="i.name" width="48" height="48" loading="lazy" class="size-full object-cover">
                  <template v-else>{{ initials(i.name) }}</template>
                </span>
                <span class="font-medium transition-colors group-hover:text-bta-pink">{{ i.name }}</span>
              </NuxtLink>
            </li>
          </ul>
        </section>
      </div>

      <!-- Resumen + CTA (escritorio) -->
      <aside class="hidden lg:block">
        <div class="sticky top-28 rounded-lg border border-gray-border bg-bta-section p-6">
          <p class="font-oswald text-xl font-medium uppercase">
            {{ s.name }}
          </p>
          <dl class="mt-5 space-y-3 border-t border-white/5 pt-5 text-sm">
            <div v-if="s.level" class="flex justify-between gap-4">
              <dt class="text-white/55">
                Nivel
              </dt><dd>{{ s.level }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-white/55">
                Cursos
              </dt><dd>{{ s.courses_count }}</dd>
            </div>
            <div v-if="duration" class="flex justify-between gap-4">
              <dt class="text-white/55">
                Duración
              </dt><dd>{{ duration }}</dd>
            </div>
          </dl>
          <a :href="startUrl" class="mt-6 w-full" :class="[btnPrimary]">Comenzar especialidad</a>
          <p class="mt-3 text-center text-xs text-white/45">
            Crea tu cuenta y continúa en la plataforma.
          </p>
        </div>
      </aside>
    </div>

    <!-- CTA FINAL -->
    <section class="border-t border-white/5">
      <div class="container flex flex-wrap items-end justify-between gap-8 py-[clamp(64px,8vw,112px)]">
        <h2 class="max-w-[720px] text-balance font-oswald text-[clamp(30px,4.2vw,56px)] font-semibold uppercase leading-[1]">
          Empieza {{ s.name }} <span class="text-bta-pink">hoy</span>
        </h2>
        <a :href="startUrl" :class="btnPrimary">
          Comenzar especialidad <ArrowRight :size="18" />
        </a>
      </div>
    </section>

    <!-- CTA fijo (móvil) -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-bta-dark-blue/95 p-3 backdrop-blur lg:hidden">
      <a :href="startUrl" class="w-full" :class="[btnPrimary]">Comenzar especialidad</a>
    </div>
  </div>
</template>
