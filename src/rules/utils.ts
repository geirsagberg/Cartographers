import random from 'seedrandom'
import {
  Board,
  Coords,
  Decree,
  Edge,
  Empty,
  Ruins,
  Season,
  Terrain,
} from '../types'

export function toCoords(x: number, y: number): Coords {
  return `${x},${y}`
}

export function fromCoords(coords: Coords): [number, number] {
  const [x, y] = coords.split(',').map(Number)
  return [x, y]
}

export function createRandom(seed: string) {
  return random(seed + '\0')
}

export type Random = random.PRNG

export function isFilledOrEdgeCell(cell: Terrain) {
  return ![Empty, Ruins].includes(cell)
}

export function isFilledOrEdge(board: Board, x: number, y: number) {
  return ![Empty, Ruins].includes(getTerrain(board, x, y))
}

export function getTerrain(board: Board, x: number, y: number): Terrain {
  return board[y]?.[x] ?? Edge
}

export function isDecreeOver(decree: Decree, season: Season | null) {
  switch (season) {
    case 'Fall':
      return decree === 'B'
    case 'Winter':
      return ['B', 'C'].includes(decree)
    default:
      return false
  }
}

export function isSeasonOver(currentSeason: Season, season: Season) {
  switch (currentSeason) {
    case 'Summer':
      return season === 'Spring'
    case 'Fall':
      return ['Spring', 'Summer'].includes(season)
    case 'Winter':
      return ['Spring', 'Summer', 'Fall'].includes(season)
    default:
      return false
  }
}

export function getAdjacentTerrain(
  board: Board,
  x: number,
  y: number
): Terrain[] {
  return [
    getTerrain(board, x - 1, y),
    getTerrain(board, x + 1, y),
    getTerrain(board, x, y - 1),
    getTerrain(board, x, y + 1),
  ]
}

export function shuffleArray<T>(array: T[], rng: random.PRNG): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
