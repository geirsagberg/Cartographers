import { FaX } from 'react-icons/fa6'
import { InstanceProps } from 'react-modal-promise'
import { useGameState } from '../state'
import Button from './Button'

export interface MenuProps extends InstanceProps<void> {}

export default function Menu({ isOpen, onResolve }: MenuProps) {
  const resetGame = useGameState.use.resetGame()

  if (!isOpen) {
    return null
  }
  return (
    <div
      css={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onResolve()
        }
      }}
    >
      <div
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
          <div onClick={() => onResolve()}>
            <FaX />
          </div>
        </h2>
        <Button onClick={resetGame}>Reset</Button>
      </div>
    </div>
  )
}
