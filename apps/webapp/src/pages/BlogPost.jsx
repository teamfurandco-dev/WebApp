import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Facebook, Twitter, Linkedin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import { useTheme } from '@/context/ThemeContext';
import TipBox from '@/components/blog/TipBox';
import ProductInset from '@/components/blog/ProductInset';
import Newsletter from '@/components/blog/Newsletter';
import BlogCard from '@/components/blog/BlogCard';
import { useBlogPost } from '@/hooks/useQueries';

// Custom plugin to handle :::callout blocks
function calloutPlugin() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' &&
        node.name === 'callout'
      ) {
        node.data = {
          hName: 'div',
          hProperties: {
            className: 'my-12 rounded-2xl border border-furco-yellow-gold/40 bg-furco-yellow/10 px-8 py-8 shadow-sm relative overflow-hidden',
          },
        };
      }
    });
  };
}

const BlogPost = () => {
  const { slug } = useParams();
  const { switchMode } = useTheme();
  const { data: blogData, isLoading } = useBlogPost(slug);

  useEffect(() => {
    switchMode('GATEWAY');
    window.scrollTo(0, 0);
  }, [switchMode]);

  const blog = blogData?.blog;
  const relatedPosts = blogData?.relatedBlogs || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center space-y-4 px-4">
        <h1 className="text-xl md:text-2xl font-medium">Article not found</h1>
        <Link to="/blog" className="text-furco-brown hover:underline text-sm">Return to Journal</Link>
      </div>
    );
  }

  const coverImage = blog.coverImage || blog.coverImageUrl || blog.images?.[0]?.url || '/mockupImages/Blog.png';
  const displayDate = blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) :
    blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Draft';

  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* Full-width Hero */}
      <div className="relative h-[40vh] md:h-[60vh] lg:h-[70vh] w-full overflow-hidden">
        <img
          src={coverImage}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end pb-8 md:pb-16">
          <div className="container mx-auto px-3 md:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="flex items-center justify-center gap-2 md:gap-4 text-[10px] md:text-sm font-medium uppercase tracking-wider mb-3 md:mb-6">
                <span className="text-furco-yellow">{blog.category?.name || 'Uncategorized'}</span>
                <span className="w-1 h-1 bg-white/40 rounded-full" />
                <span>{displayDate}</span>
              </div>
              <h1 className="text-xl md:text-4xl lg:text-6xl font-medium leading-[1.15] mb-3 md:mb-6 drop-shadow-lg px-2">
                {blog.title}
              </h1>
              {blog.excerpt && (
                <p className="text-sm md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed hidden md:block">
                  {blog.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-3 md:px-8 py-10 md:py-16 lg:py-20">
        <div className="max-w-[720px] mx-auto">

          {/* Author & Meta */}
          <div className="flex items-center justify-between border-b border-black/10 pb-4 md:pb-8 mb-6 md:mb-10">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-200">
                {blog.author?.avatarUrl ? (
                  <img src={blog.author.avatarUrl} alt={blog.author.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black text-white font-medium text-sm">
                    {blog.author?.name?.charAt(0) || 'F'}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-black text-sm">Fur&Co</p>
                <p className="text-xs md:text-sm text-black/50">Editorial Team</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-black/50 text-xs md:text-sm">
              <Clock className="w-3 md:w-4 h-3 md:h-4" />
              {blog.readTime || '5 min read'}
            </div>
          </div>

          {/* Editorial Body */}
          <div className="prose prose-stone max-w-none 
            prose-headings:font-medium prose-headings:text-black
            prose-p:font-sans prose-p:text-black/80 prose-p:leading-[1.8]
            prose-strong:text-black
            prose-img:rounded-2xl md:prose-img:rounded-3xl prose-img:shadow-xl prose-img:my-8 md:prose-img:my-12
            mb-12 md:mb-20"
          >
            <ReactMarkdown
              remarkPlugins={[remarkDirective, calloutPlugin]}
              components={{
                h2: ({ node, ...props }) => <h2 className="text-xl md:text-3xl mt-12 md:mt-16 mb-4 md:mb-6 scroll-mt-24" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg md:text-2xl mt-10 md:mt-14 mb-3 md:mb-5 scroll-mt-24" {...props} />,
                p: ({ node, ...props }) => <p className="text-sm md:text-lg mb-6 md:mb-8 leading-[1.7] text-black/70" {...props} />,
                li: ({ node, ...props }) => <li className="text-sm md:text-lg mb-3 md:mb-4 leading-relaxed text-black/70" {...props} />,
                hr: ({ node, ...props }) => <hr className="my-10 md:my-14 border-0 h-[1px] bg-black/[0.06]" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-0 bg-furco-cream/40 px-4 md:px-8 py-6 md:py-8 rounded-xl md:rounded-2xl italic text-furco-brown text-base md:text-xl my-8 md:my-12" {...props} />
                )
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* Tags & Share */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-4 md:pt-8 border-t border-black/10 gap-4">
            <div className="flex gap-2 flex-wrap justify-center md:justify-start">
              {(blog.tags || []).map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-black/5 rounded-full text-[10px] md:text-xs font-medium uppercase tracking-wider text-black/60">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-black/40">Share</span>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-black/5 hover:bg-black hover:text-white transition-colors"><Facebook className="w-3.5 h-3.5" /></button>
                <button className="p-2 rounded-full bg-black/5 hover:bg-black hover:text-white transition-colors"><Twitter className="w-3.5 h-3.5" /></button>
                <button className="p-2 rounded-full bg-black/5 hover:bg-black hover:text-white transition-colors"><Linkedin className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>

        </div>
      </article>

      {/* Read Next */}
      {relatedPosts.length > 0 && (
        <section className="bg-white py-10 md:py-16 border-t border-black/5">
          <div className="container mx-auto px-3 md:px-8">
            <h3 className="text-lg md:text-2xl font-medium text-center mb-6 md:mb-10">Read Next</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {relatedPosts.map(post => (
                <BlogCard key={post.id} post={{
                  ...post,
                  image: post.coverImage || post.coverImageUrl || post.images?.[0]?.url || '/mockupImages/Blog.png',
                  category: post.category?.name || 'Uncategorized',
                  readTime: post.readTime || '5 min read'
                }} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Newsletter />
    </div>
  );
};

export default BlogPost;
