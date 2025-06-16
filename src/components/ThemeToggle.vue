<script setup>
import { useTheme } from '@/composables/useTheme.js'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    class="theme-toggle"
    @click="toggleTheme()"
    :aria-label="isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'"
  >
    <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background: var(--bg-surface);
}

.theme-icon {
  font-size: 20px;
  display: block;
}
</style>
