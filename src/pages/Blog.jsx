import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import FeaturedPost from '@/components/blog/FeaturedPost';
import BlogCard from '@/components/blog/BlogCard';
import Newsletter from '@/components/blog/Newsletter';
import { useTheme } from '@/context/ThemeContext';

// Mock Data
const BLOG_POSTS = [
  {
    id: 1,
    title: "Why Your Dog Needs a Gut Reset: The Science of Probiotics",
    excerpt: "Digestion is the cornerstone of health. Learn how simple dietary changes can improve mood, energy, and longevity.",
    category: "Nutrition",
    image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1000&auto=format&fit=crop",
    readTime: "5 min read",
    author: { name: "Dr. Sarah Miller", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    date: "Oct 12, 2025"
  },
  {
    id: 2,
    title: "Apartment Living: Enrichment Tips for Indoor Cats",
    excerpt: "Small space? No problem. Discover vertical territory hacks and puzzle toys that keep your feline friend mentally sharp.",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop",
    readTime: "4 min read",
    author: { name: "Rahul Kapoor", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    date: "Oct 08, 2025"
  },
  {
    id: 3,
    title: "Understanding Separation Anxiety in Rescue Dogs",
    excerpt: "Patience is key. A behavioral expert shares a step-by-step guide to building confidence and trust.",
    category: "Behavior",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop",
    readTime: "7 min read",
    author: { name: "Dr. Sarah Miller", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    date: "Sep 28, 2025"
  },
  {
    id: 4,
    title: "The Ultimate Guide to Sustainable Pet Care",
    excerpt: "From biodegradable poop bags to ethically sourced treats, here is how to reduce your pawprint.",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop",
    readTime: "6 min read",
    author: { name: "Emma Wilson", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
    date: "Sep 15, 2025"
  }
];

const CATEGORIES = ["All", "Nutrition", "Behavior", "Lifestyle", "Sustainability", "Wellness"];

const Blog = () => {
  const { switchMode } = useTheme();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    switchMode('GATEWAY');
    window.scrollTo(0, 0);
  }, [switchMode]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-16 md:pt-20">
      <div className="container mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4 md:space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-furco-brown">Editorial</span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-black">The Fur & Co Journal</h1>
          <p className="text-base md:text-lg text-black/60 font-medium">Stories, science, and care for the modern pet parent.</p>

          {/* Search & Filter */}
          <div className="flex flex-col items-center gap-6 md:gap-8 mt-6 md:mt-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full h-10 md:h-12 pl-10 pr-4 rounded-full bg-white border border-black/5 focus:border-black/20 focus:outline-none transition-all placeholder:text-black/30 text-sm md:text-base"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${activeCategory === cat
                      ? "bg-black text-white"
                      : "bg-white border border-black/5 text-black/60 hover:text-black hover:border-black/20"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-12 md:mb-20">
          <FeaturedPost post={BLOG_POSTS[0]} />
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-x-8 md:gap-y-16 mb-16 md:mb-24">
          {BLOG_POSTS.slice(1).map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
          {/* Repeating for grid density visual */}
          {BLOG_POSTS.slice(1).map(post => (
            <BlogCard key={`dup-${post.id}`} post={{ ...post, id: `dup-${post.id}` }} />
          ))}
        </div>

      </div>

      <Newsletter />
    </div>
  );
};

export default Blog;
