import random from 'seedrandom'
import {
  Card,
  ExploreCard,
  Field,
  Forest,
  Hamlet,
  Monster,
  MonsterCard,
  RuinsCard,
  Season,
  Water,
  isExploreCard,
  isMonsterCard,
} from '../types'
import { getMaxTime } from './constants'
import { Random, shuffleArray } from './utils'

export const monsterCards: MonsterCard[] = [
  {
    id: '01',
    name: 'Goblin Attack',
    shapes: [new Set(['0,0', '1,1', '2,2'])],
    terrains: [Monster],
    isMonster: true,
  },
  {
    id: '02',
    name: 'Bugbear Assault',
    shapes: [new Set(['0,0', '0,1', '2,0', '2,1'])],
    terrains: [Monster],
    isMonster: true,
  },
  {
    id: '03',
    name: 'Kobold Onslaught',
    shapes: [new Set(['0,0', '0,1', '1,1', '0,2'])],
    terrains: [Monster],
    isMonster: true,
  },
  {
    id: '04',
    name: 'Gnoll Raid',
    shapes: [new Set(['0,0', '1,0', '0,1', '0,2', '1,2'])],
    terrains: [Monster],
    isMonster: true,
  },
]

export const ruinsCards: RuinsCard[] = [
  {
    id: '05',
    name: 'Temple Ruins',
    isRuins: true,
  },
  {
    id: '06',
    name: 'Outpost Ruins',
    isRuins: true,
  },
]

export const exploreCards: ExploreCard[] = [
  {
    id: '07',
    name: 'Great River',
    terrains: [Water],
    time: 1,
    shapes: [
      new Set(['0,0', '0,1', '0,2']),
      new Set(['2,0', '1,1', '2,1', '0,2', '1,2']),
    ],
  },
  {
    id: '08',
    name: 'Farmland',
    terrains: [Field],
    time: 1,
    shapes: [
      new Set(['0,0', '0,1']),
      new Set(['1,0', '0,1', '1,1', '2,1', '1,2']),
    ],
  },
  {
    id: '09',
    name: 'Hamlet',
    terrains: [Hamlet],
    time: 1,
    shapes: [
      new Set(['0,0', '0,1', '1,0']),
      new Set(['0,0', '1,0', '0,1', '1,1', '2,0']),
    ],
  },
  {
    id: '10',
    name: 'Forgotten Forest',
    terrains: [Forest],
    time: 1,
    shapes: [new Set(['0,0', '1,1']), new Set(['0,0', '0,1', '1,1', '1,2'])],
  },
  {
    id: '11',
    name: 'Hinterland Stream',
    terrains: [Water, Field],
    time: 2,
    shapes: [new Set(['0,0', '1,0', '2,0', '0,1', '0,2'])],
  },
  {
    id: '12',
    name: 'Homestead',
    terrains: [Field, Hamlet],
    time: 2,
    shapes: [new Set(['0,0', '0,1', '1,1', '0,2'])],
  },
  {
    id: '13',
    name: 'Orchard',
    terrains: [Forest, Field],
    time: 2,
    shapes: [new Set(['0,0', '1,0', '2,0', '2,1'])],
  },
  {
    id: '14',
    name: 'Treetop Village',
    terrains: [Forest, Hamlet],
    time: 2,
    shapes: [new Set(['2,0', '3,0', '0,1', '1,1', '1,2'])],
  },
  {
    id: '15',
    name: 'Marshlands',
    terrains: [Water, Forest],
    time: 2,
    shapes: [new Set(['0,0', '0,1', '1,1', '2,1', '0,2'])],
  },
  {
    id: '16',
    name: 'Fishing Village',
    terrains: [Water, Hamlet],
    time: 2,
    shapes: [new Set(['0,0', '1,0', '2,0', '3,0'])],
  },
  {
    id: '17',
    name: 'Rift Lands',
    terrains: [Water, Forest, Field, Hamlet, Monster],
    time: 0,
    shapes: [new Set(['0,0'])],
  },
]

function getCardsForSeason(
  previousCards: Card[],
  monsters: Card[],
  season: Season,
  rng: random.PRNG
): [Card[], Card[]] {
  const cards = shuffleArray(
    [
      ...ruinsCards,
      ...exploreCards,
      ...previousCards.filter(isMonsterCard),
      monsters.pop()!,
    ],
    rng
  )
  const cardsForSeason: Card[] = []
  let time = 0
  const maxTime = getMaxTime(season)
  while (time < maxTime) {
    const card = cards.pop()!
    cardsForSeason.push(card)
    if (isExploreCard(card)) time += card.time
  }
  return [cardsForSeason, cards]
}

export function getCardsPerSeason(rng: Random): Record<Season, Card[]> {
  const monsters = shuffleArray(monsterCards, rng)

  const [springCards, springRest] = getCardsForSeason(
    [],
    monsters,
    'Spring',
    rng
  )
  const [summerCards, summerRest] = getCardsForSeason(
    springRest,
    monsters,
    'Summer',
    rng
  )
  const [fallCards, fallRest] = getCardsForSeason(
    summerRest,
    monsters,
    'Fall',
    rng
  )
  const [winterCards] = getCardsForSeason(fallRest, monsters, 'Winter', rng)

  return {
    Spring: springCards,
    Summer: summerCards,
    Fall: fallCards,
    Winter: winterCards,
  }
}
