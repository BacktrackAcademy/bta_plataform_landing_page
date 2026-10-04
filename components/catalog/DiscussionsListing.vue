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
const chip = 'inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink'
</script>

<template>
  <div class="bg-bta-dark-blue font-plex text-white">
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
          <p class="mt-6 max-w-[600px] text-pretty text-lg leading-relaxed text-white/75">
            {{ intro }}
          </p>
        </div>
        <a :href="signupUrl('/debates')" class="inline-flex h-12 items-center rounded-md bg-[#D60E6A] px-6 font-medium text-white transition-colors hover:bg-[#B80C5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink">Hacer una pregunta</a>
      </header>

      <nav v-if="categories.length" aria-label="Categorías" class="mt-10 flex flex-wrap gap-2">
        <NuxtLink to="/debates" :class="[chip, !activeCategory ? 'border-bta-pink bg-bta-pink/15' : 'border-gray-border hover:bg-white/5']" :aria-current="!activeCategory ? 'page' : undefined">
          Todos
        </NuxtLink>
        <NuxtLink
          v-for="c in categories"
          :key="c.slug"
          :to="`/debates/categoria/${c.slug}`"
          :class="[chip, activeCategory === c.slug ? 'border-bta-pink bg-bta-pink/15' : 'border-gray-border hover:bg-white/5']"
          :aria-current="activeCategory === c.slug ? 'page' : undefined"
        >
          {{ c.name }} <span class="ml-1.5 text-white/45">{{ c.discussions_count }}</span>
        </NuxtLink>
      </nav>

      <ul v-if="discussions.length" class="mt-10 max-w-[1000px] border-t border-gray-border">
        <li v-for="d in discussions" :key="d.slug" class="border-b border-gray-border">
          <NuxtLink :to="`/debate/${d.slug}`" class="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-2 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink">
            <span class="min-w-0">
              <span class="block font-inconsolata text-xs uppercase tracking-wide text-bta-pink">{{ d.category?.name }}</span>
              <span class="mt-1 block text-balance font-oswald text-[clamp(20px,2vw,26px)] font-medium leading-tight transition-colors group-hover:text-bta-pink">{{ d.title }}</span>
              <span v-if="d.excerpt" class="mt-2 line-clamp-2 block text-[15px] leading-relaxed text-white/60">{{ d.excerpt }}</span>
              <span class="mt-3 block text-[13px] text-white/45">
                <template v-if="d.author">{{ d.author.name }} · </template><time :datetime="d.created_at">{{ formatDate(d.created_at) }}</time>
              </span>
            </span>
            <span class="flex flex-col items-end gap-2 pt-1 text-sm">
              <span class="flex items-center gap-1.5 text-white/60"><MessageCircle :size="16" /> {{ d.answers_count }}</span>
              <span v-if="d.resolved" class="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 :size="14" /> Resuelta</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
      <p v-else class="mt-14 text-white/60">
        Todavía no hay debates en esta categoría.
      </p>

      <CatalogPagination v-if="pagination" :page="pagination.current_page" :total-pages="pagination.total_pages" :to="pageTo" />
    </div>
  </div>
</template>
