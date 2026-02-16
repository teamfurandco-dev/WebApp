import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@fur-co/utils';

const BlogCard = ({ post, className }) => {
    return (
        <Link to={`/blog/${post.slug || post.id}`} className={cn("group flex flex-col h-full", className)}>
            {/* Image */}
            <div className="aspect-[3/2] overflow-hidden rounded-xl mb-3 md:mb-4 border border-black/5 bg-gray-100">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium uppercase tracking-wider text-black/40 mb-2 md:mb-3">
                    <span>{post.category}</span>
                    <span className="w-1 h-1 rounded-full bg-black/20" />
                    <span className="hidden sm:inline">{post.readTime}</span>
                </div>

                <h3 className="text-sm md:text-lg lg:text-xl font-medium text-black mb-2 group-hover:text-furco-brown transition-colors line-clamp-2">
                    {post.title}
                </h3>

                <p className="text-black/60 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2">
                    {post.excerpt}
                </p>

                <div className="mt-auto flex items-center gap-1 text-xs font-medium text-black border-b border-black/10 pb-0.5 self-start group-hover:border-black transition-all">
                    Read
                    <ArrowRight className="w-3 h-3 ml-0.5 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
