import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SellerLayout from '../components/SellerLayout';
import SellerDashboard from '../pages/SellerDashboard';
import SellerProducts from '../pages/SellerProducts';
import AddProduct from '../pages/AddProduct';
import ProductBarcodes from '../pages/ProductBarcodes';
import OfflineSale from '../pages/OfflineSale';
import SellerLogin from '../pages/SellerLogin';
import SellerRegister from '../pages/SellerRegister';
import SellerOrders from '../pages/SellerOrders';
import SellerOrderDetail from '../pages/SellerOrderDetail';
import SellerReturns from '../pages/SellerReturns';
import SellerReturnDetail from '../pages/SellerReturnDetail';
import SellerCustomers from '../pages/SellerCustomers';
import SellerCustomerDetail from '../pages/SellerCustomerDetail';
import SellerProfile from '../pages/SellerProfile';
import { sellerService } from '../services/sellerService';
import { ShieldAlert } from 'lucide-react';

// Protected Route Component for Seller
const SellerProtectedRoute = ({ children }) => {
    const isAuth = localStorage.getItem('sellerAuth');
    const currentSeller = sellerService.getCurrentSeller();

    if (!isAuth) {
        return <Navigate to="/seller/login" replace />;
    }

    if (currentSeller && currentSeller.status !== 'APPROVED') {
        return (
            <div className="min-h-screen bg-[#FDF5F6] flex items-center justify-center p-6 font-sans">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 shadow-2xl text-center space-y-6 border border-white">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-100">
                        <ShieldAlert className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Pending Authorization</h2>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                        Your merchant profile is currently under review by our administrative team. Access will be granted upon successful verification of your credentials.
                    </p>
                    <button 
                        onClick={() => {
                            sellerService.logout();
                            window.location.href = '/seller/login';
                        }}
                        className="w-full bg-[#3E2723] text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#3E2723]/20 hover:bg-[#2D1B18] transition-all"
                    >
                        Return to Gateway
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

const SellerRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<SellerLogin />} />
            <Route path="/register" element={<SellerRegister />} />
            
            <Route path="/*" element={
                <SellerProtectedRoute>
                    <SellerLayout>
                        <Routes>
                            <Route path="/dashboard" element={<SellerDashboard />} />
                            <Route path="/products" element={<SellerProducts />} />
                            <Route path="/add-product" element={<AddProduct />} />
                            <Route path="/product-barcodes/:id" element={<ProductBarcodes />} />
                            <Route path="/offline-sale" element={<OfflineSale />} />
                            <Route path="/orders" element={<SellerOrders />} />
                            <Route path="/order-details/:id" element={<SellerOrderDetail />} />
                            <Route path="/returns" element={<SellerReturns />} />
                            <Route path="/return-details/:id" element={<SellerReturnDetail />} />
                            <Route path="/customers" element={<SellerCustomers />} />
                            <Route path="/customer-details/:id" element={<SellerCustomerDetail />} />
                            <Route path="/profile" element={<SellerProfile />} />
                            <Route path="/" element={<Navigate to="/seller/dashboard" replace />} />
                        </Routes>
                    </SellerLayout>
                </SellerProtectedRoute>
            } />
        </Routes>
    );
};

export default SellerRoutes;
