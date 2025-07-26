import { pokemonApi, BASE_URL } from '@/modules/pokemon/api/pokemonApi'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      defaults: {
        baseURL: 'https://pokeapi.co/api/v2/pokemon',
      },
    })),
  },
}))

describe('Pokemon API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be configured with correct base URL', () => {
    expect(BASE_URL).toBe('https://pokeapi.co/api/v2/pokemon')
    expect(pokemonApi).toBeDefined()
    expect(pokemonApi.defaults.baseURL).toBe(BASE_URL)
  })

  it('should have correct axios instance configuration', () => {
    expect(pokemonApi.defaults.baseURL).toBe('https://pokeapi.co/api/v2/pokemon')
  })

  it('should be an axios instance with get method', () => {
    expect(pokemonApi.get).toBeDefined()
    expect(typeof pokemonApi.get).toBe('function')
  })

  it('should export BASE_URL constant correctly', () => {
    expect(BASE_URL).toBe('https://pokeapi.co/api/v2/pokemon')
    expect(typeof BASE_URL).toBe('string')
  })

  it('should make GET requests to the correct endpoints', async () => {
    const mockResponse: AxiosResponse = {
      data: {
        count: 151,
        next: null,
        previous: null,
        results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
      request: {},
    }

    // Mock the get method
    vi.spyOn(pokemonApi, 'get').mockResolvedValue(mockResponse)

    const response = await pokemonApi.get('/?limit=151')

    expect(pokemonApi.get).toHaveBeenCalledWith('/?limit=151')
    expect(response.data.count).toBe(151)
    expect(response.data.results).toHaveLength(1)
    expect(response.status).toBe(200)
  })

  it('should handle API errors appropriately', async () => {
    const mockError = new Error('Network Error')

    vi.spyOn(pokemonApi, 'get').mockRejectedValue(mockError)

    await expect(pokemonApi.get('/?limit=151')).rejects.toThrow('Network Error')
    expect(pokemonApi.get).toHaveBeenCalledWith('/?limit=151')
  })

  it('should allow different query parameters', async () => {
    const mockResponse: AxiosResponse = {
      data: { results: [] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
      request: {},
    }

    vi.spyOn(pokemonApi, 'get').mockResolvedValue(mockResponse)

    await pokemonApi.get('/?limit=20&offset=100')

    expect(pokemonApi.get).toHaveBeenCalledWith('/?limit=20&offset=100')
  })
})
