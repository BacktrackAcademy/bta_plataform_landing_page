<script setup lang="ts">
useSeoMeta({
  title: 'Security Hall of Fame',
  description: 'Reportes de seguridad enviados por la comunidad. Muchas gracias por hacer de Backtrack Academy un mejor lugar.',
})

const hall = [
  { name: 'Samuel Orellana', website: 'https://backtrackacademy.com/blog', twitter: 'saamux' },
  { name: 'José Pino', website: 'https://github.com/jofpin', twitter: 'jofpin' },
  { name: 'César Calderón', website: 'http://www.develsecurity.com', twitter: '_Stuxnet' },
  { name: 'Álvaro Ramos', website: 'https://v4char.com/', twitter: 'v4char' },
  { name: 'Luis Angel Zapata', website: '', twitter: 'Zapata_laza' },
  { name: 'Pablo Cesar Cordova', website: 'https://www.facebook.com/profile.php?id=100001176484344', twitter: 'PabloCordova77' },
  { name: 'Min Ko Ko', website: 'https://www.creatigon.com', twitter: 'rootfreak133720' },
  { name: 'Mayur Gupta', website: 'https://www.linkedin.com/in/mayur-gupta-396377169', twitter: '', profile: 'https://backtrackacademy.com/@user-1540219375', profileLabel: '@user-1540219375' },
]
</script>

<template>
  <div class="bg-bta-dark-blue py-24">
    <div class="w-full max-w-5xl mx-auto px-4">
      <h1 class="text-white text-3xl md:text-4xl font-oswald pt-16 leading-normal">
        Security Hall of Fame Backtrack Academy
      </h1>
      <p class="font-inconsolata text-gray-300 mt-4">
        Reportes de seguridad enviados por la comunidad. Muchas gracias por hacer de Backtrack Academy un mejor lugar.
      </p>
      <p class="font-inconsolata text-gray-300 mt-2">
        Si tienes algún reporte puedes contactarnos a
        <a href="mailto:contacto@backtrackacademy.com" class="text-bta-pink font-bold hover:underline">contacto@backtrackacademy.com</a>
      </p>
      <div class="mt-10 overflow-x-auto">
        <table class="w-full font-inconsolata text-white text-left">
          <thead>
            <tr class="border-b border-bta-pink font-oswald uppercase text-gray-200">
              <th class="py-3 pr-4 font-normal">
                #
              </th>
              <th class="py-3 pr-4 font-normal">
                Nombre
              </th>
              <th class="py-3 pr-4 font-normal">
                Website
              </th>
              <th class="py-3 pr-4 font-normal">
                Twitter
              </th>
              <th class="py-3 font-normal">
                Tipo de aporte
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, i) in hall" :key="member.name" class="border-b border-gray-border">
              <td class="py-4 pr-4 text-bta-pink">
                {{ i + 1 }}
              </td>
              <td class="py-4 pr-4">
                {{ member.name }}
              </td>
              <td class="py-4 pr-4">
                <a v-if="member.website" :href="member.website" target="_blank" rel="noopener" class="text-bta-pink hover:underline">visitar</a>
              </td>
              <td class="py-4 pr-4">
                <a v-if="member.twitter" :href="`https://twitter.com/${member.twitter}`" target="_blank" rel="noopener" class="text-bta-pink hover:underline">@{{ member.twitter }}</a>
                <a v-else-if="member.profile" :href="member.profile" target="_blank" rel="noopener" class="text-bta-pink hover:underline">{{ member.profileLabel }}</a>
              </td>
              <td class="py-4">
                Seguridad
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
