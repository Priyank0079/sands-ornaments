import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
    Download, CheckCircle2 as SuccessIcon, Copy, QrCode, Barcode as BarcodeIcon, 
    Loader2, Plus, Upload, X, Trash2, Sparkles, ImagePlus, ExternalLink, 
    FileText, CheckCircle2, IndianRupee, Scale, Tag, Box, Zap, Coins, 
    Calculator, Layers, Search, Truck, Info, ChevronRight, LayoutDashboard,
    ArrowLeft, Eye
} from 'lucide-react';
import Barcode from 'react-barcode';
import PageHeader from '../../admin/components/common/PageHeader';
import { FormSection, Input, Select, TextArea } from '../../admin/components/common/FormControls';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { downloadImage, downloadSvgNode, downloadTextFile } from '../../../utils/downloadUtils';
import familyVideoFrame from '@/assets/products/family/videoframe_23898.png';

// Tab Components
import ProductGeneralTab from './product-editor/ProductGeneralTab';
import ProductVariantsTab from './product-editor/ProductVariantsTab';
import ProductMediaTab from './product-editor/ProductMediaTab';
import ProductAdvancedTab from './product-editor/ProductAdvancedTab';

// Utilities
import { 
    roundCurrency, 
    IMAGE_PREVIEW_RE, 
    ENHANCEMENT_PROMPT,
    normalizeSerialCodes,
    getAvailableSerialCodes,
    getPricingForVariant,
    syncVariantSerialQuantity
} from '../utils/productEditorUtils';

const SharedProductEditor = ({
    productApi,
    metalPricingApi,
    backPath = '/seller/products',
    categoryApi,
    editorMode = 'seller'
}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isAdminMode = editorMode === 'admin';

    const isViewMode = location.pathname.includes('/view/');
    const isEditMode = Boolean(id) && !isViewMode;

    // Navigation Tabs State
    const [activeTab, setActiveTab] = useState('general'); // general, variants, media, advanced

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(isEditMode || isViewMode);
    const [imageFiles, setImageFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [variantImageFiles, setVariantImageFiles] = useState({});
    const [variantImagePreviews, setVariantImagePreviews] = useState({});
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState('');
    const [removeVideo, setRemoveVideo] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdProductData, setCreatedProductData] = useState(null);
    const [gstRate, setGstRate] = useState(3);
    const [metalRates, setMetalRates] = useState({ gold: 0, silver: 0, platinum: 0 });
    
    const serialBarcodeRefs = useRef({});
    
    // AI Enhancement States
    const [enhancingIndex, setEnhancingIndex] = useState(null);
    const [showEnhanceModal, setShowEnhanceModal] = useState(false);
    const [enhancedIndices, setEnhancedIndices] = useState(new Set());

    const [formData, setFormData] = useState({
        name: '',
        productCode: '',
        huid: '',
        material: 'Silver',
        description: '',
        specifications: '',
        supplierInfo: '',
        stylingTips: '',
        careTips: '',
        diamondType: 'none',
        categories: [],
        variants: [{ 
            id: Date.now(), 
            name: 'Standard', 
            weight: '', 
            weightUnit: 'Grams',
            makingCharge: '0', 
            hallmarkingCharge: '0',
            diamondCertificateCharge: '0',
            diamondPrice: '0', 
            diamondType: 'none',
            mrp: '0', 
            price: '', 
            stock: 0,
            serialCodes: [],
            hiddenCharge: 0,
            subtotalBeforeTax: 0,
            gstAmount: 0,
            priceAfterTax: 0,
            pgChargePercent: 0,
            pgChargeAmount: 0,
            variantCode: '',
            variantImages: [],
            variantFaqs: [],
            diamondSpecs: {
                carat: '',
                clarity: '',
                color: '',
                cut: '',
                shape: '',
                diamondCount: 0
            }
        }],
        faqs: [],
        seo: { title: '', description: '', keywords: '' },
        logistics: { estimatedShippingDays: 3, certificateUrl: '' },
        deletedImages: [],
        tags: { 
            isNewArrival: false, 
            isMostGifted: false, 
            isNewLaunch: false, 
            isTrending: false, 
            isPremium: false 
        },
        relatedProducts: [],
        weight: '',
        weightUnit: 'Grams',
        paymentGatewayChargeBearer: 'seller',
        videoUrl: '',
        status: 'Active',
        active: true,
        showInNavbar: true,
        showInCollection: true,
        cardLabel: '',
        cardBadge: '',
        audience: ['unisex'],
        silverCategory: '',
        goldCategory: ''
    });

    const setSerialBarcodeRef = (key, node) => {
        if (node) {
            serialBarcodeRefs.current[key] = node;
        } else {
            delete serialBarcodeRefs.current[key];
        }
    };

    const handleDownloadSerialBarcode = (serialCode) => {
        const container = serialBarcodeRefs.current[serialCode];
        const svgNode = container?.querySelector?.('svg');
        if (!svgNode) {
            toast.error('Barcode preview is not ready yet');
            return;
        }
        downloadSvgNode(svgNode, `serial-${serialCode}.svg`);
    };

    const handleDownloadAllSerialBarcodes = (variant) => {
        const codes = (variant.serialCodes || []).map(c => c.code);
        if (codes.length === 0) return;
        downloadTextFile(codes.join('\n'), `barcodes-${variant.name || 'variant'}.txt`);
    };

    const resolvedProductApi = productApi;
    const resolvedMetalPricingApi = metalPricingApi;
    const isFamilyVideoFrameProduct = id === '69ef0e442cf9c0c98d8aab52';
    const familyVideoFramePreview = !removeVideo && isEditMode && isFamilyVideoFrameProduct && !videoPreview && !formData.videoUrl
        ? familyVideoFrame
        : '';
    const resolvedVideoPreview = videoPreview || formData.videoUrl || familyVideoFramePreview;
    const isImageVideoPreview = Boolean(resolvedVideoPreview) && (
        IMAGE_PREVIEW_RE.test(resolvedVideoPreview) || 
        /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(String(resolvedVideoPreview))
    );

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoryResult = await (categoryApi ? categoryApi() : Promise.resolve([]));
                const list = Array.isArray(categoryResult)
                    ? categoryResult
                    : (categoryResult?.data?.data?.categories || categoryResult?.data?.categories || []);
                setCategories(list.filter(cat => cat.isActive !== false));
            } catch (err) {
                toast.error("Failed to load categories");
            }
        };
        loadCategories();
    }, [categoryApi]);

    useEffect(() => {
        const loadPricing = async () => {
            try {
                if (!resolvedMetalPricingApi?.getMetalPricing) return;
                const res = await resolvedMetalPricingApi.getMetalPricing();
                if (res?.metalRates) {
                    setMetalRates(prev => ({
                        ...prev,
                        ...res.metalRates
                    }));
                }
                if (res?.gstRate !== undefined && res?.gstRate !== null) {
                    setGstRate(Number(res.gstRate) || 0);
                }
            } catch (err) {
                // silent fallback
            }
        };
        loadPricing();
    }, []);

    useEffect(() => {
        const loadProduct = async () => {
            if (!isEditMode && !isViewMode) {
                setLoading(false);
                return;
            }
            try {
                if (!resolvedProductApi?.getProduct) return;
                const data = await resolvedProductApi.getProduct(id);
                if (data) {
                    const normalizedCategories = (data.categories || []).map(c => ({
                        category: typeof c === 'object' ? (c._id || c.name || '') : c
                    }));
                    
                    const {
                        _id, id: legacyId, image, sellerId, sku, rating, reviewCount,
                        createdAt, updatedAt, __v, slug, brand, status, active,
                        showInNavbar, showInCollection, ...restData
                    } = data;

                    setFormData(prev => ({
                        ...prev,
                        ...restData,
                        material: data.material || data.metal || 'Silver',
                        audience: Array.isArray(data.audience) && data.audience.length > 0 ? data.audience : ['unisex'],
                        weight: data.weight || '',
                        weightUnit: data.weightUnit || 'Grams',
                        paymentGatewayChargeBearer: data.paymentGatewayChargeBearer || 'seller',
                        diamondType: data.diamondType || 'none',
                        categories: normalizedCategories.slice(0, 1),
                        variants: data.variants?.map((v, index) => {
                            const serialCodes = normalizeSerialCodes(v.serialCodes || []);
                            const prefix = String(data.name || '').toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4) || 'ITEM';
                            const availableCount = serialCodes.filter(code => (code.status || 'AVAILABLE') === 'AVAILABLE').length;
                            const desiredCount = availableCount || Number(v.stock) || 0;
                            const ensured = serialCodes.length > 0
                                ? { serialCodes, stock: availableCount }
                                : syncVariantSerialQuantity({ serialCodes: [] }, index, desiredCount, prefix);

                            return { 
                                ...v, 
                                id: v._id || Math.random(),
                                weight: v.weight ?? data.weight ?? '',
                                weightUnit: v.weightUnit || data.weightUnit || 'Grams',
                                makingCharge: (v.makingCharge || 0).toString(),
                                hallmarkingCharge: (v.hallmarkingCharge || 0).toString(),
                                diamondCertificateCharge: (
                                    v.diamondCertificateCharge !== undefined && v.diamondCertificateCharge !== null
                                        ? v.diamondCertificateCharge
                                        : (v.diamondPrice || 0)
                                ).toString(),
                                diamondPrice: (v.diamondPrice || 0).toString(),
                                diamondType: v.diamondType || data.diamondType || 'none',
                                serialCodes: ensured.serialCodes,
                                stock: ensured.stock,
                                variantImages: Array.isArray(v.variantImages) ? v.variantImages : [],
                                variantFaqs: Array.isArray(v.variantFaqs) ? v.variantFaqs : [],
                                diamondSpecs: {
                                    carat: v.diamondSpecs?.carat || '',
                                    clarity: v.diamondSpecs?.clarity || '',
                                    color: v.diamondSpecs?.color || '',
                                    cut: v.diamondSpecs?.cut || '',
                                    shape: v.diamondSpecs?.shape || '',
                                    diamondCount: v.diamondSpecs?.diamondCount || 0
                                }
                            };
                        }) || prev.variants,
                        faqs: data.faqs || [],
                        seo: data.seo || { title: '', description: '', keywords: '' },
                        logistics: data.logistics || { estimatedShippingDays: 3, certificateUrl: '' },
                        careTips: data.careTips || '',
                        stylingTips: data.stylingTips || '',
                        supplierInfo: data.supplierInfo || '',
                        specifications: data.specifications || '',
                        tags: data.tags || { isNewArrival: false, isMostGifted: false, isNewLaunch: false, isTrending: false, isPremium: false },
                        relatedProducts: data.relatedProducts || [],
                        videoUrl: data.videoUrl || '',
                        isSerialized: true
                    }));

                    if (data.images) setPreviewImages(data.images);
                    setVideoPreview(data.videoUrl || '');
                    setLoading(false);
                }
            } catch (err) {
                toast.error("Failed to load product");
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    // Handlers
    const handleVideoUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setVideoFile(file);
        setRemoveVideo(false);
        setVideoPreview(URL.createObjectURL(file));
    };

    const handleRemoveVideo = () => {
        setVideoFile(null);
        setVideoPreview('');
        setRemoveVideo(true);
        setFormData(prev => ({ ...prev, videoUrl: '' }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.slice(0, 5 - imageFiles.length);
        const previews = newFiles.map(file => URL.createObjectURL(file));
        setImageFiles(prev => [...prev, ...newFiles]);
        setPreviewImages(prev => [...prev, ...previews].slice(0, 5));
    };

    const handleHoverImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (previewImages.length >= 5) {
            toast.error('You can upload up to 5 images.');
            return;
        }
        const preview = URL.createObjectURL(file);
        setImageFiles(prev => [...prev, file]);
        setPreviewImages(prev => [...prev, preview].slice(0, 5));
    };

    const handleRemoveImage = (index) => {
        const removedImage = previewImages[index];
        const newPreviewImages = previewImages.filter((_, i) => i !== index);

        const updates = { deletedImages: [...formData.deletedImages] };
        if (typeof removedImage === 'string' && !removedImage.startsWith('blob:')) {
            updates.deletedImages.push(removedImage);
        } else if (removedImage?.startsWith('blob:')) {
            const newFileIndex = previewImages.slice(0, index).filter(img => img.startsWith('blob:')).length;
            setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
        }

        setFormData(prev => ({ ...prev, deletedImages: updates.deletedImages }));
        setPreviewImages(newPreviewImages);
    };

    const handleVariantChange = (vid, field, value) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v => {
                if (v.id === vid) {
                    const updated = { ...v, [field]: value };
                    
                    if (['makingCharge', 'hallmarkingCharge', 'diamondCertificateCharge', 'diamondPrice', 'weight', 'weightUnit'].includes(field)) {
                        if (field === 'diamondCertificateCharge') {
                            updated.diamondPrice = value;
                        }
                        const pricing = getPricingForVariant(updated, prev, metalRates, gstRate);
                        updated.mrp = pricing.finalPrice.toString();
                        updated.price = pricing.finalPrice.toString();
                        updated.metalPrice = pricing.metalPrice;
                        updated.hiddenCharge = pricing.hiddenCharge;
                        updated.subtotalBeforeTax = pricing.subtotalBeforeTax;
                        updated.gstAmount = pricing.gstValue;
                        updated.priceAfterTax = pricing.priceAfterTax;
                        updated.pgChargePercent = pricing.pgChargePercent;
                        updated.pgChargeAmount = pricing.pgChargeAmount;
                        updated.gst = pricing.gstValue;
                        updated.finalPrice = pricing.finalPrice;
                    }
                    return updated;
                }
                return v;
            })
        }));
    };

    const handleDiamondSpecChange = (vid, field, value) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v => {
                if (v.id === vid) {
                    return {
                        ...v,
                        diamondSpecs: {
                            ...(v.diamondSpecs || {}),
                            [field]: value
                        }
                    };
                }
                return v;
            })
        }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { 
                id: Date.now(), 
                name: '', 
                weight: prev.weight || '',
                weightUnit: prev.weightUnit || 'Grams',
                makingCharge: '0', 
                hallmarkingCharge: '0',
                diamondCertificateCharge: '0',
                diamondPrice: '0', 
                diamondType: prev.diamondType || 'none',
                mrp: '0', 
                price: '', 
                stock: 0,
                serialCodes: [],
                hiddenCharge: 0,
                subtotalBeforeTax: 0,
                gstAmount: 0,
                priceAfterTax: 0,
                pgChargePercent: 0,
                pgChargeAmount: 0,
                variantCode: '',
                variantImages: [],
                variantFaqs: [],
                diamondSpecs: {
                    carat: '',
                    clarity: '',
                    color: '',
                    cut: '',
                    shape: '',
                    diamondCount: 0
                }
            }]
        }));
    };

    const removeVariant = (id) => {
        if (formData.variants.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter(v => v.id !== id)
        }));
    };

    const updateVariantSerialQuantity = (id, desiredCount) => {
        const count = Math.max(0, parseInt(desiredCount || 0, 10));
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((v, index) => {
                if (v.id !== id) return v;
                const prefix = String(prev.name || '').toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4) || 'ITEM';
                return syncVariantSerialQuantity(v, index, count, prefix);
            })
        }));
    };

    const handleVariantImageUpload = (variantId, filesList) => {
        const files = Array.from(filesList || []);
        if (!variantId || files.length === 0) return;

        const previews = files.map((file) => URL.createObjectURL(file));
        setVariantImageFiles((prev) => ({
            ...prev,
            [variantId]: [...(prev[variantId] || []), ...files]
        }));
        setVariantImagePreviews((prev) => ({
            ...prev,
            [variantId]: [...(prev[variantId] || []), ...previews]
        }));
    };

    const handleRemoveVariantUpload = (variantId, previewIndex) => {
        if (!variantId || previewIndex < 0) return;
        setVariantImageFiles((prev) => ({
            ...prev,
            [variantId]: (prev[variantId] || []).filter((_, index) => index !== previewIndex)
        }));
        setVariantImagePreviews((prev) => ({
            ...prev,
            [variantId]: (prev[variantId] || []).filter((_, index) => index !== previewIndex)
        }));
    };

    const handleRemoveSavedVariantImage = (variantId, imageUrl) => {
        if (!variantId || !imageUrl) return;
        setFormData((prev) => ({
            ...prev,
            variants: prev.variants.map((variant) => {
                if (variant.id !== variantId) return variant;
                return {
                    ...variant,
                    variantImages: Array.isArray(variant.variantImages)
                        ? variant.variantImages.filter((img) => img !== imageUrl)
                        : []
                };
            })
        }));
    };

    const addVariantFaq = (variantId) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v => {
                if (v.id !== variantId) return v;
                const current = Array.isArray(v.variantFaqs) ? v.variantFaqs : [];
                return { ...v, variantFaqs: [...current, { question: '', answer: '' }] };
            })
        }));
    };

    const removeVariantFaq = (variantId, faqIndex) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v => {
                if (v.id !== variantId) return v;
                const current = Array.isArray(v.variantFaqs) ? v.variantFaqs : [];
                return { ...v, variantFaqs: current.filter((_, i) => i !== faqIndex) };
            })
        }));
    };

    const handleVariantFaqChange = (variantId, faqIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v => {
                if (v.id !== variantId) return v;
                const current = Array.isArray(v.variantFaqs) ? v.variantFaqs : [];
                const next = current.map((faq, i) => i === faqIndex ? { ...faq, [field]: value } : faq);
                return { ...v, variantFaqs: next };
            })
        }));
    };

    const clearVariantFaqOverride = (variantId) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(variant => (
                variant.id === variantId ? { ...variant, variantFaqs: [] } : variant
            ))
        }));
    };

    const addFaq = () => {
        setFormData(prev => ({
            ...prev,
            faqs: [...prev.faqs, { question: '', answer: '' }]
        }));
    };

    const removeFaq = (index) => {
        setFormData(prev => ({
            ...prev,
            faqs: prev.faqs.filter((_, i) => i !== index)
        }));
    };

    const handleFaqChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            faqs: prev.faqs.map((faq, i) => i === index ? { ...faq, [field]: value } : faq)
        }));
    };

    const handleEnhancedUpload = (e) => {
        const file = e.target.files[0];
        if (!file || enhancingIndex === null) return;
        
        const preview = URL.createObjectURL(file);
        
        setPreviewImages(prev => {
            const newPreviews = [...prev];
            newPreviews[enhancingIndex] = preview;
            return newPreviews;
        });

        const isNewFile = previewImages[enhancingIndex]?.startsWith('blob:');
        if (isNewFile) {
            const newFileIndex = previewImages.slice(0, enhancingIndex).filter(img => img.startsWith('blob:')).length;
            setImageFiles(prev => {
                const newFiles = [...prev];
                newFiles[newFileIndex] = file;
                return newFiles;
            });
        } else {
            setImageFiles(prev => [...prev, file]);
        }
        
        setEnhancedIndices(prev => new Set(prev).add(enhancingIndex));
        setShowEnhanceModal(false);
        setEnhancingIndex(null);
        toast.success("✅ Image enhanced successfully");
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.description) newErrors.description = "Description is required";
        if (!formData.categories?.[0]?.category) newErrors.categories = "Category is required.";
        
        formData.variants.forEach((v, i) => {
            if (!v.name) newErrors[`variant_${i}_name`] = "Variant name required";
            if (!v.weight) newErrors[`variant_${i}_weight`] = "Weight required";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Please fill required fields");
            setActiveTab('general');
            return;
        }

        setIsSaving(true);
        try {
            const productForm = new FormData();
            
            // Clean payload
            const payload = { ...formData };
            const cleanVariants = payload.variants.map(v => {
                const { id: _, ...rest } = v;
                return rest;
            });

            productForm.append('name', payload.name);
            productForm.append('productCode', payload.productCode);
            productForm.append('huid', payload.huid);
            productForm.append('material', payload.material);
            productForm.append('description', payload.description);
            productForm.append('specifications', payload.specifications || '');
            productForm.append('supplierInfo', payload.supplierInfo || '');
            productForm.append('stylingTips', payload.stylingTips || '');
            productForm.append('careTips', payload.careTips || '');
            productForm.append('diamondType', payload.diamondType);
            productForm.append('categories', JSON.stringify(payload.categories));
            productForm.append('audience', JSON.stringify(payload.audience || ['unisex']));
            productForm.append('weight', payload.weight || '');
            productForm.append('weightUnit', payload.weightUnit || 'Grams');
            productForm.append('paymentGatewayChargeBearer', payload.paymentGatewayChargeBearer || 'seller');
            productForm.append('silverCategory', payload.silverCategory || '');
            productForm.append('goldCategory', payload.goldCategory || '');
            productForm.append('cardLabel', payload.cardLabel || '');
            productForm.append('cardBadge', payload.cardBadge || '');
            productForm.append('status', payload.status || 'Active');
            productForm.append('showInNavbar', (payload.showInNavbar ?? true).toString());
            productForm.append('showInCollection', (payload.showInCollection ?? true).toString());
            productForm.append('active', (payload.active ?? true).toString());
            productForm.append('isSerialized', 'true');
            productForm.append('variants', JSON.stringify(cleanVariants));
            productForm.append('faqs', JSON.stringify(payload.faqs));
            productForm.append('tags', JSON.stringify(payload.tags));
            productForm.append('seo', JSON.stringify(payload.seo));
            productForm.append('logistics', JSON.stringify(payload.logistics));
            productForm.append('relatedProducts', JSON.stringify(payload.relatedProducts));
            productForm.append('deletedImages', JSON.stringify(payload.deletedImages));
            productForm.append('removeVideo', removeVideo.toString());

            imageFiles.forEach(file => productForm.append('images', file));
            if (videoFile) productForm.append('video', videoFile);

            // Variant image files
            Object.keys(variantImageFiles).forEach(vid => {
                variantImageFiles[vid].forEach(file => {
                    productForm.append(`variantImages_${vid}`, file);
                });
            });

            let response;
            if (isEditMode) {
                response = await resolvedProductApi.updateProduct(id, productForm);
            } else {
                response = await resolvedProductApi.createProduct(productForm);
            }

            if (response) {
                toast.success(isEditMode ? "Product updated successfully" : "Product created successfully");
                setCreatedProductData(response.data?.data || response.data || response);
                setShowSuccessModal(true);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save product");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-md">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-[#3E2723]/10 border-t-[#3E2723] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <LayoutDashboard className="text-[#3E2723] animate-pulse" size={24} />
                    </div>
                </div>
                <p className="mt-6 text-[10px] font-black text-[#3E2723] uppercase tracking-[0.3em] animate-pulse">Initializing Protocol...</p>
            </div>
        );
    }

    const tabItems = [
        { id: 'general', label: 'General Info', icon: LayoutDashboard },
        { id: 'variants', label: 'Variants & Stock', icon: Layers },
        { id: 'media', label: 'Media Gallery', icon: ImagePlus },
        { id: 'advanced', label: 'Advanced Specs', icon: Zap },
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7]/50 pb-20">
            {/* Premium Header Container */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate(backPath)}
                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#3E2723] hover:bg-white transition-all shadow-sm group"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <div>
                                <h1 className="text-xl font-black text-[#3E2723] uppercase tracking-tight flex items-center gap-3">
                                    {isEditMode ? 'Modify Artifact' : (isViewMode ? 'Artifact Inspection' : 'Register New Artifact')}
                                    {isEditMode && <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 text-[9px] font-black tracking-widest">{formData.productCode || 'GEN-001'}</span>}
                                </h1>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                    {isAdminMode ? 'Enterprise Master Registry' : 'Authorized Merchant Catalogue'}
                                </p>
                            </div>
                        </div>

                        {/* Top Navigation Tabs */}
                        <div className="flex items-center p-1.5 bg-gray-100/50 rounded-2xl border border-gray-100 overflow-x-auto no-scrollbar">
                            {tabItems.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                        activeTab === tab.id 
                                        ? 'bg-white text-[#3E2723] shadow-md ring-1 ring-black/5' 
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <tab.icon size={14} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {!isViewMode && (
                            <button
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="px-8 py-3.5 bg-[#3E2723] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-amber-900/20 hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                                {isEditMode ? 'Commit Changes' : 'Publish Manifest'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
                <div className="grid grid-cols-1 gap-8">
                    {/* Active Tab Component */}
                    {activeTab === 'general' && (
                        <ProductGeneralTab 
                            formData={formData} 
                            setFormData={setFormData} 
                            errors={errors} 
                            isViewMode={isViewMode} 
                            categories={categories}
                            handleCategoryChange={(val) => setFormData(prev => ({ ...prev, categories: [{ category: val }] }))}
                            createdProductData={createdProductData}
                        />
                    )}

                    {activeTab === 'variants' && (
                        <ProductVariantsTab 
                            formData={formData} 
                            setFormData={setFormData} 
                            errors={errors} 
                            isViewMode={isViewMode} 
                            metalRates={metalRates} 
                            gstRate={gstRate}
                            handleVariantChange={handleVariantChange}
                            handleDiamondSpecChange={handleDiamondSpecChange}
                            addVariant={addVariant}
                            removeVariant={removeVariant}
                            updateVariantSerialQuantity={updateVariantSerialQuantity}
                            handleDownloadAllSerialBarcodes={handleDownloadAllSerialBarcodes}
                            handleDownloadSerialBarcode={handleDownloadSerialBarcode}
                            setSerialBarcodeRef={setSerialBarcodeRef}
                            handleVariantImageUpload={handleVariantImageUpload}
                            handleRemoveVariantUpload={handleRemoveVariantUpload}
                            variantImagePreviews={variantImagePreviews}
                            handleRemoveSavedVariantImage={handleRemoveSavedVariantImage}
                            addVariantFaq={addVariantFaq}
                            removeVariantFaq={removeVariantFaq}
                            handleVariantFaqChange={handleVariantFaqChange}
                            clearVariantFaqOverride={clearVariantFaqOverride}
                        />
                    )}

                    {activeTab === 'media' && (
                        <ProductMediaTab 
                            formData={formData} 
                            setFormData={setFormData} 
                            isViewMode={isViewMode} 
                            previewImages={previewImages}
                            handleImageUpload={handleImageUpload}
                            handleHoverImageUpload={handleHoverImageUpload}
                            handleRemoveImage={handleRemoveImage}
                            handleVideoUpload={handleVideoUpload}
                            handleRemoveVideo={handleRemoveVideo}
                            resolvedVideoPreview={resolvedVideoPreview}
                            isImageVideoPreview={isImageVideoPreview}
                            removeVideo={removeVideo}
                            enhancingIndex={enhancingIndex}
                            setEnhancingIndex={setEnhancingIndex}
                            showEnhanceModal={showEnhanceModal}
                            setShowEnhanceModal={setShowEnhanceModal}
                            enhancedIndices={enhancedIndices}
                            handleEnhancedUpload={handleEnhancedUpload}
                        />
                    )}

                    {activeTab === 'advanced' && (
                        <ProductAdvancedTab 
                            formData={formData} 
                            setFormData={setFormData} 
                            isViewMode={isViewMode} 
                            addFaq={addFaq} 
                            removeFaq={removeFaq} 
                            handleFaqChange={handleFaqChange} 
                        />
                    )}
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0c0c0c]/90 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-500 flex flex-col md:flex-row">
                        <div className="md:w-1/2 bg-[#3E2723] p-12 flex flex-col justify-between relative">
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 mb-8">
                                    <SuccessIcon className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="text-4xl font-black text-white uppercase tracking-tight leading-tight mb-4">
                                    Manifest <br/> Successfully <br/> Committed
                                </h3>
                                <p className="text-amber-200/60 text-[10px] font-black uppercase tracking-[0.3em]">Identity Matrix Synchronized</p>
                            </div>
                            
                            <div className="relative z-10 mt-12 p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10">
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3">Unique Identity Artifact</p>
                                <span className="text-4xl font-mono font-black text-amber-400 tracking-tighter">
                                    {createdProductData?.productCode || 'REGISTERED'}
                                </span>
                            </div>
                        </div>

                        <div className="md:w-1/2 p-12 flex flex-col justify-between bg-white">
                            <div className="space-y-10">
                                <div>
                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Master Specification</p>
                                    <h2 className="text-2xl font-black text-gray-900 leading-tight uppercase line-clamp-2">{formData.name}</h2>
                                </div>

                                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col items-center gap-6">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Visual Signature (Barcode)</p>
                                    <div className="w-full flex justify-center bg-white p-6 rounded-2xl border border-gray-100 shadow-inner">
                                        <Barcode 
                                            value={createdProductData?.productCode || 'REGISTERED'} 
                                            width={1.5} 
                                            height={50} 
                                            fontSize={12}
                                            background="#ffffff"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mt-12">
                                <button 
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        if (isAdminMode) navigate('/admin/products/new');
                                        else window.location.reload();
                                    }}
                                    className="w-full py-5 bg-[#3E2723] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#3E2723]/20 hover:bg-black transition-all flex items-center justify-center gap-3"
                                >
                                    <Plus size={16} /> Register Another Artifact
                                </button>
                                <button 
                                    onClick={() => navigate(backPath)}
                                    className="w-full py-4 text-gray-400 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:text-[#3E2723] transition-all"
                                >
                                    Return to Repository
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SharedProductEditor;
