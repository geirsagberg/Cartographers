import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from './createSelectors'
import { edictsById, getDecrees, isLegalPlacement } from './rules'
import {
  Board,
  Coords,
  Decree,
  Empty,
  Monster,
  Mountain,
  PlaceableTerrain,
  Ruins,
  Scores,
  Season,
  Terrain,
  Water,
} from './types'
import { showEdicts } from './utils'

const E = Empty
const M = Mountain
const R = Ruins

enableMapSet()

export function toCoords(x: number, y: number): Coords {
  return `${x},${y}`
}

export function fromCoords(coords: Coords): [number, number] {
  const [x, y] = coords.split(',').map(Number)
  return [x, y]
}

interface GameState {
  season: Season | null
  board: Board
  selectedTerrain: PlaceableTerrain
  nextPiece: Set<Coords>
  scores: Scores[]
  placementCoins: number
  firstDecreeScore: number
  secondDecreeScore: number
  edicts: Record<Decree, number | null>
  selectTerrain: (terrain: PlaceableTerrain) => void
  toggleNextPiece: (coords: Coords) => void
  confirmPlacement: () => void
  clearPiece: () => void
  endSeason: () => void
  selectEdict: (decree: 'A' | 'B' | 'C' | 'D') => Promise<void>
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
  immer((set, get) => ({
    board: DefaultBoard,
    season: 'Spring',
    scores: [],
    edicts: {
      A: null,
      B: null,
      C: null,
      D: null,
    },
    selectedTerrain: Water,
    firstDecreeScore: 0,
    secondDecreeScore: 0,
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
          recalculateScores(state)
        }
      }),
    clearPiece: () =>
      set(({ nextPiece }) => {
        nextPiece.clear()
      }),
    endSeason: () =>
      set((state) => {
        const {
          board,
          season,
          scores,
          placementCoins,
          firstDecreeScore,
          secondDecreeScore,
        } = state
        if (!season) return
        const newScores: Scores = {
          season,
          first: firstDecreeScore ?? 0,
          second: secondDecreeScore ?? 0,
          coins: getMountainCoins(board) + placementCoins,
          monsters: getMonsters(board),
        }
        scores.push(newScores)
        state.firstDecreeScore = 0
        state.secondDecreeScore = 0
        switch (season) {
          case 'Spring':
            state.season = 'Summer'
            break
          case 'Summer':
            state.season = 'Fall'
            break
          case 'Fall':
            state.season = 'Winter'
            break
          case 'Winter':
            state.season = null
            break
        }
      }),
    selectEdict: async (decree: 'A' | 'B' | 'C' | 'D') => {
      const id = await showEdicts({
        currentEdict: get().edicts[decree] ?? null,
      })
      if (id) {
        set((state) => {
          state.edicts[decree] = id
          recalculateScores(state)
        })
      }
    },
  }))
)

export const useGameState = createSelectors(useGameStateBase)

function getMountainCoins(board: Board): number {
  function isFilled(x: number, y: number): boolean {
    return (
      x < 0 ||
      x >= board[0].length ||
      y < 0 ||
      y >= board.length ||
      (board[y][x] !== Empty &&
        board[y][x] !== Ruins &&
        board[y][x] !== undefined)
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
  const board = useGameState.use.board()
  const placementCoins = useGameState.use.placementCoins()
  return getMountainCoins(board) + placementCoins
}

export const useMonsters = () => {
  const board = useGameState.use.board()

  return getMonsters(board)
}

export const useGameOver = () => {
  const scores = useGameState.use.scores()
  return scores.length === 4
}

function getMonsters(board: Board) {
  function isEmpty(cell: Terrain): boolean {
    return cell === Empty || cell === Ruins
  }

  function isMonster(x: number, y: number): boolean {
    return (
      x >= 0 &&
      x < board.length &&
      y >= 0 &&
      y < board.length &&
      board[y][x] === Monster
    )
  }

  return board
    .map(
      (row, y) =>
        row.filter(
          (cell, x) =>
            isEmpty(cell) &&
            (isMonster(x - 1, y) ||
              isMonster(x + 1, y) ||
              isMonster(x, y - 1) ||
              isMonster(x, y + 1))
        ).length
    )
    .reduce((a, b) => a + b, 0)
}

function recalculateScores(state: GameState) {
  const { season, edicts, board } = state
  if (season !== null) {
    const [firstDecree, secondDecree] = getDecrees(season)
    const firstEdictId = edicts[firstDecree]
    const secondEdictId = edicts[secondDecree]
    if (firstEdictId !== null) {
      state.firstDecreeScore = edictsById[firstEdictId].calculateScore(board)
    }
    if (secondEdictId !== null) {
      state.secondDecreeScore = edictsById[secondEdictId].calculateScore(board)
    }
  }
}
