import {
  TOTAL_POKEMON,
  TYPE_COLORS,
  TYPE_TRANSLATIONS,
  POKEMON_API_ENDPOINTS,
  LANGUAGES,
  ERROR_MESSAGES,
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
    throw new Error(ERROR_MESSAGES.POKEMON_DATA_ERROR + `: ${response.status}`)
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
    throw new Error(ERROR_MESSAGES.SPECIES_DATA_ERROR + `: ${response.status}`)
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
    console.error(ERROR_MESSAGES.POKEMON_DATA_ERROR, error)
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
      throw new Error(ERROR_MESSAGES.POKEMON_NOT_FOUND + `: ${response.status}`)
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
    console.error(ERROR_MESSAGES.POKEMON_NOT_FOUND, error)
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

/**
 * 進化チェーンデータを解析（分岐進化対応版）
 * @param {Object} chain - 進化チェーンデータ
 * @returns {Array} 進化チェーンの配列
 */
function parseEvolutionChain(chain) {
  const evolutions = []

  // 再帰的に進化チェーンを解析
  function parseNode(node, level = 0) {
    if (!node) return

    const pokemonId = extractIdFromUrl(node.species.url)
    evolutions.push({
      id: pokemonId,
      name: node.species.name,
      url: node.species.url,
      level: level,
    })

    // 複数の進化先がある場合、すべてを処理
    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach((evolution) => {
        parseNode(evolution, level + 1)
      })
    }
  }

  parseNode(chain)
  return evolutions
}

/**
 * 特定のポケモンに関連する進化チェーンを取得
 * @param {number|string} pokemonId - ポケモンID
 * @returns {Promise<Object>} 進化関係のデータ
 */
export async function fetchEvolutionChain(pokemonId) {
  try {
    // まず種族データを取得
    const speciesResponse = await fetch(`${POKEMON_API_ENDPOINTS.SPECIES}/${pokemonId}`)
    if (!speciesResponse.ok) {
      throw new Error(ERROR_MESSAGES.SPECIES_DATA_ERROR + `: ${speciesResponse.status}`)
    }
    const speciesData = await speciesResponse.json()

    // 進化チェーンURLを取得
    const evolutionChainUrl = speciesData.evolution_chain.url
    const evolutionResponse = await fetch(evolutionChainUrl)
    if (!evolutionResponse.ok) {
      throw new Error(ERROR_MESSAGES.EVOLUTION_CHAIN_ERROR + `: ${evolutionResponse.status}`)
    }
    const evolutionData = await evolutionResponse.json()

    // 進化チェーン全体を解析
    const allEvolutions = parseEvolutionChain(evolutionData.chain)

    // 現在のポケモンに関連する進化情報を整理
    return organizeEvolutionData(allEvolutions, parseInt(pokemonId))
  } catch (error) {
    console.error(ERROR_MESSAGES.EVOLUTION_CHAIN_ERROR, error)
    throw error
  }
}

/**
 * 進化データを整理（現在のポケモンを中心に）
 * @param {Array} allEvolutions - 全進化データ
 * @param {number} currentPokemonId - 現在のポケモンID
 * @returns {Object} 整理された進化データ
 */
function organizeEvolutionData(allEvolutions, currentPokemonId) {
  // レベル別にグループ化
  const evolutionLevels = {}
  allEvolutions.forEach((evolution) => {
    if (!evolutionLevels[evolution.level]) {
      evolutionLevels[evolution.level] = []
    }
    evolutionLevels[evolution.level].push(evolution)
  })

  // 現在のポケモンの情報を取得
  const currentPokemon = allEvolutions.find((evo) => evo.id === currentPokemonId)
  if (!currentPokemon) {
    return { evolutionFamily: allEvolutions, currentLevel: 0 }
  }

  const currentLevel = currentPokemon.level

  return {
    evolutionFamily: allEvolutions,
    currentLevel: currentLevel,
    preEvolutions: evolutionLevels[currentLevel - 1] || [],
    currentStage: evolutionLevels[currentLevel] || [],
    nextEvolutions: evolutionLevels[currentLevel + 1] || [],
    allLevels: evolutionLevels,
  }
}

/**
 * 詳細なポケモン情報を取得
 * @param {number|string} pokemonId - ポケモンID
 * @returns {Promise<Object>} 詳細なポケモンデータ
 */
export async function fetchPokemonDetail(pokemonId) {
  try {
    // 基本情報、種族情報、進化チェーンを並列取得
    const [basicData, speciesData, evolutionData] = await Promise.all([
      fetchPokemon(pokemonId),
      fetchPokemonSpecies(pokemonId),
      fetchEvolutionChain(pokemonId),
    ])

    // フレーバーテキストを取得
    const flavorText = getFlavorText(speciesData)

    // 進化ファミリーの各ポケモンの詳細情報を取得
    const evolutionDetails = await Promise.all(
      evolutionData.evolutionFamily.map(async (evolution) => {
        try {
          const pokemonDetail = await fetchPokemon(evolution.id)
          return {
            ...pokemonDetail,
            evolutionLevel: evolution.level,
          }
        } catch (error) {
          console.warn(ERROR_MESSAGES.EVOLUTION_CHAIN_ERROR, error)
          return null
        }
      }),
    )

    return {
      ...basicData,
      flavorText, // 図鑑説明文
      evolutionData,
      evolutionFamily: evolutionDetails.filter((pokemon) => pokemon !== null),
    }
  } catch (error) {
    console.error(ERROR_MESSAGES.POKEMON_DATA_ERROR, error)
    throw error
  }
}

/**
 * ポケモンのフレーバーテキスト（図鑑説明文）を取得
 * @param {Object} speciesData - 種族データ
 * @param {string} language - 言語コード（デフォルト: 'ja'）
 * @returns {string|null} フレーバーテキスト
 */
export function getFlavorText(speciesData, language = LANGUAGES.JAPANESE) {
  if (!speciesData.flavor_text_entries) return null

  // 指定言語のフレーバーテキストを検索
  const flavorEntry = speciesData.flavor_text_entries.find(
    (entry) => entry.language.name === language,
  )

  if (flavorEntry) {
    // 改行文字を除去して読みやすくする
    return flavorEntry.flavor_text.replace(/\f/g, '\n').replace(/\u00ad/g, '')
  }

  // 日本語が見つからない場合は英語を試す
  if (language !== LANGUAGES.ENGLISH) {
    const englishEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === LANGUAGES.ENGLISH,
    )
    return englishEntry ? englishEntry.flavor_text.replace(/\f/g, '\n') : null
  }

  return null
}
