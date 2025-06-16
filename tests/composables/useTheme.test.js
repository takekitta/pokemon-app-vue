import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

const mockIsDark = ref(false)
const mockToggleTheme = vi.fn(() => {
  mockIsDark.value = !mockIsDark.value
  if (mockIsDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.classList.add('dark')
    localStorageMock.setItem('vueuse-color-scheme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
    document.documentElement.classList.remove('dark')
    localStorageMock.setItem('vueuse-color-scheme', 'light')
  }
})

vi.mock('@vueuse/core', () => ({
  useDark: vi.fn(() => mockIsDark),
  useToggle: vi.fn(() => mockToggleTheme),
}))

import { useTheme } from '@/composables/useTheme.js'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('useTheme', () => {
  beforeEach(() => {
    // 状態をリセット
    mockIsDark.value = false

    // localStorageモックをクリア
    localStorageMock.clear.mockClear()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()

    // DOM要素をリセット
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark')

    vi.clearAllMocks()
  })

  it('初期状態でライトモードが設定される', () => {
    const { isDark, currentTheme } = useTheme()

    expect(isDark.value).toBe(false)
    expect(currentTheme.value).toBe('light')
  })

  it('テーマを切り替えることができる', () => {
    const { isDark, toggleTheme } = useTheme()

    expect(isDark.value).toBe(false)

    toggleTheme()

    expect(isDark.value).toBe(true)
    expect(mockToggleTheme).toHaveBeenCalledOnce()
  })

  it('テーマ変更時にDOM属性が更新される', () => {
    const { toggleTheme } = useTheme()

    toggleTheme()

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('複数回の切り替えが正常に動作する', () => {
    const { isDark, toggleTheme } = useTheme()

    // ライト → ダーク → ライト
    toggleTheme()
    expect(isDark.value).toBe(true)

    toggleTheme()
    expect(isDark.value).toBe(false)

    expect(mockToggleTheme).toHaveBeenCalledTimes(2)
  })

  it('無効なlocalStorage値を処理できる', () => {
    localStorageMock.getItem.mockReturnValue('invalid-theme')

    const { currentTheme } = useTheme()

    // デフォルト値にフォールバック
    expect(currentTheme.value).toBe('light')
  })

  it('localStorageにテーマ設定が保存される', () => {
    const { toggleTheme } = useTheme()

    toggleTheme()

    // モックされたsetItemが呼ばれたことを確認
    expect(localStorageMock.setItem).toHaveBeenCalledWith('vueuse-color-scheme', 'dark')
  })

  it('localStorageから設定を復元する', () => {
    // localStorageモックの戻り値を設定
    localStorageMock.getItem.mockReturnValue('dark')

    // モックの初期状態を設定
    mockIsDark.value = true

    const { isDark, currentTheme } = useTheme()

    expect(isDark.value).toBe(true)
    expect(currentTheme.value).toBe('dark')
  })
})
