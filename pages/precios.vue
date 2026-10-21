<script setup lang="ts">
import { ArrowRight, Check, Minus, Target, Ticket } from 'lucide-vue-next'

useSeo({
  title: 'Precios y planes',
  description: 'Planes de suscripción de Backtrack Academy: acceso a todos los cursos de ciberseguridad y hacking ético, oportunidades de examen, vouchers para especialidades y certificados.',
  path: '/precios',
})

const { signupUrl } = useAppLinks()
const { data: apiPlans } = await useAPI<Plan[]>('/landing/plans')
const plans = computed(() => (apiPlans.value?.length ? withFreePlan(apiPlans.value) : []))
const selected = ref<number | null>(null)
const active = computed(() => selected.value ?? plans.value.find(p => p.recommended)?.id)
const ctaUrl = (p: Plan) => signupUrl(planCtaPath(p))

// Compras únicas: oportunidades de examen y vouchers de especialidad (sin cambiar de plan).
interface Addon {
  id: number
  name: string
  kind: 'opportunities' | 'vouchers'
  price: number
  old_price: number
  discount_percent: number
  opportunities: number
  vouchers: number
}
const { data: apiAddons } = await useAPI<Addon[]>('/landing/addons')
const addonGroups = computed(() => [
  { key: 'opportunities', title: 'Oportunidades para exámenes', text: 'Cada examen que rindes al terminar un curso gasta una oportunidad.', cta: 'Comprar oportunidades', unit: ['oportunidad', 'oportunidades'] },
  { key: 'vouchers', title: 'Vouchers de especialidad', text: 'Un voucher te permite rendir el examen final de una especialidad.', cta: 'Comprar voucher', unit: ['voucher', 'vouchers'] },
].map(g => ({ ...g, items: (apiAddons.value ?? []).filter(a => a.kind === g.key) })).filter(g => g.items.length))
const addonUrl = (a: Addon) => signupUrl(`/suscripciones/extras?producto=${a.id}`)
const addonQty = (a: Addon) => (a.kind === 'vouchers' ? a.vouchers : a.opportunities) || 1
const fmt = (n: number) => n.toFixed(2).replace(/\.00$/, '').replace('.', ',')
const unitPrice = (a: Addon) => (addonQty(a) > 1 ? `USD ${fmt(a.price / addonQty(a))} c/u` : '')

// Precio de la unidad suelta de cada tipo: base para medir cuánto se ahorra al comprar el pack.
const singlePrice = computed(() => {
  const unit = (kind: Addon['kind']) => {
    const one = (apiAddons.value ?? []).find(a => a.kind === kind && addonQty(a) === 1)
    return one?.price ?? null
  }
  return { opportunities: unit('opportunities'), vouchers: unit('vouchers') }
})
// % de ahorro del pack frente a comprar la misma cantidad de a una.
const addonSaving = (a: Addon) => {
  const base = singlePrice.value[a.kind]
  const n = addonQty(a)
  return base && n > 1 ? Math.round((1 - a.price / n / base) * 100) : 0
}
const bestAddonId = (items: Addon[]) =>
  items.reduce<Addon | null>((best, a) => (addonSaving(a) > (best ? addonSaving(best) : 0) ? a : best), null)?.id ?? null

// Filas de la tabla comparativa: etiqueta + valor por plan (mismo orden que las tarjetas).
const rows = computed(() => {
  const perPlan = plans.value.map(p => planRows(p))
  return (perPlan[0] ?? []).map((r, i) => ({
    label: r.label,
    cells: perPlan.map(rows => ({ ok: rows[i].ok, text: rows[i].value ?? '' })),
  }))
})

const faqs = [
  { q: '¿Qué son las oportunidades y vouchers?', a: 'Las oportunidades son lo que te permite rendir exámenes al terminar un curso, cada examen rendido gasta una oportunidad. De igual forma el Voucher es lo que te permite rendir el examen final de especialidades.' },
  { q: '¿Cuáles son los métodos de pago?', a: 'El método de pago es a través de PayPal. Si estás en México y no tienes saldo en PayPal, contáctate con nosotros y te contamos sobre las alternativas de pago. Puedes usar Khipu/Payku/Webpay si estás en Chile.' },
  { q: '¿Qué son los cursos Premium?', a: 'Son cursos con contenidos mucho más avanzados. Los ingresos generados de estos cursos son usados para seguir mejorando la plataforma y la infrastructura. Los usuarios que ayuden a hacer crecer la comunidad tendrán acceso a funciones más avanzadas y beneficios.' },
]

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({ '@type': 'Question', 'name': f.q, 'acceptedAnswer': { '@type': 'Answer', 'text': f.a } })),
    }),
  }],
})

const eyebrow = 'font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink'
const btnPrimary = 'inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#D60E6A] px-6 font-medium text-white transition-colors duration-200 hover:bg-[#B80C5B] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink focus-visible:ring-offset-2 focus-visible:ring-offset-bta-dark-blue'
const btnOutline = 'inline-flex h-12 items-center justify-center gap-2 rounded-md border border-gray-border px-6 font-medium text-white transition-colors duration-200 hover:bg-white/5 active:translate-y-px'
</script>

<template>
  <div class="bg-bta-dark-blue font-inconsolata text-white">
    <!-- CABECERA + PLANES -->
    <section class="relative isolate">
      <CyberBackground variant="grid" intensity="faint" glow="right" />
      <div class="container pb-[clamp(64px,8vw,112px)] pt-10">
        <CatalogBreadcrumbs :items="[{ name: 'Inicio', to: '/' }, { name: 'Precios' }]" />
        <header class="mt-10 max-w-[760px]">
          <p :class="eyebrow">
            Planes Pro
          </p>
          <h1 class="mt-4 text-balance font-oswald text-[clamp(38px,5.4vw,76px)] font-semibold uppercase leading-[.98]">
            Conviértete en un <span class="text-bta-pink">hacker profesional</span>
          </h1>
          <p class="mt-6 max-w-[600px] text-pretty font-plex text-lg leading-relaxed text-white/75">
            Acceso a todos nuestros cursos, exámenes y certificados. Elige el plan que va con tu ritmo.
          </p>
        </header>

        <div v-if="plans.length" class="mt-14 grid gap-5 md:grid-cols-3">
          <div v-for="p in plans" :key="p.id" class="flex flex-col gap-3">
            <button
              type="button"
              class="flex flex-1 flex-col gap-6 rounded-lg border bg-[#12152b] p-6 text-left transition-all duration-200"
              :class="active === p.id ? 'border-bta-pink shadow-[0_8px_30px_-12px_rgba(236,16,117,.4)]' : 'border-[#262a47] hover:border-white/30'"
              :aria-pressed="active === p.id"
              @click="selected = p.id"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-oswald text-xl font-medium uppercase tracking-[.02em]">{{ p.name }}</span>
                <span v-if="p.recommended" class="rounded bg-bta-pink/15 px-2 py-0.5 text-xs font-medium text-bta-pink">Recomendado</span>
              </div>
              <div>
                <span class="text-4xl font-semibold">{{ p.free ? 'Gratis' : `USD ${p.price}` }}</span>
                <div class="mt-1.5 flex gap-2 text-[13px] text-white/55">
                  <span v-if="p.monthly_price">USD {{ p.monthly_price }} / mes</span>
                  <span v-if="p.price < p.old_price" class="text-emerald-400">Ahorra {{ p.discount_percent }}%</span>
                </div>
              </div>
              <ul class="flex flex-col gap-2.5 border-t border-white/10 pt-5 text-sm">
                <li v-for="[label, ok] in planFeatures(p)" :key="label" class="flex items-center gap-2.5" :class="ok ? 'text-white' : 'text-white/40'">
                  <Check v-if="ok" :size="16" class="shrink-0 text-bta-pink" />
                  <Minus v-else :size="16" class="shrink-0" />
                  {{ label }}
                </li>
              </ul>
            </button>
            <a :href="ctaUrl(p)" :class="active === p.id ? btnPrimary : btnOutline">
              {{ p.free ? 'Crear cuenta gratis' : 'Elegir plan' }}
            </a>
          </div>
        </div>
        <p v-else class="mt-14 text-white/60">
          No pudimos cargar los planes en este momento. Escríbenos a <a href="mailto:ventas@backtrackacademy.com" class="text-bta-pink hover:underline">ventas@backtrackacademy.com</a>.
        </p>

        <p class="mt-6 max-w-[820px] font-plex text-[13px] leading-relaxed text-white/55">
          Importante: si tu pago recurrente está activado, las suscripciones no tienen derecho a reembolso. Cualquier duda, contáctanos a <a href="mailto:contacto@backtrackacademy.com" class="text-bta-pink hover:underline">contacto@backtrackacademy.com</a>.
        </p>
      </div>
    </section>

    <!-- OPORTUNIDADES Y VOUCHERS -->
    <section v-if="addonGroups.length" id="oportunidades-y-vouchers" class="relative isolate border-t border-white/5">
      <div class="container py-[clamp(64px,8vw,112px)]">
        <p :class="eyebrow">
          Compra única
        </p>
        <h2 class="mt-3.5 text-balance font-oswald text-[clamp(28px,3.6vw,48px)] font-medium leading-[1.05]">
          Oportunidades y vouchers
        </h2>
        <p class="mt-4 max-w-[640px] font-plex text-white/70">
          ¿Te quedaste sin intentos o quieres rendir una especialidad? Compra solo lo que necesitas, sin cambiar de plan. Pago con PayPal.
        </p>
        <div v-for="g in addonGroups" :key="g.key" class="mt-12">
          <h3 class="font-oswald text-xl font-medium uppercase tracking-[.02em]">
            {{ g.title }}
          </h3>
          <p class="mt-1 font-plex text-sm text-white/55">
            {{ g.text }}
          </p>
          <div class="mt-6 grid gap-4 md:grid-cols-3">
            <div
              v-for="a in g.items"
              :key="a.id"
              class="relative flex flex-col gap-4 rounded-lg border bg-[#12152b] p-5 transition-all duration-200 hover:-translate-y-0.5"
              :class="bestAddonId(g.items) === a.id ? 'border-bta-pink shadow-[0_8px_30px_-12px_rgba(236,16,117,.4)]' : 'border-[#262a47] hover:border-white/30'"
            >
              <span v-if="bestAddonId(g.items) === a.id" class="absolute -top-2.5 right-4 rounded bg-bta-pink px-2 py-0.5 text-xs font-medium text-white">Mejor precio</span>
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <span class="flex size-10 shrink-0 items-center justify-center rounded-md bg-bta-pink/10 text-bta-pink">
                    <Target v-if="g.key === 'opportunities'" :size="20" />
                    <Ticket v-else :size="20" />
                  </span>
                  <div>
                    <span class="block font-oswald text-3xl font-semibold leading-none">{{ addonQty(a) }}</span>
                    <span class="mt-1 block font-oswald text-xs uppercase tracking-[.06em] text-white/60">{{ g.unit[addonQty(a) === 1 ? 0 : 1] }}</span>
                  </div>
                </div>
                <span class="whitespace-nowrap font-oswald text-2xl font-semibold">USD {{ a.price }}</span>
              </div>
              <div class="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
                  <span v-if="addonSaving(a) > 0" class="rounded bg-emerald-400/10 px-1.5 py-0.5 font-medium text-emerald-400">Ahorras {{ addonSaving(a) }}%</span>
                  <span v-else-if="a.price < a.old_price" class="rounded bg-emerald-400/10 px-1.5 py-0.5 font-medium text-emerald-400">Ahorra {{ a.discount_percent }}%</span>
                  <span class="text-white/55">{{ unitPrice(a) || 'Compra única' }}</span>
                </div>
                <a :href="addonUrl(a)" :class="[bestAddonId(g.items) === a.id ? btnPrimary : btnOutline, '!h-9 shrink-0 !px-4 !text-sm']">
                  Comprar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- COMPARATIVA -->
    <section v-if="plans.length" class="relative isolate border-t border-white/5">
      <CyberBackground variant="recon" intensity="faint" glow="left" />
      <div class="container py-[clamp(64px,8vw,112px)]">
        <p :class="eyebrow">
          Comparativa
        </p>
        <h2 class="mt-3.5 text-balance font-oswald text-[clamp(28px,3.6vw,48px)] font-medium leading-[1.05]">
          Qué incluye cada plan
        </h2>
        <div class="mt-10 overflow-x-auto rounded-lg border border-[#262a47] bg-[#12152b]">
          <table class="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-[#262a47]">
                <th scope="col" class="p-4 font-normal text-white/45">
                  <span class="sr-only">Beneficio</span>
                </th>
                <th v-for="p in plans" :key="p.id" scope="col" class="p-4 text-center font-oswald text-base font-medium uppercase tracking-wide" :class="p.recommended ? 'text-bta-pink' : 'text-white'">
                  {{ p.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in rows" :key="r.label" class="border-b border-[#262a47] last:border-0">
                <th scope="row" class="p-4 font-normal text-white/75">
                  {{ r.label }}
                </th>
                <td v-for="(c, i) in r.cells" :key="i" class="p-4 text-center">
                  <template v-if="c.ok">
                    <span v-if="c.text" class="text-white">{{ c.text }}</span>
                    <Check v-else :size="18" class="mx-auto text-bta-pink" />
                    <span class="sr-only"> incluido</span>
                  </template>
                  <template v-else>
                    <Minus :size="18" class="mx-auto text-white/25" />
                    <span class="sr-only">no incluido</span>
                  </template>
                </td>
              </tr>
              <tr>
                <th scope="row" class="p-4 font-normal text-white/75">
                  Precio
                </th>
                <td v-for="p in plans" :key="p.id" class="p-4 text-center text-white">
                  {{ p.free ? 'Gratis' : `USD ${p.price}` }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- PREGUNTAS FRECUENTES DE PRECIOS -->
    <section class="relative isolate border-t border-white/5">
      <CyberBackground variant="http" intensity="faint" glow="right" />
      <div class="container grid gap-x-16 gap-y-10 py-[clamp(64px,8vw,112px)] lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p :class="eyebrow">
            Dudas frecuentes
          </p>
          <h2 class="mt-3.5 text-balance font-oswald text-[clamp(28px,3.6vw,48px)] font-medium leading-[1.05]">
            Antes de elegir tu plan
          </h2>
          <NuxtLink to="/preguntas-frecuentes" class="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium transition-colors hover:text-bta-pink">
            Ver todas las preguntas <ArrowRight :size="16" />
          </NuxtLink>
        </div>
        <div class="border-t border-gray-border">
          <details v-for="f in faqs" :key="f.q" class="group border-b border-gray-border">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-oswald text-lg uppercase tracking-wide transition-colors hover:text-bta-pink">
              {{ f.q }}
              <span class="text-white/40 transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
            </summary>
            <p class="pb-5 font-plex leading-relaxed text-white/70">
              {{ f.a }}
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="relative isolate border-t border-white/5">
      <CyberBackground variant="prompt" intensity="normal" glow="center" mask="soft" />
      <div class="container flex flex-wrap items-end justify-between gap-10 py-[clamp(80px,10vw,144px)]">
        <h2 class="max-w-[820px] text-balance font-oswald text-[clamp(36px,5vw,72px)] font-semibold uppercase leading-[.98]">
          Empieza hoy tu camino en <span class="text-bta-pink">ciberseguridad</span>
        </h2>
        <a :href="signupUrl()" :class="btnPrimary">
          Empezar ahora <ArrowRight :size="18" />
        </a>
      </div>
    </section>
  </div>
</template>
