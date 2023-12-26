import { Coords, PlaceableTerrain, Season } from './types'

export function isLegalPlacement(
  piece: Set<Coords>,
  _terrain: PlaceableTerrain
): boolean {
  return piece.size > 0 && piece.size <= 5
}

export function getDecrees(season: Season | null): [string, string] {
  switch (season) {
    case 'Spring':
      return ['A', 'B']
    case 'Summer':
      return ['B', 'C']
    case 'Fall':
      return ['C', 'D']
    case 'Winter':
      return ['D', 'A']
    default:
      return ['', '']
  }
}
