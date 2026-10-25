<script setup lang="ts">
import type { Paginated, PublicArticleCard, PublicCourseCard, PublicFilters } from '~/interfaces/public'

// Landing aprobada (lienzo «BTA Landing»): estructura, textos y estilos del prototipo con datos reales de la API.
definePageMeta({ layout: 'landing' })

useSeo({
  title: 'Cursos de hacking ético y ciberseguridad en español',
  description: 'Especialidades y cursos de hacking ético, pentesting y ciberseguridad en español, creados por profesionales de la industria. Empieza con cursos gratis y obtén certificado de aprobación.',
  path: '/',
})

const { signupUrl } = useAppLinks()

// Cada sección se oculta si su dato no llegó: una caída parcial de la API no rompe la home.
const { data: coursesRes } = usePublicApi<Paginated<PublicCourseCard>>('/courses', { query: { per_page: 100 } })
const { data: articlesRes } = usePublicApi<Paginated<PublicArticleCard>>('/articles', { query: { per_page: 4 } })
const { data: filters } = usePublicApi<PublicFilters>('/filters')
const { data: apiPlans } = useAPI<Plan[]>('/landing/plans')

const allCourses = computed(() => coursesRes.value?.data ?? [])
const coursesTotal = computed(() => coursesRes.value?.pagination.total_entries ?? allCourses.value.length)
const freeCourses = computed(() => allCourses.value.filter(c => c.is_free))
const articlesTotal = computed(() => articlesRes.value?.pagination.total_entries ?? 0)
const stats = computed(() => [
  { n: coursesTotal.value, label: 'cursos' },
  { n: freeCourses.value.length, label: 'cursos gratis' },
  { n: articlesTotal.value, label: 'artículos técnicos' },
].filter(s => s.n > 0))

// Cursos destacados. «Nuevos lanzamientos» solo muestra cursos marcados como próximos lanzamientos (`coming_soon`);
// si la API no entrega ninguno, la pestaña se oculta (sin reemplazarla por cursos antiguos) y la sección parte en «Más populares».
type Tab = 'nuevos' | 'populares' | 'gratis'
const tab = ref<Tab>('nuevos')
const launches = computed(() => allCourses.value.filter(c => c.coming_soon).slice(0, 2))
const popular = computed(() => [...allCourses.value].filter(c => !c.coming_soon).sort((a, b) => b.students_count - a.students_count).slice(0, 3))
const tabs = computed(() => ([
  { id: 'nuevos', label: 'Nuevos lanzamientos', list: launches.value },
  { id: 'populares', label: 'Más populares', list: popular.value },
  { id: 'gratis', label: 'Gratis', list: freeCourses.value.slice(0, 3) },
] as { id: Tab, label: string, list: PublicCourseCard[] }[]).filter(t => t.list.length))
const shown = computed(() => tabs.value.find(t => t.id === tab.value) ?? tabs.value[0])

// Artículos: el más reciente destacado y los tres siguientes; temáticas = categorías con más artículos.
const articles = computed(() => articlesRes.value?.data ?? [])
const featured = computed(() => articles.value[0])
const latest = computed(() => articles.value.slice(1, 4))
const topics = computed(() => [...(filters.value?.article_categories ?? [])].sort((a, b) => b.articles_count - a.articles_count).slice(0, 4))

// Planes: datos y beneficios desde la API y utils/plans (misma fuente que /precios).
const plans = computed(() => (apiPlans.value?.length ? withFreePlan(apiPlans.value) : []))
const money = (n: number) => n.toLocaleString('es-CL', { maximumFractionDigits: 2 })
// La API los llama «Plan mensual» / «Plan Anual»; en la tarjeta aprobada se leen «Pro · Mensual» / «Pro · Anual».
function planTitle(p: Plan) {
  const name = p.name.replace(/^plan\s+/i, '')
  return /pro/i.test(name) ? name : `Pro · ${name.charAt(0).toUpperCase()}${name.slice(1)}`
}
function planPer(p: Plan) {
  if (!p.months || p.months === 1)
    return '/ mes'
  return p.months === 12 ? '/ año' : `/ ${p.months} meses`
}
function planNote(p: Plan) {
  return p.months && p.months > 1 && p.monthly_price ? `Equivale a USD ${money(p.monthly_price)} / mes` : 'Se renueva cada mes'
}

const faqs = [
  { q: '¿Por qué debo registrarme?', a: 'Con un perfil en la plataforma puedes medir cuánto tiempo dedicas a estudiar y tus avances. Y si tienes cursos Premium podrás verlos por tiempo ilimitado.' },
  { q: '¿Qué son las oportunidades y los vouchers?', a: 'Las oportunidades te permiten rendir exámenes al terminar un curso: cada examen rendido usa una. El voucher te permite rendir el examen final de una especialidad.' },
  { q: '¿Cuáles son los métodos de pago?', a: 'El pago es a través de PayPal. Si estás en Chile puedes usar Khipu, Payku o Webpay. Si estás en México y no tienes saldo en PayPal, contáctanos y te contamos las alternativas.' },
  { q: '¿Habrá más cursos?', a: 'Sí. Estamos preparando nuevos cursos mientras seguimos mejorando la plataforma.' },
]
const openFaq = ref(0)

const strip = ['Pentesting', 'Aplicaciones web', 'Análisis de vulnerabilidades', 'Forense', 'Auditorías wireless', 'Seguridad de la información', 'Auditoría de redes', 'Pentesting móvil', 'Programación', 'Administración de servidores']
const charlieSizes = '(max-width: 640px) calc(100vw - 64px), (max-width: 920px) min(498px, calc(100vw - 96px)), min(498px, calc((min(100vw, 1200px) - 64px) * 0.4 - 32px))'
</script>

<template>
  <div>
    <!-- HERO -->
    <section id="inicio" class="hero">
      <div class="hero-grid" aria-hidden="true" />
      <div class="glow-r" aria-hidden="true" />
      <div class="glow-b" aria-hidden="true" />
      <div class="wrap rel">
        <h1 class="h1 bta-l-rise d1">
          Cursos de Hacking Ético y <em>Ciberseguridad Online</em>
        </h1>
        <p class="lead bta-l-rise d2">
          Aprende con cursos prácticos creados por profesionales de la industria. Comienza gratis y avanza a tu ritmo.
        </p>
        <div class="hero-cta bta-l-rise d3">
          <a :href="signupUrl()" class="btn btn-p">Crear cuenta gratis <span class="arr" aria-hidden="true">→</span></a>
          <NuxtLink to="/cursos" class="btn btn-o">
            Explorar cursos
          </NuxtLink>
        </div>
        <p v-if="freeCourses.length" class="hero-sub bta-l-rise d3">
          ¿Recién empiezas? <a href="#cursos" @click="tab = 'gratis'">Mira los cursos gratuitos →</a>
        </p>
        <div v-if="stats.length" class="stats bta-l-rise d4">
          <div v-for="s in stats" :key="s.label" class="stat">
            <b>{{ s.n }}</b><span>{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <div class="strip" aria-label="Temas que puedes estudiar">
      <div class="strip-label">
        Temas que puedes estudiar
      </div>
      <div class="track" aria-hidden="true">
        <span v-for="(t, i) in [...strip, ...strip]" :key="i"><i>./</i>{{ t }}</span>
      </div>
    </div>

    <!-- POR QUÉ -->
    <section id="por-que" class="sec isolate">
      <CyberBackground variant="recon" intensity="subtle" glow="left" />
      <div class="wrap">
        <div class="sec-head">
          <div>
            <div class="eyebrow">
              Por qué Backtrack Academy
            </div>
            <h2 class="h2">
              Una plataforma hecha solo para ciberseguridad
            </h2>
            <p class="lead">
              Todo el contenido está enfocado en seguridad informática y hacking ético. Sin relleno: lo que necesitas para formarte en serio.
            </p>
          </div>
        </div>
        <div class="vgrid">
          <div class="vcard">
            <div class="vico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /><path d="M9 12l2 2 4-4" /></svg>
            </div>
            <h3>Contenido especializado</h3>
            <p>Cursos y artículos centrados únicamente en seguridad informática, pentesting y hacking ético.</p>
          </div>
          <div class="vcard">
            <div class="vico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 17l6-6-6-6" /><path d="M12 19h8" /></svg>
            </div>
            <h3>Aprendizaje práctico</h3>
            <p>Aprendes haciendo, con ejemplos prácticos, y rindes un examen al terminar cada curso.</p>
          </div>
          <div class="vcard">
            <div class="vico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M18.5 14.5a6.5 6.5 0 0 1 3 5.5" /></svg>
            </div>
            <h3>Profesionales de la industria</h3>
            <p>Aprende de instructores que trabajan en ciberseguridad y comparten su experiencia real.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CURSOS DESTACADOS -->
    <section v-if="shown" id="cursos" class="sec isolate">
      <CyberBackground variant="grid" intensity="faint" glow="none" />
      <div class="wrap rel">
        <div class="sec-head">
          <div>
            <div class="eyebrow">
              Cursos
            </div>
            <h2 class="h2">
              Cursos destacados
            </h2>
            <p class="lead">
              Practica con laboratorios reales y aprende las técnicas que usan los profesionales: desde tu primera vulnerabilidad hasta ataques avanzados.
            </p>
          </div>
          <NuxtLink to="/cursos" class="btn btn-o">
            Ver los {{ coursesTotal }} cursos <span class="arr" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
        <div class="tabs" role="tablist" aria-label="Filtrar cursos">
          <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            role="tab"
            class="tab"
            :class="{ on: shown.id === t.id }"
            :aria-selected="shown.id === t.id"
            @click="tab = t.id"
          >
            {{ t.label }}
          </button>
        </div>
        <div class="cgrid" :class="{ two: shown.id === 'nuevos' }">
          <CatalogCourseCard v-for="c in shown.list" :key="c.slug" :course="c" />
        </div>
      </div>
    </section>

    <!-- ARTÍCULOS -->
    <section v-if="featured" id="articulos" class="sec sec-articulos isolate">
      <CyberBackground variant="http" intensity="subtle" glow="left" />
      <div class="wrap">
        <div class="sec-head">
          <div>
            <div class="eyebrow">
              Artículos
            </div>
            <h2 class="h2">
              Lo último de nuestra biblioteca técnica
            </h2>
            <p class="lead">
              Guías, análisis y casos prácticos escritos por la comunidad de Backtrack Academy. Conocimiento abierto, sin necesidad de cuenta.
            </p>
          </div>
          <NuxtLink to="/articulos" class="btn btn-o">
            Ver todos los artículos <span class="arr" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
        <div class="agrid">
          <NuxtLink :to="`/articulo/${featured.slug}`" class="feat">
            <div class="cover">
              <img v-if="featured.image_url" :src="featured.image_url" alt="" loading="lazy" decoding="async">
              <span v-if="featured.category" class="chip-tl tag tag-cat tag-solid">{{ featured.category.name }}</span>
            </div>
            <div class="feat-b">
              <div class="eyebrow eyebrow-meta">
                Más reciente · {{ formatDate(featured.published_at) }}
              </div>
              <h3 class="feat-t">
                {{ featured.title }}
              </h3>
              <p v-if="featured.summary" class="feat-s">
                {{ featured.summary }}
              </p>
              <div class="feat-foot">
                <span v-if="featured.author" class="by"><b>by:</b> {{ featured.author.name }}</span>
                <span class="link">Leer artículo <span aria-hidden="true">→</span></span>
              </div>
            </div>
          </NuxtLink>
          <div>
            <div class="alist">
              <NuxtLink v-for="a in latest" :key="a.slug" :to="`/articulo/${a.slug}`" class="aitem">
                <div class="cover">
                  <img v-if="a.image_thumb_url || a.image_url" :src="(a.image_thumb_url || a.image_url)!" alt="" loading="lazy" decoding="async">
                </div>
                <div>
                  <span v-if="a.category" class="tag tag-cat">{{ a.category.name }}</span>
                  <h3 class="ai-t">
                    {{ a.title }}
                  </h3>
                  <div class="ai-m">
                    {{ formatDate(a.published_at) }}<template v-if="a.author">
                      · <span class="ai-au">{{ a.author.name }}</span>
                    </template>
                  </div>
                </div>
              </NuxtLink>
            </div>
            <div v-if="topics.length" class="atopics" aria-label="Explorar por temática">
              <NuxtLink v-for="t in topics" :key="t.slug" :to="`/articulos/categoria/${t.slug}`">
                {{ t.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PLANES -->
    <section v-if="plans.length" id="planes" class="sec isolate">
      <CyberBackground variant="grid" intensity="faint" glow="none" />
      <div class="glow-r glow-planes" aria-hidden="true" />
      <div class="wrap rel">
        <div class="sec-head">
          <div>
            <div class="eyebrow">
              Planes
            </div>
            <h2 class="h2">
              Empieza gratis. Avanza más rápido con <span class="pink">Pro</span>
            </h2>
            <p class="lead">
              Comienza gratis con nuestros cursos de iniciación o accede al catálogo completo con nuestros planes de pago.
            </p>
          </div>
          <NuxtLink to="/precios" class="btn btn-o">
            Comparar planes <span class="arr" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
        <div class="pgrid">
          <div v-for="p in plans" :key="p.id" class="plan" :class="{ pro: p.recommended }">
            <div class="plan-k">
              <span>{{ p.free ? 'Free' : planTitle(p) }}</span>
              <span v-if="p.recommended" class="tag tag-rec">Recomendado</span>
            </div>
            <div>
              <div class="price">
                <b class="amt">{{ p.free ? '$0' : `USD ${money(p.price)}` }}</b><span v-if="!p.free" class="per">{{ planPer(p) }}</span>
              </div>
              <div class="price-note">
                {{ p.free ? 'Crea tu cuenta y empieza hoy' : planNote(p) }}
              </div>
            </div>
            <ul class="feats">
              <li v-for="[label, ok] in planFeatures(p)" :key="label" :class="{ off: !ok }">
                <svg v-if="ok" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec1075" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12" /></svg>
                {{ label }}
              </li>
            </ul>
            <a :href="signupUrl(planCtaPath(p))" class="btn plan-btn" :class="p.recommended ? 'btn-p' : 'btn-o'">
              <template v-if="p.free">Crear cuenta gratis</template>
              <template v-else>Elegir plan <span class="arr" aria-hidden="true">→</span></template>
            </a>
          </div>
        </div>
        <p class="note">
          Importante: si tu pago recurrente está activado, las suscripciones no tienen derecho a reembolso. Cualquier duda, escríbenos a <a href="mailto:contacto@backtrackacademy.com">contacto@backtrackacademy.com</a>.
        </p>
      </div>
    </section>

    <!-- PREGUNTAS FRECUENTES -->
    <section id="faq" class="sec isolate">
      <CyberBackground variant="topology" intensity="faint" glow="right" flip />
      <div class="wrap fgrid">
        <div>
          <div class="eyebrow">
            Preguntas frecuentes
          </div>
          <h2 class="h2">
            Lo que necesitas saber antes de empezar
          </h2>
          <p class="lead">
            ¿Otra duda? Escríbenos a <a href="mailto:contacto@backtrackacademy.com" class="pink">contacto@backtrackacademy.com</a>
          </p>
        </div>
        <div class="faq">
          <div v-for="(f, i) in faqs" :key="f.q" class="faq-i">
            <button type="button" class="faq-q" :aria-expanded="openFaq === i" @click="openFaq = openFaq === i ? -1 : i">
              {{ f.q }}
              <svg class="chev" :class="{ open: openFaq === i }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <p v-if="openFaq === i" class="faq-a">
              {{ f.a }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL CON CHARLIE -->
    <section id="registro" class="sec sec-cta isolate">
      <CyberBackground variant="prompt" intensity="normal" glow="center" mask="soft" />
      <div class="wrap">
        <div class="cta">
          <div class="cta-bg" aria-hidden="true" />
          <div class="cta-txt">
            <div class="eyebrow">
              Tu siguiente paso
            </div>
            <h2 class="cta-t">
              Empieza hoy tu camino en <em>ciberseguridad</em>
            </h2>
            <p class="lead cta-lead">
              Crea tu cuenta gratis y comienza con los cursos de iniciación.
            </p>
            <div class="cta-btns">
              <a :href="signupUrl()" class="btn btn-p">Crear mi cuenta <span class="arr" aria-hidden="true">→</span></a>
              <NuxtLink to="/cursos" class="btn btn-o">
                Explorar cursos
              </NuxtLink>
            </div>
          </div>
          <figure class="charlie">
            <img
              src="/landing/charlie-1000.webp"
              srcset="/landing/charlie-760.webp 760w, /landing/charlie-1000.webp 1000w, /landing/charlie-1513.webp 1513w"
              :sizes="charlieSizes"
              alt="Charlie, la mascota de Backtrack Academy, con audífonos y lentes, trabajando en su laptop junto a una taza BTA_"
              width="498"
              height="342"
              loading="lazy"
              decoding="async"
            >
          </figure>
        </div>
      </div>
    </section>
  </div>
</template>
