import { CSSProperties, Dispatch, SetStateAction } from 'react'
import { FaCoins, FaSpaghettiMonsterFlying } from 'react-icons/fa6'
import { sumScores } from './utils'

export const TextColor = '#3f1700dd'

const ScoreStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  width: '5rem',
  position: 'relative',
  border: '2px solid ' + TextColor,
  padding: '0.5rem',
}

const ScoreInputStyle: CSSProperties = {
  color: TextColor,
  width: '3rem',
  fontSize: '1rem',
  textAlign: 'center',
  background: 'rgba(0, 0, 0, 0.08)',
}

export default function Scores({
  setExpand,
  expand,
  scores,
  setScores,
  label,
  firstLabel,
  secondLabel,
}: {
  setExpand: Dispatch<SetStateAction<boolean>>
  expand: boolean
  scores: Scores
  setScores: Dispatch<SetStateAction<Scores>>
  label: string
  firstLabel: string
  secondLabel: string
}) {
  return (
    <div
      style={ScoreStyle}
      onClick={(e) =>
        !(e.target instanceof HTMLInputElement) && setExpand((e: boolean) => !e)
      }
    >
      <div
        style={{
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {label}
      </div>
      {expand ? (
        <div className="score-inputs">
          <div>{firstLabel}</div>
          <input
            type="number"
            style={ScoreInputStyle}
            value={scores.first ?? ''}
            onChange={(e) =>
              setScores((score) => ({
                ...score,
                first: e.target.value ? +e.target.value : null,
              }))
            }
          />
          <div>{secondLabel}</div>
          <input
            type="number"
            style={ScoreInputStyle}
            value={scores.second ?? ''}
            onChange={(e) =>
              setScores((score) => ({
                ...score,
                second: e.target.value ? +e.target.value : null,
              }))
            }
          />
          <FaCoins />
          <input
            type="number"
            style={ScoreInputStyle}
            value={scores.coins ?? ''}
            onChange={(e) =>
              setScores((score) => ({
                ...score,
                coins: e.target.value ? +e.target.value : null,
              }))
            }
          />
          <FaSpaghettiMonsterFlying />
          <input
            type="number"
            style={ScoreInputStyle}
            value={scores.monsters ?? ''}
            onChange={(e) =>
              setScores((score) => ({
                ...score,
                monsters: e.target.value ? +e.target.value : null,
              }))
            }
          />
        </div>
      ) : (
        <div>{sumScores(scores)}</div>
      )}
    </div>
  )
}
