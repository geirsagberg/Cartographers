import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from './createSelectors'
import { isLegalPlacement } from './rules'
import {
  Empty,
  Monster,
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
  placementCoins: number
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
    placementCoins: 0,
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
      set((state) => {
        const { nextPiece, selectedTerrain, board } = state
        if (isLegalPlacement(nextPiece, selectedTerrain)) {
          nextPiece.forEach((coords) => {
            const [x, y] = fromCoords(coords)
            board[y][x] = selectedTerrain
          })
          if (
            selectedTerrain !== Monster &&
            (nextPiece.size === 2 || nextPiece.size === 3)
          ) {
            state.placementCoins += 1
          }
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

function getMountainCoins(board: Board): number {
  function isFilled(x: number, y: number): boolean {
    return (
      board[y][x] !== Empty &&
      board[y][x] !== Ruins &&
      board[y][x] !== undefined
    )
  }
  return board
    .map(
      (row, y) =>
        row.filter(
          (cell, x) =>
            cell === Mountain &&
            isFilled(x - 1, y) &&
            isFilled(x + 1, y) &&
            isFilled(x, y - 1) &&
            isFilled(x, y + 1)
        ).length
    )
    .reduce((a, b) => a + b, 0)
}

export const useCoins = () => {
  const { board, placementCoins } = useGameState()
  return getMountainCoins(board) + placementCoins
}
