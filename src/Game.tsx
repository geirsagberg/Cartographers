import Button from './components/Button'
import { Clock } from './components/Clock'
import { ConfirmButtons } from './components/ConfirmButtons'
import { CurrentCardThumbnail } from './components/CurrentCardThumbnail'
import { Edicts } from './components/Edicts'
import { GameBoard } from './components/GameBoard'
import { NewGameButton } from './components/NewGameButton'
import { ScoresSummary } from './components/ScoresSummary'
import { SeasonScores } from './components/SeasonScores'
import { SelectTerrain } from './components/SelectTerrain'
import { useGameState } from './state'
import { GameHeight, GameWidth } from './themes'

export default function Game() {
  const { gameOver, showMenu } = useGameState()

  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '0.5rem',
        width: GameWidth,
        height: GameHeight,
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
            onClick={showMenu}
          >
            Menu
          </Button>
          <Clock />
        </div>

        <CurrentCardThumbnail />
        {gameOver ? <NewGameButton /> : <Edicts />}
      </div>
      <GameBoard />
      <SelectTerrain />
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
        <SeasonScores />
        <ConfirmButtons />
      </div>
      <ScoresSummary />
    </div>
  )
}
