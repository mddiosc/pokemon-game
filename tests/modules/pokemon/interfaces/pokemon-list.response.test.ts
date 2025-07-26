import type {
  PokemonListResponse,
  Result,
} from '@/modules/pokemon/interfaces/pokemon-list.response'

describe('PokemonListResponse Interface', () => {
  const mockResult: Result = {
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon/25/',
  }

  const mockPokemonListResponse: PokemonListResponse = {
    count: 1302,
    next: 'https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20',
    previous: null,
    results: [mockResult],
  }

  describe('Result interface', () => {
    it('should have correct structure for Result', () => {
      expect(typeof mockResult.name).toBe('string')
      expect(typeof mockResult.url).toBe('string')
    })

    it('should have name property of type string', () => {
      expect(mockResult).toHaveProperty('name')
      expect(typeof mockResult.name).toBe('string')
    })

    it('should have url property of type string', () => {
      expect(mockResult).toHaveProperty('url')
      expect(typeof mockResult.url).toBe('string')
    })
  })

  describe('PokemonListResponse interface', () => {
    it('should have correct structure for PokemonListResponse', () => {
      expect(typeof mockPokemonListResponse.count).toBe('number')
      expect(typeof mockPokemonListResponse.next).toBe('string')
      expect(mockPokemonListResponse.previous).toBe(null)
      expect(Array.isArray(mockPokemonListResponse.results)).toBe(true)
    })

    it('should have count property of type number', () => {
      expect(mockPokemonListResponse).toHaveProperty('count')
      expect(typeof mockPokemonListResponse.count).toBe('number')
    })

    it('should have next property of type string', () => {
      expect(mockPokemonListResponse).toHaveProperty('next')
      expect(typeof mockPokemonListResponse.next).toBe('string')
    })

    it('should have previous property that can be null', () => {
      expect(mockPokemonListResponse).toHaveProperty('previous')
      expect(mockPokemonListResponse.previous).toBe(null)
    })

    it('should have results property of type array', () => {
      expect(mockPokemonListResponse).toHaveProperty('results')
      expect(Array.isArray(mockPokemonListResponse.results)).toBe(true)
    })

    it('should have results array containing Result objects', () => {
      expect(mockPokemonListResponse.results).toHaveLength(1)

      const result = mockPokemonListResponse.results[0]
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('url')
      expect(typeof result.name).toBe('string')
      expect(typeof result.url).toBe('string')
    })

    it('should match expected API response structure', () => {
      // Test that the response matches what we expect from PokeAPI
      expect(mockPokemonListResponse.count).toBeGreaterThan(0)
      expect(mockPokemonListResponse.next).toContain('pokeapi.co')
      expect(mockPokemonListResponse.results[0].url).toContain('pokeapi.co')
    })
  })

  describe('Type compatibility', () => {
    it('should allow valid Result objects', () => {
      const validResult: Result = {
        name: 'charmander',
        url: 'https://pokeapi.co/api/v2/pokemon/4/',
      }

      expect(validResult.name).toBe('charmander')
      expect(validResult.url).toBe('https://pokeapi.co/api/v2/pokemon/4/')
    })

    it('should allow valid PokemonListResponse objects', () => {
      const validResponse: PokemonListResponse = {
        count: 151,
        next: 'https://pokeapi.co/api/v2/pokemon/?offset=151&limit=151',
        previous: null,
        results: [
          {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
          {
            name: 'ivysaur',
            url: 'https://pokeapi.co/api/v2/pokemon/2/',
          },
        ],
      }

      expect(validResponse.count).toBe(151)
      expect(validResponse.results).toHaveLength(2)
      expect(validResponse.results[0].name).toBe('bulbasaur')
    })
  })
})
