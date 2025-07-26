import type { Pokemon } from '@/modules/pokemon/interfaces'

describe('Pokemon Interface', () => {
  const pokemon: Pokemon = { id: 1, name: 'Pikachu' }
  test('should have an id property of type number', () => {
    expect(typeof pokemon.id).toBe('number')
  })
  test('should have a name property of type string', () => {
    expect(typeof pokemon.name).toBe('string')
  })
})
