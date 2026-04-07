import React, { useState } from 'react';
import { X, MapPin, Search, Navigation, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';
import toast from 'react-hot-toast';

const PincodeModal = () => {
    const { isPincodeModalOpen, setIsPincodeModalOpen, pincode: currentPincode, updatePincode } = useShop();
    const [tempPincode, setTempPincode] = useState(currentPincode || '');
    const [isValidating, setIsValidating] = useState(false);

    if (!isPincodeModalOpen) return null;

    const handleApply = async () => {
        if (tempPincode.length !== 6 || !/^\d+$/.test(tempPincode)) {
            toast.error("Please enter a valid 6-digit pincode");
            return;
        }

        setIsValidating(true);
        // Simulate API check for serviceability
        setTimeout(() => {
            updatePincode(tempPincode);
            setIsValidating(false);
            setIsPincodeModalOpen(false);
            toast.success(`Delivery pincode updated to ${tempPincode}`);
        }, 800);
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        toast.loading("Fetching your location...");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                toast.dismiss();
                // In a real app, we would reverse geocode the lat/lng to get a pincode
                // For now, let's just simulate finding a pincode or setting a 'detected' state
                updatePincode('400001'); // Mumbai placeholder
                setIsPincodeModalOpen(false);
                toast.success("Location detected successfully!");
            },
            (error) => {
                toast.dismiss();
                toast.error("Unable to retrieve your location");
                console.error(error);
            }
        );
    };

    const popularCities = [
        { name: 'Mumbai', code: '400001' },
        { name: 'Delhi', code: '110001' },
        { name: 'Bangalore', code: '560001' },
        { name: 'Pune', code: '411001' },
        { name: 'Kolkata', code: '700001' },
        { name: 'Chennai', code: '600001' }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsPincodeModalOpen(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-[#9C5B61] px-8 py-10 text-white relative">
                        <button 
                            onClick={() => setIsPincodeModalOpen(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold">Set Delivery Location</h2>
                                <p className="text-white/70 text-sm">Enter your pincode to check serviceability</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="space-y-6">
                            {/* Pincode Input */}
                            <div className="relative">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2 block">Enter Pin Code</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={tempPincode}
                                        onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-lg font-bold tracking-widest focus:outline-none focus:border-[#9C5B61] focus:bg-white transition-all"
                                        placeholder="000000"
                                    />
                                    <button 
                                        onClick={handleApply}
                                        disabled={tempPincode.length !== 6 || isValidating}
                                        className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                                            tempPincode.length === 6 && !isValidating
                                            ? 'bg-[#9C5B61] text-white shadow-lg shadow-[#9C5B61]/20 hover:-translate-y-0.5 active:translate-y-0'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {isValidating ? 'Checking...' : 'Apply'}
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-gray-100 flex-1" />
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">OR</span>
                                <div className="h-px bg-gray-100 flex-1" />
                            </div>

                            {/* Use Current Location */}
                            <button
                                onClick={handleUseCurrentLocation}
                                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-[#9C5B61]/10 text-[#9C5B61] font-bold hover:bg-[#9C5B61]/5 transition-all active:scale-95"
                            >
                                <Navigation className="w-4 h-4 fill-current" />
                                <span className="text-sm">Use Current Location</span>
                            </button>

                            {/* Quick Select */}
                            <div>
                                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4 block">Popular Cities</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {popularCities.map(city => (
                                        <button
                                            key={city.code}
                                            onClick={() => {
                                                setTempPincode(city.code);
                                                updatePincode(city.code);
                                                setIsPincodeModalOpen(false);
                                                toast.success(`Welcome to ${city.name}!`);
                                            }}
                                            className="px-3 py-2 rounded-xl border border-gray-100 text-[11px] font-semibold text-gray-600 hover:border-[#9C5B61] hover:text-[#9C5B61] hover:bg-[#9C5B61]/5 transition-all text-center"
                                        >
                                            {city.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer Warning */}
                    <div className="px-8 py-5 bg-gray-50 flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-[#9C5B61]" />
                        <p className="text-[10px] text-gray-500 font-medium">Delivery times and availability may vary based on your selected location.</p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PincodeModal;
