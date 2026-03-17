import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import api from '../../../services/api';

const DynamicPage = ({ slug: propSlug }) => {
    const { slug: paramSlug } = useParams();
    const slug = propSlug || paramSlug;
    const navigate = useNavigate();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            try {
                const res = await api.get(`public/pages/${slug}`);
                if (res.data.success) {
                    setPage(res.data.data.page);
                }
            } catch (err) {
                console.error("Fetch page failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF5F6]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E2723]"></div>
                <p className="mt-4 text-gray-500 font-medium">Loading...</p>
            </div>
        );
    }

    if (!page) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF5F6] text-center px-4">
                <h1 className="text-4xl font-display text-black mb-4">Page Not Found</h1>
                <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
                <button 
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-[#3E2723] text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#5D4037] transition-all"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDF5F6] selection:bg-[#3E2723] selection:text-white pb-20">
            <div className="container mx-auto px-4 max-w-4xl pt-12 md:pt-20">
                {/* Back Link */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-black/40 hover:text-black transition-all group font-bold uppercase tracking-widest text-[10px] mb-8"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                {/* Header */}
                <div className="text-center mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-5xl md:text-7xl font-display text-black mb-6 leading-tight">
                        {page.title}
                    </h1>
                    <div className="w-24 h-0.5 bg-[#3E2723]/10 mx-auto mb-6"></div>
                    <div className="flex items-center justify-center gap-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black/30">
                        <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>Last updated {new Date(page.lastUpdated).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-sm border border-[#3E2723]/5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div 
                        className="prose prose-lg prose-stone max-w-none 
                        prose-headings:font-display prose-headings:text-black 
                        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:font-serif
                        prose-li:text-gray-600 prose-li:font-serif
                        prose-strong:text-black prose-strong:font-bold"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DynamicPage;
