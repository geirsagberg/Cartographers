import {
  Empty,
  Field,
  Forest,
  Hamlet,
  Monster,
  Mountain,
  Ruins,
  Terrain,
  Water,
} from '../types'
import { DefaultBoard } from './constants'
import { edicts } from './edicts'

describe('edicts', () => {
  describe('Lost Barony', () => {
    it('should find the largest square on the board', () => {
      const lostBarony = edicts.find((e) => e.name === 'Lost Barony')
      if (!lostBarony) throw new Error('Lost Barony not found')

      const E = Empty
      const M = Mountain
      const R = Ruins
      const W = Water
      const H = Hamlet
      const X = Monster
      const T = Forest
      const F = Field
      const initialBoard = DefaultBoard
      const board: Terrain[][] = [
        [E, E, E, E, E, E, E, E, E, E, E],
        [E, E, E, M, W, W, W, E, E, E, E],
        [E, R, E, E, E, E, E, E, M, R, E],
        [E, E, W, W, W, E, E, X, E, E, E],
        [E, E, W, E, E, E, F, E, X, E, E],
        [E, E, W, H, H, M, F, F, E, X, E],
        [E, E, E, H, H, H, F, E, E, E, E],
        [E, F, F, F, T, E, E, E, E, T, E],
        [E, F, M, H, H, F, E, T, T, T, E],
        [E, H, H, H, F, F, F, M, E, T, E],
        [E, E, E, E, E, E, E, E, E, E, E],
      ]

      const score = lostBarony.calculateScore(board, initialBoard)

      expect(score).toBe(9)
    })
  })
})
