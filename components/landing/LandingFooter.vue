<script setup lang="ts">
// Footer aprobado de la landing: sin especialidades, solo contacto@ y copyright vigente.
// Las páginas siguen existiendo aunque no estén en este menú.
const groups = [
  { title: 'Explora', links: [
    { name: 'Cursos', to: '/cursos' },
    { name: 'Artículos', to: '/articulos' },
    { name: 'Debates', to: '/debates' },
    { name: 'Planes', to: '/precios' },
  ] },
  { title: 'Academia', links: [
    { name: 'Nosotros', to: '/team' },
    { name: 'Seguridad', to: '/security' },
    { name: 'Preguntas frecuentes', to: '/preguntas-frecuentes' },
    { name: 'Valida tu certificado', to: '/validate_certificate' },
  ] },
  { title: 'Legal', links: [
    { name: 'Políticas de privacidad', to: '/privacy_policy' },
    { name: 'Términos de servicio', to: '/terms_of_use' },
  ] },
]
const year = new Date().getFullYear()
</script>

<template>
  <footer class="foot">
    <div class="wrap">
      <div class="fcols">
        <div>
          <NuxtLink to="/" aria-label="Backtrack Academy, inicio" class="foot-logo">
            <img src="~/assets/logo.svg" alt="Backtrack Academy" width="140" height="53">
          </NuxtLink>
          <p class="foot-tag">
            Formación en ciberseguridad y hacking ético, en español.
          </p>
        </div>
        <nav v-for="g in groups" :key="g.title" :aria-label="g.title">
          <h2 class="fh">
            <i>./</i>{{ g.title }}
          </h2>
          <ul class="fl">
            <li v-for="l in g.links" :key="l.to">
              <NuxtLink :to="l.to">
                {{ l.name }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <div>
          <h2 class="fh">
            <i>./</i>Hablemos
          </h2>
          <ul class="fl">
            <li>
              <a href="mailto:contacto@backtrackacademy.com" class="foot-mail">contacto@backtrackacademy.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="fbot">
        <span>© {{ year }} Backtrack Academy · Todos los derechos reservados.</span>
        <div class="soc">
          <a href="https://www.facebook.com/BackTrackAcademy/" target="_blank" rel="noopener" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
          <a href="https://www.instagram.com/backtrackacademy/" target="_blank" rel="noopener" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4z" /><path d="M17.5 6.5h.01" /></svg></a>
          <a href="https://www.linkedin.com/company/backtrack-academy/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg></a>
        </div>
      </div>
    </div>
  </footer>
</template>
