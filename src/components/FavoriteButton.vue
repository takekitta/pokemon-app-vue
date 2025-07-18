<script setup>
import { useFavorites } from '@/composables/useFavorites.js'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  variant: {
    type: String,
    default: 'icon',
    validator: (value) => ['icon', 'button'].includes(value),
  },
})

const emit = defineEmits(['toggle'])

const { isFavorite, toggleFavorite } = useFavorites()

const handleClick = (event) => {
  event.stopPropagation()
  toggleFavorite(props.pokemon)
  emit('toggle', props.pokemon, isFavorite.value(props.pokemon.id))
}
</script>

<template>
  <!-- アイコンバリアント -->
  <button
    v-if="variant === 'icon'"
    @click="handleClick"
    class="favorite-icon-button"
    :class="[`favorite-icon-button--${size}`, { 'is-favorite': isFavorite(pokemon.id) }]"
    :title="isFavorite(pokemon.id) ? 'お気に入りから削除' : 'お気に入りに追加'"
  >
    <span class="heart-icon">
      {{ isFavorite(pokemon.id) ? '❤️' : '🤍' }}
    </span>
  </button>

  <!-- ボタンバリアント -->
  <button
    v-else
    @click="handleClick"
    class="btn"
    :class="[isFavorite(pokemon.id) ? 'btn-favorite-active' : 'btn-favorite', `btn--${size}`]"
    :title="isFavorite(pokemon.id) ? 'お気に入りから削除' : 'お気に入りに追加'"
  >
    <span class="heart-icon">
      {{ isFavorite(pokemon.id) ? '❤️' : '🤍' }}
    </span>
    <span class="button-text">
      {{ isFavorite(pokemon.id) ? 'お気に入り済み' : 'お気に入りに追加' }}
    </span>
  </button>
</template>

<style scoped>
.favorite-icon-button {
  background: var(--bg-card);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  box-shadow: var(--shadow-sm);
}

.favorite-icon-button:hover {
  background: var(--bg-surface);
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.favorite-icon-button.is-favorite {
  background: var(--bg-favorite);
}

.favorite-icon-button.is-favorite:hover {
  background: var(--bg-favorite-active);
}

/* アイコンサイズバリエーション */
.favorite-icon-button--small {
  width: 24px;
  height: 24px;
}

.favorite-icon-button--medium {
  width: 32px;
  height: 32px;
}

.favorite-icon-button--large {
  width: 44px;
  height: 44px;
}

.favorite-icon-button--small .heart-icon {
  font-size: 14px;
}

.favorite-icon-button--medium .heart-icon {
  font-size: 16px;
}

.favorite-icon-button--large .heart-icon {
  font-size: 18px;
}
</style>
