import {
  Board,
  Coords,
  Decree,
  Edge,
  Edict,
  Empty,
  Field,
  Forest,
  Hamlet,
  Monster,
  Mountain,
  PlaceableTerrain,
  Ruins,
  Season,
  Terrain,
  Water,
} from './types'

import random from 'seedrandom'

const E = Empty
const M = Mountain
const R = Ruins

export function toCoords(x: number, y: number): Coords {
  return `${x},${y}`
}

export function fromCoords(coords: Coords): [number, number] {
  const [x, y] = coords.split(',').map(Number)
  return [x, y]
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

export type Card = {
  id: string
  name: string
}

type ShapeCard = Card & {
  shapes: Set<Coords>[]
  terrains: PlaceableTerrain[]
}

type MonsterCard = ShapeCard & {
  isMonster: true
}

type RuinsCard = Card & {
  isRuins: true
}

type ExploreCard = ShapeCard & {
  time: number
}

export function isExploreCard(card: Card | null): card is ExploreCard {
  return card != null && 'time' in card
}

export function isMonsterCard(card: Card | null): card is MonsterCard {
  return card != null && 'isMonster' in card
}

export function isRuinsCard(card: Card | null): card is RuinsCard {
  return card != null && 'isRuins' in card
}

export function isShapeCard(card: Card | null): card is ShapeCard {
  return card != null && 'shapes' in card
}

const monsterCards: MonsterCard[] = [
  {
    id: '01',
    name: 'Goblin Attack',
    shapes: [new Set(['0,0', '1,1', '2,2'])],
    terrains: [Monster],
    isMonster: true,
  },
  {
    id: '02',
    name: 'Bugbear Assault',
    shapes: [new Set(['0,0', '0,1', '2,0', '2,1'])],
    terrains: [Monster],
    isMonster: true,
  },
  {
    id: '03',
    name: 'Kobold Onslaught',
    shapes: [new Set(['0,0', '0,1', '1,1', '0,2'])],
    terrains: [Monster],
    isMonster: true,
  },
  {
    id: '04',
    name: 'Gnoll Raid',
    shapes: [new Set(['0,0', '1,0', '0,1', '0,2', '1,2'])],
    terrains: [Monster],
    isMonster: true,
  },
]

const ruinsCards: RuinsCard[] = [
  {
    id: '05',
    name: 'Temple Ruins',
    isRuins: true,
  },
  {
    id: '06',
    name: 'Outpost Ruins',
    isRuins: true,
  },
]

const exploreCards: ExploreCard[] = [
  {
    id: '07',
    name: 'Great River',
    terrains: [Water],
    time: 1,
    shapes: [
      new Set(['0,0', '0,1', '0,2']),
      new Set(['2,0', '1,1', '2,1', '0,2', '1,2']),
    ],
  },
  {
    id: '08',
    name: 'Farmland',
    terrains: [Field],
    time: 1,
    shapes: [
      new Set(['0,0', '0,1']),
      new Set(['1,0', '0,1', '1,1', '2,1', '1,2']),
    ],
  },
  {
    id: '09',
    name: 'Hamlet',
    terrains: [Hamlet],
    time: 1,
    shapes: [
      new Set(['0,0', '0,1', '1,0']),
      new Set(['0,0', '1,0', '0,1', '1,1', '2,0']),
    ],
  },
  {
    id: '10',
    name: 'Forgotten Forest',
    terrains: [Forest],
    time: 1,
    shapes: [new Set(['0,0', '1,1']), new Set(['0,0', '0,1', '1,1', '1,2'])],
  },
  {
    id: '11',
    name: 'Hinterland Stream',
    terrains: [Water, Field],
    time: 2,
    shapes: [new Set(['0,0', '1,0', '2,0', '0,1', '0,2'])],
  },
  {
    id: '12',
    name: 'Homestead',
    terrains: [Field, Hamlet],
    time: 2,
    shapes: [new Set(['0,0', '0,1', '1,1', '0,2'])],
  },
  {
    id: '13',
    name: 'Orchard',
    terrains: [Forest, Field],
    time: 2,
    shapes: [new Set(['0,0', '1,0', '2,0', '2,1'])],
  },
  {
    id: '14',
    name: 'Treetop Village',
    terrains: [Forest, Hamlet],
    time: 2,
    shapes: [new Set(['2,0', '3,0', '0,1', '1,1', '1,2'])],
  },
  {
    id: '15',
    name: 'Marshlands',
    terrains: [Water, Forest],
    time: 2,
    shapes: [new Set(['0,0', '0,1', '1,1', '2,1', '0,2'])],
  },
  {
    id: '16',
    name: 'Fishing Village',
    terrains: [Water, Hamlet],
    time: 2,
    shapes: [new Set(['0,0', '1,0', '2,0', '3,0'])],
  },
  {
    id: '17',
    name: 'Rift Lands',
    terrains: [Water, Forest, Field, Hamlet, Monster],
    time: 0,
    shapes: [new Set(['0,0'])],
  },
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

function isFilledOrEdgeCell(cell: Terrain) {
  return ![Empty, Ruins].includes(cell)
}

function isFilledOrEdge(board: Board, x: number, y: number) {
  return ![Empty, Ruins].includes(getTerrain(board, x, y))
}

function getTerrain(board: Board, x: number, y: number): Terrain {
  return board[y]?.[x] ?? Edge
}

function getAdjacentTerrain(board: Board, x: number, y: number): Terrain[] {
  return [
    getTerrain(board, x - 1, y),
    getTerrain(board, x + 1, y),
    getTerrain(board, x, y - 1),
    getTerrain(board, x, y + 1),
  ]
}

function findClusters(board: Board, terrain: PlaceableTerrain): Set<Coords>[] {
  const clusters: Set<Coords>[] = []
  for (let y = 0; y < board.length; y++) {
    const row = board[y]
    for (let x = 0; x < row.length; x++) {
      const visited = new Set<Coords>()
      if (row[x] === terrain && !clusters.some((c) => c.has(toCoords(x, y)))) {
        const cluster = new Set<Coords>()
        const queue = [toCoords(x, y)]
        while (queue.length > 0) {
          const coords = queue.pop()!
          if (!visited.has(coords)) {
            visited.add(coords)
            cluster.add(coords)
            const [x, y] = fromCoords(coords)
            if (
              x > 0 &&
              board[y][x - 1] === terrain &&
              !visited.has(toCoords(x - 1, y))
            )
              queue.push(toCoords(x - 1, y))
            if (
              x < board.length - 1 &&
              board[y][x + 1] === terrain &&
              !visited.has(toCoords(x + 1, y))
            )
              queue.push(toCoords(x + 1, y))
            if (
              y > 0 &&
              board[y - 1][x] === terrain &&
              !visited.has(toCoords(x, y - 1))
            )
              queue.push(toCoords(x, y - 1))
            if (
              y < board.length - 1 &&
              board[y + 1][x] === terrain &&
              !visited.has(toCoords(x, y + 1))
            )
              queue.push(toCoords(x, y + 1))
          }
        }
        clusters.push(cluster)
      }
    }
  }
  return clusters
}

export const edicts: Edict[] = [
  {
    id: 26,
    type: 'green',
    name: 'Sentinel Wood',
    calculateScore: (board: Board) =>
      board
        .map((row, y) =>
          row.filter(
            (cell, x) =>
              cell === Forest &&
              (x === 0 ||
                x === board.length - 1 ||
                y === 0 ||
                y === board.length - 1)
          )
        )
        .reduce((a, b) => a + b.length, 0),
  },
  {
    id: 27,
    type: 'green',
    name: 'Greenbough',
    calculateScore: (board: Board) => {
      const matchingColumns = new Set<number>()
      const matchingRows = new Set<number>()
      for (let y = 0; y < board.length; y++) {
        const row = board[y]
        for (let x = 0; x < row.length; x++) {
          if (row[x] === Forest) {
            matchingColumns.add(x)
            matchingRows.add(y)
          }
        }
      }
      return matchingColumns.size + matchingRows.size
    },
  },
  {
    id: 28,
    type: 'green',
    name: 'Treetower',
    calculateScore: (board: Board) =>
      board
        .map(
          (row, y) =>
            row.filter(
              (cell, x) =>
                cell === Forest &&
                isFilledOrEdge(board, x - 1, y) &&
                isFilledOrEdge(board, x + 1, y) &&
                isFilledOrEdge(board, x, y - 1) &&
                isFilledOrEdge(board, x, y + 1)
            ).length
        )
        .reduce((a, b) => a + b, 0),
  },
  {
    id: 29,
    type: 'green',
    name: 'Stoneside Forest',
    calculateScore: (board: Board) => {
      const forestClusters = findClusters(board, Forest)
      const connectedMountains = new Set<Coords>()

      for (const cluster of forestClusters) {
        for (const coords of cluster) {
          // Find all adjacent mountains
          const [x, y] = fromCoords(coords)
          if (x > 0 && board[y][x - 1] === Mountain)
            connectedMountains.add(toCoords(x - 1, y))
          if (x < board.length - 1 && board[y][x + 1] === Mountain)
            connectedMountains.add(toCoords(x + 1, y))
          if (y > 0 && board[y - 1][x] === Mountain)
            connectedMountains.add(toCoords(x, y - 1))
          if (y < board.length - 1 && board[y + 1][x] === Mountain)
            connectedMountains.add(toCoords(x, y + 1))
        }
      }

      return connectedMountains.size * 3
    },
  },
  {
    id: 30,
    type: 'yellowblue',
    name: 'Canal Lake',
    calculateScore: (board: Board) =>
      board
        .map(
          (row, y) =>
            row.filter(
              (cell, x) =>
                (cell === Water &&
                  getAdjacentTerrain(board, x, y).some(
                    (terrain) => terrain === Field
                  )) ||
                (cell === Field &&
                  getAdjacentTerrain(board, x, y).some(
                    (terrain) => terrain === Water
                  ))
            ).length
        )
        .reduce((a, b) => a + b, 0),
  },
  {
    id: 31,
    type: 'yellowblue',
    name: 'Mages Valley',
    calculateScore: (board: Board) => {
      const waterAdjacentToMountains = board
        .map(
          (row, y) =>
            row.filter(
              (cell, x) =>
                cell === Water &&
                getAdjacentTerrain(board, x, y).some(
                  (terrain) => terrain === Mountain
                )
            ).length
        )
        .reduce((a, b) => a + b, 0)
      const fieldsAdjacentToMountains = board
        .map(
          (row, y) =>
            row.filter(
              (cell, x) =>
                cell === Field &&
                getAdjacentTerrain(board, x, y).some(
                  (terrain) => terrain === Mountain
                )
            ).length
        )
        .reduce((a, b) => a + b, 0)

      return waterAdjacentToMountains * 2 + fieldsAdjacentToMountains
    },
  },
  {
    id: 32,
    type: 'yellowblue',
    name: 'The Golden Granary',
    calculateScore: (board: Board) => {
      const waterAdjacentToRuins = board
        .map(
          (row, y) =>
            row.filter(
              (cell, x) =>
                cell === Water &&
                getAdjacentTerrain(DefaultBoard, x, y).some(
                  (terrain) => terrain === Ruins
                )
            ).length
        )
        .reduce((a, b) => a + b, 0)
      const fieldsPlacedOnRuins = board
        .map(
          (row, y) =>
            row.filter(
              (cell, x) => cell === Field && DefaultBoard[y][x] === Ruins
            ).length
        )
        .reduce((a, b) => a + b, 0)

      return waterAdjacentToRuins + fieldsPlacedOnRuins * 3
    },
  },
  {
    id: 33,
    type: 'yellowblue',
    name: 'Shoreside Expanse',
    calculateScore: (board: Board) => {
      const fieldClustersNotAdjacentToWaterOrEdge = findClusters(
        board,
        Field
      ).filter((cluster) =>
        [...cluster].every((coords) =>
          getAdjacentTerrain(board, ...fromCoords(coords)).every(
            (terrain) => terrain !== Water && terrain !== Edge
          )
        )
      )
      const waterClustersNotAdjacentToFieldOrEdge = findClusters(
        board,
        Water
      ).filter((cluster) =>
        [...cluster].every((coords) =>
          getAdjacentTerrain(board, ...fromCoords(coords)).every(
            (terrain) => terrain !== Field && terrain !== Edge
          )
        )
      )
      return (
        (fieldClustersNotAdjacentToWaterOrEdge.length +
          waterClustersNotAdjacentToFieldOrEdge.length) *
        3
      )
    },
  },
  {
    id: 34,
    type: 'red',
    name: 'Wildholds',
    calculateScore: (board: Board) => {
      const hamletClustersLargerThanFive = findClusters(board, Hamlet).filter(
        (cluster) => cluster.size > 5
      )
      return hamletClustersLargerThanFive.length * 8
    },
  },
  {
    id: 35,
    type: 'red',
    name: 'Great City',
    calculateScore: (board: Board) => {
      const largestHamletClusterNotAdjacentToMountains = findClusters(
        board,
        Hamlet
      )
        .filter((cluster) =>
          [...cluster].every((coords) =>
            getAdjacentTerrain(board, ...fromCoords(coords)).every(
              (terrain) => terrain !== Mountain
            )
          )
        )
        .reduce((a, b) => (a.size > b.size ? a : b), new Set<Coords>())
      return largestHamletClusterNotAdjacentToMountains.size
    },
  },
  {
    id: 36,
    type: 'red',
    name: 'Greengold Plains',
    calculateScore: (board: Board) => {
      const hamletClustersAdjacentToAtLeastThreeDifferentTerrains =
        findClusters(board, Hamlet).filter((cluster) => {
          const terrains = new Set<Terrain>()
          for (const coords of cluster) {
            const [x, y] = fromCoords(coords)
            const adjacentTerrains = getAdjacentTerrain(board, x, y)
            for (const terrain of adjacentTerrains) {
              if (![Edge, Empty, Ruins, Hamlet].includes(terrain))
                terrains.add(terrain)
            }
          }
          return terrains.size >= 3
        })
      return hamletClustersAdjacentToAtLeastThreeDifferentTerrains.length * 3
    },
  },
  {
    id: 37,
    type: 'red',
    name: 'Shieldgate',
    calculateScore: (board: Board) => {
      const secondLargestHamletCluster = findClusters(board, Hamlet)
        .sort((a, b) => b.size - a.size)
        .slice(1, 2)[0]
      return (secondLargestHamletCluster?.size ?? 0) * 2
    },
  },
  {
    id: 38,
    type: 'grey',
    name: 'Borderlands',
    calculateScore: (board: Board) => {
      const countPerRow = Array.from({ length: board.length }, () => 0)
      const countPerColumn = Array.from({ length: board.length }, () => 0)

      for (let y = 0; y < board.length; y++) {
        const row = board[y]
        for (let x = 0; x < row.length; x++) {
          if (isFilledOrEdgeCell(row[x])) {
            countPerRow[y]++
            countPerColumn[x]++
          }
        }
      }

      const filledRows = countPerRow.filter(
        (count) => count === board.length
      ).length
      const filledColumns = countPerColumn.filter(
        (count) => count === board.length
      ).length

      return (filledRows + filledColumns) * 6
    },
  },
  {
    id: 39,
    type: 'grey',
    name: 'Lost Barony',
    calculateScore: (board: Board) => {
      const filledSquareSizes = board.map((row, y) =>
        row.map((cell, x) => {
          if (isFilledOrEdgeCell(cell)) {
            let size = 1
            let nextSize = 1
            let isSquare = true
            while (
              isSquare &&
              x + nextSize <= board.length &&
              y + nextSize <= board.length
            ) {
              for (let i = 0; i < nextSize; i++) {
                if (
                  [Edge, Empty, Ruins].includes(
                    getTerrain(board, x + nextSize, y + i)
                  )
                ) {
                  isSquare = false
                }
              }
              for (let i = 0; i < nextSize; i++) {
                if (
                  [Edge, Empty, Ruins].includes(
                    getTerrain(board, x + i, y + nextSize)
                  )
                ) {
                  isSquare = false
                }
              }
              if (isSquare) {
                size = nextSize + 1
                nextSize++
              }
            }
            return size
          } else {
            return 0
          }
        })
      )
      const largestFilledSquareSize = Math.max(
        ...filledSquareSizes.flatMap((row) => row)
      )
      return largestFilledSquareSize * 3
    },
  },
  {
    id: 40,
    type: 'grey',
    name: 'The Broken Road',
    calculateScore: (board: Board) => {
      let diagonalCells = 0

      for (let y = 0; y < board.length; y++) {
        let i = 0
        let cell = getTerrain(board, 0, y)
        while (isFilledOrEdgeCell(cell)) {
          cell = getTerrain(board, i, y + i)
          if (cell === Edge) {
            diagonalCells++
            break
          }
          i++
        }
      }

      return diagonalCells * 3
    },
  },
  {
    id: 41,
    type: 'grey',
    name: 'The Cauldrons',
    calculateScore: (board: Board) =>
      board
        .map(
          (row, y) =>
            row.filter(
              (cell, x) =>
                !isFilledOrEdgeCell(cell) &&
                getAdjacentTerrain(board, x, y).every(isFilledOrEdgeCell)
            ).length
        )
        .reduce((a, b) => a + b, 0),
  },
]

export const edictsById = edicts.reduce((acc, edict) => {
  acc[edict.id] = edict
  return acc
}, {} as Record<number, Edict>)

export function getRandomEdicts(seed: string): Record<Decree, number> {
  const rng = random(seed)
  const types = shuffleArray(['green', 'yellowblue', 'red', 'grey'], rng)
  const A = shuffleArray(
    edicts.filter((e) => e.type === types[0]),
    rng
  )[0].id
  const B = shuffleArray(
    edicts.filter((e) => e.type === types[1]),
    rng
  )[0].id
  const C = shuffleArray(
    edicts.filter((e) => e.type === types[2]),
    rng
  )[0].id
  const D = shuffleArray(
    edicts.filter((e) => e.type === types[3]),
    rng
  )[0].id

  return { A, B, C, D }
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
  const rng = random(seed)
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

function shuffleArray<T>(array: T[], rng: random.PRNG): T[] {
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
