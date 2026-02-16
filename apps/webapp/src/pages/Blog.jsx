import { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCcw, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeaturedPost from '@/components/blog/FeaturedPost';
import BlogCard from '@/components/blog/BlogCard';
import Newsletter from '@/components/blog/Newsletter';
import { useTheme } from '@/context/ThemeContext';
import { useBlogList, useBlogCategories } from '@/hooks/useQueries';

const Blog = () => {
  const { switchMode } = useTheme();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: blogPageData, isLoading } = useBlogList(currentPage);
  const { data: categoriesData } = useBlogCategories();

  useEffect(() => {
    switchMode('GATEWAY');
    window.scrollTo(0, 0);
  }, [switchMode]);

  const blogs = blogPageData?.blogs || [];
  const categories = [{ id: 'all', name: 'All' }, ...(categoriesData || [])];

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
    <div className="min-h-screen bg-[#FDFBF7] pt-16 md:pt-24 pb-12 md:pb-20">
      <div className="container mx-auto px-3 md:px-8">

        {/* Header - Editorial Press Style */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16 lg:mb-24">
          <div className="flex flex-col items-center space-y-3 md:space-y-6">
            <span className="text-[9px] md:text-xs font-medium uppercase tracking-[0.3em] md:tracking-[0.4em] text-furco-brown bg-furco-brown/10 px-3 md:px-4 py-1 md:py-1.5 rounded-full">
              Editorial Press
            </span>
            <h1 className="text-2xl md:text-5xl lg:text-7xl font-peace-sans font-medium text-black tracking-tight leading-[1.1]">
              The Fur & Co <span className="text-furco-brown italic font-serif">Journal</span>
            </h1>
            <p className="text-sm md:text-xl text-black/60 max-w-2xl font-light leading-relaxed px-2 md:px-0">
              Curated stories, science-backed insights, and refined care for the discerning pet parent.
            </p>
          </div>

          {/* Search & Filter - Minimalist Integration */}
          <div className="flex flex-col items-center gap-6 md:gap-10 mt-8 md:mt-14">
            <div className="relative w-full max-w-lg group px-3 md:px-0">
              <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 group-focus-within:text-black/60 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full h-11 md:h-14 pl-10 md:pl-12 pr-4 md:pr-6 rounded-xl md:rounded-2xl bg-white border border-black/10 shadow-sm focus:border-furco-yellow focus:ring-0 focus:outline-none transition-all placeholder:text-black/30 text-sm md:text-base font-medium"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-2 md:px-0">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-medium uppercase tracking-wider transition-all duration-300 ${activeCategory === cat.name
                    ? "bg-black text-white shadow-md"
                    : "bg-white border border-black/5 text-black/40 hover:text-black hover:border-black/10 hover:bg-white"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12 md:py-20">
            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-8 md:mb-16">
                <FeaturedPost post={{
                  ...featuredPost,
                  image: featuredPost.coverImageUrl || featuredPost.images?.[0]?.url || '/mockupImages/Blog.png',
                  category: featuredPost.category?.name || 'Uncategorized',
                  date: featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Draft'
                }} />
              </div>
            )}

            {/* Post Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-x-8 lg:gap-y-12 mb-10 md:mb-16 lg:mb-20">
              {otherPosts.map(post => (
                <BlogCard key={post.id} post={{
                  ...post,
                  image: post.coverImageUrl || post.images?.[0]?.url || '/mockupImages/Blog.png',
                  category: post.category?.name || 'Uncategorized',
                  readTime: post.readTime || '5 min read'
                }} />
              ))}
            </div>

            {otherPosts.length === 0 && !featuredPost && (
              <div className="flex flex-col items-center justify-center pb-12 md:pb-20 pt-8 md:pt-12 text-center px-4">
                <div className="relative mb-8 md:mb-12">
                  <div className="absolute inset-0 bg-furco-yellow/20 blur-2xl md:blur-3xl rounded-full scale-150" />
                  <div className="relative w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-[3rem] shadow-lg flex items-center justify-center border border-black/5 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <PenTool className="w-6 h-6 md:w-10 md:h-10 text-furco-brown" />
                  </div>
                </div>

                <h3 className="text-xl md:text-3xl font-medium text-black mb-3 md:mb-4">
                  New Stories Coming Soon
                </h3>
                <p className="text-black/50 max-w-md mx-auto mb-6 md:mb-10 text-sm md:text-base">
                  Our editors are curating new content. Check back soon for quality insights.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
                  <Button
                    onClick={handleRefresh}
                    className="h-11 md:h-14 px-6 md:px-10 bg-black text-white hover:bg-furco-yellow hover:text-black rounded-xl md:rounded-2xl font-medium transition-all flex items-center justify-center gap-2 md:gap-3 group"
                  >
                    <RefreshCcw className="w-4 md:w-5 h-4 md:h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveCategory("All");
                      setSearchQuery("");
                    }}
                    className="h-11 md:h-14 px-6 md:px-10 rounded-xl md:rounded-2xl border-black/10 bg-white text-black font-medium hover:bg-black/5 transition-all"
                  >
                    Browse
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
