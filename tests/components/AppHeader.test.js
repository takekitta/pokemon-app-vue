import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

// useThemeをモック
const mockCurrentTheme = ref('light')

vi.mock('@/composables/useTheme.js', () => ({
  useTheme: vi.fn(() => ({
    isDark: ref(false),
    currentTheme: mockCurrentTheme,
    toggleTheme: vi.fn(),
  })),
}))

// スクロールイベントのモック
Object.defineProperty(window, 'scrollY', {
  value: 0,
  writable: true,
})

describe('AppHeader', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    window.scrollY = 0
    mockCurrentTheme.value = 'light'
    vi.clearAllMocks()
  })

  it('正しくレンダリングされる', () => {
    const wrapper = mount(AppHeader)

    expect(wrapper.find('.app-header').exists()).toBe(true)
    expect(wrapper.find('.logo-title').text()).toBe('ポケモン図鑑')
    expect(wrapper.find('.menu-toggle').exists()).toBe(true)
  })

  it('メニューボタンクリックでオーバーレイが表示される', async () => {
    const wrapper = mount(AppHeader)

    await wrapper.find('.menu-toggle').trigger('click')

    // Teleportされた要素を確認
    const overlay = document.querySelector('.menu-overlay')
    expect(overlay).toBeTruthy()
    expect(overlay.getAttribute('data-theme')).toBe('light')
  })

  it('ダークモード時のオーバーレイテーマが正しい', async () => {
    mockCurrentTheme.value = 'dark'
    const wrapper = mount(AppHeader)

    await wrapper.find('.menu-toggle').trigger('click')

    const overlay = document.querySelector('.menu-overlay')
    expect(overlay.getAttribute('data-theme')).toBe('dark')
  })

  it('オーバーレイクリックでメニューが閉じる', async () => {
    const wrapper = mount(AppHeader)

    // メニューを開く
    await wrapper.find('.menu-toggle').trigger('click')
    expect(document.querySelector('.menu-overlay')).toBeTruthy()

    // オーバーレイをクリック
    const overlay = document.querySelector('.menu-overlay')
    await overlay.dispatchEvent(new Event('click'))

    await wrapper.vm.$nextTick()

    // メニューが閉じることを確認
    expect(document.querySelector('.menu-overlay')).toBeFalsy()
  })

  it('スクロール時にヘッダーのスタイルが変わる', async () => {
    const wrapper = mount(AppHeader)

    // スクロール位置を変更
    window.scrollY = 50
    window.dispatchEvent(new Event('scroll'))

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.app-header').classes()).toContain('app-header--scrolled')
  })

  it('menu-toggleイベントが正しく発火される', async () => {
    const wrapper = mount(AppHeader)

    await wrapper.find('.menu-toggle').trigger('click')

    expect(wrapper.emitted('menu-toggle')).toBeTruthy()
    expect(wrapper.emitted('menu-toggle')[0]).toEqual([true])
  })
})
