import { FaX } from 'react-icons/fa6'
import { Router } from '../router'
import { useGameState } from '../state'
import Button from './Button'
import Modal from './Modal'

export default function Menu() {
  const resetGame = useGameState.use.resetGame()
  const gameCode = useGameState.use.gameCode()

  if (!gameCode) {
    return null
  }

  const close = () => Router.push('GameMain', { gameCode })

  return (
    <Modal onClickOutside={close}>
      <div
        css={{
          background: 'url(/background.jpg)',
          padding: '20px',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: 256,
        }}
      >
        <h2
          css={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Menu</span>
          <div onClick={close}>
            <FaX />
          </div>
        </h2>
        <Button onClick={resetGame}>Reset</Button>
      </div>
    </Modal>
  )
}
