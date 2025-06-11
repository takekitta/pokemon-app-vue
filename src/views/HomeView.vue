<script>
import { fetchPokemon, getColorByJapaneseType } from '@/utils/pokemonApi.js'
import { TOTAL_POKEMON } from '@/constants/pokemon.js'
import Loader from '@/components/Loader.vue'

export default {
  name: 'HomeView',
  components: {
    Loader,
  },
  data() {
    return {
      pokemon: null,
      loading: false,
      error: null,
      inputId: null, // ユーザーが入力するポケモンID
      TOTAL_POKEMON, // 全ポケモン数を定数として使用
    }
  },

  async mounted() {
    await this.loadPokemon(25) // 初期表示はピカチュウ
  },

  computed: {
    primaryTypeColor() {
      const firstType = this.pokemon?.types?.[0]
      return firstType ? getColorByJapaneseType(firstType) : '#ddd'
    },

    cardBorderColor() {
      return this.primaryTypeColor
    },

    cardBackgroundGradient() {
      const color = this.primaryTypeColor
      return `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`
    },

    /**
     * 入力されたIDが有効かどうかをチェック
     */
    isValidId() {
      return this.inputId && this.inputId >= 1 && this.inputId <= TOTAL_POKEMON
    },
  },

  methods: {
    async loadPokemon(pokemonId) {
      this.loading = true
      this.error = null

      try {
        this.pokemon = await fetchPokemon(pokemonId)
      } catch (err) {
        this.error = err.message
        console.error('ポケモンの読み込みに失敗:', err)
      } finally {
        this.loading = false
      }
    },

    async loadRandomPokemon() {
      const randomId = Math.floor(Math.random() * TOTAL_POKEMON) + 1
      await this.loadPokemon(randomId)
    },

    async loadPreviousPokemon() {
      if (this.pokemon && this.pokemon.id > 1) {
        await this.loadPokemon(this.pokemon.id - 1)
      }
    },

    async loadNextPokemon() {
      if (this.pokemon && this.pokemon.id < TOTAL_POKEMON) {
        await this.loadPokemon(this.pokemon.id + 1)
      }
    },

    async loadPokemonById() {
      if (this.isValidId) {
        await this.loadPokemon(this.inputId)
        this.inputId = null // 入力をクリア
      }
    },

    /**
     * タイプの色を取得
     */
    getTypeColor(type) {
      return getColorByJapaneseType(type)
    },

    /**
     * 身長と体重のフォーマット
     */
    formatHeight(height) {
      return (height / 10).toFixed(1)
    },

    formatWeight(weight) {
      return (weight / 10).toFixed(1)
    },
  },
}
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
      <button @click="loadPokemonById" :disabled="loading || !isValidId" class="btn btn-primary">
        検索
      </button>
    </div>

    <!-- ローディング表示 -->
    <Loader v-if="loading" text="ポケモンを読み込み中..." />

    <!-- ポケモン表示 -->
    <div v-else-if="pokemon" class="pokemon-card">
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
    <div v-else-if="error" class="error">エラーが発生しました: {{ error }}</div>
  </div>
</template>

<style scoped>
.pokemon-card {
  border: 3px solid v-bind(cardBorderColor);
  border-radius: 15px;
  padding: 30px;
  margin: 20px auto;
  max-width: 350px;
  min-height: 400px;
  background: v-bind(cardBackgroundGradient);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-in;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.pokemon-card h2 {
  color: var(--pokemon-primary);
  margin-bottom: 10px;
  font-size: 24px;
}

.pokemon-card h3 {
  color: var(--text-primary);
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
</style>
