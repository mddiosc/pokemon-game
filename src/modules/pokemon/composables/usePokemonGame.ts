import { computed, onMounted, ref } from 'vue'
import { GameStatus, type Pokemon, type PokemonListResponse } from '../interfaces'
import { pokemonApi } from '../api/pokemonApi'
import confetti from 'canvas-confetti'

export const usePokemonGame = () => {
  const gameStatus = ref<GameStatus>(GameStatus.Playing)
  const pokemons = ref<Pokemon[]>([])
  const pokemonOptions = ref<Pokemon[]>([])

  const randomPokemon = computed(() => {
    return pokemonOptions.value[Math.floor(Math.random() * pokemonOptions.value.length)]
  })
  const isLoading = computed(() => pokemons.value.length === 0)

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
    pokemons.value = pokemons.value.slice(0, howMany)
  }

  const checkAnswer = (pokemonId: Pokemon['id']) => {
    const hasWon = pokemonId === randomPokemon.value.id
    if (hasWon) {
      gameStatus.value = GameStatus.Won
      confetti({
        particleCount: 300,
        spread: 150,
        origin: { y: 0.6 },
      })
      return
    }
    gameStatus.value = GameStatus.Lost
  }

  onMounted(async () => {
    pokemons.value = await getPokemons()
    getNextRound()
  })

  return {
    gameStatus,
    isLoading,
    pokemonOptions,
    randomPokemon,

    // Methods
    getNextRound,
    checkAnswer,
  }
}
