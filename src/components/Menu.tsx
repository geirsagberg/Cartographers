import { FaX } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import { useGameState } from '../state'
import Button from './Button'
import Modal from './Modal'

export default function Menu() {
  const resetGame = useGameState.use.resetGame()

  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  return (
    <Modal isOpen={true} onClickOutside={goBack}>
      <div
        id="lol"
        css={{
          background: 'url(background.jpg)',
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
          <div onClick={goBack}>
            <FaX />
          </div>
        </h2>
        <Button onClick={resetGame}>Reset</Button>
      </div>
    </Modal>
  )
}
