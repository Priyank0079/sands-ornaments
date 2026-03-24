import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ImagePlus, Save, X } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { FormSection, Input, Select, TextArea } from '../../components/common/FormControls';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const CategoryEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(isEditMode);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [errors, setErrors] = useState({});
    const [allCategories, setAllCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        metal: 'silver',
        sortOrder: 0,
        showInNavbar: true,
        showInCollection: true,
        isActive: true,
        deletedImages: []
    });

    useEffect(() => {
        const metalParam = searchParams.get('metal');
        if (metalParam && ['gold', 'silver'].includes(metalParam.toLowerCase())) {
            setFormData(prev => ({ ...prev, metal: metalParam.toLowerCase() }));
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const data = await adminService.getCategories();
                setAllCategories(data || []);
            } catch (err) {
                setAllCategories([]);
            }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        const loadCategory = async () => {
            if (!isEditMode) return;
            try {
                const data = await adminService.getCategoryById(id);
                if (data) {
                    setFormData(prev => ({
                        ...prev,
                        name: data.name || '',
                        slug: data.slug || '',
                        description: data.description || '',
                        metal: data.metal || 'silver',
                        sortOrder: data.sortOrder ?? 0,
                        showInNavbar: data.showInNavbar !== false,
                        showInCollection: data.showInCollection !== false,
                        isActive: data.isActive !== false,
                        deletedImages: []
                    }));
                    setPreviewImage(data.image || '');
                }
            } catch (err) {
                toast.error("Failed to load category");
            } finally {
                setLoading(false);
            }
        };
        loadCategory();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    useEffect(() => {
        if (!formData.name) {
            setFormData(prev => ({ ...prev, slug: '' }));
            return;
        }
        const generated = formData.name
            .trim()
            .toLowerCase()
            .replace(/['"]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setFormData(prev => ({ ...prev, slug: generated }));
    }, [formData.name]);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (previewImage && !previewImage.startsWith('blob:')) {
            setFormData(prev => ({ ...prev, deletedImages: [previewImage] }));
        }
        setPreviewImage('');
    };

    const validate = () => {
        const nextErrors = {};
        if (!formData.name.trim()) nextErrors.name = 'Category name is required';
        if (!formData.metal) nextErrors.metal = 'Metal type is required';
        if (formData.sortOrder === '' || formData.sortOrder === null || formData.sortOrder === undefined) {
            nextErrors.sortOrder = 'Sort order is required';
        }
        const orderValue = Number(formData.sortOrder);
        if (!Number.isNaN(orderValue)) {
            const duplicate = allCategories.find(cat => {
                const isSame = String(cat._id) === String(id);
                const catOrder = Number(cat.sortOrder ?? 0);
                return !isSame && catOrder === orderValue;
            });
            if (duplicate) {
                nextErrors.sortOrder = `Sort order already used by "${duplicate.name}"`;
            }
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fix the highlighted fields");
            return;
        }

        setLoading(true);
        const toastId = toast.loading(isEditMode ? "Updating category..." : "Creating category...");
        try {
            const data = new FormData();
            data.append('name', formData.name.trim());
            if (formData.slug?.trim()) data.append('slug', formData.slug.trim());
            data.append('description', formData.description || '');
            data.append('metal', formData.metal);
            data.append('sortOrder', Number(formData.sortOrder) || 0);
            data.append('showInNavbar', formData.showInNavbar);
            data.append('showInCollection', formData.showInCollection);
            data.append('isActive', formData.isActive);

            if (formData.deletedImages?.length) {
                data.append('deletedImages', JSON.stringify(formData.deletedImages));
            }

            if (imageFile) {
                data.append('image', imageFile);
            }

            const res = isEditMode
                ? await adminService.updateCategory(id, data)
                : await adminService.createCategory(data);

            if (res?.success) {
                toast.success(isEditMode ? "Category updated" : "Category created", { id: toastId });
                navigate('/admin/categories');
            } else {
                toast.error(res?.message || "Failed to save category", { id: toastId });
            }
        } catch (err) {
            toast.error("Failed to save category", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const metalOptions = useMemo(() => ([
        { label: 'Silver', value: 'silver' },
        { label: 'Gold', value: 'gold' }
    ]), []);

    if (loading) {
        return (
            <div className="p-20 text-center font-bold text-gray-400 animate-pulse tracking-widest uppercase">
                Loading Category...
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title={isEditMode ? "Edit Category" : "Create Category"}
                subtitle={isEditMode ? `Update category details` : "Add a new category to the catalog"}
            />

            <form onSubmit={handleSubmit} className="space-y-8">
                <FormSection title="Category Basics">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Category Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder="e.g. Rings"
                        />
                        <div className="hidden">
                            <Input
                                label="Slug"
                                name="slug"
                                value={formData.slug}
                                readOnly
                                placeholder="Auto-generated from name"
                            />
                        </div>
                        <Select
                            label="Metal"
                            name="metal"
                            value={formData.metal}
                            onChange={handleChange}
                            options={metalOptions}
                        />
                        <Input
                            label="Sort Order"
                            name="sortOrder"
                            type="number"
                            value={formData.sortOrder}
                            onChange={handleChange}
                            error={errors.sortOrder}
                            placeholder="0"
                        />
                    </div>
                    <TextArea
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Short category description"
                        rows={4}
                    />
                </FormSection>

                <FormSection title="Visibility & Status">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                            <input
                                type="checkbox"
                                name="showInNavbar"
                                checked={formData.showInNavbar}
                                onChange={handleChange}
                                className="h-4 w-4"
                            />
                            Show in Navbar
                        </label>
                        <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                            <input
                                type="checkbox"
                                name="showInCollection"
                                checked={formData.showInCollection}
                                onChange={handleChange}
                                className="h-4 w-4"
                            />
                            Show in Collection
                        </label>
                        <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="h-4 w-4"
                            />
                            Active Category
                        </label>
                    </div>
                </FormSection>

                <FormSection title="Category Image">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-full md:w-72 h-48 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <ImagePlus className="w-10 h-10 mx-auto mb-2" />
                                    <p className="text-xs font-semibold">Upload category image</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block text-xs text-gray-600"
                            />
                            {previewImage && (
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700"
                                >
                                    <X className="w-4 h-4" /> Remove Image
                                </button>
                            )}
                        </div>
                    </div>
                </FormSection>

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/categories')}
                        className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3E2723] text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#3E2723]/20 hover:bg-[#4A2F2A] transition-all"
                    >
                        <Save className="w-4 h-4" />
                        {isEditMode ? "Save Changes" : "Create Category"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryEditor;
