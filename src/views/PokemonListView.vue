<script setup>
import { ref, onMounted } from 'vue'
import { fetchPokemonList } from '@/utils/pokemonApi.js'
import PokemonCard from '@/components/PokemonCard.vue'
import Loader from '@/components/Loader.vue'

const pokemonList = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalCount = ref(0)
const totalPages = ref(0)

const loadPokemonList = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await fetchPokemonList(currentPage.value, itemsPerPage.value)
    pokemonList.value = data.pokemon
    totalCount.value = data.total
    totalPages.value = data.totalPages
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value && !loading.value) {
    currentPage.value++
    await loadPokemonList()
    scrollToTop()
  }
}

const previousPage = async () => {
  if (currentPage.value > 1 && !loading.value) {
    currentPage.value--
    await loadPokemonList()
    scrollToTop()
  }
}

const selectPokemon = (pokemon) => {
  // TODO: ポケモン選択時の処理を実装
  console.log('選択されたポケモン:', pokemon)
  alert(`${pokemon.name}が選択されました！`)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  await loadPokemonList()
})
</script>

<template>
  <div class="pokemon-list-view">
    <div class="header">
      <p class="subtitle">{{ totalCount }}匹のポケモンが登録されています</p>
    </div>

    <!-- ローディング表示 -->
    <Loader v-if="loading" text="ポケモンを読み込み中..." />

    <!-- エラー表示 -->
    <div v-else-if="error" class="error">
      <p>エラーが発生しました: {{ error }}</p>
      <button @click="loadPokemonList" class="btn btn-primary">再試行</button>
    </div>

    <!-- ポケモン一覧 -->
    <div v-else class="content">
      <div class="pokemon-grid">
        <PokemonCard
          v-for="pokemon in pokemonList"
          :key="pokemon.id"
          :pokemon="pokemon"
          @select="selectPokemon"
        />
      </div>

      <!-- ページネーション -->
      <div v-if="pokemonList.length > 0" class="pagination">
        <button
          @click="previousPage"
          :disabled="currentPage === 1 || loading"
          class="btn btn-secondary"
        >
          ← 前へ
        </button>

        <div class="page-info">
          <span class="current-page">{{ currentPage }}</span>
          <span class="separator">/</span>
          <span class="total-pages">{{ totalPages }}</span>
        </div>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages || loading"
          class="btn btn-secondary"
        >
          次へ →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: var(--pokemon-primary);
  font-size: 2.5rem;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0 40px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 40px 0;
  padding: 20px;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: bold;
}

.current-page {
  color: var(--pokemon-primary);
  font-size: 1.4rem;
}

.separator {
  color: var(--text-secondary);
}

.total-pages {
  color: var(--text-secondary);
}

.error {
  text-align: center;
  padding: 40px;
  color: var(--error-color);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .pokemon-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .pagination {
    flex-direction: column;
    gap: 15px;
  }

  .header h1 {
    font-size: 2rem;
  }
}
</style>
