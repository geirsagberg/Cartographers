import {
  Board,
  Card,
  Decree,
  Edge,
  Empty,
  Mountain,
  Ruins,
  Season,
  Terrain,
  isExploreCard,
  isMonsterCard,
} from '../types'

import random from 'seedrandom'
import { exploreCards, monsterCards, ruinsCards } from './cards'
import { createRandom } from './utils'

const E = Empty
const M = Mountain
const R = Ruins

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

function getCardsForSeason(
  previousCards: Card[],
  monsters: Card[],
  season: Season,
  rng: random.PRNG
): [Card[], Card[]] {
  const cards = shuffleArray(
    [
      ...ruinsCards,
      ...exploreCards,
      ...previousCards.filter(isMonsterCard),
      monsters.pop()!,
    ],
    rng
  )
  const cardsForSeason: Card[] = []
  let time = 0
  const maxTime = getMaxTime(season)
  while (time < maxTime) {
    const card = cards.pop()!
    cardsForSeason.push(card)
    if (isExploreCard(card)) time += card.time
  }
  return [cardsForSeason, cards]
}

export function getCardsPerSeason(seed: string): Record<Season, Card[]> {
  const rng = createRandom(seed)
  const monsters = shuffleArray(monsterCards, rng)

  const [springCards, springRest] = getCardsForSeason(
    [],
    monsters,
    'Spring',
    rng
  )
  const [summerCards, summerRest] = getCardsForSeason(
    springRest,
    monsters,
    'Summer',
    rng
  )
  const [fallCards, fallRest] = getCardsForSeason(
    summerRest,
    monsters,
    'Fall',
    rng
  )
  const [winterCards] = getCardsForSeason(fallRest, monsters, 'Winter', rng)

  return {
    Spring: springCards,
    Summer: summerCards,
    Fall: fallCards,
    Winter: winterCards,
  }
}

export function shuffleArray<T>(array: T[], rng: random.PRNG): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
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
