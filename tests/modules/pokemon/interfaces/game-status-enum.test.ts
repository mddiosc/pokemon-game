import { GameStatus } from '@pokemon/interfaces/game-status-enum'

describe('Game Status Enum', () => {
  test('should have correct values', () => {
    expect(GameStatus.Playing).toBe('playing')
    expect(GameStatus.Won).toBe('won')
    expect(GameStatus.Lost).toBe('lost')
  })

  test('should have correct keys', () => {
    expect(GameStatus).toHaveProperty('Playing')
    expect(GameStatus).toHaveProperty('Won')
    expect(GameStatus).toHaveProperty('Lost')
  })

  test('should have a value of "playing"', () => {
    expect(GameStatus.Playing).toEqual('playing')
  })
  test('should have a value of "won"', () => {
    expect(GameStatus.Won).toEqual('won')
  })
  test('should have a value of "lost"', () => {
    expect(GameStatus.Lost).toEqual('lost')
  })
})
