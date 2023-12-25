import { useState } from 'react'

const Empty = 0
const Mountain = 1
const Water = 2
const Forest = 3
const Field = 4
const Hamlet = 5
const Monster = 6

type Cell =
  | typeof Empty
  | typeof Mountain
  | typeof Water
  | typeof Forest
  | typeof Field
  | typeof Hamlet
  | typeof Monster

const StartBoard: Cell[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const ColorMap = {
  [Empty]: 'white',
  [Mountain]: 'brown',
  [Water]: 'blue',
  [Forest]: 'green',
  [Field]: 'orange',
  [Hamlet]: 'red',
  [Monster]: 'purple',
}

const Selections: Cell[] = [Empty, Water, Forest, Field, Hamlet, Monster]

export default function App() {
  const [color, setColor] = useState<Cell>(Empty)

  const [board, setBoard] = useState(StartBoard)

  return (
    <div
      style={{
        width: '100dvw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <h1>Cartographers</h1>
      <div
        style={{
          display: 'grid',
          width: 'calc(100vw - 2rem)',
          height: 'calc(100vw - 2rem)',
          gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              onClick={() => {
                if (cell === Mountain) return
                const newBoard = [...board]
                newBoard[y][x] = color
                setBoard(newBoard)
              }}
              style={{
                border: '1px solid black',
                backgroundColor: ColorMap[cell],
              }}
            />
          ))
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100vw',
          marginTop: '2rem',
        }}
      >
        {Selections.map((cell: Cell) => (
          <div
            style={{
              backgroundColor: ColorMap[cell],
              width: '3rem',
              height: '3rem',
              border: '1px solid black',
              boxShadow: cell === color ? '0 0 0.5rem black' : undefined,
            }}
            onClick={() => setColor(cell)}
          />
        ))}
      </div>
    </div>
  )
}
