import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './modules/user/components/Navbar';
import Footer from './modules/user/components/Footer';
import ScrollToTop from './ScrollToTop';
import Home from './modules/user/pages/Home';
import Shop from './modules/user/pages/Shop';
import Cart from './modules/user/pages/Cart';
import ProductDetails from './modules/user/pages/ProductDetails';
import Login from './modules/user/pages/Login';
import Wishlist from './modules/user/pages/Wishlist';
import Profile from './modules/user/pages/Profile';
import ShopForMen from './modules/user/pages/ShopForMen';
import ShopForWomen from './modules/user/pages/ShopForWomen';
import ShopForFamily from './modules/user/pages/ShopForFamily';
import AdminDashboard from './modules/admin/pages/Dashboard';
import AboutUs from './modules/user/pages/AboutUs';
import CategoryNav from './modules/user/components/CategoryNav';
import Checkout from './modules/user/pages/Checkout';
import OrderSuccess from './modules/user/pages/OrderSuccess';
import OrderTracking from './modules/user/pages/OrderTracking';
import HelpCenter from './modules/user/pages/HelpCenter';
import TermsAndConditions from './modules/user/pages/TermsAndConditions';
import PrivacyPolicy from './modules/user/pages/PrivacyPolicy';
import Notifications from './modules/user/pages/Notifications';
import AnnouncementBar from './modules/user/components/AnnouncementBar';
import BlogsPage from './modules/user/pages/BlogsPage';
import BlogDetailPage from './modules/user/pages/BlogDetailPage';
import PincodeModal from './modules/user/components/PincodeModal';
import DynamicPage from './modules/user/pages/DynamicPage';
import GoldComingSoon from './modules/user/pages/GoldComingSoon';
import UserReturnsPage from './modules/user/pages/ReturnsPage';
import UserReturnDetailPage from './modules/user/pages/ReturnDetailPage';
import UserReturnRequestPage from './modules/user/pages/ReturnRequestPage';
import UserReplacementsPage from './modules/user/pages/ReplacementsPage';
import UserReplacementDetailPage from './modules/user/pages/ReplacementDetailPage';
import UserReplacementRequestPage from './modules/user/pages/ReplacementRequestPage';
import JewelleryCollectionsPage from './modules/user/pages/JewelleryCollectionsPage';

// Admin Imports
import AdminLogin from './modules/admin/pages/Login';
import AdminLayout from './modules/admin/components/AdminLayout';
import AdminProtectedRoute from './modules/admin/components/AdminProtectedRoute';
import CategoryPage from './modules/admin/pages/categories/CategoryPage';
import CategoryEditor from './modules/admin/pages/categories/CategoryEditor';

import ProductManagement from './modules/admin/pages/ProductManagement';
import ProductView from './modules/admin/pages/ProductView';
import ItemEditor from './modules/admin/pages/ItemEditor';
import AdminProductEditor from './modules/admin/pages/AdminProductEditor';
import OrderListPage from './modules/admin/pages/OrderListPage';
import OrderDetailPage from './modules/admin/pages/OrderDetailPage';
import ReturnDetailPage from './modules/admin/pages/ReturnDetailPage';
import ReturnsPage from './modules/admin/pages/ReturnsPage';
import ReplacementsPage from './modules/admin/pages/ReplacementsPage';
import ReplacementDetailPage from './modules/admin/pages/ReplacementDetailPage';
import InventoryPage from './modules/admin/pages/InventoryPage';
import StockAdjustmentPage from './modules/admin/pages/inventory/StockAdjustmentPage';
import StockHistoryPage from './modules/admin/pages/inventory/StockHistoryPage';
import LowStockAlertsPage from './modules/admin/pages/inventory/LowStockAlertsPage';
import InventoryReportsPage from './modules/admin/pages/inventory/InventoryReportsPage';
import UserManagement from './modules/admin/pages/UserManagement';
import UserView from './modules/admin/pages/UserView';
import ReviewModeration from './modules/admin/pages/ReviewModeration';
import SupportManagement from './modules/admin/pages/SupportManagement';
import ContactInquiries from './modules/admin/pages/ContactInquiries';
import BannerManagement from './modules/admin/pages/BannerManagement';
import GlobalNotificationManager from './modules/admin/pages/GlobalNotificationManager';
import AddNotification from './modules/admin/pages/AddNotification';
import FAQManagement from './modules/admin/pages/FAQManagement';
import ContentManagement from './modules/admin/pages/ContentManagement';
import BlogManagement from './modules/admin/pages/BlogManagement';
import CouponListPage from './modules/admin/pages/CouponListPage';
import CouponFormPage from './modules/admin/pages/CouponFormPage';
import GlobalSettings from './modules/admin/pages/GlobalSettings';
import SectionManagement from './modules/admin/pages/SectionManagement';
import SectionEditor from './modules/admin/pages/SectionEditor';
import DynamicPageEditor from './modules/admin/pages/DynamicPageEditor';
import PageManagement from './modules/admin/pages/PageManagement';
import AdminSellersPage from './modules/admin/pages/AdminSellersPage';
import AdminSellerDetails from './modules/admin/pages/AdminSellerDetails';
import AdminNotifications from './modules/admin/pages/AdminNotifications';
import QrScannerPage from './modules/seller/pages/QrScannerPage';
import MetalPricing from './modules/admin/pages/MetalPricing';
import TaxSettings from './modules/admin/pages/TaxSettings';

// Seller Imports
import SellerRoutes from './modules/seller/routes/sellerRoutes';

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isSellerPath = location.pathname.startsWith('/seller');
  const isScannerPath = location.pathname === '/scanner';

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#FDF5F6]">
      {!isAdminPath && !isSellerPath && !isScannerPath && (
        <>
          <div className="fixed top-0 left-0 right-0 z-[100] w-full">
            <AnnouncementBar />
            <Navbar />
            <PincodeModal />
          </div>
          <div className="h-[84px] md:h-[104px] w-full"></div>
        </>
      )}
      {!isAdminPath && !isSellerPath && !isScannerPath && <CategoryNav />}
      <main className={`flex-grow ${!isAdminPath && !isSellerPath && !isScannerPath ? 'pb-16 md:pb-0' : ''}`}>
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
          <Route path="/category/:category" element={<Shop />} />
          <Route path="/gold-collection" element={<GoldComingSoon />} />
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
                  <Route path="/banners" element={<BannerManagement />} />
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
      </main>
      {!isAdminPath && !isSellerPath && !isScannerPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
