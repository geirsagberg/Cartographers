import { Coords } from './state'
import { PlaceableTerrain } from './types'

export function isLegalPlacement(
  piece: Set<Coords>,
  _terrain: PlaceableTerrain
): boolean {
  return piece.size > 0 && piece.size <= 5
}
