import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "5 Tips for a Healthy Dog Diet",
      excerpt: "Learn what nutrients your dog needs to stay active and happy.",
      date: "Oct 25, 2023",
      category: "Nutrition",
      image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Understanding Cat Behavior",
      excerpt: "Why does your cat do that? We decode common feline behaviors.",
      date: "Nov 02, 2023",
      category: "Behavior",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Top 10 Toys for Active Pets",
      excerpt: "Keep your pet entertained for hours with these durable toys.",
      date: "Nov 10, 2023",
      category: "Toys",
      image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-furco-black">The Fur & Co Blog</h1>
        <p className="text-xl text-muted-foreground mt-4">Tips, tricks, and tales for pet lovers.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-secondary/20 relative">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              <Badge className="absolute top-4 left-4 bg-white text-black hover:bg-white">{post.category}</Badge>
            </div>
            <CardHeader>
              <div className="text-sm text-muted-foreground mb-2">{post.date}</div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="p-0 h-auto text-primary">Read Article</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blog;
