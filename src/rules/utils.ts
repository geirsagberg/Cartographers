import random from 'seedrandom'
import { Coords } from '../types'

export function toCoords(x: number, y: number): Coords {
  return `${x},${y}`
}

export function fromCoords(coords: Coords): [number, number] {
  const [x, y] = coords.split(',').map(Number)
  return [x, y]
}

export function createRandom(seed: string) {
  return random(seed + '\0')
}
