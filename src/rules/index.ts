import { GameSetup } from '../types'
import { getCardsPerSeason } from './cards'
import { boards } from './constants'
import { getEdictsByDecree } from './edicts'
import { Random, createRandom } from './utils'

export * from './utils'

function getInitialBoard(rng: Random) {
  const i = rng.int32() % boards.length
  return boards[i]
}

export function getGameSetup(gameCode: string | null): GameSetup {
  const rng = createRandom(gameCode ?? '0')
  const cardsPerSeason = getCardsPerSeason(rng)
  const edictsByDecree = getEdictsByDecree(rng)
  const initialBoard = getInitialBoard(rng)

  return {
    initialBoard,
    cardsPerSeason,
    edictsByDecree,
  }
}
