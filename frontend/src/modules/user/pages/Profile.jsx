import React, { useState, useEffect } from 'react';
import { useShop } from '../../../context/ShopContext';
import { User, Package, LogOut, ShoppingBag, ChevronRight, ArrowLeft, Edit2, Check, MapPin, Plus, Trash2, Heart, HelpCircle, CreditCard, Banknote, ShieldCheck, Bell, BellOff, FileText, Shield, AlertTriangle, Mail, Smartphone, X, RefreshCw } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const ReturnActionModal = ({ isOpen, onClose, type, order, onSuccess }) => {
    const { showNotification } = useShop();
    const [selectedItems, setSelectedItems] = useState([]);
    const [reason, setReason] = useState('');
    const [resolution, setResolution] = useState(type === 'return' ? 'refund' : 'exchange');
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    const handleToggleItem = (itemId) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedItems.length === 0) {
            alert("Please select at least one item to " + type);
            return;
        }

        // Simulate backend success
        const requestData = {
            type,
            items: order.items.filter(i => selectedItems.includes(i.id)),
            reason,
            resolution,
            date: new Date().toISOString(),
            status: 'requested'
        };

        showNotification(`${type === 'return' ? 'Return' : 'Exchange'} request initiated for ${selectedItems.length} items.`);
        onSuccess(requestData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            {/* Backdrop (Desktop Only) */}
            <div className="hidden md:block absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content - Mobile: Fullscreen Page, Desktop: Centered Card */}
            <div onClick={(e) => e.stopPropagation()} className="bg-white relative z-10 w-full h-full md:h-auto md:w-[600px] md:rounded-[2rem] shadow-none md:shadow-2xl flex flex-col animate-in slide-in-from-right md:zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-3 md:p-5 border-b border-gray-100 flex items-center gap-3 bg-white md:bg-white md:rounded-t-[2rem]">
                    {/* Mobile Back Button */}
                    <button onClick={onClose} className="md:hidden text-[#5D4037]">
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>

                    <div className="flex-1">
                        <h3 className="text-lg font-serif font-bold text-black capitalize">Request {type}</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">Order #{order.id.replace('ORD-', '')}</p>
                    </div>

                    {/* Desktop Close Button */}
                    <button onClick={onClose} className="hidden md:block p-2 hover:bg-[#EFEBE9] rounded-full transition-colors text-[#5D4037]">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4 md:space-y-5">
                    {/* Step 1: Select Items */}
                    <div>
                        <h4 className="text-xs font-bold text-[#3E2723] uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span className="w-4 h-4 bg-[#3E2723] text-white rounded-full flex items-center justify-center text-[9px]">1</span>
                            Select Items
                        </h4>
                        <div className="space-y-2">
                            {order.items.map((item) => (
                                <div key={item.id} onClick={() => handleToggleItem(item.id)} className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${selectedItems.includes(item.id) ? 'border-black bg-[#FDF5F6]' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedItems.includes(item.id) ? 'bg-black border-black' : 'border-gray-300'}`}>
                                        {selectedItems.includes(item.id) && <Check className="w-2.5 h-2.5 text-white" />}
                                    </div>
                                    <img src={item.image} alt="" className="w-10 h-10 rounded-md object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-black line-clamp-1">{item.name}</p>
                                        <p className="text-[10px] text-gray-500">₹{item.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Reason */}
                    <div>
                        <h4 className="text-xs font-bold text-[#3E2723] uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span className="w-4 h-4 bg-[#3E2723] text-white rounded-full flex items-center justify-center text-[9px]">2</span>
                            Reason
                        </h4>
                        <select
                            className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#3E2723] bg-white font-medium text-[#5D4037]"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        >
                            <option value="">Select a reason</option>
                            <option>Size doesn't fit</option>
                            <option>Product damaged</option>
                            <option>Incorrect item received</option>
                            <option>Quality not as expected</option>
                            <option>Changed my mind</option>
                        </select>
                    </div>

                    {/* Step 3: Resolution (Conditional) */}
                    {type === 'return' && (
                        <div>
                            <h4 className="text-xs font-bold text-[#3E2723] uppercase tracking-wider mb-2 flex items-center gap-2">
                                <span className="w-4 h-4 bg-[#3E2723] text-white rounded-full flex items-center justify-center text-[9px]">3</span>
                                Refund Method
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                <button type="button" onClick={() => setResolution('refund')} className={`p-3 rounded-lg border text-left text-xs font-bold transition-all ${resolution === 'refund' ? 'border-[#3E2723] bg-[#3E2723] text-white' : 'border-gray-200 text-[#5D4037]'}`}>
                                    Original Payment
                                    <div className="text-[9px] font-normal opacity-70 mt-0.5">5-7 Business Days</div>
                                </button>
                                <button type="button" onClick={() => setResolution('wallet')} className={`p-3 rounded-lg border text-left text-xs font-bold transition-all ${resolution === 'wallet' ? 'border-[#3E2723] bg-[#3E2723] text-white' : 'border-gray-200 text-[#5D4037]'}`}>
                                    Sands Wallet
                                    <div className="text-[9px] font-normal opacity-70 mt-0.5">Instant Refund</div>
                                </button>
                            </div>
                        </div>
                    )}

                    {type === 'exchange' && (
                        <div>
                            <h4 className="text-xs font-bold text-[#3E2723] uppercase tracking-wider mb-2 flex items-center gap-2">
                                <span className="w-4 h-4 bg-[#3E2723] text-white rounded-full flex items-center justify-center text-[9px]">3</span>
                                Exchange For
                            </h4>
                            <div className="space-y-2">
                                <div className="p-3 rounded-lg bg-[#FDF5F6] border border-[#EBCDD0] text-[10px] text-black leading-relaxed mb-2">
                                    We will arrange a pickup. Please specify what you want in exchange (e.g., Different Size).
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-[#5D4037] uppercase tracking-widest mb-1 block">New Size / Variant Required</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Size 7, Rose Gold Chain"
                                        className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#3E2723]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Comments */}
                    <div>
                        <label className="text-[10px] font-bold text-[#5D4037] uppercase tracking-widest mb-1.5 block">Additional Comments</label>
                        <textarea
                            rows="2"
                            className="w-full p-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#3E2723] resize-none"
                            placeholder="Tell us more about the issue..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 md:p-6 border-t border-gray-100 bg-white md:rounded-b-[2rem]">
                    <button
                        onClick={handleSubmit}
                        disabled={selectedItems.length === 0 || !reason}
                        className="w-full bg-[#3E2723] text-white py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-[#3E2723]/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5D4037] transition-all text-xs"
                    >
                        Confirm {type} Request
                    </button>
                    <button onClick={onClose} className="w-full text-[#8D6E63] font-bold text-[10px] uppercase tracking-widest mt-3">Cancel</button>
                </div>
            </div>
        </div>
    );
};

const OrderCard = ({ order, isExpanded, onToggle }) => {
    const [localShow, setLocalShow] = useState(false);
    const [isActionModalOpen, setActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState('return'); // 'return' or 'exchange'

    // Initialize from localStorage if available
    const [returnRequest, setReturnRequest] = useState(() => {
        const saved = localStorage.getItem(`return_request_${order.id}`);
        return saved ? JSON.parse(saved) : null;
    });

    const showDetails = isExpanded !== undefined ? isExpanded : localShow;
    const setShowDetails = onToggle || setLocalShow;

    const subtotal = order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const shipping = order.total - subtotal;
    const tax = order.total * 0.03;

    const openAction = (type) => {
        setActionType(type);
        setActionModalOpen(true);
    };

    const handleActionSuccess = (data) => {
        setReturnRequest(data);
        // Save to localStorage immediately
        localStorage.setItem(`return_request_${order.id}`, JSON.stringify(data));
    };

    // Simulate Status Progression (Demo Mode) & Persist updates
    useEffect(() => {
        if (returnRequest) {
            // Keep localStorage in sync
            localStorage.setItem(`return_request_${order.id}`, JSON.stringify(returnRequest));

            if (returnRequest.status !== 'completed') {
                const timer = setTimeout(() => {
                    setReturnRequest(prev => {
                        let nextStatus = prev.status;
                        if (prev.status === 'requested') nextStatus = 'pickup_scheduled';
                        else if (prev.status === 'pickup_scheduled') nextStatus = 'completed';

                        // Only update if changed prevents infinite loop
                        if (nextStatus !== prev.status) {
                            return { ...prev, status: nextStatus };
                        }
                        return prev;
                    });
                }, 5000);
                return () => clearTimeout(timer);
            }
        }
    }, [returnRequest, order.id]);

    const getStepStatus = (step) => {
        if (!returnRequest) return 'pending';
        const statusMap = { 'requested': 1, 'pickup_scheduled': 2, 'completed': 3 };
        const currentStep = statusMap[returnRequest.status] || 1;
        return currentStep >= step ? 'completed' : 'pending';
    };

    return (
        <div className="md:bg-white md:shadow-sm md:rounded-2xl md:border md:border-gray-100 overflow-hidden font-sans mb-6 md:mb-5">
            <ReturnActionModal isOpen={isActionModalOpen} onClose={() => setActionModalOpen(false)} type={actionType} order={order} onSuccess={handleActionSuccess} />
            {/* Mobile View */}
            <div className="md:hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
                <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Order ID</p>
                        <h4 className="text-sm font-bold text-black">#{order.id.replace('ORD-', '')}</h4>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
                        <p className="text-xs font-medium text-gray-600">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>

                {returnRequest ? (
                    <div className="bg-[#FDF5F6] p-4 rounded-xl border border-[#EBCDD0] flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 text-blue-600 p-2 rounded-full">
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-black capitalize">{returnRequest.type} In Progress</h4>
                                <p className="text-[10px] text-gray-500">{new Date(returnRequest.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <Link
                            to={`/order-tracking/${order.id}/return`}
                            className="bg-white border border-[#EFEBE9] text-[#3E2723] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm"
                        >
                            Track
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 py-1">
                            <div className="flex -space-x-3 overflow-hidden">
                                {order.items.slice(0, 3).map((item, idx) => (
                                    <img
                                        key={idx}
                                        src={item.image}
                                        alt=""
                                        className="w-10 h-10 rounded-lg border-2 border-white object-cover shadow-sm"
                                    />
                                ))}
                                {order.items.length > 3 && (
                                    <div className="w-10 h-10 rounded-lg border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 shadow-sm">
                                        +{order.items.length - 3}
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow">
                                <p className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-wider">Items</p>
                                <p className="text-xs font-medium text-gray-700">{order.items.length} {order.items.length === 1 ? 'Product' : 'Products'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-wider">Total</p>
                                <p className="text-sm font-bold text-[#3E2723]">₹{order.total.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                            <button className="flex-1 bg-[#FAFAFA] text-[#3E2723] py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-gray-100 active:scale-95 transition-transform" onClick={() => setShowDetails(!showDetails)}>
                                {showDetails ? 'Close' : 'Details'}
                            </button>
                            <button onClick={() => openAction('return')} className="flex-1 bg-[#FAFAFA] text-[#3E2723] py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-gray-100 active:scale-95 transition-transform">
                                Return
                            </button>
                            <button onClick={() => openAction('exchange')} className="flex-1 bg-[#FAFAFA] text-[#3E2723] py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-gray-100 active:scale-95 transition-transform">
                                Exchange
                            </button>
                            <Link to={`/order-tracking/${order.id}`} className="flex-1 bg-black text-white py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-center shadow-md shadow-black/5 active:scale-95 transition-transform hover:bg-[#D39A9F]">
                                Track
                            </Link>
                        </div>
                    </>
                )}

                {/* Mobile Details View (Only if not tracking return, or simplified) */}
                {showDetails && !returnRequest && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-3 bg-[#FDF5F6] p-3 rounded-xl border border-[#EBCDD0]">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <img src={item.image} className="w-12 h-12 rounded-lg object-cover border border-white shadow-sm" alt="" />
                                    <div className="flex-grow min-w-0">
                                        <p className="text-[10px] font-bold text-[#3E2723] truncate">{item.name}</p>
                                        <p className="text-[10px] text-[#8D6E63]">Qty: {item.quantity} • ₹{item.price.toLocaleString()}</p>
                                    </div>
                                    <p className="text-xs font-bold text-[#3E2723]">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                            <div className="border-t border-[#EFEBE9] pt-2 mt-1 space-y-1">
                                <div className="flex justify-between text-[10px] text-[#8D6E63]"><p>Subtotal</p><p>₹{subtotal.toLocaleString()}</p></div>
                                <div className="flex justify-between text-[10px] text-[#8D6E63]"><p>Shipping</p><p>₹{shipping.toLocaleString()}</p></div>
                                <div className="flex justify-between text-[10px] font-bold text-[#3E2723] pt-1"><p>Grand Total</p><p>₹{order.total.toLocaleString()}</p></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 md:p-4 md:px-6 bg-[#FAFAFA] text-[10px] md:text-sm">
                    <div className="flex flex-wrap gap-4 md:gap-8 text-[#3E2723]">
                        <div>
                            <span className="font-bold block text-gray-900">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 mr-1">Order no.:</span>
                            <span className="font-bold text-gray-900">#{order.id.replace('ORD-', '')}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 mr-1">Items:</span>
                            <span className="font-bold text-gray-900">{order.items.length}</span>
                        </div>
                    </div>
                    <div
                        className="flex items-center gap-1.5 cursor-pointer text-[#3E2723] hover:underline font-bold"
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        <span>{showDetails ? 'Hide' : 'Details'}</span>
                        <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${showDetails ? 'rotate-90' : ''}`} />
                    </div>
                </div>

                {/* Return Tracker OR Action Buttons */}
                {returnRequest ? (
                    <div className="p-4 md:p-6 bg-white border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-3 rounded-full border border-blue-100">
                                <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-[#3E2723] capitalize">{returnRequest.type} In Progress</h4>
                                <p className="text-xs text-[#8D6E63]">Requested on {new Date(returnRequest.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <Link
                            to={`/order-tracking/${order.id}/return`}
                            className="bg-white border border-[#EFEBE9] text-[#3E2723] px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[#FAFAFA] transition-colors"
                        >
                            Track Status
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-end gap-3 p-3 md:p-4 bg-white">
                        <button onClick={() => openAction('return')} className="px-4 md:px-6 py-2 text-[10px] md:text-sm font-bold text-[#8D6E63] border border-[#EFEBE9] rounded-lg uppercase tracking-wider hover:bg-[#FDFBF7] hover:border-[#D7CCC8] transition-colors">
                            Return
                        </button>
                        <button onClick={() => openAction('exchange')} className="px-4 md:px-6 py-2 text-[10px] md:text-sm font-bold text-[#8D6E63] border border-[#EFEBE9] rounded-lg uppercase tracking-wider hover:bg-[#FDFBF7] hover:border-[#D7CCC8] transition-colors">
                            Exchange
                        </button>
                        <Link to={`/order-tracking/${order.id}`} className="bg-[#3E2723] text-white px-6 md:px-8 py-2 text-[10px] md:text-sm font-bold rounded-lg uppercase tracking-wider hover:bg-[#5D4037] transition-all shadow-sm flex items-center justify-center">
                            Track Order
                        </Link>
                    </div>
                )}



                {/* Collapsible Section */}
                {showDetails && (
                    <div className="bg-[#FAFAFA] border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Products Reel */}
                        <div className="flex gap-4 md:gap-8 overflow-x-auto p-4 md:p-6 scrollbar-hide">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex-shrink-0 w-32 md:w-48 text-center group">
                                    <div className="relative mb-2 inline-block">
                                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-lg overflow-hidden border border-gray-200 bg-white">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <span className="absolute -top-1.5 -right-1.5 bg-[#3E2723] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <h4 className="text-[10px] md:text-xs text-[#3E2723] font-medium leading-relaxed line-clamp-2 px-1 h-7 font-serif">{item.name}</h4>
                                    <p className="text-xs md:text-sm font-bold text-[#5D4037] mt-1">₹{item.price.toLocaleString()}.00</p>
                                </div>
                            ))}
                        </div>

                        {/* Total Breakdown Table */}
                        <div className="border-t border-gray-200 mx-6">
                            <div className="py-4 space-y-3 text-sm">
                                <div className="flex justify-between text-[#8D6E63]">
                                    <span>Sub total</span>
                                    <span>₹{subtotal.toLocaleString()}.00</span>
                                </div>
                                <div className="flex justify-between text-[#8D6E63]">
                                    <span>Shipping cost</span>
                                    <span>₹{shipping.toLocaleString()}.00</span>
                                </div>
                                <div className="flex justify-between text-[#8D6E63]">
                                    <span>IGST 3.0%</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grand Total Bar */}
                <div className="bg-[#F3F4F6] border-t border-gray-200 text-black p-3.5 md:p-4 md:px-6 flex justify-between items-center text-base md:text-lg font-bold">
                    <span>Grand total</span>
                    <span>₹{order.total.toLocaleString()}.00</span>
                </div>
            </div>
        </div>
    );
};

const Profile = () => {
    const { user, login, logout, orders, wishlist, addresses, addAddress, removeAddress, setDefaultAddress, defaultAddressId, deleteAccount, notificationsEnabled, toggleNotificationSettings } = useShop();
    const { activeTab: tabParam, subId } = useParams();
    const activeTab = tabParam || 'profile';
    const navigate = useNavigate();

    // State Synced with params
    const isEditing = subId === 'edit';
    const showAddressForm = subId === 'add';

    const [newAddress, setNewAddress] = useState({
        name: '', phone: '', flatNo: '', area: '', city: '', district: '', state: '', pincode: '', type: 'Home', isDefault: false
    });

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: ''
    });


    const [showDeleteModal, setShowDeleteModal] = useState(false);

    React.useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.name ? user.name.split(' ')[0] : '',
                lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-32 text-center">
                <h2 className="text-2xl font-serif text-[#3E2723] mb-4">Please Login to View Profile</h2>
                <Link to="/login" className="inline-block bg-[#3E2723] text-white px-8 py-3 rounded-full hover:bg-[#5D4037] transition-colors">Login Now</Link>
            </div>
        );
    }

    const handleLogout = () => { logout(); navigate('/'); };

    const handleSave = () => {
        const updatedUser = { ...user, name: `${formData.firstName} ${formData.lastName}`.trim(), email: formData.email, phone: formData.phone };
        login(updatedUser);
        navigate('/profile/profile');
    };

    const handleAddAddress = (e) => {
        e.preventDefault();
        addAddress(newAddress);
        navigate('/profile/addresses');
        setNewAddress({ name: '', phone: '', flatNo: '', area: '', city: '', district: '', state: '', pincode: '', type: 'Home', isDefault: false });
    };

    return (
        <div className="bg-white min-h-screen w-full">
            <div className="container mx-auto px-4 py-3 md:py-8 min-h-[60vh]">
                {/* General Back Button */}
                <div className="mb-4 md:mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[#D39A9F] hover:text-black transition-all group font-bold uppercase tracking-widest text-[10px]"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                </div>

                <h1 className={`${tabParam ? 'hidden md:block' : 'block'} text-xl md:text-3xl font-serif font-bold text-[#3E2723] mb-4 md:mb-8 text-center md:text-left`}>My Account</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                    {/* Sidebar - Hidden on mobile if a tab is active */}
                    <div className={`${tabParam ? 'hidden md:block' : 'block'} md:bg-white md:p-6 md:rounded-2xl md:shadow-sm h-fit border border-[#EBCDD0]`}>
                        <div className="flex flex-col md:flex-row items-center md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-4 md:mb-8 md:bg-transparent md:p-0 p-3 text-center md:text-left">
                            <div className="relative group">
                                <div className="bg-white p-4 md:p-4 rounded-full flex-shrink-0 shadow-sm border border-[#EBCDD0]">
                                    <User className="w-10 h-10 md:w-8 md:h-8 text-[#D39A9F]" />
                                </div>
                                <button
                                    onClick={() => navigate('/profile/profile/edit')}
                                    className="absolute -top-1 -right-1 bg-[#3E2723] text-white p-1.5 rounded-full shadow-lg border-2 border-white md:hidden"
                                >
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                {/* Desktop Photo Edit Overlay */}
                                <button
                                    onClick={() => navigate('/profile/profile/edit')}
                                    className="hidden md:flex absolute inset-0 bg-black/20 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-[#3E2723] text-base md:text-lg">{user.name}</h3>
                                <p className="text-xs md:text-sm text-[#8D6E63]">{user.phone || user.email}</p>
                            </div>
                        </div>

                        <nav className="space-y-1 md:space-y-2 md:bg-transparent md:p-0 p-1 rounded-2xl md:rounded-none md:shadow-none md:border-transparent">
                            <button onClick={() => navigate('/profile/profile')} className={`w-full flex items-center space-x-3 px-3 md:px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-[#F3F4F6]'}`}>
                                <User className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="font-medium text-sm md:text-base">Profile Details</span>
                            </button>
                            <button onClick={() => navigate('/profile/orders')} className={`w-full flex items-center space-x-3 px-3 md:px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-[#F3F4F6]'}`}>
                                <Package className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="font-medium text-sm md:text-base">My Orders</span>
                                {orders.length > 0 && <span className={`ml-auto text-xs py-0.5 px-2 rounded-full ${activeTab === 'orders' ? 'bg-white/20' : 'bg-[#F3F4F6]'}`}>{orders.length}</span>}
                            </button>
                            <button onClick={() => navigate('/profile/addresses')} className={`w-full flex items-center space-x-3 px-3 md:px-4 py-3 rounded-xl transition-all ${activeTab === 'addresses' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-[#F3F4F6]'}`}>
                                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="font-medium text-sm md:text-base">My Addresses</span>
                                {addresses.length > 0 && <span className={`ml-auto text-xs py-0.5 px-2 rounded-full ${activeTab === 'addresses' ? 'bg-white/20' : 'bg-[#F3F4F6]'}`}>{addresses.length}</span>}
                            </button>
                            <button onClick={() => navigate('/wishlist')} className="w-full flex items-center space-x-3 px-3 md:px-4 py-3 text-gray-600 hover:bg-[#F3F4F6] rounded-xl transition-all">
                                <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                                <span className="font-medium text-sm md:text-base">My Wishlist</span>
                                {wishlist.length > 0 && <span className="ml-auto text-xs py-0.5 px-2 rounded-full bg-[#F3F4F6]">{wishlist.length}</span>}
                            </button>
                            <button onClick={() => navigate('/profile/payments')} className={`w-full flex items-center space-x-3 px-3 md:px-4 py-3 rounded-xl transition-all ${activeTab === 'payments' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-[#F3F4F6]'}`}>
                                <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="font-medium text-sm md:text-base">Payments</span>
                            </button>
                            <button onClick={() => navigate('/help')} className="w-full flex items-center space-x-3 px-3 md:px-4 py-3 text-gray-600 hover:bg-[#F3F4F6] rounded-xl transition-all">
                                <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                                <span className="font-medium text-sm md:text-base">Help Center</span>
                            </button>
                            <button onClick={() => navigate('/return-policy')} className="w-full flex items-center space-x-3 px-3 md:px-4 py-3 text-gray-600 hover:bg-[#EFEBE9] rounded-xl transition-all">
                                <FileText className="w-4 h-4 md:w-5 md:h-5 text-[#8D6E63]" />
                                <span className="font-medium text-sm md:text-base">Return Policy</span>
                            </button>
                            <button onClick={() => navigate('/replacement-policy')} className="w-full flex items-center space-x-3 px-3 md:px-4 py-3 text-gray-600 hover:bg-[#EFEBE9] rounded-xl transition-all">
                                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-[#8D6E63]" />
                                <span className="font-medium text-sm md:text-base">Replacement Policy</span>
                            </button>

                            <hr className="my-4 border-[#EFEBE9]" />

                            <div className="px-4 py-2 text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest">Preferences</div>
                            <div className="px-4 py-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3 text-gray-600">
                                        {notificationsEnabled ? <Bell className="w-4 h-4 md:w-5 md:h-5 text-amber-500" /> : <BellOff className="w-4 h-4 md:w-5 md:h-5" />}
                                        <span className="font-medium text-sm">Notifications</span>
                                    </div>
                                    <button onClick={toggleNotificationSettings} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${notificationsEnabled ? 'bg-black' : 'bg-gray-200'}`}>
                                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-[#8D6E63] leading-relaxed italic pr-2">
                                    Don't miss any opportunity to grab your favorite ornaments as soon as they drop!
                                </p>
                            </div>

                            <div className="px-4 py-2 text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest">Legal</div>
                            <button onClick={() => navigate('/terms')} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-[#EFEBE9] rounded-xl transition-all">
                                <FileText className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="font-medium text-sm">Terms & Conditions</span>
                            </button>
                            <button onClick={() => navigate('/privacy')} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-[#EFEBE9] rounded-xl transition-all">
                                <Shield className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="font-medium text-sm">Privacy Policy</span>
                            </button>

                            <hr className="my-4 border-[#EFEBE9]" />
                            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                            <button onClick={() => setShowDeleteModal(true)} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-2">
                                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="font-medium text-sm">Delete Account</span>
                            </button>
                        </nav>
                    </div>

                    {/* Content Area - Hidden on mobile if NO tab is active */}
                    <div className={`${!tabParam ? 'hidden md:block' : 'block'} md:col-span-2`}>
                        {activeTab === 'profile' ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="md:bg-white p-0 md:p-8 md:rounded-2xl md:shadow-sm relative border border-[#EBCDD0]">
                                    <div className="flex justify-center md:justify-between items-center mb-4 md:mb-6">
                                        <h2 className="text-xl md:text-2xl font-display font-bold text-black text-center md:text-left tracking-wide">Personal Information</h2>
                                        <button
                                            onClick={() => isEditing ? handleSave() : navigate('/profile/profile/edit')}
                                            className={`hidden md:flex p-2 rounded-full transition-all duration-300 ${isEditing ? 'bg-black text-white' : 'bg-[#F3F4F6] text-[#D39A9F]'} ml-2 flex-shrink-0`}
                                        >
                                            {isEditing ? <Check className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {isEditing ? (
                                        <div className="space-y-6">
                                            {/* Mobile Edit Profile Header */}


                                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <div>
                                                    <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2 text-left">First Name</label>
                                                    <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full bg-white border border-gray-100 rounded-xl md:rounded-lg px-4 py-3 md:py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black transition-all outline-none" placeholder="First Name" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2 text-left">Last Name</label>
                                                    <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full bg-white border border-gray-100 rounded-xl md:rounded-lg px-4 py-3 md:py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black transition-all outline-none" placeholder="Last Name" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2 text-left">Email</label>
                                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white border border-gray-100 rounded-xl md:rounded-lg px-4 py-3 md:py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black transition-all outline-none" placeholder="Email Address" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2 text-left">Phone Number</label>
                                                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-white border border-gray-100 rounded-xl md:rounded-lg px-4 py-3 md:py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black transition-all outline-none" placeholder="Phone Number" />
                                                </div>
                                            </form>

                                            {/* Mobile Save Button */}
                                            <button
                                                onClick={handleSave}
                                                className="md:hidden w-full bg-[#3E2723] text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs shadow-lg shadow-black/10 active:scale-95 transition-all mt-4"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-8 md:space-y-6">
                                            {/* Mobile Profile Header */}
                                            <div className="md:hidden flex flex-col items-center pt-2">
                                                <div className="bg-white p-5 rounded-full shadow-sm border border-[#D7CCC8] mb-3">
                                                    <User className="w-12 h-12 text-[#5D4037]" />
                                                </div>
                                                <h3 className="text-xl font-bold text-[#3E2723]">{user.name}</h3>
                                            </div>

                                            {/* Mobile Clean List Style */}
                                            <div className="md:hidden space-y-4 px-2">
                                                <div className="border-b border-gray-100 pb-3">
                                                    <p className="text-[9px] font-bold text-[#8D6E63] uppercase tracking-[0.2em] mb-1">First Name</p>
                                                    <p className="text-base font-medium text-[#3E2723]">{user.name ? user.name.split(' ')[0] : ''}</p>
                                                </div>
                                                <div className="border-b border-gray-100 pb-3">
                                                    <p className="text-[9px] font-bold text-[#8D6E63] uppercase tracking-[0.2em] mb-1">Last Name</p>
                                                    <p className="text-base font-medium text-[#3E2723]">{user.name ? user.name.split(' ').slice(1).join(' ') : ''}</p>
                                                </div>
                                                <div className="border-b border-gray-100 pb-3">
                                                    <p className="text-[9px] font-bold text-[#8D6E63] uppercase tracking-[0.2em] mb-1">Email Address</p>
                                                    <p className="text-base font-medium text-[#3E2723]">{user.email || 'Not provided'}</p>
                                                </div>
                                                <div className="border-b border-gray-100 pb-3">
                                                    <p className="text-[9px] font-bold text-[#8D6E63] uppercase tracking-[0.2em] mb-1">Phone Number</p>
                                                    <p className="text-base font-medium text-[#3E2723]">+91 {user.phone}</p>
                                                </div>
                                            </div>

                                            {/* Desktop Grid View */}
                                            <div className="hidden md:grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">First Name</label>
                                                    <div className="w-full bg-white border border-gray-100 rounded-lg px-4 py-2.5 text-sm font-medium text-black">{user.name ? user.name.split(' ')[0] : ''}</div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Last Name</label>
                                                    <div className="w-full bg-white border border-gray-100 rounded-lg px-4 py-2.5 text-sm font-medium text-black">{user.name ? user.name.split(' ').slice(1).join(' ') : ''}</div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                                                    <div className="w-full bg-white border border-gray-100 rounded-lg px-4 py-2.5 text-sm font-medium text-black">{user.email || 'Not provided'}</div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone</label>
                                                    <div className="w-full bg-white border border-gray-100 rounded-lg px-4 py-2.5 text-sm font-medium text-black">+91 {user.phone}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : activeTab === 'orders' ? (
                            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex justify-center md:justify-between items-center mb-4 md:mb-6">
                                    <h2 className="text-xl md:text-2xl font-display font-bold text-black text-center md:text-left tracking-wide">My Orders</h2>
                                </div>
                                {orders.length === 0 ? (
                                    <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
                                        <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-500 mb-6">No orders yet.</p>
                                        <Link to="/shop" className="bg-black text-white px-8 py-3 rounded-full hover:bg-[#D39A9F]">Start Shopping</Link>
                                    </div>
                                ) : orders.map(order => <OrderCard key={order.id} order={order} isExpanded={subId === order.id} onToggle={() => navigate(subId === order.id ? '/profile/orders' : `/profile/orders/${order.id}`)} />)}
                            </div>
                        ) : activeTab === 'payments' ? (
                            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex justify-center md:justify-between items-center mb-4 md:mb-6">
                                    <h2 className="text-xl md:text-2xl font-display font-bold text-black text-center md:text-left tracking-wide">Payment Methods</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="md:bg-white p-4 md:p-6 md:rounded-2xl md:border border-[#EBCDD0]">
                                        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4"><div className="bg-blue-50 p-2 rounded-lg text-blue-600"><CreditCard className="w-4 h-4 md:w-5 md:h-5" /></div><h3 className="font-bold text-sm md:text-base text-black">Razorpay Secure</h3></div>
                                        <p className="text-[10px] md:text-xs text-gray-500 mb-3 md:mb-4">Cards, UPI, NetBanking. 100% Secure.</p>
                                        <div className="flex gap-2 opacity-50"><CreditCard className="w-4 h-4" /><ShieldCheck className="w-4 h-4" /></div>
                                    </div>
                                    <div className="md:bg-white p-4 md:p-6 md:rounded-2xl md:border border-[#EBCDD0]">
                                        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4"><div className="bg-green-50 p-2 rounded-lg text-green-600"><Banknote className="w-4 h-4 md:w-5 md:h-5" /></div><h3 className="font-bold text-sm md:text-base text-black">Cash on Delivery</h3></div>
                                        <p className="text-[10px] md:text-xs text-gray-500 mb-3 md:mb-4">Pay in cash on delivery.</p>
                                        <div className="flex gap-2 opacity-50"><ShieldCheck className="w-4 h-4" /></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex justify-between items-center mb-4 md:mb-6">
                                    <h2 className="text-xl md:text-2xl font-display font-bold text-black tracking-wide">My Addresses</h2>
                                    <button onClick={() => showAddressForm ? navigate('/profile/addresses') : navigate('/profile/addresses/add')} className="bg-black text-white px-4 py-2 rounded-lg text-sm hidden md:block hover:bg-[#D39A9F]">
                                        {showAddressForm ? 'Cancel' : 'Add New'}
                                    </button>
                                    <button onClick={() => showAddressForm ? navigate('/profile/addresses') : navigate('/profile/addresses/add')} className="md:hidden bg-black text-white p-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Plus className="w-4 h-4" /> Add
                                    </button>
                                </div>

                                {/* Mobile Add Address Form - Full Screen Overlay Style */}
                                {showAddressForm && (
                                    <div className="md:hidden fixed inset-0 z-50 bg-[#FDFBF7] flex flex-col">
                                        <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
                                            <button onClick={() => navigate('/profile/addresses')} className="text-[#3E2723]"><ArrowLeft className="w-5 h-5" /></button>
                                            <h2 className="text-lg font-display font-bold text-[#3E2723]">Add New Address</h2>
                                        </div>
                                        <form onSubmit={handleAddAddress} className="flex-1 overflow-y-auto p-4 space-y-3">
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mb-1 block">Full Name</label>
                                                    <input value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#EFEBE9] p-2.5 rounded-lg text-sm font-medium text-[#3E2723] placeholder:text-gray-300 focus:outline-none focus:border-[#3E2723] transition-colors" placeholder="e.g. Aditi Sharma" required />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mb-1 block">Phone Number</label>
                                                    <input value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#EFEBE9] p-2.5 rounded-lg text-sm font-medium text-[#3E2723] placeholder:text-gray-300 focus:outline-none focus:border-[#3E2723] transition-colors" placeholder="e.g. 9876543210" required />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mb-1 block">Flat, House no., Building, Company, Apartment</label>
                                                    <input value={newAddress.flatNo} onChange={e => setNewAddress({ ...newAddress, flatNo: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#EFEBE9] p-2.5 rounded-lg text-sm font-medium text-[#3E2723] placeholder:text-gray-300 focus:outline-none focus:border-[#3E2723] transition-colors" placeholder="e.g. Flat 4B, Rose Apartments" required />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mb-1 block">Area, Street, Sector, Village</label>
                                                    <input value={newAddress.area} onChange={e => setNewAddress({ ...newAddress, area: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#EFEBE9] p-2.5 rounded-lg text-sm font-medium text-[#3E2723] placeholder:text-gray-300 focus:outline-none focus:border-[#3E2723] transition-colors" placeholder="e.g. Lokhandwala Complex" required />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mb-1 block">City</label>
                                                        <input value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#EFEBE9] p-2.5 rounded-lg text-sm font-medium text-[#3E2723] placeholder:text-gray-300 focus:outline-none focus:border-[#3E2723] transition-colors" placeholder="Mumbai" required />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mb-1 block">State</label>
                                                        <input value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#EFEBE9] p-2.5 rounded-lg text-sm font-medium text-[#3E2723] placeholder:text-gray-300 focus:outline-none focus:border-[#3E2723] transition-colors" placeholder="Maharashtra" required />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mb-1 block">Pincode</label>
                                                    <input value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#EFEBE9] p-2.5 rounded-lg text-sm font-medium text-[#3E2723] placeholder:text-gray-300 focus:outline-none focus:border-[#3E2723] transition-colors" placeholder="400001" required />
                                                </div>
                                            </div>
                                            <div className="pt-2 pb-8">
                                                <button type="submit" className="w-full bg-[#3E2723] text-white py-3 rounded-lg text-sm font-bold uppercase tracking-widest shadow-lg shadow-[#3E2723]/20 active:scale-95 transition-transform">Save Address</button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Desktop Add Address Form - Preserved */}
                                {showAddressForm && (
                                    <form onSubmit={handleAddAddress} className="hidden md:grid bg-white p-8 rounded-2xl shadow-sm grid-cols-2 gap-4">
                                        <input placeholder="Name" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
                                        <input placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
                                        <input placeholder="Flat, House no., Building, Company, Apartment" value={newAddress.flatNo} onChange={e => setNewAddress({ ...newAddress, flatNo: e.target.value })} className="col-span-2 w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
                                        <input placeholder="Area, Street, Sector, Village" value={newAddress.area} onChange={e => setNewAddress({ ...newAddress, area: e.target.value })} className="col-span-2 w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
                                        <input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
                                        <input placeholder="State" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
                                        <input placeholder="Pincode" value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} className="col-span-2 w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
                                        <button type="submit" className="col-span-2 bg-[#3E2723] text-white py-3 rounded-lg text-sm font-bold tracking-widest uppercase">Save Address</button>
                                    </form>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    {addresses.map(addr => (
                                        <div key={addr.id} className="bg-[#FDF5F6] p-4 md:p-6 rounded-2xl md:rounded-2xl shadow-sm relative border border-[#EBCDD0] md:border-transparent">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-[9px] md:text-[10px] font-bold uppercase py-1 px-2 bg-white md:bg-white rounded text-black tracking-wider shadow-sm">{addr.type}</span>
                                                <button onClick={() => removeAddress(addr.id)} className="text-red-400 p-1 active:scale-90 transition-transform"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                            <h4 className="font-bold text-sm md:text-base text-black mb-1">{addr.name}</h4>
                                            <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-3">{addr.flatNo}, {addr.city} - {addr.pincode}</p>
                                            {defaultAddressId !== addr.id && <button onClick={() => setDefaultAddress(addr.id)} className="text-[10px] md:text-xs underline font-bold text-[#D39A9F] hover:text-black">Set Default</button>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Account Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm md:max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                            <div className="bg-red-50 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-red-500 mb-4 md:mb-6 mx-auto">
                                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] text-center mb-3 md:mb-4">Delete Account?</h3>
                            <p className="text-xs md:text-base text-[#8D6E63] text-center mb-6 md:mb-8 leading-relaxed">
                                This action is permanent and cannot be undone. All your orders, addresses, and wishlist will be wiped forever.
                            </p>
                            <div className="flex flex-col gap-2.5 md:gap-3">
                                <button
                                    onClick={() => {
                                        deleteAccount();
                                        navigate('/');
                                    }}
                                    className="w-full bg-red-600 text-white py-3 md:py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg text-[10px] md:text-sm uppercase tracking-widest"
                                >
                                    Yes, Delete My Account
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="w-full bg-[#EFEBE9] text-[#5D4037] py-3 md:py-4 rounded-xl font-bold hover:bg-[#D7CCC8] transition-all text-[10px] md:text-sm uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
