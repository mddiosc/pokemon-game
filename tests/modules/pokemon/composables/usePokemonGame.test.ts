import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { usePokemonGame } from '@/modules/pokemon/composables/usePokemonGame'
import { GameStatus } from '@/modules/pokemon/interfaces'
import type { Pokemon } from '@/modules/pokemon/interfaces'
import { flushPromises } from '@vue/test-utils'
import { nextTick, createApp } from 'vue'

// Mock dependencies
vi.mock('@/modules/pokemon/api/pokemonApi', () => ({
  pokemonApi: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          count: 151,
          next: 'https://pokeapi.co/api/v2/pokemon/?offset=151&limit=151',
          previous: null,
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
            { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
            { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
            { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' },
          ],
        },
      }),
    ),
  },
}))

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

// Helper function to create Vue app context for composables
function withSetup<T>(composable: () => T): [T, ReturnType<typeof createApp>] {
  let result: T
  const app = createApp({
    setup() {
      result = composable()
      return {}
    },
  })
  app.mount(document.createElement('div'))
  return [result!, app]
}

describe('usePokemonGame', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with correct default values', () => {
    const [result] = withSetup(() => usePokemonGame())

    expect(result.gameStatus.value).toBe(GameStatus.Playing)
    expect(result.isLoading.value).toBe(true) // Initially loading
    expect(result.pokemonOptions.value).toEqual([])
  })

  it('should process pokemon data correctly', async () => {
    const [result] = withSetup(() => usePokemonGame())

    // Wait for the API call and data processing
    await flushPromises()
    await nextTick()

    expect(result.isLoading.value).toBe(false)
    expect(result.pokemonOptions.value).toHaveLength(4) // Default howMany is 4

    // Check that pokemons have correct structure
    result.pokemonOptions.value.forEach((pokemon: Pokemon) => {
      expect(pokemon).toHaveProperty('id')
      expect(pokemon).toHaveProperty('name')
      expect(typeof pokemon.id).toBe('number')
      expect(typeof pokemon.name).toBe('string')
    })
  })

  it('should return a random pokemon from options', async () => {
    const [result] = withSetup(() => usePokemonGame())

    await flushPromises()
    await nextTick()

    expect(result.randomPokemon.value).toBeDefined()
    expect(result.pokemonOptions.value).toContain(result.randomPokemon.value)
  })

  it('should handle correct answer in checkAnswer', async () => {
    const [result] = withSetup(() => usePokemonGame())

    await flushPromises()
    await nextTick()

    const correctId = result.randomPokemon.value.id
    result.checkAnswer(correctId)

    expect(result.gameStatus.value).toBe(GameStatus.Won)

    const confetti = await import('canvas-confetti')
    expect(vi.mocked(confetti.default)).toHaveBeenCalledWith({
      particleCount: 300,
      spread: 150,
      origin: { y: 0.6 },
    })
  })

  it('should handle incorrect answer in checkAnswer', async () => {
    const [result] = withSetup(() => usePokemonGame())

    await flushPromises()
    await nextTick()

    const incorrectId = result.randomPokemon.value.id + 999 // Ensure it's different
    result.checkAnswer(incorrectId)

    expect(result.gameStatus.value).toBe(GameStatus.Lost)
  })

  it('should reset game status when getNextRound is called', async () => {
    const [result] = withSetup(() => usePokemonGame())

    await flushPromises()
    await nextTick()

    // First, lose the game
    const incorrectId = result.randomPokemon.value.id + 999
    result.checkAnswer(incorrectId)
    expect(result.gameStatus.value).toBe(GameStatus.Lost)

    // Then start a new round
    result.getNextRound()
    expect(result.gameStatus.value).toBe(GameStatus.Playing)
  })

  it('should handle different round sizes in getNextRound', async () => {
    const [result] = withSetup(() => usePokemonGame())

    await flushPromises()
    await nextTick()

    // Test with 2 options
    result.getNextRound(2)
    expect(result.pokemonOptions.value).toHaveLength(2)

    // Note: getNextRound modifies the pokemons array, so we need to test
    // that it correctly handles the remaining elements
    const remainingLength = result.pokemonOptions.value.length
    expect(remainingLength).toBeGreaterThan(0)
    expect(remainingLength).toBeLessThanOrEqual(2)
  })

  it('should parse pokemon URLs correctly to extract IDs', async () => {
    const [result] = withSetup(() => usePokemonGame())

    await flushPromises()
    await nextTick()

    // Check that IDs are correctly extracted from URLs
    expect(result.pokemonOptions.value.length).toBeGreaterThan(0)

    // Verify that all pokemon have valid IDs extracted from URLs
    result.pokemonOptions.value.forEach((pokemon: Pokemon) => {
      expect(pokemon.id).toBeTypeOf('number')
      expect(pokemon.id).toBeGreaterThan(0)
      expect(pokemon.name).toBeTypeOf('string')
      expect(pokemon.name.length).toBeGreaterThan(0)
    })

    // Test with specific known pokemon from mock data
    const charmander = result.pokemonOptions.value.find((p: Pokemon) => p.name === 'charmander')
    if (charmander) {
      expect(charmander.id).toBe(4)
    }
  })

  it('should maintain reactive state correctly', async () => {
    const [result] = withSetup(() => usePokemonGame())

    // Initial state
    expect(result.gameStatus.value).toBe(GameStatus.Playing)
    expect(result.isLoading.value).toBe(true)

    // After loading
    await flushPromises()
    await nextTick()

    expect(result.isLoading.value).toBe(false)
    expect(result.pokemonOptions.value.length).toBeGreaterThan(0)
    expect(result.randomPokemon.value).toBeDefined()
  })

  it('should have correct computed properties', async () => {
    const [result] = withSetup(() => usePokemonGame())

    // Initially loading should be true (no pokemons loaded)
    expect(result.isLoading.value).toBe(true)

    await flushPromises()
    await nextTick()

    // After loading, isLoading should be false and randomPokemon should be defined
    expect(result.isLoading.value).toBe(false)
    expect(result.randomPokemon.value).toBeDefined()
    expect(result.pokemonOptions.value).toContain(result.randomPokemon.value)
  })

  it('should call pokemonApi.get with correct parameters', async () => {
    withSetup(() => usePokemonGame())

    await flushPromises()
    await nextTick()

    const { pokemonApi } = await import('@/modules/pokemon/api/pokemonApi')
    expect(pokemonApi.get).toHaveBeenCalledWith('/?limit=151')
  })
})
