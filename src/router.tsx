import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './components/layout/AppLayout'
import { AboutPage } from './pages/AboutPage'
import { GameDetailPage } from './pages/GameDetailPage'
import { GamesPage } from './pages/GamesPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { RouteErrorPage } from './pages/RouteErrorPage'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      errorElement: <RouteErrorPage />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'about',
          element: <AboutPage />,
        },
        {
          path: 'projects',
          element: <ProjectsPage />,
        },
        {
          path: 'projects/:slug',
          element: <ProjectDetailPage />,
        },
        {
          path: 'games',
          element: <GamesPage />,
        },
        {
          path: 'games/:slug',
          element: <GameDetailPage />,
        },
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)
