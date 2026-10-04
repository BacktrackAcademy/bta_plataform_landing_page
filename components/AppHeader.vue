<script setup lang="ts">
import { HamburgerAnimatedButton } from '#components'

const { loginUrl, signupUrl } = useAppLinks()
const route = useRoute()
const menuOpen = ref(false)

// Secciones del sitio público; las fichas (/curso/x, /articulo/x) marcan su sección como activa.
const links = [
  { name: 'Cursos', to: '/cursos', match: ['/cursos', '/curso'] },
  { name: 'Especialidades', to: '/especialidades', match: ['/especialidades', '/especialidad'] },
  { name: 'Artículos', to: '/articulos', match: ['/articulos', '/articulo', '/autor'] },
  { name: 'Precios', to: '/precios', match: ['/precios'] },
]

function isActive(match: string[]) {
  return match.some(m => route.path === m || route.path.startsWith(`${m}/`))
}

watch(() => route.fullPath, () => (menuOpen.value = false))
</script>

<template>
  <header class="relative z-50 h-20">
    <div class="fixed left-0 top-0 w-full border-b border-white/5 bg-bta-dark-blue">
      <nav class="container flex h-20 items-center gap-6" aria-label="Principal">
        <NuxtLink to="/" class="shrink-0" aria-label="Backtrack Academy, inicio">
          <img class="w-32" src="~/assets/logo.svg" alt="Backtrack Academy" width="128" height="32">
        </NuxtLink>

        <div class="ml-auto hidden items-center gap-8 font-oswald text-sm uppercase lg:flex">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="nav__link"
            :aria-current="isActive(link.match) ? 'page' : undefined"
            :class="{ 'is-active': isActive(link.match) }"
          >
            {{ link.name }}
          </NuxtLink>
          <a :href="loginUrl()" class="nav__link">Iniciar sesión</a>
          <a
            :href="signupUrl()"
            class="rounded-md bg-[#D60E6A] px-4 py-2 text-white transition-colors duration-200 hover:bg-[#B80C5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink focus-visible:ring-offset-2 focus-visible:ring-offset-bta-dark-blue"
          >
            Empezar ahora
          </a>
        </div>

        <HamburgerAnimatedButton :state="menuOpen" @toggle="menuOpen = !menuOpen" />
      </nav>
    </div>

    <div
      class="fixed left-0 top-20 z-40 h-[calc(100dvh-5rem)] w-full overflow-y-auto bg-bta-dark-blue transition-transform duration-300 lg:hidden"
      :class="menuOpen ? 'translate-y-0' : '-translate-y-[120%]'"
      :inert="!menuOpen"
    >
      <HamburgerMenu :links="links" @close="menuOpen = false" />
    </div>
  </header>
</template>

<style scoped>
.nav__link {
  @apply relative text-center text-white before:absolute before:bottom-0 before:left-0 before:block before:h-0.5 before:w-full before:origin-left before:scale-x-0 before:bg-bta-pink before:transition-transform hover:before:scale-x-100;
}
.nav__link.is-active {
  @apply before:scale-x-100;
}
</style>
