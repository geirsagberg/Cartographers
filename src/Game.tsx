import { CSSProperties } from 'react'

import {
  FaArrowRotateLeft,
  FaClock,
  FaCoins,
  FaSpaghettiMonsterFlying,
} from 'react-icons/fa6'

import { Outlet, useNavigate } from 'react-router'
import tinycolor from 'tinycolor2'
import Cell from './Cell'
import ScoresView from './ScoresView'
import Button from './components/Button'
import Expander from './components/Expander'
import { getDecrees } from './rules/constants'
import { toCoords } from './rules/utils'
import { useGameState } from './state'
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
  isRuinsCard,
  isShapeCard,
} from './types'
import { getCardUrl, getEdictUrl } from './utils'

const SmallButtonStyle: CSSProperties = {
  width: SmallButtonSize,
  height: SmallButtonSize,
}

const Selections: PlaceableTerrain[] = [Water, Forest, Field, Hamlet, Monster]

export default function Game() {
  const navigate = useNavigate()
  const board = useGameState.use.board()
  const selectedTerrain = useGameState.use.selectedTerrain()
  const selectTerrain = useGameState.use.selectTerrain()
  const nextPiece = useGameState.use.nextPiece()
  const confirmPlacement = useGameState.use.confirmPlacement()
  const clearPiece = useGameState.use.clearPiece()
  const season = useGameState.use.season()
  const endSeason = useGameState.use.endSeason()
  const scores = useGameState.use.scores()
  const edicts = useGameState.use.edictsByDecree()
  const resetGame = useGameState.use.resetGame()
  const seasonTime = useGameState.use.seasonTime()
  const scoresByDecree = useGameState.use.scoresByDecree()
  const maxTime = useGameState.use.maxTime()
  const gameOver = useGameState.use.gameOver()
  const legalPlacement = useGameState.use.legalPlacement()
  const coins = useGameState.use.totalCoins()
  const monsters = useGameState.use.monsterScore()
  const currentCard = useGameState.use.currentCard()
  const previousCard = useGameState.use.previousCard()
  const [firstDecree, secondDecree] = getDecrees(season)

  const firstEdict = edicts[firstDecree]
  const secondEdict = edicts[secondDecree]

  const legalTerrain =
    seasonTime < maxTime && !gameOver && isShapeCard(currentCard)
      ? currentCard.terrains
      : []

  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '0.5rem',
        width: 356,
        height: 660,
      }}
    >
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          width: '100%',
          gap: '0.5rem',
          paddingTop: '0.5rem',
          height: 70,
        }}
      >
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            style={{
              height: '2rem',
            }}
            onClick={() => navigate('menu')}
          >
            Menu
          </Button>
          {gameOver ? (
            <div />
          ) : (
            <div>
              <FaClock />
              &nbsp;
              {seasonTime}/{maxTime}
            </div>
          )}
        </div>

        <div
          css={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            height: 62,
          }}
        >
          {currentCard && seasonTime < maxTime && (
            <>
              {isRuinsCard(previousCard) && (
                <img
                  src={getCardUrl(previousCard.id)}
                  alt={previousCard.name}
                  css={{
                    top: 0,
                    left: '0.5rem',
                    height: '85%',
                    position: 'absolute',
                  }}
                  draggable={false}
                />
              )}
              <img
                css={{
                  height: isRuinsCard(previousCard) ? '85%' : '100%',
                  bottom: 0,
                  right: isRuinsCard(previousCard) ? '0.5rem' : 'initial',
                  position: 'absolute',
                }}
                src={getCardUrl(currentCard.id)}
                alt={currentCard.name}
                onClick={() => navigate('cards/' + currentCard.id)}
                draggable={false}
              />
            </>
          )}
        </div>
        {gameOver ? (
          <Button
            style={{
              alignSelf: 'start',
              height: '2rem',
            }}
            onClick={resetGame}
          >
            New Game
          </Button>
        ) : (
          Object.entries(edicts).map(([decree, edict]) => (
            <div
              key={decree}
              css={{
                position: 'relative',
                display: 'flex',
                boxShadow: [firstEdict, secondEdict].includes(edict)
                  ? '0 0 0.5rem black'
                  : undefined,
                opacity: [firstEdict, secondEdict].includes(edict) ? 1 : 0.5,
              }}
              onClick={() => navigate('edicts/' + edict.id)}
            >
              <img
                src={getEdictUrl(edict.id)}
                css={{
                  width: '3rem',
                }}
                alt="edict"
              />
              <span
                css={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  fontSize: '2rem',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                }}
              >
                {decree}
              </span>
            </div>
          ))
        )}
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
              opacity: legalTerrain.includes(terrain) ? 1 : 0.5,
            }}
            onClick={() =>
              legalTerrain.includes(terrain) && selectTerrain(terrain)
            }
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
            '& > *': {
              whiteSpace: 'nowrap',
              textAlign: 'center',
              width: '1rem',
            },
          }}
        >
          <span
            css={{
              fontSize: '1.2rem',
            }}
          >
            {firstDecree}
          </span>
          <span>{scoresByDecree[firstDecree]}</span>
          <span
            css={{
              fontSize: '1.2rem',
            }}
          >
            {secondDecree}
          </span>
          <span>{scoresByDecree[secondDecree]}</span>
          <FaCoins />
          <span>{coins}</span>
          <FaSpaghettiMonsterFlying />
          <span>
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
            disabled={!legalPlacement || gameOver}
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
          {seasonTime >= maxTime && !gameOver && (
            <Button onClick={endSeason}>End {season}</Button>
          )}
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
      <Outlet />
    </div>
  )
}
