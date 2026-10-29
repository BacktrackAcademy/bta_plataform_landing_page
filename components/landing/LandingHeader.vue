<script setup lang="ts">
// Menú aprobado de la landing, el mismo en todo el sitio: fijo con desenfoque, navegación centrada y menú compacto bajo 920 px.
// Usa las rutas reales; las cuentas viven en la app autenticada. Las fichas (/curso/x, /articulo/x) marcan su sección como activa.
const { loginUrl, signupUrl } = useAppLinks()
const route = useRoute()
const menuOpen = ref(false)

const links = [
  { name: 'Cursos', to: '/cursos', match: ['/cursos', '/curso'] },
  { name: 'Especialidades', to: '/especialidades', match: ['/especialidades', '/especialidad'] },
  { name: 'Artículos', to: '/articulos', match: ['/articulos', '/articulo', '/autor'] },
  { name: 'Skills', to: '/skills', match: ['/skills'] },
  { name: 'Planes', to: '/precios', match: ['/precios'] },
]

function isActive(match: string[]) {
  return match.some(m => route.path === m || route.path.startsWith(`${m}/`))
}

watch(() => route.fullPath, () => (menuOpen.value = false))

// Con el menú abierto la página no debe desplazarse por detrás; Escape lo cierra.
watch(menuOpen, (open) => {
  if (import.meta.client)
    document.documentElement.style.overflow = open ? 'hidden' : ''
})
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape')
    menuOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <header class="lh">
    <div class="lh-in">
      <NuxtLink to="/" aria-label="Backtrack Academy, inicio" class="lh-logo">
        <img src="~/assets/logo.svg" alt="Backtrack Academy" width="124" height="47">
      </NuxtLink>
      <nav class="lh-nav" aria-label="Principal">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          :aria-current="isActive(l.match) ? 'page' : undefined"
          :class="{ 'is-active': isActive(l.match) }"
        >
          {{ l.name }}
        </NuxtLink>
      </nav>
      <div class="lh-cta">
        <a :href="loginUrl()" class="lh-login">Iniciar sesión</a>
        <a :href="signupUrl()" class="lh-btn lh-btn-p">Crear cuenta</a>
      </div>
      <button type="button" class="lh-burger" :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'" :aria-expanded="menuOpen" aria-controls="lh-mnav" @click="menuOpen = !menuOpen">
        <svg v-if="menuOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
    </div>
    <div v-if="menuOpen" id="lh-mnav" class="lh-mnav">
      <div class="lh-mnav-in">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="lh-ml"
          :class="{ 'is-active': isActive(l.match) }"
          :aria-current="isActive(l.match) ? 'page' : undefined"
        >
          {{ l.name }} <span aria-hidden="true">→</span>
        </NuxtLink>
        <div class="lh-mbtns">
          <a :href="signupUrl()" class="lh-btn lh-btn-p lh-btn-l">Crear cuenta gratis</a>
          <a :href="loginUrl()" class="lh-btn lh-btn-o lh-btn-l">Iniciar sesión</a>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.lh {
  --rosa: #ec1075;
  --rosa-boton: #d60e6a;
  --borde: #262a47;
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgb(7 9 22 / 0.86);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgb(255 255 255 / 0.06);
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.lh a { color: #fff; text-decoration: none; }
.lh-in {
  max-width: 1200px;
  height: 72px;
  margin: 0 auto;
  padding: 0 32px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 32px;
}
.lh-logo { display: flex; flex: none; }
.lh-logo img { display: block; width: 124px; height: auto; }
.lh-nav { display: flex; align-items: center; gap: 28px; margin: 0 auto; }
.lh-nav a { position: relative; padding: 8px 0; color: rgb(255 255 255 / 0.82); transition: color 0.2s; }
.lh-nav a:hover, .lh-nav a.is-active { color: #fff; }
.lh-nav a::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--rosa);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}
.lh-nav a:hover::after, .lh-nav a.is-active::after { transform: scaleX(1); }
.lh-cta { display: flex; align-items: center; gap: 20px; }
.lh-login { transition: color 0.2s; }
.lh-login:hover { color: var(--rosa); }
.lh-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  border-radius: 6px;
  box-sizing: border-box;
  white-space: nowrap;
  transition: background 0.2s, border-color 0.2s;
}
.lh-btn-p { background: var(--rosa-boton); }
.lh-btn-p:hover { background: #b80c5b; color: #fff; }
.lh-btn-o { border: 1px solid #36364e; background: rgb(255 255 255 / 0.02); }
.lh-btn-o:hover { color: #fff; border-color: rgb(255 255 255 / 0.4); background: rgb(255 255 255 / 0.05); }
.lh-btn-l { height: 48px; font-size: 16px; }
.lh a:focus-visible, .lh-burger:focus-visible { outline: 2px solid var(--rosa); outline-offset: 2px; border-radius: 4px; }

.lh-burger {
  display: none;
  margin-left: auto;
  width: 44px;
  height: 44px;
  border: 1px solid var(--borde);
  border-radius: 6px;
  background: transparent;
  color: #fff;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}
.lh-mnav {
  display: none;
  /* absolute y no fixed: el backdrop-filter del header es el bloque contenedor de los hijos fixed. */
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: calc(100dvh - 72px);
  overflow-y: auto;
  background: #070916;
  border-top: 1px solid rgb(255 255 255 / 0.06);
}
.lh-mnav-in { padding: 8px 16px 32px; }
.lh-ml {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--borde);
  font-size: 20px;
}
.lh-ml.is-active { color: var(--rosa); }
.lh-mbtns { display: grid; gap: 10px; margin-top: 20px; }

@media (max-width: 920px) {
  .lh-nav, .lh-cta { display: none; }
  .lh-burger { display: inline-flex; }
  .lh-mnav { display: block; }
  .lh-in { padding: 0 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .lh-nav a::after, .lh-nav a, .lh-btn { transition: none; }
}
</style>
