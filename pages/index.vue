<script setup lang="ts">
import type { HomeCourse } from '~/components/home/HomeCourseCard.vue'
import type { Course } from '~/interfaces/courses.response'
import { ArrowRight, Check, Circle, CircleCheck, CircleDot, Minus, Star } from 'lucide-vue-next'

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

useSeoMeta({
  description: 'Diversos cursos esperan por tí. No esperes más, regístrate y comienza a adquirir una nueva habilidad de inmediato.',
  ogTitle: 'Cursos online de Hacking ético - Backtrack Academy',
  ogDescription: 'Diversos cursos esperan por tí. No esperes más, regístrate y comienza a adquirir una nueva habilidad de inmediato.',
  ogImage: '/og-image.png',
  ogUrl: 'https://backtrackacademy.com',
  twitterTitle: 'Cursos online de Hacking ético - Backtrack Academy',
  twitterDescription: 'Diversos cursos esperan por tí. No esperes más, regístrate y comienza a adquirir una nueva habilidad de inmediato.',
  twitterImage: '/og-image.png',
  twitterCard: 'summary_large_image',
})

// The landing is public: the logged-in demo of the learning path is not shown here
const loggedIn = computed(() => false)
const platformUrl = usePlatformUrl()

const why = [
  { n: '01', t: 'Sigue nuestra ruta de aprendizaje', d: 'Nuestras especialidades están preparadas por expertos en ciberseguridad con un enfoque teórico-práctico.' },
  { n: '02', t: 'Obtén experiencia real', d: 'Contamos con cursos que poseen el contenido y herramientas utilizados en la industria, con un aprendizaje que combina la instrucción audiovisual con aplicación práctica.' },
  { n: '03', t: 'Recibe orientación y apoyo', d: 'Nuestros mentores están dedicados y al tanto de tu avance, te guiarán por el camino indicado y te motivarán para cumplir los objetivos que te propusiste al principio.' },
]

// TODO(api): reemplazar por la especialidad + progreso del usuario
type StageStatus = 'done' | 'current' | 'next' | 'locked'
type ItemStatus = 'done' | 'progress' | 'todo'
const STAGES: { n: string, level: string, name: string, title: string, hours: number, st: StageStatus, progress: number, desc: string, skills: string[], items: [string, string, ItemStatus][] }[] = [
  { n: '01', level: 'Principiante', name: 'Primeros pasos', title: 'Primeros pasos en ciberseguridad', hours: 10, st: 'done', progress: 100, desc: 'Conceptos base, ética profesional y metodología de trabajo de un auditor.', skills: ['metodología', 'ética y legalidad', 'herramientas', 'terminología'], items: [['Introducción al hacking ético', '6 h', 'done'], ['Herramientas del auditor', '2 h', 'done'], ['Metodologías de pentesting', '2 h', 'done']] },
  { n: '02', level: 'Principiante', name: 'Fundamentos', title: 'Fundamentos técnicos', hours: 22, st: 'done', progress: 100, desc: 'Linux, redes y scripting: la base que vas a usar en cada auditoría.', skills: ['Linux', 'TCP/IP', 'Bash', 'Python'], items: [['Linux para pentesters', '8 h', 'done'], ['Redes TCP/IP', '7 h', 'done'], ['Bash scripting', '4 h', 'done'], ['Examen de fundamentos', '45 min', 'done']] },
  { n: '03', level: 'Intermedio', name: 'Seguridad web', title: 'Seguridad en aplicaciones web', hours: 28, st: 'current', progress: 45, desc: 'HTTP en profundidad, OWASP Top 10 y explotación manual con Burp Suite.', skills: ['HTTP', 'OWASP Top 10', 'Burp Suite', 'SQLi', 'XSS'], items: [['Protocolo HTTP para auditores', '5 h', 'done'], ['OWASP Top 10', '9 h', 'done'], ['SQL Injection', '4 h', 'progress'], ['Cross-Site Scripting', '6 h', 'todo'], ['Examen de seguridad web', '60 min', 'todo']] },
  { n: '04', level: 'Intermedio', name: 'Pentesting', title: 'Pentesting de infraestructura', hours: 34, st: 'next', progress: 0, desc: 'Enumeración, explotación y post-explotación en entornos Linux y Windows, con escalada de privilegios y reporte.', skills: ['Nmap', 'Metasploit', 'escalada de privilegios', 'informes'], items: [['Enumeración de servicios', '6 h', 'todo'], ['Explotación de vulnerabilidades', '10 h', 'todo'], ['Escalada de privilegios', '6 h', 'todo'], ['Redacción de informes', '4 h', 'todo']] },
  { n: '05', level: 'Avanzado', name: 'Avanzado', title: 'Red Team y Active Directory', hours: 40, st: 'locked', progress: 0, desc: 'Ataques a Active Directory, movimiento lateral y evasión. Cierra con un examen final y certificado.', skills: ['Active Directory', 'Kerberos', 'movimiento lateral', 'evasión'], items: [['Active Directory ofensivo', '12 h', 'todo'], ['Ataques a Kerberos', '6 h', 'todo'], ['Movimiento lateral', '8 h', 'todo'], ['Examen final y certificado', '2 h', 'todo']] },
]
const stage = ref(2)
const cur = computed(() => STAGES[stage.value])
const curStatus = computed(() => loggedIn.value ? cur.value.st : 'open')
const curIdx = STAGES.findIndex(s => s.st === 'current')
const trackFill = computed(() => loggedIn.value ? `${(curIdx + STAGES[curIdx].progress / 100) / (STAGES.length - 1) * 100}%` : '0%')
const pathPct = Math.round(STAGES.reduce((a, s) => a + s.progress * s.hours, 0) / STAGES.reduce((a, s) => a + s.hours, 0))
function statusLabel(s: typeof STAGES[number]) {
  return !loggedIn.value
    ? s.level
    : { done: 'Completada', current: `En curso · ${s.progress}%`, next: 'Siguiente', locked: 'Bloqueada' }[s.st]
}
const ITEM_ICON = { done: [CircleCheck, 'text-emerald-400'], progress: [CircleDot, 'text-bta-pink'], todo: [Circle, 'text-white/40'] } as const
const ctaLabel = computed(() => ({ done: 'Repasar etapa', current: 'Continuar estudiando', next: 'Comenzar etapa', locked: 'Desbloquear con Pro', open: 'Regístrate ahora' })[curStatus.value])

const { data: latestCourses } = useAPI<Course[]>('/landing/courses', { params: { limit: 6 } })
const { data: opinions } = useAPI<Opinion[]>('/landing/opinions', { params: { limit: 3 } })
const { data: apiPlans } = useAPI<Plan[]>('/landing/plans')

function toLevel(name: string): HomeCourse['level'] {
  const n = (name || '').toLowerCase()
  if (n.includes('avanz'))
    return 'advanced'
  if (n.includes('inter'))
    return 'intermediate'
  return 'beginner'
}

const courses = computed<HomeCourse[]>(() => (latestCourses.value ?? []).map(c => ({
  slug: c.slug,
  title: c.titulo,
  description: c.shortdes,
  instructor: `${c.teacher.name} ${c.teacher.lastname}`.trim(),
  image: c.image_thumb,
  students: c.students,
  classes: c.number_videos,
  price: c.price,
  level: toLevel(c.level_name),
})))

// TODO(api): especialidades
const specs = [
  ['Hacker ético', '5 etapas · 134 h'],
  ['Pentesting web', '6 cursos · 48 h'],
  ['Red Team', '7 cursos · 64 h'],
  ['Análisis forense digital', '5 cursos · 38 h'],
  ['Blue Team y SOC', '6 cursos · 42 h'],
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
</script>

<template>
  <div class="bg-bta-dark-blue font-plex text-white">
    <!-- HERO -->
    <section class="relative flex min-h-[min(880px,100vh)] items-end overflow-hidden md:items-center">
      <img src="/banner/banner_pink.png" alt="" class="absolute inset-0 h-full w-full object-cover object-[78%_center] saturate-[.85] md:object-right">
      <div class="absolute inset-0 bg-bta-dark-blue/80 md:bg-bta-dark-blue/50" />
      <div class="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-b from-bta-dark-blue/0 to-bta-dark-blue" />
      <div class="container relative w-full pb-[clamp(64px,9vw,120px)] pt-[120px]">
        <div class="max-w-[680px]">
          <h1 class="text-balance font-oswald text-[clamp(48px,7.2vw,108px)] font-semibold uppercase leading-[.95] tracking-[-.01em]">
            Desarrolla tus habilidades en <span class="text-bta-pink">ciberseguridad</span>
          </h1>
          <p class="mt-8 max-w-[460px] text-pretty text-[clamp(17px,1.4vw,20px)] leading-relaxed text-white/75">
            Te acompañamos para que te conviertas en un especialista del Hacking.
          </p>
          <div class="mt-10 flex flex-wrap gap-3">
            <NuxtLink v-if="loggedIn" :to="platformUrl('/dashboard')" :class="btnPrimary">
              Continuar estudiando <ArrowRight :size="18" />
            </NuxtLink>
            <NuxtLink v-else :to="platformUrl('/crear-cuenta')" :class="btnPrimary">
              Regístrate ahora <ArrowRight :size="18" />
            </NuxtLink>
            <NuxtLink :to="platformUrl('/cursos')" :class="btnGhost">
              Explorar cursos
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- POR QUÉ -->
    <section class="container py-[clamp(80px,10vw,144px)]">
      <div class="max-w-[960px]">
        <div class="mb-8 h-1 w-12 bg-bta-pink" />
        <h2 class="text-balance font-oswald text-[clamp(32px,4vw,56px)] font-medium leading-[1.05]">
          La mejor manera de convertirse en un experto es aprendiendo de uno
        </h2>
        <p class="mt-7 max-w-[720px] text-pretty text-[clamp(17px,1.5vw,20px)] leading-relaxed text-white/75">
          Brindamos la experiencia de los mejores profesionales a través de una ruta de aprendizaje que contiene cursos, exámenes y ejercicios prácticos. Todos nuestros contenidos son realizados con el fin de que cumplas tus objetivos en el mundo de la ciberseguridad.
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
    </section>

    <!-- RUTA -->
    <section class="border-t border-white/5">
      <div class="container py-[clamp(80px,10vw,144px)]">
        <div class="mb-12 flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div class="max-w-[620px]">
            <div :class="eyebrow">
              Ruta de aprendizaje · Hacker ético
            </div>
            <h2 :class="h2">
              De principiante a avanzado
            </h2>
          </div>
          <div v-if="loggedIn" class="w-full max-w-[260px]">
            <div class="mb-2 flex justify-between text-[13px] text-white/55">
              <span>Tu avance</span><span class="text-white">{{ pathPct }}%</span>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div class="h-full bg-bta-pink" :style="{ width: `${pathPct}%` }" />
            </div>
          </div>
        </div>

        <div class="relative flex flex-col gap-2 md:grid md:grid-cols-5">
          <div class="absolute left-[10%] right-[10%] top-[35px] hidden h-px bg-white/20 md:block">
            <div class="h-full bg-bta-pink transition-[width] duration-700 ease-out" :style="{ width: trackFill }" />
          </div>
          <button
            v-for="(s, i) in STAGES"
            :key="s.n"
            type="button"
            class="relative flex items-center gap-4 rounded-lg border p-3 text-left transition-colors duration-200 md:flex-col md:gap-1.5 md:px-3 md:py-5 md:text-center"
            :class="i === stage ? 'border-gray-border bg-bta-section' : 'border-transparent'"
            @click="stage = i"
          >
            <span
              class="grid h-8 w-8 flex-none place-items-center rounded-full border font-inconsolata text-[13px] font-semibold shadow-[0_0_0_6px_#070916] md:mb-2.5"
              :class="loggedIn && s.st === 'done'
                ? 'border-bta-pink bg-[#D60E6A] text-white'
                : loggedIn && s.st === 'current' ? 'border-bta-pink bg-bta-dark-blue text-bta-pink' : 'border-white/25 bg-bta-dark-blue text-white/55'"
            >
              <Check v-if="loggedIn && s.st === 'done'" :size="16" :stroke-width="2.5" />
              <template v-else>{{ s.n }}</template>
            </span>
            <span class="flex-1 font-oswald text-lg font-medium uppercase leading-tight tracking-[.02em] md:text-xl">{{ s.name }}</span>
            <span class="text-[13px]" :class="loggedIn && s.st === 'current' ? 'text-bta-pink' : 'text-white/55'">{{ statusLabel(s) }}</span>
          </button>
        </div>

        <div class="mt-4 grid gap-[clamp(32px,5vw,80px)] rounded-lg border border-gray-border bg-bta-section p-[clamp(24px,4vw,48px)] lg:grid-cols-2">
          <div class="flex flex-col gap-4">
            <div class="font-inconsolata text-[13px] text-white/55">
              Etapa {{ cur.n }} · {{ cur.level }} · {{ cur.hours }} h
            </div>
            <h3 class="text-[26px] font-semibold leading-tight">
              {{ cur.title }}
            </h3>
            <p class="text-pretty leading-relaxed text-white/75">
              {{ cur.desc }}
            </p>
            <p class="text-sm leading-relaxed text-white/55">
              Aprenderás: <span class="text-white">{{ cur.skills.join(', ') }}</span>
            </p>
            <div class="mt-2">
              <NuxtLink :to="platformUrl('/cursos')" :class="curStatus === 'done' ? btnOutline : btnPrimary">
                {{ ctaLabel }} <ArrowRight :size="18" />
              </NuxtLink>
            </div>
          </div>
          <div class="flex flex-col">
            <div v-for="[t, d, st] in cur.items" :key="t" class="flex items-center gap-3 border-b border-white/5 py-3.5">
              <component :is="ITEM_ICON[st][0]" v-if="loggedIn" :size="16" :class="ITEM_ICON[st][1]" />
              <span class="min-w-0 flex-1 text-[15px]">{{ t }}</span>
              <span class="font-inconsolata text-[13px] text-white/55">{{ d }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CURSOS -->
    <section id="cursos" class="border-t border-white/5">
      <div class="container py-[clamp(80px,10vw,144px)]">
        <div class="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div :class="eyebrow">
              Cursos
            </div>
            <h2 :class="h2">
              Últimos cursos lanzados
            </h2>
          </div>
          <NuxtLink :to="platformUrl('/cursos')" class="flex items-center gap-1.5 text-[15px] font-medium text-white hover:text-bta-pink">
            Ver catálogo de cursos <ArrowRight :size="16" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-x-5 gap-y-6">
          <HomeCourseCard v-for="c in courses" :key="c.slug" :course="c" />
        </div>
      </div>
    </section>

    <!-- ESPECIALIDADES -->
    <section id="especialidades" class="border-t border-white/5">
      <div class="container grid items-start gap-x-20 gap-y-10 py-[clamp(80px,10vw,144px)] lg:grid-cols-3">
        <div>
          <div :class="eyebrow">
            Especialidades
          </div>
          <h2 :class="h2">
            Comienza tu carrera en Ciberseguridad
          </h2>
          <p class="mt-5 max-w-[400px] text-pretty leading-relaxed text-white/75">
            Áreas de aprendizaje que te ayudarán a cumplir los objetivos que te propongas en el mundo de la ciberseguridad.
          </p>
        </div>
        <div class="border-t border-gray-border lg:col-span-2">
          <NuxtLink
            v-for="[t, meta] in specs"
            :key="t"
            to="/especialidades"
            class="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 border-b border-gray-border py-6 lg:grid-cols-[minmax(0,1fr)_auto_40px]"
          >
            <span class="font-oswald text-[clamp(22px,2.2vw,30px)] font-medium uppercase leading-tight tracking-[.01em] transition-colors duration-200 group-hover:text-bta-pink">{{ t }}</span>
            <span class="text-sm text-white/55">{{ meta }}</span>
            <span class="hidden justify-end transition-all duration-200 group-hover:translate-x-1 group-hover:text-bta-pink lg:flex"><ArrowRight :size="20" /></span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- OPINIONES -->
    <section v-if="opinions?.length" id="opiniones" class="border-t border-white/5">
      <div class="container py-[clamp(80px,10vw,144px)]">
        <div class="mb-12">
          <div :class="eyebrow">
            Opiniones
          </div>
          <h2 :class="h2">
            Conoce las opiniones de nuestros estudiantes
          </h2>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          <figure v-for="r in opinions" :key="r.id" class="flex flex-col gap-6 rounded-lg border border-gray-border bg-bta-section p-7">
            <div class="flex gap-1" :aria-label="`${r.evaluation} de 5 estrellas`">
              <Star v-for="i in 5" :key="i" :size="16" :class="i <= r.evaluation ? 'text-bta-pink' : 'text-white/25'" />
            </div>
            <blockquote class="flex-1 text-pretty leading-relaxed text-white/75">
              “{{ r.opinion }}”
            </blockquote>
            <figcaption class="flex flex-col gap-1 border-t border-white/5 pt-5">
              <span class="text-[15px] font-semibold">{{ r.user.name }}</span>
              <span class="text-[13px] text-white/55">{{ r.course.titulo }}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- PLANES -->
    <section v-if="plans.length" id="planes" class="border-t border-white/5">
      <div class="container py-[clamp(80px,10vw,144px)]">
        <div class="mb-12">
          <div :class="eyebrow">
            Planes Pro
          </div>
          <h2 :class="h2">
            Conviértete en un <span class="text-bta-pink">Hacker profesional</span>
          </h2>
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
            <NuxtLink :to="platformUrl('/suscripciones')" :class="activePlan === p.id ? btnPrimary : btnOutline">
              Comprar plan
            </NuxtLink>
          </div>
        </div>
        <p class="mt-6 max-w-[820px] text-[13px] leading-relaxed text-white/55">
          Importante: si tu pago recurrente está activado, las suscripciones no tienen derecho a reembolso. Cualquier duda, contáctanos a <a href="mailto:contacto@backtrackacademy.com" class="text-bta-pink hover:underline">contacto@backtrackacademy.com</a>.
        </p>
      </div>
    </section>

    <!-- CTA -->
    <section class="border-t border-white/5">
      <div class="container flex flex-wrap items-end justify-between gap-10 py-[clamp(96px,12vw,176px)]">
        <h2 class="max-w-[820px] text-balance font-oswald text-[clamp(40px,5.6vw,84px)] font-semibold uppercase leading-[.98]">
          Recibe orientación y apoyo de nuestros <span class="text-bta-pink">mentores</span>
        </h2>
        <NuxtLink :to="platformUrl('/crear-cuenta')" :class="btnPrimary">
          Regístrate ahora <ArrowRight :size="18" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
