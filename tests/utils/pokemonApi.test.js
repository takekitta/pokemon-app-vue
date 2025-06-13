import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchPokemon, translateType } from '@/utils/pokemonApi.js'

// fetchをモック
globalThis.fetch = vi.fn()

describe('pokemonApi', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  describe('translateType', () => {
    it('英語タイプを日本語に変換する', () => {
      expect(translateType('electric')).toBe('でんき')
      expect(translateType('fire')).toBe('ほのお')
      expect(translateType('water')).toBe('みず')
    })

    it('未知のタイプはそのまま返す', () => {
      expect(translateType('unknown')).toBe('unknown')
    })
  })

  describe('fetchPokemon', () => {
    it('ポケモンデータを正しく取得・整形する', async () => {
      const mockPokemonData = {
        id: 25,
        name: 'pikachu',
        sprites: {
          other: {
            'official-artwork': {
              front_default: 'https://example.com/pikachu.png',
            },
          },
        },
        types: [{ type: { name: 'electric' } }],
        stats: [{ stat: { name: 'hp' }, base_stat: 35 }],
        height: 4,
        weight: 60,
      }

      const mockSpeciesData = {
        names: [{ name: 'ピカチュウ', language: { name: 'ja' } }],
      }

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPokemonData),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSpeciesData),
        })

      const result = await fetchPokemon(25)

      expect(result).toEqual({
        id: 25,
        name: 'ピカチュウ',
        image: 'https://example.com/pikachu.png',
        types: ['でんき'],
        stats: [{ name: 'hp', value: 35 }],
        height: 4,
        weight: 60,
      })
    })
  })

  it('API呼び出し失敗時にエラーを投げる', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(fetchPokemon(25)).rejects.toThrow('Network error')
  })

  it('無効なレスポンス時にエラーを投げる', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    })

    await expect(fetchPokemon(999999)).rejects.toThrow()
  })
})
