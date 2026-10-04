<script setup lang="ts">
import { Award, FileText, MessageCircle } from 'lucide-vue-next'

// Perfil público (/@usuario): mismas rutas que Rails para conservar el SEO. Privados = 404 idéntico a un usuario inexistente.
interface Profile {
  username: string
  full_name: string
  headline: string | null
  aboutme: string | null
  avatar_url: string | null
  role_label: string | null
  verified: boolean | null
  indexable: boolean
  stats: { ranking: number | null, certificates: number, articles: number, questions: number, courses_taught: number, followers: number }
  specialties: string[]
  links: Record<string, string>
  activity: {
    articles: { title: string, slug: string, category: string | null }[]
    courses: { title: string, slug: string }[]
    questions: { title: string, slug: string, answers: number }[]
  }
}

const route = useRoute()
const abs = useSiteUrl()
const username = String(route.params.username)
const { data, error } = await useAPI<Profile>(`/profile/${encodeURIComponent(username)}`)
if (error.value || !data.value)
  throw createError({ statusCode: error.value?.statusCode === 404 ? 404 : 503, statusMessage: error.value?.statusCode === 404 ? 'No encontrado' : 'Servicio no disponible', fatal: true })

const p = computed(() => data.value!)
const path = `/@${p.value.username}`
const links = computed(() => Object.entries(p.value.links ?? {}).filter(([, u]) => /^https?:\/\//i.test(u)))

// Solo perfiles que el usuario hizo públicos Y aceptó aparecer en buscadores (`indexable`) se indexan.
useSeo(() => ({
  title: `${p.value.full_name}${p.value.headline ? `: ${p.value.headline}` : ''}`,
  description: p.value.aboutme?.slice(0, 200) || `Perfil de ${p.value.full_name} en Backtrack Academy.`,
  path,
  image: p.value.avatar_url,
  type: 'profile',
  noindex: !p.value.indexable,
  jsonLd: p.value.indexable
    ? [profilePageSchema(abs, { path, name: p.value.full_name, headline: p.value.headline, description: p.value.aboutme?.slice(0, 300), image: p.value.avatar_url, sameAs: links.value.map(([, u]) => u) })]
    : null,
}))
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue font-inconsolata text-white">
    <CyberBackground variant="topology" intensity="faint" glow="right" />
    <div class="container pb-[clamp(72px,9vw,128px)] pt-16">
      <header class="flex flex-col gap-6 sm:flex-row sm:items-start">
        <span class="grid size-24 shrink-0 place-items-center overflow-hidden rounded-full border border-gray-border bg-bta-section font-oswald text-3xl text-white/50">
          <img v-if="p.avatar_url" :src="p.avatar_url" :alt="p.full_name" width="96" height="96" class="size-full object-cover">
          <template v-else>{{ initials(p.full_name) }}</template>
        </span>
        <div class="max-w-[760px]">
          <p v-if="p.role_label" class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink">
            {{ p.role_label }}
          </p>
          <h1 class="mt-2 text-balance font-oswald text-[clamp(32px,4.6vw,56px)] font-semibold uppercase leading-[1]">
            {{ p.full_name }}
          </h1>
          <p v-if="p.headline" class="mt-3 text-lg text-white/70">
            {{ p.headline }}
          </p>
          <p v-if="p.aboutme" class="mt-5 max-w-[640px] whitespace-pre-line text-pretty leading-relaxed text-white/75">
            {{ p.aboutme }}
          </p>
          <ul class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-inconsolata text-sm text-white/60">
            <li v-if="p.stats.certificates" class="flex items-center gap-1.5">
              <Award :size="15" class="text-bta-pink" /> <span class="text-white">{{ p.stats.certificates }}</span> certificados
            </li>
            <li v-if="p.stats.articles" class="flex items-center gap-1.5">
              <FileText :size="15" class="text-bta-pink" /> <span class="text-white">{{ p.stats.articles }}</span> artículos
            </li>
            <li v-if="p.stats.questions" class="flex items-center gap-1.5">
              <MessageCircle :size="15" class="text-bta-pink" /> <span class="text-white">{{ p.stats.questions }}</span> preguntas
            </li>
            <li v-for="[key, url] in links" :key="key">
              <a :href="url" target="_blank" rel="noopener nofollow me" class="text-bta-pink capitalize hover:underline">{{ key }}</a>
            </li>
          </ul>
          <ul v-if="p.specialties.length" class="mt-5 flex flex-wrap gap-2">
            <li v-for="s in p.specialties" :key="s" class="rounded-full border border-gray-border px-3 py-1 text-xs text-white/70">
              {{ s }}
            </li>
          </ul>
        </div>
      </header>

      <section v-if="p.activity.courses.length" class="mt-16">
        <h2 class="font-oswald text-2xl font-medium">
          Cursos
        </h2>
        <ul class="mt-4 space-y-2">
          <li v-for="c in p.activity.courses" :key="c.slug">
            <NuxtLink :to="`/curso/${c.slug}`" class="hover:text-bta-pink">
              {{ c.title }}
            </NuxtLink>
          </li>
        </ul>
      </section>
      <section v-if="p.activity.articles.length" class="mt-12">
        <h2 class="font-oswald text-2xl font-medium">
          Artículos
        </h2>
        <ul class="mt-4 space-y-2">
          <li v-for="a in p.activity.articles" :key="a.slug">
            <NuxtLink :to="`/articulo/${a.slug}`" class="hover:text-bta-pink">
              {{ a.title }}
            </NuxtLink>
          </li>
        </ul>
      </section>
      <section v-if="p.activity.questions.length" class="mt-12">
        <h2 class="font-oswald text-2xl font-medium">
          Preguntas
        </h2>
        <ul class="mt-4 space-y-2">
          <li v-for="q in p.activity.questions" :key="q.slug">
            <NuxtLink :to="`/debate/${q.slug}`" class="hover:text-bta-pink">
              {{ q.title }}
            </NuxtLink>
            <span class="ml-2 text-xs text-white/45">{{ q.answers }} respuestas</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
