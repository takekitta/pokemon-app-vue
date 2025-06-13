import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// ローカルストレージのモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
globalThis.localStorage = localStorageMock

// Vue Test Utilsのグローバル設定
config.global.mocks = {
  $router: {
    push: vi.fn(),
    back: vi.fn(),
  },
  $route: {
    params: { id: '25' },
    path: '/pokemon/25',
  },
}
