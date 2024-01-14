import { match } from 'ts-pattern'
import GameArea from './GameArea'
import Start from './Start'
import { Router } from './router'

export default function App() {
  const route = Router.useRoute(['Start', 'GameArea'])

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
        .with({ name: 'GameArea' }, () => <GameArea />)
        .otherwise(() => (
          <div>404</div>
        ))}
    </div>
  )
}
