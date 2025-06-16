import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

// useThemeをモック
const mockToggleTheme = vi.fn()
const mockIsDark = ref(false) // refを使用してリアクティブに

vi.mock('@/composables/useTheme.js', () => ({
  useTheme: vi.fn(() => ({
    isDark: mockIsDark,
    toggleTheme: mockToggleTheme,
  })),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsDark.value = false // 初期状態をライトモードに設定
  })

  it('正しくレンダリングされる', () => {
    const wrapper = mount(ThemeToggle)

    expect(wrapper.find('.theme-toggle').exists()).toBe(true)
    expect(wrapper.find('.theme-icon').exists()).toBe(true)
  })

  it('ライトモード時に月アイコンが表示される', () => {
    mockIsDark.value = false
    const wrapper = mount(ThemeToggle)

    expect(wrapper.find('.theme-icon').text()).toBe('🌙')
  })

  it('ダークモード時に太陽アイコンが表示される', () => {
    mockIsDark.value = true
    const wrapper = mount(ThemeToggle)

    expect(wrapper.find('.theme-icon').text()).toBe('☀️')
  })

  it('クリック時にテーマが切り替わる', async () => {
    const wrapper = mount(ThemeToggle)

    await wrapper.find('.theme-toggle').trigger('click')

    expect(mockToggleTheme).toHaveBeenCalledOnce()
  })

  it('適切なaria-labelが設定される', () => {
    mockIsDark.value = false
    const wrapper = mount(ThemeToggle)

    expect(wrapper.find('.theme-toggle').attributes('aria-label')).toBe('ダークモードに切り替え')
  })

  it('ダークモード時のaria-labelが正しい', () => {
    mockIsDark.value = true
    const wrapper = mount(ThemeToggle)

    expect(wrapper.find('.theme-toggle').attributes('aria-label')).toBe('ライトモードに切り替え')
  })
})
