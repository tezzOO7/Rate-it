import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Profile from './pages/Profile'
import Trending from './pages/Trending'
import About from './pages/About'
import { createHashRouter, RouterProvider  } from 'react-router-dom'
import App from './App'

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
   {
    path: "/Trending",
    element: <Trending />,
  },
  {
    path: "/about",
    element: <About />,
  },
   {
    path: "/Profile/:id",
    element: <Profile   />,
  },
  {
  path: "*",
  element: <div>404 - Page Not Found</div>,
}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
<RouterProvider   router={router}/> 

  </StrictMode>,
)
