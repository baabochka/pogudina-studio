import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './components/layout/AppLayout'
import { HomePage } from './pages/HomePage'
import { RouteErrorPage } from './pages/RouteErrorPage'

const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })),
)
const GameDetailPage = lazy(() =>
  import('./pages/GameDetailPage').then((module) => ({ default: module.GameDetailPage })),
)
const GamesPage = lazy(() =>
  import('./pages/GamesPage').then((module) => ({ default: module.GamesPage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)
const ProjectDetailPage = lazy(() =>
  import('./pages/ProjectDetailPage').then((module) => ({
    default: module.ProjectDetailPage,
  })),
)
const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((module) => ({ default: module.ProjectsPage })),
)

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<div className="min-h-[40vh]" aria-hidden="true" />}>{element}</Suspense>
}

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
          element: withSuspense(<AboutPage />),
        },
        {
          path: 'projects',
          element: withSuspense(<ProjectsPage />),
        },
        {
          path: 'projects/:slug',
          element: withSuspense(<ProjectDetailPage />),
        },
        {
          path: 'games',
          element: withSuspense(<GamesPage />),
        },
        {
          path: 'games/:slug',
          element: withSuspense(<GameDetailPage />),
        },
        {
          path: '*',
          element: withSuspense(<NotFoundPage />),
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)
