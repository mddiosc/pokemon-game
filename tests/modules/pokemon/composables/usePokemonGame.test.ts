import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { usePokemonGame } from '@/modules/pokemon/composables/usePokemonGame'
import { GameStatus } from '@/modules/pokemon/interfaces'

// Mock simple de la API - datos mínimos para evitar memory leaks
const mockApiResponse = {
  data: {
    results: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
      { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    ],
  },
}

const mockPokemonApi = vi.fn(() => Promise.resolve(mockApiResponse))

vi.mock('@/modules/pokemon/api/pokemonApi', () => ({
  pokemonApi: {
    get: mockPokemonApi,
  },
}))

// Mock canvas-confetti simple
const mockConfetti = vi.fn()
vi.mock('canvas-confetti', () => ({
  default: mockConfetti,
}))
describe('usePokemonGame', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPokemonApi.mockResolvedValue(mockApiResponse)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with correct default values', () => {
    const game = usePokemonGame()

    // Test initial state
    expect(game.gameStatus.value).toBe(GameStatus.Playing)
    expect(game.isLoading.value).toBe(true)
    expect(game.pokemonOptions.value).toEqual([])

    // Test scoring system initial values
    expect(game.score.value).toBe(0)
    expect(game.streak.value).toBe(0)
    expect(game.bestStreak.value).toBe(0)
    expect(game.totalQuestions.value).toBe(0)
    expect(game.correctAnswers.value).toBe(0)
    expect(game.round.value).toBe(1)
    expect(game.accuracy.value).toBe(0)
    expect(game.currentLevel.value).toBe(1)
    expect(game.pointsToNextLevel.value).toBe(100)
    expect(game.progressPercentage.value).toBe(0)
  })

  it('should load pokemon data correctly', async () => {
    const game = usePokemonGame()

    // Wait for API call to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(mockPokemonApi).toHaveBeenCalledWith('/?limit=151')
    expect(game.isLoading.value).toBe(false)
    expect(game.pokemonOptions.value).toHaveLength(4)
    expect(game.randomPokemon.value).toBeDefined()
  })

  it('should handle correct answer', async () => {
    const game = usePokemonGame()

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 0))

    const correctId = game.randomPokemon.value.id
    game.checkAnswer(correctId)

    expect(game.gameStatus.value).toBe(GameStatus.Won)
    expect(game.score.value).toBe(10) // Base score
    expect(game.streak.value).toBe(1)
    expect(game.correctAnswers.value).toBe(1)
    expect(game.totalQuestions.value).toBe(1)
    expect(game.accuracy.value).toBe(100)
    expect(mockConfetti).toHaveBeenCalled()
  })

  it('should handle incorrect answer', async () => {
    const game = usePokemonGame()

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 0))

    const incorrectId = 999 // ID that doesn't exist in options
    game.checkAnswer(incorrectId)

    expect(game.gameStatus.value).toBe(GameStatus.Lost)
    expect(game.score.value).toBe(0)
    expect(game.streak.value).toBe(0)
    expect(game.correctAnswers.value).toBe(0)
    expect(game.totalQuestions.value).toBe(1)
    expect(game.accuracy.value).toBe(0)
    expect(mockConfetti).not.toHaveBeenCalled()
  })

  it('should reset game correctly', async () => {
    const game = usePokemonGame()

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Answer incorrectly to set game to lost state
    game.checkAnswer(999)
    expect(game.gameStatus.value).toBe(GameStatus.Lost)

    // Reset game
    game.getNextRound()
    expect(game.gameStatus.value).toBe(GameStatus.Playing)
  })

  it('should handle multiple correct answers and streak', async () => {
    const game = usePokemonGame()

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 0))

    // First correct answer
    const correctId1 = game.randomPokemon.value.id
    game.checkAnswer(correctId1)
    expect(game.streak.value).toBe(1)
    expect(game.score.value).toBe(10)

    // Start new round and answer correctly again
    game.getNextRound()
    await new Promise((resolve) => setTimeout(resolve, 0))

    const correctId2 = game.randomPokemon.value.id
    game.checkAnswer(correctId2)

    expect(game.streak.value).toBe(2)
    expect(game.correctAnswers.value).toBe(2)
    expect(game.totalQuestions.value).toBe(2)
    expect(game.accuracy.value).toBe(100)
    expect(game.score.value).toBeGreaterThan(20) // Should have streak bonus
  })

  it('should reset streak on incorrect answer but keep best streak', async () => {
    const game = usePokemonGame()

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Answer correctly first
    const correctId = game.randomPokemon.value.id
    game.checkAnswer(correctId)
    expect(game.streak.value).toBe(1)
    expect(game.bestStreak.value).toBe(1)

    // Start new round and answer incorrectly
    game.getNextRound()
    await new Promise((resolve) => setTimeout(resolve, 0))

    game.checkAnswer(999)

    expect(game.streak.value).toBe(0)
    expect(game.bestStreak.value).toBe(1) // Should remember best streak
  })

  it('should handle getNextRound with different sizes', async () => {
    const game = usePokemonGame()

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Test with 2 options
    game.getNextRound(2)
    expect(game.pokemonOptions.value).toHaveLength(2)
    expect(game.randomPokemon.value).toBeDefined()
  })

  it('should calculate level progression correctly', async () => {
    const game = usePokemonGame()

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(game.currentLevel.value).toBe(1)
    expect(game.pointsToNextLevel.value).toBe(100)
    expect(game.progressPercentage.value).toBe(0)

    // After scoring some points, progress should update
    game.checkAnswer(game.randomPokemon.value.id)
    expect(game.progressPercentage.value).toBeGreaterThan(0)
  })

  it('should parse pokemon IDs from URLs correctly', async () => {
    const game = usePokemonGame()

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 0))

    game.pokemonOptions.value.forEach((pokemon) => {
      expect(pokemon.id).toBeTypeOf('number')
      expect(pokemon.id).toBeGreaterThan(0)
      expect(pokemon.name).toBeTypeOf('string')
      expect(pokemon.name.length).toBeGreaterThan(0)
    })

    // Check specific pokemon
    const bulbasaur = game.pokemonOptions.value.find((p) => p.name === 'bulbasaur')
    expect(bulbasaur?.id).toBe(1)

    const charmander = game.pokemonOptions.value.find((p) => p.name === 'charmander')
    expect(charmander?.id).toBe(4)
  })
})
