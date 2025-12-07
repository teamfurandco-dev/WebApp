import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const posts = [
    {
      id: 1,
      title: "5 Tips for a Healthy Dog Diet",
      excerpt: "Learn what nutrients your dog needs to stay active and happy. Nutrition is the foundation of a happy life.",
      date: "Oct 25, 2023",
      category: "Nutrition",
      image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Understanding Cat Behavior",
      excerpt: "Why does your cat do that? We decode common feline behaviors to help you bond better with your pet.",
      date: "Nov 02, 2023",
      category: "Behavior",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Top 10 Toys for Active Pets",
      excerpt: "Keep your pet entertained for hours with these durable toys designed for high-energy play.",
      date: "Nov 10, 2023",
      category: "Toys",
      image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "The Ultimate Guide to Puppy Training",
      excerpt: "Start off on the right paw with these essential training tips for your new family member.",
      date: "Nov 15, 2023",
      category: "Training",
      image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Winter Care for Your Furry Friends",
      excerpt: "How to keep your pets safe, warm, and comfortable during the colder months.",
      date: "Nov 20, 2023",
      category: "Wellness",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "DIY Pet Treats: Simple & Healthy",
      excerpt: "Whip up these easy, nutritious treats in your own kitchen. Your pet will love them!",
      date: "Nov 25, 2023",
      category: "Food",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                    <Badge className="absolute top-4 left-4 bg-furco-yellow text-black hover:bg-furco-yellow border-none px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md z-20">
                      {post.category}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="text-sm font-bold text-black/40 mb-3 uppercase tracking-wider">{post.date}</div>
                    <h3 className="text-2xl font-serif font-bold text-black mb-3 leading-tight group-hover:text-furco-gold transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-black/60 line-clamp-3 mb-6 font-sans leading-relaxed">
                      {post.excerpt}
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
