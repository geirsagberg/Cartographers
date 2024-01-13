import { Outlet } from 'react-router-dom'
import './app.css'

export default function Layout() {
  return (
    <main
      css={{
        width: '100dvw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100dvh',
      }}
    >
      <Outlet />
    </main>
  )
}
