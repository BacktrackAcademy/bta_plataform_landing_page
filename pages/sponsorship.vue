<script setup lang="ts">
useSeo({
  title: 'Patrocinio',
  description: 'Ponemos a disposición a nuestro personal para compartir temas de Ethical Hacking y Seguridad Informática en tu región, de forma remota y presencial.',
  path: '/sponsorship',
})

const mailto = 'mailto:contacto@backtrackacademy.com?Subject=Consultar%20Patrocinio'
const countries = ['Chile', 'Perú', 'México', 'Guatemala']
const experience = [
  'Introducción al hacking ético',
  'Explotación de vulnerabilidades',
  'Pentesting enfocado a empresas',
  'Pentesting a sistemas SCADA',
  'Seguridad de la información',
  'Análisis de malware en aplicaciones móviles',
  'Pentesting a aplicaciones móviles',
  'Desarrollo seguro de software',
  'Ingeniería inversa',
]
const offers = [
  'Patrocinio en Redes Sociales.',
  'Stickers, Poleras, Pines y Pachones',
  'Descuentos en nuestra plataforma (50%, 35%, 25%)',
  'Cuentas Premium (6 meses, 3 meses, 1 mes)',
  'Material descargable (Presentaciones, papers, etc)',
  'Material como vallas publicitarias y arañas.',
]
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue">
    <CyberBackground variant="scan" intensity="faint" glow="right" />
    <section
      class="bg-cover bg-center bg-no-repeat py-24 lg:py-40"
      style="background-image: linear-gradient(rgba(7, 9, 22, 0.65), rgba(7, 9, 22, 0.65)), url('/img/sponsorship/Patrocinio.jpg')"
    >
      <div class="container">
        <div class="max-w-2xl">
          <h1 class="font-oswald font-semibold text-4xl xl:text-5xl text-white leading-tight">
            Patrocinio Backtrack Academy
          </h1>
          <p class="font-inconsolata text-lg text-gray-200 py-6 hidden sm:block">
            Ponemos en disposición a nuestro personal para que pueda compartir de forma clara y concisa los temas relacionados al Ethical Hacking y Seguridad Informática en su región de una forma remota y presencial.
          </p>
          <a :href="mailto" target="_blank" rel="noopener" class="inline-block font-oswald uppercase text-white bg-bta-pink py-3 px-5 duration-200 transition-all hover:bg-bta-pink/80">
            Solicitar Patrocinio
          </a>
        </div>
      </div>
    </section>

    <section class="py-20">
      <div class="container max-w-5xl font-inconsolata text-gray-300">
        <h2 class="font-oswald text-3xl text-white mb-4">
          Backtrackacademy y su respuesta al patrocinio.
        </h2>
        <p class="text-justify leading-relaxed">
          En Backtrack Academy creemos fuertemente en la labor de algunas instituciones sobre la concientización de seguridad informática en su región, la falta de conocimientos sobre estas amenazas conlleva muchos riesgos como el robo de identidad en el ciberespacio, defraudaciones en cuentas bancarias, infección de equipos, robo de información, etc. Es por eso que ponemos en disposición a nuestro personal para que pueda compartir de forma clara y concisa los temas relacionados al Ethical Hacking y Seguridad Ofensiva en su región de una forma remota y presencial, también aportamos con descuentos en nuestra plataforma y el sorteo de cuentas premium en nuestros cursos, ofrecemos publicidad en nuestras redes sociales.
        </p>

        <div class="grid md:grid-cols-2 gap-10 items-center my-16">
          <img src="/img/sponsorship/mapa.png" alt="Mapa de presencia de Backtrack Academy" class="w-full max-w-[300px] mx-auto" loading="lazy">
          <div>
            <h2 class="font-oswald text-2xl text-white">
              Presencia en países como
            </h2>
            <hr class="my-4 w-16 border-bta-pink">
            <ul class="font-oswald text-2xl text-white space-y-1">
              <li v-for="country in countries" :key="country">
                {{ country }}
              </li>
            </ul>
          </div>
        </div>

        <h2 class="font-oswald text-3xl text-white mb-4">
          Expositores
        </h2>
        <p class="text-justify leading-relaxed">
          Nuestros profesionales cuentan con conocimientos y habilidades en el mundo del Hacking Ético y Seguridad de la Información, han formado parte de equipos encargados de encontrar vulnerabilidades en sistemas industrias como entidades bancarias, empresas, gobiernos, etc. Contamos con experiencia en los temas actuales, control y mitigación de amenazas, etc.
        </p>

        <hr class="my-12 border-gray-border">

        <div class="grid md:grid-cols-2 gap-10">
          <div>
            <h2 class="font-oswald text-2xl text-white mb-4">
              Experiencia en
            </h2>
            <ul class="space-y-2">
              <li v-for="item in experience" :key="item" class="flex gap-2">
                <span class="text-bta-pink">●</span>{{ item }}
              </li>
            </ul>
          </div>
          <div>
            <h2 class="font-oswald text-2xl text-white mb-4">
              Ofrecemos
            </h2>
            <ul class="space-y-2">
              <li v-for="item in offers" :key="item" class="flex gap-2">
                <span class="text-bta-pink">●</span>{{ item }}
              </li>
            </ul>
          </div>
        </div>

        <hr class="my-12 border-gray-border">

        <h2 class="font-oswald text-3xl text-white mb-8">
          Eventos patrocinados
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <img
            v-for="n in 6"
            :key="n"
            :src="`/img/sponsorship/logo${n}.png`"
            :alt="`Evento patrocinado ${n}`"
            class="w-full rounded-full"
            loading="lazy"
          >
        </div>

        <div class="text-center mt-16">
          <a :href="mailto" target="_blank" rel="noopener" class="inline-block font-oswald uppercase text-white bg-bta-pink py-3 px-5 duration-200 transition-all hover:bg-bta-pink/80">
            Solicitar Patrocinio
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
