export const Empty = 'E'
export const Mountain = 'M'
export const Water = 'W'
export const Forest = 'T'
export const Field = 'F'
export const Hamlet = 'H'
export const Monster = 'A'
export const Ruins = 'R'

export type Scores = {
  first: number | null
  second: number | null
  coins: number | null
  monsters: number | null
}

export type Empty = typeof Empty
export type Mountain = typeof Mountain
export type Water = typeof Water
export type Forest = typeof Forest
export type Field = typeof Field
export type Hamlet = typeof Hamlet
export type Monster = typeof Monster
export type Ruins = typeof Ruins

export type Terrain =
  | Empty
  | Mountain
  | Water
  | Forest
  | Field
  | Hamlet
  | Monster
  | Ruins

export type PlaceableTerrain = Forest | Field | Hamlet | Monster | Water
