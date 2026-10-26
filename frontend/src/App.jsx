import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { StoreDataProvider } from './context/StoreDataContext'

// Layouts
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'

// Storefront Customer Pages (Guest Only)
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import WishlistPage from './pages/WishlistPage'
import TrackOrderPage from './pages/TrackOrderPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FaqPage from './pages/FaqPage'
import ReviewsPage from './pages/ReviewsPage'
import PolicyPage from './pages/PolicyPage'
import NotFoundPage from './pages/NotFoundPage'

// Admin Pages (Protected behind /admin)
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminInventoryPage from './pages/admin/AdminInventoryPage'
import AdminCouponsPage from './pages/admin/AdminCouponsPage'
import AdminReviewsPage from './pages/admin/AdminReviewsPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreDataProvider>
          <CartProvider>
            <WishlistProvider>
              <ScrollToTop />
              <Routes>
                {/* Admin Management Routes - Protected strictly at /admin */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="enquiries" element={<AdminEnquiriesPage />} />
                  <Route path="inventory" element={<AdminInventoryPage />} />
                  <Route path="coupons" element={<AdminCouponsPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  {/* Fallback for other admin links in sidebar */}
                  <Route path="customers" element={<AdminOrdersPage />} />
                  <Route path="banners" element={<AdminDashboardPage />} />
                  <Route path="shipping" element={<AdminSettingsPage />} />
                  <Route path="notifications" element={<AdminDashboardPage />} />
                </Route>

                {/* Customer Storefront Routes (Pure Guest Experience) */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />

                  {/* Order Tracking (Public Guest Lookup) */}
                  <Route path="/track-order" element={<TrackOrderPage />} />
                  <Route path="/account/orders/:orderId/track" element={<TrackOrderPage />} />
                  <Route path="/account/orders" element={<Navigate to="/track-order" replace />} />
                  <Route path="/account" element={<Navigate to="/track-order" replace />} />

                  {/* Informational & Devotional Pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/reviews" element={<ReviewsPage />} />

                  {/* Policies */}
                  <Route path="/shipping" element={<PolicyPage />} />
                  <Route path="/refund" element={<PolicyPage />} />
                  <Route path="/privacy" element={<PolicyPage />} />
                  <Route path="/terms" element={<PolicyPage />} />

                  {/* Customer Authentication Removed: Redirect to storefront */}
                  <Route path="/login" element={<Navigate to="/admin" replace />} />
                  <Route path="/register" element={<Navigate to="/" replace />} />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </StoreDataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
