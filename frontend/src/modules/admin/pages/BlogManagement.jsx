import React, { useState } from 'react';
import {
    Plus, Search, Edit2, Trash2, Image as ImageIcon, X, Save, ArrowLeft, Calendar, FileText
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import PageHeader from '../components/common/PageHeader';

const BlogManagement = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Mock Data
    const [blogs, setBlogs] = useState([
        {
            id: 1,
            title: 'The Art of Layering Silver Necklaces',
            category: 'Style Guide',
            image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600',
            excerpt: 'Discover how to create the perfect layered look with our guide to mixing and matching silver chains.',
            content: '<p>Discover how to create the perfect layered look with our guide to mixing and matching silver chains and pendants.</p>',
            date: '2024-02-15',
            author: 'Admin'
        },
        {
            id: 2,
            title: 'Caring for Your Sterling Silver',
            category: 'Care Tips',
            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
            excerpt: 'Learn the essential tips to keep your silver jewelry shining bright for years to come.',
            content: '<p>Silver requires special care...</p>',
            date: '2024-02-10',
            author: 'Admin'
        }
    ]);

    const [formData, setFormData] = useState({
        id: null,
        title: '',
        category: '',
        image: '',
        excerpt: '',
        content: '',
        author: 'Admin'
    });

    // Categories
    const categories = ['Style Guide', 'Care Tips', 'New Collections', 'Trends', 'Behind the Scenes'];

    const handleEdit = (blog) => {
        setFormData(blog);
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            setBlogs(blogs.filter(blog => blog.id !== id));
        }
    };

    const handleAddNew = () => {
        setFormData({
            id: null,
            title: '',
            category: categories[0],
            image: '',
            excerpt: '',
            content: '',
            author: 'Admin'
        });
        setIsEditing(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const newBlog = {
            ...formData,
            id: formData.id || Date.now(),
            date: formData.id ? formData.date : new Date().toISOString().split('T')[0]
        };

        if (formData.id) {
            setBlogs(blogs.map(b => b.id === formData.id ? newBlog : b));
        } else {
            setBlogs([newBlog, ...blogs]);
        }
        setIsEditing(false);
    };

    // Quill Modules
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500 font-sans">
            {!isEditing ? (
                <>
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <PageHeader
                            title="Blog Management"
                            subtitle="Manage your blog posts, articles, and updates."
                        />
                        <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 px-6 py-3 bg-[#3E2723] text-white rounded-xl text-sm font-bold hover:bg-[#5D4037] transition-all shadow-lg active:scale-95"
                        >
                            <Plus size={18} />
                            Create New Post
                        </button>
                    </div>

                    {/* Stats/Filter Bar */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide pb-2 md:pb-0">
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === 'All' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                All Posts
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search blogs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#3E2723]/10 outline-none"
                            />
                        </div>
                    </div>

                    {/* Blog Feed */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBlogs.map(blog => (
                            <div key={blog.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                                {/* Image */}
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#3E2723]">
                                        {blog.category}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleEdit(blog)}
                                            className="p-2 bg-white rounded-full text-gray-900 shadow-lg hover:scale-110 transition-transform"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="p-2 bg-red-500 rounded-full text-white shadow-lg hover:scale-110 transition-transform"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 font-bold uppercase tracking-wider">
                                        <Calendar size={12} />
                                        <span>{blog.date}</span>
                                        <span>•</span>
                                        <span>{blog.author}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight font-serif">{blog.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{blog.excerpt}</p>

                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="w-full py-2.5 rounded-lg bg-gray-50 text-gray-900 text-xs font-bold hover:bg-[#3E2723] hover:text-white transition-colors"
                                    >
                                        Edit Content
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredBlogs.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No blogs found</h3>
                            <p className="text-gray-500 text-sm mt-1">Try changing filters or create a new post.</p>
                        </div>
                    )}
                </>
            ) : (
                /* Edit Form */
                <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 font-serif">
                                    {formData.id ? 'Edit Blog Post' : 'Create New Post'}
                                </h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                                    Fille in the details below
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#3E2723] hover:bg-[#5D4037] shadow-lg shadow-[#3E2723]/20 flex items-center gap-2"
                            >
                                <Save size={18} />
                                Save Post
                            </button>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Blog Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., The Ultimate Guide to Silver Jewelry"
                                    className="w-full p-4 bg-white border-2 border-gray-100 rounded-xl text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:border-[#3E2723] focus:ring-0 outline-none transition-all"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* Excerpt */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Short Excerpt</label>
                                <textarea
                                    rows="3"
                                    placeholder="Brief summary for the card view..."
                                    className="w-full p-4 bg-white border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:border-[#3E2723] focus:ring-0 outline-none transition-all resize-none"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                />
                            </div>

                            {/* Content Editor */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Full Content</label>
                                <div className="prose-admin">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        modules={modules}
                                        className="bg-white rounded-xl h-[400px] mb-12"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Category</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {categories.map(cat => (
                                        <label key={cat} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.category === cat ? 'border-[#3E2723] bg-[#3E2723]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <input
                                                type="radio"
                                                name="category"
                                                className="accent-[#3E2723] w-4 h-4"
                                                checked={formData.category === cat}
                                                onChange={() => setFormData({ ...formData, category: cat })}
                                            />
                                            <span className="text-sm font-bold text-gray-700">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Banner Image */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Banner Image</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors group">
                                    {formData.image ? (
                                        <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image: '' })}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="py-8 text-gray-400">
                                            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                            <p className="text-xs font-bold">No image selected</p>
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="Paste Image URL..."
                                        className="w-full p-3 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:border-[#3E2723] outline-none"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wide">
                                        Adding uploads soon
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            {/* Custom CSS for Quill similar to DynamicPageEditor */}
            <style>{`
                .ql-toolbar.ql-snow {
                    border-top-left-radius: 0.75rem;
                    border-top-right-radius: 0.75rem;
                    border-color: #f3f4f6;
                    border-width: 2px;
                    border-bottom: none;
                    background-color: #f9fafb;
                    padding: 12px;
                }
                .ql-container.ql-snow {
                    border-bottom-left-radius: 0.75rem;
                    border-bottom-right-radius: 0.75rem;
                    border-color: #f3f4f6;
                    border-width: 2px;
                    font-family: inherit;
                    font-size: 1rem;
                }
                .ql-editor {
                    min-height: 300px;
                    padding: 1.5rem;
                    color: #111827; /* Dark text */
                }
                .ql-editor.ql-blank::before {
                    color: #9ca3af;
                    font-style: normal;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
};

export default BlogManagement;
