import { useState } from 'react'
import Button from './components/Button'
import { useGameState } from './state'

export default function Start() {
  const [code, setCode] = useState('')

  const startGame = useGameState.use.startGame()

  return (
    <form
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '1rem',
        width: 356,
        height: 664,
      }}
      onSubmit={(e) => {
        e.preventDefault()
        if (!code) {
          return
        }
        startGame(code)
      }}
    >
      <h1>Cartographers</h1>
      <div>Enter game code:</div>
      <input
        type="text"
        css={{
          background: 'rgba(0, 0, 0, 0.1)',
          height: '2rem',
        }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button type="submit" disabled={!code}>
        Start
      </Button>
    </form>
  )
}
