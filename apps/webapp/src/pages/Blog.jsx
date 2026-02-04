import { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCcw, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeaturedPost from '@/components/blog/FeaturedPost';
import BlogCard from '@/components/blog/BlogCard';
import Newsletter from '@/components/blog/Newsletter';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/services/api';

const Blog = () => {
  const { switchMode } = useTheme();
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    switchMode('GATEWAY');
    window.scrollTo(0, 0);

    const fetchData = async () => {
      setLoading(true);
      try {
        const [blogData, categoryData] = await Promise.all([
          api.getBlogs({ publishStatus: 'published' }),
          api.getBlogCategories()
        ]);

        setBlogs(blogData || []);
        setCategories([{ id: 'all', name: 'All' }, ...categoryData] || []);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [switchMode]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const blogData = await api.getBlogs({ publishStatus: 'published' });
      setBlogs(blogData || []);
    } catch (error) {
      console.error('Error refreshing blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    let result = blogs;

    if (activeCategory !== "All") {
      result = result.filter(blog => blog.category?.name === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(blog =>
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [blogs, activeCategory, searchQuery]);

  const featuredPost = blogs.find(blog => blog.isFeatured) || blogs[0];
  const otherPosts = filteredBlogs.filter(blog => blog.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-16 md:pt-20">
      <div className="container mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4 md:space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-furco-brown">Editorial</span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-peace-sans font-medium text-black">The Fur & Co Journal</h1>
          <p className="text-base md:text-lg text-black/60 font-medium">Stories, science, and care for the modern pet parent.</p>

          {/* Search & Filter */}
          <div className="flex flex-col items-center gap-6 md:gap-8 mt-6 md:mt-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full h-10 md:h-12 pl-10 pr-4 rounded-full bg-white border border-black/5 focus:border-black/20 focus:outline-none transition-all placeholder:text-black/30 text-sm md:text-base"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${activeCategory === cat.name
                    ? "bg-black text-white"
                    : "bg-white border border-black/5 text-black/60 hover:text-black hover:border-black/20"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-12 md:mb-20">
                <FeaturedPost post={{
                  ...featuredPost,
                  image: featuredPost.coverImageUrl || featuredPost.images?.[0]?.url || '/mockupImages/Blog.png',
                  category: featuredPost.category?.name || 'Uncategorized',
                  date: featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Draft'
                }} />
              </div>
            )}

            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-x-8 md:gap-y-16 mb-16 md:mb-24">
              {otherPosts.map(post => (
                <BlogCard key={post.id} post={{
                  ...post,
                  image: post.coverImageUrl || post.images?.[0]?.url || '/mockupImages/Blog.png',
                  category: post.category?.name || 'Uncategorized',
                  readTime: post.readTime || '5 min read' // Placeholder if not in schema
                }} />
              ))}
            </div>

            {otherPosts.length === 0 && !featuredPost && (
              <div className="flex flex-col items-center justify-center pb-24 md:pb-32 pt-8 md:pt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-furco-cream rounded-full flex items-center justify-center mb-8 border border-furco-yellow/20">
                  <PenTool className="w-10 h-10 md:w-12 md:h-12 text-furco-brown" />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-medium text-black mb-4 italic">The Journal is being updated</h3>
                <p className="text-black/50 max-w-sm mb-10 leading-relaxed">
                  Our editors are currently crafting new stories and science-backed insights for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleRefresh}
                    className="bg-black text-white hover:bg-furco-gold hover:text-black rounded-full px-8 h-12 transition-all flex items-center gap-2"
                  >
                    <RefreshCcw className="w-4 h-4" /> Refresh Journal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveCategory("All");
                      setSearchQuery("");
                    }}
                    className="rounded-full px-8 h-12 border-black/10 hover:border-black/30 hover:bg-white"
                  >
                    View All Categories
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

      </div>

      <Newsletter />
    </div>
  );
};

export default Blog;
