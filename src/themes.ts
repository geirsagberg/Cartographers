import {
  FaBuildingColumns,
  FaHouse,
  FaMountain,
  FaSpaghettiMonsterFlying,
  FaTree,
  FaWater,
  FaWheatAwn,
} from 'react-icons/fa6'
import {
  Edge,
  Empty,
  Field,
  Forest,
  Hamlet,
  Monster,
  Mountain,
  Ruins,
  Terrain,
  Wasteland,
  Water,
} from './types'

export const IconSize = '1.25rem'

export const LargeIconSize = '2rem'

export const SmallButtonSize = '2rem'

export const CellSize = '2rem'

export const TextColor = '#3f1700dd'

export const RuinsColor = '#3f170055'

export const ColorMap = {
  [Empty]: 'rgba(0, 0, 0, 0.08)',
  [Ruins]: 'rgba(0, 0, 0, 0.08)',
  [Mountain]: TextColor,
  [Water]: '#075dc362',
  [Forest]: '#1d510a62',
  [Field]: '#d09a1062',
  [Hamlet]: '#84100062',
  [Monster]: '#59059662',
  [Edge]: 'rgba(0, 0, 0, 0.08)',
  [Wasteland]: '#3f1700dd',
}

export const IconMap: Record<Terrain, any> = {
  [Empty]: undefined,
  [Ruins]: FaBuildingColumns,
  [Mountain]: FaMountain,
  [Water]: FaWater,
  [Forest]: FaTree,
  [Field]: FaWheatAwn,
  [Hamlet]: FaHouse,
  [Monster]: FaSpaghettiMonsterFlying,
  [Edge]: undefined,
  [Wasteland]: undefined,
}
