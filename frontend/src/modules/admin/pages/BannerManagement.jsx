import React, { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Eye, EyeOff, Calendar, Edit3, X, MoveVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/common/PageHeader';
import { adminService } from '../services/adminService';

const createEmptyForm = () => ({
  title: '',
  subtitle: '',
  link: '/shop',
  sortOrder: 0,
  isActive: true,
  validFrom: '',
  validUntil: '',
  image: null,
  imagePreview: '',
  currentImage: '',
});

const formatDateInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [formData, setFormData] = useState(createEmptyForm());

  const fetchBanners = async () => {
    setLoading(true);
    const data = await adminService.getBanners();
    setBanners(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const sortedBanners = useMemo(
    () => [...banners].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    [banners]
  );

  const activeCount = banners.filter((banner) => banner.isActive).length;

  const openCreateModal = () => {
    setEditingBannerId(null);
    setFormData(createEmptyForm());
    setIsModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBannerId(banner._id);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      link: banner.link || '/shop',
      sortOrder: Number.isFinite(Number(banner.sortOrder)) ? Number(banner.sortOrder) : 0,
      isActive: banner.isActive !== false,
      validFrom: formatDateInput(banner.validFrom),
      validUntil: formatDateInput(banner.validUntil),
      image: null,
      imagePreview: '',
      currentImage: banner.image || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBannerId(null);
    setFormData(createEmptyForm());
  };

  const handleImageChange = (file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: preview,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Banner title is required';
    if (!formData.image && !formData.currentImage) return 'Banner image is required';
    if (formData.validFrom && formData.validUntil && formData.validUntil < formData.validFrom) {
      return 'End date must be after start date';
    }
    return null;
  };

  const buildPayload = () => {
    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('subtitle', formData.subtitle.trim());
    payload.append('link', formData.link.trim());
    payload.append('sortOrder', String(Number(formData.sortOrder) || 0));
    payload.append('isActive', String(Boolean(formData.isActive)));
    payload.append('validFrom', formData.validFrom || '');
    payload.append('validUntil', formData.validUntil || '');
    if (formData.image) payload.append('image', formData.image);
    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(true);
    const payload = buildPayload();
    const result = editingBannerId
      ? await adminService.updateBanner(editingBannerId, payload)
      : await adminService.createBanner(payload);

    if (result.success) {
      toast.success(result.message || `Banner ${editingBannerId ? 'updated' : 'created'} successfully`);
      await fetchBanners();
      closeModal();
    } else {
      toast.error(result.message || 'Unable to save banner');
    }
    setSaving(false);
  };

  const handleToggleActive = async (banner) => {
    const payload = new FormData();
    payload.append('title', banner.title || '');
    payload.append('subtitle', banner.subtitle || '');
    payload.append('link', banner.link || '');
    payload.append('sortOrder', String(Number(banner.sortOrder) || 0));
    payload.append('isActive', String(!banner.isActive));
    payload.append('validFrom', formatDateInput(banner.validFrom) || '');
    payload.append('validUntil', formatDateInput(banner.validUntil) || '');

    const result = await adminService.updateBanner(banner._id, payload);
    if (result.success) {
      toast.success(result.message || 'Banner status updated');
      await fetchBanners();
    } else {
      toast.error(result.message || 'Failed to update banner status');
    }
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm('Delete this homepage banner?')) return;
    const result = await adminService.deleteBanner(bannerId);
    if (result.success) {
      toast.success(result.message || 'Banner deleted');
      await fetchBanners();
    } else {
      toast.error(result.message || 'Failed to delete banner');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 md:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <PageHeader
          title="Banner Management"
          subtitle="Manage the live homepage hero banners shown on the user storefront"
        />
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3E2723] text-white rounded-lg text-sm font-bold hover:bg-[#5D4037] transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Total Banners</p>
          <p className="text-3xl font-black text-gray-900 mt-3">{banners.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Active On Homepage</p>
          <p className="text-3xl font-black text-emerald-600 mt-3">{activeCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Placement</p>
          <p className="text-lg font-bold text-gray-900 mt-3">Home Hero Slider</p>
          <p className="text-sm text-gray-500 mt-1">Route: `/`</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Hero Banners</h2>
            <p className="text-sm text-gray-500">These banners rotate at the top of the user homepage.</p>
          </div>
        </div>

        {loading ? (
          <div className="p-10 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#3E2723] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sortedBanners.length === 0 ? (
          <div className="p-10 text-center">
            <ImageIcon className="w-10 h-10 mx-auto text-gray-300" />
            <p className="mt-4 text-lg font-semibold text-gray-800">No banners added yet</p>
            <p className="mt-1 text-sm text-gray-500">Create a banner to power the homepage hero slider.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
            {sortedBanners.map((banner) => (
              <div key={banner._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group">
                <div className="aspect-[21/9] relative overflow-hidden bg-gray-100 border-b border-gray-100">
                  <img
                    src={banner.image}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${banner.isActive ? '' : 'grayscale opacity-60'}`}
                    alt={banner.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent flex items-center p-5 md:p-8">
                    <div className="max-w-[70%] space-y-2">
                      <div className="inline-flex items-center gap-2 text-white/90 text-[10px] uppercase tracking-[0.2em] font-bold">
                        <MoveVertical className="w-3 h-3" />
                        Order {banner.sortOrder ?? 0}
                      </div>
                      <h3 className="text-white text-lg md:text-2xl font-black leading-tight line-clamp-2">{banner.title}</h3>
                      <p className="text-white/80 text-xs md:text-sm line-clamp-2">{banner.subtitle || 'No subtitle added'}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-md ${banner.isActive ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-gray-500 border-gray-200'}`}>
                      {banner.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">CTA Link</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800 break-all">{banner.link || '/shop'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Schedule</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {banner.validFrom ? formatDateInput(banner.validFrom) : 'Now'} to {banner.validUntil ? formatDateInput(banner.validUntil) : 'No end date'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-5">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className="flex-1 md:flex-none p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white text-gray-600 hover:text-[#3E2723] transition-all flex items-center justify-center"
                      title={banner.isActive ? 'Hide banner' : 'Show banner'}
                    >
                      {banner.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => openEditModal(banner)}
                      className="flex-1 md:flex-none p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white text-gray-600 hover:text-[#3E2723] transition-all flex items-center justify-center"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="flex-1 md:flex-none p-2.5 rounded-xl border border-red-100 bg-red-50 hover:bg-red-600 text-red-500 hover:text-white transition-all flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FDFBF7]">
              <div>
                <h3 className="text-xl font-bold text-black">{editingBannerId ? 'Edit Banner' : 'Add Banner'}</h3>
                <p className="text-sm text-gray-500 mt-1">This updates the live homepage hero slider.</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-black uppercase tracking-[0.2em]">Banner Image</label>
                  <div className="w-full aspect-[21/9] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden relative group flex items-center justify-center">
                    {formData.imagePreview || formData.currentImage ? (
                      <>
                        <img
                          src={formData.imagePreview || formData.currentImage}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, image: null, imagePreview: '', currentImage: '' }))}
                          className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center px-6">
                        <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="mt-3 text-sm font-semibold text-gray-700">Upload the homepage banner image</p>
                        <p className="mt-1 text-xs text-gray-500">Recommended: wide hero image</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(event) => handleImageChange(event.target.files?.[0])}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-black uppercase tracking-[0.2em]">Banner Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#3E2723]/10"
                    placeholder="e.g. Minimalist Grace Every Day"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-black uppercase tracking-[0.2em]">Subtitle</label>
                  <textarea
                    rows="4"
                    value={formData.subtitle}
                    onChange={(event) => setFormData((prev) => ({ ...prev, subtitle: event.target.value }))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#3E2723]/10 resize-none"
                    placeholder="Short supporting copy for the homepage hero"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-black uppercase tracking-[0.2em]">CTA Link</label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(event) => setFormData((prev) => ({ ...prev, link: event.target.value }))}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#3E2723]/10"
                      placeholder="/shop"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-black uppercase tracking-[0.2em]">Sort Order</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sortOrder}
                      onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#3E2723]/10"
                    />
                  </div>
                </div>

                <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F5F0EB] space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-black uppercase tracking-[0.2em]">
                    <Calendar className="w-4 h-4" />
                    Visibility Schedule
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold text-black">Start Date</label>
                      <input
                        type="date"
                        value={formData.validFrom}
                        onChange={(event) => setFormData((prev) => ({ ...prev, validFrom: event.target.value }))}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold text-black">End Date</label>
                      <input
                        type="date"
                        value={formData.validUntil}
                        onChange={(event) => setFormData((prev) => ({ ...prev, validUntil: event.target.value }))}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl cursor-pointer bg-white">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(event) => setFormData((prev) => ({ ...prev, isActive: event.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-[#3E2723] focus:ring-[#3E2723]"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Show on homepage</p>
                    <p className="text-xs text-gray-500">Turn this off to hide the banner without deleting it.</p>
                  </div>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-4 bg-[#3E2723] text-white rounded-xl text-sm font-bold shadow-xl hover:bg-[#5D4037] transition-all disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : editingBannerId ? 'Update Banner' : 'Create Banner'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;
