<script setup lang="ts">
import type { PublicArticleCard } from '~/interfaces/public'
import { CalendarDays } from 'lucide-vue-next'

defineProps<{ article: PublicArticleCard }>()
</script>

<template>
  <NuxtLink
    :to="`/articulo/${article.slug}`"
    class="group flex flex-col overflow-hidden rounded-lg border border-[#262a47] bg-[#12152b] font-inconsolata text-white shadow-[0_0_0_1px_rgba(0,0,0,.2)] transition-all duration-200 hover:-translate-y-0.5 hover:border-bta-pink/50 hover:shadow-[0_8px_30px_-12px_rgba(236,16,117,.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink"
  >
    <div class="relative aspect-[16/8] overflow-hidden border-b border-[#262a47] bg-[#0b0d1f]">
      <img
        v-if="article.image_thumb_url || article.image_url"
        :src="article.image_thumb_url || article.image_url!"
        :alt="article.title"
        width="640"
        height="320"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover opacity-80 transition duration-300 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-[#12152b] via-[#12152b]/30 to-transparent" />
      <span
        v-if="article.category"
        class="absolute left-3 top-3 rounded bg-black/55 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-bta-pink backdrop-blur-sm"
      >
        {{ article.category.name }}
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4">
      <h3 class="text-balance font-oswald text-[19px] font-medium uppercase leading-tight tracking-wide transition-colors duration-200 group-hover:text-bta-pink">
        {{ article.title }}
      </h3>

      <div v-if="article.author" class="flex items-center gap-2.5">
        <img
          v-if="article.author.avatar_url"
          :src="article.author.avatar_url"
          alt=""
          width="24"
          height="24"
          loading="lazy"
          class="size-6 rounded-full object-cover ring-1 ring-bta-pink/60"
        >
        <span v-else class="grid size-6 place-items-center rounded-full bg-bta-pink/20 text-[11px] font-bold text-bta-pink ring-1 ring-bta-pink/60">
          {{ article.author.name.charAt(0) }}
        </span>
        <span class="truncate text-[13px] text-white/80">{{ article.author.name }}</span>
      </div>

      <p v-if="article.summary" class="line-clamp-2 text-[13px] leading-snug text-white/50">
        {{ article.summary }}
      </p>

      <div class="mt-auto flex items-center gap-1.5 border-t border-[#262a47] pt-3 text-[12px] text-white/55">
        <CalendarDays :size="14" />
        <time :datetime="article.published_at">{{ formatDate(article.published_at) }}</time>
      </div>
    </div>
  </NuxtLink>
</template>
