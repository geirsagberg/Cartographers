import { Router } from './router'

export default function Lobby() {
  const gameCode = Router.useParams().gameCode
  return (
    <div className="flex flex-col">
      <h1>Lobby</h1>
    </div>
  )
}
