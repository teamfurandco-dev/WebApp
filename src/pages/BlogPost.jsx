import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import TipBox from '@/components/blog/TipBox';
import ProductInset from '@/components/blog/ProductInset';
import Newsletter from '@/components/blog/Newsletter';
import BlogCard from '@/components/blog/BlogCard';

// Reuse mock logic just for display
const MOCK_ARTICLE = {
  title: "Why Your Dog Needs a Gut Reset: The Science of Probiotics",
  subtitle: "Digestion is the cornerstone of health. Learn how simple dietary changes can improve mood, energy, and longevity.",
  category: "Nutrition",
  readTime: "5 min read",
  date: "Oct 12, 2025",
  author: { name: "Dr. Sarah Miller", avatar: "https://randomuser.me/api/portraits/women/44.jpg", role: "Veterinarian & Nutritionist" },
  image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=2000&auto=format&fit=crop"
};

const RECOMMENDED_PRODUCT = {
  name: "Daily Gut Balance",
  price: "₹850",
  rating: "4.9",
  description: "Our vet-formulated blend of prebiotics and probiotics designed specifically for canine digestive health.",
  image: "https://images.unsplash.com/photo-1585837575652-267c041d77d4?q=80&w=1000&auto=format&fit=crop",
  link: "/product/daily-gut-balance"
};

const BlogPost = () => {
  const { id } = useParams();
  const { switchMode } = useTheme();

  useEffect(() => {
    switchMode('GATEWAY');
    window.scrollTo(0, 0);
  }, [id, switchMode]);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* Full-width Hero */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <img
          src={MOCK_ARTICLE.image}
          alt={MOCK_ARTICLE.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end pb-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-widest mb-6">
                <span className="text-furco-yellow">{MOCK_ARTICLE.category}</span>
                <span className="w-1 h-1 bg-white/40 rounded-full" />
                <span>{MOCK_ARTICLE.date}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium leading-[1.1] mb-6 drop-shadow-lg">
                {MOCK_ARTICLE.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
                {MOCK_ARTICLE.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 md:px-8 py-20">
        <div className="max-w-2xl mx-auto">

          {/* Author & Meta */}
          <div className="flex items-center justify-between border-b border-black/10 pb-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <img src={MOCK_ARTICLE.author.avatar} alt={MOCK_ARTICLE.author.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-black">{MOCK_ARTICLE.author.name}</p>
                <p className="text-sm text-black/50">{MOCK_ARTICLE.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-black/50 text-sm">
              <Clock className="w-4 h-4" />
              {MOCK_ARTICLE.readTime}
            </div>
          </div>

          {/* Editorial Body */}
          <div className="prose prose-lg prose-headings:font-serif prose-p:font-sans prose-p:leading-8 text-black/80 mb-16">
            <p>
              <span className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:pr-3 first-letter:pt-2 text-black">
                T
              </span>
              he gut is often called the "second brain," and for good reason. Just like in humans, your dog's digestive system plays a massive role in their overall well-being, influencing everything from nutrient absorption to immune function and even behavior.
            </p>
            <p>
              However, modern pet diets often lack the diverse microbiome support that our furry ancestors would have found in the wild. This gap can lead to sluggishness, dull coats, and occasional digestive upset.
            </p>

            <h3 className="text-3xl font-serif font-medium text-black mt-12 mb-6">Signs of an Imbalanced Gut</h3>
            <p>
              How do you know if your pet needs help? The signs can be subtle. Watch out for excessive shedding, fluctuating energy levels, or "picky eater" syndrome that might actually be mild discomfort.
            </p>

            <TipBox title="Monitor the Poop">
              A healthy stool should be firm, moist, and easy to pick up. Changes in consistency or color are often the first sign of a microbiome shift.
            </TipBox>

            <h3 className="text-3xl font-serif font-medium text-black mt-12 mb-6">The Proobiotic Solution</h3>
            <p>
              Adding a high-quality probiotic to your dog's daily routine is one of the easiest, most impactful changes you can make. It introduces beneficial bacteria that crowd out harmful pathogens and help synthesize essential vitamins.
            </p>

            <figure className="my-12">
              <img
                src="https://images.unsplash.com/photo-1510771463146-e89e6e86560e?q=80&w=1000&auto=format&fit=crop"
                alt="Happy Dog"
                className="w-full rounded-2xl shadow-lg"
              />
              <figcaption className="text-center text-sm text-black/50 mt-4 italic">A balanced gut means a happier, more playful pup.</figcaption>
            </figure>

            <p>
              We recommed looking for supplements that include <em>Bacillus coagulans</em>, a hardy strain that survives stomach acid to reach the intestines where it does its best work.
            </p>

            {/* Soft Commerce Injection */}
            <ProductInset product={RECOMMENDED_PRODUCT} />

            <h3 className="text-3xl font-serif font-medium text-black mt-12 mb-6">Consistency is Key</h3>
            <p>
              Like any health regimen, results take time. Stick with a gut health protocol for at least 30 days to see the full transformation in your pet's vitality.
            </p>
          </div>

          {/* Tags & Share */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-black/10 gap-6">
            <div className="flex gap-2">
              {["Nutrition", "Wellness", "Science"].map(tag => (
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
      <section className="bg-white py-20 border-t border-black/5">
        <div className="container mx-auto px-4 md:px-8">
          <h3 className="text-3xl font-serif font-medium text-center mb-12">Read Next</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Reusing cards for demo */}
            <BlogCard post={{
              id: 2,
              title: "Apartment Living: Enrichment Tips",
              excerpt: "Discover vertical territory hacks and puzzle toys that keep your feline friend mentally sharp.",
              category: "Lifestyle",
              image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500",
              readTime: "4 min read"
            }} />
            <BlogCard post={{
              id: 3,
              title: "Understanding Separation Anxiety",
              excerpt: "A behavioral expert shares a step-by-step guide to building confidence.",
              category: "Behavior",
              image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=500",
              readTime: "7 min read"
            }} />
            <BlogCard post={{
              id: 4,
              title: "The Guide to Sustainable Pet Care",
              excerpt: "How to reduce your pawprint with ethically sourced treats.",
              category: "Sustainability",
              image: "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=500",
              readTime: "6 min read"
            }} />
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default BlogPost;
