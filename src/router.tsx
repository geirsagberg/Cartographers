import { RouterNavigateOptions } from '@remix-run/router'
import { To, createHashRouter } from 'react-router-dom'
import Game from './Game.tsx'
import Layout from './Layout.tsx'
import Start from './Start.tsx'
import Menu from './components/Menu.tsx'

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Start /> },
      {
        path: ':gameCode',
        element: <Game />,
        children: [
          {
            path: 'menu',
            element: <Menu />,
          },
          {
            path: 'cards/:cardId',
            element: <div>Card</div>,
          },
        ],
      },
    ],
  },
])

export function navigate(
  to: To | null,
  opts?: RouterNavigateOptions
): Promise<void> {
  return router.navigate(to, opts)
}
