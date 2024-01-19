import { FaClock } from 'react-icons/fa6'
import { useGameState } from '../state'

export function Clock() {
  const gameOver = useGameState.use.gameOver()
  const seasonTime = useGameState.use.seasonTime()
  const maxTime = useGameState.use.maxTime()
  return gameOver ? (
    <div />
  ) : (
    <div>
      <FaClock />
      &nbsp;
      {seasonTime}/{maxTime}
    </div>
  )
}
