import React from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';

const CategoryView = () => {
    const { id } = useParams();

    // Mock data for display - in real app, fetch by ID
    const category = {
        id: id,
        name: 'Rings',
        description: 'Explore our exquisite collection of handcrafted rings designed to embellish your fingers with elegance.',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop',
        status: 'Active',
        productCount: 124,
        showInCollection: true,
        showInNavbar: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-02-10'
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="Category Details"
                subtitle={`View details for ${category.name}`}
                backPath="/admin/categories"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Category Overview</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Category Name</label>
                                <p className="text-xl font-bold text-gray-900">{category.name}</p>
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Description</label>
                                <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">{category.description}</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Date Created</label>
                                <p className="text-sm font-medium text-gray-700">{category.createdAt}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Last Updated</label>
                                <p className="text-sm font-medium text-gray-700">{category.updatedAt}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats or Related Info */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider text-[10px]">Total Products in Category</h4>
                            <p className="text-3xl font-bold text-[#8D6E63] mt-1">{category.productCount}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-[#8D6E63]/10 flex items-center justify-center text-[#8D6E63] font-bold text-lg">
                            {category.productCount > 99 ? '99+' : category.productCount}
                        </div>
                    </div>
                </div>

                {/* Sidebar Card */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="aspect-square relative bg-gray-100 border-b border-gray-200">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${category.status === 'Active'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-gray-100 text-gray-600 border-gray-200'
                                    }`}>
                                    {category.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-5 space-y-5">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Visibility Settings</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Show in Collection</span>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${category.showInCollection ? 'bg-[#8D6E63]/10 text-[#8D6E63]' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {category.showInCollection ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Show in Navbar</span>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${category.showInNavbar ? 'bg-[#8D6E63]/10 text-[#8D6E63]' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {category.showInNavbar ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryView;
