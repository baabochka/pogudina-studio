import { RouterProvider } from 'react-router-dom'

import { AppErrorBoundary } from './components/layout/AppErrorBoundary'
import { ThemeProvider } from './context/ThemeContext'
import { router } from './router'

function App() {
  return (
    <ThemeProvider>
      <AppErrorBoundary>
        <RouterProvider router={router} />
      </AppErrorBoundary>
    </ThemeProvider>
  )
}

export default App
