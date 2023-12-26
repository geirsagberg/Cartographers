import { CSSProperties } from 'react'

import {
  FaArrowRotateLeft,
  FaCoins,
  FaQuestion,
  FaSpaghettiMonsterFlying,
} from 'react-icons/fa6'
import Modal from 'react-modal'

import tinycolor from 'tinycolor2'
import Cell from './Cell'
import ScoresView from './ScoresView'
import './app.css'
import Button from './components/Button'
import Expander from './components/Expander'
import { getDecrees, isLegalPlacement } from './rules'
import {
  toCoords,
  useCoins,
  useGameOver,
  useGameState,
  useMonsters,
} from './state'
import {
  ColorMap,
  IconMap,
  LargeIconSize,
  SmallButtonSize,
  TextColor,
} from './themes'
import {
  Field,
  Forest,
  Hamlet,
  Monster,
  PlaceableTerrain,
  Water,
} from './types'
import { showEdict } from './utils'

const SmallButtonStyle: CSSProperties = {
  width: SmallButtonSize,
  height: SmallButtonSize,
}

const Selections: PlaceableTerrain[] = [Water, Forest, Field, Hamlet, Monster]

Modal.setAppElement('#root')

export default function App() {
  const board = useGameState.use.board()
  const selectedTerrain = useGameState.use.selectedTerrain()
  const selectTerrain = useGameState.use.selectTerrain()
  const nextPiece = useGameState.use.nextPiece()
  const confirmPlacement = useGameState.use.confirmPlacement()
  const clearPiece = useGameState.use.clearPiece()
  const season = useGameState.use.season()
  const firstDecreeScore = useGameState.use.firstDecreeScore()
  const secondDecreeScore = useGameState.use.secondDecreeScore()
  const endSeason = useGameState.use.endSeason()
  const scores = useGameState.use.scores()
  const selectEdict = useGameState.use.selectEdict()
  const edicts = useGameState.use.edicts()
  const gameOver = useGameOver()
  const [firstDecree, secondDecree] = getDecrees(season)
  const coins = useCoins()
  const monsters = useMonsters()

  const firstEdict = edicts[firstDecree]
  const secondEdict = edicts[secondDecree]

  return (
    <div
      style={{
        width: '100dvw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        userSelect: 'none',
        height: '100dvh',
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
          height: 664,
        }}
      >
        <div>
          <h2
            css={{
              margin: '0.5rem 0',
            }}
          >
            Cartographers
          </h2>
        </div>
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
                backgroundColor:
                  terrain === selectedTerrain
                    ? tinycolor(ColorMap[terrain]).lighten(5).toString()
                    : ColorMap[terrain],
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
            display: gameOver ? 'none' : 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
            '& .button:active': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          <div
            css={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <span>{firstDecree}</span>
            <Button
              style={SmallButtonStyle}
              onClick={() =>
                edicts[firstDecree]
                  ? showEdict({ edictId: edicts[firstDecree]! })
                  : selectEdict(firstDecree)
              }
            >
              {firstEdict ? firstDecreeScore : <FaQuestion />}
            </Button>
            <span>{secondDecree}</span>
            <Button
              style={SmallButtonStyle}
              onClick={() =>
                edicts[secondDecree]
                  ? showEdict({ edictId: edicts[secondDecree]! })
                  : selectEdict(secondDecree)
              }
            >
              {secondEdict ? secondDecreeScore : <FaQuestion />}
            </Button>
          </div>

          <div
            css={{
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <FaCoins />
            <span style={{ width: '1rem' }}>{coins}</span>
            <FaSpaghettiMonsterFlying />
            <span style={{ width: '1rem', whiteSpace: 'nowrap' }}>
              {monsters > 0 ? '-' : ''}
              {monsters}
            </span>
          </div>
          <div
            css={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            <Button
              style={SmallButtonStyle}
              disabled={!nextPiece.size || gameOver}
              onClick={clearPiece}
            >
              <FaArrowRotateLeft />
            </Button>
            <Button
              disabled={
                !isLegalPlacement(nextPiece, selectedTerrain) || gameOver
              }
              onClick={confirmPlacement}
              style={{
                height: SmallButtonSize,
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            flex: 1,
          }}
        >
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              width: '100%',
              alignItems: 'start',
            }}
          >
            {scores.map((scores) => (
              <ScoresView key={scores.season} scores={scores} />
            ))}
            <Expander />
            {firstEdict != null &&
              secondEdict != null &&
              nextPiece.size === 0 &&
              !gameOver && <Button onClick={endSeason}>End {season}</Button>}
            {gameOver && (
              <div
                css={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: 40,
                }}
              >
                <span>Sum</span>
                <span>
                  {scores.reduce(
                    (acc, { first, second, coins, monsters }) =>
                      acc + first + second + coins - monsters,
                    0
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
