import {
  Board,
  Coords,
  Decree,
  Edict,
  Empty,
  Forest,
  PlaceableTerrain,
  Ruins,
  Season,
} from './types'

export function isLegalPlacement(
  piece: Set<Coords>,
  _terrain: PlaceableTerrain
): boolean {
  return piece.size > 0 && piece.size <= 5
}

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

function isFilledOrEdge(board: Board, x: number, y: number) {
  return (
    x < 0 ||
    x >= board[0].length ||
    y < 0 ||
    y >= board.length ||
    ![Empty, Ruins].includes(board[y][x])
  )
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
    calculateScore: (_board: Board) => 0,
  },
  {
    id: 30,
    type: 'yellowblue',
    name: 'Canal Lake',
    calculateScore: (_board: Board) => 0,
  },
  {
    id: 31,
    type: 'yellowblue',
    name: 'Mages Valley',
    calculateScore: (_board: Board) => 0,
  },
  {
    id: 32,
    type: 'yellowblue',
    name: 'The Golden Granary',
    calculateScore: (_board: Board) => 0,
  },
  {
    id: 33,
    type: 'yellowblue',
    name: 'Shoreside Expanse',
    calculateScore: (_board: Board) => 0,
  },
  {
    id: 34,
    type: 'red',
    name: 'Wildholds',
    calculateScore: (_board: Board) => 0,
  },
  {
    id: 35,
    type: 'red',
    name: 'Great City',
    calculateScore: (_board: Board) => 0,
  },
  {
    id: 36,
    type: 'red',
    name: 'Greengold Plains',
    calculateScore: (_board: Board) => 0,
  },
  {
    id: 37,
    type: 'red',
    name: 'Shieldgate',
    calculateScore: (_board: Board) => 0,
  },
  {
    id: 38,
    type: 'grey',
    name: 'Borderlands',
    calculateScore: (_board: Board) => 0,
  },
  {
    id: 39,
    type: 'grey',
    name: 'Lost Barony',
    calculateScore: (_board: Board) => 0,
  },
  {
    id: 40,
    type: 'grey',
    name: 'The Broken Road',
    calculateScore: (_board: Board) => 0,
  },
  {
    id: 41,
    type: 'grey',
    name: 'The Cauldrons',
    calculateScore: (_board: Board) => 0,
  },
]

export const edictsById = edicts.reduce((acc, edict) => {
  acc[edict.id] = edict
  return acc
}, {} as Record<number, Edict>)
