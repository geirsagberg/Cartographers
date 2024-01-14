import { Router } from '../router'
import { useGameState } from '../state'
import { GameWidth } from '../themes'
import { getEdictUrl } from '../utils'
import Button from './Button'
import Modal from './Modal'

export default function Briefing() {
  const edicts = useGameState.use.edictsByDecree()
  const gameCode = useGameState.use.gameCode()

  if (!gameCode) {
    return null
  }

  return (
    <Modal>
      <div
        css={{
          background: 'url(/background.jpg)',
          padding: '20px',
          borderRadius: '4px',
          width: GameWidth,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h2>Edicts</h2>
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            fontSize: '1.5rem',
            columnGap: '0.5rem',
            justifyItems: 'center',
          }}
        >
          {Object.entries(edicts).map(([decree, edict]) => (
            <div
              key={decree}
              onClick={() =>
                Router.push('GameBriefingEdict', {
                  gameCode,
                  edictId: edict.id.toString(),
                })
              }
            >
              <img
                css={{ height: 210 }}
                src={getEdictUrl(edict.id)}
                draggable={false}
              />
            </div>
          ))}
        </div>
        <Button onClick={() => Router.push('GameMain', { gameCode })}>
          Close
        </Button>
      </div>
    </Modal>
  )
}
