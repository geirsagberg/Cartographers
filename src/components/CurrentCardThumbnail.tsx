import { showCurrentCard, useGameState } from '../state'
import { isRuinsCard } from '../types'
import { getCardUrl } from '../utils'

export function CurrentCardThumbnail() {
  const currentCard = useGameState.use.currentCard()
  const seasonTime = useGameState.use.seasonTime()
  const maxTime = useGameState.use.maxTime()
  const previousCard = useGameState.use.previousCard()
  return (
    <div
      css={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: 62,
      }}
    >
      {currentCard && seasonTime < maxTime && (
        <>
          {isRuinsCard(previousCard) && (
            <img
              src={getCardUrl(previousCard.id)}
              alt={previousCard.name}
              css={{
                top: 0,
                left: '0.5rem',
                height: '85%',
                position: 'absolute',
              }}
              draggable={false}
            />
          )}
          <img
            css={{
              height: isRuinsCard(previousCard) ? '85%' : '100%',
              bottom: 0,
              right: isRuinsCard(previousCard) ? '0.5rem' : 'initial',
              position: 'absolute',
            }}
            src={getCardUrl(currentCard.id)}
            alt={currentCard.name}
            onClick={showCurrentCard}
            draggable={false}
          />
        </>
      )}
    </div>
  )
}
