<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchPokemon, getColorByJapaneseType } from '@/utils/pokemonApi.js'
import { TOTAL_POKEMON, ERROR_MESSAGES } from '@/constants/pokemon.js'
import Loader from '@/components/Loader.vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import { useRouter } from 'vue-router'

/** リアクティブな変数 */
const pokemon = ref(null)
const loading = ref(false)
const error = ref(null)
const inputId = ref(null)

/** ルーター */
const router = useRouter()

/** computed */
const primaryTypeColor = computed(() => {
  const firstType = pokemon.value?.types?.[0]
  return firstType ? getColorByJapaneseType(firstType) : '#ddd'
})

const cardBorderColor = computed(() => primaryTypeColor.value)

const cardBackgroundGradient = computed(() => {
  const color = primaryTypeColor.value
  return `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`
})

const isValidId = computed(() => {
  return inputId.value && inputId.value >= 1 && inputId.value <= TOTAL_POKEMON
})

const loadPokemon = async (pokemonId) => {
  loading.value = true
  error.value = null

  try {
    pokemon.value = await fetchPokemon(pokemonId)
  } catch (err) {
    error.value = ERROR_MESSAGES.POKEMON_DATA_ERROR
    console.error(ERROR_MESSAGES.POKEMON_DATA_ERROR, err)
  } finally {
    loading.value = false
  }
}

const loadRandomPokemon = async () => {
  const randomId = Math.floor(Math.random() * TOTAL_POKEMON) + 1
  await loadPokemon(randomId)
}

const loadPreviousPokemon = async () => {
  if (pokemon.value && pokemon.value.id > 1) {
    await loadPokemon(pokemon.value.id - 1)
  }
}

const loadNextPokemon = async () => {
  if (pokemon.value && pokemon.value.id < TOTAL_POKEMON) {
    await loadPokemon(pokemon.value.id + 1)
  }
}

const loadPokemonById = async () => {
  if (isValidId.value) {
    await loadPokemon(inputId.value)
    inputId.value = null
  }
}

const selectPokemon = (pokemon) => {
  router.push(`/pokemon/${pokemon.id}`)
}

/** ヘルパー関数 */
const getTypeColor = (type) => getColorByJapaneseType(type)
const formatHeight = (height) => (height / 10).toFixed(1)
const formatWeight = (weight) => (weight / 10).toFixed(1)

onMounted(async () => {
  await loadPokemon(25) // 初期表示はピカチュウ
})
</script>

<template>
  <div class="pokemon-app">
    <!-- コントロールボタン -->
    <div class="controls">
      <button @click="loadRandomPokemon" :disabled="loading" class="btn btn-primary">
        ランダム
      </button>
      <button
        @click="loadPreviousPokemon"
        :disabled="loading || !pokemon"
        class="btn btn-secondary"
      >
        前へ
      </button>
      <button @click="loadNextPokemon" :disabled="loading || !pokemon" class="btn btn-secondary">
        次へ
      </button>
    </div>

    <!-- ID入力フィールド -->
    <div class="input-group">
      <input
        v-model.number="inputId"
        type="number"
        min="1"
        :max="TOTAL_POKEMON"
        placeholder="ID入力"
        class="pokemon-input"
        @keyup.enter="loadPokemonById"
      />
      <button
        @click="loadPokemonById"
        :disabled="loading || !isValidId"
        class="btn btn-primary btn--large"
      >
        検索
      </button>
    </div>

    <!-- ローディング表示 -->
    <Loader v-if="loading" text="ポケモンを読み込み中..." />

    <!-- ポケモン表示 -->
    <div v-else-if="pokemon" class="pokemon-card" @click="selectPokemon(pokemon)">
      <!-- お気に入りボタン -->
      <FavoriteButton
        :pokemon="pokemon"
        size="medium"
        variant="icon"
        class="card-favorite-button"
      />
      <h2>No.{{ pokemon.id }}</h2>
      <img :src="pokemon.image" :alt="pokemon.name" />
      <h3>{{ pokemon.name }}</h3>
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

      <!-- 基本情報 -->
      <div class="pokemon-info">
        <p>身長: {{ formatHeight(pokemon.height) }}m</p>
        <p>体重: {{ formatWeight(pokemon.weight) }}kg</p>
      </div>
    </div>

    <!-- エラー表示 -->
    <div v-else-if="error" class="error">{{ ERROR_MESSAGES.POKEMON_DATA_ERROR }}: {{ error }}</div>
  </div>
</template>

<style scoped>
.pokemon-card {
  border: 3px solid v-bind(cardBorderColor);
  border-radius: 15px;
  margin: 20px auto;
  max-width: 350px;
  min-height: 400px;
  background: v-bind(cardBackgroundGradient);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-in;
  position: relative;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.pokemon-card h2 {
  color: var(--pokemon-primary);
  margin-bottom: 10px;
  font-size: 24px;
}

.pokemon-card h3 {
  color: var(--text-color-primary);
  margin: 15px 0;
  font-size: 28px;
}

.pokemon-card img {
  width: 200px;
  height: 200px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.pokemon-card img:hover {
  transform: scale(1.05);
}

.card-favorite-button {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
}
</style>
