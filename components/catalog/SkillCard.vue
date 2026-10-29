<script setup lang="ts">
import type { SkillCard } from '~/interfaces/skills'
import { CalendarDays, Download, Heart, Star } from 'lucide-vue-next'

defineProps<{ skill: SkillCard }>()
</script>

<template>
  <article class="group relative flex flex-col rounded-lg border border-[#262a47] bg-[#12152b] p-4 font-inconsolata text-white transition-colors duration-200 hover:border-bta-pink/50 focus-within:border-bta-pink/50">
    <div class="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider">
      <span class="rounded bg-bta-pink/15 px-2 py-0.5 font-bold text-bta-pink">{{ skill.category.name }}</span>
      <span class="rounded border border-white/15 px-2 py-0.5 text-white/65">{{ RESOURCE_TYPE_LABELS[skill.resource_type] }}</span>
      <span v-if="skill.featured" class="ml-auto text-white/55">Destacada</span>
    </div>

    <h3 class="mt-3 text-balance font-oswald text-[19px] font-medium uppercase leading-tight tracking-wide">
      <!-- El enlace cubre toda la tarjeta (::after) sin anidar enlaces. -->
      <NuxtLink :to="`/skills/${skill.slug}`" class="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-bta-pink focus-visible:outline-none">
        {{ skill.title }}
      </NuxtLink>
    </h3>
    <p class="mt-2 line-clamp-3 font-plex text-[13px] leading-snug text-white/60">
      {{ skill.summary }}
    </p>

    <ul v-if="skill.tools.length" class="mt-3 flex flex-wrap gap-1.5" aria-label="Compatibilidad">
      <li v-for="t in skill.tools" :key="t" class="rounded border border-white/10 px-1.5 py-0.5 text-[11px] text-white/60">
        {{ TOOL_LABELS[t] }}
      </li>
    </ul>

    <div class="mt-4 flex items-center gap-2.5">
      <span class="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-xs text-white/60">
        <img v-if="skill.author.avatar_url" :src="skill.author.avatar_url" alt="" width="28" height="28" loading="lazy" class="size-full object-cover">
        <template v-else>{{ skill.author.display_name.charAt(0) }}</template>
      </span>
      <span class="truncate text-[13px] text-white/80">{{ skill.author.display_name }}</span>
    </div>

    <div class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#262a47] pt-3 mt-4 text-[12px] text-white/55">
      <span v-if="skill.rating.count" class="flex items-center gap-1" :title="`${skill.rating.count} valoraciones`"><Star :size="13" class="text-bta-pink" /> {{ skill.rating.average }}</span>
      <span class="flex items-center gap-1" title="Descargas"><Download :size="13" /> {{ compactNumber(skill.downloads_count) }}</span>
      <span class="flex items-center gap-1" title="Guardadas"><Heart :size="13" /> {{ compactNumber(skill.favorites_count) }}</span>
      <span class="ml-auto flex items-center gap-1"><CalendarDays :size="13" /><time :datetime="skill.published_at ?? undefined">{{ formatDate(skill.published_at) }}</time></span>
    </div>
  </article>
</template>
