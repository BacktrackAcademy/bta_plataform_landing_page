<script setup lang="ts">
import type { PublicArticleCard } from '~/interfaces/public'

defineProps<{ article: PublicArticleCard }>()
</script>

<template>
  <NuxtLink
    :to="`/articulo/${article.slug}`"
    class="group flex flex-col gap-4 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink"
  >
    <div class="aspect-[16/9] overflow-hidden rounded-lg border border-white/5 bg-white/5">
      <img
        v-if="article.image_thumb_url || article.image_url"
        :src="article.image_thumb_url || article.image_url!"
        :alt="article.title"
        width="640"
        height="360"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      >
    </div>
    <div class="flex flex-col gap-2">
      <p class="font-inconsolata text-xs uppercase tracking-wide text-bta-pink">
        {{ article.category?.name }}
      </p>
      <h3 class="text-balance font-oswald text-2xl font-medium leading-tight transition-colors duration-200 group-hover:text-bta-pink">
        {{ article.title }}
      </h3>
      <p v-if="article.summary" class="line-clamp-2 text-pretty text-[15px] leading-relaxed text-white/70">
        {{ article.summary }}
      </p>
      <p class="text-[13px] text-white/50">
        <span v-if="article.author">{{ article.author.name }} · </span>
        <time :datetime="article.published_at">{{ formatDate(article.published_at) }}</time>
      </p>
    </div>
  </NuxtLink>
</template>
