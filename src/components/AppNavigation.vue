<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites.js'
import ThemeToggle from '@/components/ThemeToggle.vue'

const route = useRoute()
const { favoriteCount } = useFavorites()

const emit = defineEmits(['close-menu'])

// ナビゲーションアイテムの定義
const navItems = computed(() => [
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
    badge: favoriteCount.value,
  },
])

const isCurrentRoute = computed(() => (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
})

const handleNavClick = () => {
  emit('close-menu')
}
</script>

<template>
  <nav class="menu-navigation">
    <div class="nav-grid">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-card"
        :class="{ 'nav-card--active': isCurrentRoute(item.path) }"
        @click="handleNavClick"
      >
        <div class="nav-icon">{{ item.icon }}</div>
        <div class="nav-info">
          <h3 class="nav-name">{{ item.name }}</h3>
          <p class="nav-description">{{ item.description }}</p>
        </div>
        <div v-if="item.badge && item.badge > 0" class="nav-badge">
          {{ item.badge }}
        </div>
      </RouterLink>
    </div>

    <div class="menu-footer">
      <div class="theme-section">
        <h4 class="section-title">テーマ設定</h4>
        <ThemeToggle />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.menu-navigation {
  width: 100%;
}

.nav-grid {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
}

.nav-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-surface);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-color-primary);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.nav-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--pokemon-primary);
}

.nav-card--active {
  background: var(--pokemon-primary);
  color: var(--color-white);
}

.nav-card--active .nav-description {
  color: rgba(255, 255, 255, 0.8);
}

.nav-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.nav-info {
  flex: 1;
}

.nav-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.nav-description {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  margin: 0;
}

.nav-badge {
  background: var(--color-heart);
  color: white;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.menu-footer {
  border-top: 1px solid var(--border-color);
  padding-top: 24px;
}

.theme-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color-primary);
  margin: 0;
}
</style>
