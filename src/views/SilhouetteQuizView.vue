<script setup>
import { onMounted, watch } from 'vue'
import { useSilhouetteQuiz } from '@/composables/useSilhouetteQuiz.js'
import Loader from '@/components/Loader.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const {
  currentPokemon,
  userAnswer,
  showAnswer,
  score,
  totalQuestions,
  loading,
  error,
  accuracy,
  isCorrect,
  generateRandomPokemon,
  checkAnswer,
  nextQuestion,
  resetQuiz,
} = useSilhouetteQuiz()

const handleNextQuestion = async () => {
  await nextQuestion()
}

const handleCheckAnswer = () => {
  if (!userAnswer.value.trim()) {
    toast.warning('ポケモンの名前を入力してください')
    return
  }

  const result = checkAnswer()

  if (result) {
    toast.success(`🎉 正解！${currentPokemon.value.name}でした！`, {
      timeout: 5000,
    })
  } else {
    toast.error(`❌ 不正解！正解は「${currentPokemon.value.name}」でした`, {
      timeout: 5000,
    })
  }
}

const handleKeyDown = (event) => {
  // Enterキー以外は無視
  if (event.keyCode !== 13) return

  // IME変換中は無視
  if (event.isComposing) return

  handleCheckAnswer()
}

watch(error, (newError) => {
  if (newError) {
    toast.error(newError)
  }
})

onMounted(() => {
  generateRandomPokemon()
})
</script>

<template>
  <div class="silhouette-quiz">
    <div class="quiz-header">
      <h1>ポケモンシルエットクイズ</h1>
      <p class="subtitle">「だーれだ？」</p>
      <div class="score-container">
        <div class="score">スコア: {{ score }} / {{ totalQuestions }}</div>
        <div v-if="totalQuestions > 0" class="accuracy">正答率: {{ accuracy }}%</div>
      </div>
    </div>

    <!-- エラー表示 -->
    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="generateRandomPokemon" class="btn btn-primary">再試行</button>
    </div>

    <Loader v-else-if="loading" text="ポケモンの詳細を読み込み中..." />

    <div v-else-if="currentPokemon" class="quiz-content">
      <div class="pokemon-image-container">
        <img
          :src="currentPokemon.image"
          :alt="showAnswer ? currentPokemon.name : 'シルエット'"
          :class="{ 'pokemon-silhouette': !showAnswer }"
          class="pokemon-image no-drag"
          draggable="false"
          @contextmenu.prevent
          @selectstart.prevent
          @dragstart.prevent
        />
      </div>

      <!-- 回答フォーム -->
      <div v-if="!showAnswer" class="answer-form">
        <input
          v-model="userAnswer"
          @keydown="handleKeyDown"
          type="text"
          placeholder="ポケモンの名前を入力"
          class="answer-input"
        />
        <button @click="handleCheckAnswer" :disabled="!userAnswer.trim()" class="btn btn-primary">
          答え合わせ
        </button>
      </div>

      <!-- 正解表示 -->
      <div v-else class="answer-reveal">
        <h2 :class="{ correct: isCorrect, incorrect: !isCorrect }">
          {{ currentPokemon.name }}
        </h2>
        <div class="action-buttons">
          <button @click="handleNextQuestion" class="btn btn-secondary">次の問題</button>
          <button @click="resetQuiz" class="btn btn-outline">リセット</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.silhouette-quiz {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.quiz-header h1 {
  color: var(--pokemon-primary);
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.score {
  background: var(--pokemon-primary);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 30px;
}

.pokemon-image-container {
  margin: 30px 0;
  /* 画像保護の強化 */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.pokemon-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  transition: filter 0.5s ease;
}

.pokemon-silhouette {
  filter: brightness(0%);
}

/* 画像のドラッグ禁止 */
.no-drag {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
}

.answer-form {
  margin: 30px 0;
}

.answer-input {
  padding: 12px 20px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-right: 10px;
}

.answer-reveal h2 {
  color: var(--pokemon-primary);
  font-size: 2rem;
  margin: 20px 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.score-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin-bottom: 30px;
}

.accuracy {
  background: var(--pokemon-secondary);
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.9rem;
}

.btn-outline {
  background: transparent;
  color: var(--pokemon-primary);
  border: 2px solid var(--pokemon-primary);
}

.btn-outline:hover {
  background: var(--pokemon-primary);
  color: white;
}

.error {
  text-align: center;
  padding: 20px;
  color: var(--error-color);
  background: var(--error-bg);
  border-radius: 8px;
  margin: 20px 0;
}

h2.correct {
  color: var(--type-grass);
}

h2.incorrect {
  color: var(--error-color);
}
</style>
