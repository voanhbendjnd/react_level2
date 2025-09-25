import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import './styles/global.scss'
import { AppProvider } from 'components/context/app.context'
import ProtectedRoute from '@/components/auth/private.page'
import HomePage from './pages/client/home'
import AboutPage from './pages/client/about'
import LoginPage from './pages/client/auth/login'
import RegisterPage from './pages/client/auth/register'
import Layout from './layout'
import { App, ConfigProvider } from 'antd'
import AdminPage from './pages/admin/admin'
import ManageUserPage from './pages/admin/manage.user'
import enVN from 'antd/locale/vi_VN'
import BookPageHome from './pages/client/book'
import BookPage from './components/admin/book/book.table'
import { OrderPage } from './pages/client/order'
import CheckoutPage from './pages/client/checkout'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "books/:id", element: <BookPageHome /> },

      {
        path: "about",
        element: <AboutPage />
      },
      {
        path: "order",
        element: <OrderPage />
      },
      {
        path: "checkout",
        element: <CheckoutPage />
      },
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element:
      <RegisterPage />
  }, {
    path: "admin",
    element:
      <AdminPage />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <div>Dashboard</div>
          </ProtectedRoute>
        )
      },
      {
        path: "book",
        element:
          <ProtectedRoute>
            <BookPage />
          </ProtectedRoute>
      },
      {
        path: "order",
        element: <ProtectedRoute>
          <div>Order page</div>
        </ProtectedRoute>
      },
      {
        path: "user",
        element: <ProtectedRoute>
          <ManageUserPage />
        </ProtectedRoute>
      },
    ]
  }


])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppProvider>
        {/* configprovider set ngon ngu */}
        <ConfigProvider locale={enVN}>
          <RouterProvider router={router} />

        </ConfigProvider>

      </AppProvider>
    </App>

  </StrictMode>

)
