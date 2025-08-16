import React from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Register from './components/auth/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import Store from './pages/Store';
import StoreManagement from './pages/StoreManagement';
import MyRatings from './pages/MyRatings';

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element:
      <ProtectedRoute allowedRoles={["USER", "ADMIN", "STORE_OWNER"]}>
        < Home />
      </ProtectedRoute >
  },
  {
    path: "/my-ratings",
    element:
      <ProtectedRoute allowedRoles={["USER", "ADMIN", "STORE_OWNER"]}>
        < MyRatings />
      </ProtectedRoute >
  },
  {
    path: "/my-store",
    element:
      <ProtectedRoute allowedRoles={["ADMIN", "STORE_OWNER"]}>
        < Store />
      </ProtectedRoute >
  },
  {
    path: "/admin",
    element:
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        < AdminDashboard />
      </ProtectedRoute >
  },
  {
    path: "/admin/users",
    element:
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        < UserManagement />
      </ProtectedRoute >
  },
  {
    path: "/admin/stores",
    element:
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        < StoreManagement />
      </ProtectedRoute >
  },
])

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}

export default App