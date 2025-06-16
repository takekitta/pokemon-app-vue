<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppNavigation from '@/components/AppNavigation.vue'
import '@/assets/main.css'

const isMenuOpen = ref(false)

const handleMenuToggle = (isOpen) => {
  isMenuOpen.value = isOpen
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <div class="app-container">
    <AppHeader @menu-toggle="handleMenuToggle">
      <template #menu-content>
        <AppNavigation @close-menu="closeMenu" />
      </template>
    </AppHeader>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  margin-top: 32px;
  animation: fadeIn 0.6s ease-out;
}

.app-footer {
  margin-top: 64px;
  padding: 24px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: linear-gradient(
    135deg,
    rgba(var(--pokemon-primary-rgb), 0.05) 0%,
    rgba(var(--pokemon-secondary-rgb), 0.05) 100%
  );
  border-radius: 12px;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .app-container {
    padding: 16px;
  }

  .main-content {
    margin-top: 24px;
  }

  .app-footer {
    margin-top: 48px;
    padding: 20px;
  }
}
</style>
