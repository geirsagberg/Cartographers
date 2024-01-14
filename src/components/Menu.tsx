import { FaX } from 'react-icons/fa6'
import { Router } from '../router'
import { useGameState } from '../state'
import Button from './Button'
import Modal from './Modal'

export default function Menu() {
  const resetGame = useGameState.use.resetGame()
  const gameCode = useGameState.use.gameCode()

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
        <Button onClick={resetGame}>Reset</Button>
      </div>
    </Modal>
  )
}
