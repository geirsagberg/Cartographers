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
import Modal from 'react-modal'

import './app.css'
import Scores from './Scores'
import { sumScores } from './utils'

const Empty = 0
const Mountain = 1
const Water = 2
const Forest = 3
const Field = 4
const Hamlet = 5
const Monster = 6
const Ruins = 7

export const IconSize = '1.25rem'

export const LargeIconSize = '2rem'

export const SmallButtonSize = '2rem'

export const CellSize = '2rem'

export const TextColor = '#3f1700dd'

const CoinButtonStyle: CSSProperties = {
  width: SmallButtonSize,
  height: SmallButtonSize,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
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

const RuinsColor = '#3f170055'

const ColorMap = {
  [Empty]: 'rgba(0, 0, 0, 0.08)',
  [Ruins]: 'rgba(0, 0, 0, 0.08)',
  [Mountain]: '#16161662',
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

const Selections: Cell[] = [Water, Forest, Field, Hamlet, Monster]

const EmptyScores: Scores = {
  first: null,
  second: null,
  coins: null,
  monsters: null,
}

Modal.setAppElement('#root')

export default function App() {
  const [color, setColor] = useState<Cell>(Empty)

  const [board, setBoard] = useState(StartBoard)

  const [coins, setCoins] = useState(0)

  const [expandSpring, setExpandSpring] = useState(false)
  const [expandSummer, setExpandSummer] = useState(false)
  const [expandFall, setExpandFall] = useState(false)
  const [expandWinter, setExpandWinter] = useState(false)
  const [springScore, setSpringScore] = useState<Scores>(EmptyScores)
  const [summerScore, setSummerScore] = useState<Scores>(EmptyScores)
  const [fallScore, setFallScore] = useState<Scores>(EmptyScores)
  const [winterScore, setWinterScore] = useState<Scores>(EmptyScores)

  const sumSpring = sumScores(springScore)
  const sumSummer = sumScores(summerScore)
  const sumFall = sumScores(fallScore)
  const sumWinter = sumScores(winterScore)

  const sum =
    sumSpring && sumSummer && sumFall && sumWinter
      ? sumSpring + sumSummer + sumFall + sumWinter
      : undefined

  return (
    <div
      style={{
        width: '100dvw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        userSelect: 'none',
        margin: '1rem 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '1rem',
          width: 356,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
            border: '2px solid ' + TextColor,
          }}
        >
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                onClick={() => {
                  if (cell === Mountain) return
                  const newBoard = JSON.parse(JSON.stringify(board))
                  newBoard[y][x] =
                    color === Empty || color === cell ? StartBoard[y][x] : color
                  setBoard(newBoard)
                }}
                style={{
                  border: '0.5px solid ' + TextColor,
                  backgroundColor: ColorMap[cell],
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  width: CellSize,
                  height: CellSize,
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
            width: '100%',
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
          css={{
            display: 'flex',
            gap: '0.5rem',
            '& :active': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            },
            alignItems: 'center',
          }}
        >
          <div
            style={CoinButtonStyle}
            onClick={() => setCoins((c) => Math.max(0, c - 1))}
          >
            <FaMinus size={LargeIconSize} />
          </div>

          <FaCoins />
          <span style={{ fontSize: '1.5rem', width: '1.5rem' }}>{coins}</span>
          <div style={CoinButtonStyle} onClick={() => setCoins(coins + 1)}>
            <FaPlus size={LargeIconSize} />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
          }}
        >
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '0.5rem',
              width: '100%',
              alignItems: 'start',
            }}
          >
            <Scores
              setExpand={setExpandSpring}
              expand={expandSpring}
              scores={springScore}
              setScores={setSpringScore}
              label="Spring"
              firstLabel="A"
              secondLabel="B"
            />
            <Scores
              setExpand={setExpandSummer}
              expand={expandSummer}
              scores={summerScore}
              setScores={setSummerScore}
              label="Summer"
              firstLabel="B"
              secondLabel="C"
            />
            <Scores
              setExpand={setExpandFall}
              expand={expandFall}
              scores={fallScore}
              setScores={setFallScore}
              label="Fall"
              firstLabel="C"
              secondLabel="D"
            />
            <Scores
              setExpand={setExpandWinter}
              expand={expandWinter}
              scores={winterScore}
              setScores={setWinterScore}
              label="Winter"
              firstLabel="D"
              secondLabel="A"
            />
          </div>
          <div
            style={{
              fontSize: '1.5rem',
            }}
          >
            {(sum && <span>Sum: {sum}</span>) || <span>&nbsp;</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
