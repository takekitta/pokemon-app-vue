<template>
  <div class="pokeball-loader">
    <div class="pokeball">
      <div class="pokeball-top"></div>
      <div class="pokeball-bottom"></div>
      <div class="pokeball-center">
        <div class="pokeball-button"></div>
      </div>
    </div>
    <p class="loading-text">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'PokeballLoader',
  props: {
    text: {
      type: String,
      default: 'ポケモンを読み込み中...',
    },
  },
}
</script>

<style scoped>
.pokeball-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  height: 100%;
}

.pokeball {
  width: 80px;
  height: 80px;
  position: relative;
  animation: spin 1.5s linear infinite;
}

.pokeball-top {
  width: 80px;
  height: 40px;
  background: linear-gradient(135deg, red 0%, red 100%);
  border-radius: 80px 80px 0 0;
  position: relative;
  border: 3px solid var(--text-secondary);
  border-bottom: none;
}

.pokeball-bottom {
  width: 80px;
  height: 40px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 0 0 80px 80px;
  position: relative;
  border: 3px solid var(--text-secondary);
  border-top: none;
}

.pokeball-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: var(--text-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.pokeball-button {
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  border: 2px solid var(--text-secondary);
}

.loading-text {
  margin-top: 20px;
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.pokeball-top::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 15px;
  width: 15px;
  height: 15px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}
</style>
