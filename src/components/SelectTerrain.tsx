import tinycolor from 'tinycolor2'
import { useGameState } from '../state'
import { ColorMap, IconMap, LargeIconSize, TextColor } from '../themes'
import {
  Field,
  Forest,
  Hamlet,
  Monster,
  PlaceableTerrain,
  Water,
} from '../types'

const Selections: PlaceableTerrain[] = [Water, Forest, Field, Hamlet, Monster]

export function SelectTerrain() {
  const selectedTerrain = useGameState.use.selectedTerrain()
  const legalTerrain = useGameState.use.legalTerrain()
  const selectTerrain = useGameState.use.selectTerrain()
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      {Selections.map((terrain: PlaceableTerrain) => (
        <div
          key={terrain}
          style={{
            backgroundColor:
              terrain === selectedTerrain
                ? tinycolor(ColorMap[terrain]).lighten(5).toString()
                : ColorMap[terrain],
            width: '3rem',
            height: '3rem',
            border: '2px solid ' + TextColor,
            boxShadow:
              terrain === selectedTerrain ? '0 0 0.5rem black' : undefined,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: legalTerrain.includes(terrain) ? 1 : 0.5,
          }}
          onClick={() =>
            legalTerrain.includes(terrain) && selectTerrain(terrain)
          }
        >
          {IconMap[terrain] ? (
            IconMap[terrain]({ size: LargeIconSize, color: 'white' })
          ) : (
            <span style={{ width: LargeIconSize, height: LargeIconSize }}>
              &nbsp;
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
