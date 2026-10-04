<script setup lang="ts">
defineProps<{ options: string[], modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div role="group" aria-label="Filtrar por nivel" class="flex flex-wrap gap-2">
    <button
      v-for="option in ['Todas', ...options]"
      :key="option"
      type="button"
      :aria-pressed="(option === 'Todas' ? '' : option) === modelValue"
      class="h-9 rounded-md border px-4 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bta-pink"
      :class="(option === 'Todas' ? '' : option) === modelValue
        ? 'border-white/40 bg-white/10 text-white'
        : 'border-gray-border text-white/65 hover:border-white/30 hover:text-white'"
      @click="$emit('update:modelValue', option === 'Todas' ? '' : option)"
    >
      {{ option }}
    </button>
  </div>
</template>
