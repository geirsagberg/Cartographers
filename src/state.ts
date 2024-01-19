import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import compute from 'zustand-computed'
import { createSelectors } from './createSelectors'
import { Router } from './router'
import { getGameSetup } from './rules'
import { getDecrees, getMaxTime } from './rules/constants'
import { fromCoords, getTerrain } from './rules/utils'
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
import { showSeasonSummary } from './utils'

enableMapSet()

interface GameState {
  gameCode: string
  season: Season | null
  initialBoard: Board
  board: Board
  selectedTerrain: PlaceableTerrain | null
  nextPiece: Set<Coords>
  currentCardIndex: number
  seasonTime: number
  scores: Scores[]
  placementCoins: number
  scoresByDecree: Record<Decree, number>
  edictsByDecree: Record<Decree, Edict>
  cardsPerSeason: Record<Season, Card[]>
}

interface GameActions {
  selectTerrain: (terrain: PlaceableTerrain) => void
  toggleNextPiece: (coords: Coords) => void
  confirmPlacement: () => void
  clearPiece: () => void
  endSeason: () => void
  startGame: (code: string) => void
  resetGame: () => void
  showMenu: () => void
  showEdict: (id: string) => void
}

const getInitialState = (gameCode: string = '') => {
  const { initialBoard, edictsByDecree, cardsPerSeason } =
    getGameSetup(gameCode)
  const season = 'Spring'
  const currentCardIndex = 0
  return {
    initialBoard,
    board: initialBoard,
    season: season,
    scores: [],
    currentCardIndex: currentCardIndex,
    seasonTime: 0,
    edictsByDecree,
    cardsPerSeason,
    gameCode,
    selectedTerrain: getSingleTerrain(cardsPerSeason[season][0]),
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

function getSingleTerrain(card: Card | null) {
  if (isShapeCard(card) && card.terrains.length === 1) {
    return card.terrains[0]
  }
  return null
}

const computeState = (state: GameState) => ({
  totalCoins: getMountainCoins(state.board) + state.placementCoins,
  currentCard: getCurrentCard(state),
  previousCard: getPreviousCard(state),
  maxTime: getMaxTime(state.season),
  legalPlacement: isLegalPlacement(state),
  gameOver: state.scores.length === 4,
  firstDecree: getDecrees(state.season)[0],
  secondDecree: getDecrees(state.season)[1],
  monsterScore: getMonsterScore(state.board),
})

const useGameStateBase = create<GameState & GameActions>()(
  compute(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          ...getInitialState(Router.getRoute(['GameArea'])?.params?.gameCode),
          selectTerrain: (terrain: PlaceableTerrain) =>
            set(() => ({ selectedTerrain: terrain })),

          toggleNextPiece: (coords: Coords) =>
            set((state) => {
              const { board, nextPiece } = state
              const [x, y] = fromCoords(coords)
              const existing = board[y][x]
              const currentCard = getCurrentCard(state)
              if (
                [Empty, Ruins].includes(existing) &&
                !isRuinsCard(currentCard)
              ) {
                if (nextPiece.has(coords)) {
                  nextPiece.delete(coords)
                } else {
                  nextPiece.add(coords)
                }
              }
            }),
          confirmPlacement: () => {
            set((state) => {
              const { nextPiece, selectedTerrain, board } = state
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
                const currentCard = getCurrentCard(state)

                if (isExploreCard(currentCard)) {
                  state.seasonTime += currentCard.time
                }

                state.selectedTerrain = null
                state.currentCardIndex += 1

                recalculateScores(state)
              }
            })
            showCurrentCard()
          },
          clearPiece: () =>
            set(({ nextPiece }) => {
              nextPiece.clear()
            }),
          endSeason: async () => {
            await showSeasonSummary()
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
                monsters: getMonsterScore(board),
              }
              scores.push(newScores)
              advanceSeason(state)
            })
            showCurrentCard()
          },
          startGame: (gameCode: string) => {
            Router.push('GameMain', { gameCode })
            Router.push('GameBriefing', { gameCode })
            set(() => getInitialState(gameCode))
            set((state) => recalculateScores(state))
          },
          resetGame: () => {
            localStorage.clear()
            Router.replace('Start')
            set(() => getInitialState())
          },
          showMenu: () => {
            const { gameCode } = get()
            if (gameCode) {
              Router.push('GameMenu', { gameCode })
            }
          },
          showEdict: (edictId: string) => {
            const { gameCode } = get()
            if (gameCode) {
              Router.push('GameEdict', { gameCode, edictId })
            }
          },
        }))
      ),
      {
        name: 'gameState',
        partialize: ({
          board,
          season,
          scores,
          placementCoins,
          currentCardIndex,
          seasonTime,
        }) => ({
          board,
          season,
          scores,
          placementCoins,
          currentCardIndex,
          seasonTime,
        }),
        onRehydrateStorage: () => (state, error) => {
          if (error || !state) {
            console.error(error)
            return
          }
          setTimeout(() => {
            useGameState.setState((state) => {
              recalculateScores(state)
              updateSelectedTerrain(state)
            })
          })
        },
      }
    ),
    computeState
  )
)

export type ComputedState = ReturnType<typeof computeState>

export const useGameState = createSelectors(useGameStateBase)

function advanceSeason(state: GameState) {
  state.seasonTime = 0
  state.currentCardIndex = 0
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

export function showCurrentCard() {
  const { gameCode, currentCard } = useGameState.getState()
  if (currentCard) {
    Router.push('GameCard', { gameCode })
  }
}

export function dismissCard() {
  useGameState.setState((state) => {
    const currentCard = state.currentCard
    const isRuins = isRuinsCard(currentCard)
    if (isRuins) {
      state.currentCardIndex += 1
    } else {
      Router.replace('GameMain', { gameCode: state.gameCode })
    }
  })
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

export const useMonsters = () => {
  const board = useGameState.use.board()
  return getMonsterScore(board)
}

function isLegalPlacement(state: GameState): boolean {
  const { nextPiece, seasonTime, season, selectedTerrain, board } = state
  const currentCard = getCurrentCard(state)
  const previousCard = getPreviousCard(state)
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
    if (
      isRuinsCard(previousCard) &&
      [...nextPiece]
        .map(fromCoords)
        .every(([x, y]) => getTerrain(board, x, y) !== Ruins) &&
      board.flat().includes(Ruins)
    ) {
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
  const { currentCardIndex, cardsPerSeason, season } = state
  return season ? cardsPerSeason[season][currentCardIndex] : null
}

function getPreviousCard(state: GameState) {
  const { currentCardIndex, cardsPerSeason, season } = state
  return season && currentCardIndex > 0
    ? cardsPerSeason[season][currentCardIndex - 1]
    : null
}

function getMonsterScore(board: Board) {
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

function updateSelectedTerrain(state: GameState) {
  const terrain = getSingleTerrain(getCurrentCard(state))
  state.selectedTerrain = terrain
}

function recalculateScores(state: GameState) {
  const { edictsByDecree, board, scoresByDecree, initialBoard } = state

  Object.entries(edictsByDecree).forEach(([decree, edict]) => {
    scoresByDecree[decree as Decree] = edict.calculateScore(board, initialBoard)
  })
}

useGameState.subscribe(
  (state) => state.currentCardIndex,
  () => {
    useGameState.setState(updateSelectedTerrain)
  }
)
