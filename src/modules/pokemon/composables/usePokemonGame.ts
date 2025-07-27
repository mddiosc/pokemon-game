import { computed, onMounted, ref } from 'vue'
import { GameStatus, type Pokemon, type PokemonListResponse } from '../interfaces'
import { pokemonApi } from '../api/pokemonApi'
import confetti from 'canvas-confetti'

export const usePokemonGame = () => {
  const gameStatus = ref<GameStatus>(GameStatus.Playing)
  const pokemons = ref<Pokemon[]>([])
  const pokemonOptions = ref<Pokemon[]>([])

  // Sistema de puntuación
  const score = ref(0)
  const streak = ref(0)
  const totalQuestions = ref(0)
  const correctAnswers = ref(0)
  const bestStreak = ref(0)
  const round = ref(1)

  const randomPokemon = computed(() => {
    return pokemonOptions.value[Math.floor(Math.random() * pokemonOptions.value.length)]
  })

  const isLoading = computed(() => pokemons.value.length === 0)

  // Estadísticas computadas
  const accuracy = computed(() => {
    if (totalQuestions.value === 0) return 0
    return Math.round((correctAnswers.value / totalQuestions.value) * 100)
  })

  const currentLevel = computed(() => {
    return Math.floor(score.value / 100) + 1
  })

  const pointsToNextLevel = computed(() => {
    const nextLevelScore = currentLevel.value * 100
    return nextLevelScore - score.value
  })

  const progressPercentage = computed(() => {
    const currentLevelScore = (currentLevel.value - 1) * 100
    const nextLevelScore = currentLevel.value * 100
    const currentProgress = score.value - currentLevelScore
    const levelRange = nextLevelScore - currentLevelScore
    return Math.round((currentProgress / levelRange) * 100)
  })

  const getPokemons = async (): Promise<Pokemon[]> => {
    const response = await pokemonApi.get<PokemonListResponse>('/?limit=151')

    const pokemonsArray: Pokemon[] = response.data.results.map((pokemon) => {
      const urlParts = pokemon.url.split('/')
      const id = urlParts[urlParts.length - 2] ?? 0
      return {
        id: Number(id),
        name: pokemon.name,
      }
    })

    return pokemonsArray.sort(() => Math.random() - 0.5)
  }

  const getNextRound = (howMany: number = 4) => {
    gameStatus.value = GameStatus.Playing
    pokemonOptions.value = pokemons.value.slice(0, howMany)
    pokemons.value = pokemons.value.slice(howMany)
    round.value++

    // Si no hay más pokemon, reiniciar la lista
    if (pokemons.value.length < howMany) {
      resetGame()
    }
  }

  const checkAnswer = (pokemonId: Pokemon['id']) => {
    totalQuestions.value++
    const hasWon = pokemonId === randomPokemon.value.id

    if (hasWon) {
      gameStatus.value = GameStatus.Won
      correctAnswers.value++
      streak.value++

      // Sistema de puntuación
      let points = 10 // Base points
      if (streak.value > 1) {
        points += Math.min(streak.value - 1, 10) // Bonus por racha (máximo 10 extra)
      }

      score.value += points

      // Actualizar mejor racha
      if (streak.value > bestStreak.value) {
        bestStreak.value = streak.value
      }

      // Confetti especial para rachas largas
      if (streak.value >= 5) {
        confetti({
          particleCount: 500,
          spread: 180,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FF6B35', '#F7931E', '#FFE135'],
        })
      } else {
        confetti({
          particleCount: 300,
          spread: 150,
          origin: { y: 0.6 },
        })
      }

      return
    }

    // Respuesta incorrecta
    gameStatus.value = GameStatus.Lost
    streak.value = 0 // Reset streak
  }

  const resetGame = async () => {
    score.value = 0
    streak.value = 0
    totalQuestions.value = 0
    correctAnswers.value = 0
    round.value = 1
    pokemons.value = await getPokemons()
    getNextRound()
  }

  const resetStats = () => {
    bestStreak.value = 0
    resetGame()
  }

  onMounted(async () => {
    pokemons.value = await getPokemons()
    getNextRound()
  })

  return {
    // Game state
    gameStatus,
    isLoading,
    pokemonOptions,
    randomPokemon,

    // Scoring system
    score,
    streak,
    totalQuestions,
    correctAnswers,
    bestStreak,
    round,
    accuracy,
    currentLevel,
    pointsToNextLevel,
    progressPercentage,

    // Methods
    getNextRound,
    checkAnswer,
    resetGame,
    resetStats,
  }
}
