import { mount } from '@vue/test-utils'
import PokemonOptions from '@/modules/pokemon/components/PokemonOptions.vue'
import type { Pokemon } from '@/modules/pokemon/interfaces'

describe('PokemonOptions', () => {
  const mockOptions: Pokemon[] = [
    { id: 1, name: 'bulbasaur' },
    { id: 25, name: 'pikachu' },
    { id: 150, name: 'mewtwo' },
    { id: 6, name: 'charizard' },
  ]

  const defaultProps = {
    options: mockOptions,
    correctAnswer: 25, // pikachu
    blockSelection: false,
  }

  it('should render correctly with default props', () => {
    const wrapper = mount(PokemonOptions, {
      props: defaultProps,
    })

    expect(wrapper.find('section').exists()).toBe(true)
    expect(wrapper.findAll('button')).toHaveLength(4)
  })

  it('should render all pokemon options as buttons', () => {
    const wrapper = mount(PokemonOptions, {
      props: defaultProps,
    })

    const buttons = wrapper.findAll('button')

    expect(buttons).toHaveLength(mockOptions.length)

    buttons.forEach((button, index) => {
      expect(button.text()).toBe(mockOptions[index].name)
    })
  })

  it('should emit selectOption event when button is clicked', async () => {
    const wrapper = mount(PokemonOptions, {
      props: defaultProps,
    })

    const firstButton = wrapper.findAll('button')[0]
    await firstButton.trigger('click')

    expect(wrapper.emitted('selectOption')).toBeTruthy()
    expect(wrapper.emitted('selectOption')?.[0]).toEqual([1]) // bulbasaur id
  })

  it('should show correct answer with correct class when blockSelection is true', () => {
    const wrapper = mount(PokemonOptions, {
      props: {
        ...defaultProps,
        blockSelection: true,
      },
    })

    const buttons = wrapper.findAll('button')
    const correctButton = buttons.find((btn) => btn.text() === 'pikachu')
    const incorrectButton = buttons.find((btn) => btn.text() === 'bulbasaur')

    expect(correctButton?.classes()).toContain('correct')
    expect(incorrectButton?.classes()).toContain('incorrect')
  })

  it('should disable all buttons when blockSelection is true', () => {
    const wrapper = mount(PokemonOptions, {
      props: {
        ...defaultProps,
        blockSelection: true,
      },
    })

    const buttons = wrapper.findAll('button')

    buttons.forEach((button) => {
      expect(button.attributes('disabled')).toBeDefined()
    })
  })

  it('should enable all buttons when blockSelection is false', () => {
    const wrapper = mount(PokemonOptions, {
      props: {
        ...defaultProps,
        blockSelection: false,
      },
    })

    const buttons = wrapper.findAll('button')

    buttons.forEach((button) => {
      expect(button.attributes('disabled')).toBeUndefined()
    })
  })

  it('should apply correct styling classes to buttons', () => {
    const wrapper = mount(PokemonOptions, {
      props: defaultProps,
    })

    const buttons = wrapper.findAll('button')

    buttons.forEach((button) => {
      // All buttons should have disabled styling classes
      expect(button.classes()).toContain('disabled:shadow-none')
      expect(button.classes()).toContain('disabled:bg-gray-100')
    })
  })

  it('should handle different correct answers correctly', async () => {
    const wrapper = mount(PokemonOptions, {
      props: {
        ...defaultProps,
        correctAnswer: 150, // mewtwo
        blockSelection: true,
      },
    })

    const buttons = wrapper.findAll('button')
    const correctButton = buttons.find((btn) => btn.text() === 'mewtwo')
    const incorrectButtons = buttons.filter((btn) => btn.text() !== 'mewtwo')

    expect(correctButton?.classes()).toContain('correct')
    incorrectButtons.forEach((button) => {
      expect(button.classes()).toContain('incorrect')
    })
  })

  it('should emit correct pokemon id when any option is selected', async () => {
    const wrapper = mount(PokemonOptions, {
      props: defaultProps,
    })

    // Test clicking each button
    for (let i = 0; i < mockOptions.length; i++) {
      const button = wrapper.findAll('button')[i]
      await button.trigger('click')

      const emittedEvents = wrapper.emitted('selectOption') as Array<[number]>
      expect(emittedEvents[i][0]).toBe(mockOptions[i].id)
    }
  })

  it('should not emit events when buttons are disabled', async () => {
    const wrapper = mount(PokemonOptions, {
      props: {
        ...defaultProps,
        blockSelection: true,
      },
    })

    const button = wrapper.findAll('button')[0]
    await button.trigger('click')

    // Should not emit when disabled
    expect(wrapper.emitted('selectOption')).toBeFalsy()
  })
})
