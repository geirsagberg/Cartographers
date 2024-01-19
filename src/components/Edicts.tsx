import { getDecrees } from '../rules/constants'
import { useGameState } from '../state'
import { getEdictUrl } from '../utils'

export function Edicts() {
  const edictsByDecree = useGameState.use.edictsByDecree()
  const season = useGameState.use.season()

  const showEdict = useGameState.use.showEdict()

  const [firstDecree, secondDecree] = getDecrees(season)

  const firstEdict = edictsByDecree[firstDecree]
  const secondEdict = edictsByDecree[secondDecree]

  return Object.entries(edictsByDecree).map(([decree, edict]) => (
    <div
      key={decree}
      css={{
        position: 'relative',
        display: 'flex',
        boxShadow: [firstEdict, secondEdict].includes(edict)
          ? '0 0 0.5rem black'
          : undefined,
        opacity: [firstEdict, secondEdict].includes(edict) ? 1 : 0.5,
      }}
      onClick={() => showEdict(edict.id)}
    >
      <img
        src={getEdictUrl(edict.id)}
        css={{
          width: '3rem',
        }}
        alt="edict"
      />
      <span
        css={{
          position: 'absolute',
          top: 0,
          left: 0,
          fontSize: '2rem',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
        }}
      >
        {decree}
      </span>
    </div>
  ))
}
