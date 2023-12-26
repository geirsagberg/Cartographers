import tinyColor from 'tinycolor2'
import { TextColor } from './ScoresView'
import { DefaultBoard, toCoords, useGameState } from './state'
import { CellSize, ColorMap, IconMap, IconSize, RuinsColor } from './themes'
import { Ruins, Terrain } from './types'

export interface CellProps {
  terrain: Terrain
  x: number
  y: number
  isPlacing: boolean
}

export default function Cell({ x, y, terrain, isPlacing }: CellProps) {
  const toggleNextPiece = useGameState.use.toggleNextPiece()
  const coords = toCoords(x, y)
  const color = tinyColor(ColorMap[terrain])
  const selectedColor = (isPlacing ? color : color.darken(5)).toString()
  return (
    <div
      onClick={() => toggleNextPiece(coords)}
      css={{
        border: '0.5px solid ' + TextColor,
        backgroundColor: selectedColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: CellSize,
        height: CellSize,
      }}
    >
      {DefaultBoard[y][x] === Ruins && terrain !== Ruins && (
        <div
          css={{
            position: 'absolute',
            backgroundColor: RuinsColor,
            width: '100%',
            height: '100%',
            zIndex: -1,
          }}
        />
      )}
      {IconMap[terrain] ? (
        IconMap[terrain]({
          size: IconSize,
          color:
            terrain === Ruins
              ? RuinsColor
              : isPlacing
              ? 'white'
              : 'rgba(255,255,255, 0.5)',
        })
      ) : (
        <span css={{ width: IconSize, height: IconSize }}>&nbsp;</span>
      )}
    </div>
  )
}
