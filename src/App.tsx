import Game from './Game'
import Start from './Start'
import { useGameState } from './state'

export default function App() {
  const gameCode = useGameState.use.gameCode()

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
      {gameCode ? <Game /> : <Start />}
    </div>
  )
}
