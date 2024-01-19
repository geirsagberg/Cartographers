import ScoresView from '../ScoresView'
import { useGameState } from '../state'
import Button from './Button'
import Expander from './Expander'

export function ScoresSummary() {
  const scores = useGameState.use.scores()
  const seasonTime = useGameState.use.seasonTime()
  const maxTime = useGameState.use.maxTime()
  const gameOver = useGameState.use.gameOver()
  const endSeason = useGameState.use.endSeason()
  const season = useGameState.use.season()

  return (
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
  )
}
