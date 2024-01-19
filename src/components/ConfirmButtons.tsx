import { FaArrowRotateLeft } from 'react-icons/fa6'
import { useGameState } from '../state'
import { SmallButtonSize } from '../themes'
import Button from './Button'
import { CSSProperties } from 'react'

const SmallButtonStyle: CSSProperties = {
  width: SmallButtonSize,
  height: SmallButtonSize,
}

export function ConfirmButtons() {
  const nextPiece = useGameState.use.nextPiece()
  const gameOver = useGameState.use.gameOver()
  const clearPiece = useGameState.use.clearPiece()
  const legalPlacement = useGameState.use.legalPlacement()
  const confirmPlacement = useGameState.use.confirmPlacement()

  return (
    <div
      css={{
        display: 'flex',
        gap: '1rem',
      }}
    >
      <Button
        style={SmallButtonStyle}
        disabled={!nextPiece.size || gameOver}
        onClick={clearPiece}
      >
        <FaArrowRotateLeft />
      </Button>
      <Button
        disabled={!legalPlacement || gameOver}
        onClick={confirmPlacement}
        style={{
          height: SmallButtonSize,
        }}
      >
        Confirm
      </Button>
    </div>
  )
}
