import { create } from 'react-modal-promise'
import SeasonSummary from './components/SeasonSummary'
import { Scores } from './types'

export function sumScores(scores: Scores): number {
  return (
    (scores.first ?? 0) +
    (scores.second ?? 0) +
    (scores.coins ?? 0) -
    (scores.monsters ?? 0)
  )
}

export const showSeasonSummary = create(SeasonSummary)

export function getEdictUrl(id: number): string {
  return `https://www.happymeeple.com/img/CTG/scoring/${id}.jpg`
}

export function getCardUrl(id: string): string {
  return `https://www.happymeeple.com/img/CTG/explore/462_630_tinyfied/${id}.jpg`
}
