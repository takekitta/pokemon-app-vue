import { useDark, useToggle } from '@vueuse/core'
import { computed } from 'vue'

export function useTheme() {
  const isDark = useDark({
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'light',
  })

  const toggleTheme = useToggle(isDark)

  return {
    isDark,
    toggleTheme,
    currentTheme: computed(() => (isDark.value ? 'dark' : 'light')),
  }
}
