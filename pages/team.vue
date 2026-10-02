<script setup lang="ts">
const platformUrl = usePlatformUrl()
useSeoMeta({
  title: 'Conoce nuestro equipo',
  description: 'El equipo que hace posible que las cosas pasen en Backtrack Academy.',
})

interface Member {
  name: string
  avatar_url: string
  country_flag: string
}

const { data: community } = useAPI<{ content_developer: Member | null, bloggers: Member[] }>('/landing/team')

const product = [
  { name: 'Felipe Barrios', role: 'CEO & Developer', country: 'cl', image: 'Felipe' },
  { name: 'Abel O\'Rian', role: 'CTO', country: 'cl', image: 'Abel' },
  { name: 'Paola Mc Guire', role: 'Publicista', country: 'cl', image: 'Paola' },
  { name: 'Carlos Montenegro', role: 'Ilustrador', country: 'ar', image: 'Carlos' },
  { name: 'Felipe Araya', role: 'Diseñador Multimedia', country: 'cl', image: 'Felipe_A' },
  { name: 'Fabian Pierre', role: 'Developer Ruby on Rails', country: 'pe', image: 'Fabian' },
  { name: 'Nelson Jimenez', role: 'Developer RoR', country: 'cl', image: 'Nelson' },
]
const teachers = [
  { name: 'Rodolfo Ceceña', role: 'Docente', country: 'mx', image: 'Rodolfo' },
  { name: 'Misael Bañales', role: 'Docente', country: 'mx', image: 'Misael' },
  { name: 'Gianncarlo Gómez Morales', role: 'Docente', country: 'pe', image: 'Gianncarlo' },
]

// Código ISO alpha-2 -> emoji de bandera
function flag(code: string) {
  return code?.length === 2
    ? String.fromCodePoint(...[...code.toUpperCase()].map(c => 127397 + c.charCodeAt(0)))
    : ''
}

// El backend devuelve un asset relativo (avatar-50.png) cuando el usuario no tiene foto
function avatar(url: string) {
  return url?.startsWith('http') ? url : null
}
</script>

<template>
  <div class="bg-bta-dark-blue">
    <section class="bg-bta-hero bg-cover bg-no-repeat bg-right py-24 lg:py-40">
      <div class="container">
        <div class="max-w-2xl">
          <h1 class="font-oswald font-semibold text-4xl xl:text-5xl text-white leading-tight">
            Conocernos es importante
          </h1>
          <p class="font-inconsolata text-lg text-gray-200 py-6">
            El equipo que hace posible que las cosas pasen.
          </p>
          <NuxtLink :to="platformUrl('/crear-cuenta')" class="inline-block font-oswald uppercase text-white bg-bta-pink py-3 px-5 duration-200 transition-all hover:bg-bta-pink/80">
            Conoce nuestro trabajo
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-20 font-inconsolata text-center text-white">
      <div class="container max-w-6xl">
        <h2 class="font-oswald text-3xl md:text-4xl mb-16">
          Conoce nuestro equipo
        </h2>

        <!-- Creación de producto -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          <h3 class="col-span-2 md:col-span-1 font-oswald text-2xl md:text-right self-center">
            Creación de Producto
          </h3>
          <figure v-for="m in product" :key="m.name">
            <img :src="`/img/team/${m.image}.png`" :alt="`${m.name} - Team Backtrack Academy`" width="140" height="140" class="mx-auto size-[140px] object-cover rounded-full">
            <figcaption class="mt-3">
              <p class="font-bold">
                {{ m.name }}
              </p>
              <p class="text-sm text-gray-400">
                {{ m.role }} {{ flag(m.country) }}
              </p>
            </figcaption>
          </figure>
          <figure v-if="community?.content_developer">
            <img
              v-if="avatar(community.content_developer.avatar_url)"
              :src="avatar(community.content_developer.avatar_url)!"
              :alt="community.content_developer.name"
              width="140" height="140"
              class="mx-auto size-[140px] object-cover rounded-full"
            >
            <div v-else class="mx-auto size-[140px] rounded-full bg-bta-pink/20 flex items-center justify-center font-oswald text-4xl text-bta-pink">
              {{ community.content_developer.name[0] }}
            </div>
            <figcaption class="mt-3">
              <p class="font-bold">
                {{ community.content_developer.name }}
              </p>
              <p class="text-sm text-gray-400">
                Content Development {{ flag(community.content_developer.country_flag) }}
              </p>
            </figcaption>
          </figure>
        </div>

        <hr class="my-16 border-gray-border">

        <!-- Contenido multimedia -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          <h3 class="col-span-2 md:col-span-1 font-oswald text-2xl md:text-right self-center">
            Creación de contenido multimedia
          </h3>
          <figure v-for="m in teachers" :key="m.name">
            <img :src="`/img/team/${m.image}.png`" :alt="`${m.name} - Team Backtrack Academy`" width="140" height="140" class="mx-auto size-[140px] object-cover rounded-full">
            <figcaption class="mt-3">
              <p class="font-bold">
                {{ m.name }}
              </p>
              <p class="text-sm text-gray-400">
                {{ m.role }} {{ flag(m.country) }}
              </p>
            </figcaption>
          </figure>
        </div>

        <hr class="my-16 border-gray-border">

        <!-- Bloggers -->
        <div v-if="community?.bloggers.length" class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          <h3 class="col-span-2 md:col-span-1 font-oswald text-2xl uppercase md:text-right self-center">
            Hacking Editor <br>De la comunidad y para la comunidad
          </h3>
          <figure v-for="b in community.bloggers" :key="b.name">
            <img
              v-if="avatar(b.avatar_url)"
              :src="avatar(b.avatar_url)!"
              :alt="b.name"
              width="140" height="140"
              class="mx-auto size-[140px] object-cover rounded-full"
            >
            <div v-else class="mx-auto size-[140px] rounded-full bg-bta-pink/20 flex items-center justify-center font-oswald text-4xl text-bta-pink">
              {{ b.name[0] }}
            </div>
            <figcaption class="mt-3">
              <p class="font-bold">
                {{ b.name }}
              </p>
              <p class="text-sm text-gray-400">
                Blogger {{ flag(b.country_flag) }}
              </p>
            </figcaption>
          </figure>
        </div>

        <hr class="my-16 border-gray-border">

        <h3 class="font-oswald text-2xl uppercase mb-6">
          Súper perro
        </h3>
        <figure>
          <img src="/img/team/Charly.png" alt="Charly perro BTA - Team Backtrack Academy" width="140" height="140" class="mx-auto size-[140px] object-cover rounded-full">
          <figcaption class="mt-3">
            <p class="font-bold">
              Charly
            </p>
            <p class="text-sm text-gray-400">
              Súper perro {{ flag('cl') }}
            </p>
          </figcaption>
        </figure>

        <div class="mt-16 aspect-video max-w-3xl mx-auto">
          <iframe
            class="size-full"
            src="https://www.youtube.com/embed/vbAN6ryOXto"
            title="Equipo Backtrack Academy"
            loading="lazy"
            allowfullscreen
          />
        </div>
      </div>
    </section>
  </div>
</template>
