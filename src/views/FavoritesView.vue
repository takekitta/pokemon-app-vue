<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites.js'
import PokemonCard from '@/components/PokemonCard.vue'

const router = useRouter()
const { favorites, favoriteCount } = useFavorites()

// お気に入りを追加日時順（新しい順）でソート
const sortedFavorites = computed(() => {
  return [...favorites.value].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
})

const selectPokemon = (pokemon) => {
  router.push(`/pokemon/${pokemon.id}`)
}
</script>

<template>
  <div class="favorites-view">
    <div class="header">
      <h1>お気に入りポケモン</h1>
      <p class="subtitle">{{ favoriteCount }}匹のポケモンをお気に入り登録中</p>
    </div>

    <div v-if="favorites.length === 0" class="empty-state">
      <div class="empty-icon">🤍</div>
      <h2>お気に入りポケモンがいません</h2>
      <p>ポケモンカードのハートマークをクリックして、お気に入りに追加してみましょう！</p>
      <button @click="router.push('/list')" class="btn btn-primary">ポケモン一覧を見る</button>
    </div>

    <div v-else class="favorites-grid">
      <PokemonCard
        v-for="pokemon in sortedFavorites"
        :key="pokemon.id"
        :pokemon="pokemon"
        @select="selectPokemon"
      />
    </div>
  </div>
</template>

<style scoped>
.favorites-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: var(--pokemon-primary);
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h2 {
  color: var(--text-color-primary);
  margin-bottom: 15px;
}

.empty-state p {
  margin-bottom: 25px;
  line-height: 1.6;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .header h1 {
    font-size: 2rem;
  }
}
</style>
