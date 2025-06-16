import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSilhouetteQuiz } from '@/composables/useSilhouetteQuiz.js'

// fetchPokemonをモック
vi.mock('@/utils/pokemonApi.js', () => ({
  fetchPokemon: vi.fn(),
}))

import { fetchPokemon } from '@/utils/pokemonApi.js'

describe('useSilhouetteQuiz', () => {
  let quiz

  beforeEach(() => {
    vi.clearAllMocks()
    quiz = useSilhouetteQuiz()
  })

  describe('初期状態', () => {
    it('初期値が正しく設定されている', () => {
      expect(quiz.currentPokemon.value).toBeNull()
      expect(quiz.userAnswer.value).toBe('')
      expect(quiz.showAnswer.value).toBe(false)
      expect(quiz.score.value).toBe(0)
      expect(quiz.totalQuestions.value).toBe(0)
      expect(quiz.loading.value).toBe(false)
      expect(quiz.error.value).toBeNull()
    })

    it('正解率が正しく計算される', () => {
      // 初期状態
      expect(quiz.accuracy.value).toBe(0)

      // スコア設定後
      quiz.score.value = 3
      quiz.totalQuestions.value = 5
      expect(quiz.accuracy.value).toBe(60)
    })

    it('ユーザーの回答が正しいかどうかが正しく判定される', () => {
      // 初期状態
      expect(quiz.isCorrect.value).toBe(false)

      // ポケモンと回答設定後
      quiz.currentPokemon.value = { name: 'ピカチュウ' }
      quiz.userAnswer.value = 'ピカチュウ'
      expect(quiz.isCorrect.value).toBe(true)
    })
  })

  describe('ランダムなポケモンを生成される', () => {
    it('正常にポケモンデータを取得する', async () => {
      const mockPokemon = {
        id: 25,
        name: 'ピカチュウ',
        image: 'test-image.png',
      }
      fetchPokemon.mockResolvedValue(mockPokemon)

      await quiz.generateRandomPokemon()

      expect(quiz.currentPokemon.value).toEqual(mockPokemon)
      expect(quiz.showAnswer.value).toBe(false)
      expect(quiz.userAnswer.value).toBe('')
      expect(quiz.loading.value).toBe(false)
    })

    it('ローディング状態を管理する', async () => {
      fetchPokemon.mockResolvedValue({})

      const promise = quiz.generateRandomPokemon()
      expect(quiz.loading.value).toBe(true)

      await promise
      expect(quiz.loading.value).toBe(false)
    })

    it('エラー時の処理', async () => {
      fetchPokemon.mockRejectedValue(new Error('Network error'))

      await quiz.generateRandomPokemon()

      expect(quiz.error.value).toBe('ポケモンの取得に失敗しました')
      expect(quiz.loading.value).toBe(false)
    })

    it('状態のリセット処理', async () => {
      quiz.showAnswer.value = true
      quiz.userAnswer.value = 'テスト'
      fetchPokemon.mockResolvedValue({})

      await quiz.generateRandomPokemon()

      expect(quiz.showAnswer.value).toBe(false)
      expect(quiz.userAnswer.value).toBe('')
    })

    it('ランダムID生成（1-151）', () => {
      const mathSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5)
      fetchPokemon.mockResolvedValue({})

      quiz.generateRandomPokemon()

      expect(fetchPokemon).toHaveBeenCalledWith(76) // Math.floor(0.5 * 151) + 1
      mathSpy.mockRestore()
    })

    it('ランダムID生成の境界値テスト', () => {
      // 最小値
      const mathSpy1 = vi.spyOn(Math, 'random').mockReturnValue(0)
      quiz.generateRandomPokemon()
      expect(fetchPokemon).toHaveBeenCalledWith(1)

      // 最大値
      const mathSpy2 = vi.spyOn(Math, 'random').mockReturnValue(0.999)
      quiz.generateRandomPokemon()
      expect(fetchPokemon).toHaveBeenCalledWith(151)

      mathSpy1.mockRestore()
      mathSpy2.mockRestore()
    })
    it('複数回のクイズ実行後の状態', async () => {
      fetchPokemon.mockResolvedValue({ name: 'ピカチュウ' })

      // 1回目
      await quiz.generateRandomPokemon()
      quiz.userAnswer.value = 'ピカチュウ'
      quiz.checkAnswer()

      // 2回目
      await quiz.nextQuestion()
      quiz.userAnswer.value = 'フシギダネ'
      quiz.checkAnswer()

      expect(quiz.score.value).toBe(1)
      expect(quiz.totalQuestions.value).toBe(2)
      expect(quiz.accuracy.value).toBe(50)
    })
  })

  describe('ユーザーの回答をチェックし、正解かどうかを判定する', () => {
    beforeEach(() => {
      quiz.currentPokemon.value = { name: 'ピカチュウ' }
    })

    it('正解時の処理', () => {
      quiz.userAnswer.value = 'ピカチュウ'

      const result = quiz.checkAnswer()

      expect(result).toBe(true)
      expect(quiz.score.value).toBe(1)
      expect(quiz.totalQuestions.value).toBe(1)
      expect(quiz.showAnswer.value).toBe(true)
    })

    it('不正解時の処理', () => {
      quiz.userAnswer.value = 'フシギダネ'

      const result = quiz.checkAnswer()

      expect(result).toBe(false)
      expect(quiz.score.value).toBe(0)
      expect(quiz.totalQuestions.value).toBe(1)
      expect(quiz.showAnswer.value).toBe(true)
    })

    it('空欄時の処理', () => {
      quiz.userAnswer.value = ''

      const result = quiz.checkAnswer()

      expect(result).toBe(false)
      expect(quiz.totalQuestions.value).toBe(0)
      expect(quiz.showAnswer.value).toBe(false)
    })

    it('スコア更新', () => {
      quiz.userAnswer.value = 'ピカチュウ'
      quiz.checkAnswer()

      quiz.userAnswer.value = 'ピカチュウ'
      quiz.checkAnswer()

      expect(quiz.score.value).toBe(2)
    })

    it('showAnswer状態変更', () => {
      quiz.userAnswer.value = 'テスト'

      quiz.checkAnswer()

      expect(quiz.showAnswer.value).toBe(true)
    })
  })

  describe('nextQuestion', () => {
    it('新しいポケモンを生成する', async () => {
      const mockPokemon = { name: 'フシギダネ' }
      fetchPokemon.mockResolvedValue(mockPokemon)

      await quiz.nextQuestion()

      expect(fetchPokemon).toHaveBeenCalled()
      expect(quiz.currentPokemon.value).toEqual(mockPokemon)
    })
  })

  describe('computed', () => {
    it('正解率計算とゼロ除算対応', () => {
      // ゼロ除算対応
      expect(quiz.accuracy.value).toBe(0)

      // 正常計算
      quiz.score.value = 7
      quiz.totalQuestions.value = 10
      expect(quiz.accuracy.value).toBe(70)
    })

    it('ユーザーの回答が正しいかどうかが正しく判定される', () => {
      // 空の場合
      expect(quiz.isCorrect.value).toBe(false)

      // 正解の場合
      quiz.currentPokemon.value = { name: 'ピカチュウ' }
      quiz.userAnswer.value = 'ピカチュウ'
      expect(quiz.isCorrect.value).toBe(true)

      // 不正解の場合
      quiz.userAnswer.value = 'フシギダネ'
      expect(quiz.isCorrect.value).toBe(false)
    })
  })

  describe('状態管理', () => {
    it('resetQuiz処理', async () => {
      // 状態を変更
      quiz.score.value = 5
      quiz.totalQuestions.value = 10
      quiz.showAnswer.value = true
      quiz.userAnswer.value = 'テスト'

      fetchPokemon.mockResolvedValue({})
      await quiz.resetQuiz()

      // リセット確認
      expect(quiz.score.value).toBe(0)
      expect(quiz.totalQuestions.value).toBe(0)
      expect(quiz.showAnswer.value).toBe(false)
      expect(quiz.userAnswer.value).toBe('')
      expect(quiz.currentPokemon.value).toEqual({})
      expect(quiz.error.value).toBeNull()
      expect(fetchPokemon).toHaveBeenCalled()
    })
  })
})
