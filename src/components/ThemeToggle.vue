<script setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  attribute: 'data-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'pokemon-app-theme',
})

const toggleDark = useToggle(isDark)
</script>

<template>
  <div @click="toggleDark()" class="theme-toggle">
    <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
    <span class="theme-text">{{ isDark ? 'ライト' : 'ダーク' }}</span>
  </div>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
}

.theme-icon {
  font-size: 16px;
}
</style>
