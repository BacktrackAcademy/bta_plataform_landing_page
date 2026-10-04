<script setup lang="ts">
import type { CyberFragment } from '~/utils/cyberContent'

// CAPA 2 · fragmento de terminal. Texto decorativo (aria-hidden en el contenedor), nunca interactivo.
const props = defineProps<{ fragment: CyberFragment, flip?: boolean }>()

type Kind = 'prompt' | 'info' | 'ok' | 'warn' | 'plain'
interface Row { kind: Kind, prefix: string, text: string, typed: boolean, n: number, d: number, t: number }

const PROMPT = /^(\$ |msf6[^>]*> |root@\S+:~\$ )/

const rows = computed<Row[]>(() => {
  let cursor = props.fragment.delay ?? 0
  let first = true
  return props.fragment.lines.map((raw) => {
    let kind: Kind = 'plain'
    let prefix = ''
    let text = raw
    const prompt = PROMPT.exec(raw)
    if (prompt) {
      kind = 'prompt'
      prefix = prompt[1]
      text = raw.slice(prefix.length)
    }
    else if (raw.startsWith('[*]') || raw.startsWith('[INFO]')) {
      kind = 'info'
    }
    else if (raw.startsWith('[+]')) {
      kind = 'ok'
    }
    else if (raw.startsWith('[!]')) {
      kind = 'warn'
    }

    // El primer prompt con texto se "tipea" (≈ 55 ms/carácter); lo siguiente aparece escalonado.
    const typed = kind === 'prompt' && first && text.length > 0
    const n = Math.max(text.length, 1)
    const t = typed ? n * 0.055 : 0
    const d = cursor
    cursor += typed ? t + 0.5 : 0.28
    if (typed)
      first = false
    return { kind, prefix, text, typed, n, d, t: Math.max(t, 0.01) }
  })
})

const style = computed(() => {
  const pos = { ...props.fragment.pos }
  if (props.flip) {
    const { left, right } = pos
    pos.left = right
    pos.right = left
  }
  return pos
})
</script>

<template>
  <div
    class="cy-frag"
    :data-depth="fragment.depth"
    :data-m="fragment.mobile ? 1 : 0"
    :data-big="fragment.big ? 1 : 0"
    :style="style"
  >
    <p v-if="fragment.title" class="cy-title">
      {{ fragment.title }}
    </p>
    <pre class="cy-pre"><template v-for="(r, i) in rows" :key="i"><span class="cy-line" :data-kind="r.kind" :style="{ '--d': `${r.d}s` }"><span v-if="r.prefix" class="cy-prompt">{{ r.prefix }}</span><span v-if="r.typed" class="cy-type" :style="{ '--n': r.n, '--t': `${r.t}s` }">{{ r.text }}</span><template v-else>{{ r.text }}</template><span v-if="fragment.cursor && i === rows.length - 1" class="cy-cursor">█</span></span>
</template></pre>
  </div>
</template>
