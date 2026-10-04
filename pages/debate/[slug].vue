<script setup lang="ts">
import type { PublicDiscussion } from '~/interfaces/public'
import { ArrowRight, CheckCircle2 } from 'lucide-vue-next'

const route = useRoute()
const abs = useSiteUrl()
const { signupUrl } = useAppLinks()
const slug = String(route.params.slug)

const { data } = await usePublicResource<PublicDiscussion>(() => `/discussions/${slug}`)
const d = computed(() => data.value!)
const path = `/debate/${slug}`

useSeo(() => ({
  title: d.value.title,
  description: d.value.excerpt || `Pregunta de la comunidad de Backtrack Academy${d.value.category ? ` sobre ${d.value.category.name}` : ''}, con ${d.value.answers_count} respuestas.`,
  path,
  type: 'article',
  publishedTime: d.value.created_at,
  modifiedTime: d.value.last_comment_at || d.value.updated_at,
  jsonLd: [
    breadcrumbSchema(abs, [
      { name: 'Inicio', path: '/' },
      { name: 'Debates', path: '/debates' },
      ...(d.value.category ? [{ name: d.value.category.name, path: `/debates/categoria/${d.value.category.slug}` }] : []),
      { name: d.value.title, path },
    ]),
    // QAPage solo si hay respuestas: Google lo exige para considerarlo válido.
    ...(d.value.answers.length
      ? [qaPageSchema(abs, {
          path,
          name: d.value.title,
          text: htmlToText(d.value.body_html),
          created: d.value.created_at,
          author: d.value.author?.name,
          answers: d.value.answers.map(a => ({ text: htmlToText(a.body_html), created: a.created_at, author: a.author?.name })),
        })]
      : []),
  ],
}))
</script>

<template>
  <div class="bg-bta-dark-blue font-plex text-white">
    <article class="container pb-[clamp(56px,7vw,96px)] pt-10">
      <CatalogBreadcrumbs
        :items="[
          { name: 'Inicio', to: '/' },
          { name: 'Debates', to: '/debates' },
          ...(d.category ? [{ name: d.category.name, to: `/debates/categoria/${d.category.slug}` }] : []),
          { name: d.title },
        ]"
      />
      <div class="mx-auto mt-10 max-w-[760px]">
        <header>
          <NuxtLink v-if="d.category" :to="`/debates/categoria/${d.category.slug}`" class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink hover:underline">
            {{ d.category.name }}
          </NuxtLink>
          <h1 class="mt-4 text-balance font-oswald text-[clamp(28px,4vw,48px)] font-semibold leading-[1.08]">
            {{ d.title }}
          </h1>
          <p class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/55">
            <span v-if="d.author" class="text-white/80">{{ d.author.name }}</span>
            <time :datetime="d.created_at">{{ formatDate(d.created_at) }}</time>
            <span v-if="d.resolved" class="flex items-center gap-1 text-emerald-400"><CheckCircle2 :size="14" /> Resuelta</span>
          </p>
        </header>

        <CatalogRichText v-if="d.body_html" :html="d.body_html" class="mt-8 prose-lg prose-img:rounded-lg prose-pre:overflow-x-auto" />
        <p v-if="d.course" class="mt-6 text-sm text-white/60">
          Relacionado con el curso
          <NuxtLink :to="`/curso/${d.course.slug}`" class="text-white underline-offset-4 hover:text-bta-pink hover:underline">
            {{ d.course.title }}
          </NuxtLink>
        </p>

        <section class="mt-14 border-t border-gray-border pt-10" aria-labelledby="respuestas">
          <h2 id="respuestas" class="font-oswald text-2xl font-medium">
            {{ d.answers.length }} {{ d.answers.length === 1 ? 'respuesta' : 'respuestas' }}
          </h2>
          <ol v-if="d.answers.length" class="mt-6 space-y-8">
            <li v-for="(a, i) in d.answers" :key="i" class="flex gap-4">
              <span class="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-gray-border bg-bta-section text-xs text-white/50">
                <img v-if="a.author?.avatar_url" :src="a.author.avatar_url" :alt="a.author.name" width="40" height="40" loading="lazy" class="size-full object-cover">
                <template v-else>{{ initials(a.author?.name) }}</template>
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-sm">
                  <span class="font-medium">{{ a.author?.name }}</span>
                  <time class="ml-2 text-white/45" :datetime="a.created_at">{{ formatDate(a.created_at) }}</time>
                </p>
                <CatalogRichText v-if="a.body_html" :html="a.body_html" class="mt-2 prose-pre:overflow-x-auto" />
              </div>
            </li>
          </ol>
          <p v-else class="mt-4 text-white/60">
            Aún no hay respuestas.
          </p>
        </section>

        <section class="mt-14 rounded-lg border border-gray-border bg-bta-section p-[clamp(24px,4vw,40px)]">
          <h2 class="text-balance font-oswald text-2xl font-medium leading-tight sm:text-3xl">
            ¿Quieres participar en la conversación?
          </h2>
          <p class="mt-3 text-white/65">
            Crea tu cuenta para responder, hacer tus propias preguntas y aprender con la comunidad.
          </p>
          <a :href="signupUrl('/debates')" class="mt-6 inline-flex h-12 items-center gap-2 rounded-md bg-[#D60E6A] px-6 font-medium text-white transition-colors hover:bg-[#B80C5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink">
            Unirme a la comunidad <ArrowRight :size="18" />
          </a>
        </section>
      </div>
    </article>
  </div>
</template>
