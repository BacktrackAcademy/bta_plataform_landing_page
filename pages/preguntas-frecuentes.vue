<script setup lang="ts">
const faqs = [
  {
    q: '¿Por qué debo registrarme?',
    a: 'Al tener un perfil en la plataforma puedes medir cuanto tiempo dedicas a estudiar y medir tus avances. Y si tienes cursos Premium podrás verlos por tiempo ilimitado.',
  },
  {
    q: '¿Qué son las oportunidades y voucher?',
    a: 'Las oportunidades son lo que te permite rendir exámenes al terminar un curso, cada examen rendido gasta una oportunidad. De igual forma el Voucher es lo que te permite rendir el examen final de especialidades.',
  },
  {
    q: '¿Por dónde puedo empezar a estudiar los cursos?',
    a: 'El orden de nuestros cursos está dado por las especialidades. Si no posees conocimiento y estás comenzando en esta área te recomendamos partir por nuestra especialidad Penetration Testing Student. Si ya posees conocimiento y quieres comenzar a aprender herramientas y metodologías te recomendamos que sigas con nuestra especialidad Penetration Testing Professional.',
  },
  {
    q: '¿Qué es backtrack academy?',
    a: 'Somos una plataforma de seguridad informática para Hackers Éticos donde actualmente contamos con más de 50 cursos y más de 200 artículos enfocados únicamente en esta área. Poseemos más de cinco años de experiencia con más de 50.000 estudiantes que han desarrollado una nueva habilidad en nuestra comunidad educativa online.',
  },
  {
    q: '¿Qué son los cursos Premium?',
    a: 'Son cursos con contenidos mucho más avanzados. Los ingresos generados de estos cursos son usados para seguir mejorando la plataforma y la infrastructura. Los usuarios que ayuden a hacer crecer la comunidad tendrán acceso a funciones más avanzadas y mentorias más personalizadas.',
  },
  {
    q: '¿Cuáles son los métodos de pago?',
    a: 'El método de pago es a través de PayPal. Si estás en México y no tienes saldo en PayPal, contáctate con nosotros y te contamos sobre las alternativas de pago. Puedes usar Khipu/Payku/Webpay si estás en Chile.',
  },
  {
    q: '¿Habrán más cursos?',
    a: '¡Por supuesto que sí! Nos encanta que aprendas cosas nuevas. Actualmente estamos generando muchos cursos mientras seguimos mejorando la plataforma.',
  },
]

useSeo({
  title: 'Preguntas frecuentes',
  description: 'Resuelve tus dudas sobre registro, oportunidades, cursos Premium y métodos de pago en Backtrack Academy.',
  path: '/preguntas-frecuentes',
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.a },
      })),
    }),
  }],
})
</script>

<template>
  <div class="relative isolate bg-bta-dark-blue py-24">
    <CyberBackground variant="http" intensity="faint" glow="right" />
    <div class="w-full max-w-4xl mx-auto px-4">
      <h1 class="text-white text-3xl md:text-4xl font-oswald pt-16 leading-normal">
        Preguntas frecuentes
      </h1>
      <p class="font-inconsolata text-gray-300 mt-2">
        Todas tus sugerencias son bienvenidas, escríbenos a
        <a href="mailto:contacto@backtrackacademy.com" class="text-bta-pink font-bold hover:underline">contacto@backtrackacademy.com</a>
      </p>
      <hr class="my-8 border-gray-border">
      <div class="space-y-3">
        <details
          v-for="faq in faqs"
          :key="faq.q"
          class="group border border-gray-border bg-bta-section"
        >
          <summary class="flex items-center justify-between gap-4 cursor-pointer list-none p-5 text-white font-oswald text-xl hover:text-bta-pink transition-colors [&::-webkit-details-marker]:hidden">
            {{ faq.q }}
            <Icon name="lucide:chevron-down" class="size-5 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <p class="px-5 pb-5 font-inconsolata text-gray-300 leading-relaxed">
            {{ faq.a }}
          </p>
        </details>
      </div>
    </div>
  </div>
</template>
