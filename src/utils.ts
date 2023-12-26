import { create } from 'react-modal-promise'
import Edict from './components/Edict'
import Edicts from './components/Edicts'
import { Scores } from './types'

export function sumScores(scores: Scores): number {
  return (
    (scores.first ?? 0) +
    (scores.second ?? 0) +
    (scores.coins ?? 0) -
    (scores.monsters ?? 0)
  )
}

export const showEdicts = create(Edicts)

export const showEdict = create(Edict)

export function getEdictUrl(id: number): string {
  return `https://www.happymeeple.com/img/CTG/scoring/${id}.jpg`
}
