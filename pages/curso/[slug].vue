<script setup lang="ts">
import type { PublicCourse } from '~/interfaces/public'
import { ArrowRight, Clock, Layers, PlayCircle, Star } from 'lucide-vue-next'

const route = useRoute()
const abs = useSiteUrl()
const { signupUrl } = useAppLinks()
const slug = String(route.params.slug)

const { data } = await usePublicResource<PublicCourse>(() => `/courses/${slug}`)
const c = computed(() => data.value!)

const path = `/curso/${slug}`
// La inscripción ocurre en la app; el redirect lleva de vuelta a este curso tras registrarse o iniciar sesión.
const startUrl = computed(() => signupUrl(path))
const cover = computed(() => c.value.wallpaper_url || c.value.image_url)
const duration = computed(() => formatDuration(c.value.duration_seconds))
const hasRating = computed(() => c.value.rating.count > 0 && c.value.rating.average)

const crumbs = computed(() => [
  { name: 'Inicio', path: '/' },
  { name: 'Cursos', path: '/cursos' },
  ...(c.value.specialty ? [{ name: c.value.specialty.name, path: `/especialidad/${c.value.specialty.slug}` }] : []),
  { name: c.value.title, path },
])

useSeo(() => ({
  title: `${c.value.title}: curso de ciberseguridad`,
  description: c.value.summary || `Curso ${c.value.title} de Backtrack Academy${c.value.instructor ? ` con ${c.value.instructor.name}` : ''}: ${c.value.lessons_count} clases de ciberseguridad.`,
  path,
  image: cover.value,
  modifiedTime: c.value.updated_at,
  jsonLd: [
    breadcrumbSchema(abs, crumbs.value),
    courseSchema(abs, {
      path,
      name: c.value.title,
      description: c.value.summary,
      level: c.value.level,
      seconds: c.value.duration_seconds,
      image: cover.value,
      isFree: c.value.is_free,
      rating: c.value.rating,
      instructors: c.value.instructor ? [{ name: c.value.instructor.name, path: `/autor/${c.value.instructor.username}` }] : [],
      partOf: c.value.specialty ? { name: c.value.specialty.name, path: `/especialidad/${c.value.specialty.slug}` } : null,
    }),
  ],
}))

const btnPrimary = 'inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#D60E6A] px-6 font-medium text-white transition-colors duration-200 hover:bg-[#B80C5B] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink focus-visible:ring-offset-2 focus-visible:ring-offset-bta-dark-blue'
const h2 = 'font-oswald text-[clamp(26px,3vw,36px)] font-medium leading-tight'

const blocks = computed(() => [
  { id: 'descripcion', title: 'Sobre este curso', html: c.value.description },
  { id: 'aprenderas', title: 'Qué aprenderás', html: c.value.goals },
  { id: 'beneficios', title: 'Beneficios', html: c.value.benefits },
].filter(b => b.html))
</script>

<template>
  <div class="bg-bta-dark-blue pb-24 font-plex text-white lg:pb-0">
    <!-- HERO -->
    <section class="relative overflow-hidden border-b border-white/5">
      <img v-if="cover" :src="cover" alt="" width="1200" height="600" fetchpriority="high" decoding="async" class="absolute inset-0 h-full w-full object-cover opacity-20">
      <div class="absolute inset-0 bg-gradient-to-b from-bta-dark-blue/40 to-bta-dark-blue" />
      <div class="container relative pb-[clamp(48px,6vw,88px)] pt-10">
        <CatalogBreadcrumbs :items="[{ name: 'Inicio', to: '/' }, { name: 'Cursos', to: '/cursos' }, ...(c.specialty ? [{ name: c.specialty.name, to: `/especialidad/${c.specialty.slug}` }] : []), { name: c.title }]" />
        <div class="mt-12 max-w-[820px]">
          <p class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink">
            Curso<template v-if="c.level">
              · {{ c.level }}
            </template>
          </p>
          <h1 class="mt-4 text-balance font-oswald text-[clamp(34px,5vw,68px)] font-semibold uppercase leading-[1]">
            {{ c.title }}
          </h1>
          <p v-if="c.summary" class="mt-6 max-w-[640px] text-pretty text-lg leading-relaxed text-white/75">
            {{ c.summary }}
          </p>
          <p v-if="c.instructor" class="mt-6 text-white/70">
            Por
            <NuxtLink :to="`/autor/${c.instructor.username}`" class="font-medium text-white underline-offset-4 hover:text-bta-pink hover:underline">
              {{ c.instructor.name }}
            </NuxtLink>
          </p>
          <ul class="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-inconsolata text-sm text-white/70">
            <li v-if="c.lessons_count" class="flex items-center gap-2">
              <Layers :size="16" class="text-bta-pink" /> {{ c.lessons_count }} clases
            </li>
            <li v-if="duration" class="flex items-center gap-2">
              <Clock :size="16" class="text-bta-pink" /> {{ duration }}
            </li>
            <li v-if="hasRating" class="flex items-center gap-2">
              <Star :size="16" class="fill-bta-pink text-bta-pink" /> {{ c.rating.average }} ({{ c.rating.count }})
            </li>
            <li v-if="c.is_free" class="text-emerald-400">
              Gratis
            </li>
          </ul>
          <div class="mt-10 flex flex-wrap gap-3">
            <a :href="startUrl" :class="btnPrimary">
              {{ c.coming_soon ? 'Próximamente · Crear cuenta' : 'Comenzar curso' }} <ArrowRight :size="18" />
            </a>
            <a v-if="c.syllabus.length" href="#temario" class="inline-flex h-12 items-center rounded-md px-6 font-medium transition-colors hover:bg-white/5">
              Ver temario
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTENIDO -->
    <div class="container grid gap-x-16 gap-y-16 py-[clamp(56px,7vw,104px)] lg:grid-cols-[minmax(0,1fr)_320px]">
      <div class="min-w-0 space-y-16">
        <section v-for="b in blocks" :id="b.id" :key="b.id">
          <h2 :class="h2">
            {{ b.title }}
          </h2>
          <CatalogRichText :html="b.html!" class="mt-5" />
        </section>

        <section v-if="c.syllabus.length" id="temario">
          <h2 :class="h2">
            Temario
          </h2>
          <p class="mt-2 text-sm text-white/55">
            {{ c.syllabus.length }} {{ c.syllabus.length === 1 ? 'módulo' : 'módulos' }} · {{ c.lessons_count }} clases
          </p>
          <div class="mt-6 border-t border-gray-border">
            <details v-for="(u, i) in c.syllabus" :key="u.title + i" class="group border-b border-gray-border" :open="i === 0">
              <summary class="flex cursor-pointer list-none items-center gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink">
                <span class="font-inconsolata text-sm text-white/45">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="min-w-0 flex-1 font-oswald text-xl font-medium leading-snug">{{ u.title }}</span>
                <span class="font-inconsolata text-[13px] text-white/50">{{ u.lessons_count }} clases</span>
                <span class="text-white/50 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <ul class="pb-4 pl-10">
                <li v-for="l in u.lessons" :key="l.title" class="flex items-center gap-3 py-2 text-[15px] text-white/75">
                  <PlayCircle :size="16" class="shrink-0 text-white/35" />
                  <span class="min-w-0 flex-1">{{ l.title }}</span>
                  <span v-if="l.is_free" class="rounded bg-emerald-400/15 px-1.5 py-0.5 text-xs text-emerald-400">Gratis</span>
                  <span v-if="l.duration" class="font-inconsolata text-[13px] text-white/45">{{ l.duration }}</span>
                </li>
              </ul>
            </details>
          </div>
        </section>

        <section v-if="c.specialty" id="especialidad" class="rounded-lg border border-gray-border bg-bta-section p-[clamp(24px,4vw,40px)]">
          <p class="font-inconsolata text-xs uppercase tracking-wide text-bta-pink">
            Parte de una especialidad
          </p>
          <h2 class="mt-2 font-oswald text-2xl font-medium">
            {{ c.specialty.name }}
          </h2>
          <p class="mt-2 max-w-[520px] text-white/65">
            Este curso forma parte de una ruta completa con los cursos en el orden recomendado.
          </p>
          <NuxtLink :to="`/especialidad/${c.specialty.slug}`" class="mt-5 inline-flex items-center gap-2 font-medium transition-colors hover:text-bta-pink">
            Explorar especialidad <ArrowRight :size="16" />
          </NuxtLink>
        </section>
      </div>

      <!-- Resumen + CTA (escritorio) -->
      <aside class="hidden lg:block">
        <div class="sticky top-28 rounded-lg border border-gray-border bg-bta-section p-6">
          <dl class="space-y-3 text-sm">
            <div v-if="c.level" class="flex justify-between gap-4">
              <dt class="text-white/55">
                Nivel
              </dt><dd>{{ c.level }}</dd>
            </div>
            <div v-if="c.lessons_count" class="flex justify-between gap-4">
              <dt class="text-white/55">
                Clases
              </dt><dd>{{ c.lessons_count }}</dd>
            </div>
            <div v-if="duration" class="flex justify-between gap-4">
              <dt class="text-white/55">
                Duración
              </dt><dd>{{ duration }}</dd>
            </div>
            <div v-if="c.students_count" class="flex justify-between gap-4">
              <dt class="text-white/55">
                Estudiantes
              </dt><dd>{{ c.students_count.toLocaleString('es-CL') }}</dd>
            </div>
          </dl>
          <a :href="startUrl" class="mt-6 w-full" :class="[btnPrimary]">{{ c.coming_soon ? 'Crear cuenta' : 'Comenzar curso' }}</a>
          <p class="mt-3 text-center text-xs text-white/45">
            Crea tu cuenta y continúa en la plataforma.
          </p>
        </div>
      </aside>
    </div>

    <CatalogStickyCta :href="startUrl" :label="c.coming_soon ? 'Próximamente · Crear cuenta' : 'Comenzar curso'" />
  </div>
</template>
