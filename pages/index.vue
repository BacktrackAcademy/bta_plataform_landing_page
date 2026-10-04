<script setup lang="ts">
import type { Paginated, PublicArticleCard, PublicCourseCard, PublicSpecialtyCard } from '~/interfaces/public'
import { ArrowRight, Check, Minus, Star } from 'lucide-vue-next'

interface Opinion {
  id: number
  opinion: string
  evaluation: number
  user: { name: string, username: string }
  course: { titulo: string, slug: string }
}

interface Plan {
  id: number
  name: string
  price: number
  old_price: number
  monthly_price: number | null
  discount_percent: number
  recommended: boolean
  opportunities: number
  vouchers: number
}

useSeo({
  title: 'Formación avanzada en ciberseguridad',
  description: 'Especialidades y cursos de hacking ético y ciberseguridad con instructores de la industria. Aprende con teoría, práctica y certificados.',
  path: '/',
})

const { signupUrl } = useAppLinks()

// Todo el contenido sale de la API pública de Rails. Cada sección se oculta si su dato no llegó:
// una caída parcial de la API no rompe la home.
const { data: specialties } = usePublicApi<{ data: PublicSpecialtyCard[] }>('/specialties')
const { data: featured } = usePublicApi<Paginated<PublicCourseCard>>('/courses', { query: { per_page: 30 } })
const { data: articles } = usePublicApi<Paginated<PublicArticleCard>>('/articles', { query: { per_page: 30 } })
const { data: opinions } = useAPI<Opinion[]>('/landing/opinions', { params: { limit: 3 } })
const { data: apiPlans } = useAPI<Plan[]>('/landing/plans')

const specialtyList = computed(() => (specialties.value?.data ?? []).filter(s => s.courses_count > 0))
// Más recientes primero (la API ya ordena así), un curso por instructor; si no alcanzan, se completa con los siguientes más nuevos.
function pickDistinct<T>(items: T[], key: (i: T) => string | undefined, n: number): T[] {
  const seen = new Set<string>()
  const first: T[] = []
  const rest: T[] = []
  for (const it of items) {
    const k = key(it)
    if (k && !seen.has(k)) {
      seen.add(k)
      first.push(it)
    }
    else {
      rest.push(it)
    }
  }
  return [...first, ...rest].slice(0, n)
}
const courses = computed(() => pickDistinct(featured.value?.data ?? [], c => c.instructor?.username, 6))
const latestArticles = computed(() => pickDistinct(articles.value?.data ?? [], a => a.author?.username, 3))
const totalCourses = computed(() => featured.value?.pagination.total_entries ?? 0)
const totalHours = computed(() => Math.round(specialtyList.value.reduce((a, s) => a + s.total_duration_seconds, 0) / 3600))

const why = [
  { n: '01', t: 'Sigue una ruta de aprendizaje', d: 'Nuestras especialidades están preparadas por expertos en ciberseguridad con un enfoque teórico-práctico.' },
  { n: '02', t: 'Obtén experiencia real', d: 'Cursos con el contenido y las herramientas usados en la industria: instrucción audiovisual combinada con práctica.' },
  { n: '03', t: 'Recibe orientación y apoyo', d: 'Nuestros mentores están al tanto de tu avance, te guían por el camino indicado y te motivan a cumplir tus objetivos.' },
]

// Filas fijas de beneficios por posición (anual, semestral, mensual), como en la tabla anterior
function planFeatures(p: Plan, i: number): [string, boolean][] {
  return [
    ['Acceso a todos nuestros cursos', true],
    [`${p.opportunities} oportunidades para exámenes`, true],
    [['2 especialidades a elección', '1 especialidad a elección', 'Especialidades'][i] ?? 'Especialidades', i < 2],
    [`${p.vouchers} vouchers para especialidades`, p.vouchers > 0],
    ['Certificados de aprobación', true],
    ['Estudia con acompañamiento', i < 2],
    ['Comunidad en Discord', i < 2],
  ]
}
const plans = computed(() => apiPlans.value ?? [])
const selectedPlan = ref<number | null>(null)
const activePlan = computed(() => selectedPlan.value ?? plans.value.find(p => p.recommended)?.id)

const eyebrow = 'font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink'
const h2 = 'mt-3.5 text-balance font-oswald text-[clamp(32px,4vw,56px)] font-medium leading-[1.05] text-white'
const btnPrimary = 'inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#D60E6A] px-6 font-medium text-white transition-colors duration-200 hover:bg-[#B80C5B] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink focus-visible:ring-offset-2 focus-visible:ring-offset-bta-dark-blue'
const btnOutline = 'inline-flex h-12 items-center justify-center gap-2 rounded-md border border-gray-border px-6 font-medium text-white transition-colors duration-200 hover:bg-white/5 active:translate-y-px'
const btnGhost = 'inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 font-medium text-white transition-colors duration-200 hover:bg-white/5'
const sectionLink = 'flex items-center gap-1.5 text-[15px] font-medium text-white transition-colors hover:text-bta-pink'
</script>

<template>
  <div class="bg-bta-dark-blue font-inconsolata text-white">
    <!-- HERO -->
    <section class="relative flex min-h-[min(820px,92vh)] items-end overflow-hidden md:items-center">
      <picture>
        <source media="(min-width: 768px)" srcset="/banner/banner_pink_1920.webp" type="image/webp">
        <img
          src="/banner/banner_pink_900.webp"
          alt=""
          width="900"
          height="461"
          fetchpriority="high"
          decoding="async"
          class="absolute inset-0 h-full w-full object-cover object-[78%_center] saturate-[.85] md:object-right"
        >
      </picture>
      <div class="absolute inset-0 bg-bta-dark-blue/80 md:bg-bta-dark-blue/50" />
      <div class="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-b from-bta-dark-blue/0 to-bta-dark-blue" />
      <div class="container relative w-full pb-[clamp(64px,9vw,120px)] pt-[120px]">
        <div class="max-w-[720px]">
          <p :class="eyebrow">
            Backtrack Academy
          </p>
          <h1 class="mt-5 text-balance font-oswald text-[clamp(44px,6.6vw,96px)] font-semibold uppercase leading-[.95] tracking-[-.01em]">
            Formación avanzada en <span class="text-bta-pink">ciberseguridad</span>
          </h1>
          <p class="mt-8 max-w-[480px] text-pretty text-[clamp(17px,1.4vw,20px)] leading-relaxed text-white/75">
            Especialidades y cursos de hacking ético creados por profesionales de la industria. Aprende haciendo.
          </p>
          <div class="mt-10 flex flex-wrap gap-3">
            <a :href="signupUrl()" :class="btnPrimary">
              Empezar ahora <ArrowRight :size="18" />
            </a>
            <NuxtLink to="/cursos" :class="btnGhost">
              Explorar cursos
            </NuxtLink>
          </div>
          <dl v-if="totalCourses" class="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6 font-inconsolata text-sm">
            <div>
              <dt class="sr-only">
                Cursos
              </dt>
              <dd><span class="text-xl text-white">{{ totalCourses }}</span> <span class="text-white/55">cursos</span></dd>
            </div>
            <div v-if="specialtyList.length">
              <dt class="sr-only">
                Especialidades
              </dt>
              <dd><span class="text-xl text-white">{{ specialtyList.length }}</span> <span class="text-white/55">especialidades</span></dd>
            </div>
            <div v-if="totalHours">
              <dt class="sr-only">
                Horas de contenido
              </dt>
              <dd><span class="text-xl text-white">{{ totalHours }}</span> <span class="text-white/55">horas de contenido</span></dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- ESPECIALIDADES -->
    <section v-if="specialtyList.length" id="especialidades" class="relative isolate border-t border-white/5">
      <CyberBackground variant="recon" intensity="subtle" glow="left" />
      <div class="container grid items-start gap-x-20 gap-y-10 py-[clamp(80px,10vw,144px)] lg:grid-cols-3">
        <div class="lg:sticky lg:top-28">
          <div :class="eyebrow">
            Especialidades
          </div>
          <h2 :class="h2">
            Rutas completas para tu carrera
          </h2>
          <p class="mt-5 max-w-[400px] text-pretty leading-relaxed text-white/75">
            Cada especialidad reúne los cursos necesarios, en orden, para dominar un área de la ciberseguridad.
          </p>
          <NuxtLink to="/especialidades" class="mt-8" :class="[sectionLink]">
            Ver todas las especialidades <ArrowRight :size="16" />
          </NuxtLink>
        </div>
        <div class="border-t border-gray-border lg:col-span-2">
          <CatalogSpecialtyRow v-for="s in specialtyList" :key="s.slug" :specialty="s" />
        </div>
      </div>
    </section>

    <!-- CURSOS DESTACADOS -->
    <section v-if="courses.length" id="cursos" class="relative isolate border-t border-white/5">
      <CyberBackground variant="scan" intensity="subtle" glow="right" />
      <div class="container py-[clamp(80px,10vw,144px)]">
        <div class="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div :class="eyebrow">
              Cursos
            </div>
            <h2 :class="h2">
              Cursos destacados
            </h2>
          </div>
          <NuxtLink to="/cursos" :class="sectionLink">
            Ver todos los cursos <ArrowRight :size="16" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-x-5 gap-y-6">
          <CatalogCourseCard v-for="c in courses" :key="c.slug" :course="c" />
        </div>
      </div>
    </section>

    <!-- POR QUÉ -->
    <section class="relative isolate border-t border-white/5">
      <CyberBackground variant="exploit" intensity="faint" glow="none" />
      <div class="container py-[clamp(80px,10vw,144px)]">
        <div class="max-w-[960px]">
          <div class="mb-8 h-1 w-12 bg-bta-pink" />
          <h2 class="text-balance font-oswald text-[clamp(32px,4vw,56px)] font-medium leading-[1.05]">
            La mejor manera de convertirse en un experto es aprendiendo de uno
          </h2>
          <p class="mt-7 max-w-[720px] text-pretty text-[clamp(17px,1.5vw,20px)] leading-relaxed text-white/75">
            Brindamos la experiencia de los mejores profesionales a través de una ruta de aprendizaje que contiene cursos, exámenes y ejercicios prácticos, pensada para que cumplas tus objetivos en ciberseguridad.
          </p>
        </div>
        <div class="mt-[clamp(56px,7vw,96px)] grid gap-x-14 gap-y-10 md:grid-cols-3">
          <div v-for="w in why" :key="w.n" class="border-t border-gray-border pt-6">
            <div class="font-inconsolata text-[13px] text-white/55">
              {{ w.n }}
            </div>
            <h3 class="mt-3 text-xl font-semibold leading-snug">
              {{ w.t }}
            </h3>
            <p class="mt-2.5 text-pretty text-[15px] leading-relaxed text-white/75">
              {{ w.d }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ARTÍCULOS -->
    <section v-if="latestArticles.length" id="articulos" class="relative isolate border-t border-white/5">
      <CyberBackground variant="http" intensity="subtle" glow="left" />
      <div class="container py-[clamp(80px,10vw,144px)]">
        <div class="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div :class="eyebrow">
              Conocimiento
            </div>
            <h2 :class="h2">
              Artículos técnicos
            </h2>
          </div>
          <NuxtLink to="/articulos" :class="sectionLink">
            Ver todos los artículos <ArrowRight :size="16" />
          </NuxtLink>
        </div>
        <div class="grid gap-x-8 gap-y-10 md:grid-cols-3">
          <CatalogArticleCard v-for="a in latestArticles" :key="a.slug" :article="a" />
        </div>
      </div>
    </section>

    <!-- OPINIONES -->
    <section v-if="opinions?.length" id="opiniones" class="relative isolate border-t border-white/5">
      <CyberBackground variant="topology" intensity="faint" glow="right" flip />
      <div class="container py-[clamp(80px,10vw,144px)]">
        <div class="mb-12">
          <div :class="eyebrow">
            Opiniones
          </div>
          <h2 :class="h2">
            Lo que dicen nuestros estudiantes
          </h2>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          <figure v-for="r in opinions" :key="r.id" class="flex flex-col gap-6 rounded-lg border border-gray-border bg-bta-section p-7">
            <div class="flex gap-1" role="img" :aria-label="`${r.evaluation} de 5 estrellas`">
              <Star v-for="i in 5" :key="i" :size="16" :class="i <= r.evaluation ? 'text-bta-pink' : 'text-white/25'" />
            </div>
            <blockquote class="flex-1 text-pretty leading-relaxed text-white/75">
              “{{ r.opinion }}”
            </blockquote>
            <figcaption class="flex flex-col gap-1 border-t border-white/5 pt-5">
              <span class="text-[15px] font-semibold">{{ r.user.name }}</span>
              <NuxtLink :to="`/curso/${r.course.slug}`" class="text-[13px] text-white/55 hover:text-bta-pink">
                {{ r.course.titulo }}
              </NuxtLink>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- PLANES -->
    <section v-if="plans.length" id="planes" class="relative isolate border-t border-white/5">
      <CyberBackground variant="grid" intensity="faint" glow="none" />
      <div class="container py-[clamp(80px,10vw,144px)]">
        <div class="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div :class="eyebrow">
              Planes Pro
            </div>
            <h2 :class="h2">
              Conviértete en un <span class="text-bta-pink">hacker profesional</span>
            </h2>
          </div>
          <NuxtLink to="/precios" :class="sectionLink">
            Comparar planes <ArrowRight :size="16" />
          </NuxtLink>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          <div v-for="(p, i) in plans" :key="p.id" class="flex flex-col gap-3">
            <button
              type="button"
              class="flex flex-1 flex-col gap-6 rounded-lg border bg-bta-section p-6 text-left transition-colors duration-200"
              :class="activePlan === p.id ? 'border-bta-pink' : 'border-gray-border hover:border-white/30'"
              :aria-pressed="activePlan === p.id"
              @click="selectedPlan = p.id"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-oswald text-xl font-medium uppercase tracking-[.02em]">{{ p.name }}</span>
                <span v-if="p.recommended" class="rounded bg-bta-pink/15 px-2 py-0.5 text-xs font-medium text-bta-pink">Recomendado</span>
              </div>
              <div>
                <div class="flex items-baseline gap-1.5">
                  <span class="text-4xl font-semibold">USD {{ p.price }}</span>
                </div>
                <div class="mt-1.5 flex gap-2 text-[13px] text-white/55">
                  <span v-if="p.monthly_price">USD {{ p.monthly_price }} / mes</span><span v-if="p.price < p.old_price" class="text-emerald-400">Ahorra {{ p.discount_percent }}%</span>
                </div>
              </div>
              <ul class="flex flex-col gap-2.5 border-t border-white/5 pt-5 text-sm">
                <li v-for="[label, ok] in planFeatures(p, i)" :key="label" class="flex items-center gap-2.5" :class="ok ? 'text-white' : 'text-white/40'">
                  <Check v-if="ok" :size="16" class="text-bta-pink" />
                  <Minus v-else :size="16" />
                  {{ label }}
                </li>
              </ul>
            </button>
            <a :href="signupUrl('/suscripciones')" :class="activePlan === p.id ? btnPrimary : btnOutline">
              Elegir plan
            </a>
          </div>
        </div>
        <p class="mt-6 max-w-[820px] text-[13px] leading-relaxed text-white/55">
          Importante: si tu pago recurrente está activado, las suscripciones no tienen derecho a reembolso. Cualquier duda, contáctanos a <a href="mailto:contacto@backtrackacademy.com" class="text-bta-pink hover:underline">contacto@backtrackacademy.com</a>.
        </p>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="relative isolate border-t border-white/5">
      <CyberBackground variant="prompt" intensity="normal" glow="center" mask="soft" />
      <div class="container flex flex-wrap items-end justify-between gap-10 py-[clamp(96px,12vw,176px)]">
        <h2 class="max-w-[820px] text-balance font-oswald text-[clamp(40px,5.6vw,84px)] font-semibold uppercase leading-[.98]">
          Empieza hoy tu camino en <span class="text-bta-pink">ciberseguridad</span>
        </h2>
        <a :href="signupUrl()" :class="btnPrimary">
          Empezar ahora <ArrowRight :size="18" />
        </a>
      </div>
    </section>
  </div>
</template>
