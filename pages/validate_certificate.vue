<script setup lang="ts">
useSeo({
  title: 'Valida tu certificado',
  description: 'Verifica la autenticidad de los certificados emitidos por Backtrack Academy con su código de validación.',
  path: '/validate_certificate',
  noindex: true,
})

const config = useRuntimeConfig()
const key = ref('')
const loading = ref(false)
const error = ref('')

async function search() {
  const code = key.value.trim()
  if (!code || loading.value)
    return

  loading.value = true
  error.value = ''
  try {
    const { url } = await $fetch<{ url: string }>('/landing/certificate', {
      baseURL: config.public.apiBaseUrl,
      params: { key: code },
    })
    window.open(url, '_blank', 'noopener')
  }
  catch {
    error.value = 'Certificación no existe.'
  }
  finally {
    loading.value = false
  }
}

const linkedinSteps = [
  { text: 'Primero ingresa a tu perfil de LinkedIn y haz click sobre el botón azul que dice <b>“Añadir sección”.</b>' },
  { text: 'Ahora busca la opción de <b>Licencias y Certificaciones.</b>', image: 1 },
  { text: 'En la siguiente ventana puedes añadir la información del curso que aprobaste. En el siguiente campo podrás buscar a Backtrack Academy como tu empresa emisora del certificado.', image: 2 },
  { text: 'Una vez hayas completado la información, tu certificado quedará registrado en tu perfil de LinkedIn.', image: 3 },
]
</script>

<template>
  <div class="bg-bta-dark-blue py-24">
    <div class="w-full max-w-4xl mx-auto px-4 font-inconsolata text-gray-300">
      <h1 class="text-white text-3xl md:text-4xl font-oswald pt-16 leading-normal">
        Valida tu certificado
      </h1>
      <hr class="my-6 w-16 border-bta-pink">
      <p class="text-justify leading-relaxed">
        Mediante esta herramienta de consulta puedes verificar la autenticidad de la certificación emitida por Backtrack Academy en los diferentes cursos o carreras que ofrece.
        Solo pueden ser consultados los certificados emitidos que contienen el código de validación alfanumérico ubicado en la parte inferior del documento.
      </p>

      <form class="mt-10 flex flex-col sm:flex-row gap-4" @submit.prevent="search">
        <label for="key" class="sr-only">Código de validación</label>
        <input
          id="key"
          v-model="key"
          type="text"
          required
          autocomplete="off"
          placeholder="Código de validación"
          class="flex-grow bg-bta-section border border-gray-border text-white px-4 py-3 focus:outline-none focus:border-bta-pink"
        >
        <button
          type="submit"
          :disabled="loading"
          class="font-oswald uppercase text-white bg-bta-pink py-3 px-6 duration-200 transition-all hover:bg-bta-pink/80 disabled:opacity-60"
        >
          {{ loading ? 'Buscando…' : 'Buscar diploma' }}
        </button>
      </form>
      <p v-if="error" role="alert" class="mt-3 text-bta-pink">
        {{ error }}
      </p>

      <h2 class="text-white text-2xl font-oswald mt-20">
        ¿Cómo agregar tus certificados a Linkedin?
      </h2>
      <hr class="my-6 w-16 border-bta-pink">
      <p>En esta sección te mostraremos <b class="text-white">cómo agregar tus diplomas a Linkedin.</b></p>
      <ol class="mt-6 space-y-8 list-decimal pl-6 marker:text-bta-pink">
        <li v-for="(step, i) in linkedinSteps" :key="i">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="step.text" />
          <img
            v-if="step.image"
            :src="`/img/certificate/certificate_linkedin${step.image}.png`"
            :alt="`Paso ${i + 1} para agregar el certificado a LinkedIn`"
            class="mt-4 max-w-full"
            :class="step.image === 1 ? 'w-[300px]' : ''"
            loading="lazy"
          >
        </li>
      </ol>
    </div>
  </div>
</template>
