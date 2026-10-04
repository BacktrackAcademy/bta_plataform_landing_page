<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { PublicDiscussionCard } from '~/interfaces/public'
import { CheckCircle2, MessageCircle } from 'lucide-vue-next'

defineProps<{
  title: string
  intro: string
  discussions: PublicDiscussionCard[]
  categories: { slug: string, name: string, discussions_count: number }[]
  activeCategory?: string
  pagination?: { current_page: number, total_pages: number }
  pageTo: (page: number) => RouteLocationRaw
  crumbs: { name: string, to?: string }[]
}>()

const { signupUrl } = useAppLinks()
const sideLink = 'flex items-center justify-between gap-3 rounded px-2.5 py-1.5 text-[13px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink'
const sideOn = 'bg-bta-pink/15 text-white'
const sideOff = 'text-white/60 hover:bg-white/5 hover:text-white'
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue font-inconsolata text-white">
    <CyberBackground variant="exploit" intensity="faint" glow="right" />
    <div class="container pb-[clamp(72px,9vw,128px)] pt-10">
      <CatalogBreadcrumbs :items="crumbs" />
      <header class="mt-10 flex max-w-[1000px] flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div class="max-w-[760px]">
          <p class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink">
            Debates
          </p>
          <h1 class="mt-4 text-balance font-oswald text-[clamp(36px,5vw,70px)] font-semibold uppercase leading-[.98]">
            {{ title }}
          </h1>
          <p class="font-plex mt-6 max-w-[600px] text-pretty text-lg leading-relaxed text-white/75">
            {{ intro }}
          </p>
        </div>
        <a :href="signupUrl('/debates')" class="inline-flex h-12 items-center rounded-md bg-[#D60E6A] px-6 font-medium text-white transition-colors hover:bg-[#B80C5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink">Hacer una pregunta</a>
      </header>

      <!-- móvil: categorías en una línea con scroll -->
      <CatalogCategoryNav
        v-if="categories.length"
        class="lg:hidden"
        :items="categories.map(c => ({ slug: c.slug, name: c.name, count: c.discussions_count }))"
        all-to="/debates"
        base-path="/debates/categoria"
        :active="activeCategory"
      />

      <div class="mt-10 grid gap-x-10 gap-y-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <!-- MENÚ LATERAL: cada categoría es una URL propia -->
        <aside v-if="categories.length" aria-label="Categorías de debates" class="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <nav class="flex flex-col gap-5">
            <NuxtLink to="/debates" :class="[sideLink, !activeCategory ? sideOn : sideOff]" :aria-current="!activeCategory ? 'page' : undefined">
              <span class="font-medium">Todos los debates</span>
            </NuxtLink>
            <div class="border-t border-white/10 pt-4">
              <p class="font-oswald text-sm uppercase tracking-wide text-white">
                <span class="text-bta-pink" aria-hidden="true">./</span>Categorías
              </p>
              <ul class="mt-3 flex flex-col gap-0.5">
                <li v-for="c in categories" :key="c.slug">
                  <NuxtLink :to="`/debates/categoria/${c.slug}`" :class="[sideLink, activeCategory === c.slug ? sideOn : sideOff]" :aria-current="activeCategory === c.slug ? 'page' : undefined">
                    <span>{{ c.name }}</span><span class="text-white/35">{{ c.discussions_count }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        <div class="min-w-0">
          <ul v-if="discussions.length" class="flex flex-col gap-3">
            <li v-for="d in discussions" :key="d.slug">
              <NuxtLink
                :to="`/debate/${d.slug}`"
                class="gc group grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-3 rounded-lg border border-[#262a47] bg-[#12152b] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-bta-pink/50 hover:shadow-[0_8px_30px_-12px_rgba(236,16,117,.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink"
              >
                <span class="min-w-0">
                  <span v-if="d.category" class="inline-block rounded bg-bta-pink/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-bta-pink">{{ d.category.name }}</span>
                  <span class="mt-2 block text-balance font-oswald text-[clamp(19px,1.8vw,24px)] font-medium uppercase leading-tight tracking-wide transition-colors group-hover:text-bta-pink">{{ d.title }}</span>
                  <span v-if="d.excerpt" class="mt-2 line-clamp-2 block font-plex text-[14px] leading-relaxed text-white/55">{{ d.excerpt }}</span>
                  <span v-if="d.author" class="mt-4 flex items-center gap-2.5 text-[13px] text-white/60">
                    <span class="gc-av size-7">
                      <img v-if="d.author.avatar_url" :src="d.author.avatar_url" alt="" width="28" height="28" loading="lazy" class="gc-avimg">
                      <span v-else class="gc-avimg grid place-items-center text-xs font-bold text-white">{{ d.author.name.charAt(0) }}</span>
                      <span class="gc-avtint" />
                      <span class="gc-avscan" />
                    </span>
                    <span class="truncate text-white/80">{{ d.author.name }}</span>
                    <span class="text-white/30">·</span>
                    <time :datetime="d.created_at">{{ formatDate(d.created_at) }}</time>
                  </span>
                </span>
                <span class="flex flex-col items-end gap-2 pt-1 text-sm">
                  <span class="flex items-center gap-1.5 text-white/60"><MessageCircle :size="16" /> {{ d.answers_count }}</span>
                  <span v-if="d.resolved" class="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 :size="14" /> Resuelta</span>
                </span>
              </NuxtLink>
            </li>
          </ul>
          <p v-else class="text-white/60">
            Todavía no hay debates en esta categoría.
          </p>

          <CatalogPagination v-if="pagination" :page="pagination.current_page" :total-pages="pagination.total_pages" :to="pageTo" />
        </div>
      </div>
    </div>
  </div>
</template>
