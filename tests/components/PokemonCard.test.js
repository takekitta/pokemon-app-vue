import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PokemonCard from '@/components/PokemonCard.vue'

describe('PokemonCard', () => {
  const mockPokemon = {
    id: 25,
    name: 'ピカチュウ',
    image: 'https://example.com/pikachu.png',
    types: ['でんき'],
  }

  it('ポケモンの基本情報が正しく表示される', () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon },
    })

    expect(wrapper.text()).toContain('No.25')
    expect(wrapper.text()).toContain('ピカチュウ')
    expect(wrapper.text()).toContain('でんき')
  })

  it('ポケモン画像が正しく設定される', () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon },
    })

    const img = wrapper.find('.pokemon-image')
    expect(img.attributes('src')).toBe(mockPokemon.image)
    expect(img.attributes('alt')).toBe(mockPokemon.name)
  })

  it('カードクリック時にselectイベントが発火される', async () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon },
    })

    await wrapper.find('.pokemon-card').trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0]).toEqual([mockPokemon])
  })

  it('複数タイプのポケモンを正しく表示する', () => {
    const dualTypePokemon = {
      ...mockPokemon,
      types: ['でんき', 'ひこう'],
    }

    const wrapper = mount(PokemonCard, {
      props: { pokemon: dualTypePokemon },
    })

    expect(wrapper.text()).toContain('でんき')
    expect(wrapper.text()).toContain('ひこう')
  })
})
