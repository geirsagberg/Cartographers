import { dismissCard, useGameState } from '../state'
import { getCardUrl } from '../utils'
import UrlImg from './UrlImg'

export default function CurrentCard() {
  const currentCard = useGameState.use.currentCard()

  if (!currentCard) {
    return null
  }

  return <UrlImg url={getCardUrl(currentCard.id)} close={dismissCard} />
}
