import { FaCoins, FaSpaghettiMonsterFlying } from 'react-icons/fa6'
import { getDecrees } from '../rules/constants'
import { useGameState } from '../state'

export function SeasonScores() {
  const season = useGameState.use.season()
  const scoresByDecree = useGameState.use.scoresByDecree()
  const totalCoins = useGameState.use.totalCoins()
  const monsterScore = useGameState.use.monsterScore()

  const [firstDecree, secondDecree] = getDecrees(season)
  return (
    <div
      css={{
        display: 'flex',
        gap: '0.5rem',
        '& > *': {
          whiteSpace: 'nowrap',
          textAlign: 'center',
          width: '1rem',
        },
      }}
    >
      <span
        css={{
          fontSize: '1.2rem',
        }}
      >
        {firstDecree}
      </span>
      <span>{scoresByDecree[firstDecree]}</span>
      <span
        css={{
          fontSize: '1.2rem',
        }}
      >
        {secondDecree}
      </span>
      <span>{scoresByDecree[secondDecree]}</span>
      <FaCoins />
      <span>{totalCoins}</span>
      <FaSpaghettiMonsterFlying />
      <span>
        {monsterScore > 0 ? '-' : ''}
        {monsterScore}
      </span>
    </div>
  )
}
