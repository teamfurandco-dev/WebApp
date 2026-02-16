import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturedPost = ({ post }) => {
    return (
        <Link to={`/blog/${post.slug || post.id}`} className="group relative block w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-white shadow-sm border border-black/5 hover:shadow-xl transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                {/* Image Side */}
                <div className="relative h-[200px] md:h-[300px] lg:h-[500px] overflow-hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 lg:bg-transparent" />
                </div>

                {/* Content Side */}
                <div className="p-4 md:p-6 lg:p-12 xl:p-16 flex flex-col justify-center items-start">
                    <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-medium uppercase tracking-wider text-black/40 mb-3 md:mb-5">
                        <span className="text-furco-brown">{post.category}</span>
                        <span className="w-1 h-1 rounded-full bg-black/20" />
                        <span>{post.date}</span>
                    </div>

                    <h2 className="text-lg md:text-2xl lg:text-4xl font-medium text-black mb-3 md:mb-5 leading-tight group-hover:text-furco-brown transition-colors line-clamp-3">
                        {post.title}
                    </h2>

                    <p className="text-black/60 text-sm md:text-base leading-relaxed mb-4 md:mb-6 line-clamp-2 md:line-clamp-none">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center gap-2 md:gap-3 mt-auto">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 overflow-hidden">
                            {post.author?.avatarUrl ? (
                                <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-black text-white font-medium text-xs md:text-sm">
                                    {post.author?.name?.charAt(0) || 'F'}
                                </div>
                            )}
                        </div>
                        <div className="text-xs md:text-sm">
                            <p className="font-medium text-black">{post.author?.name || 'Fur & Co'}</p>
                        </div>
                    </div>

                    <div className="mt-4 md:mt-6">
                        <Button className="bg-black text-white hover:bg-[#ffcc00] hover:text-black rounded-full px-4 md:px-8 h-9 md:h-10 text-xs md:text-sm transition-colors">
                            Read <ArrowRight className="ml-1 md:ml-2 w-3 md:w-4 h-3 md:h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default FeaturedPost;
