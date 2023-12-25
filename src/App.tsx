import { CSSProperties, useState } from 'react'

import {
  FaBuildingColumns,
  FaCoins,
  FaHouse,
  FaMinus,
  FaMountain,
  FaPlus,
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

const MaxSize = 400

const TextColor = '#3f1700dd'

const ScoreStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  width: '4rem',
}

const ScoreInputStyle: CSSProperties = {
  color: TextColor,
  width: '3rem',
  fontSize: '1.5rem',
  textAlign: 'center',
  background: 'rgba(0, 0, 0, 0.08)',
}

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

const RuinsColor = '#3f170077'

const ColorMap = {
  [Empty]: 'rgba(0, 0, 0, 0.08)',
  [Ruins]: 'rgba(0, 0, 0, 0.08)',
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

const LargeIconSize = '2rem'

const SmallButtonSize = '2rem'

const Selections: Cell[] = [Empty, Water, Forest, Field, Hamlet, Monster]

export default function App() {
  const [color, setColor] = useState<Cell>(Empty)

  const [board, setBoard] = useState(StartBoard)

  const [coins, setCoins] = useState(0)

  const [springScore, setSpringScore] = useState('')
  const [summerScore, setSummerScore] = useState('')
  const [fallScore, setFallScore] = useState('')
  const [winterScore, setWinterScore] = useState('')

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '1rem',
          gap: '2rem',
        }}
      >
        <h1
          style={{
            margin: 0,
          }}
        >
          Cartographers
        </h1>
        <div
          style={{
            display: 'grid',
            width: 'calc(100vw - 2rem)',
            height: 'calc(100vw - 2rem)',
            gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
            border: '2px solid ' + TextColor,
            maxWidth: MaxSize,
            maxHeight: MaxSize,
          }}
        >
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                onClick={() => {
                  if (cell === Mountain) return
                  const newBoard = JSON.parse(JSON.stringify(board))
                  newBoard[y][x] = color === Empty ? StartBoard[y][x] : color
                  setBoard(newBoard)
                }}
                style={{
                  border: '0.5px solid ' + TextColor,
                  backgroundColor: ColorMap[cell],
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {StartBoard[y][x] === Ruins && cell !== Ruins && (
                  <div
                    style={{
                      position: 'absolute',
                      backgroundColor: RuinsColor,
                      width: '100%',
                      height: '100%',
                      zIndex: -1,
                    }}
                  />
                )}
                {IconMap[cell] ? (
                  IconMap[cell]({
                    size: IconSize,
                    color: cell === Ruins ? RuinsColor : 'white',
                  })
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
            justifyContent: 'space-between',
            width: 'calc(100vw - 2rem)',
            maxWidth: MaxSize,
          }}
        >
          {Selections.map((cell: Cell) => (
            <div
              key={cell}
              style={{
                backgroundColor: ColorMap[cell],
                width: '3rem',
                height: '3rem',
                border: '2px solid ' + TextColor,
                boxShadow: cell === color ? '0 0 0.5rem black' : undefined,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => setColor(cell)}
            >
              {IconMap[cell] ? (
                IconMap[cell]({ size: LargeIconSize, color: 'white' })
              ) : (
                <span style={{ width: LargeIconSize, height: LargeIconSize }}>
                  &nbsp;
                </span>
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <div
            style={{
              width: SmallButtonSize,
              height: SmallButtonSize,
              border: '2px solid ' + TextColor,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => setCoins(coins + 1)}
          >
            <FaPlus size={LargeIconSize} />
          </div>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{coins}</span>
            <FaCoins size={LargeIconSize} />
          </div>

          <div
            style={{
              width: SmallButtonSize,
              height: SmallButtonSize,
              border: '2px solid ' + TextColor,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => setCoins((c) => Math.max(0, c - 1))}
          >
            <FaMinus size={LargeIconSize} />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <h2
            style={{
              margin: 0,
            }}
          >
            Score
          </h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '2rem',
            }}
          >
            <div style={ScoreStyle}>
              <div>Spring</div>
              <input
                type="number"
                style={ScoreInputStyle}
                value={springScore}
                onChange={(e) => setSpringScore(e.target.value)}
              />
            </div>

            <div style={ScoreStyle}>
              <div>Summer</div>
              <input
                type="number"
                style={ScoreInputStyle}
                value={summerScore}
                onChange={(e) => setSummerScore(e.target.value)}
              />
            </div>

            <div style={ScoreStyle}>
              <div>Fall</div>
              <input
                type="number"
                style={ScoreInputStyle}
                value={fallScore}
                onChange={(e) => setFallScore(e.target.value)}
              />
            </div>

            <div style={ScoreStyle}>
              <div>Winter</div>
              <input
                type="number"
                style={ScoreInputStyle}
                value={winterScore}
                onChange={(e) => setWinterScore(e.target.value)}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: '1.5rem',
            }}
          >
            {' '}
            {(springScore && summerScore && fallScore && winterScore && (
              <>
                <span>Sum: </span>
                {
                  <span>
                    {Number(springScore) +
                      Number(summerScore) +
                      Number(fallScore) +
                      Number(winterScore)}
                  </span>
                }
              </>
            )) || <span>&nbsp;</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
