export const Empty = 'E'
export const Mountain = 'M'
export const Water = 'W'
export const Forest = 'T'
export const Field = 'F'
export const Hamlet = 'H'
export const Monster = 'A'
export const Ruins = 'R'
export const Edge = 'X'
export const Wasteland = 'S'

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
  calculateScore: (board: Board, initialBoard: Board) => number
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
export type Edge = typeof Edge
export type Wasteland = typeof Wasteland

export type Terrain =
  | Empty
  | Mountain
  | Water
  | Forest
  | Field
  | Hamlet
  | Monster
  | Ruins
  | Edge
  | Wasteland

export type PlaceableTerrain = Forest | Field | Hamlet | Monster | Water

export type Board = Terrain[][]

export type Coords = `${number},${number}`

export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter'

export type Card = {
  id: string
  name: string
}

export type ShapeCard = Card & {
  shapes: Set<Coords>[]
  terrains: PlaceableTerrain[]
}

export type MonsterCard = ShapeCard & {
  isMonster: true
}

export type RuinsCard = Card & {
  isRuins: true
}

export type ExploreCard = ShapeCard & {
  time: number
}

export function isExploreCard(card: Card | null): card is ExploreCard {
  return card != null && 'time' in card
}

export function isMonsterCard(card: Card | null): card is MonsterCard {
  return card != null && 'isMonster' in card
}

export function isRuinsCard(card: Card | null): card is RuinsCard {
  return card != null && 'isRuins' in card
}

export function isShapeCard(card: Card | null): card is ShapeCard {
  return card != null && 'shapes' in card
}

export type GameSetup = {
  initialBoard: Board
  cardsPerSeason: Record<Season, Card[]>
  edictsByDecree: Record<Decree, Edict>
}
