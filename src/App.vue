<script setup>
import HomeView from './views/HomeView.vue'
import '@/assets/main.css'
</script>

<template>
  <div class="app-container">
    <h1>ポケモン図鑑</h1>
    <HomeView />
  </div>
</template>

<style>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  h1 {
    text-align: center;
    color: var(--text-primary);
  }
}
</style>
