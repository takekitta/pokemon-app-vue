<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme.js'

const headerRef = ref(null)
const isScrolled = ref(false)
const isMenuOpen = ref(false)

const { currentTheme } = useTheme()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10
  }

  window.addEventListener('scroll', handleScroll)

  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
})

const emit = defineEmits(['menu-toggle'])

const handleMenuToggle = () => {
  toggleMenu()
  emit('menu-toggle', isMenuOpen.value)
}
</script>

<template>
  <header ref="headerRef" class="app-header" :class="{ 'app-header--scrolled': isScrolled }">
    <div class="header-content">
      <div class="logo-section">
        <div class="logo-icon">📚️</div>
        <a class="logo-text" href="/">
          <h1 class="logo-title">ポケモン図鑑</h1>
        </a>
      </div>

      <div class="header-actions">
        <button
          class="menu-toggle"
          @click="handleMenuToggle"
          :class="{ 'menu-toggle--active': isMenuOpen }"
          aria-label="メニューを開く"
        >
          <div class="pokeball pokeball-menu"></div>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isMenuOpen" class="menu-overlay" :data-theme="currentTheme" @click="closeMenu">
        <div class="menu-content" @click.stop>
          <div class="menu-header">
            <h2 class="menu-title">メニュー</h2>
            <button class="menu-close" @click="closeMenu">✕</button>
          </div>
          <slot name="menu-content"></slot>
        </div>
      </div>
    </Teleport>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px 32px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

[data-theme='dark'] .app-header {
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
  border-color: #333;
}

.app-header--scrolled {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  font-size: 48px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: float 3s ease-in-out infinite;
}

.logo-text {
  color: var(--pokemon-primary);
}

.logo-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--pokemon-primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: inline-block;
}

.header-actions {
  display: flex;
  align-items: center;
}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
}

.menu-toggle:hover {
  transform: scale(1.1);
}

.menu-toggle--active .pokeball-menu {
  animation: spin 0.5s ease-in-out;
}

.pokeball-menu {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(180deg, #ff4757 50%, white 50%);
  border: 3px solid #333;
  position: relative;
  transition: all 0.3s ease;
}

.pokeball-menu::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border: 2px solid #333;
  border-radius: 50%;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.menu-content {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.3s ease;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--pokemon-primary);
}

.menu-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--pokemon-primary);
  margin: 0;
}

.menu-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-color-primary);
  padding: 4px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.menu-close:hover {
  background: var(--pokemon-primary);
  color: white;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .app-header {
    padding: 20px;
    border-radius: 16px;
  }

  .logo-title {
    font-size: 2rem;
  }

  .logo-icon {
    font-size: 36px;
  }

  .menu-content {
    padding: 24px;
    width: 95%;
  }

  .pokeball-menu {
    width: 36px;
    height: 36px;
  }
}
</style>
