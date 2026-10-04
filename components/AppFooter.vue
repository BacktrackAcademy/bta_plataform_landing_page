<script setup lang="ts">
import BTALogo from './icons/BTALogo.vue'
import Mail from './icons/Mail.vue'

const explore = [
  { name: 'Cursos', to: '/cursos' },
  { name: 'Especialidades', to: '/especialidades' },
  { name: 'Artículos', to: '/articulos' },
  { name: 'Debates', to: '/debates' },
  { name: 'Precios', to: '/precios' },
]
const academy = [
  { name: 'Nosotros', to: '/team' },
  { name: 'Patrocinios', to: '/sponsorship' },
  { name: 'Seguridad', to: '/security' },
  { name: 'Preguntas frecuentes', to: '/preguntas-frecuentes' },
  { name: 'Valida tu certificado', to: '/validate_certificate' },
]
const legal = [
  { name: 'Políticas de privacidad', to: '/privacy_policy' },
  { name: 'Términos de servicio', to: '/terms_of_use' },
]
const groups = [
  { title: 'Explora', links: explore },
  { title: 'Academia', links: academy },
  { title: 'Legal', links: legal },
]
const mails = ['contacto@backtrackacademy.com', 'ventas@backtrackacademy.com']
const socials = [
  { icon: 'lucide:facebook', href: 'https://www.facebook.com/BackTrackAcademy/', label: 'Facebook' },
  { icon: 'lucide:instagram', href: 'https://www.instagram.com/backtrackacademy/', label: 'Instagram' },
  { icon: 'lucide:linkedin', href: 'https://www.linkedin.com/company/backtrack-academy/', label: 'LinkedIn' },
]
const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative isolate overflow-hidden border-t border-white/10 bg-bta-dark-blue font-inconsolata">
    <CyberBackground variant="grid" intensity="faint" glow="left" />
    <div class="container pb-8 pt-14">
      <!-- barra de terminal -->
      <div class="mb-12 flex items-center gap-3 text-[13px] text-white/50">
        <span class="flex gap-1.5" aria-hidden="true">
          <i class="size-2.5 rounded-full bg-white/15" />
          <i class="size-2.5 rounded-full bg-white/15" />
          <i class="size-2.5 rounded-full bg-bta-pink/70" />
        </span>
        <span><span class="text-bta-pink">root@backtrack</span>:~$ ls -la /backtrack</span>
        <span class="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" aria-hidden="true" />
      </div>

      <div class="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.5fr]">
        <NuxtLink to="/" class="w-fit" aria-label="Backtrack Academy, inicio">
          <BTALogo />
        </NuxtLink>

        <nav v-for="g in groups" :key="g.title" :aria-label="g.title">
          <h3 class="font-oswald text-lg uppercase tracking-wide text-white">
            <span class="text-bta-pink" aria-hidden="true">./</span>{{ g.title }}
          </h3>
          <ul class="mt-5 flex flex-col gap-3 text-[15px]">
            <li v-for="l in g.links" :key="l.to">
              <NuxtLink :to="l.to" class="foot__link">
                {{ l.name }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div>
          <h3 class="font-oswald text-lg uppercase tracking-wide text-white">
            <span class="text-bta-pink" aria-hidden="true">./</span>Hablemos
          </h3>
          <ul class="mt-5 flex flex-col gap-3 text-[15px]">
            <li v-for="m in mails" :key="m">
              <a :href="`mailto:${m}`" class="foot__link flex items-center gap-2">
                <Mail class="shrink-0" />
                <span class="break-all">{{ m }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-14 flex flex-col gap-6 border-t border-white/10 pt-6 text-[13px] text-white/45 md:flex-row md:items-center md:justify-between">
        <p class="leading-relaxed">
          <span class="text-bta-pink">$</span> © {{ year }} Backtrack Academy · Av. Lib. O’Higgis #1302 70, Santiago, Chile · Todos los Derechos Reservados.<span class="foot__cursor" aria-hidden="true">█</span>
        </p>
        <div class="flex items-center gap-5">
          <span class="font-oswald uppercase tracking-wide text-white/60">Síguenos</span>
          <a v-for="s in socials" :key="s.icon" :href="s.href" target="_blank" rel="noopener" :aria-label="s.label" class="text-white/50 transition-colors hover:text-bta-pink">
            <Icon :name="s.icon" class="size-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
.foot__link {
  @apply relative text-white/55 transition-colors duration-200 hover:text-white;
}
.foot__link:not(.flex)::before {
  content: '>';
  @apply absolute -left-4 text-bta-pink opacity-0 transition-all duration-200 -translate-x-1;
}
.foot__link:not(.flex):hover::before {
  @apply opacity-100 translate-x-0;
}
.foot__cursor {
  @apply ml-1 text-bta-pink;
  animation: foot-blink 1.2s steps(2, start) infinite;
}
@keyframes foot-blink { to { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .foot__cursor { animation: none; } }
</style>
