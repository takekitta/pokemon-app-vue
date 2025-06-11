import {
  TYPE_COLORS,
  TYPE_TRANSLATIONS,
  POKEMON_API_ENDPOINTS,
  LANGUAGES,
} from '@/constants/pokemon.js'

/**
 * タイプを日本語に翻訳
 * @param {string} englishType - 英語のタイプ名
 * @returns {string} 日本語のタイプ名
 */
export function translateType(englishType) {
  return TYPE_TRANSLATIONS[englishType] || englishType
}

/**
 * 日本語タイプ名から色を取得
 * @param {string} japaneseType - 日本語のタイプ名
 * @returns {string} カラーコード
 */
export function getColorByJapaneseType(japaneseType) {
  const englishType = Object.keys(TYPE_TRANSLATIONS).find(
    (key) => TYPE_TRANSLATIONS[key] === japaneseType,
  )
  return TYPE_COLORS[englishType] || '#68A090'
}

/**
 * ポケモンの基本情報を取得
 * @param {number|string} pokemonId - ポケモンID
 * @returns {Promise<Object>} ポケモンデータ
 */
export async function fetchPokemonData(pokemonId) {
  const response = await fetch(`${POKEMON_API_ENDPOINTS.POKEMON}/${pokemonId}`)

  if (!response.ok) {
    throw new Error(`ポケモンデータの取得に失敗しました: ${response.status}`)
  }

  return await response.json()
}

/**
 * ポケモンの種族情報を取得
 * @param {number|string} pokemonId - ポケモンID
 * @returns {Promise<Object>} 種族データ
 */
export async function fetchPokemonSpecies(pokemonId) {
  const response = await fetch(`${POKEMON_API_ENDPOINTS.SPECIES}/${pokemonId}`)

  if (!response.ok) {
    throw new Error(`ポケモン種族データの取得に失敗しました: ${response.status}`)
  }

  return await response.json()
}

/**
 * 指定言語の名前を取得
 * @param {Array} names - 名前の配列
 * @param {string} language - 言語コード
 * @returns {string|null} 指定言語の名前
 */
export function getNameByLanguage(names, language = LANGUAGES.JAPANESE) {
  const nameObj = names.find((name) => name.language.name === language)
  return nameObj ? nameObj.name : null
}

/**
 * ポケモンの情報を取得して整形
 * @param {number|string} pokemonId - ポケモンID
 * @returns {Promise<Object>} 整形されたポケモンデータ
 */
export async function fetchPokemon(pokemonId) {
  try {
    // ポケモンの基本情報と種族情報を取得
    const [pokemonData, speciesData] = await Promise.all([
      fetchPokemonData(pokemonId),
      fetchPokemonSpecies(pokemonId),
    ])

    // 日本語名を取得
    const japaneseName = getNameByLanguage(speciesData.names)

    // データを整形
    return {
      id: pokemonData.id,
      name: japaneseName || pokemonData.name,
      image: pokemonData.sprites.other['official-artwork'].front_default,
      types: pokemonData.types.map((type) => translateType(type.type.name)),
      stats: pokemonData.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      height: pokemonData.height,
      weight: pokemonData.weight,
    }
  } catch (error) {
    console.error('ポケモンデータの取得エラー:', error)
    throw error
  }
}
