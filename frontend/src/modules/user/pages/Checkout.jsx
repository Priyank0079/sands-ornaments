import React, { useState } from 'react';
import { useShop } from '../../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { Truck, CreditCard, Banknote, ShieldCheck, Lock, Plus, Check, MapPin, ChevronRight, LayoutDashboard, Gift, ArrowRight, X, Tag } from 'lucide-react';

const Checkout = () => {
    const { cart, placeOrder, user, login, addresses, addAddress, defaultAddressId, coupons } = useShop();
    const navigate = useNavigate();

    // Login State
    const [loginStep, setLoginStep] = useState(1); // 1: Phone, 2: OTP
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']); // 4 digit OTP

    // Checkout Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        flatNo: '',
        area: '',
        city: '',
        district: '',
        state: '',
        pincode: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [loading, setLoading] = useState(false);
    const [addressSelection, setAddressSelection] = useState(addresses.length > 0 ? 'saved' : 'new');
    const [saveNewAddress, setSaveNewAddress] = useState(false);

    const [showCouponModal, setShowCouponModal] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);

    // Calculate totals
    const subtotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    const shipping = subtotal > 499 ? 0 : 50;
    const total = subtotal + shipping - discount;

    // Get active coupons from context
    const availableCoupons = coupons ? coupons.filter(c => c.active) : [];

    const handleApplyCoupon = (coupon) => {
        if (subtotal < coupon.minOrder) {
            alert(`Minimum order value of ₹${coupon.minOrder} required`);
            return;
        }
        setAppliedCoupon(coupon);
        setDiscount(coupon.amount > subtotal ? subtotal : coupon.amount); // Discount can't exceed subtotal
        setShowCouponModal(false);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setDiscount(0);
        setCouponCode('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Login Handlers ---
    const handleSendOtp = (e) => {
        e.preventDefault();
        if (phoneNumber.length === 10) {
            setLoginStep(2);
        } else {
            alert("Please enter a valid 10-digit phone number");
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length === 4) {
            // Mock Login Success
            login({ names: 'Guest User', phone: phoneNumber });
            // Pre-fill phone in checkout form
            setFormData(prev => ({ ...prev, phone: phoneNumber }));
        } else {
            alert("Please enter the 4-digit OTP");
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;

        let newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    // --- Checkout Handler ---
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // If new address and "Save Address" is checked
        if ((addressSelection === 'new' || addresses.length === 0) && saveNewAddress) {
            addAddress({
                name: `${formData.firstName} ${formData.lastName}`,
                phone: formData.phone,
                flatNo: formData.flatNo,
                area: formData.area,
                city: formData.city,
                district: formData.district,
                state: formData.state,
                pincode: formData.pincode,
                type: 'Home'
            });
        }

        // Simulate API call
        if (paymentMethod === 'online') {
            setTimeout(() => {
                setLoading(false);
                placeOrder({ shippingAddress: formData, paymentMethod: 'razorpay', amount: total });
                navigate('/order-success');
            }, 3000);
            return;
        }

        setTimeout(() => {
            setLoading(false);
            placeOrder({ shippingAddress: formData, paymentMethod: 'cod', amount: total });
            navigate('/order-success');
        }, 2000);
    };

    // Pre-fill default address if it exists
    React.useEffect(() => {
        if (user && addresses.length > 0 && defaultAddressId) {
            const defaultAddr = addresses.find(a => a.id === defaultAddressId);
            if (defaultAddr) {
                setFormData({
                    firstName: defaultAddr.name.split(' ')[0] || '',
                    lastName: defaultAddr.name.split(' ').slice(1).join(' ') || '',
                    email: user.email || '',
                    phone: defaultAddr.phone,
                    flatNo: defaultAddr.flatNo || '',
                    area: defaultAddr.area || '',
                    city: defaultAddr.city,
                    district: defaultAddr.district || '',
                    state: defaultAddr.state || '',
                    pincode: defaultAddr.pincode
                });
                setAddressSelection('saved');
            }
        }
    }, [user, addresses, defaultAddressId]);

    React.useEffect(() => {
        if (cart.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    if (cart.length === 0) {
        return null; // Or redirect
    }

    // --- 1. Login View (If not logged in) ---
    if (!user) {
        return (
            <div className="container mx-auto px-4 py-12 md:py-24 flex justify-center items-center min-h-[70vh] bg-white animate-in fade-in duration-700">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                            <Lock className="w-6 h-6 text-black" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-black mb-2">
                            {loginStep === 1 ? 'Login to Checkout' : 'Verify Phone Number'}
                        </h2>
                        <p className="text-gray-500 text-sm font-serif">
                            {loginStep === 1
                                ? 'Please enter your phone number to proceed with your order'
                                : `Enter the 4-digit code sent to +91 ${phoneNumber}`
                            }
                        </p>
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-black/5 border border-gray-100">
                        {loginStep === 1 ? (
                            <form onSubmit={handleSendOtp} className="space-y-6">
                                <div className="flex border border-gray-200 rounded-xl overflow-hidden transition-all focus-within:ring-1 focus-within:ring-black focus-within:border-black bg-gray-50/50">
                                    <div className="bg-gray-50 px-5 flex items-center border-r border-gray-200">
                                        <span className="text-gray-500 font-bold text-sm">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        className="flex-1 py-4 px-4 text-base outline-none bg-transparent placeholder-gray-400 font-medium"
                                        placeholder="Enter Phone Number"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-[#D39A9F] transition-all shadow-lg shadow-black/10 active:scale-95 transform"
                                >
                                    Send OTP
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="flex justify-center gap-3">
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            value={data}
                                            onChange={(e) => handleOtpChange(e.target, index)}
                                            onFocus={(e) => e.target.select()}
                                            className="w-14 h-14 border border-gray-200 rounded-xl text-center text-xl font-bold focus:ring-black focus:border-black outline-none bg-gray-50/50 transition-all font-display"
                                        />
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-[#D39A9F] transition-all shadow-lg shadow-black/10 active:scale-95 transform"
                                >
                                    Verify & Proceed
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLoginStep(1)}
                                    className="text-xs text-gray-400 hover:text-black font-bold uppercase tracking-wider block mx-auto transition-colors"
                                >
                                    Change Phone Number
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- 2. Checkout View (If logged in) ---
    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl animate-in fade-in duration-700 bg-white min-h-screen">
            <h1 className="text-2xl md:text-4xl font-display font-bold text-black mb-8 md:mb-12 text-center uppercase tracking-widest">
                Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Address */}
                    <div className="bg-white p-0 md:p-6 rounded-2xl md:border md:border-gray-100 md:shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-black flex items-center gap-3 font-display uppercase tracking-wide">
                                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">1</span>
                                Shipping Details
                            </h2>
                        </div>

                        {/* Saved Addresses List */}
                        {addresses.length > 0 && (
                            <div className="mb-8 p-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Saved Addresses</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => {
                                                setFormData({
                                                    firstName: addr.name.split(' ')[0] || '',
                                                    lastName: addr.name.split(' ').slice(1).join(' ') || '',
                                                    email: user.email || '',
                                                    phone: addr.phone,
                                                    flatNo: addr.flatNo || '',
                                                    area: addr.area || '',
                                                    city: addr.city,
                                                    district: addr.district || '',
                                                    state: addr.state || '',
                                                    pincode: addr.pincode
                                                });
                                                setAddressSelection('saved');
                                            }}
                                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all relative ${formData.flatNo === addr.flatNo && formData.area === addr.area ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-black/30'}`}
                                        >
                                            <div className="flex justify-between mb-3">
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-gray-200 text-black rounded-sm">{addr.type}</span>
                                                    {defaultAddressId === addr.id && (
                                                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#D39A9F] text-white rounded-sm">Default</span>
                                                    )}
                                                </div>
                                                {(formData.flatNo === addr.flatNo && formData.area === addr.area) && <div className="bg-black text-white rounded-full p-0.5"><Check className="w-3 h-3" /></div>}
                                            </div>
                                            <p className="font-bold text-black text-sm mb-1">{addr.name}</p>
                                            <p className="text-xs text-gray-500 leading-relaxed font-serif">{addr.flatNo}, {addr.area}, {addr.city}</p>
                                            <p className="text-xs text-gray-500 font-serif">{addr.pincode}</p>
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => {
                                            setFormData({
                                                firstName: '',
                                                lastName: '',
                                                email: user.email || '',
                                                phone: '',
                                                flatNo: '',
                                                area: '',
                                                city: '',
                                                district: '',
                                                state: '',
                                                pincode: ''
                                            });
                                            setAddressSelection('new');
                                        }}
                                        className={`p-5 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50 min-h-[140px] ${addressSelection === 'new' ? 'border-black bg-gray-50' : 'border-gray-200 text-gray-400'}`}
                                    >
                                        <Plus className="w-6 h-6 mb-2 text-[#D39A9F]" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-black">New Address</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 bg-gray-50/50 p-4 md:p-6 rounded-2xl border border-gray-100">
                            <div className="md:col-span-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    {addressSelection === 'new' || addresses.length === 0 ? 'Delivery Address' : 'Selected Address Details'}
                                </p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">First Name</label>
                                <input
                                    required
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Last Name</label>
                                <input
                                    required
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Flat / House / Building</label>
                                <input
                                    required
                                    type="text"
                                    name="flatNo"
                                    value={formData.flatNo}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Area / Street / Sector</label>
                                <input
                                    required
                                    type="text"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">City</label>
                                <input
                                    required
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">District</label>
                                <input
                                    required
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">State</label>
                                <input
                                    required
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Pincode</label>
                                <input
                                    required
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white"
                                />
                            </div>
                            {(addressSelection === 'new' || addresses.length === 0) && (
                                <div className="md:col-span-2 flex items-center gap-3 pt-2">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            id="save-address"
                                            checked={saveNewAddress}
                                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-black checked:bg-black focus:outline-none"
                                        />
                                        <Check
                                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                                            size={12}
                                            strokeWidth={3}
                                        />
                                    </div>
                                    <label htmlFor="save-address" className="text-sm text-gray-600 cursor-pointer font-medium select-none">Save this address for future orders</label>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-0 md:p-6 rounded-2xl md:border md:border-gray-100 md:shadow-sm">
                        <h2 className="text-lg md:text-xl font-bold text-black mb-6 flex items-center gap-3 font-display uppercase tracking-wide">
                            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">2</span>
                            Payment Method
                        </h2>

                        <div className="space-y-4">
                            <label className={`flex items-center gap-4 border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}>
                                <div className="relative flex items-center">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-black checked:bg-black focus:outline-none"
                                    />
                                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                                </div>
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="bg-[#EBCDD0] p-2.5 rounded-full text-black">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm md:text-base text-black font-display uppercase tracking-wide">Prepaid (Cards / UPI)</p>
                                        <p className="text-xs text-gray-500 font-serif">Fast and secure online payment</p>
                                    </div>
                                </div>
                            </label>

                            <label className={`flex items-center gap-4 border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}>
                                <div className="relative flex items-center">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-black checked:bg-black focus:outline-none"
                                    />
                                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                                </div>
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="bg-[#D39A9F] p-2.5 rounded-full text-white">
                                        <Banknote size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm md:text-base text-black font-display uppercase tracking-wide">Cash on Delivery</p>
                                        <p className="text-xs text-gray-500 font-serif">Pay when you receive your order</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-[#FDFBF7] p-6 md:p-8 rounded-2xl border border-[#EBCDD0] sticky top-24 shadow-sm">
                        <h2 className="font-display font-bold text-xl text-black mb-6 uppercase tracking-widest border-b border-[#EBCDD0] pb-4">Order Summary</h2>

                        {/* Mini Cart in Summary */}
                        <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-5 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-black line-clamp-2 font-display uppercase tracking-wide text-[11px]">{item.name}</p>
                                        <p className="text-xs text-gray-500 mt-1 font-serif">Qty: {item.quantity || 1}</p>
                                        <p className="text-sm font-bold text-black mt-1">₹{(item.price * (item.quantity || 1)).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mb-6">
                            {!appliedCoupon ? (
                                <div
                                    onClick={() => setShowCouponModal(true)}
                                    className="bg-gray-50 border-2 border-dashed border-[#EBCDD0] p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:border-[#D39A9F] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Gift className="w-4 h-4 text-[#D39A9F]" />
                                        <span className="text-xs font-bold text-black uppercase tracking-wider">Apply Coupon</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                                </div>
                            ) : (
                                <div className="bg-[#EBCDD0]/20 border border-[#EBCDD0] p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#D39A9F] p-1.5 rounded text-white">
                                            <Tag className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-black uppercase tracking-wider">{appliedCoupon.code}</p>
                                            <p className="text-[10px] text-gray-500">₹{parseFloat(discount).toFixed(0)} saved</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={removeCoupon}
                                        className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wider"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 text-sm text-gray-600 mb-6 pt-4 border-t border-[#EBCDD0]">
                            <div className="flex justify-between items-center">
                                <span className="font-serif">Subtotal</span>
                                <span className="text-black font-bold font-sans">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-serif">Shipping</span>
                                <span className="font-sans font-bold">{shipping === 0 ? <span className="text-emerald-600">Free</span> : `₹${shipping}`}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between items-center text-[#D39A9F]">
                                    <span className="font-serif">Discount</span>
                                    <span className="font-bold font-sans">- ₹{parseFloat(discount).toFixed(0)}</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-[#EBCDD0] pt-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg text-black font-display uppercase tracking-wide">Total</span>
                                <span className="font-bold text-2xl text-black font-sans">₹{total.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 text-right font-medium uppercase tracking-wider">Inclusive of all taxes</p>
                        </div>

                        <div className="bg-white p-4 rounded-xl text-xs text-gray-500 mb-6 flex gap-3 border border-gray-100 shadow-sm">
                            <ShieldCheck className="w-5 h-5 text-[#D39A9F] flex-shrink-0" />
                            <p className="font-serif leading-relaxed">Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</p>
                        </div>

                        <button
                            form="checkout-form"
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#EBCDD0] text-black py-4 rounded-xl font-bold hover:bg-[#D39A9F] hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-lg uppercase tracking-widest text-sm ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    {paymentMethod === 'online' ? 'Redirecting...' : 'Processing...'}
                                </span>
                            ) : (
                                <span>{paymentMethod === 'online' ? 'Pay Now' : 'Place Order'}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {/* Coupon Modal */}
            {showCouponModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="font-bold text-lg font-display uppercase tracking-wide">Available Coupons</h3>
                            <button
                                onClick={() => setShowCouponModal(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Manual Input */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Coupon Code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-black font-medium uppercase placeholder:normal-case"
                                />
                                <button
                                    onClick={() => {
                                        // Mock manual check
                                        const mockForce = { code: couponCode, amount: 100, minOrder: 0 };
                                        handleApplyCoupon(mockForce);
                                    }}
                                    className="bg-black text-white px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#D39A9F] transition-colors"
                                >
                                    Apply
                                </button>
                            </div>

                            {/* List */}
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Best Offers For You</p>
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                    {availableCoupons.map((coupon, idx) => (
                                        <div
                                            key={idx}
                                            className="border border-gray-200 rounded-xl p-4 hover:border-[#D39A9F] transition-all group relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="bg-[#EBCDD0]/30 px-3 py-1 rounded border border-[#EBCDD0] text-[#D39A9F] font-bold text-xs uppercase tracking-wider">
                                                    {coupon.code}
                                                </div>
                                                <button
                                                    onClick={() => handleApplyCoupon(coupon)}
                                                    className="text-black font-bold text-xs uppercase tracking-wider hover:text-[#D39A9F] transition-colors"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                            <p className="text-sm font-bold text-black mb-0.5">Save ₹{typeof coupon.amount === 'number' ? coupon.amount.toFixed(0) : coupon.amount}</p>
                                            <p className="text-xs text-gray-500 font-serif">{coupon.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
