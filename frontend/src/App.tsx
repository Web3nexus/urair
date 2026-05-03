import { Routes, Route } from 'react-router-dom'
import RootLayout from '@/layouts/RootLayout'

// Pages
import HomePage from '@/pages/HomePage'
import ShopPage from '@/pages/ShopPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CartPage from '@/pages/CartPage'
import DynamicPage from '@/pages/DynamicPage'
import FaqPage from '@/pages/FaqPage'
import AuthPages from '@/pages/AuthPages'
import UserDashboard from '@/pages/UserDashboard'
import AdminDashboard from '@/pages/AdminDashboard'
import CheckoutPage from '@/pages/CheckoutPage'
import CurationsPage from '@/pages/CurationsPage'
import CurationDetailPage from '@/pages/CurationDetailPage'
import StoryPage from '@/pages/StoryPage'

import { AdminRoute, ProtectedRoute } from './components/AuthRoutes'
import SessionTimeout from './components/SessionTimeout'

function App() {
  return (
    <SessionTimeout>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/:category" element={<ShopPage />} />
          <Route path="product/:slug" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="p/:slug" element={<DynamicPage />} />
          <Route path="faqs" element={<FaqPage />} />
          <Route path="curations" element={<CurationsPage />} />
          <Route path="curations/:slug" element={<CurationDetailPage />} />
          <Route path="story" element={<StoryPage />} />
          
          {/* Auth Routes */}
          <Route path="login" element={<AuthPages type="login" />} />
          <Route path="register" element={<AuthPages type="register" />} />
          
          {/* Customer Account Routes */}
          <Route 
            path="checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="account" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="account/orders" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="wishlist" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Admin Route - Secure Gate */}
        <Route path="/securegate/login" element={<AuthPages type="admin-login" />} />
        <Route 
          path="/securegate" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
      </Routes>
    </SessionTimeout>
  )
}

export default App
