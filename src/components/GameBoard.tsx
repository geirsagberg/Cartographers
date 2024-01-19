import { toCoords } from '../rules/utils'
import { useGameState } from '../state'
import { TextColor } from '../themes'
import Cell from './Cell'

export function GameBoard() {
  const board = useGameState.use.board()
  const nextPiece = useGameState.use.nextPiece()
  const selectedTerrain = useGameState.use.selectedTerrain()
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
        border: '2px solid ' + TextColor,
      }}
    >
      {board.map((row, y) =>
        row.map((terrain, x) => {
          const coords = toCoords(x, y)
          return (
            <Cell
              key={coords}
              x={x}
              y={y}
              terrain={
                nextPiece.has(coords) && selectedTerrain
                  ? selectedTerrain
                  : terrain
              }
            />
          )
        })
      )}
    </div>
  )
}
