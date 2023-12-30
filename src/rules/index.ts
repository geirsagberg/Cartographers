import { GameSetup } from '../types'
import { getCardsPerSeason } from './cards'
import { boards } from './constants'
import { getEdictsByDecree } from './edicts'
import { Random, createRandom } from './utils'

export * from './utils'

function getInitialBoard(rng: Random) {
  const int = rng.int32()
  const length = boards.length
  const i = mod(int, length)
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

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}
