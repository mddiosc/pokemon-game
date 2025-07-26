import { mount } from '@vue/test-utils'
import PokemonPicture from '@/modules/pokemon/components/PokemonPicture.vue'

describe('PokemonPicture', () => {
  const defaultProps = {
    pokemonId: 25, // Pikachu
  }

  it('should render correctly with default props', () => {
    const wrapper = mount(PokemonPicture, {
      props: defaultProps,
    })

    expect(wrapper.find('section').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('should show pokemon image hidden by default (brightness-0)', () => {
    const wrapper = mount(PokemonPicture, {
      props: defaultProps,
    })

    const img = wrapper.find('img')
    expect(img.classes()).toContain('brightness-0')
    expect(img.classes()).not.toContain('fade-in')
  })

  it('should show pokemon image visible when showPokemon is true', () => {
    const wrapper = mount(PokemonPicture, {
      props: {
        ...defaultProps,
        showPokemon: true,
      },
    })

    const img = wrapper.find('img')
    expect(img.classes()).toContain('fade-in')
    expect(img.classes()).not.toContain('brightness-0')
  })

  it('should generate correct pokemon image URL', () => {
    const pokemonId = 150 // Mewtwo
    const wrapper = mount(PokemonPicture, {
      props: {
        pokemonId,
      },
    })

    const img = wrapper.find('img')
    const expectedUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`

    expect(img.attributes('src')).toBe(expectedUrl)
  })

  it('should render only one image at a time based on showPokemon prop', () => {
    // Test hidden state
    const wrapperHidden = mount(PokemonPicture, {
      props: {
        ...defaultProps,
        showPokemon: false,
      },
    })

    expect(wrapperHidden.findAll('img')).toHaveLength(1)
    expect(wrapperHidden.find('img').classes()).toContain('brightness-0')

    // Test visible state
    const wrapperVisible = mount(PokemonPicture, {
      props: {
        ...defaultProps,
        showPokemon: true,
      },
    })

    expect(wrapperVisible.findAll('img')).toHaveLength(1)
    expect(wrapperVisible.find('img').classes()).toContain('fade-in')
  })

  it('should have proper image attributes', () => {
    const wrapper = mount(PokemonPicture, {
      props: defaultProps,
    })

    const img = wrapper.find('img')
    expect(img.attributes('alt')).toBe('')
  })

  it('should update image URL when pokemonId prop changes', async () => {
    const wrapper = mount(PokemonPicture, {
      props: {
        pokemonId: 1,
      },
    })

    // Initial URL
    let img = wrapper.find('img')
    expect(img.attributes('src')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg',
    )

    // Update pokemonId prop
    await wrapper.setProps({ pokemonId: 150 })

    img = wrapper.find('img')
    expect(img.attributes('src')).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/150.svg',
    )
  })

  it('should toggle image visibility when showPokemon prop changes', async () => {
    const wrapper = mount(PokemonPicture, {
      props: {
        ...defaultProps,
        showPokemon: false,
      },
    })

    // Initially hidden
    let img = wrapper.find('img')
    expect(img.classes()).toContain('brightness-0')

    // Show pokemon
    await wrapper.setProps({ showPokemon: true })
    img = wrapper.find('img')
    expect(img.classes()).toContain('fade-in')

    // Hide pokemon again
    await wrapper.setProps({ showPokemon: false })
    img = wrapper.find('img')
    expect(img.classes()).toContain('brightness-0')
  })
})
