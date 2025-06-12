<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPokemonDetail, getColorByJapaneseType } from '@/utils/pokemonApi.js'
import { ERROR_MESSAGES } from '@/constants/pokemon.js'
import Loader from '@/components/Loader.vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const route = useRoute()
const router = useRouter()

// リアクティブなデータ
const pokemon = ref(null)
const loading = ref(false)
const error = ref(null)

// Computed
const primaryTypeColor = computed(() => {
  const firstType = pokemon.value?.types?.[0]
  return firstType ? getColorByJapaneseType(firstType) : '#ddd'
})

const cardBorderColor = computed(() => primaryTypeColor.value)

const cardBackgroundGradient = computed(() => {
  const color = primaryTypeColor.value
  return `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`
})

// Methods
const loadPokemonDetail = async () => {
  const pokemonId = route.params.id

  if (!pokemonId) {
    error.value = ERROR_MESSAGES.POKEMON_ID_NOT_SPECIFIED
    return
  }

  loading.value = true
  error.value = null

  try {
    pokemon.value = await fetchPokemonDetail(pokemonId)
  } catch (err) {
    error.value = ERROR_MESSAGES.POKEMON_DATA_ERROR
    console.error(ERROR_MESSAGES.POKEMON_DATA_ERROR, err)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const goToEvolution = (evolutionPokemon) => {
  router.push(`/pokemon/${evolutionPokemon.id}`)
}

const getTypeColor = (type) => {
  return getColorByJapaneseType(type)
}

const formatHeight = (height) => {
  return (height / 10).toFixed(1)
}

const formatWeight = (weight) => {
  return (weight / 10).toFixed(1)
}

const getStatName = (statName) => {
  const statNames = {
    hp: 'HP',
    attack: '攻撃',
    defense: '防御',
    'special-attack': '特攻',
    'special-defense': '特防',
    speed: '素早さ',
  }
  return statNames[statName] || statName
}

// 進化チェーンをレベル別にグループ化
const groupedEvolutions = computed(() => {
  if (!pokemon.value?.evolutionFamily) return {}

  const groups = {}
  pokemon.value.evolutionFamily.forEach((evolution) => {
    const level = evolution.evolutionLevel
    if (!groups[level]) {
      groups[level] = []
    }
    groups[level].push(evolution)
  })

  return groups
})

const maxLevel = computed(() => {
  return Math.max(...Object.keys(groupedEvolutions.value).map(Number))
})

const getEvolutionLevelName = (level) => {
  const levelNames = {
    0: '基本形態',
    1: '第1進化',
    2: '第2進化',
    3: '第3進化',
  }
  return levelNames[level] || `レベル${level}`
}

/**
 * route.params.idが変更されたときにポケモンの詳細を再読み込み
 */
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await loadPokemonDetail()
    }
  },
)

// ライフサイクル
onMounted(async () => {
  await loadPokemonDetail()
})
</script>

<template>
  <div class="pokemon-detail-view">
    <!-- 戻るボタン -->
    <div class="header-controls">
      <button @click="goBack" class="btn btn-secondary btn--medium">← 戻る</button>
      <!-- お気に入りボタン -->
      <FavoriteButton
        v-if="pokemon"
        :pokemon="pokemon"
        size="medium"
        variant="button"
        @toggle="handleFavoriteToggle"
      />
    </div>

    <!-- ローディング表示 -->
    <Loader v-if="loading" text="ポケモンの詳細を読み込み中..." />

    <!-- エラー表示 -->
    <div v-else-if="error" class="error">
      <p>エラーが発生しました: {{ error }}</p>
      <button @click="loadPokemonDetail" class="btn btn-primary">再試行</button>
    </div>

    <!-- ポケモン詳細 -->
    <div v-else-if="pokemon" class="pokemon-detail">
      <!-- 基本情報カード -->
      <div class="pokemon-main-card">
        <FavoriteButton
          :pokemon="pokemon"
          size="large"
          variant="icon"
          class="card-favorite-button"
          @toggle="handleFavoriteToggle"
        />
        <div class="pokemon-header">
          <h1>No.{{ pokemon.id }} {{ pokemon.name }}</h1>
        </div>

        <div class="pokemon-content">
          <div class="pokemon-image-section">
            <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-main-image" />
          </div>

          <div class="pokemon-info-section">
            <!-- タイプ -->
            <div class="info-group">
              <h3>タイプ</h3>
              <div class="types">
                <span
                  v-for="type in pokemon.types"
                  :key="type"
                  class="type-badge"
                  :style="{ backgroundColor: getTypeColor(type) }"
                >
                  {{ type }}
                </span>
              </div>
            </div>

            <!-- フレーバーテキスト（図鑑説明文） -->
            <div v-if="pokemon.flavorText" class="flavor-text-card">
              <h2>図鑑説明</h2>
              <p class="flavor-text">{{ pokemon.flavorText }}</p>
            </div>

            <!-- 基本データ -->
            <div class="info-group">
              <h3>基本データ</h3>
              <div class="basic-stats">
                <div class="stat-item">
                  <span class="stat-label">身長</span>
                  <span class="stat-value">{{ formatHeight(pokemon.height) }}m</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">体重</span>
                  <span class="stat-value">{{ formatWeight(pokemon.weight) }}kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 種族値 -->
      <div class="stats-card">
        <h2>種族値</h2>
        <div class="stats-grid">
          <div v-for="stat in pokemon.stats" :key="stat.name" class="stat-row">
            <span class="stat-name">{{ getStatName(stat.name) }}</span>
            <div class="stat-bar-container">
              <div
                class="stat-bar"
                :style="{
                  width: `${Math.min((stat.value / 200) * 100, 100)}%`,
                  backgroundColor: primaryTypeColor,
                }"
              ></div>
              <span class="stat-value">{{ stat.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 進化チェーン -->
      <div
        v-if="pokemon.evolutionFamily && pokemon.evolutionFamily.length > 1"
        class="evolution-card"
      >
        <h2>進化ファミリー</h2>

        <!-- レベル別進化表示 -->
        <div v-for="(levelGroup, level) in groupedEvolutions" :key="level" class="evolution-level">
          <h3 v-if="Object.keys(groupedEvolutions).length > 1" class="evolution-level-title">
            {{ getEvolutionLevelName(level) }}
          </h3>

          <div class="evolution-group">
            <div v-for="evolution in levelGroup" :key="evolution.id" class="evolution-item">
              <div
                class="evolution-pokemon"
                :class="{ active: evolution.id === pokemon.id }"
                @click="goToEvolution(evolution)"
              >
                <img :src="evolution.image" :alt="evolution.name" />
                <p>{{ evolution.name }}</p>
                <span class="pokemon-id">No.{{ evolution.id }}</span>
              </div>
            </div>
          </div>

          <!-- 次のレベルへの矢印 -->
          <div v-if="level < maxLevel" class="evolution-arrow-down">↓</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-detail-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.pokemon-main-card {
  border: 3px solid v-bind(cardBorderColor);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  background: v-bind(cardBackgroundGradient);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  position: relative;
}

.pokemon-header h1 {
  color: var(--text-primary);
  margin-bottom: 20px;
  font-size: 2.5rem;
  text-align: center;
}

.pokemon-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: start;
}

.pokemon-image-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pokemon-main-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: contain;
}

.info-group {
  margin-bottom: 25px;
}

.info-group h3 {
  color: var(--text-primary);
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.types {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: wrap;
}

.type-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
}

.basic-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}

.stat-label {
  font-weight: bold;
  color: var(--text-secondary);
}

.stat-value {
  font-weight: bold;
  color: var(--text-primary);
}

.stats-card,
.evolution-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stats-card h2,
.evolution-card h2 {
  color: var(--text-primary);
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.stats-grid {
  display: grid;
  gap: 15px;
}

.stat-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 15px;
}

.stat-name {
  font-weight: bold;
  color: var(--text-secondary);
}

.stat-bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.stat-bar {
  height: 20px;
  border-radius: 10px;
  transition: width 0.5s ease;
  min-width: 20px;
}

.evolution-chain {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}

.evolution-item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.evolution-pokemon {
  text-align: center;
  cursor: pointer;
  padding: 15px;
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.evolution-pokemon:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.evolution-pokemon.active {
  border-color: v-bind(primaryTypeColor);
  background: v-bind(cardBackgroundGradient);
}

.evolution-pokemon img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.evolution-pokemon p {
  margin-top: 8px;
  font-weight: bold;
  color: var(--text-primary);
}

.evolution-arrow {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-secondary);
}

.evolution-level {
  margin-bottom: 30px;
  width: fit-content;
}

.evolution-level-title {
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin-bottom: 15px;
  text-align: center;
}

.evolution-group {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}

.evolution-arrow-down {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-secondary);
  margin: 15px 0;
  text-align: center;
}

.pokemon-id {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* 分岐進化の場合のスタイル調整 */
.evolution-group .evolution-item {
  margin: 0 10px;
}

.error {
  text-align: center;
  padding: 40px;
  color: var(--error-color);
}

.card-favorite-button {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .header-controls {
    flex-direction: column;
    gap: 10px;
  }

  .pokemon-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .basic-stats {
    grid-template-columns: 1fr;
  }

  .stat-row {
    grid-template-columns: 80px 1fr;
  }

  .evolution-group {
    flex-direction: column;
    align-items: center;
  }

  .evolution-chain {
    flex-direction: column;
  }

  .evolution-item {
    flex-direction: column;
  }

  .evolution-arrow {
    transform: rotate(90deg);
  }
}
</style>
