import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from './createSelectors'
import { isLegalPlacement } from './rules'
import {
  Empty,
  Mountain,
  PlaceableTerrain,
  Ruins,
  Terrain,
  Water,
} from './types'

const E = Empty
const M = Mountain
const R = Ruins

type Board = Terrain[][]

enableMapSet()

export type Coords = `${number},${number}`

export function toCoords(x: number, y: number): Coords {
  return `${x},${y}`
}

export function fromCoords(coords: Coords): [number, number] {
  const [x, y] = coords.split(',').map(Number)
  return [x, y]
}

interface GameState {
  board: Board
  selectedTerrain: PlaceableTerrain
  nextPiece: Set<Coords>
  selectTerrain: (terrain: PlaceableTerrain) => void
  toggleNextPiece: (coords: Coords) => void
  confirmPlacement: () => void
  clearPiece: () => void
}

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

const useGameStateBase = create<GameState>()(
  immer((set) => ({
    board: DefaultBoard,
    selectedTerrain: Water,
    nextPiece: new Set(),
    selectTerrain: (terrain: PlaceableTerrain) =>
      set(() => ({ selectedTerrain: terrain })),

    toggleNextPiece: (coords: Coords) =>
      set(({ nextPiece, board }) => {
        const [x, y] = fromCoords(coords)
        const existing = board[y][x]
        if ([Empty, Ruins].includes(existing)) {
          if (nextPiece.has(coords)) {
            nextPiece.delete(coords)
          } else {
            nextPiece.add(coords)
          }
        }
      }),
    confirmPlacement: () =>
      set(({ nextPiece, selectedTerrain, board }) => {
        if (isLegalPlacement(nextPiece, selectedTerrain)) {
          nextPiece.forEach((coords) => {
            const [x, y] = fromCoords(coords)
            board[y][x] = selectedTerrain
          })
          nextPiece.clear()
        }
      }),
    clearPiece: () =>
      set(({ nextPiece }) => {
        nextPiece.clear()
      }),
  }))
)

export const useGameState = createSelectors(useGameStateBase)
