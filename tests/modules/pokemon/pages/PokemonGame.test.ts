import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import PokemonGame from '@/modules/pokemon/pages/PokemonGame.vue'
import { GameStatus } from '@/modules/pokemon/interfaces'

// Mock the composable
const mockUsePokemonGame = vi.fn()

vi.mock('@/modules/pokemon/composables/usePokemonGame', () => ({
  usePokemonGame: () => mockUsePokemonGame(),
}))

// Mock child components
vi.mock('@/modules/pokemon/components/PokemonPicture.vue', () => ({
  default: {
    name: 'PokemonPicture',
    props: ['pokemonId', 'showPokemon'],
    template:
      '<div data-testid="pokemon-picture">Pokemon Picture - ID: {{ pokemonId }}, Show: {{ showPokemon }}</div>',
  },
}))

vi.mock('@/modules/pokemon/components/PokemonOptions.vue', () => ({
  default: {
    name: 'PokemonOptions',
    props: ['options', 'blockSelection', 'correctAnswer'],
    emits: ['selectOption'],
    template: `
      <div data-testid="pokemon-options">
        <span>Pokemon Options - Count: {{ options.length }}</span>
        <button
          v-for="option in options"
          :key="option.id"
          @click="$emit('selectOption', option.id)"
          :data-testid="'option-' + option.id"
        >
          {{ option.name }}
        </button>
      </div>
    `,
  },
}))

describe('PokemonGame', () => {
  it('should render loading state when isLoading is true', () => {
    mockUsePokemonGame.mockReturnValue({
      isLoading: ref(true),
      randomPokemon: ref(null),
      gameStatus: ref(GameStatus.Playing),
      pokemonOptions: ref([]),
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    })

    const wrapper = mount(PokemonGame)

    expect(wrapper.find('h1').text()).toBe('Espere por favor')
    expect(wrapper.find('h3').text()).toBe('Cargando Pokémons...')
    expect(wrapper.find('[data-testid="pokemon-picture"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="pokemon-options"]').exists()).toBe(false)
  })

  it('should render loading state when randomPokemon is null', () => {
    mockUsePokemonGame.mockReturnValue({
      isLoading: ref(false),
      randomPokemon: ref(null),
      gameStatus: ref(GameStatus.Playing),
      pokemonOptions: ref([{ id: 1, name: 'pikachu' }]),
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    })

    const wrapper = mount(PokemonGame)

    expect(wrapper.find('h1').text()).toBe('Espere por favor')
    expect(wrapper.find('h3').text()).toBe('Cargando Pokémons...')
    expect(wrapper.find('[data-testid="pokemon-picture"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="pokemon-options"]').exists()).toBe(false)
  })

  it('should render game content when loaded and playing', () => {
    mockUsePokemonGame.mockReturnValue({
      isLoading: ref(false),
      randomPokemon: ref({ id: 25, name: 'pikachu' }),
      gameStatus: ref(GameStatus.Playing),
      pokemonOptions: ref([
        { id: 25, name: 'pikachu' },
        { id: 1, name: 'bulbasaur' },
      ]),
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    })

    const wrapper = mount(PokemonGame)

    expect(wrapper.find('h1').text()).toBe('¿Quien es este Pokémon?')
    expect(wrapper.find('[data-testid="pokemon-picture"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="pokemon-options"]').exists()).toBe(true)
    expect(wrapper.find('button').text()).not.toBe('Jugar de nuevo') // No "Jugar de nuevo" button when playing
  })

  it('should show "Jugar de nuevo" button when game is won', () => {
    const mockGetNextRound = vi.fn()

    mockUsePokemonGame.mockReturnValue({
      isLoading: ref(false),
      randomPokemon: ref({ id: 25, name: 'pikachu' }),
      gameStatus: ref(GameStatus.Won),
      pokemonOptions: ref([
        { id: 25, name: 'pikachu' },
        { id: 1, name: 'bulbasaur' },
      ]),
      checkAnswer: vi.fn(),
      getNextRound: mockGetNextRound,
    })

    const wrapper = mount(PokemonGame)

    expect(wrapper.find('h1').text()).toBe('¿Quien es este Pokémon?')
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Jugar de nuevo')

    wrapper.find('button').trigger('click')
    expect(mockGetNextRound).toHaveBeenCalledOnce()
  })

  it('should show "Jugar de nuevo" button when game is lost', () => {
    const mockGetNextRound = vi.fn()

    mockUsePokemonGame.mockReturnValue({
      isLoading: ref(false),
      randomPokemon: ref({ id: 25, name: 'pikachu' }),
      gameStatus: ref(GameStatus.Lost),
      pokemonOptions: ref([
        { id: 25, name: 'pikachu' },
        { id: 1, name: 'bulbasaur' },
      ]),
      checkAnswer: vi.fn(),
      getNextRound: mockGetNextRound,
    })

    const wrapper = mount(PokemonGame)

    expect(wrapper.find('h1').text()).toBe('¿Quien es este Pokémon?')
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Jugar de nuevo')

    wrapper.find('button').trigger('click')
    expect(mockGetNextRound).toHaveBeenCalledOnce()
  })

  it('should pass correct props to PokemonPicture when playing', () => {
    mockUsePokemonGame.mockReturnValue({
      isLoading: ref(false),
      randomPokemon: ref({ id: 25, name: 'pikachu' }),
      gameStatus: ref(GameStatus.Playing),
      pokemonOptions: ref([
        { id: 25, name: 'pikachu' },
        { id: 1, name: 'bulbasaur' },
      ]),
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    })

    const wrapper = mount(PokemonGame)

    expect(wrapper.html()).toContain('Pokemon Picture - ID: 25, Show: false')
  })

  it('should pass correct props to PokemonPicture when game is won', () => {
    mockUsePokemonGame.mockReturnValue({
      isLoading: ref(false),
      randomPokemon: ref({ id: 25, name: 'pikachu' }),
      gameStatus: ref(GameStatus.Won),
      pokemonOptions: ref([
        { id: 25, name: 'pikachu' },
        { id: 1, name: 'bulbasaur' },
      ]),
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    })

    const wrapper = mount(PokemonGame)

    expect(wrapper.html()).toContain('Pokemon Picture - ID: 25, Show: true')
  })

  it('should pass correct props to PokemonOptions when playing', () => {
    mockUsePokemonGame.mockReturnValue({
      isLoading: ref(false),
      randomPokemon: ref({ id: 25, name: 'pikachu' }),
      gameStatus: ref(GameStatus.Playing),
      pokemonOptions: ref([
        { id: 25, name: 'pikachu' },
        { id: 1, name: 'bulbasaur' },
        { id: 4, name: 'charmander' },
      ]),
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    })

    const wrapper = mount(PokemonGame)

    expect(wrapper.html()).toContain('Pokemon Options - Count: 3')
  })

  it('should call checkAnswer when an option is selected', async () => {
    const mockCheckAnswer = vi.fn()

    mockUsePokemonGame.mockReturnValue({
      isLoading: ref(false),
      randomPokemon: ref({ id: 25, name: 'pikachu' }),
      gameStatus: ref(GameStatus.Playing),
      pokemonOptions: ref([
        { id: 25, name: 'pikachu' },
        { id: 1, name: 'bulbasaur' },
      ]),
      checkAnswer: mockCheckAnswer,
      getNextRound: vi.fn(),
    })

    const wrapper = mount(PokemonGame)

    const optionButton = wrapper.find('[data-testid="option-25"]')
    await optionButton.trigger('click')

    expect(mockCheckAnswer).toHaveBeenCalledWith(25)
  })

  it('should apply correct CSS classes to loading section', () => {
    mockUsePokemonGame.mockReturnValue({
      isLoading: ref(true),
      randomPokemon: ref(null),
      gameStatus: ref(GameStatus.Playing),
      pokemonOptions: ref([]),
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    })

    const wrapper = mount(PokemonGame)
    const loadingSection = wrapper.find('section')

    expect(loadingSection.classes()).toContain('flex')
    expect(loadingSection.classes()).toContain('flex-col')
    expect(loadingSection.classes()).toContain('items-center')
    expect(loadingSection.classes()).toContain('justify-center')
    expect(loadingSection.classes()).toContain('h-screen')
    expect(loadingSection.classes()).toContain('w-screen')

    const h1 = wrapper.find('h1')
    expect(h1.classes()).toContain('text-3xl')

    const h3 = wrapper.find('h3')
    expect(h3.classes()).toContain('animate-pulse')
  })

  it('should apply correct CSS classes to "Jugar de nuevo" button', () => {
    mockUsePokemonGame.mockReturnValue({
      isLoading: ref(false),
      randomPokemon: ref({ id: 25, name: 'pikachu' }),
      gameStatus: ref(GameStatus.Won),
      pokemonOptions: ref([
        { id: 25, name: 'pikachu' },
        { id: 1, name: 'bulbasaur' },
      ]),
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    })

    const wrapper = mount(PokemonGame)
    const button = wrapper.find('button')

    expect(button.classes()).toContain('mb-5')
    expect(button.classes()).toContain('bg-blue-500')
    expect(button.classes()).toContain('text-white')
    expect(button.classes()).toContain('p-3')
    expect(button.classes()).toContain('rounded-lg')
    expect(button.classes()).toContain('shadow-md')
    expect(button.classes()).toContain('hover:bg-blue-600')
    expect(button.classes()).toContain('transition-all')
  })
})
