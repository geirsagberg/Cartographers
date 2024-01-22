import { match } from 'ts-pattern'
import GameArea from './GameArea'
import Lobby from './Lobby'
import Start from './Start'
import { Router } from './router'

export default function App() {
  const route = Router.useRoute(['Start', 'GameArea', 'Lobby'])

  return (
    <div
      style={{
        width: '100dvw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100dvh',
      }}
    >
      {match(route)
        .with({ name: 'Start' }, () => <Start />)
        .with({ name: 'Lobby' }, () => <Lobby />)
        .with({ name: 'GameArea' }, () => <GameArea />)

        .otherwise(() => (
          <div>404</div>
        ))}
    </div>
  )
}
