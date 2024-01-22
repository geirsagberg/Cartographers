import { useState } from 'react'
import Button from './components/Button'
import { startMultiplayerGame, useGameState } from './state'
import { GameHeight, GameWidth } from './themes'

export default function Start() {
  const [code, setCode] = useState('')

  const startSoloGame = useGameState.use.startSoloGame()

  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '1rem',
        width: GameWidth,
        height: GameHeight,
      }}
    >
      <h1>Cartographers</h1>
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <a
          href="https://thunderworksgames.com/products/cartographers-board-game#how-to-play"
          target="_blank"
          rel="noreferrer"
        >
          How to play
        </a>
        <a
          href="https://www.happymeeple.com/en/board-games/cartographers/rules/"
          target="_blank"
          rel="noreferrer"
        >
          Extra information
        </a>
        <a
          href="https://www.happymeeple.com/img/rules/CTG_English_Rules_0602.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Full rules (PDF)
        </a>
      </div>
      <div
        css={{
          fontSize: 'large',
        }}
      >
        Enter game code:
      </div>
      <input
        type="text"
        css={{
          background: 'rgba(0, 0, 0, 0.1)',
          height: '2rem',
        }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button disabled={!code} onClick={() => startSoloGame(code)}>
        Start Solo
      </Button>
      <Button disabled={!code} onClick={() => startMultiplayerGame(code)}>
        Start/Join Multiplayer
      </Button>
    </div>
  )
}
