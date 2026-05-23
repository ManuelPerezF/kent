import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom'

import Login from '@/modules/auth/views/login'

const router = createHashRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Navigate to="/" replace />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}


