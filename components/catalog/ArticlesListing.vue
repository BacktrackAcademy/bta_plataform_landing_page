<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { PublicArticleCard } from '~/interfaces/public'

const props = defineProps<{
  title: string
  intro: string
  articles: PublicArticleCard[]
  categories: { slug: string, name: string, articles_count: number }[]
  activeCategory?: string
  pagination?: { current_page: number, total_pages: number }
  pageTo: (page: number) => RouteLocationRaw
  crumbs: { name: string, to?: string }[]
}>()

const featured = computed(() => (props.pagination?.current_page === 1 ? props.articles[0] : undefined))
const rest = computed(() => (featured.value ? props.articles.slice(1) : props.articles))
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue font-inconsolata text-white">
    <CyberBackground variant="http" intensity="faint" glow="right" />
    <div class="container pb-[clamp(72px,9vw,128px)] pt-10">
      <CatalogBreadcrumbs :items="crumbs" />
      <header class="mt-10 max-w-[760px]">
        <p class="font-oswald text-xs font-medium uppercase tracking-[.12em] text-bta-pink">
          Artículos
        </p>
        <h1 class="mt-4 text-balance font-oswald text-[clamp(38px,5.4vw,76px)] font-semibold uppercase leading-[.98]">
          {{ title }}
        </h1>
        <p class="font-plex mt-6 max-w-[600px] text-pretty text-lg leading-relaxed text-white/75">
          {{ intro }}
        </p>
      </header>

      <CatalogCategoryNav
        v-if="categories.length"
        :items="categories.map(c => ({ slug: c.slug, name: c.name, count: c.articles_count }))"
        all-to="/articulos"
        base-path="/articulos/categoria"
        :active="activeCategory"
      />

      <template v-if="articles.length">
        <NuxtLink
          v-if="featured"
          :to="`/articulo/${featured.slug}`"
          class="group mt-12 grid items-center gap-x-10 gap-y-6 border-b border-gray-border pb-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink lg:grid-cols-2"
        >
          <div class="aspect-[16/9] overflow-hidden rounded-lg border border-white/5 bg-white/5">
            <img v-if="featured.image_url || featured.image_thumb_url" :src="(featured.image_url || featured.image_thumb_url)!" :alt="featured.title" width="960" height="540" fetchpriority="high" decoding="async" class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]">
          </div>
          <div>
            <p class="font-inconsolata text-xs uppercase tracking-wide text-bta-pink">
              {{ featured.category?.name }}
            </p>
            <h2 class="mt-3 text-balance font-oswald text-[clamp(28px,3.4vw,44px)] font-medium leading-[1.05] transition-colors group-hover:text-bta-pink">
              {{ featured.title }}
            </h2>
            <p v-if="featured.summary" class="font-plex mt-4 line-clamp-3 text-pretty leading-relaxed text-white/70">
              {{ featured.summary }}
            </p>
            <p class="mt-5 text-[13px] text-white/50">
              <span v-if="featured.author">{{ featured.author.name }} · </span><time :datetime="featured.published_at">{{ formatDate(featured.published_at) }}</time>
            </p>
          </div>
        </NuxtLink>
        <div class="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <CatalogArticleCard v-for="a in rest" :key="a.slug" :article="a" />
        </div>
        <CatalogPagination v-if="pagination" :page="pagination.current_page" :total-pages="pagination.total_pages" :to="pageTo" />
      </template>
      <p v-else class="mt-14 text-white/60">
        Todavía no hay artículos en esta categoría.
      </p>
    </div>
  </div>
</template>
