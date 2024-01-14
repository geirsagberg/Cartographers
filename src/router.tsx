import { createGroup, createRouter } from '@swan-io/chicane'

export const Router = createRouter({
  Start: '/',
  ...createGroup('Game', '/:gameCode', {
    Area: '/*',
    Main: '/',
    Briefing: '/briefing',
    BriefingEdict: '/briefing/:edictId',
    Card: '/card',
    Edict: '/edict/:edictId',
    Menu: '/menu',
  }),
})
