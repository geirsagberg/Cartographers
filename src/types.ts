export const Empty = 'E'
export const Mountain = 'M'
export const Water = 'W'
export const Forest = 'T'
export const Field = 'F'
export const Hamlet = 'H'
export const Monster = 'A'
export const Ruins = 'R'

export type Scores = {
  season: Season
  first: number
  second: number
  coins: number
  monsters: number
}

export type Edict = {
  id: number
  type: EdictType
  name: string
  calculateScore: (board: Board) => number
}

export type Decree = 'A' | 'B' | 'C' | 'D'

export type EdictType = 'green' | 'yellowblue' | 'red' | 'grey'

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

export type Board = Terrain[][]

export type Coords = `${number},${number}`

export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter'
