<script setup lang="ts">
import type { SkillResourceType, SkillTool } from '~/interfaces/skills'

// Instrucciones por herramienta. Cada una usa un mecanismo distinto: no se asume uno universal.
const props = defineProps<{ tools: SkillTool[], resourceType: SkillResourceType, hasPackage: boolean }>()

const STEPS: Record<SkillTool, string[]> = {
  claude: [
    'Si es un paquete ZIP con SKILL.md, descomprímelo y revisa cada archivo (los scripts incluidos no se ejecutan solos).',
    'Instálalo como Skill en Claude (Claude Code: carpeta de skills del proyecto o personal; Claude.ai: sube el ZIP en Configuración › Capacidades).',
    'Si es un prompt o configuración, pégalo como instrucciones de proyecto o en el chat.',
  ],
  chatgpt: [
    'Copia el contenido y pégalo en el chat, o en las instrucciones personalizadas / instrucciones de un GPT o proyecto.',
    'Si incluye archivos de apoyo (JSON, YAML), adjúntalos a la conversación o como conocimiento del GPT.',
  ],
  gemini: [
    'Copia el contenido y úsalo como prompt, o como instrucciones de un Gem.',
    'Adjunta los archivos de apoyo si la skill los menciona.',
  ],
  cursor: [
    'Guarda el contenido como regla del proyecto (carpeta .cursor/rules) o como archivo de contexto.',
    'Revisa que la regla solo aplique a los archivos o carpetas previstos.',
  ],
  codex: [
    'Guarda el contenido en el archivo de instrucciones del agente del repositorio (por ejemplo AGENTS.md) o úsalo como prompt.',
    'Ejecuta el agente en un entorno aislado y con los permisos mínimos necesarios.',
  ],
  universal: [
    'Es texto plano o Markdown: cópialo o descárgalo y adáptalo a la herramienta que uses.',
  ],
}

const TYPE_NOTE: Record<SkillResourceType, string> = {
  ai_skill: 'Las AI Skills suelen venir empaquetadas (SKILL.md y archivos de apoyo).',
  prompt: 'Un prompt se pega tal cual; ajusta los marcadores entre corchetes a tu caso.',
  workflow: 'Un workflow describe pasos encadenados: sigue el orden indicado y valida cada resultado.',
  automation: 'Una automatización puede ejecutar acciones reales: pruébala primero con datos de laboratorio.',
  agent_configuration: 'Una configuración de agente define permisos y herramientas: revisa cuáles habilita antes de usarla.',
}

const shown = computed(() => (props.tools.length ? props.tools : (['universal'] as SkillTool[])))
</script>

<template>
  <div>
    <p class="font-plex text-white/70">
      {{ TYPE_NOTE[resourceType] }}
    </p>
    <div class="mt-6 grid gap-6 md:grid-cols-2">
      <section v-for="t in shown" :key="t" class="rounded-lg border border-gray-border bg-bta-section p-5">
        <h3 class="font-oswald text-lg uppercase tracking-wide">
          {{ TOOL_LABELS[t] }}
        </h3>
        <ol class="mt-3 list-decimal space-y-2 pl-5 font-plex text-[15px] leading-relaxed text-white/75 marker:text-bta-pink">
          <li v-for="s in STEPS[t]" :key="s">
            {{ s }}
          </li>
        </ol>
      </section>
    </div>
    <div class="mt-6 rounded-lg border border-bta-pink/40 bg-bta-pink/5 p-5 font-plex text-[15px] leading-relaxed text-white/80" role="note">
      <p class="font-semibold text-white">
        Antes de usarla
      </p>
      <ul class="mt-2 list-disc space-y-1 pl-5 marker:text-bta-pink">
        <li>El contenido lo publica la comunidad: <strong>revísalo por completo</strong> antes de instalarlo{{ hasPackage ? ' y no ejecutes sus scripts sin leerlos' : '' }}.</li>
        <li>Ejecútalo <strong>únicamente en entornos autorizados</strong> (laboratorios propios o con permiso escrito).</li>
        <li>No pegues credenciales, datos de clientes ni información sensible en una herramienta de IA.</li>
      </ul>
    </div>
  </div>
</template>
