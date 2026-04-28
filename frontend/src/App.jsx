import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './modules/user/components/Navbar';
import Footer from './modules/user/components/Footer';
import ScrollToTop from './ScrollToTop';
import AppErrorBoundary from './components/AppErrorBoundary';
import CategoryNav from './modules/user/components/CategoryNav';
import AnnouncementBar from './modules/user/components/AnnouncementBar';
import PincodeModal from './modules/user/components/PincodeModal';
import WhatsAppFloating from './modules/user/components/WhatsAppFloating';
import SmoothScrollProvider from './components/SmoothScrollProvider';

// Lazy Loaded Pages
const Home = lazy(() => import('./modules/user/pages/Home'));
const Shop = lazy(() => import('./modules/user/pages/Shop'));
const Cart = lazy(() => import('./modules/user/pages/Cart'));
const ProductDetails = lazy(() => import('./modules/user/pages/ProductDetails'));
const Login = lazy(() => import('./modules/user/pages/Login'));
const Wishlist = lazy(() => import('./modules/user/pages/Wishlist'));
const Profile = lazy(() => import('./modules/user/pages/Profile'));
const ShopForMen = lazy(() => import('./modules/user/pages/ShopForMen'));
const ShopForWomen = lazy(() => import('./modules/user/pages/ShopForWomen'));
const ShopForFamily = lazy(() => import('./modules/user/pages/ShopForFamily'));
const FamilyRecipientProductsPage = lazy(() => import('./modules/user/pages/FamilyRecipientProductsPage'));
const FamilyCollectionProductsPage = lazy(() => import('./modules/user/pages/FamilyCollectionProductsPage'));
const AboutUs = lazy(() => import('./modules/user/pages/AboutUs'));
const Checkout = lazy(() => import('./modules/user/pages/Checkout'));
const OrderSuccess = lazy(() => import('./modules/user/pages/OrderSuccess'));
const OrderTracking = lazy(() => import('./modules/user/pages/OrderTracking'));
const HelpCenter = lazy(() => import('./modules/user/pages/HelpCenter'));
const Notifications = lazy(() => import('./modules/user/pages/Notifications'));
const BlogsPage = lazy(() => import('./modules/user/pages/BlogsPage'));
const BlogDetailPage = lazy(() => import('./modules/user/pages/BlogDetailPage'));
const DynamicPage = lazy(() => import('./modules/user/pages/DynamicPage'));
const GoldJewelleryPage = lazy(() => import('./modules/user/pages/GoldJewelleryPage'));
const UserReturnsPage = lazy(() => import('./modules/user/pages/ReturnsPage'));
const UserReturnDetailPage = lazy(() => import('./modules/user/pages/ReturnDetailPage'));
const UserReturnRequestPage = lazy(() => import('./modules/user/pages/ReturnRequestPage'));
const UserReplacementsPage = lazy(() => import('./modules/user/pages/ReplacementsPage'));
const UserReplacementDetailPage = lazy(() => import('./modules/user/pages/ReplacementDetailPage'));
const UserReplacementRequestPage = lazy(() => import('./modules/user/pages/ReplacementRequestPage'));
const JewelleryCollectionsPage = lazy(() => import('./modules/user/pages/JewelleryCollectionsPage'));
const BondCollectionPage = lazy(() => import('./modules/user/pages/BondCollectionPage'));
const BestStylesPage = lazy(() => import('./modules/user/pages/BestStylesPage'));
const AdminLogin = lazy(() => import('./modules/admin/pages/Login'));
const AdminLayout = lazy(() => import('./modules/admin/components/AdminLayout'));
const AdminProtectedRoute = lazy(() => import('./modules/admin/components/AdminProtectedRoute'));
const CategoryPage = lazy(() => import('./modules/admin/pages/categories/CategoryPage'));
const CategoryEditor = lazy(() => import('./modules/admin/pages/categories/CategoryEditor'));
const ProductManagement = lazy(() => import('./modules/admin/pages/ProductManagement'));
const AdminProductEditor = lazy(() => import('./modules/admin/pages/AdminProductEditor'));
const OrderListPage = lazy(() => import('./modules/admin/pages/OrderListPage'));
const OrderDetailPage = lazy(() => import('./modules/admin/pages/OrderDetailPage'));
const ReturnDetailPage = lazy(() => import('./modules/admin/pages/ReturnDetailPage'));
const ReturnsPage = lazy(() => import('./modules/admin/pages/ReturnsPage'));
const ReplacementsPage = lazy(() => import('./modules/admin/pages/ReplacementsPage'));
const ReplacementDetailPage = lazy(() => import('./modules/admin/pages/ReplacementDetailPage'));
const InventoryPage = lazy(() => import('./modules/admin/pages/InventoryPage'));
const StockAdjustmentPage = lazy(() => import('./modules/admin/pages/inventory/StockAdjustmentPage'));
const StockHistoryPage = lazy(() => import('./modules/admin/pages/inventory/StockHistoryPage'));
const LowStockAlertsPage = lazy(() => import('./modules/admin/pages/inventory/LowStockAlertsPage'));
const InventoryReportsPage = lazy(() => import('./modules/admin/pages/inventory/InventoryReportsPage'));
const UserManagement = lazy(() => import('./modules/admin/pages/UserManagement'));
const UserView = lazy(() => import('./modules/admin/pages/UserView'));
const ReviewModeration = lazy(() => import('./modules/admin/pages/ReviewModeration'));
const SupportManagement = lazy(() => import('./modules/admin/pages/SupportManagement'));
const ContactInquiries = lazy(() => import('./modules/admin/pages/ContactInquiries'));
const GlobalNotificationManager = lazy(() => import('./modules/admin/pages/GlobalNotificationManager'));
const AddNotification = lazy(() => import('./modules/admin/pages/AddNotification'));
const FAQManagement = lazy(() => import('./modules/admin/pages/FAQManagement'));
const ContentManagement = lazy(() => import('./modules/admin/pages/ContentManagement'));
const BlogManagement = lazy(() => import('./modules/admin/pages/BlogManagement'));
const CouponListPage = lazy(() => import('./modules/admin/pages/CouponListPage'));
const CouponFormPage = lazy(() => import('./modules/admin/pages/CouponFormPage'));
const GlobalSettings = lazy(() => import('./modules/admin/pages/GlobalSettings'));
const SectionManagement = lazy(() => import('./modules/admin/pages/SectionManagement'));
const SectionEditor = lazy(() => import('./modules/admin/pages/SectionEditor'));
const DynamicPageEditor = lazy(() => import('./modules/admin/pages/DynamicPageEditor'));
const PageManagement = lazy(() => import('./modules/admin/pages/PageManagement'));
const AdminSellersPage = lazy(() => import('./modules/admin/pages/AdminSellersPage'));
const AdminSellerDetails = lazy(() => import('./modules/admin/pages/AdminSellerDetails'));
const AdminNotifications = lazy(() => import('./modules/admin/pages/AdminNotifications'));
const QrScannerPage = lazy(() => import('./modules/seller/pages/QrScannerPage'));
const MetalPricing = lazy(() => import('./modules/admin/pages/MetalPricing'));
const TaxSettings = lazy(() => import('./modules/admin/pages/TaxSettings'));
const AdminDashboard = lazy(() => import('./modules/admin/pages/Dashboard'));
const SellerRoutes = lazy(() => import('./modules/seller/routes/sellerRoutes'));

import Loader from './modules/shared/components/Loader';

const LoadingFallback = () => <Loader fullPage={false} />;

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isSellerPath = location.pathname.startsWith('/seller');
  const isScannerPath = location.pathname === '/scanner';
  const showMetalToggle = location.pathname === '/' || location.pathname === '/gold-collection';

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#FDF5F6]">
      {!isAdminPath && !isSellerPath && !isScannerPath && (
        <>
          <div className="fixed top-0 left-0 right-0 z-[100] w-full">
            <AnnouncementBar />
            <Navbar />
            <CategoryNav showMetalToggle={showMetalToggle} />
            <PincodeModal />
          </div>
          <div className={`h-[104px] ${showMetalToggle ? 'md:h-[226px]' : 'md:h-[166px]'} w-full`}></div>
        </>
      )}
      <main className={`flex-grow ${!isAdminPath && !isSellerPath && !isScannerPath ? 'pb-16 md:pb-0' : ''}`}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/scanner" element={<QrScannerPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/order-tracking/:orderId/:view?" element={<OrderTracking />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile/:activeTab?/:subId?" element={<Profile />} />
          <Route path="/returns" element={<UserReturnsPage />} />
          <Route path="/return/:returnId" element={<UserReturnDetailPage />} />
          <Route path="/request-return/:orderId" element={<UserReturnRequestPage />} />
          <Route path="/replacements" element={<UserReplacementsPage />} />
          <Route path="/replacement/:replacementId" element={<UserReplacementDetailPage />} />
          <Route path="/request-replacement/:orderId" element={<UserReplacementRequestPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/about" element={<DynamicPage slug="about-us" />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/terms" element={<DynamicPage slug="terms-conditions" />} />
          <Route path="/privacy" element={<DynamicPage slug="privacy-policy" />} />
          <Route path="/shipping-policy" element={<DynamicPage slug="shipping-policy" />} />
          <Route path="/cancellation-policy" element={<DynamicPage slug="cancellation-policy" />} />
          <Route path="/return-policy" element={<DynamicPage slug="return-refund-policy" />} />
          <Route path="/care-guide" element={<DynamicPage slug="jewelry-care" />} />
          <Route path="/warranty-info" element={<DynamicPage slug="warranty-info" />} />
          <Route path="/craft" element={<DynamicPage slug="our-craftsmanship" />} />
          <Route path="/customization" element={<DynamicPage slug="customization" />} />
          <Route path="/page/:slug" element={<DynamicPage />} />
          <Route path="/new-arrivals" element={<Shop />} />
          <Route path="/trending" element={<Shop />} />
          <Route path="/category/men" element={<ShopForMen />} />
          <Route path="/category/women" element={<ShopForWomen />} />
          <Route path="/category/family" element={<ShopForFamily />} />
          <Route path="/category/family/:recipient" element={<FamilyRecipientProductsPage />} />
          <Route path="/category/family/collection/:collectionId" element={<FamilyCollectionProductsPage />} />
          <Route path="/category/:category" element={<Shop />} />
          <Route path="/gold-collection" element={<GoldJewelleryPage />} />
          <Route path="/collection/bond/:bondId" element={<BondCollectionPage />} />
          <Route path="/collection/best-styles" element={<BestStylesPage />} />
          <Route path="/collections" element={<JewelleryCollectionsPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:slug" element={<BlogDetailPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <AdminProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  {/* Legacy alias: older admin UI linked to /admin/dashboard */}
                  <Route path="/dashboard" element={<AdminDashboard />} />
                  <Route path="/categories" element={<CategoryPage />} />
                  <Route path="/categories/new" element={<CategoryEditor />} />
                  <Route path="/categories/edit/:id" element={<CategoryEditor />} />

                  <Route path="/products" element={<ProductManagement />} />
                  <Route path="/products/view/:id" element={<AdminProductEditor />} />
                  <Route path="/products/new" element={<AdminProductEditor />} />
                  <Route path="/products/edit/:id" element={<AdminProductEditor />} />
                  <Route path="/coupons" element={<CouponListPage />} />
                  <Route path="/coupons/add" element={<CouponFormPage />} />
                  <Route path="/coupons/edit/:id" element={<CouponFormPage />} />
                  <Route path="/orders" element={<OrderListPage />} />
                  <Route path="/orders/:id" element={<OrderDetailPage />} />
                  <Route path="/returns" element={<ReturnsPage />} />
                  <Route path="/returns/:id" element={<ReturnDetailPage />} />
                  <Route path="/replacements" element={<ReplacementsPage />} />
                  <Route path="/replacements/:id" element={<ReplacementDetailPage />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/inventory/adjust" element={<StockAdjustmentPage />} />
                  <Route path="/inventory/history" element={<StockHistoryPage />} />
                  <Route path="/inventory/alerts" element={<LowStockAlertsPage />} />
                  <Route path="/inventory/reports" element={<InventoryReportsPage />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/users/view/:id" element={<UserView />} />
                  <Route path="/reviews" element={<ReviewModeration />} />
                  <Route path="/support" element={<SupportManagement />} />
                  <Route path="/support/inquiries" element={<ContactInquiries />} />
                  <Route path="/notifications" element={<AdminNotifications />} />
                  <Route path="/broadcasts" element={<GlobalNotificationManager />} />
                  <Route path="/notifications/add" element={<AddNotification />} />
                  <Route path="/faq" element={<FAQManagement />} />
                  <Route path="/about-us" element={<DynamicPageEditor pageId="about-us" />} />
                  <Route path="/blogs" element={<BlogManagement />} />
                  <Route path="/sections" element={<SectionManagement />} />
                  <Route path="/sections/:id" element={<SectionEditor />} />
                  <Route path="/pages" element={<PageManagement />} />
                  <Route path="/pages/:pageId" element={<DynamicPageEditor />} />
                  <Route path="/seller-terms" element={<DynamicPageEditor pageId="seller-terms" />} />
                  <Route path="/sellers" element={<AdminSellersPage />} />
                  <Route path="/seller-details/:id" element={<AdminSellerDetails />} />
                  <Route path="/settings" element={<GlobalSettings />} />
                  <Route path="/metal-pricing" element={<MetalPricing />} />
                  <Route path="/tax-settings" element={<TaxSettings />} />
                </Routes>
              </AdminLayout>
            </AdminProtectedRoute>
          } />

          {/* Seller Routes */}
          <Route path="/seller/*" element={<SellerRoutes />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      </main>
      {!isAdminPath && !isSellerPath && !isScannerPath && (
        <>
          <Footer />
          <WhatsAppFloating />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <SmoothScrollProvider />
        <Router>
          <ScrollToTop />
          <AppErrorBoundary>
            <AppContent />
          </AppErrorBoundary>
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
