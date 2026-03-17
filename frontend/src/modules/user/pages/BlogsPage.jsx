import React, { useState, useEffect } from 'react';
import { Search, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

const BlogsPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await api.get('public/blogs');
                setBlogs(res.data.data.blogs || []);
            } catch (err) {
                console.error("Fetch blogs failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#FDF5F6] font-sans pb-20 selection:bg-[#D39A9F] selection:text-white">
            {/* Header Removed as per request */}
            <div className="pt-8 md:pt-12"></div>

            {/* Blogs Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D39A9F] mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading articles...</p>
                    </div>
                ) : filteredBlogs.length > 0 ? (
                    <div className="flex flex-col gap-12 md:gap-20">
                        {filteredBlogs.map((blog, idx) => (
                            <article
                                key={blog._id}
                                className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center animate-in fade-in slide-in-from-bottom-4 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Image Side */}
                                <div className="w-full md:w-1/2 group cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl shadow-sm">
                                    <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden relative bg-gray-100">
                                        <img
                                            src={blog.coverImage || 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600'}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-black shadow-sm">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                                    <h2 className="text-xl md:text-2xl font-display font-bold text-black mb-3 leading-tight">
                                        {blog.title}
                                    </h2>

                                    {blog.excerpt && (
                                        <p className="text-base text-black font-medium mb-4 leading-relaxed">
                                            {blog.excerpt}
                                        </p>
                                    )}

                                    <div 
                                        className="text-sm text-black leading-relaxed text-justify opacity-90 prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: blog.content }}
                                    />
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">No articles found</h3>
                        <p className="text-gray-500">Try searching for something else.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogsPage;
