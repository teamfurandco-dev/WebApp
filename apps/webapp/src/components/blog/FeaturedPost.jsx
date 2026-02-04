import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturedPost = ({ post }) => {
    return (
        <Link to={`/blog/${post.slug || post.id}`} className="group relative block w-full rounded-[2.5rem] overflow-hidden bg-white shadow-sm border border-black/5 hover:shadow-xl transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                {/* Image Side */}
                <div className="relative h-[300px] md:h-[400px] lg:h-[600px] overflow-hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 lg:bg-transparent" />
                </div>

                {/* Content Side */}
                <div className="p-6 md:p-8 lg:p-16 flex flex-col justify-center items-start">
                    <div className="flex items-center gap-3 text-xs md:text-sm font-bold uppercase tracking-widest text-black/40 mb-6">
                        <span className="text-furco-brown">{post.category}</span>
                        <span className="w-1 h-1 rounded-full bg-black/20" />
                        <span>{post.date}</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl lg:text-5xl font-serif font-medium text-black mb-4 md:mb-6 leading-tight group-hover:text-furco-brown transition-colors">
                        {post.title}
                    </h2>

                    <p className="text-black/60 text-base md:text-lg leading-relaxed mb-6 md:mb-8 max-w-xl">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 mt-auto">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                {post.author?.avatarUrl ? (
                                    <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-black text-white font-bold">
                                        {post.author?.name?.charAt(0) || 'F'}
                                    </div>
                                )}
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-black">{post.author?.name || 'Fur & Co'}</p>
                                <p className="text-black/40">{post.readTime || '5 min read'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 md:mt-8">
                        <Button className="bg-black text-white hover:bg-furco-gold hover:text-black rounded-full px-8 transition-colors">
                            Read Story <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default FeaturedPost;
