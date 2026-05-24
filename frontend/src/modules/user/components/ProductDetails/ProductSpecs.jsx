import React from 'react';
import { Sparkles, Layers, Scale, Droplets, Zap, Box, ShieldCheck } from 'lucide-react';

const ProductSpecs = ({ 
    hasDiamonds, 
    diamondType, 
    currentVariant, 
    product, 
    selectedVariantWeight, 
    selectedVariantWeightUnit 
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hasDiamonds && (
                <div className="bg-white rounded-3xl p-8 border border-[#8E2B45]/10 shadow-[0_4px_20px_-4px_rgba(142,43,69,0.05)] flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8E2B45] to-[#5B1E26] flex items-center justify-center mb-8 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#8E2B45] mb-10 border-b border-[#8E2B45]/10 pb-2">Diamond Intelligence</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 w-full">
                        <div className="group transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#8E2B45]/5 transition-colors">
                                <Layers className="w-4 h-4 text-gray-400 group-hover:text-[#8E2B45]" />
                            </div>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Type</span>
                            <span className="text-[13px] font-bold text-gray-900 block capitalize">{String(diamondType).replace('_', ' ')}</span>
                        </div>
                        <div className="group transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#8E2B45]/5 transition-colors">
                                <Scale className="w-4 h-4 text-gray-400 group-hover:text-[#8E2B45]" />
                            </div>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Weight</span>
                            <span className="text-[13px] font-bold text-gray-900 block">
                                {currentVariant?.diamondSpecs?.carat || product.diamondWeight || currentVariant?.diamondWeight || '---'}
                                <span className="text-[10px] ml-0.5">Ct</span>
                            </span>
                        </div>
                        <div className="group transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#8E2B45]/5 transition-colors">
                                <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-[#8E2B45]" />
                            </div>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Clarity</span>
                            <span className="text-[13px] font-bold text-gray-900 block">{currentVariant?.diamondSpecs?.clarity || product.diamondClarity || currentVariant?.diamondClarity || '---'}</span>
                        </div>
                        <div className="group transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#8E2B45]/5 transition-colors">
                                <Droplets className="w-4 h-4 text-gray-400 group-hover:text-[#8E2B45]" />
                            </div>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Color</span>
                            <span className="text-[13px] font-bold text-gray-900 block">{currentVariant?.diamondSpecs?.color || '---'}</span>
                        </div>
                        <div className="group transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#8E2B45]/5 transition-colors">
                                <Zap className="w-4 h-4 text-gray-400 group-hover:text-[#8E2B45]" />
                            </div>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Cut / Shape</span>
                            <span className="text-[13px] font-bold text-gray-900 block">
                                {currentVariant?.diamondSpecs?.cut || '---'}
                                <span className="mx-1 text-gray-200">/</span>
                                {currentVariant?.diamondSpecs?.shape || '---'}
                            </span>
                        </div>
                        <div className="group transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#8E2B45]/5 transition-colors">
                                <Box className="w-4 h-4 text-gray-400 group-hover:text-[#8E2B45]" />
                            </div>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Count</span>
                            <span className="text-[13px] font-bold text-gray-900 block">{currentVariant?.diamondSpecs?.diamondCount || product.diamondCount || currentVariant?.diamondCount || '---'}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className={`${hasDiamonds ? '' : 'md:col-span-2 max-w-lg mx-auto w-full'} bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center text-center`}>
                <div className="w-12 h-12 rounded-full bg-[#9C5B61]/10 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-[#9C5B61]" />
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">Metal & Authentication</h4>
                <div className="grid grid-cols-2 gap-y-6 gap-x-8 w-full">
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Metal</span>
                        <span className="text-xs font-semibold text-gray-900 block">{product.material || product.metal || '925 Silver'}</span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Purity</span>
                        <span className="text-xs font-semibold text-gray-900 block">{product.silverCategory || product.purity || '---'}</span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Weight</span>
                        <span className="text-xs font-semibold text-gray-900 block">{selectedVariantWeight || product.weight || '---'} {selectedVariantWeightUnit || product.weightUnit || 'g'}</span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">HUID</span>
                        <span className="text-xs font-semibold text-emerald-700 block uppercase tracking-tighter">{product.huid || 'SANDS-AUTH'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSpecs;
