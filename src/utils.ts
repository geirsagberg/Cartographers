import { create } from 'react-modal-promise'
import Edicts from './components/Edicts'
import Menu from './components/Menu'
import UrlImg from './components/UrlImg'
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

const showUrl = create(UrlImg)

export const showEdict = (id: number) => showUrl({ url: getEdictUrl(id) })

export const showCard = (id: string) => showUrl({ url: getCardUrl(id) })

export const showMenu = create(Menu)

export function getEdictUrl(id: number): string {
  return `https://www.happymeeple.com/img/CTG/scoring/${id}.jpg`
}

export function getCardUrl(id: string): string {
  return `https://www.happymeeple.com/img/CTG/explore/462_630_tinyfied/${id}.jpg`
}
