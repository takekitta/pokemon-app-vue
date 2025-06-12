// タイプの日本語翻訳
export const TYPE_TRANSLATIONS = {
  normal: 'ノーマル',
  fire: 'ほのお',
  water: 'みず',
  electric: 'でんき',
  grass: 'くさ',
  ice: 'こおり',
  fighting: 'かくとう',
  poison: 'どく',
  ground: 'じめん',
  flying: 'ひこう',
  psychic: 'エスパー',
  bug: 'むし',
  rock: 'いわ',
  ghost: 'ゴースト',
  dragon: 'ドラゴン',
  dark: 'あく',
  steel: 'はがね',
  fairy: 'フェアリー',
}

// タイプごとの色
export const TYPE_COLORS = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
}

// PokeAPIのエンドポイント
export const POKEMON_API_ENDPOINTS = {
  POKEMON: 'https://pokeapi.co/api/v2/pokemon',
  SPECIES: 'https://pokeapi.co/api/v2/pokemon-species',
}

// 言語設定
export const LANGUAGES = {
  JAPANESE: 'ja',
  ENGLISH: 'en',
}

/**
 * ポケモンの総数
 */
export const TOTAL_POKEMON = 1025

/**
 * UI表示用の定数
 */
export const UI_CONSTANTS = Object.freeze({
  DEFAULT_ITEMS_PER_PAGE: [10, 20, 50, 100],
  MAX_ITEMS_PER_PAGE: 50,
  LOADING_DELAY_MS: 300,
  ERROR_RETRY_ATTEMPTS: 3,
  ANIMATION_DURATION_MS: 300,
})

/**
 * エラーメッセージ定数
 */
export const ERROR_MESSAGES = Object.freeze({
  POKEMON_NOT_FOUND: 'ポケモンが見つかりませんでした',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  INVALID_ID: '無効なポケモンIDです',
  POKEMON_ID_NOT_SPECIFIED: 'ポケモンIDが指定されていません',
  POKEMON_DATA_ERROR: 'ポケモンデータの取得に失敗しました',
  EVOLUTION_CHAIN_ERROR: '進化チェーンの取得に失敗しました',
  SPECIES_DATA_ERROR: '種族データの取得に失敗しました',
})
