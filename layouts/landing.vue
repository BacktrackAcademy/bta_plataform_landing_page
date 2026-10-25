<script setup lang="ts">
import '~/assets/css/landing.css'

// Layout de la landing aprobada: su propio header y footer, con los estilos encapsulados en .bta-l.
useSectionSnap()
</script>

<template>
  <div class="bta-l">
    <LandingHeader />
    <slot />
    <LandingFooter />
  </div>
</template>
