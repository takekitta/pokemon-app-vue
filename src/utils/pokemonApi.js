import {
  TOTAL_POKEMON,
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

/**
 * ポケモンリストを取得（ページネーション対応）
 * @param {number} page - ページ番号（1から開始）
 * @param {number} limit - 1ページあたりの件数
 * @returns {Promise<Object>} ポケモンリストデータ
 */
export async function fetchPokemonList(page = 1, limit = 20) {
  const offset = (page - 1) * limit

  // 最大ポケモン数を超えないようにチェック
  if (offset >= TOTAL_POKEMON) {
    throw new Error(`指定されたページは存在しません。最大${TOTAL_POKEMON}匹です。`)
  }

  // 最後のページで取得件数を調整
  const adjustedLimit = Math.min(limit, TOTAL_POKEMON - offset)

  try {
    // ポケモンリストを取得
    const response = await fetch(
      `${POKEMON_API_ENDPOINTS.POKEMON}?limit=${adjustedLimit}&offset=${offset}`,
    )

    if (!response.ok) {
      throw new Error(`ポケモンリストの取得に失敗: ${response.status}`)
    }

    const data = await response.json()

    // 各ポケモンの詳細情報を並列取得
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const id = extractIdFromUrl(pokemon.url)
        // IDが範囲内かチェック
        if (id <= TOTAL_POKEMON) {
          return await fetchPokemon(id)
        }
        return null
      }),
    )

    // nullを除外
    const validPokemon = pokemonDetails.filter((pokemon) => pokemon !== null)

    return {
      pokemon: validPokemon,
      total: TOTAL_POKEMON, // 実際のポケモン数を使用
      hasNext: offset + limit < TOTAL_POKEMON,
      hasPrevious: offset > 0,
      currentPage: page,
      totalPages: Math.ceil(TOTAL_POKEMON / limit), // 正確な総ページ数を計算
    }
  } catch (error) {
    console.error('ポケモンリストの取得エラー:', error)
    throw error
  }
}

/**
 * ポケモンURLからIDを抽出
 * @param {string} url - PokeAPIのポケモンURL
 * @returns {number} ポケモンID
 */
function extractIdFromUrl(url) {
  return parseInt(url.split('/').filter(Boolean).pop())
}
