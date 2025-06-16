<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites.js'
import ThemeToggle from '@/components/ThemeToggle.vue'

const route = useRoute()
const { favoriteCount } = useFavorites()

// ナビゲーションアイテムの定義
const navItems = [
  {
    name: 'ホーム',
    path: '/',
    icon: '🏠',
    description: 'ランダム表示',
  },
  {
    name: '一覧',
    path: '/list',
    icon: '📋',
    description: 'ポケモン図鑑',
  },
  {
    name: 'クイズ',
    path: '/silhouette-quiz',
    icon: '❓',
    description: 'シルエットクイズ',
  },
  {
    name: 'お気に入り',
    path: '/favorites',
    icon: '❤️',
    description: 'お気に入り',
    badge: favoriteCount,
  },
]

const isCurrentRoute = computed(() => (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
})
</script>

<template>
  <nav class="app-navigation">
    <div class="nav-container">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ 'nav-item--active': isCurrentRoute(item.path) }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-text">{{ item.name }}</span>
      </RouterLink>
      <div class="theme-toggle-container">
        <ThemeToggle />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.app-navigation {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 8px;
  box-shadow: var(--shadow-sm);
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  color: var(--text-color-primary);
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 14px;
}

.nav-item:hover {
  color: var(--pokemon-primary);
}

.nav-item--active {
  color: var(--pokemon-primary);
  background: var(--bg-card);
  border-radius: 8px;
}

.nav-icon {
  font-size: 16px;
}

.nav-badge {
  background: var(--color-heart);
  color: white;
  border-radius: 8px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  min-width: 16px;
  text-align: center;
}
</style>
