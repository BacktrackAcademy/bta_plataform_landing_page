<script setup lang="ts">
import type { SkillDetail, SkillReviews } from '~/interfaces/skills'
import { Check, Copy, Download, ExternalLink, Heart, Link2 } from 'lucide-vue-next'

const route = useRoute()
const abs = useSiteUrl()
const { loginUrl } = useAppLinks()
const apiBase = String(useRuntimeConfig().public.apiBaseUrl)
const slug = String(route.params.slug)
const path = `/skills/${slug}`

const { data } = await usePublicResource<SkillDetail>(() => `/skills/${encodeURIComponent(slug)}`)
const s = computed(() => data.value!)
// Valoraciones y comentarios (solo lectura): escribir requiere sesión y se hace en la app.
const { data: reviews } = await usePublicApi<SkillReviews>(() => `/skills/${encodeURIComponent(slug)}/reviews`)

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'skill', label: 'Skill' },
  { id: 'examples', label: 'Examples' },
  { id: 'versions', label: 'Versions' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'install', label: 'Instalación' },
] as const
type TabId = (typeof TABS)[number]['id']
const tab = ref<TabId>('overview')
const tabs = computed(() => TABS.filter(t => t.id !== 'examples' || s.value.examples.length))

onMounted(() => {
  const hash = route.hash.replace('#', '') as TabId
  if (tabs.value.some(t => t.id === hash))
    tab.value = hash
  // Visualización: best-effort, el servidor limita una por IP y hora.
  $fetch(`/public/skills/${encodeURIComponent(slug)}/view`, { baseURL: apiBase, method: 'POST' }).catch(() => {})
})

const downloadUrl = computed(() => `${apiBase}/public/skills/${encodeURIComponent(slug)}/download`)
const hasPackage = computed(() => s.value.files.some(f => f.content_type === 'application/zip'))
const authorPath = computed(() => (s.value.author.username ? `/skills/autor/${encodeURIComponent(s.value.author.username)}` : null))

const copied = ref<'content' | 'link' | null>(null)
let copiedTimer: ReturnType<typeof setTimeout> | undefined
async function copy(what: 'content' | 'link') {
  try {
    await navigator.clipboard.writeText(what === 'content' ? s.value.content : abs(path))
    copied.value = what
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => (copied.value = null), 2000)
  }
  catch { /* sin permiso de portapapeles: el contenido sigue visible en la pestaña Skill */ }
}
onBeforeUnmount(() => clearTimeout(copiedTimer))

const shareUrl = computed(() => encodeURIComponent(abs(path)))
const shareText = computed(() => encodeURIComponent(s.value.title))
const shareLinks = computed(() => [
  { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl.value}` },
  { name: 'X', href: `https://twitter.com/intent/tweet?url=${shareUrl.value}&text=${shareText.value}` },
  { name: 'WhatsApp', href: `https://wa.me/?text=${shareText.value}%20${shareUrl.value}` },
])

useSeo(() => ({
  title: `${s.value.title}: ${RESOURCE_TYPE_LABELS[s.value.resource_type]} de ${s.value.category.name}`,
  description: s.value.summary,
  path,
  type: 'article',
  publishedTime: s.value.published_at,
  modifiedTime: s.value.updated_at,
  jsonLd: [
    breadcrumbSchema(abs, [
      { name: 'Inicio', path: '/' },
      { name: 'Skills', path: '/skills' },
      { name: s.value.category.name, path: `/skills/categoria/${s.value.category.slug}` },
      { name: s.value.title, path },
    ]),
    skillSchema(abs, {
      path,
      name: s.value.title,
      description: s.value.summary,
      author: { name: s.value.author.display_name, path: authorPath.value },
      published: s.value.published_at,
      modified: s.value.updated_at,
      keywords: [s.value.category.name, ...s.value.tags.map(t => t.name), ...s.value.tools.map(t => TOOL_LABELS[t])],
      license: LICENSE_URLS[s.value.license],
      repository: s.value.github_url,
      version: s.value.version,
      rating: s.value.rating,
      downloads: s.value.downloads_count,
    }),
  ],
}))

const btn = 'inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-border px-4 text-sm text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink'
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue font-inconsolata text-white">
    <CyberBackground variant="scan" intensity="faint" glow="right" />
    <article class="container pb-[clamp(72px,9vw,128px)] pt-10">
      <CatalogBreadcrumbs
        :items="[
          { name: 'Inicio', to: '/' },
          { name: 'Skills', to: '/skills' },
          { name: s.category.name, to: `/skills/categoria/${s.category.slug}` },
          { name: s.title },
        ]"
      />

      <header class="mt-8 max-w-[960px]">
        <div class="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider">
          <NuxtLink :to="`/skills/categoria/${s.category.slug}`" class="rounded bg-bta-pink/15 px-2 py-0.5 font-bold text-bta-pink hover:bg-bta-pink/25">
            {{ s.category.name }}
          </NuxtLink>
          <span class="rounded border border-white/15 px-2 py-0.5 text-white/65">{{ RESOURCE_TYPE_LABELS[s.resource_type] }}</span>
          <span class="rounded border border-white/15 px-2 py-0.5 text-white/65">{{ DIFFICULTY_LABELS[s.difficulty] }}</span>
        </div>
        <h1 class="mt-4 text-balance font-oswald text-[clamp(32px,4.6vw,60px)] font-semibold uppercase leading-[1.1]">
          {{ s.title }}
        </h1>
        <p class="mt-5 max-w-[720px] text-pretty font-plex text-lg leading-relaxed text-white/75">
          {{ s.summary }}
        </p>

        <ul class="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60">
          <li class="flex items-center gap-2">
            <span class="grid size-7 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-xs">
              <img v-if="s.author.avatar_url" :src="s.author.avatar_url" alt="" width="28" height="28" class="size-full object-cover">
              <template v-else>{{ s.author.display_name.charAt(0) }}</template>
            </span>
            <NuxtLink v-if="authorPath" :to="authorPath" class="text-white hover:text-bta-pink">
              {{ s.author.display_name }}
            </NuxtLink>
            <span v-else class="text-white">{{ s.author.display_name }}</span>
          </li>
          <li><time :datetime="s.published_at ?? undefined">{{ formatDate(s.published_at) }}</time></li>
          <li>v{{ s.version }}</li>
          <li>{{ compactNumber(s.downloads_count) }} descargas</li>
          <li v-if="s.comments_count">
            {{ s.comments_count }} comentarios
          </li>
          <li v-if="s.rating.count">
            ★ {{ s.rating.average }} ({{ s.rating.count }})
          </li>
        </ul>
        <ul v-if="s.tools.length" class="mt-4 flex flex-wrap gap-1.5" aria-label="Compatibilidad">
          <li v-for="t in s.tools" :key="t" class="rounded border border-white/15 px-2 py-0.5 text-xs text-white/70">
            {{ TOOL_LABELS[t] }}
          </li>
        </ul>

        <div class="mt-7 flex flex-wrap gap-3">
          <button type="button" class="inline-flex h-10 items-center gap-2 rounded-md bg-[#D60E6A] px-4 text-sm font-medium text-white hover:bg-[#B80C5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink" @click="copy('content')">
            <component :is="copied === 'content' ? Check : Copy" :size="16" /> {{ copied === 'content' ? 'Copiado' : 'Copiar contenido' }}
          </button>
          <a :href="downloadUrl" rel="nofollow" :class="btn"><Download :size="16" /> Descargar{{ hasPackage ? ' paquete' : '' }}</a>
          <a :href="loginUrl(path)" rel="nofollow" :class="btn"><Heart :size="16" /> Guardar</a>
          <button type="button" :class="btn" @click="copy('link')">
            <component :is="copied === 'link' ? Check : Link2" :size="16" /> {{ copied === 'link' ? 'Enlace copiado' : 'Copiar enlace' }}
          </button>
        </div>
        <p class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/50">
          Compartir:
          <a v-for="l in shareLinks" :key="l.name" :href="l.href" target="_blank" rel="noopener noreferrer" class="text-white/70 hover:text-bta-pink">{{ l.name }}</a>
        </p>
      </header>

      <div class="mt-10" role="tablist" aria-label="Secciones de la skill">
        <div class="flex gap-1 overflow-x-auto border-b border-gray-border">
          <button
            v-for="t in tabs"
            :id="`tab-${t.id}`"
            :key="t.id"
            type="button"
            role="tab"
            :aria-selected="tab === t.id"
            :aria-controls="`panel-${t.id}`"
            class="whitespace-nowrap border-b-2 px-4 py-3 text-sm uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink"
            :class="tab === t.id ? 'border-bta-pink text-white' : 'border-transparent text-white/55 hover:text-white'"
            @click="tab = t.id"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <!-- Todos los paneles están en el HTML del servidor (indexable); solo se oculta el inactivo. -->
      <div class="mt-8 max-w-[960px]">
        <section id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" :hidden="tab !== 'overview'">
          <CatalogRichText v-if="s.description_html" :html="s.description_html" />
          <p v-else class="font-plex text-white/60">
            {{ s.summary }}
          </p>
          <template v-if="s.requirements_html">
            <h2 class="mt-10 font-oswald text-2xl uppercase">
              Requisitos
            </h2>
            <CatalogRichText class="mt-3" :html="s.requirements_html" />
          </template>
          <dl class="mt-10 grid gap-4 border-t border-gray-border pt-6 text-sm sm:grid-cols-3">
            <div>
              <dt class="text-white/45">
                Licencia
              </dt><dd>{{ LICENSE_LABELS[s.license] ?? s.license }}</dd>
            </div>
            <div v-if="s.tags.length">
              <dt class="text-white/45">
                Etiquetas
              </dt><dd>{{ s.tags.map(t => t.name).join(', ') }}</dd>
            </div>
            <div v-if="s.github_url">
              <dt class="text-white/45">
                Repositorio
              </dt>
              <dd><a :href="s.github_url" target="_blank" rel="noopener noreferrer nofollow" class="inline-flex items-center gap-1 text-bta-pink hover:underline">GitHub <ExternalLink :size="13" /></a></dd>
            </div>
          </dl>
        </section>

        <section id="panel-skill" role="tabpanel" aria-labelledby="tab-skill" :hidden="tab !== 'skill'">
          <CatalogRichText :html="s.content_html" />
        </section>

        <section v-if="s.examples.length" id="panel-examples" role="tabpanel" aria-labelledby="tab-examples" :hidden="tab !== 'examples'" class="space-y-10">
          <div v-for="(e, i) in s.examples" :key="i">
            <h2 class="font-oswald text-2xl uppercase">
              {{ e.title }}
            </h2>
            <p v-if="e.use_case" class="mt-2 font-plex text-white/70">
              {{ e.use_case }}
            </p>
            <p v-if="e.instructions" class="mt-2 whitespace-pre-line font-plex text-white/70">
              {{ e.instructions }}
            </p>
            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <div v-if="e.input_example">
                <p class="mb-1 text-xs uppercase tracking-wide text-white/45">
                  Entrada
                </p>
                <pre class="overflow-x-auto rounded-lg border border-gray-border bg-black/40 p-4 text-[13px]"><code>{{ e.input_example }}</code></pre>
              </div>
              <div v-if="e.output_example">
                <p class="mb-1 text-xs uppercase tracking-wide text-white/45">
                  Salida esperada
                </p>
                <pre class="overflow-x-auto rounded-lg border border-gray-border bg-black/40 p-4 text-[13px]"><code>{{ e.output_example }}</code></pre>
              </div>
            </div>
          </div>
        </section>

        <section id="panel-versions" role="tabpanel" aria-labelledby="tab-versions" :hidden="tab !== 'versions'">
          <ol class="space-y-5">
            <li v-for="v in s.versions" :key="v.version" class="border-l border-bta-pink/60 pl-4">
              <p class="font-oswald text-lg">
                v{{ v.version }} <time class="ml-2 font-inconsolata text-sm text-white/50" :datetime="v.created_at">{{ formatDate(v.created_at) }}</time>
              </p>
              <p v-if="v.changelog" class="mt-1 font-plex text-white/70">
                {{ v.changelog }}
              </p>
            </li>
          </ol>
        </section>

        <section id="panel-reviews" role="tabpanel" aria-labelledby="tab-reviews" :hidden="tab !== 'reviews'">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <p class="font-oswald text-3xl">
              {{ reviews?.rating.average ?? '—' }} <span class="font-inconsolata text-sm text-white/55">/ 5 · {{ reviews?.rating.count ?? 0 }} {{ reviews?.rating.count === 1 ? 'valoración' : 'valoraciones' }}</span>
            </p>
            <a :href="loginUrl(path)" rel="nofollow" :class="btn">Valorar o comentar</a>
          </div>
          <ul v-if="reviews?.rating.count" class="mt-4 space-y-1.5 text-sm" aria-label="Distribución de valoraciones">
            <li v-for="n in [5, 4, 3, 2, 1]" :key="n" class="flex items-center gap-3">
              <span class="w-6 text-white/60">{{ n }}★</span>
              <span class="h-2 flex-1 overflow-hidden rounded bg-white/10"><span class="block h-full bg-bta-pink" :style="{ width: `${((reviews.rating.distribution[String(n)] ?? 0) / reviews.rating.count) * 100}%` }" /></span>
              <span class="w-8 text-right text-white/50">{{ reviews.rating.distribution[String(n)] ?? 0 }}</span>
            </li>
          </ul>

          <h2 class="mt-10 font-oswald text-2xl uppercase">
            Comentarios ({{ reviews?.comments_count ?? 0 }})
          </h2>
          <p v-if="!reviews?.comments.data.length" class="mt-3 font-plex text-white/60">
            Aún no hay comentarios. Inicia sesión para ser la primera persona en comentar.
          </p>
          <!-- Texto plano de la comunidad: se escapa siempre ({{ }}), nunca v-html. -->
          <ul v-else class="mt-5 space-y-5">
            <li v-for="c in reviews.comments.data" :key="c.id" class="rounded-lg border border-gray-border bg-bta-section p-4">
              <p class="text-[13px] text-white/50">
                <span class="text-white/80">{{ c.author?.display_name ?? 'Comentario eliminado' }}</span> · <time :datetime="c.created_at">{{ formatDate(c.created_at) }}</time>
              </p>
              <p v-if="c.removed" class="mt-1 font-plex italic text-white/45">
                Este comentario fue eliminado.
              </p>
              <p v-else class="mt-1 whitespace-pre-line break-words font-plex text-white/80">
                {{ c.content }}
              </p>
              <ul v-if="c.replies?.length" class="mt-3 space-y-3 border-l border-white/10 pl-4">
                <li v-for="r in c.replies" :key="r.id">
                  <p class="text-[13px] text-white/50">
                    <span class="text-white/80">{{ r.author?.display_name ?? 'Comentario eliminado' }}</span> · <time :datetime="r.created_at">{{ formatDate(r.created_at) }}</time>
                  </p>
                  <p v-if="r.removed" class="font-plex italic text-white/45">
                    Este comentario fue eliminado.
                  </p>
                  <p v-else class="whitespace-pre-line break-words font-plex text-white/80">
                    {{ r.content }}
                  </p>
                </li>
              </ul>
            </li>
          </ul>
          <p v-if="reviews && reviews.comments.pagination.total_pages > 1" class="mt-4 text-sm text-white/50">
            Mostrando los comentarios más recientes. Inicia sesión para ver el resto.
          </p>
          <p class="mt-8 text-[13px] text-white/45">
            <a :href="loginUrl(`${path}?reportar=1`)" rel="nofollow" class="hover:text-bta-pink">Reportar contenido</a>
          </p>
        </section>

        <section id="panel-install" role="tabpanel" aria-labelledby="tab-install" :hidden="tab !== 'install'">
          <CatalogSkillInstallGuide :tools="s.tools" :resource-type="s.resource_type" :has-package="hasPackage" />
        </section>
      </div>

      <section v-if="s.related.length" class="mt-20" aria-label="Skills relacionadas">
        <h2 class="font-oswald text-2xl uppercase">
          <span class="text-bta-pink" aria-hidden="true">./</span>Más de {{ s.category.name }}
        </h2>
        <div class="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <CatalogSkillCard v-for="r in s.related" :key="r.slug" :skill="r" />
        </div>
      </section>
    </article>
  </div>
</template>
