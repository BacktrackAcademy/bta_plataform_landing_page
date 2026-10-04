<script setup lang="ts">
// Topología de nodos muy tenue (sección de comunidad). SVG abstracto; solo opacity para aparecer y "latir".
defineProps<{ flip?: boolean }>()

const nodes = [
  { x: 60, y: 200, label: '10.0.0.1', main: true },
  { x: 230, y: 90, label: '10.0.0.21' },
  { x: 230, y: 310, label: '10.0.0.42' },
  { x: 420, y: 40, label: '10.0.0.57' },
  { x: 420, y: 150, label: '10.0.0.58' },
  { x: 430, y: 260, label: '10.0.0.77' },
  { x: 430, y: 360, label: '10.0.0.78' },
]
const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]]
</script>

<template>
  <svg class="cy-topo" :data-flip="flip ? 1 : 0" viewBox="0 0 520 400" fill="none" aria-hidden="true">
    <line
      v-for="(e, i) in edges"
      :key="`e${i}`"
      class="cy-line cy-edge"
      :style="{ '--d': `${0.4 + i * 0.35}s` }"
      :x1="nodes[e[0]].x" :y1="nodes[e[0]].y" :x2="nodes[e[1]].x" :y2="nodes[e[1]].y"
    />
    <g v-for="(n, i) in nodes" :key="`n${i}`" class="cy-line" :style="{ '--d': `${0.2 + i * 0.3}s` }">
      <circle class="cy-node" :class="{ 'cy-node--main': n.main }" :cx="n.x" :cy="n.y" :r="n.main ? 5 : 3.5" />
      <text class="cy-label" :x="n.x + 10" :y="n.y + 4">{{ n.label }}</text>
    </g>
  </svg>
</template>
