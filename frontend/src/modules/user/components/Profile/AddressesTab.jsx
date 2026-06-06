import React from 'react';
import { Plus, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddressesTab = ({ 
    safeAddresses, 
    showAddressForm, 
    newAddress, 
    setNewAddress, 
    handleAddAddress, 
    removeAddress, 
    defaultAddressId, 
    setDefaultAddress 
}) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-display font-bold text-black tracking-wide">My Addresses</h2>
                <button onClick={() => showAddressForm ? navigate('/profile/addresses') : navigate('/profile/addresses/add')} className="bg-black text-white px-4 py-2 rounded-lg text-sm hidden md:block hover:bg-[#D39A9F] transition-all">
                    {showAddressForm ? 'Cancel' : 'Add New'}
                </button>
                <button onClick={() => showAddressForm ? navigate('/profile/addresses') : navigate('/profile/addresses/add')} className="md:hidden bg-black text-white p-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all">
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {/* Mobile Add Address Form - Full Screen Overlay Style */}
            {showAddressForm && (
                <div className="md:hidden fixed inset-0 z-[200] bg-[#FDFBF7] flex flex-col animate-in slide-in-from-bottom duration-300">
                    <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
                        <button onClick={() => navigate('/profile/addresses')} className="text-[#3E2723]"><ArrowLeft className="w-5 h-5" /></button>
                        <h2 className="text-lg font-display font-bold text-[#3E2723]">Add New Address</h2>
                    </div>
                    <form onSubmit={handleAddAddress} className="flex-1 overflow-y-auto p-4 space-y-3">
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mb-1 block">Full Name</label>
                                <input value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} pattern="[a-zA-Z\s\-']+" title="Please use letters, spaces, hyphens, or apostrophes only" className="w-full bg-[#FAFAFA] border border-[#EFEBE9] p-2.5 rounded-lg text-sm font-medium text-[#3E2723] placeholder:text-gray-300 focus:outline-none focus:border-[#3E2723] transition-colors" placeholder="e.g. Aditi Sharma" required />
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
                                    <input value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} pattern="[a-zA-Z\s\-']+" title="Please use letters, spaces, hyphens, or apostrophes only" className="w-full bg-[#FAFAFA] border border-[#EFEBE9] p-2.5 rounded-lg text-sm font-medium text-[#3E2723] placeholder:text-gray-300 focus:outline-none focus:border-[#3E2723] transition-colors" placeholder="Mumbai" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mb-1 block">State</label>
                                    <input value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} pattern="[a-zA-Z\s\-']+" title="Please use letters, spaces, hyphens, or apostrophes only" className="w-full bg-[#FAFAFA] border border-[#EFEBE9] p-2.5 rounded-lg text-sm font-medium text-[#3E2723] placeholder:text-gray-300 focus:outline-none focus:border-[#3E2723] transition-colors" placeholder="Maharashtra" required />
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

            {/* Desktop Add Address Form - With Validation */}
            {showAddressForm && (
                <form onSubmit={handleAddAddress} className="hidden md:grid bg-white p-8 rounded-2xl shadow-sm grid-cols-2 gap-4 border border-[#EBCDD0] animate-in fade-in duration-300">
                    <input placeholder="Name" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} pattern="[a-zA-Z\s\-']+" title="Letters, spaces, hyphens, apostrophes only" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" required />
                    <input placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" required />
                    <input placeholder="Flat, House no., Building, Company, Apartment" value={newAddress.flatNo} onChange={e => setNewAddress({ ...newAddress, flatNo: e.target.value })} className="col-span-2 w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" required />
                    <input placeholder="Area, Street, Sector, Village" value={newAddress.area} onChange={e => setNewAddress({ ...newAddress, area: e.target.value })} className="col-span-2 w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" required />
                    <input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} pattern="[a-zA-Z\s\-']+" title="Letters, spaces, hyphens, apostrophes only" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" required />
                    <input placeholder="State" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} pattern="[a-zA-Z\s\-']+" title="Letters, spaces, hyphens, apostrophes only" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" required />
                    <input placeholder="Pincode" value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} className="col-span-2 w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" required />
                    <button type="submit" className="col-span-2 bg-[#3E2723] text-white py-3 rounded-lg text-sm font-bold tracking-widest uppercase hover:bg-black transition-colors mt-2">Save Address</button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {safeAddresses.map(addr => {
                    const addressId = addr.id || addr._id;
                    return (
                        <div key={addressId} className="bg-[#FDF5F6] p-4 md:p-6 rounded-2xl md:rounded-2xl shadow-sm relative border border-[#EBCDD0] md:border-transparent transition-all hover:shadow-md">
                            <div className="flex justify-between mb-2">
                                <span className="text-[9px] md:text-[10px] font-bold uppercase py-1 px-2 bg-white md:bg-white rounded text-black tracking-wider shadow-sm">{addr.type}</span>
                                <button onClick={() => removeAddress(addressId)} className="text-red-400 p-1 active:scale-90 hover:text-red-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <h4 className="font-bold text-sm md:text-base text-black mb-1">{addr.name}</h4>
                            <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-3">
                                {[addr.flatNo, addr.area, addr.city].filter(Boolean).join(', ')}
                                {addr.pincode ? ` - ${addr.pincode}` : ''}
                            </p>
                            {defaultAddressId !== addressId && <button onClick={() => setDefaultAddress(addressId)} className="text-[10px] md:text-xs underline font-bold text-[#D39A9F] hover:text-black transition-colors">Set Default</button>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AddressesTab;
