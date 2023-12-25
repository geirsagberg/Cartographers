import { useState } from 'react'

import {
  FaBuildingColumns,
  FaHouse,
  FaMountain,
  FaSpaghettiMonsterFlying,
  FaTree,
  FaWater,
  FaWheatAwn,
} from 'react-icons/fa6'

const Empty = 0
const Mountain = 1
const Water = 2
const Forest = 3
const Field = 4
const Hamlet = 5
const Monster = 6
const Ruins = 7

type Cell =
  | typeof Empty
  | typeof Mountain
  | typeof Water
  | typeof Forest
  | typeof Field
  | typeof Hamlet
  | typeof Monster
  | typeof Ruins

const StartBoard: Cell[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 7, 0, 0, 0, 0, 0],
  [0, 7, 0, 0, 0, 0, 0, 0, 1, 7, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 7, 1, 0, 0, 0, 0, 0, 0, 7, 0],
  [0, 0, 0, 0, 0, 7, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const TextColor = '#3f1700dd'

const ColorMap = {
  [Empty]: 'rgba(0, 0, 0, 0.08)',
  [Ruins]: '#3f170066',
  [Mountain]: '#6d6d6d62',
  [Water]: '#075dc362',
  [Forest]: '#1d510a62',
  [Field]: '#d09a1062',
  [Hamlet]: '#84100062',
  [Monster]: '#59059662',
}

const IconMap = {
  [Empty]: undefined,
  [Ruins]: FaBuildingColumns,
  [Mountain]: FaMountain,
  [Water]: FaWater,
  [Forest]: FaTree,
  [Field]: FaWheatAwn,
  [Hamlet]: FaHouse,
  [Monster]: FaSpaghettiMonsterFlying,
}

const IconSize = '1.5rem'

const Selections: Cell[] = [Empty, Water, Forest, Field, Hamlet, Monster]

export default function App() {
  const [color, setColor] = useState<Cell>(Empty)

  const [board, setBoard] = useState(StartBoard)

  return (
    <div
      style={{
        fontFamily: 'MedievalSharp, sans-serif',
        color: TextColor,
        width: '100dvw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      <h1>Cartographers</h1>
      <div
        style={{
          display: 'grid',
          width: 'calc(100vw - 2rem)',
          height: 'calc(100vw - 2rem)',
          gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
          border: '2px solid ' + TextColor,
          maxWidth: 512,
          maxHeight: 512,
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
                border: '0.5px solid ' + TextColor,
                backgroundColor: ColorMap[cell],
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {IconMap[cell] ? (
                IconMap[cell]({ size: IconSize, color: 'white' })
              ) : (
                <span style={{ width: IconSize, height: IconSize }}>
                  &nbsp;
                </span>
              )}
            </div>
          ))
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100vw',
          marginTop: '2rem',
          maxWidth: 512,
          marginBottom: '2rem',
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
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => setColor(cell)}
          >
            {IconMap[cell] ? (
              IconMap[cell]({ size: '2.5rem', color: 'white' })
            ) : (
              <span style={{ width: '2.5rem', height: '2.5rem' }}>&nbsp;</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
