import { useGameState } from '../state'
import Button from './Button'

export function NewGameButton() {
  const resetGame = useGameState.use.resetGame()
  return (
    <Button
      style={{
        alignSelf: 'start',
        height: '2rem',
      }}
      onClick={resetGame}
    >
      New Game
    </Button>
  )
}
