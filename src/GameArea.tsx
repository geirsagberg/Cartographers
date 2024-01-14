import { match } from 'ts-pattern'
import Game from './Game'
import Briefing from './components/Briefing'
import CurrentCard from './components/CurrentCard'
import Menu from './components/Menu'
import UrlImg from './components/UrlImg'
import { Router } from './router'
import { getEdictUrl } from './utils'

export default function GameArea() {
  const route = Router.useRoute([
    'GameBriefing',
    'GameBriefingEdict',
    'GameCard',
    'GameEdict',
    'GameMenu',
  ])

  return (
    <>
      <Game />
      {match(route)
        .with({ name: 'GameBriefing' }, () => <Briefing />)
        .with(
          { name: 'GameBriefingEdict' },
          ({ params: { edictId, gameCode } }) => (
            <>
              <Briefing />
              <UrlImg
                url={getEdictUrl(edictId)}
                close={() =>
                  Router.replace('GameBriefing', { gameCode: gameCode })
                }
              />
            </>
          )
        )
        .with({ name: 'GameCard' }, () => <CurrentCard />)
        .with({ name: 'GameEdict' }, ({ params: { edictId, gameCode } }) => (
          <UrlImg
            url={getEdictUrl(edictId)}
            close={() => Router.replace('GameMain', { gameCode: gameCode })}
          />
        ))
        .with({ name: 'GameMenu' }, () => <Menu />)
        .otherwise(() => null)}
    </>
  )
}
