import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Download, CheckCircle2 as SuccessIcon, Copy, QrCode, Barcode as BarcodeIcon, Loader2, Plus, Upload, X, Trash2, Sparkles, ImagePlus, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import Barcode from 'react-barcode';
import PageHeader from '../../admin/components/common/PageHeader';
import { FormSection, Input, Select, TextArea } from '../../admin/components/common/FormControls';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { downloadImage, downloadSvgNode, downloadTextFile } from '../../../utils/downloadUtils';
import familyVideoFrame from '@/assets/products/family/videoframe_23898.png';

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
        ['clean']
    ],
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    // Quill only needs `list` here; "bullet" is a list value, not a format.
    'list',
    'link'
];

const roundCurrency = (value) => Math.round((Number(value) || 0) * 100) / 100;
const IMAGE_PREVIEW_RE = /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i;

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
    const serialBarcodeRefs = useRef({});
    // AI Enhancement States
    const [enhancingIndex, setEnhancingIndex] = useState(null);
    const [showEnhanceModal, setShowEnhanceModal] = useState(false);
    const [enhancedIndices, setEnhancedIndices] = useState(new Set());

    const ENHANCEMENT_PROMPT = "Enhance this product image for eCommerce use. Improve lighting, sharpness, remove background noise, make it look professional, high resolution, clean white or premium background, realistic colors, suitable for online store listing.";

    const normalizeSerialCodes = (codes) => {
        if (!Array.isArray(codes)) return [];
        return codes
            .map(code => {
                if (typeof code === 'string') return { code, status: 'AVAILABLE' };
                if (code && typeof code === 'object' && code.code) {
                    return { code: String(code.code), status: code.status || 'AVAILABLE' };
                }
                return null;
            })
            .filter(Boolean);
    };

    const getAvailableSerialCodes = (variant) =>
        (variant.serialCodes || []).filter(code => (code.status || 'AVAILABLE') === 'AVAILABLE');

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
        downloadSvgNode(svgNode, `${serialCode}.svg`);
        toast.success('Unit barcode downloaded');
    };

    const handleDownloadAllSerialBarcodes = (variant) => {
        const serialCodes = normalizeSerialCodes(variant?.serialCodes || []);
        if (serialCodes.length === 0) {
            toast.error('No unit barcodes available for this variant');
            return;
        }

        const cardsMarkup = serialCodes.map((codeObj) => {
            const svgNode = serialBarcodeRefs.current[codeObj.code]?.querySelector?.('svg');
            if (!svgNode) return '';
            const svgMarkup = new XMLSerializer().serializeToString(svgNode);
            const safeCode = String(codeObj.code || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const safeStatus = String(codeObj.status || 'AVAILABLE').replace(/_/g, ' ');

            return `
                <div class="barcode-card">
                    <div class="code">${safeCode}</div>
                    <div class="status">${safeStatus}</div>
                    <div class="svg-wrap">${svgMarkup}</div>
                </div>
            `;
        }).filter(Boolean).join('');

        if (!cardsMarkup) {
            toast.error('Barcode previews are still loading');
            return;
        }

        const variantName = String(variant?.name || 'variant').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'variant';
        const productName = String(formData.name || 'product').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'product';
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${productName} ${variantName} unit barcodes</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #1f2937; }
    h1 { font-size: 18px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.08em; }
    p { margin: 0 0 20px; color: #6b7280; font-size: 12px; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .barcode-card { border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; page-break-inside: avoid; }
    .code { font-family: monospace; font-size: 12px; font-weight: 700; margin-bottom: 8px; }
    .status { display: inline-block; margin-bottom: 10px; padding: 4px 8px; border-radius: 999px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .svg-wrap { background: #f9fafb; border-radius: 12px; padding: 10px; overflow: hidden; display: flex; justify-content: center; }
    .svg-wrap svg { max-width: 100%; height: auto; }
    @media print { body { margin: 12px; } }
  </style>
</head>
<body>
  <h1>${String(formData.name || 'Product')}</h1>
  <p>Variant: ${String(variant?.name || 'Variant')} | Total unit barcodes: ${serialCodes.length}</p>
  <div class="grid">${cardsMarkup}</div>
</body>
</html>`;

        downloadTextFile(html, `${productName}-${variantName}-unit-barcodes.html`, 'text/html;charset=utf-8');
        toast.success('Variant barcode sheet downloaded');
    };

    const getSerialPrefix = () => {
        const base = String(formData.name || 'ITEM').toUpperCase().replace(/[^A-Z0-9]/g, '');
        return base.substring(0, 4) || 'ITEM';
    };

    const normalizeString = (value = '') => String(value || '').trim().toLowerCase();

    const getTenGramRate = () => {
        const material = normalizeString(formData.material);
        if (material === 'gold') {
            const goldCategory = normalizeString(formData.goldCategory);
            const gold10g = metalRates.gold10g || {};
            const fallback = Number(metalRates.goldPerGram || 0) * 10;

            if (goldCategory === '14') return Number(gold10g.k14) || fallback;
            if (goldCategory === '18') return Number(gold10g.k18) || fallback;
            if (goldCategory === '22') return Number(gold10g.k22) || fallback;
            if (goldCategory === '24') return Number(gold10g.k24) || fallback;

            return Number(gold10g.k18) || Number(gold10g.k22) || Number(gold10g.k14) || Number(gold10g.k24) || fallback;
        }

        if (material === 'silver') {
            const silverCategory = normalizeString(formData.silverCategory);
            const silver10g = metalRates.silver10g || {};
            const fallback = Number(metalRates.silverPerGram || 0) * 10;
            const isSterling = silverCategory === '925 sterling silver';

            if (isSterling) return Number(silver10g.sterling925) || fallback;
            return Number(silver10g.silverOther) || fallback;
        }

        return 0;
    };

    const getMetalRate = (variant) => {
        const unit = String(variant?.weightUnit || formData.weightUnit || 'Grams').toLowerCase();
        const perTenGram = Number(getTenGramRate()) || 0;
        const perGram = perTenGram / 10;
        const perMilligram = perGram / 1000;
        if (unit === 'milligrams' || unit === 'milligram') {
            return perMilligram;
        }
        return perGram;
    };

    const getMetalPrice = (variant) => {
        const weight = Number(variant?.weight ?? formData.weight) || 0;
        return roundCurrency(weight * getMetalRate(variant));
    };

    const getPaymentGatewayChargePercent = () => (
        String(formData.paymentGatewayChargeBearer || 'seller').toLowerCase() === 'user' ? 2 : 0
    );

    const getPricingForVariant = (variant) => {
        const metalPrice = getMetalPrice(variant);
        const makingCharge = Number(variant.makingCharge) || 0;
        const hallmarkingCharge = Number(variant.hallmarkingCharge) || 0;
        const diamondCertificateCharge = Number(
            variant.diamondCertificateCharge !== undefined && variant.diamondCertificateCharge !== null
                ? variant.diamondCertificateCharge
                : variant.diamondPrice
        ) || 0;
        const hiddenCharge = roundCurrency(hallmarkingCharge + diamondCertificateCharge);
        const subtotalBeforeTax = roundCurrency(metalPrice + makingCharge + hiddenCharge);
        const gstValue = roundCurrency((subtotalBeforeTax * (Number(gstRate) || 0)) / 100);
        const priceAfterTax = roundCurrency(subtotalBeforeTax + gstValue);
        const pgChargePercent = getPaymentGatewayChargePercent();
        const pgChargeAmount = roundCurrency((priceAfterTax * pgChargePercent) / 100);
        const finalPrice = roundCurrency(priceAfterTax + pgChargeAmount);
        return {
            metalPrice,
            makingCharge,
            hallmarkingCharge,
            diamondCertificateCharge,
            hiddenCharge,
            subtotalBeforeTax,
            gstValue,
            priceAfterTax,
            pgChargePercent,
            pgChargeAmount,
            finalPrice
        };
    };

    const generateSerialCode = (existingSet, variantIndex, prefixOverride) => {
        const prefix = prefixOverride || getSerialPrefix();
        let attempt = 0;
        while (attempt < 50) {
            const suffix = `${String(variantIndex + 1).padStart(2, '0')}${Date.now().toString().slice(-4)}${String(Math.floor(Math.random() * 900)).padStart(3, '0')}`;
            const code = `${prefix}${suffix}`;
            if (!existingSet.has(code)) return code;
            attempt += 1;
        }
        return `${prefix}${Date.now().toString().slice(-10)}`;
    };

    const syncVariantSerialQuantity = (variant, variantIndex, desiredCount, prefixOverride) => {
        const normalized = normalizeSerialCodes(variant.serialCodes || []);
        const available = normalized.filter(code => (code.status || 'AVAILABLE') === 'AVAILABLE');
        const sold = normalized.filter(code => (code.status || 'AVAILABLE') !== 'AVAILABLE');
        const existingSet = new Set(normalized.map(code => code.code));

        let updatedAvailable = [...available];
        if (desiredCount > available.length) {
            const toAdd = desiredCount - available.length;
            for (let i = 0; i < toAdd; i += 1) {
                const code = generateSerialCode(existingSet, variantIndex, prefixOverride);
                existingSet.add(code);
                updatedAvailable.push({ code, status: 'AVAILABLE' });
            }
        } else if (desiredCount < available.length) {
            updatedAvailable = available.slice(0, desiredCount);
        }

        return {
            ...variant,
            serialCodes: [...sold, ...updatedAvailable],
            stock: desiredCount
        };
    };

    const [metalRates, setMetalRates] = useState({
        goldPerGram: 0,
        goldPerMilligram: 0,
        silverPerGram: 0,
        silverPerMilligram: 0,
        gold10g: {
            k14: 0,
            k18: 0,
            k22: 0,
            k24: 0
        },
        silver10g: {
            sterling925: 0,
            silverOther: 0
        }
    });
    const [gstRate, setGstRate] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        productCode: '',
        description: '',
        stylingTips: '',
        cardLabel: '',
        cardBadge: '',
        huid: '',
        material: 'Silver',
        audience: ['unisex'],
        weight: '',
        weightUnit: 'Grams',
        specifications: '',
        supplierInfo: '',
        paymentGatewayChargeBearer: 'seller',
        diamondType: 'none',
        categories: [{ category: '' }],
        tags: {
            isNewArrival: false,
            isMostGifted: false,
            isNewLaunch: false
        },
        variants: [
            {
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
                metalPrice: 0,
                hiddenCharge: 0,
                subtotalBeforeTax: 0,
                gstAmount: 0,
                priceAfterTax: 0,
                pgChargePercent: 0,
                pgChargeAmount: 0,
                gst: 0,
                finalPrice: 0,
                variantCode: '',
                variantImages: [],
                variantFaqs: []
            }
        ],
        faqs: [],
        deletedImages: [],
        silverCategory: '', // New Field for silver purity
        goldCategory: '', // New Field for gold purity
        careTips: '', // New Field for caring tips
        videoUrl: '',
        isSerialized: true,
        productCodes: []
    });
    const pageTitle = isViewMode
        ? 'View Product'
        : (isEditMode
            ? 'Edit Product'
            : (isAdminMode ? 'Create Admin Product' : 'Create Seller Product'));
    const pageSubtitle = isViewMode
        ? `Viewing details for ${formData.name || id}`
        : (isEditMode
            ? `ID: ${id || 'N/A'}`
            : (isAdminMode
                ? 'Add a catalogue product with admin pricing and inventory controls'
                : 'Add a seller product with seller rates, global GST, and serialized inventory'));
    const primaryActionLabel = loading || isSaving
        ? (isEditMode ? 'Saving...' : (isAdminMode ? 'Creating...' : 'Publishing...'))
        : (isEditMode ? 'Save Changes' : (isAdminMode ? 'Create Product' : 'Publish Seller Product'));
    const successHeading = isAdminMode ? 'Catalogue Entry Created' : 'Artifact Registered';
    const successHeadingParts = successHeading.split(' ');
    const successHeadingLineOne = successHeadingParts.slice(0, -1).join(' ');
    const successHeadingLineTwo = successHeadingParts.slice(-1).join(' ');
    const successSubheading = isAdminMode ? 'Admin Product Registry' : 'Seller Catalogue Registry';
    const nextActionLabel = isAdminMode ? 'Create Another Product' : 'Manifest Next Item';
    const exitActionLabel = isAdminMode ? 'Back to Product Catalogue' : 'Exit to Repository';
    const variantWeightUnitOptions = [
        { label: 'Grams', value: 'Grams' },
        { label: 'Milligrams', value: 'Milligrams' }
    ];

    const resolvedProductApi = productApi;
    const resolvedMetalPricingApi = metalPricingApi;
    const isFamilyVideoFrameProduct = id === '69ef0e442cf9c0c98d8aab52';
    const familyVideoFramePreview = !removeVideo && isEditMode && isFamilyVideoFrameProduct && !videoPreview && !formData.videoUrl
        ? familyVideoFrame
        : '';
    const resolvedVideoPreview = videoPreview || familyVideoFramePreview;
    const isImageVideoPreview = Boolean(resolvedVideoPreview) && IMAGE_PREVIEW_RE.test(resolvedVideoPreview);

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
                // silent fallback to local GST
            }
        };
        loadPricing();
    }, []);

    // Clean up object URLs for selected local video files.
    useEffect(() => {
        return () => {
            if (videoPreview && String(videoPreview).startsWith('blob:')) {
                try { URL.revokeObjectURL(videoPreview); } catch (e) { /* noop */ }
            }
        };
    }, [videoPreview]);

    // Auto-generate Product Code Logic
    useEffect(() => {
        if (!isEditMode && formData.name.length >= 3 && !formData.productCode) {
            const prefix = formData.name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4);
            const random = Math.floor(Math.random() * 900 + 100); 
            setFormData(prev => ({ ...prev, productCode: `${prefix}${random}` }));
        }
    }, [formData.name, isEditMode, formData.productCode]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v => {
                const pricing = getPricingForVariant(v);
                return {
                    ...v,
                    mrp: pricing.finalPrice.toString(),
                    price: pricing.finalPrice.toString(),
                    metalPrice: pricing.metalPrice,
                    hiddenCharge: pricing.hiddenCharge,
                    subtotalBeforeTax: pricing.subtotalBeforeTax,
                    gstAmount: pricing.gstValue,
                    priceAfterTax: pricing.priceAfterTax,
                    pgChargePercent: pricing.pgChargePercent,
                    pgChargeAmount: pricing.pgChargeAmount,
                    gst: pricing.gstValue,
                    finalPrice: pricing.finalPrice
                };
            })
        }));
    }, [formData.material, formData.weight, formData.weightUnit, formData.paymentGatewayChargeBearer, gstRate, metalRates]);

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
                        _id,
                        id: legacyId,
                        image,
                        sellerId,
                        sku,
                        rating,
                        reviewCount,
                        createdAt,
                        updatedAt,
                        __v,
                        slug,
                        brand,
                        status,
                        active,
                        showInNavbar,
                        showInCollection,
                        ...restData
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
                                variantFaqs: Array.isArray(v.variantFaqs) ? v.variantFaqs : []
                            };
                        }) || prev.variants,
                        faqs: data.faqs || [],
                        deletedImages: [],
                        silverCategory: data.silverCategory || '',
                        goldCategory: data.goldCategory || '',
                        careTips: data.careTips || '',
                        videoUrl: data.videoUrl || '',
                        isSerialized: true,
                        productCodes: []
                    }));
                    if (data.images) {
                        setPreviewImages(data.images);
                    }
                    // Video is optional. Preview comes from backend URL (if any).
                    setVideoFile(null);
                    setRemoveVideo(false);
                    setVideoPreview(data.videoUrl || '');
                    setVariantImageFiles({});
                    setVariantImagePreviews({});
                }
            } catch (err) {
                toast.error("Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id, isEditMode, isViewMode]);

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

    const handleEnhancedUpload = (e) => {
        const file = e.target.files[0];
        if (!file || enhancingIndex === null) return;
        
        const preview = URL.createObjectURL(file);
        
        // Replace original image and file (if it was a new upload)
        setPreviewImages(prev => {
            const newPreviews = [...prev];
            newPreviews[enhancingIndex] = preview;
            return newPreviews;
        });

        // Determine if we need to update imageFiles
        const isNewFile = previewImages[enhancingIndex]?.startsWith('blob:');
        if (isNewFile) {
            const newFileIndex = previewImages.slice(0, enhancingIndex).filter(img => img.startsWith('blob:')).length;
            setImageFiles(prev => {
                const newFiles = [...prev];
                newFiles[newFileIndex] = file;
                return newFiles;
            });
        } else {
            // It was an existing image, we treat it like a new replacement
            setImageFiles(prev => [...prev, file]);
        }
        
        setEnhancedIndices(prev => new Set(prev).add(enhancingIndex));
        setShowEnhanceModal(false);
        setEnhancingIndex(null);
        toast.success("✅ Image enhanced successfully");
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
                        const pricing = getPricingForVariant(updated);
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
                variantFaqs: []
            }]
        }));
    };

    const removeVariant = (id) => {
        if (formData.variants.length <= 1) return;
        setVariantImageFiles((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        setVariantImagePreviews((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
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
                return syncVariantSerialQuantity(v, index, count);
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

    const handleCategoryChange = (value) => {
        setFormData(prev => ({ ...prev, categories: [{ category: value }] }));
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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.huid) newErrors.huid = "HUID (Hallmark Identity) is required";
        if (!formData.description) newErrors.description = "Description is required";
        if (!formData.categories?.[0]?.category) newErrors.categories = "Please select a category before publishing.";
        if (!formData.variants || formData.variants.length === 0) {
            newErrors.variants = "At least one variant is required";
        } else {
            formData.variants.forEach((v, i) => {
                if (!v.name) newErrors[`variant_${i}_name`] = "Variant name is required";
                if (v.weight === '' || v.weight === null || v.weight === undefined) {
                    newErrors[`variant_${i}_weight`] = "Variant weight is required";
                }
                if (!v.weightUnit) newErrors[`variant_${i}_weightUnit`] = "Weight unit is required";
                if (v.stock === '' || v.stock === null || v.stock === undefined) {
                    newErrors[`variant_${i}_stock`] = "Stock is required";
                }
            });
        }
        setErrors(newErrors);
        return { valid: Object.keys(newErrors).length === 0, errors: newErrors };
    };

    const getFirstError = (errs) => {
        const keys = Object.keys(errs || {});
        if (keys.length === 0) return "Please review the form fields and try again.";
        return errs[keys[0]];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = validateForm();
        if (!validation.valid) {
            toast.error(getFirstError(validation.errors));
            return;
        }

        const forbiddenKeys = [
            'image',
            '_id',
            'id',
            'sku',
            'sellerId',
            'rating',
            'reviewCount',
            'createdAt',
            'updatedAt',
            '__v',
            'slug',
            'brand',
            'status',
            'active',
            'showInNavbar',
            'showInCollection'
        ];
        const presentForbidden = forbiddenKeys.filter((key) => formData[key] !== undefined);
        if (presentForbidden.length > 0) {
            console.warn('[ProductEditor] Stripping read-only fields from payload:', presentForbidden);
        }

        setIsSaving(true);
        try {
            const productForm = new FormData();
            const excludes = [
                'variants',
                'categories',
                'tags',
                'deletedImages',
                'navShopByCategory',
                'audience',
                'faqs',
                'isSerialized',
                'productCodes',
                'videoUrl',
                'image',
                '_id',
                'id',
                'sku',
                'sellerId',
                'rating',
                'reviewCount',
                'createdAt',
                'updatedAt',
                '__v',
                'slug',
                'brand',
                'status',
                'active',
                'showInNavbar',
                'showInCollection'
            ];

            Object.keys(formData).forEach(key => {
                if (excludes.includes(key)) return;
                if (formData[key] !== undefined && formData[key] !== '') {
                    let value = formData[key];
                    if (key === 'weight') value = parseFloat(value) || 0;
                    productForm.append(key, value);
                }
            });

            productForm.append('categories', JSON.stringify([formData.categories[0].category]));
            productForm.append('audience', JSON.stringify(Array.isArray(formData.audience) && formData.audience.length > 0 ? formData.audience : ['unisex']));
            const normalizedVariants = formData.variants.map((variantItem) => {
                const serialCodes = normalizeSerialCodes(variantItem.serialCodes || []);
                const availableCount = serialCodes.filter(code => (code.status || 'AVAILABLE') === 'AVAILABLE').length;
                const variantImages = Array.isArray(variantItem.variantImages)
                    ? variantItem.variantImages.filter(img => typeof img === 'string' && img.trim() && !img.startsWith('blob:'))
                    : [];
                const variantFaqs = Array.isArray(variantItem.variantFaqs)
                    ? variantItem.variantFaqs.map((faq) => ({
                        question: String(faq.question || '').trim(),
                        answer: String(faq.answer || '').trim()
                    })).filter(faq => faq.question || faq.answer)
                    : [];
                return {
                    ...variantItem,
                    serialCodes,
                    stock: availableCount,
                    variantImages,
                    variantFaqs
                };
            });

            productForm.append('variants', JSON.stringify(normalizedVariants.map(({ id, _id, sold, ...rest }) => ({
                ...rest,
                makingCharge: parseFloat(rest.makingCharge) || 0,
                hallmarkingCharge: parseFloat(rest.hallmarkingCharge) || 0,
                diamondCertificateCharge: parseFloat(rest.diamondCertificateCharge) || 0,
                diamondPrice: parseFloat(rest.diamondPrice) || 0,
                hiddenCharge: parseFloat(rest.hiddenCharge) || 0,
                subtotalBeforeTax: parseFloat(rest.subtotalBeforeTax) || 0,
                gstAmount: parseFloat(rest.gstAmount) || 0,
                priceAfterTax: parseFloat(rest.priceAfterTax) || 0,
                pgChargePercent: parseFloat(rest.pgChargePercent) || 0,
                pgChargeAmount: parseFloat(rest.pgChargeAmount) || 0,
                mrp: parseFloat(rest.mrp) || 0,
                price: parseFloat(rest.price) || 0,
                stock: parseInt(rest.stock) || 0,
                discount: parseInt(rest.discount) || 0,
                serialCodes: rest.serialCodes
            }))));
            productForm.append('tags', JSON.stringify(formData.tags));
            productForm.append('faqs', JSON.stringify((formData.faqs || []).map(({ _id, ...rest }) => ({
                ...rest
            }))));
            productForm.append('deletedImages', JSON.stringify(formData.deletedImages || []));
            
            productForm.append('isSerialized', 'true');

            imageFiles.forEach(file => productForm.append('images', file));
            formData.variants.forEach((variantItem, index) => {
                const uploadFiles = variantImageFiles[variantItem.id] || [];
                uploadFiles.forEach((file) => productForm.append(`variantImages_${index}`, file));
            });

            if (removeVideo) {
                productForm.append('removeVideo', 'true');
            }
            if (videoFile) {
                productForm.append('video', videoFile);
            }

            if (isEditMode) {
                const res = await resolvedProductApi.updateProduct(id, productForm);
                if (res?.success === false) throw new Error(res?.message || "Update failed");
                toast.success("Product updated");
                navigate(backPath);
            } else {
                const res = await resolvedProductApi.createProduct(productForm);
                setCreatedProductData(res);
                setShowSuccessModal(true);
                toast.success("Product created");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || err?.message || "Failed to save product");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6 md:p-8">
                <PageHeader
                    title={pageTitle}
                    subtitle={pageSubtitle}
                    backPath={backPath}
                    action={!isViewMode ? {
                        label: primaryActionLabel,
                        onClick: handleSubmit,
                        disabled: loading || isSaving || !formData.categories?.[0]?.category
                    } : undefined}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-4 space-y-6">
                        <FormSection title="Images">
                            <div className="space-y-4">
                                <div className="rounded-xl border border-gray-100 bg-white p-3">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-600">Card Image Rules</p>
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Image 1 is the main card image. Image 2 (optional) is used for the hover effect. Upload at least 2 images to enable hover.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {previewImages.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            {idx === 0 && (
                                                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/70 text-white text-[9px] font-black uppercase tracking-widest">
                                                    Main
                                                </div>
                                            )}
                                            {idx === 1 && (
                                                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/70 text-white text-[9px] font-black uppercase tracking-widest">
                                                    Hover
                                                </div>
                                            )}
                                            {!isViewMode && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(idx)}
                                                    className="absolute top-2 right-2 p-1.5 bg-white text-gray-600 rounded-full shadow hover:text-red-500"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {!isViewMode && previewImages.length < 5 && (
                                        <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300">
                                            <Upload size={18} className="text-gray-400" />
                                            <span className="text-[10px] text-gray-400 uppercase font-bold mt-2">Upload</span>
                                            <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    )}
                                </div>

                                {/* AI Enhancement Controls */}
                                {!isViewMode && (
                                    <div className="pt-4 border-t border-gray-100 flex gap-2 w-full mt-2">
                                        <label className="flex-[5] py-3.5 bg-gray-50 border border-gray-200 text-[#3E2723] rounded-xl text-[9px] font-black uppercase tracking-widest text-center cursor-pointer hover:bg-white hover:border-[#3E2723] transition-all flex items-center justify-center gap-2">
                                            <Upload size={14} /> Upload Image
                                            <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                                        </label>

                                        {/* Quick affordance: when there is exactly 1 image, let admin/seller add the hover image explicitly. */}
                                        {previewImages.length === 1 && previewImages.length < 5 && (
                                            <label className="flex-[4] py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-center cursor-pointer hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                                <ImagePlus size={14} /> Upload Hover
                                                <input type="file" className="hidden" onChange={handleHoverImageUpload} accept="image/*" />
                                            </label>
                                        )}
                                        
                                        <div className="flex-[6] relative group">
                                            <button 
                                                type="button"
                                                disabled={previewImages.length === 0}
                                                onClick={() => {
                                                    setEnhancingIndex(0); // Default to first image
                                                    setShowEnhanceModal(true);
                                                }}
                                                className={`w-full py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border shadow-sm
                                                    ${previewImages.length > 0 
                                                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-600 hover:text-white hover:border-amber-600' 
                                                        : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Sparkles size={14} className={previewImages.length > 0 ? "animate-pulse" : ""} /> Enhance Image
                                            </button>
                                            
                                            {previewImages.length === 0 && (
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-widest">
                                                    Upload image first
                                                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {previewImages.length > 0 && enhancedIndices.size > 0 && (
                                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                            <span className="text-[8px] font-black text-emerald-800 uppercase tracking-widest">Images are AI-Enhanced</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </FormSection>

                        <FormSection title="Product Video (Optional)">
                            <div className="space-y-3">
                                {removeVideo ? (
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                                        <p className="text-xs font-semibold text-amber-900">Video will be removed after you save.</p>
                                        <p className="text-[11px] text-amber-800 mt-1">Upload a new video before saving to replace it.</p>
                                    </div>
                                ) : resolvedVideoPreview ? (
                                    <div className="rounded-lg overflow-hidden border border-gray-200 bg-black">
                                        {isImageVideoPreview ? (
                                            <img
                                                src={resolvedVideoPreview}
                                                alt="Product preview"
                                                className="w-full h-[220px] object-cover"
                                            />
                                        ) : (
                                            <video
                                                src={resolvedVideoPreview}
                                                controls
                                                playsInline
                                                className="w-full h-[220px] object-cover"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
                                        <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-widest">No video</p>
                                        <p className="text-[11px] text-gray-400 mt-2">Optional. Supported: mp4, mov, webm.</p>
                                    </div>
                                )}

                                {!isViewMode && (
                                    <div className="flex items-center gap-2">
                                        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer text-xs font-semibold">
                                            <Upload size={14} className="text-gray-500" />
                                            Upload Video
                                            <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                                        </label>
                                        {(videoPreview || formData.videoUrl) && !removeVideo && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveVideo}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700"
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </FormSection>

                        <FormSection title="Display Labels">
                            <Input
                                label="Card Label"
                                value={formData.cardLabel}
                                onChange={(e) => setFormData({ ...formData, cardLabel: e.target.value })}
                                disabled={isViewMode}
                            />
                            <Input
                                label="Card Badge"
                                value={formData.cardBadge}
                                onChange={(e) => setFormData({ ...formData, cardBadge: e.target.value })}
                                disabled={isViewMode}
                            />
                        </FormSection>

                        <FormSection title="Specifications">
                            <Select
                                label="Material"
                                value={formData.material}
                                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                options={[
                                    { label: 'Gold', value: 'Gold' },
                                    { label: 'Silver', value: 'Silver' }
                                ]}
                                disabled={isViewMode}
                            />
                            <Select
                                label="Diamond Type (Default)"
                                value={formData.diamondType || 'none'}
                                onChange={(e) => {
                                    const nextType = e.target.value;
                                    setFormData((prev) => ({
                                        ...prev,
                                        diamondType: nextType,
                                        // If a variant didn't explicitly choose a type, keep it in sync with the default.
                                        variants: (prev.variants || []).map((v) => {
                                            const vType = String(v?.diamondType || 'none').trim().toLowerCase();
                                            if (vType !== 'none') return v;
                                            return { ...v, diamondType: nextType };
                                        })
                                    }));
                                }}
                                options={[
                                    { label: 'No Diamonds', value: 'none' },
                                    { label: 'Lab Grown Diamonds', value: 'lab_grown' },
                                    { label: 'Natural / Mined Diamonds', value: 'natural' }
                                ]}
                                disabled={isViewMode}
                            />
                            <p className="text-[10px] text-gray-400 -mt-2">
                                Used by Product Details to show the correct diamond information. Variants can override this.
                            </p>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Audience</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {['unisex', 'men', 'women', 'family'].map((key) => {
                                        const checked = Array.isArray(formData.audience) && formData.audience.includes(key);
                                        return (
                                            <label key={key} className="flex items-center gap-2 text-xs text-gray-700">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    disabled={isViewMode}
                                                    onChange={(e) => {
                                                        const next = new Set(Array.isArray(formData.audience) ? formData.audience : []);
                                                        if (e.target.checked) next.add(key);
                                                        else next.delete(key);
                                                        const normalized = Array.from(next);
                                                        setFormData({ ...formData, audience: normalized.length > 0 ? normalized : ['unisex'] });
                                                    }}
                                                />
                                                <span className="capitalize">{key}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                                <p className="text-[10px] text-gray-400">
                                    Used to keep Men/Women pages clean. “Unisex” products can appear on both.
                                </p>
                            </div>
                            {formData.material === 'Silver' && (
                                <Select
                                    label="Silver Purity Categorization"
                                    value={formData.silverCategory}
                                    onChange={(e) => setFormData({ ...formData, silverCategory: e.target.value })}
                                    options={[
                                        { label: 'Select Purity', value: '' },
                                        { label: '800', value: '800' },
                                        { label: '835', value: '835' },
                                        { label: '925', value: '925' },
                                        { label: '925 Sterling Silver', value: '925 sterling silver' },
                                        { label: '958', value: '958' },
                                        { label: '970', value: '970' },
                                        { label: '990', value: '990' },
                                        { label: '999', value: '999' }
                                    ]}
                                    disabled={isViewMode}
                                />
                            )}
                            {formData.material === 'Gold' && (
                                <Select
                                    label="Gold Karat Categorization"
                                    value={formData.goldCategory}
                                    onChange={(e) => setFormData({ ...formData, goldCategory: e.target.value })}
                                    options={[
                                        { label: 'Select Karat', value: '' },
                                        { label: '14 Karat', value: '14' },
                                        { label: '18 Karat', value: '18' },
                                        { label: '22 Karat', value: '22' },
                                        { label: '24 Karat', value: '24' }
                                    ]}
                                    disabled={isViewMode}
                                />
                            )}
                            <Input
                                label="Default Variant Weight"
                                type="number"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                disabled={isViewMode}
                            />
                            <Select
                                label="Payment Gateway Charges Borne By"
                                value={formData.paymentGatewayChargeBearer || 'seller'}
                                onChange={(e) => setFormData({ ...formData, paymentGatewayChargeBearer: e.target.value })}
                                options={[
                                    { label: 'Seller / Admin', value: 'seller' },
                                    { label: 'User', value: 'user' }
                                ]}
                                disabled={isViewMode}
                            />
                            <p className="text-[10px] text-gray-400 -mt-2">
                                If user bears the payment gateway charge, an additional 2% is added after GST.
                            </p>
                            <Select
                                label="Default Weight Unit"
                                value={formData.weightUnit}
                                onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                                options={[
                                    { label: 'Grams', value: 'Grams' },
                                    { label: 'Milligrams', value: 'Milligrams' }
                                ]}
                                disabled={isViewMode}
                            />
                            <p className="text-[10px] text-gray-400 -mt-2">
                                Used as the fallback and default for new variants. Each variant can override its own weight below.
                            </p>
                            <TextArea
                                label="Specifications"
                                value={formData.specifications}
                                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                                disabled={isViewMode}
                            />
                            <TextArea
                                label="Supplier Info"
                                value={formData.supplierInfo}
                                onChange={(e) => setFormData({ ...formData, supplierInfo: e.target.value })}
                                disabled={isViewMode}
                            />
                        </FormSection>

                        {(isViewMode || createdProductData) && (
                            <FormSection title="Identity & Tracking">
                                <div className="space-y-6">
                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col items-center text-center">
                                         <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Unique Product Code</p>
                                         <div className="flex items-center gap-3">
                                             <span className="text-xl font-mono font-black text-[#3E2723] tracking-wider">
                                                 {formData.productCode || createdProductData?.productCode || 'GENERATING...'}
                                             </span>
                                             <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(formData.productCode || createdProductData?.productCode);
                                                    toast.success("Code copied");
                                                }}
                                                className="p-1.5 bg-white rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-100 transition-colors"
                                             >
                                                 <Copy size={14} />
                                             </button>
                                         </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                 <div className="flex items-center gap-2">
                                                     <BarcodeIcon className="w-4 h-4 text-gray-400" />
                                                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Barcode</span>
                                                 </div>
                                                 <button 
                                                    onClick={() => downloadImage(formData.barcode || createdProductData?.barcode, `barcode-${formData.productCode}.png`)}
                                                    className="p-2 text-[#3E2723] hover:bg-gray-50 rounded-xl border border-gray-100 transition-all flex items-center gap-2 group"
                                                 >
                                                     <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                                     <span className="text-[9px] font-black uppercase tracking-widest">Download</span>
                                                 </button>
                                            </div>
                                            <div className="aspect-[3/1] bg-white rounded-xl flex items-center justify-center p-3 border border-gray-200 overflow-hidden shadow-inner">
                                                 <Barcode 
                                                    value={formData.productCode || createdProductData?.productCode || 'N/A'} 
                                                    width={1.5} 
                                                    height={50} 
                                                    fontSize={12}
                                                 />
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                 <div className="flex items-center gap-2">
                                                     <QrCode className="w-4 h-4 text-gray-400" />
                                                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">QR Code</span>
                                                 </div>
                                                 <button 
                                                    onClick={() => downloadImage(formData.qrCode || createdProductData?.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${formData.productCode || createdProductData?.productCode}`, `qr-${formData.productCode}.png`)}
                                                    className="p-2 text-[#3E2723] hover:bg-gray-50 rounded-xl border border-gray-100 transition-all flex items-center gap-2 group"
                                                 >
                                                     <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                                     <span className="text-[9px] font-black uppercase tracking-widest">Download</span>
                                                 </button>
                                            </div>
                                            <div className="aspect-square w-32 mx-auto bg-gray-50 rounded-xl flex items-center justify-center p-3 border border-dashed border-gray-200 overflow-hidden">
                                                 {(formData.qrCode || createdProductData?.qrCode) ? (
                                                     <img 
                                                        src={formData.qrCode || createdProductData?.qrCode} 
                                                        alt="qr" 
                                                        className="w-full h-full object-contain" 
                                                        onError={(e) => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${formData.productCode || createdProductData?.productCode}`; }}
                                                     />
                                                 ) : (
                                                     <div className="flex flex-col items-center text-gray-300">
                                                        <Loader2 className="w-5 h-5 animate-spin mb-1" />
                                                        <span className="text-[8px] font-bold uppercase">Generating...</span>
                                                     </div>
                                                 )}
                                            </div>
                                            <p className="text-[9px] font-bold text-center text-gray-400 uppercase tracking-widest">Used for rapid terminal recognition</p>
                                        </div>
                                    </div>
                                </div>
                            </FormSection>
                        )}
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <FormSection title="Basic Information">
                            <Input
                                label="Product Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Stunning Silver Ring"
                                disabled={isViewMode}
                                error={errors.name}
                            />
                            <Input
                                label={<span>HUID (Hallmark Unique ID) <span className="text-red-500">*</span></span>}
                                value={formData.huid}
                                onChange={(e) => setFormData({ ...formData, huid: e.target.value.toUpperCase() })}
                                placeholder="e.g. ABC123"
                                disabled={isViewMode}
                                error={errors.huid}
                                className="font-mono tracking-widest"
                            />
                            <div className="pt-2">
                                <label className="text-[10px] font-black text-amber-600/60 uppercase tracking-[0.2em] ml-1 mb-2 block flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                                    System Identity Marker (Immutable)
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="text"
                                        value={formData.productCode}
                                        readOnly
                                        className="w-full bg-amber-50/20 border border-amber-100/50 rounded-2xl py-3 px-4 text-sm font-mono font-bold text-[#3E2723]/60 cursor-not-allowed outline-none uppercase tracking-[0.3em] transition-all"
                                        placeholder="PENDING..."
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">
                                        <BarcodeIcon size={14} className="text-[#3E2723]" />
                                    </div>
                                </div>
                                <div className="text-[8px] font-bold text-gray-400 mt-2 ml-1 uppercase tracking-widest italic flex items-center gap-1">
                                    <div className="w-0.5 h-3 bg-gray-200" />
                                    This signature is mathematically locked to the product registry.
                                </div>
                            </div>

                            <div className="space-y-2 mt-6">
                                <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                {errors.categories && <span className="text-[10px] text-red-500 font-bold">{errors.categories}</span>}
                                <select
                                    value={formData.categories?.[0]?.category || ''}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className={`w-full bg-white border rounded-lg py-2.5 px-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all shadow-sm ${errors.categories ? 'border-red-300 focus:border-red-400 focus:ring-red-200/40' : 'border-gray-300 focus:border-[#3E2723] focus:ring-[#3E2723]/10'}`}
                                    disabled={isViewMode}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id} disabled={cat.isActive === false}>
                                            {cat.name}{cat.isActive === false ? ' (Inactive)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </FormSection>

                        <FormSection title="Inventory Strategy">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                                            <BarcodeIcon size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Serialized Inventory</p>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Always enabled. Set quantities per variant below.</p>
                                        </div>
                                    </div>
                                    <div className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Locked</div>
                                </div>
                            </div>
                        </FormSection>

                        <FormSection title="Product Narrative & Styling">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-700 tracking-wide">Product Description</label>
                                    {errors.description && <span className="text-[10px] text-red-500 font-bold">{errors.description}</span>}
                                    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.description}
                                            onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                                            readOnly={isViewMode}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            style={{ height: '200px', marginBottom: '50px' }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-700 tracking-wide">Styling Tips</label>
                                    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.stylingTips}
                                            onChange={(value) => setFormData((prev) => ({ ...prev, stylingTips: value }))}
                                            readOnly={isViewMode}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            style={{ height: '150px', marginBottom: '50px' }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-semibold text-gray-700 tracking-wide">Caring Tips</label>
                                        {!isViewMode && (
                                            <button 
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, careTips: "<p><strong>Jewelry Care Guide:</strong></p><ul><li>Avoid direct contact with perfumes, lotions, and hairsprays.</li><li>Remove jewelry before swimming, bathing, or exercising.</li><li>Store in a cool, dry place, ideally in an airtight bag or box.</li><li>Clean occasionally with a soft, lint-free cloth to restore shine.</li></ul>" }))}
                                                className="text-[10px] font-bold text-[#3E2723] uppercase hover:underline"
                                            >
                                                Load Template
                                            </button>
                                        )}
                                    </div>
                                    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.careTips}
                                            onChange={(value) => setFormData((prev) => ({ ...prev, careTips: value }))}
                                            readOnly={isViewMode}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            style={{ height: '150px', marginBottom: '50px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </FormSection>
                        <FormSection title="Inventory Details">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Product Variants</h3>
                                {!isViewMode && (
                                    <button 
                                        type="button" 
                                        onClick={addVariant}
                                        className="flex items-center gap-2 text-[10px] font-black text-[#3E2723] uppercase tracking-widest hover:underline"
                                    >
                                        <Plus size={14} /> Add Variant
                                    </button>
                                )}
                            </div>
                            <div className="space-y-6">
                                {formData.variants.map((v, idx) => {
                                    const availableCount = getAvailableSerialCodes(v).length;
                                    const pricing = getPricingForVariant(v);
                                    return (
                                    <div key={v.id} className="flex flex-col gap-6 bg-[#FDFBF7] p-8 rounded-[2rem] border border-gray-100 group relative shadow-sm hover:shadow-md transition-all">
                                        {!isViewMode && formData.variants.length > 1 && (
                                            <button 
                                                type="button"
                                                onClick={() => removeVariant(v.id)} 
                                                className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        )}
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Variant Details</p>
                                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Step 1</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-6 gap-4 xl:gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Variant Name</label>
                                                <input 
                                                    value={v.name} 
                                                    onChange={(e) => handleVariantChange(v.id, 'name', e.target.value)} 
                                                    disabled={isViewMode} 
                                                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-800 outline-none focus:border-[#3E2723]/30 transition-all shadow-sm" 
                                                    placeholder="Standard" 
                                                />
                                                {errors[`variant_${idx}_name`] && <div className="text-[10px] text-red-500 mt-1 ml-1">{errors[`variant_${idx}_name`]}</div>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Diamond Type</label>
                                                <select
                                                    value={v.diamondType || formData.diamondType || 'none'}
                                                    onChange={(e) => handleVariantChange(v.id, 'diamondType', e.target.value)}
                                                    disabled={isViewMode}
                                                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-800 outline-none focus:border-[#3E2723]/30 transition-all shadow-sm"
                                                >
                                                    <option value="none">No Diamonds</option>
                                                    <option value="lab_grown">Lab Grown</option>
                                                    <option value="natural">Natural</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Variant Weight</label>
                                                <input
                                                    type="number"
                                                    value={v.weight ?? ''}
                                                    onChange={(e) => handleVariantChange(v.id, 'weight', e.target.value)}
                                                    disabled={isViewMode}
                                                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-800 outline-none focus:border-[#3E2723]/30 transition-all shadow-sm"
                                                    placeholder="0"
                                                />
                                                {errors[`variant_${idx}_weight`] && <div className="text-[10px] text-red-500 mt-1 ml-1">{errors[`variant_${idx}_weight`]}</div>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Weight Unit</label>
                                                <select
                                                    value={v.weightUnit || 'Grams'}
                                                    onChange={(e) => handleVariantChange(v.id, 'weightUnit', e.target.value)}
                                                    disabled={isViewMode}
                                                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-800 outline-none focus:border-[#3E2723]/30 transition-all shadow-sm"
                                                >
                                                    {variantWeightUnitOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                                {errors[`variant_${idx}_weightUnit`] && <div className="text-[10px] text-red-500 mt-1 ml-1">{errors[`variant_${idx}_weightUnit`]}</div>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Making Charge</label>
                                                <div className="relative group/field">
                                                    <input 
                                                        type="number" 
                                                        value={v.makingCharge} 
                                                        onChange={(e) => handleVariantChange(v.id, 'makingCharge', e.target.value)} 
                                                        disabled={isViewMode} 
                                                        className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-800 outline-none focus:border-[#3E2723]/30 transition-all shadow-sm" 
                                                        placeholder="0" 
                                                    />
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hallmarking Charge</label>
                                                <div className="relative group/field">
                                                    <input 
                                                        type="number" 
                                                        value={v.hallmarkingCharge ?? '0'} 
                                                        onChange={(e) => handleVariantChange(v.id, 'hallmarkingCharge', e.target.value)} 
                                                        disabled={isViewMode} 
                                                        className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-800 outline-none focus:border-[#3E2723]/30 transition-all shadow-sm" 
                                                        placeholder="0" 
                                                    />
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold group-focus-within/field:text-[#3E2723]">Rs</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Diamond Certificate Charge</label>
                                                <div className="relative group/field">
                                                    <input 
                                                        type="number" 
                                                        value={v.diamondCertificateCharge ?? '0'} 
                                                        onChange={(e) => handleVariantChange(v.id, 'diamondCertificateCharge', e.target.value)} 
                                                        disabled={isViewMode} 
                                                        className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-800 outline-none focus:border-[#3E2723]/30 transition-all shadow-sm" 
                                                        placeholder="0" 
                                                    />
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold group-focus-within/field:text-[#3E2723]">Rs</span>
                                                </div>
                                            </div>
                                        </div>
                                        </div>

                                        <div className="border-t border-gray-100/50 pt-8 space-y-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Pricing Breakdown</p>
                                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Step 2</p>
                                            </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 xl:gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Metal Price (Auto)</label>
                                                <div className="relative group/field">
                                                    <input 
                                                        type="number" 
                                                        value={pricing.metalPrice.toFixed(2)} 
                                                        readOnly
                                                        disabled={isViewMode} 
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-black text-gray-700 outline-none shadow-sm" 
                                                        placeholder="0" 
                                                    />
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hidden Charge (Auto)</label>
                                                <div className="relative group/field">
                                                    <input 
                                                        type="number" 
                                                        value={pricing.hiddenCharge.toFixed(2)} 
                                                        readOnly
                                                        disabled={isViewMode} 
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-700 outline-none shadow-sm" 
                                                        placeholder="0" 
                                                    />
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subtotal Before GST (Auto)</label>
                                                <div className="relative group/field">
                                                    <input 
                                                        type="number" 
                                                        value={pricing.subtotalBeforeTax.toFixed(2)} 
                                                        readOnly
                                                        disabled={isViewMode} 
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-700 outline-none shadow-sm" 
                                                        placeholder="0" 
                                                    />
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">GST ({Number(gstRate || 0)}% Auto)</label>
                                                <div className="relative group/field">
                                                    <input 
                                                        type="number" 
                                                        value={pricing.gstValue.toFixed(2)} 
                                                        readOnly
                                                        disabled={isViewMode} 
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-700 outline-none shadow-sm" 
                                                        placeholder="0" 
                                                    />
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price After GST (Auto)</label>
                                                <div className="relative group/field">
                                                    <input 
                                                        type="number" 
                                                        value={pricing.priceAfterTax.toFixed(2)} 
                                                        readOnly
                                                        disabled={isViewMode} 
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-700 outline-none shadow-sm" 
                                                        placeholder="0" 
                                                    />
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PG Charge ({pricing.pgChargePercent}% {String(formData.paymentGatewayChargeBearer || 'seller').toLowerCase() === 'user' ? 'User' : 'Seller'})</label>
                                                <div className="relative group/field">
                                                    <input 
                                                        type="number" 
                                                        value={pricing.pgChargeAmount.toFixed(2)} 
                                                        readOnly
                                                        disabled={isViewMode} 
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-700 outline-none shadow-sm" 
                                                        placeholder="0" 
                                                    />
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">Final Price (Calculated)</label>
                                                <div className="relative group/field">
                                                    <input 
                                                        type="number" 
                                                        value={v.mrp} 
                                                        readOnly
                                                        disabled={isViewMode} 
                                                        className="w-full bg-amber-50/20 border border-amber-100/30 rounded-2xl py-4 pl-12 pr-6 text-sm font-black text-[#3E2723] outline-none shadow-sm" 
                                                        placeholder="Final Price" 
                                                    />
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-600 font-bold">Rs</span>
                                                </div>
                                            </div>
                                        </div>
                                        </div>

                                        <div className="border-t border-gray-100/50 pt-8 space-y-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Inventory Sync</p>
                                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Step 3</p>
                                            </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Serialized Quantity</label>
                                                <input 
                                                    type="number" 
                                                    value={availableCount} 
                                                    onChange={(e) => updateVariantSerialQuantity(v.id, e.target.value)} 
                                                    disabled={isViewMode} 
                                                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-800 outline-none focus:border-[#3E2723]/30 transition-all shadow-sm" 
                                                    placeholder="0" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Units</label>
                                                <input 
                                                    type="number" 
                                                    value={availableCount} 
                                                    readOnly
                                                    disabled
                                                    className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-4 px-6 text-sm font-bold text-gray-700 outline-none shadow-sm cursor-not-allowed" 
                                                    placeholder="In Stock" 
                                                />
                                                {errors[`variant_${idx}_stock`] && <div className="text-[10px] text-red-500 mt-1 ml-1">{errors[`variant_${idx}_stock`]}</div>}
                                            </div>
                                        </div>
                                        </div>

                                        <div className="border-t border-gray-100/60 pt-8 space-y-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Identity & Barcode</p>
                                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Step 4</p>
                                            </div>
                                            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Variant Code</label>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            value={v.variantCode || 'Will be generated on save'}
                                                            readOnly
                                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-black text-gray-700 outline-none shadow-sm"
                                                        />
                                                        {(v.variantCode || '').trim() && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(v.variantCode);
                                                                    toast.success('Variant code copied');
                                                                }}
                                                                className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:text-[#3E2723] transition-all"
                                                            >
                                                                <Copy size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Variant Barcode Preview</label>
                                                    <div className="bg-white border border-gray-100 rounded-[1.5rem] px-4 py-5 shadow-sm min-h-[92px] flex items-center justify-center">
                                                        {(v.variantCode || '').trim() ? (
                                                            <Barcode
                                                                value={v.variantCode}
                                                                width={1.2}
                                                                height={34}
                                                                fontSize={10}
                                                                background="#ffffff"
                                                            />
                                                        ) : (
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available after first save</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Unit Barcodes</p>
                                                <div className="flex items-center gap-4">
                                                    {availableCount > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDownloadAllSerialBarcodes(v)}
                                                            className="text-[9px] font-black text-[#3E2723] uppercase hover:underline"
                                                        >
                                                            Download All
                                                        </button>
                                                    )}
                                                    {!isViewMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() => updateVariantSerialQuantity(v.id, Math.max(availableCount, 1))}
                                                            className="text-[9px] font-black text-blue-600 uppercase hover:underline"
                                                        >
                                                            Auto-Generate
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                                {(v.serialCodes || []).map((codeObj, codeIdx) => {
                                                    const serialStatus = codeObj.status || 'AVAILABLE';
                                                    const statusClasses = serialStatus === 'AVAILABLE'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        : (serialStatus === 'SOLD_ONLINE'
                                                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                            : 'bg-amber-50 text-amber-700 border-amber-100');

                                                    return (
                                                        <div
                                                            key={`${codeObj.code}-${codeIdx}`}
                                                            className="bg-white border border-amber-100 rounded-xl p-3 shadow-sm space-y-3"
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="min-w-0 flex-1 space-y-2">
                                                                    <input
                                                                        value={codeObj.code}
                                                                        onChange={(e) => {
                                                                            if (isViewMode || serialStatus !== 'AVAILABLE') return;
                                                                            const next = formData.variants.map((variantItem) => {
                                                                                if (variantItem.id !== v.id) return variantItem;
                                                                                const serialCodes = normalizeSerialCodes(variantItem.serialCodes || []);
                                                                                serialCodes[codeIdx] = { ...serialCodes[codeIdx], code: e.target.value.toUpperCase() };
                                                                                return { ...variantItem, serialCodes };
                                                                            });
                                                                            setFormData(prev => ({ ...prev, variants: next }));
                                                                        }}
                                                                        disabled={isViewMode || serialStatus !== 'AVAILABLE'}
                                                                        className="w-full bg-white border border-amber-100 rounded-lg py-2 px-3 text-[10px] font-mono font-black placeholder:text-gray-300 focus:outline-none focus:border-amber-500 transition-all disabled:bg-gray-100 disabled:text-gray-400"
                                                                    />
                                                                    <div className={`inline-flex items-center rounded-full border px-2 py-1 text-[8px] font-black uppercase tracking-widest ${statusClasses}`}>
                                                                        {serialStatus.replace('_', ' ')}
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDownloadSerialBarcode(codeObj.code)}
                                                                    className="shrink-0 p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#3E2723] transition-all"
                                                                    title="Download unit barcode"
                                                                >
                                                                    <Download size={14} />
                                                                </button>
                                                            </div>
                                                            <div
                                                                className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-3 overflow-hidden"
                                                                ref={(node) => setSerialBarcodeRef(codeObj.code, node)}
                                                            >
                                                                <Barcode
                                                                    value={codeObj.code}
                                                                    width={1}
                                                                    height={28}
                                                                    fontSize={9}
                                                                    margin={0}
                                                                    background="#f9fafb"
                                                                    renderer="svg"
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {(!v.serialCodes || v.serialCodes.length === 0) && (
                                                    <div className="text-xs text-gray-400 col-span-1 md:col-span-2">No unit codes generated yet.</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100/60 pt-8 space-y-6">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Variant Media & FAQs</p>
                                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Step 5</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Variant Images</p>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {Array.isArray(v.variantImages) && v.variantImages.length > 0
                                                            ? `${v.variantImages.length} selected`
                                                            : 'Using all product images'}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-3">
                                                    {!isViewMode && (
                                                        <label className="px-4 py-2 rounded-xl border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:border-[#3E2723] hover:text-[#3E2723] transition-all cursor-pointer">
                                                            Upload Variant Images
                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => handleVariantImageUpload(v.id, e.target.files)}
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                                {(variantImagePreviews[v.id] || []).length > 0 && (
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] text-gray-400">New variant uploads will be attached after save.</p>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                            {(variantImagePreviews[v.id] || []).map((img, previewIdx) => (
                                                                <div key={`${v.id}-upload-preview-${previewIdx}`} className="relative rounded-xl overflow-hidden border border-gray-200">
                                                                    <img src={img} alt="" className="w-full h-20 object-cover" />
                                                                    {!isViewMode && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveVariantUpload(v.id, previewIdx)}
                                                                            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 border border-gray-200 text-gray-600 hover:text-red-600 transition-all flex items-center justify-center shadow-sm"
                                                                            title="Remove uploaded variant image"
                                                                        >
                                                                            <X size={14} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {Array.isArray(v.variantImages) && v.variantImages.length > 0 && (
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] text-gray-400">Current saved variant images</p>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                            {v.variantImages.map((img, imageIdx) => (
                                                                <div key={`${v.id}-saved-variant-image-${imageIdx}`} className="relative rounded-xl overflow-hidden border border-gray-200">
                                                                    <img src={img} alt="" className="w-full h-20 object-cover" />
                                                                    {!isViewMode && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveSavedVariantImage(v.id, img)}
                                                                            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 border border-gray-200 text-gray-600 hover:text-red-600 transition-all flex items-center justify-center shadow-sm"
                                                                            title="Remove saved variant image"
                                                                        >
                                                                            <X size={14} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {Array.isArray(v.variantImages) && v.variantImages.length === 0 && (
                                                    <div className="text-xs text-gray-400">
                                                        This variant will automatically use the product-level images until you upload variant-specific ones.
                                                    </div>
                                                )}
                                                {previewImages.some(img => typeof img === 'string' && img.startsWith('blob:')) && (
                                                    <p className="text-[10px] text-gray-400">
                                                        Newly uploaded product images will appear after the product is saved. Variant uploads added here will save directly to this variant.
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Variant FAQs</p>
                                                    {!isViewMode && (
                                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                            <input
                                                                type="checkbox"
                                                                checked={Array.isArray(v.variantFaqs) && v.variantFaqs.length > 0}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        addVariantFaq(v.id);
                                                                    } else {
                                                                        clearVariantFaqOverride(v.id);
                                                                    }
                                                                }}
                                                            />
                                                            Override FAQs
                                                        </label>
                                                    )}
                                                </div>
                                                <div className="space-y-3">
                                                    {(v.variantFaqs || []).length > 0 ? (
                                                        <>
                                                            {(v.variantFaqs || []).map((faq, faqIndex) => (
                                                                <div key={`${v.id}-faq-${faqIndex}`} className="p-4 rounded-xl bg-white border border-gray-100 relative group">
                                                                    <Input
                                                                        label="Question"
                                                                        value={faq.question}
                                                                        onChange={(e) => handleVariantFaqChange(v.id, faqIndex, 'question', e.target.value)}
                                                                        placeholder="e.g. Is this variant heavier?"
                                                                        disabled={isViewMode}
                                                                    />
                                                                    <div className="space-y-1.5">
                                                                        <label className="block text-xs font-semibold text-gray-700 tracking-wide">Answer</label>
                                                                        <textarea
                                                                            value={faq.answer}
                                                                            onChange={(e) => handleVariantFaqChange(v.id, faqIndex, 'answer', e.target.value)}
                                                                            placeholder="Explain what makes this variant different."
                                                                            disabled={isViewMode}
                                                                            className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3.5 text-sm text-gray-900 focus:outline-none focus:border-[#3E2723] focus:ring-2 focus:ring-[#3E2723]/10 transition-all shadow-sm"
                                                                            rows={2}
                                                                        />
                                                                    </div>
                                                                    {!isViewMode && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeVariantFaq(v.id, faqIndex)}
                                                                            className="absolute -top-2 -right-2 p-1.5 bg-white text-gray-400 hover:text-red-500 border border-gray-200 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {!isViewMode && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addVariantFaq(v.id)}
                                                                    className="text-[10px] font-black text-[#3E2723] uppercase tracking-widest hover:underline"
                                                                >
                                                                    <Plus size={12} /> Add FAQ
                                                                </button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="text-xs text-gray-400">Using product FAQs.</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </FormSection>


                        <FormSection title="Product Questions (FAQ)">
                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    {!isViewMode && (
                                        <button
                                            type="button"
                                            onClick={addFaq}
                                            className="text-[10px] font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-1 hover:underline"
                                        >
                                            <Plus size={14} /> Add FAQ
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {(formData.faqs || []).map((faq, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200 relative group animate-in fade-in slide-in-from-top-2 space-y-3">
                                            <Input
                                                label="Question"
                                                value={faq.question}
                                                onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                                placeholder="e.g. Is it 925 silver?"
                                                disabled={isViewMode}
                                            />
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-semibold text-gray-700 tracking-wide">Answer</label>
                                                <textarea
                                                    value={faq.answer}
                                                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                                    placeholder="Yes, this is 925 hallmark silver."
                                                    disabled={isViewMode}
                                                    className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3.5 text-sm text-gray-900 focus:outline-none focus:border-[#3E2723] focus:ring-2 focus:ring-[#3E2723]/10 transition-all shadow-sm"
                                                    rows={2}
                                                />
                                            </div>
                                            {!isViewMode && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeFaq(index)}
                                                    className="absolute -top-2 -right-2 p-1.5 bg-white text-gray-400 hover:text-red-500 border border-gray-200 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {(formData.faqs || []).length === 0 && (
                                        <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                                            <p className="text-xs text-gray-400">No FAQs added yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FormSection>
                    </div>
                </div>

                {!isViewMode && (
                    <div className="mt-10 flex justify-end">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading || isSaving || !formData.categories?.[0]?.category}
                            className="px-6 py-3 rounded-xl bg-[#3E2723] text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                        >
                            {primaryActionLabel}
                        </button>
                    </div>
                )}
            </div>

            {/* AI Enhancement Modal */}
            {showEnhanceModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
                        <div className="bg-[#3E2723] p-8 text-white relative">
                            <div className="flex items-center gap-3 mb-2">
                                <Sparkles className="w-6 h-6 text-amber-400" />
                                <h2 className="text-2xl font-black uppercase tracking-tight">AI Image Enhancement</h2>
                            </div>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Unlock studio-quality visuals with Gemini</p>
                            <button 
                                onClick={() => setShowEnhanceModal(false)}
                                className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh]">
                            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
                                <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
                                    <img src={previewImages[enhancingIndex]} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Image</p>
                                    <p className="text-xs font-bold text-[#3E2723]">Processing Shot #{enhancingIndex + 1}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest">The Enhancement Workflow</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { icon: ExternalLink, text: "Click 'Open Gemini' below to open the AI Studio" },
                                        { icon: Upload, text: "Upload this product shot into the Gemini chat" },
                                        { icon: FileText, text: "Copy and paste our specialized prompt" },
                                        { icon: ImagePlus, text: "Download the enhanced result & upload it here" }
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                                                <step.icon size={12} className="text-amber-600" />
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-600 leading-relaxed">{step.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 bg-[#FDFBF7] p-5 rounded-2xl border border-[#EFEBE9]">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-[#8D6E63] uppercase tracking-[0.2em]">The Prompt</span>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(ENHANCEMENT_PROMPT);
                                            toast.success("Prompt copied to clipboard");
                                        }}
                                        className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase hover:underline"
                                    >
                                        <Copy size={10} /> Copy Prompt
                                    </button>
                                </div>
                                <p className="text-[11px] font-medium text-gray-500 italic leading-relaxed">
                                    "{ENHANCEMENT_PROMPT}"
                                </p>
                            </div>
                        </div>

                        <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                            <a 
                                href="https://gemini.google.com/" 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full py-4 bg-[#3E2723] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-900/20 hover:bg-black transition-all flex items-center justify-center gap-2 group text-center"
                            >
                                1. Open Gemini <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            
                            <label className="w-full py-4 bg-white border-2 border-dashed border-gray-200 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-amber-600 hover:text-amber-600 cursor-pointer transition-all flex items-center justify-center gap-2 group">
                                <ImagePlus size={14} /> 2. Upload Enhanced Product
                                <input type="file" className="hidden" onChange={handleEnhancedUpload} accept="image/*" />
                            </label>
                            
                            <button 
                                onClick={() => setShowEnhanceModal(false)}
                                className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Continue without enhancing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hyper-Premium Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0c0c0c]/90 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20 animate-in zoom-in-95 duration-500 flex flex-col md:flex-row">
                        
                        {/* Left Side: Visual Identity Card */}
                        <div className="md:w-1/2 bg-[#3E2723] p-10 flex flex-col justify-between relative overflow-hidden">
                             {/* Decorative Background Pattern */}
                             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                             <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                             
                             <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-6">
                                    <SuccessIcon className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-2 text-balance">
                                    {successHeadingLineOne} <br/> {successHeadingLineTwo}
                                </h3>
                                <p className="text-amber-200/60 text-[10px] font-black uppercase tracking-[0.2em]">{successSubheading}</p>
                             </div>

                             <div className="relative z-10 space-y-8 mt-12">
                                  <div className="space-y-2">
                                       <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Designator Matrix</p>
                                       <div className="flex items-center gap-3">
                                            <span className="text-3xl font-mono font-black text-amber-400 tracking-widest">
                                                {createdProductData?.productCode || 'GEN-XXXXX'}
                                            </span>
                                            <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(createdProductData?.productCode);
                                                    toast.success("Identity copied to clipboard");
                                                }}
                                                className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white border border-white/10"
                                            >
                                                <Copy size={16} />
                                            </button>
                                       </div>
                                  </div>

                                  <div className="p-6 bg-white rounded-3xl space-y-4 shadow-2xl">
                                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Biometric Scan (QR)</p>
                                       <div className="flex justify-center">
                                            <img 
                                                src={createdProductData?.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${createdProductData?.productCode}`} 
                                                alt="QR Registry" 
                                                className="w-32 h-32 object-contain"
                                                onError={(e) => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${createdProductData?.productCode}`; }}
                                            />
                                       </div>
                                  </div>
                             </div>
                        </div>

                        {/* Right Side: Actions & Barcode */}
                        <div className="md:w-1/2 p-10 flex flex-col justify-between bg-white">
                             <div className="space-y-8">
                                 <div>
                                     <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4">Master Specifications</p>
                                     <h2 className="text-2xl font-black text-gray-900 leading-tight uppercase line-clamp-2">{createdProductData?.name || 'Unknown Protocol'}</h2>
                                 </div>

                                 <div className="space-y-4">
                                     <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col items-center gap-4">
                                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Barcode Signature</p>
                                         <div className="w-full flex justify-center bg-white p-4 rounded-xl border border-gray-100 shadow-inner">
                                             <Barcode 
                                                value={createdProductData?.productCode || 'GEN-XXXXX'} 
                                                width={1.2} 
                                                height={40} 
                                                fontSize={10}
                                                background="#ffffff"
                                             />
                                         </div>
                                     </div>
                                     
                                     <div className="grid grid-cols-2 gap-3">
                                         <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                             <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Inventory</p>
                                             <p className="text-sm font-black text-gray-900">{createdProductData?.variants?.[0]?.stock || 0} Units</p>
                                         </div>
                                         <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                             <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Base Value</p>
                                             <p className="text-sm font-black text-emerald-600">₹{createdProductData?.variants?.[0]?.price || 0}</p>
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             <div className="space-y-3 mt-10">
                                 <button 
                                     onClick={() => {
                                         setShowSuccessModal(false);
                                         setCreatedProductData(null);
                                         if (isAdminMode) {
                                             navigate('/admin/products/new');
                                             return;
                                         }
                                         window.location.reload();
                                     }}
                                     className="w-full py-5 bg-[#3E2723] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-[#3E2723]/30 hover:bg-[#2D1B18] transition-all flex items-center justify-center gap-2 group"
                                 >
                                     <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                                     {nextActionLabel}
                                 </button>
                                 <button 
                                     onClick={() => navigate(backPath)}
                                     className="w-full py-4 text-gray-400 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:text-gray-900 transition-all"
                                 >
                                     {exitActionLabel}
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

