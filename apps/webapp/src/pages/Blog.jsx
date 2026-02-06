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
          api.getBlogs(),
          api.getBlogCategories()
        ]);

        setBlogs(blogData || []);
        if (categoryData && Array.isArray(categoryData)) {
          setCategories([{ id: 'all', name: 'All' }, ...categoryData]);
        } else {
          setCategories([{ id: 'all', name: 'All' }]);
        }
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
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20 md:pt-32">
      <div className="container mx-auto px-4 md:px-8">

        {/* Header - Editorial Press Style */}
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
          <div className="flex flex-col items-center space-y-4 md:space-y-6">
            <span className="text-[10px] md:text-xs font-peace-sans font-bold uppercase tracking-[0.4em] text-furco-brown bg-furco-brown/10 px-4 py-1.5 rounded-full">
              Editorial Press
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-peace-sans font-bold text-black tracking-tight leading-[1.1]">
              The Fur & Co <span className="text-furco-brown italic font-serif">Journal</span>
            </h1>
            <p className="text-base md:text-xl text-black/60 max-w-2xl font-medium leading-relaxed">
              Curated stories, science-backed insights, and refined care for the discerning pet parent.
            </p>
          </div>

          {/* Search & Filter - Minimalist Integration */}
          <div className="flex flex-col items-center gap-8 md:gap-12 mt-12 md:mt-16">
            <div className="relative w-full max-w-lg group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 group-focus-within:text-black/60 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the archives..."
                className="w-full h-12 md:h-14 pl-12 pr-6 rounded-2xl bg-white border border-black/10 shadow-sm focus:border-furco-yellow focus:ring-0 focus:outline-none transition-all placeholder:text-black/30 text-sm md:text-lg font-medium"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-5 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeCategory === cat.name
                    ? "bg-black text-white shadow-lg scale-105"
                    : "bg-white border border-black/5 text-black/40 hover:text-black hover:border-black/10 hover:bg-white"
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
              <div className="flex flex-col items-center justify-center pb-32 md:pb-48 pt-12 md:pt-20 text-center">
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-furco-yellow/20 blur-3xl rounded-full scale-150" />
                  <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2rem] shadow-xl flex items-center justify-center border border-black/5 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <PenTool className="w-10 h-10 md:w-14 md:h-14 text-furco-brown" />
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-peace-sans font-bold text-black mb-6">
                  Archiving New Stories
                </h3>
                <p className="text-black/50 max-w-md mx-auto mb-12 text-base md:text-lg font-medium leading-relaxed">
                  Our editors are currently curating the next edition of the Journal. High-quality insights and stories take time to craft.
                </p>

                <div className="flex flex-col sm:flex-row gap-5">
                  <Button
                    onClick={handleRefresh}
                    className="h-14 px-10 bg-black text-white hover:bg-furco-yellow hover:text-black rounded-2xl font-bold shadow-xl transition-all duration-300 flex items-center gap-3 group"
                  >
                    <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Refresh Archives
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveCategory("All");
                      setSearchQuery("");
                    }}
                    className="h-14 px-10 rounded-2xl border-black/5 bg-white text-black font-bold hover:bg-black/5 transition-all"
                  >
                    Explore Categories
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
