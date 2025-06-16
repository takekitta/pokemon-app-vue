import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'
import AppNavigation from '@/components/AppNavigation.vue'

const mockFavoriteCount = ref(3)

vi.mock('@/composables/useFavorites.js', () => ({
  useFavorites: vi.fn(() => ({
    favoriteCount: mockFavoriteCount,
  })),
}))

// ThemeToggleコンポーネントをスタブ
const ThemeToggleStub = {
  name: 'ThemeToggle',
  template: '<div class="theme-toggle-stub">Theme Toggle</div>',
}

// ルーターのセットアップ
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/list', component: { template: '<div>List</div>' } },
    { path: '/favorites', component: { template: '<div>Favorites</div>' } },
    { path: '/silhouette-quiz', component: { template: '<div>Quiz</div>' } },
  ],
})

describe('AppNavigation', () => {
  it('ナビゲーションアイテムが正しく表示される', () => {
    const wrapper = mount(AppNavigation, {
      global: {
        plugins: [router],
        stubs: {
          ThemeToggle: ThemeToggleStub,
        },
      },
    })

    const navItems = wrapper.findAll('.nav-card')
    expect(navItems).toHaveLength(4) // ホーム、一覧、クイズ、お気に入り

    expect(wrapper.text()).toContain('ホーム')
    expect(wrapper.text()).toContain('一覧')
    expect(wrapper.text()).toContain('クイズ')
    expect(wrapper.text()).toContain('お気に入り')
  })

  it('お気に入りのバッジが表示される', () => {
    const wrapper = mount(AppNavigation, {
      global: {
        plugins: [router],
        stubs: {
          ThemeToggle: ThemeToggleStub,
        },
      },
    })

    // お気に入りナビゲーションアイテムを探す
    const favoriteNavItem = wrapper
      .findAll('.nav-card')
      .find((item) => item.text().includes('お気に入り'))

    expect(favoriteNavItem).toBeTruthy()

    // バッジが表示されているかチェック
    const favoriteBadge = favoriteNavItem.find('.nav-badge')
    expect(favoriteBadge.exists()).toBe(true)
    expect(favoriteBadge.text()).toBe('3')
  })

  it('お気に入り数が変更されるとバッジが更新される', async () => {
    // 初期値を設定してコンポーネントをマウント
    mockFavoriteCount.value = 3

    const wrapper = mount(AppNavigation, {
      global: {
        plugins: [router],
        stubs: {
          ThemeToggle: ThemeToggleStub,
        },
      },
    })
    // 初期状態の確認
    let favoriteBadge = wrapper.find('.nav-badge')
    expect(favoriteBadge.text()).toBe('3')

    // お気に入り数を変更
    mockFavoriteCount.value = 5

    // コンポーネントを再マウントして変更を反映
    await wrapper.unmount()
    const newWrapper = mount(AppNavigation, {
      global: {
        plugins: [router],
        stubs: {
          ThemeToggle: ThemeToggleStub,
        },
      },
    })

    // バッジが更新されることを確認
    favoriteBadge = newWrapper.find('.nav-badge')
    expect(favoriteBadge.text()).toBe('5')
  })

  it('お気に入りが0の場合バッジが表示されない', () => {
    mockFavoriteCount.value = 0

    const wrapper = mount(AppNavigation, {
      global: {
        plugins: [router],
        stubs: {
          ThemeToggle: ThemeToggleStub,
        },
      },
    })

    const favoriteBadge = wrapper.find('.nav-badge')
    expect(favoriteBadge.exists()).toBe(false)
  })

  it('ナビゲーションクリック時にclose-menuイベントが発火される', async () => {
    const wrapper = mount(AppNavigation, {
      global: {
        plugins: [router],
        stubs: {
          ThemeToggle: ThemeToggleStub,
        },
      },
    })

    await wrapper.find('.nav-card').trigger('click')

    expect(wrapper.emitted('close-menu')).toBeTruthy()
  })

  it('ThemeToggleコンポーネントが含まれている', () => {
    const wrapper = mount(AppNavigation, {
      global: {
        plugins: [router],
        stubs: {
          ThemeToggle: ThemeToggleStub,
        },
      },
    })

    expect(wrapper.findComponent(ThemeToggleStub).exists()).toBe(true)
  })
})
