import { describe, it, expect, beforeEach } from 'vitest'
import { useFavorites } from '@/composables/useFavorites.js'

describe('useFavorites', () => {
  beforeEach(() => {
    // ローカルストレージをクリア
    localStorage.clear()
  })

  it('初期状態では空の配列を返す', () => {
    const { favorites, favoriteCount } = useFavorites()

    expect(favorites.value).toEqual([])
    expect(favoriteCount.value).toBe(0)
  })

  it('ポケモンをお気に入りに追加できる', () => {
    const { addToFavorites, favorites, isFavorite } = useFavorites()

    const testPokemon = {
      id: 25,
      name: 'ピカチュウ',
      image: 'test-image.png',
      types: ['でんき'],
    }

    addToFavorites(testPokemon)

    expect(favorites.value).toHaveLength(1)
    expect(isFavorite.value(25)).toBe(true)
  })

  it('同じポケモンを重複して追加しない', () => {
    const { addToFavorites, favorites } = useFavorites()

    const testPokemon = {
      id: 25,
      name: 'ピカチュウ',
      image: 'test-image.png',
      types: ['でんき'],
    }

    addToFavorites(testPokemon)
    addToFavorites(testPokemon)

    expect(favorites.value).toHaveLength(1)
  })

  it('ポケモンをお気に入りから削除できる', () => {
    const { addToFavorites, removeFromFavorites, favorites, isFavorite } = useFavorites()

    const testPokemon = {
      id: 25,
      name: 'ピカチュウ',
      image: 'test-image.png',
      types: ['でんき'],
    }

    addToFavorites(testPokemon)
    removeFromFavorites(25)

    expect(favorites.value).toHaveLength(0)
    expect(isFavorite.value(25)).toBe(false)
  })

  it('お気に入りのポケモン数を正しくカウントする', () => {
    const { addToFavorites, favoriteCount } = useFavorites()

    const testPokemon1 = {
      id: 25,
      name: 'ピカチュウ',
      image: 'test-image.png',
      types: ['でんき'],
    }
    const testPokemon2 = {
      id: 26,
      name: 'ライチュウ',
      image: 'test-image2.png',
      types: ['でんき'],
    }

    addToFavorites(testPokemon1)
    addToFavorites(testPokemon2)

    expect(favoriteCount.value).toBe(2)
  })
})
