import random from 'seedrandom'
import { Board, Coords, Edge, Empty, Ruins, Terrain } from '../types'

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
