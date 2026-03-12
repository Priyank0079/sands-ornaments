import React, { useState } from 'react';
import { ArrowLeft, Clock, Search, Calendar, User, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const BlogsPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data - Matching structure from ContentManagement (Admin)
    const blogs = [
        {
            id: 1,
            title: 'The Art of Layering Silver Necklaces',
            image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600',
            description: 'Discover how to create the perfect layered look with our guide to mixing and matching silver chains and pendants.',
            content: 'Layering necklaces is more than just a trend; it is an art form that allows you to express your individual style and personality. Start with a simple base chain, like a delicate snake or box chain, sitting close to the neck. Add a pendant necklace of medium length to create a focal point. Finally, finish with a longer chain or a lariat to elongate the torso. Mixing textures and weights can add depth, while sticking to a single metal keeps the look cohesive. Do not be afraid to mix vintage pieces with modern designs for a truly unique statement.',
            date: '2024-01-15',
            author: 'Sands Editorial'
        },
        {
            id: 2,
            title: 'Caring for Your Sterling Silver',
            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
            description: 'Learn the essential tips and tricks to keep your 925 Sterling Silver jewellery shining bright for years to come.',
            content: 'Sterling silver is a beautiful and durable metal, but it does require some care to maintain its luster. Tarnish is a natural reaction to sulfur in the air, but it can be easily managed. Store your silver in a cool, dry place, preferably in tarnish-preventive bags. Avoid exposing your jewellery to household chemicals, engaging in water sports, or sunbathing while wearing it. For cleaning, use a soft polishing cloth specifically designed for silver. If your pieces are heavily tarnished, a gentle wash with mild soap and warm water can help, but always dry them thoroughly immediately after.',
            date: '2024-02-01',
            author: 'Care Team'
        },
        {
            id: 3,
            title: 'Understanding Hallmarks: What is 925?',
            image: 'https://images.unsplash.com/photo-1576014131795-d4c5c91f94d9?auto=format&fit=crop&q=80&w=600',
            description: 'Dive deep into the world of silver purity. We explain what the 925 hallmark means, why it matters, and how to verify authenticity.',
            content: 'If you have ever looked closely at a piece of silver jewellery, you might have seen the number "925" stamped on it. This is the hallmark for Sterling Silver. Pure silver (999) is too soft for everyday wear, so it is alloyed with other metals to increase its strength. The "925" indicates that the piece is 92.5% pure silver and 7.5% other metals, usually copper. This alloy provides the perfect balance of luster and durability. Always check for this hallmark to ensure you are buying authentic, high-quality silver that will stand the test of time.',
            date: '2024-02-10',
            author: 'Silver Expert'
        },
        {
            id: 4,
            title: 'Top 5 Trends for Spring 2024',
            image: 'https://images.unsplash.com/photo-1630019852942-e5b121fb1154?auto=format&fit=crop&q=80&w=600',
            description: 'Get ahead of the curve with our rundown of the must-have silver jewellery trends for the upcoming spring season.',
            content: 'Spring 2024 is all about nature-inspired designs and bold statements. Floral motifs are making a huge comeback, with intricate flower pendants and leaf-patterned bracelets taking center stage. Minimalist geometric shapes are also trending for those who prefer a sleeker look. Chunky silver hoops are a versatile staple that pairs well with any outfit. Another rising trend is personalized jewellery, from initial necklaces to engraved signet rings. Finally, mixed metal stacking rings offer a playful way to add variety to your daily look.',
            date: '2024-02-20',
            author: 'Fashion Desk'
        }
    ];

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FDF5F6] font-sans pb-20 selection:bg-[#D39A9F] selection:text-white">
            {/* Header Removed as per request */}
            <div className="pt-8 md:pt-12"></div>

            {/* Blogs Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8">
                {filteredBlogs.length > 0 ? (
                    <div className="flex flex-col gap-12 md:gap-20">
                        {filteredBlogs.map((blog, idx) => (
                            <article
                                key={blog.id}
                                className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center animate-in fade-in slide-in-from-bottom-4 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Image Side */}
                                <div className="w-full md:w-1/2 group cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl shadow-sm">
                                    <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden relative bg-gray-100">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-black shadow-sm">
                                            {blog.date}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                                    <h2 className="text-xl md:text-2xl font-display font-bold text-black mb-3 leading-tight">
                                        {blog.title}
                                    </h2>

                                    <p className="text-base text-black font-medium mb-4 leading-relaxed">
                                        {blog.description}
                                    </p>

                                    <div className="text-sm text-black leading-relaxed text-justify opacity-90">
                                        {blog.content}
                                    </div>
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
                )
                }
            </div>
        </div>
    );
};

export default BlogsPage;
