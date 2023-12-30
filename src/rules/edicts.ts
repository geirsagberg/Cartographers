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
  Mountain,
  PlaceableTerrain,
  Ruins,
  Terrain,
  Water,
} from '../types'
import {
  Random,
  fromCoords,
  getAdjacentTerrain,
  getTerrain,
  isFilledOrEdge,
  isFilledOrEdgeCell,
  shuffleArray,
  toCoords,
} from './utils'

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
    calculateScore: (board: Board, initialBoard: Board) => {
      const waterAdjacentToRuins = board
        .map(
          (row, y) =>
            row.filter(
              (cell, x) =>
                cell === Water &&
                getAdjacentTerrain(initialBoard, x, y).some(
                  (terrain) => terrain === Ruins
                )
            ).length
        )
        .reduce((a, b) => a + b, 0)
      const fieldsPlacedOnRuins = board
        .map(
          (row, y) =>
            row.filter(
              (cell, x) => cell === Field && initialBoard[y][x] === Ruins
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

export function getEdictsByDecree(rng: Random): Record<Decree, Edict> {
  const types = shuffleArray(['green', 'yellowblue', 'red', 'grey'], rng)
  const A = shuffleArray(
    edicts.filter((e) => e.type === types[0]),
    rng
  )[0]
  const B = shuffleArray(
    edicts.filter((e) => e.type === types[1]),
    rng
  )[0]
  const C = shuffleArray(
    edicts.filter((e) => e.type === types[2]),
    rng
  )[0]
  const D = shuffleArray(
    edicts.filter((e) => e.type === types[3]),
    rng
  )[0]

  return { A, B, C, D }
}
