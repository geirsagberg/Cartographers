import { Coords } from './state'
import { PlaceableTerrain } from './types'

const goblins = [
  [0, 0],
  [1, 1],
  [2, 2],
]

const bugbears = [
  [0, 0],
  [2, 0],
  [0, 1],
  [2, 1],
]

const kobolds = [
  [0, 0],
  [0, 1],
  [1, 1],
  [0, 1],
]

const gnolls = [
  [0, 0],
  [1, 0],
  [0, 1],
  [0, 2],
  [1, 2],
]

const monsters = [goblins, bugbears, kobolds, gnolls]

function normalizePiece(piece: Set<Coords>): number[][] {
  const tuples = [...piece].map((coords) => coords.split(',').map(Number))
  const minX = Math.min(...tuples.map(([x]) => x))
  const minY = Math.min(...tuples.map(([, y]) => y))
  return tuples.map(([x, y]) => [x - minX, y - minY])
}

export function isLegalPlacement(
  piece: Set<Coords>,
  terrain: PlaceableTerrain
): boolean {
  return piece.size > 0 && piece.size <= 5
}
