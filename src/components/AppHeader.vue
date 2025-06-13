<script setup>
import { ref, onMounted } from 'vue'

const headerRef = ref(null)
const isScrolled = ref(false)

onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10
  }

  window.addEventListener('scroll', handleScroll)

  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <header ref="headerRef" class="app-header" :class="{ 'app-header--scrolled': isScrolled }">
    <div class="header-content">
      <div class="logo-section">
        <div class="logo-icon">⚡</div>
        <a class="logo-text" href="/">
          <h1 class="logo-title">ポケモン図鑑</h1>
        </a>
      </div>

      <div class="header-decoration">
        <div class="pokeball pokeball-1"></div>
        <div class="pokeball pokeball-2"></div>
        <div class="pokeball pokeball-3"></div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px 32px;
  margin-bottom: 32px;
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

.header-decoration {
  display: flex;
  gap: 12px;
  opacity: 0.6;
}

.pokeball {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(180deg, #ff4757 50%, white 50%);
  border: 2px solid #333;
  position: relative;
  animation: spin 8s linear infinite;
}

.pokeball::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: white;
  border: 1px solid #333;
  border-radius: 50%;
}

.pokeball-1 {
  animation-delay: 0s;
}

.pokeball-2 {
  animation-delay: -2.7s;
}

.pokeball-3 {
  animation-delay: -5.3s;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .app-header {
    padding: 20px 24px;
    border-radius: 16px;
  }

  .logo-title {
    font-size: 2rem;
  }

  .logo-icon {
    font-size: 36px;
  }

  .header-decoration {
    display: none;
  }
}
</style>
