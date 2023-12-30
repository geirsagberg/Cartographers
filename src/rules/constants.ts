import {
  Decree,
  Empty,
  Mountain,
  Ruins,
  Season,
  Terrain,
  Wasteland,
} from '../types'

const E = Empty
const M = Mountain
const R = Ruins
const W = Wasteland

export const DefaultBoard: Terrain[][] = [
  [E, E, E, E, E, E, E, E, E, E, E],
  [E, E, E, M, E, R, E, E, E, E, E],
  [E, R, E, E, E, E, E, E, M, R, E],
  [E, E, E, E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E, E, E, E],
  [E, E, E, E, E, M, E, E, E, E, E],
  [E, E, E, E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E, E, E, E],
  [E, R, M, E, E, E, E, E, E, R, E],
  [E, E, E, E, E, R, E, M, E, E, E],
  [E, E, E, E, E, E, E, E, E, E, E],
]

export const WastelandsBoard: Terrain[][] = [
  [E, E, E, E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, R, E, M, E, E],
  [E, E, R, M, E, E, E, E, E, E, E],
  [E, E, E, E, E, W, E, E, E, E, E],
  [E, E, E, E, W, W, R, E, E, E, E],
  [E, E, E, E, W, W, W, E, E, E, E],
  [E, R, E, E, E, W, E, E, E, E, E],
  [E, E, E, E, E, M, E, E, R, E, E],
  [E, E, E, E, E, E, E, E, E, M, E],
  [E, E, M, R, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E, E, E, E],
]

export const boards = [DefaultBoard, WastelandsBoard]

export function getDecrees(season: Season | null): [Decree, Decree] {
  switch (season) {
    case 'Spring':
      return ['A', 'B']
    case 'Summer':
      return ['B', 'C']
    case 'Fall':
      return ['C', 'D']
    case 'Winter':
      return ['D', 'A']
    default:
      return ['A', 'A']
  }
}

export function getMaxTime(season: Season | null): number {
  switch (season) {
    case 'Spring':
    case 'Summer':
      return 8
    case 'Fall':
      return 7
    case 'Winter':
      return 6
    default:
      return 0
  }
}
