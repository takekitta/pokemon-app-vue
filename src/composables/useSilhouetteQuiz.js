import { ref, computed } from 'vue'
import { fetchPokemon } from '@/utils/pokemonApi.js'

export function useSilhouetteQuiz() {
  const currentPokemon = ref(null)
  const userAnswer = ref('')
  const showAnswer = ref(false)
  const score = ref(0)
  const totalQuestions = ref(0)
  const loading = ref(false)
  const error = ref(null)

  // 正解率を計算する
  const accuracy = computed(() => {
    return totalQuestions.value > 0 ? Math.round((score.value / totalQuestions.value) * 100) : 0
  })

  // ユーザーの回答が正しいかどうかを判定する
  const isCorrect = computed(() => {
    if (!currentPokemon.value || !userAnswer.value) return false
    return userAnswer.value.toLowerCase() === currentPokemon.value.name.toLowerCase()
  })

  /**
   * ランダムなポケモンを生成し、クイズの準備をする
   */
  const generateRandomPokemon = async () => {
    loading.value = true
    error.value = null
    const randomId = Math.floor(Math.random() * 151) + 1

    try {
      currentPokemon.value = await fetchPokemon(randomId)
      showAnswer.value = false
      userAnswer.value = ''
    } catch (err) {
      error.value = 'ポケモンの取得に失敗しました'
      console.error('ポケモンの取得に失敗:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * ユーザーの回答をチェックし、正解かどうかを判定する
   */
  const checkAnswer = () => {
    if (!userAnswer.value.trim()) return false

    totalQuestions.value++

    if (isCorrect.value) {
      score.value++
    }

    showAnswer.value = true
    return isCorrect.value
  }

  /**
   * 次の問題を生成する
   */
  const nextQuestion = async () => {
    await generateRandomPokemon()
  }

  /**
   * クイズの状態をリセットする
   */
  const resetQuiz = async () => {
    score.value = 0
    totalQuestions.value = 0
    showAnswer.value = false
    userAnswer.value = ''
    currentPokemon.value = null
    error.value = null

    await generateRandomPokemon()
  }

  return {
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
  }
}
