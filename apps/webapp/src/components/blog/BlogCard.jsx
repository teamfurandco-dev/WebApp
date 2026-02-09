import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@fur-co/utils';

const BlogCard = ({ post, className }) => {
    return (
        <Link to={`/blog/${post.slug || post.id}`} className={cn("group flex flex-col h-full", className)}>
            {/* Image */}
            <div className="aspect-[3/2] overflow-hidden rounded-xl md:rounded-2xl mb-4 md:mb-5 border border-black/5 bg-gray-100">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-black/40 mb-3">
                    <span>{post.category}</span>
                    <span className="w-1 h-1 rounded-full bg-black/20" />
                    <span>{post.readTime}</span>
                </div>

                <h3 className="text-lg md:text-xl lg:text-2xl font-medium text-black mb-2 md:mb-3 group-hover:text-furco-brown transition-colors">
                    {post.title}
                </h3>

                <p className="text-black/60 text-sm md:text-base leading-relaxed mb-4 md:mb-6 line-clamp-3">
                    {post.excerpt}
                </p>

                <div className="mt-auto flex items-center gap-2 text-sm font-bold text-black border-b border-black/20 pb-1 self-start group-hover:border-black transition-all">
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
