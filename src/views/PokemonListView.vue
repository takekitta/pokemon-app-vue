<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchPokemonList } from '@/utils/pokemonApi.js'
import PokemonCard from '@/components/PokemonCard.vue'
import Loader from '@/components/Loader.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import { useRoute, useRouter } from 'vue-router'
import { UI_CONSTANTS } from '@/constants/pokemon'

// リアクティブなデータ
const pokemonList = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(UI_CONSTANTS.DEFAULT_ITEMS_PER_PAGE[1]) // デフォルトのページサイズ
const totalCount = ref(0)
const totalPages = ref(0)

const router = useRouter()
const route = useRoute()

// Methods
const updateUrlParams = (page, pageSize) => {
  const query = {
    ...route.query,
    page: page.toString(),
    limit: pageSize.toString(),
  }

  // 現在のクエリと同じ場合は更新しない
  if (route.query.page === query.page && route.query.limit === query.limit) {
    return
  }

  router.replace({ query })
}

// URLクエリパラメータから初期値を設定
const initializeFromQuery = () => {
  const queryPage = parseInt(route.query.page) || 1
  const queryLimit = parseInt(route.query.limit) || UI_CONSTANTS.DEFAULT_ITEMS_PER_PAGE[1]

  currentPage.value = Math.max(1, queryPage)
  itemsPerPage.value = UI_CONSTANTS.DEFAULT_ITEMS_PER_PAGE.includes(queryLimit)
    ? queryLimit
    : UI_CONSTANTS.DEFAULT_ITEMS_PER_PAGE[1]
}

const loadPokemonList = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await fetchPokemonList(currentPage.value, itemsPerPage.value)
    pokemonList.value = data.pokemon
    totalCount.value = data.total
    totalPages.value = data.totalPages

    // ページ数が総ページ数を超えている場合は1ページ目に戻る
    if (currentPage.value > data.totalPages && data.totalPages > 0) {
      currentPage.value = 1
      updateUrlParams(1, itemsPerPage.value)
      return loadPokemonList()
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handlePageChange = async (page) => {
  currentPage.value = page
  updateUrlParams(page, itemsPerPage.value)
  await loadPokemonList()
  scrollToTop()
}

const handlePageSizeChange = async (newPageSize) => {
  itemsPerPage.value = newPageSize
  currentPage.value = 1 // ページサイズ変更時は1ページ目に戻る
  updateUrlParams(1, newPageSize)
  await loadPokemonList()
  scrollToTop()
}

const selectPokemon = (pokemon) => {
  router.push(`/pokemon/${pokemon.id}`)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(
  () => route.query,
  (newQuery, oldQuery) => {
    // 外部からのURL変更（ブラウザの戻る/進むボタンなど）に対応
    if (newQuery.page !== oldQuery.page || newQuery.limit !== oldQuery.limit) {
      initializeFromQuery()
      loadPokemonList()
    }
  },
)

// ライフサイクル
onMounted(async () => {
  initializeFromQuery()
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
      <!-- ページネーション -->
      <PaginationComponent
        v-if="pokemonList.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalCount"
        :items-per-page="itemsPerPage"
        :loading="loading"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />

      <div class="pokemon-grid">
        <PokemonCard
          v-for="pokemon in pokemonList"
          :key="pokemon.id"
          :pokemon="pokemon"
          @select="selectPokemon"
        />
      </div>

      <!-- ページネーション -->
      <PaginationComponent
        v-if="pokemonList.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalCount"
        :items-per-page="itemsPerPage"
        :loading="loading"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
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
