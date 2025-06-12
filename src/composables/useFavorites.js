import { ref, computed, watch } from 'vue'

// グローバルな状態（全コンポーネントで共有）
const favorites = ref(JSON.parse(localStorage.getItem('pokemonFavorites') || '[]'))

export function useFavorites() {
  // お気に入りに追加
  const addToFavorites = (pokemon) => {
    if (!favorites.value.find((p) => p.id === pokemon.id)) {
      favorites.value.push({
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        types: pokemon.types,
        addedAt: new Date().toISOString(),
      })
    }
  }

  // お気に入りから削除
  const removeFromFavorites = (pokemonId) => {
    const index = favorites.value.findIndex((p) => p.id === pokemonId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    }
  }

  // お気に入り状態をチェック
  const isFavorite = computed(() => (pokemonId) => {
    return favorites.value.some((p) => p.id === pokemonId)
  })

  // お気に入りの切り替え
  const toggleFavorite = (pokemon) => {
    if (isFavorite.value(pokemon.id)) {
      removeFromFavorites(pokemon.id)
    } else {
      addToFavorites(pokemon)
    }
  }

  // お気に入り数
  const favoriteCount = computed(() => favorites.value.length)

  // ローカルストレージに自動保存
  watch(
    favorites,
    (newFavorites) => {
      localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites))
    },
    { deep: true },
  )

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    favoriteCount,
  }
}
