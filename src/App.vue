<script setup>
import '@/assets/main.css'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>ポケモン図鑑</h1>
      <nav class="navigation">
        <RouterLink to="/" class="nav-link">ホーム</RouterLink>
        <RouterLink to="/list" class="nav-link">一覧</RouterLink>
      </nav>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
}

.app-header h1 {
  color: var(--text-primary);
  margin-bottom: 20px;
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.nav-link {
  padding: 10px 20px;
  background: var(--pokemon-primary);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: var(--pokemon-secondary);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: var(--pokemon-secondary);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.main-content {
  min-height: 500px;
}
</style>
