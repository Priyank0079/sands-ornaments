import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { ChevronRight, Package, ArrowLeft, RefreshCw, Check, CheckCircle, Clock } from 'lucide-react';

const OrderTracking = () => {
    const { orderId, view } = useParams();
    const { orders } = useShop();
    const navigate = useNavigate();

    // Normalize IDs for comparison
    const order = orders.find(o => o.id === orderId || o.id === `ORD-${orderId}` || o.id.replace('ORD-', '') === orderId);

    // --- MOCK STATES ---
    const [returnRequest, setReturnRequest] = React.useState(null);
    const [mockReturnStep, setMockReturnStep] = React.useState(2);

    // Standard Delivery Progress State
    const [currentStepIndex, setCurrentStepIndex] = React.useState(() => {
        const savedStep = localStorage.getItem(`tracking_step_${orderId}`);
        return savedStep ? parseInt(savedStep, 10) : 5; // Default to delivered for demo
    });

    React.useEffect(() => {
        if (order) {
            // DEMO: Simulate an EXCHANGE request for visualization
            // Switch to 'type: exchange' to demo the exchange flow
            setReturnRequest({
                id: `EXC-${order.id}`,
                type: 'exchange', // CHANGED TO 'exchange' for demo
                status: 'pickup_scheduled',
                date: new Date(Date.now() - 172800000).toISOString(),
                items: order.items.slice(0, 1)
            });
        }
    }, [order]);

    React.useEffect(() => {
        // Animate Delivery Steps (if not delivered)
        const deliveryInterval = setInterval(() => {
            setCurrentStepIndex(prev => {
                if (prev < 5) return prev + 1;
                return prev;
            });
        }, 10000);

        // DEMO: Animate Return/Exchange Steps to show progress
        const returnInterval = setInterval(() => {
            setMockReturnStep(prev => {
                const maxSteps = returnRequest?.type === 'exchange' ? 4 : 3;
                if (prev < maxSteps) return prev + 1;
                return prev; // Stop at completion, don't loop
            });
        }, 3000); // Updates every 3 seconds

        return () => {
            clearInterval(deliveryInterval);
            clearInterval(returnInterval);
        };
    }, [returnRequest]);

    if (!order) {
        return (
            <div className="min-h-screen pt-32 pb-12 px-4 flex flex-col items-center justify-center bg-white">
                <h2 className="text-2xl font-display text-black mb-4">Order Not Found</h2>
                <Link to="/profile" className="text-black underline hover:text-[#D39A9F]">Back to Profile</Link>
            </div>
        );
    }

    const formatDateTime = (dateTimestamp) => {
        return new Date(dateTimestamp).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    // --- DELIVERY TIMELINE CALCULATION ---
    const deliveryBaseDate = new Date(order.date).getTime();
    const deliveryStepsRaw = [
        { status: 'Order Placed', date: formatDateTime(deliveryBaseDate) },
        { status: 'Processing', date: formatDateTime(deliveryBaseDate + 3600000) },
        { status: 'Dispatched', date: formatDateTime(deliveryBaseDate + 86400000) },
        { status: 'In Transit', date: formatDateTime(deliveryBaseDate + 172800000) },
        { status: 'Out For Delivery', date: formatDateTime(deliveryBaseDate + 259200000) },
        { status: 'Delivered', date: formatDateTime(deliveryBaseDate + 266400000), isLast: true }
    ];

    const deliverySteps = deliveryStepsRaw.map((step, index) => ({
        ...step,
        completed: index <= currentStepIndex,
        current: index === currentStepIndex
    }));
    const currentDeliveryStatus = deliverySteps[currentStepIndex];

    // --- RETURN / EXCHANGE TIMELINE CALCULATION ---
    const returnBaseDate = returnRequest ? new Date(returnRequest.date).getTime() : Date.now();

    // Distinct paths for Return vs Exchange
    let returnStepsRaw = [];

    if (returnRequest && returnRequest.type === 'exchange') {
        // Exchange Flow: Application -> Pickup -> Dispatch Replacement -> Deliver Replacement
        returnStepsRaw = [
            { status: 'Exchange Requested', date: formatDateTime(returnBaseDate) },
            { status: 'Pickup Scheduled', date: formatDateTime(returnBaseDate + 86400000) },
            { status: 'Picked Up', date: 'Pending', isFuture: true },
            { status: 'Replacement Dispatched', date: 'Pending', isFuture: true },
            { status: 'Exchange Completed', date: 'Pending', isFuture: true, isLast: true }
        ];
    } else {
        // Return Flow: Application -> Pickup -> Refund
        returnStepsRaw = [
            { status: 'Return Requested', date: formatDateTime(returnBaseDate) },
            { status: 'Pickup Scheduled', date: formatDateTime(returnBaseDate + 86400000) },
            { status: 'Picked Up', date: 'Pending', isFuture: true },
            { status: 'Refund Processed', date: 'Pending', isFuture: true, isLast: true }
        ];
    }

    const returnSteps = returnStepsRaw.map((step, index) => {
        const isCompleted = index <= mockReturnStep;

        let displayDate = step.date;
        if (step.isFuture && isCompleted) {
            displayDate = formatDateTime(returnBaseDate + (index * 86400000));
        }

        return {
            ...step,
            completed: isCompleted,
            current: index === mockReturnStep,
            date: displayDate
        };
    });
    const currentReturnStatus = returnSteps[Math.min(mockReturnStep, returnSteps.length - 1)] || returnSteps[0];


    // --- VIEW LOGIC ---
    const isReturnView = view === 'return';
    const isDetailView = view === 'detail';

    const activeTimelineSteps = isReturnView ? returnSteps : deliverySteps;
    const activeTitle = isReturnView ? (returnRequest?.type === 'exchange' ? 'Exchange Status' : 'Return Status') : 'Tracking Details';
    const activeStatusObj = isReturnView ? currentReturnStatus : currentDeliveryStatus;

    // --- RENDER HELPERS ---
    const RenderTimeline = ({ steps }) => (
        <div className="space-y-0 relative pl-2 md:pl-0">
            {steps.map((step, index) => (
                <div key={index} className="flex gap-4 md:gap-6 relative pb-8 last:pb-0">
                    {/* Connecting Line */}
                    {index !== steps.length - 1 && (
                        <div className={`absolute left-[5px] md:left-[11px] top-4 md:top-6 bottom-0 w-0.5 z-0 transition-colors duration-500 ${step.completed && steps[index + 1]?.completed ? 'bg-black' : 'bg-gray-200'}`}></div>
                    )}

                    {/* Dot/Icon */}
                    <div className="relative z-10 flex-shrink-0 mt-0.5 md:mt-1">
                        <div className={`w-3 h-3 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-all duration-500 ${step.completed ? 'bg-black md:shadow-md' : 'bg-gray-200'} ${step.current ? 'ring-4 ring-black/10 scale-110' : ''}`}>
                            <span className="hidden md:block">
                                {step.completed && <Check className="w-3.5 h-3.5 text-white" />}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 -mt-1 md:mt-0">
                        <h4 className={`text-xs md:text-lg font-display font-bold transition-colors duration-500 ${step.completed || step.current ? 'text-black' : 'text-gray-400'}`}>
                            {step.status}
                        </h4>
                        {step.date && <p className="text-[10px] md:text-sm text-gray-500 font-medium mt-0.5 md:mt-1 font-serif">{step.date}</p>}
                    </div>
                </div>
            ))}
        </div>
    );

    // --- DETAILED VIEW ---
    if (view) {
        return (
            <div className="min-h-screen bg-white font-sans pt-0 md:pt-12 pb-12 selection:bg-[#D39A9F] selection:text-white">
                <div className="md:hidden bg-white shadow-sm p-4 sticky top-0 z-20 flex items-center gap-4">
                    <button onClick={() => navigate(`/order-tracking/${orderId}`)} className="p-2 -ml-2 text-black">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold font-display text-black">{activeTitle}</h1>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-0">
                    <div className="hidden md:block mb-6">
                        <button onClick={() => navigate(`/order-tracking/${orderId}`)} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors group uppercase tracking-widest font-bold text-[10px]">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Summary
                        </button>
                    </div>

                    <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100 min-h-[50vh]">
                        <div className="mb-8 md:mb-12 border-b border-gray-100 pb-6">
                            <span className="block text-[10px] md:text-xs text-[#D39A9F] uppercase tracking-widest font-bold mb-2">Current Activity</span>
                            <h2 className="text-2xl md:text-4xl font-display font-bold text-black mb-2">{activeStatusObj.status}</h2>
                            <p className="text-sm md:text-base text-gray-500 font-serif">{activeStatusObj.date}</p>
                        </div>

                        <RenderTimeline steps={activeTimelineSteps} />
                    </div>
                </div>
            </div>
        );
    }

    // --- SUMMARY VIEW ---
    return (
        <div className="min-h-screen bg-white font-sans pt-0 md:pt-12 pb-12 selection:bg-[#D39A9F] selection:text-white">
            <div className="md:hidden bg-white shadow-sm p-4 sticky top-0 z-20 flex items-center gap-4">
                <Link to="/profile" className="p-2 -ml-2 text-black">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-lg font-bold font-display text-black">Order #{order.id.replace('ORD-', '')}</h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-0">
                <div className="hidden md:block mb-6">
                    <Link to="/profile" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors group uppercase tracking-widest font-bold text-[10px]">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Orders
                    </Link>
                </div>

                <h2 className="text-xl md:text-2xl font-display font-bold text-black mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#D39A9F]" />
                    Order Journey
                </h2>

                <div className="space-y-8">
                    {/* 1. Return/Exchange Request Card (Latest Activity First) */}
                    {returnRequest && (
                        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow relative z-10">

                            <div className="p-3 md:p-5 border-b border-gray-50 bg-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-2.5">
                                    {/* Icon Logic: Spin if processing, Green Check if complete */}
                                    {mockReturnStep >= (returnRequest?.type === 'exchange' ? 4 : 3) ? (
                                        <div className="bg-green-50 text-green-600 p-1.5 rounded-full">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 text-blue-600 p-1.5 rounded-full">
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                                            {returnRequest.type === 'exchange' ? 'Exchange Request' : 'Return Request'}
                                        </span>
                                        <h3 className="text-xs md:text-sm font-bold text-black mt-0.5">{currentReturnStatus.status}</h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/order-tracking/${orderId}/return`)}
                                    className="bg-white border border-gray-200 text-black px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                                >
                                    Track Detail
                                </button>
                            </div>
                            <div className="p-3 md:p-5 bg-white">
                                <div className="flex gap-3 items-center">
                                    {returnRequest.items.map((item, idx) => (
                                        <div key={idx} className="relative">
                                            <img src={item.image} className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover border border-gray-100 grayscale-[0.2]" alt="" />
                                            {/* Badge for status */}
                                            <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[8px] px-1 py-0.5 rounded-full font-bold shadow-sm">Old</div>
                                        </div>
                                    ))}

                                    {/* Arrow indicating exchange */}
                                    {returnRequest.type === 'exchange' && (
                                        <div className="text-gray-400">
                                            <RefreshCw className="w-4 h-4" />
                                        </div>
                                    )}

                                    {/* New Item (Simulated for Exchange) */}
                                    {returnRequest.type === 'exchange' && returnRequest.items.map((item, idx) => (
                                        <div key={`new-${idx}`} className="relative">
                                            <img src={item.image} className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover border border-green-200" alt="" />
                                            <div className="absolute -top-1.5 -right-1.5 bg-green-600 text-white text-[8px] px-1 py-0.5 rounded-full font-bold shadow-sm">New</div>
                                        </div>
                                    ))}

                                    <div className="flex flex-col justify-center pl-1">
                                        <p className="text-xs font-bold text-black">ID: {returnRequest.id}</p>
                                        {returnRequest.type === 'exchange' ? (
                                            <p className="text-[10px] text-gray-500 font-bold mt-0.5">Size Changed: <span className="text-black">M</span></p>
                                        ) : (
                                            <p className="text-[10px] text-gray-500 mt-0.5">Refund Method: Original Source</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Original Order Card */}
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow relative">
                        {/* Connecting line to show flow (Upwards to Return if exists) */}
                        {returnRequest && <div className="absolute top-[-24px] left-8 w-0.5 h-6 bg-gray-100 z-0"></div>}

                        <div className="p-3 md:p-5 border-b border-gray-50 bg-gray-50 flex justify-between items-center">
                            <div>
                                <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Original Delivery</span>
                                <h3 className="text-xs md:text-sm font-bold text-black mt-0.5">{currentDeliveryStatus.status}</h3>
                            </div>
                            <button
                                onClick={() => navigate(`/order-tracking/${orderId}/detail`)}
                                className="bg-white border border-gray-200 text-black px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                            >
                                Track Detail
                            </button>
                        </div>
                        <div className="p-3 md:p-5">
                            <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex-shrink-0 w-12 md:w-14">
                                        <img src={item.image} className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover border border-gray-100" alt="" />
                                    </div>
                                ))}
                                <div className="flex flex-col justify-center pl-1">
                                    <p className="text-xs font-bold text-black">{order.items.length} Items</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">Total: ₹{order.total.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
