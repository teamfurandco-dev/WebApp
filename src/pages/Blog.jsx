import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { format } from 'date-fns';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await api.getBlogs();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-12 h-12 animate-spin text-furco-yellow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-black mb-4">The Fur & Co Blog</h1>
            <p className="text-xl text-black/60 font-light max-w-2xl mx-auto">
              Tips, tricks, and tales for pet lovers. Discover expert advice and heartwarming stories.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-full max-w-md"
          >
            <Input 
              type="text" 
              placeholder="Search articles..." 
              className="pl-12 pr-4 py-6 rounded-full border-2 border-black/10 bg-white text-lg focus-visible:ring-0 focus-visible:border-black transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-furco-yellow rounded-full flex items-center justify-center">
              <Search className="w-3 h-3 text-black" />
            </div>
          </motion.div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link to={`/blog/${post.id}`}>
                <Card className="h-full overflow-hidden group border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white rounded-[2rem] relative">
                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-furco-yellow rounded-[2rem] transition-colors duration-500 z-10 pointer-events-none" />
                  
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={post.featured_image || post.image || 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop'} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                    {post.category && (
                      <Badge className="absolute top-4 left-4 bg-furco-yellow text-black hover:bg-furco-yellow border-none px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md z-20">
                        {post.category}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="text-sm font-bold text-black/40 mb-3 uppercase tracking-wider">
                      {post.published_at ? format(new Date(post.published_at), 'MMM dd, yyyy') : 'Draft'}
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-black mb-3 leading-tight group-hover:text-furco-gold transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-black/60 line-clamp-3 mb-6 font-sans leading-relaxed">
                      {post.excerpt || post.content?.substring(0, 150) + '...'}
                    </p>
                    
                    <div className="mt-auto pt-4 flex items-center text-black font-bold group-hover:text-furco-yellow transition-colors">
                      <span className="mr-2">Read Article</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-serif font-bold text-black/40">No articles found.</h3>
            <Button 
              variant="link" 
              onClick={() => setSearchQuery('')}
              className="text-furco-yellow hover:text-black mt-2"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
