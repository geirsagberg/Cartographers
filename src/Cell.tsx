import tinyColor from 'tinycolor2'
import { DefaultBoard, toCoords, useGameState } from './state'
import {
  CellSize,
  ColorMap,
  IconMap,
  IconSize,
  RuinsColor,
  TextColor,
} from './themes'
import { Mountain, Ruins, Terrain } from './types'

export interface CellProps {
  terrain: Terrain
  x: number
  y: number
}

export default function Cell({ x, y, terrain }: CellProps) {
  const toggleNextPiece = useGameState.use.toggleNextPiece()
  const nextPiece = useGameState.use.nextPiece()
  const coords = toCoords(x, y)
  const isPlacing = nextPiece.has(coords)
  const color = tinyColor(ColorMap[terrain])
  const selectedColor = (isPlacing ? color.lighten(5) : color).toString()
  return (
    <div
      onClick={() => toggleNextPiece(coords)}
      css={{
        border: isPlacing ? 'none' : '0.5px solid #3f170033',
        backgroundColor: selectedColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: CellSize,
        height: CellSize,
        // boxShadow: isPlacing ? '0 0 0 1px ' + TextColor : undefined,
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
              : terrain === Mountain
              ? 'white'
              : isPlacing
              ? 'white'
              : 'white',
        })
      ) : (
        <span css={{ width: IconSize, height: IconSize }}>&nbsp;</span>
      )}
      {isPlacing && (
        <div
          css={{
            position: 'absolute',
            width: CellSize,
            height: CellSize,
            border: '1px solid ' + TextColor,
            boxSizing: 'content-box',
            borderTopColor: nextPiece.has(toCoords(x, y - 1))
              ? 'transparent'
              : undefined,
            borderBottomColor: nextPiece.has(toCoords(x, y + 1))
              ? 'transparent'
              : undefined,
            borderLeftColor: nextPiece.has(toCoords(x - 1, y))
              ? 'transparent'
              : undefined,
            borderRightColor: nextPiece.has(toCoords(x + 1, y))
              ? 'transparent'
              : undefined,
          }}
        />
      )}
    </div>
  )
}
