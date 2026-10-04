<script setup lang="ts">
import type { CyberFragment, CyberVariant } from '~/utils/cyberContent'
import { CYBER_FRAGMENTS } from '~/utils/cyberContent'

/**
 * Capa ambiental "cybersecurity" para una sección de la landing. NUNCA va en el Hero.
 *
 * Uso: dentro de una <section class="relative isolate"> como primer hijo; se pinta detrás del contenido
 * (z-index -1 dentro del contexto de apilamiento de la sección) y no recibe eventos.
 *
 *   <CyberBackground variant="recon" intensity="subtle" glow="left" />
 *
 * Capas: 4 glow · 3 grid · 2 terminales/topología (parallax mínimo). El contenido de la sección es la capa 1.
 */
const props = withDefaults(defineProps<{
  variant?: CyberVariant
  /** faint = secciones con mucho contenido (precios, texto denso); subtle = por defecto; normal = CTA. */
  intensity?: 'faint' | 'subtle' | 'normal'
  glow?: 'left' | 'right' | 'center' | 'none'
  /** edges = los fragmentos solo se leen en los márgenes; soft = fundido suave; none = sin máscara. */
  mask?: 'edges' | 'soft' | 'none'
  flip?: boolean
  /** Sustituye los fragmentos de la variante (comandos propios). */
  fragments?: CyberFragment[]
}>(), { variant: 'scan', intensity: 'subtle', glow: 'center', mask: 'edges' })

const items = computed(() => props.fragments ?? CYBER_FRAGMENTS[props.variant])

const root = ref<HTMLElement | null>(null)
const played = ref(false)
const inView = ref(false)

// Único JS: se reproduce la entrada una vez al acercarse la sección y se pausa lo infinito fuera de pantalla.
onMounted(() => {
  if (!root.value || !('IntersectionObserver' in window))
    return
  const io = new IntersectionObserver(([entry]) => {
    inView.value = entry.isIntersecting
    if (entry.isIntersecting)
      played.value = true
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 })
  io.observe(root.value)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <div
    ref="root"
    class="cy"
    :data-intensity="intensity"
    :data-mask="mask"
    :data-played="played"
    :data-inview="inView"
    aria-hidden="true"
  >
    <CyberGlow :side="glow" />
    <CyberGrid />
    <div class="cy-layer">
      <CyberNetworkTopology v-if="variant === 'topology'" :flip="flip" />
      <CyberTerminalFragment v-for="(f, i) in items" :key="i" :fragment="f" :flip="flip" />
    </div>
  </div>
</template>

<style>
/* ──────────────────────────── contenedor ──────────────────────────── */
.cy {
  --cy-k: 0.7; /* intensidad global */
  position: absolute;
  inset: 0;
  z-index: -1; /* detrás del contenido de la sección (que debe ser <section class="relative isolate">) */
  overflow: clip; /* clip, no hidden: hidden crearía un scroller y rompería animation-timeline: view() del parallax */
  pointer-events: none;
  user-select: none;
  opacity: var(--cy-k);
  contain: strict; /* no afecta al layout ni al CLS */
}
.cy[data-intensity='faint'] { --cy-k: 0.4; }
.cy[data-intensity='normal'] { --cy-k: 1; }

/* ─────────────────────── CAPA 3 · grid casi estático ─────────────────────── */
.cy-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 64px 64px;
  background-position: center top;
  /* fundido en los 4 bordes: no se ven costuras entre secciones */
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent), linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent), linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}

/* ─────────────────────── CAPA 4 · glow ambiental ─────────────────────── */
.cy-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 55% at var(--gx, 50%) 30%, rgba(236, 16, 117, 0.075), transparent 70%),
    radial-gradient(45% 45% at calc(100% - var(--gx, 50%)) 85%, rgba(70, 90, 200, 0.06), transparent 70%);
}
.cy-glow[data-side='left'] { --gx: 12%; }
.cy-glow[data-side='right'] { --gx: 88%; }

/* ─────────────────── CAPA 2 · terminales / topología ─────────────────── */
.cy-layer {
  position: absolute;
  inset: 0;
}
.cy[data-mask='edges'] .cy-layer {
  -webkit-mask-image: linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0.22) 24%, rgba(0, 0, 0, 0.22) 76%, #000 100%);
  mask-image: linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0.22) 24%, rgba(0, 0, 0, 0.22) 76%, #000 100%);
}
.cy[data-mask='soft'] .cy-layer {
  -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, #000 30%, rgba(0, 0, 0, 0.35) 100%);
  mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, #000 30%, rgba(0, 0, 0, 0.35) 100%);
}

.cy-frag {
  position: absolute;
  display: none; /* en móvil solo se muestran los marcados (data-m="1") */
  color: #cfd6ff;
  font-family: 'Inconsolata', ui-monospace, 'SFMono-Regular', Menlo, monospace;
  line-height: 1.5;
  white-space: pre;
}
.cy-frag[data-m='1'] { display: block; }
.cy-frag[data-depth='1'] { font-size: 12.5px; opacity: 0.3; filter: blur(0.35px); }
.cy-frag[data-depth='2'] { font-size: 11.5px; opacity: 0.23; filter: blur(0.8px); }
.cy-frag[data-depth='3'] { font-size: 10.5px; opacity: 0.16; filter: blur(1.8px); }

.cy-frag[data-big='1'] { font-size: 17px; opacity: 0.42; filter: none; }

.cy-title {
  margin: 0 0 6px;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: #ec1075;
}
.cy-pre { margin: 0; font: inherit; }
.cy-line { display: block; }
.cy-line[data-kind='prompt'] .cy-prompt { color: #ec1075; }
.cy-line[data-kind='info'] { color: #9fb0ff; }
.cy-line[data-kind='ok'] { color: #7fe0b0; }
.cy-line[data-kind='warn'] { color: #ffc27a; }
.cy-cursor { margin-left: 1px; color: #ec1075; }

.cy-type { display: inline-block; vertical-align: top; }

/* Topología */
.cy-topo {
  position: absolute;
  right: -3%;
  top: 8%;
  width: min(520px, 60vw);
  opacity: 0.9;
  filter: blur(0.5px);
}
.cy-topo[data-flip='1'] { right: auto; left: -3%; }
.cy-edge { stroke: rgba(207, 214, 255, 0.34); stroke-width: 1; }
.cy-node { fill: #0d1024; stroke: rgba(207, 214, 255, 0.5); stroke-width: 1; }
.cy-node--main { stroke: #ec1075; }
.cy-label { fill: rgba(207, 214, 255, 0.55); font: 10px 'Inconsolata', ui-monospace, monospace; }

/* ─────────────────────── escritorio con movimiento ─────────────────────── */
@media (min-width: 768px) {
  .cy-frag { display: block; }
}

@media (prefers-reduced-motion: no-preference) and (min-width: 768px) {
  /* Estado inicial oculto (solo CSS: sin parpadeo al hidratar); entra al acercarse la sección. */
  .cy .cy-line { opacity: 0; }
  .cy[data-played='true'] .cy-line { animation: cy-in 1.1s ease-out var(--d, 0s) both; }

  .cy .cy-type { clip-path: inset(0 100% 0 0); }
  .cy[data-played='true'] .cy-type { animation: cy-type var(--t, 1s) steps(var(--n, 12), end) var(--d, 0s) both; }

  .cy-cursor { animation: cy-blink 1.2s steps(2, start) infinite; animation-play-state: paused; }
  .cy[data-inview='true'] .cy-cursor { animation-play-state: running; }

  .cy-glow { animation: cy-breathe 18s ease-in-out infinite alternate; animation-play-state: paused; }
  .cy[data-inview='true'] .cy-glow { animation-play-state: running; }
}

/* Parallax mínimo en la capa de terminales (el grid no se mueve; el contenido va a velocidad normal).
   Progressive enhancement: sin animation-timeline simplemente no hay parallax. Cero JS en scroll. */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) and (min-width: 768px) {
    .cy-layer {
      animation: cy-drift linear both;
      animation-timeline: view();
      will-change: transform;
    }
  }
}

@keyframes cy-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes cy-type { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes cy-blink { to { opacity: 0; } }
@keyframes cy-breathe { from { opacity: 0.8; } to { opacity: 1; } }
@keyframes cy-drift { from { transform: translate3d(0, -20px, 0); } to { transform: translate3d(0, 20px, 0); } }

/* ───────────────────────────── móvil ───────────────────────────── */
@media (max-width: 767px) {
  .cy { opacity: calc(var(--cy-k) * 0.55); }
  .cy-grid { background-size: 48px 48px; }
  .cy-topo { opacity: 0.35; width: 90vw; }
}
</style>
