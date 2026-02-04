import { useState, useEffect } from 'react';
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
import { api } from '@/services/api';

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
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    switchMode('GATEWAY');
    window.scrollTo(0, 0);

    const fetchBlog = async () => {
      setLoading(true);
      try {
        const data = await api.getBlogBySlug(slug);
        if (data) {
          setBlog(data);
          // Fetch related posts from same category
          const related = await api.getBlogs({
            categoryId: data.categoryId,
            limit: 4,
            publishStatus: 'published'
          });
          setRelatedPosts(related.filter(p => p.id !== data.id).slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, switchMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link to="/blog" className="text-furco-brown hover:underline">Return to Journal</Link>
      </div>
    );
  }

  const coverImage = blog.coverImageUrl || blog.images?.[0]?.url || '/mockupImages/Blog.png';
  const displayDate = blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) :
    blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Draft';

  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* Full-width Hero */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <img
          src={coverImage}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end pb-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-widest mb-6">
                <span className="text-furco-yellow">{blog.category?.name || 'Uncategorized'}</span>
                <span className="w-1 h-1 bg-white/40 rounded-full" />
                <span>{displayDate}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium leading-[1.1] mb-6 drop-shadow-lg">
                {blog.title}
              </h1>
              {blog.excerpt && (
                <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
                  {blog.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 md:px-8 py-20">
        <div className="max-w-[720px] mx-auto">

          {/* Author & Meta */}
          <div className="flex items-center justify-between border-b border-black/10 pb-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {blog.author?.avatarUrl ? (
                  <img src={blog.author.avatarUrl} alt={blog.author.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black text-white font-bold">
                    {blog.author?.name?.charAt(0) || 'F'}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-black">Fur&Co</p>
                <p className="text-sm text-black/50">Editorial Team</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-black/50 text-sm">
              <Clock className="w-4 h-4" />
              {blog.readTime || '5 min read'}
            </div>
          </div>

          {/* Editorial Body */}
          <div className="prose prose-stone max-w-none 
            prose-headings:font-serif prose-headings:font-medium prose-headings:text-black
            prose-p:font-sans prose-p:text-black/80 prose-p:leading-[1.8]
            prose-strong:text-black prose-strong:font-bold
            prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-16
            mb-24"
          >
            <ReactMarkdown
              remarkPlugins={[remarkDirective, calloutPlugin]}
              components={{
                h2: ({ node, ...props }) => <h2 className="text-3xl md:text-4xl font-serif mt-20 mb-8 scroll-mt-24" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-2xl md:text-3xl font-serif mt-16 mb-6 scroll-mt-24" {...props} />,
                p: ({ node, ...props }) => <p className="text-lg md:text-xl font-sans mb-10 leading-[1.8] tracking-tight text-black/70" {...props} />,
                li: ({ node, ...props }) => <li className="text-lg md:text-xl font-sans mb-6 leading-relaxed text-black/70" {...props} />,
                hr: ({ node, ...props }) => <hr className="my-16 border-0 h-[1px] bg-black/[0.06]" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-0 bg-furco-cream/40 px-10 py-10 rounded-[2rem] italic text-furco-brown font-serif text-2xl my-16 shadow-inner" {...props} />
                )
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* Tags & Share */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-black/10 gap-6">
            <div className="flex gap-2 flex-wrap">
              {(blog.tags || []).map(tag => (
                <span key={tag} className="px-3 py-1 bg-black/5 rounded-full text-xs font-bold uppercase tracking-wider text-black/60">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-black/40">Share</span>
              <div className="flex gap-3">
                <button className="p-2 rounded-full bg-black/5 hover:bg-black hover:text-white transition-colors"><Facebook className="w-4 h-4" /></button>
                <button className="p-2 rounded-full bg-black/5 hover:bg-black hover:text-white transition-colors"><Twitter className="w-4 h-4" /></button>
                <button className="p-2 rounded-full bg-black/5 hover:bg-black hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

        </div>
      </article>

      {/* Read Next */}
      {relatedPosts.length > 0 && (
        <section className="bg-white py-20 border-t border-black/5">
          <div className="container mx-auto px-4 md:px-8">
            <h3 className="text-3xl font-serif font-medium text-center mb-12">Read Next</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(post => (
                <BlogCard key={post.id} post={{
                  ...post,
                  image: post.coverImageUrl || post.images?.[0]?.url || '/mockupImages/Blog.png',
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
