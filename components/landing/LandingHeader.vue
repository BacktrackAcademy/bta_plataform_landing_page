<script setup lang="ts">
// Header aprobado de la landing (lienzo «BTA Landing»): fijo con desenfoque y menú compacto bajo 920 px.
// Usa las rutas reales del sitio; las cuentas viven en la app autenticada.
const { loginUrl, signupUrl } = useAppLinks()
const route = useRoute()
const menuOpen = ref(false)

const links = [
  { name: 'Cursos', to: '/cursos' },
  { name: 'Artículos', to: '/articulos' },
  { name: 'Planes', to: '/precios' },
]

watch(() => route.fullPath, () => (menuOpen.value = false))
</script>

<template>
  <header class="hdr">
    <div class="wrap hdr-in">
      <NuxtLink to="/" aria-label="Backtrack Academy, inicio" class="hdr-logo">
        <img src="~/assets/logo.svg" alt="Backtrack Academy" width="124" height="47">
      </NuxtLink>
      <nav class="nav" aria-label="Principal">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to">
          {{ l.name }}
        </NuxtLink>
      </nav>
      <div class="hdr-cta">
        <a :href="loginUrl()">Iniciar sesión</a>
        <a :href="signupUrl()" class="btn btn-p btn-s hdr-btn">Crear cuenta</a>
      </div>
      <button type="button" class="burger" :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
        <svg v-if="menuOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
    </div>
    <div v-if="menuOpen" class="mnav">
      <div class="wrap">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="ml">
          {{ l.name }} <span aria-hidden="true">→</span>
        </NuxtLink>
        <div class="mbtns">
          <a :href="signupUrl()" class="btn btn-p">Crear cuenta gratis</a>
          <a :href="loginUrl()" class="btn btn-o">Iniciar sesión</a>
        </div>
      </div>
    </div>
  </header>
</template>
