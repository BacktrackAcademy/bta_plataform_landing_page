<script setup lang="ts">
defineProps<{ links: { name: string, to: string }[] }>()
defineEmits<{ close: [] }>()

const { loginUrl, signupUrl } = useAppLinks()
</script>

<template>
  <div class="flex flex-col p-4">
    <ul class="mb-6 flex flex-col">
      <li v-for="link in links" :key="link.to" class="border-b border-white/15">
        <NuxtLink :to="link.to" class="block px-1.5 py-4 font-oswald text-xl text-white" @click="$emit('close')">
          {{ link.name }}
        </NuxtLink>
      </li>
    </ul>
    <a :href="signupUrl()" class="block rounded-lg bg-[#D60E6A] py-3 text-center font-oswald text-xl text-white">
      Empezar ahora
    </a>
    <a :href="loginUrl()" class="mt-3 block rounded-lg border border-gray-border py-3 text-center font-oswald text-xl text-white">
      Iniciar sesión
    </a>
  </div>
</template>
