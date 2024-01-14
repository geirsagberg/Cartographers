import { FaCoins, FaSpaghettiMonsterFlying } from 'react-icons/fa6'
import { InstanceProps } from 'react-modal-promise'
import { useGameState } from '../state'
import { GameWidth, IconBySeason } from '../themes'
import Button from './Button'
import Modal from './Modal'

interface SeasonSummaryProps extends InstanceProps<void> {}

export default function SeasonSummary({
  isOpen,
  onResolve,
}: SeasonSummaryProps) {
  const {
    season,
    scoresByDecree,
    monsterScore,
    totalCoins,
    firstDecree,
    secondDecree,
  } = useGameState()

  if (!season) {
    return null
  }

  const firstScore = scoresByDecree[firstDecree]
  const secondScore = scoresByDecree[secondDecree]

  const SeasonIcon = IconBySeason[season]

  return (
    <Modal isOpen={isOpen} onClickOutside={() => onResolve()}>
      <div
        css={{
          background: 'url(/background.jpg)',
          padding: '20px',
          borderRadius: '4px',
          width: GameWidth,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <h2
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
          }}
        >
          <SeasonIcon />
          <span>End of {season}</span>
          <SeasonIcon />
        </h2>
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            fontSize: '1.5rem',
            columnGap: '0.5rem',
            justifyItems: 'center',
          }}
        >
          <span>{firstDecree}</span>
          <span>{secondDecree}</span>
          <span>
            <FaCoins />
          </span>
          <span>
            <FaSpaghettiMonsterFlying />
          </span>
          <span>{firstScore}</span>
          <span>{secondScore}</span>
          <span>{totalCoins}</span>
          <span>
            {monsterScore > 0 ? '-' : ''}
            {monsterScore}
          </span>
        </div>
        <div
          css={{
            fontSize: '2rem',
          }}
        >
          Sum: {firstScore + secondScore + totalCoins - monsterScore}
        </div>
        <Button
          style={{
            alignSelf: 'stretch',
          }}
          onClick={() => onResolve()}
        >
          Continue
        </Button>
      </div>
    </Modal>
  )
}
