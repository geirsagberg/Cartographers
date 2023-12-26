import { CSSProperties, useState } from 'react'

import { FaArrowRotateLeft, FaCoins, FaMinus, FaPlus } from 'react-icons/fa6'
import Modal from 'react-modal'

import Cell from './Cell'
import ScoresView, { TextColor } from './ScoresView'
import './app.css'
import Button from './components/Button'
import Expander from './components/Expander'
import { isLegalPlacement } from './rules'
import { toCoords, useGameState } from './state'
import { ColorMap, IconMap, LargeIconSize, SmallButtonSize } from './themes'
import {
  Field,
  Forest,
  Hamlet,
  Monster,
  PlaceableTerrain,
  Scores,
  Water,
} from './types'
import { sumScores } from './utils'

const SmallButtonStyle: CSSProperties = {
  width: SmallButtonSize,
  height: SmallButtonSize,
}

const Selections: PlaceableTerrain[] = [Water, Forest, Field, Hamlet, Monster]

const EmptyScores: Scores = {
  first: null,
  second: null,
  coins: null,
  monsters: null,
}

Modal.setAppElement('#root')

export default function App() {
  const [coins, setCoins] = useState(0)

  const board = useGameState.use.board()
  const selectedTerrain = useGameState.use.selectedTerrain()
  const selectTerrain = useGameState.use.selectTerrain()
  const nextPiece = useGameState.use.nextPiece()
  const confirmPlacement = useGameState.use.confirmPlacement()
  const clearPiece = useGameState.use.clearPiece()

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
            row.map((terrain, x) => {
              const coords = toCoords(x, y)
              return (
                <Cell
                  key={coords}
                  x={x}
                  y={y}
                  terrain={nextPiece.has(coords) ? selectedTerrain : terrain}
                />
              )
            })
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {Selections.map((terrain: PlaceableTerrain) => (
            <div
              key={terrain}
              style={{
                backgroundColor: ColorMap[terrain],
                width: '3rem',
                height: '3rem',
                border: '2px solid ' + TextColor,
                boxShadow:
                  terrain === selectedTerrain ? '0 0 0.5rem black' : undefined,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => selectTerrain(terrain)}
            >
              {IconMap[terrain] ? (
                IconMap[terrain]({ size: LargeIconSize, color: 'white' })
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
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
            '& .button:active': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            },
            gap: '1rem',
          }}
        >
          <div
            css={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <Button
              style={SmallButtonStyle}
              onClick={() => setCoins((c) => Math.max(0, c - 1))}
            >
              <FaMinus size={LargeIconSize} />
            </Button>

            <FaCoins />
            <span style={{ fontSize: '1.5rem', width: '1.5rem' }}>{coins}</span>
            <Button
              style={SmallButtonStyle}
              onClick={() => setCoins(coins + 1)}
            >
              <FaPlus size={LargeIconSize} />
            </Button>
          </div>
          <Expander />
          <Button
            style={SmallButtonStyle}
            disabled={!nextPiece.size}
            onClick={clearPiece}
          >
            <FaArrowRotateLeft />
          </Button>
          <Button
            disabled={!isLegalPlacement(nextPiece, selectedTerrain)}
            onClick={confirmPlacement}
            style={{
              height: SmallButtonSize,
            }}
          >
            Confirm
          </Button>
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
            <ScoresView
              setExpand={setExpandSpring}
              expand={expandSpring}
              scores={springScore}
              setScores={setSpringScore}
              label="Spring"
              firstLabel="A"
              secondLabel="B"
            />
            <ScoresView
              setExpand={setExpandSummer}
              expand={expandSummer}
              scores={summerScore}
              setScores={setSummerScore}
              label="Summer"
              firstLabel="B"
              secondLabel="C"
            />
            <ScoresView
              setExpand={setExpandFall}
              expand={expandFall}
              scores={fallScore}
              setScores={setFallScore}
              label="Fall"
              firstLabel="C"
              secondLabel="D"
            />
            <ScoresView
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
