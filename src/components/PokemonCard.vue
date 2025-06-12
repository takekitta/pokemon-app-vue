<script setup>
import { computed } from 'vue'
import { getColorByJapaneseType } from '@/utils/pokemonApi.js'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select'])

const primaryTypeColor = computed(() => {
  const firstType = props.pokemon?.types?.[0]
  return firstType ? getColorByJapaneseType(firstType) : '#ddd'
})

const cardBorderColor = computed(() => primaryTypeColor.value)

const cardBackgroundGradient = computed(() => {
  const color = primaryTypeColor.value
  return `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`
})

const getTypeColor = (type) => {
  return getColorByJapaneseType(type)
}

const selectPokemon = () => {
  emit('select', props.pokemon)
}
</script>

<template>
  <div class="pokemon-card" @click="selectPokemon">
    <div class="pokemon-number">No.{{ pokemon.id }}</div>
    <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-image" loading="lazy" />
    <h3 class="pokemon-name">{{ pokemon.name }}</h3>
    <div class="pokemon-types">
      <span
        v-for="type in pokemon.types"
        :key="type"
        class="type-badge"
        :style="{ backgroundColor: getTypeColor(type) }"
      >
        {{ type }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.pokemon-card {
  border: 3px solid v-bind(cardBorderColor);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  background: v-bind(cardBackgroundGradient);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-width: 4px;
}

.pokemon-number {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: bold;
}

.pokemon-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.pokemon-image:hover {
  transform: scale(1.05);
}

.pokemon-name {
  margin: 12px 0 8px 0;
  font-size: 18px;
  color: var(--text-primary);
  font-weight: bold;
}

.pokemon-types {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}

.type-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
}
</style>
