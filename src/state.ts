import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from './createSelectors'
import { getGameSetup } from './rules'
import { getDecrees, getMaxTime } from './rules/constants'
import { fromCoords } from './rules/utils'
import {
  Board,
  Card,
  Coords,
  Decree,
  Edict,
  Empty,
  Monster,
  Mountain,
  PlaceableTerrain,
  Ruins,
  Scores,
  Season,
  Terrain,
  isExploreCard,
  isMonsterCard,
  isRuinsCard,
  isShapeCard,
} from './types'
import { showCard, showEdicts } from './utils'

enableMapSet()

interface GameState {
  gameCode: string | null
  season: Season | null
  initialBoard: Board
  board: Board
  selectedTerrain: PlaceableTerrain | null
  nextPiece: Set<Coords>
  currentCard: number
  seasonTime: number
  scores: Scores[]
  placementCoins: number
  scoresByDecree: Record<Decree, number>
  edictsByDecree: Record<Decree, Edict>
  cardsPerSeason: Record<Season, Card[]>
  selectTerrain: (terrain: PlaceableTerrain) => void
  toggleNextPiece: (coords: Coords) => void
  confirmPlacement: () => void
  clearPiece: () => void
  endSeason: () => void
  startGame: (code: string) => void
  resetGame: () => void
  selectEdict: (decree: 'A' | 'B' | 'C' | 'D') => Promise<void>
}

const gameCode = location.hash.slice(1) || null

const getInitialState = (gameCode: string | null) => {
  const { initialBoard, edictsByDecree, cardsPerSeason } =
    getGameSetup(gameCode)
  return {
    initialBoard,
    board: initialBoard,
    season: 'Spring',
    scores: [],
    currentCard: 0,
    seasonTime: 0,
    edictsByDecree,
    cardsPerSeason,
    gameCode,
    selectedTerrain: null,
    scoresByDecree: {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    },
    nextPiece: new Set(),
    placementCoins: 0,
  } satisfies Partial<GameState>
}

const useGameStateBase = create<GameState>()(
  persist(
    immer((set, get) => ({
      ...getInitialState(gameCode),
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
          const { nextPiece, selectedTerrain, board, season } = state
          if (isLegalPlacement(state)) {
            if (selectedTerrain) {
              nextPiece.forEach((coords) => {
                const [x, y] = fromCoords(coords)
                board[y][x] = selectedTerrain
              })
            }
            if (
              selectedTerrain !== Monster &&
              (nextPiece.size === 2 || nextPiece.size === 3)
            ) {
              state.placementCoins += 1
            }
            nextPiece.clear()
            const card = getCurrentCard(state)

            if (isExploreCard(card)) {
              state.seasonTime += card.time
            }

            const maxTime = getMaxTime(season)

            state.selectedTerrain = null

            if (state.seasonTime < maxTime) {
              state.currentCard += 1
              updateCardState(state)
            }

            recalculateScores(state)
          }
        }),
      clearPiece: () =>
        set(({ nextPiece }) => {
          nextPiece.clear()
        }),
      endSeason: () =>
        set((state) => {
          const { board, season, scores, placementCoins, scoresByDecree } =
            state
          if (!season) return

          const [firstDecree, secondDecree] = getDecrees(season)

          const newScores: Scores = {
            season,
            first: scoresByDecree[firstDecree],
            second: scoresByDecree[secondDecree],
            coins: getMountainCoins(board) + placementCoins,
            monsters: getMonsters(board),
          }
          scores.push(newScores)
          recalculateScores(state)
          advanceSeason(state)
          updateCardState(state)
        }),
      startGame: (gameCode: string) => {
        location.hash = gameCode

        set(() => getInitialState(gameCode))
      },
      resetGame: () => {
        localStorage.clear()
        location.hash = ''
        location.reload()
      },
      selectEdict: async (decree: 'A' | 'B' | 'C' | 'D') => {
        const id = await showEdicts({
          currentEdict: get().edictsByDecree[decree]?.id ?? null,
        })
        if (id) {
          set((state) => {
            state.edictsByDecree[decree] = id
            recalculateScores(state)
          })
        }
      },
    })),
    {
      name: 'gameState',
      partialize: ({
        board,
        season,
        scores,
        placementCoins,
        currentCard,
        seasonTime,
      }) => ({
        board,
        season,
        scores,
        placementCoins,
        currentCard,
        seasonTime,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) {
          console.error(error)
          return
        }
        recalculateScores(state)
      },
    }
  )
)

export const useGameState = createSelectors(useGameStateBase)

function advanceSeason(state: GameState) {
  state.seasonTime = 0
  state.currentCard = 0
  switch (state.season) {
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
}

function updateCardState(state: GameState) {
  const nextCard = getCurrentCard(state)
  if (nextCard) {
    showCard(nextCard.id)
    if (isShapeCard(nextCard) && nextCard.terrains.length === 1) {
      state.selectedTerrain = nextCard.terrains[0]
    }
  }
}

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

export const useLegalPlacement = () => {
  return isLegalPlacement(useGameState())
}

function isLegalPlacement(state: GameState): boolean {
  const { nextPiece, seasonTime, season, selectedTerrain } = state
  const currentCard = getCurrentCard(state)
  const maxTime = getMaxTime(season)

  if (isMonsterCard(currentCard) && selectedTerrain !== Monster) {
    return false
  }
  if (isRuinsCard(currentCard) && nextPiece.size === 0) {
    return true
  }
  if (seasonTime >= maxTime) {
    return false
  }
  if (isShapeCard(currentCard)) {
    if (!selectedTerrain || !currentCard.terrains.includes(selectedTerrain)) {
      return false
    }
    return (
      currentCard.shapes.some((shape) => matchesShape(shape, nextPiece)) ||
      nextPiece.size === 1 // To handle when the shape is not placeable
    )
  }
  return false
}

// function rotateAndNormalizeShape(shape: Set<Coords>): Set<Coords> {}

function matchesShape(shape: Set<Coords>, piece: Set<Coords>): boolean {
  return shape.size === piece.size
  // if (shape.size !== piece.size) {
  //   return false
  // }
  // const minX = Math.min(...[...shape].map(fromCoords).map(([x]) => x))
  // const minY = Math.min(...[...shape].map(fromCoords).map(([, y]) => y))
  // const normalizedPiece = new Set(
  //   [...piece]
  //     .map(fromCoords)
  //     .map(([x, y]) => [x - minX, y - minY])
  //     .map(([x, y]) => toCoords(x, y))
  // )
  // const shapeVariations: Set<Coords>[] = [shape]
  // const shapeXY = [...shape].map(fromCoords)

  // return true
}

export const useCurrentCard = () => {
  return getCurrentCard(useGameState())
}

function getCurrentCard(state: GameState) {
  const { currentCard, cardsPerSeason, season } = state
  return season ? cardsPerSeason[season][currentCard] : null
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
  const { edictsByDecree, board, scoresByDecree, initialBoard } = state

  Object.entries(edictsByDecree).forEach(([decree, edict]) => {
    scoresByDecree[decree as Decree] = edict.calculateScore(board, initialBoard)
  })
}
