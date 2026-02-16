import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Fallback tips if no blogs provided
const fallbackTips = [
    {
        title: "5 Signs Your Dog Stressed",
        desc: "Learn to read your pet's body language and help them find their calm.",
        image: "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop",
        slug: "#"
    },
    {
        title: "Nutrition Myths Debunked", 
        desc: "We spoke to top vets to separate fact from fiction in pet diets.",
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop",
        slug: "#"
    },
    {
        title: "Apartment Enrichment 101",
        desc: "Small space? No problem. Keeping your pet active indoors.",
        image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1000&auto=format&fit=crop",
        slug: "#"
    }
];

const PetParentingTips = ({ blogs = [] }) => {
    // Use provided blogs or fallback to hardcoded tips
    const displayTips = blogs.length > 0 
        ? blogs.slice(0, 3).map(blog => ({
            title: blog.title,
            desc: blog.excerpt,
            image: blog.coverImage || fallbackTips[0].image,
            slug: `/blog/${blog.slug}`
          }))
        : fallbackTips;
    return (
        <section className="pt-10 md:pt-20 pb-6 md:pb-12 bg-white border-t border-black/5">
            <div className="container mx-auto px-3 md:px-8">
                {/* Standard Section Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 md:mb-12 gap-3 md:gap-4 py-[5px]">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-peace-sans font-medium text-black mb-1 md:mb-2">
                            Pet Parenting Tips
                        </h2>
                        <p className="text-black/60 text-sm md:text-lg font-light">
                            Expert advice for happier, healthier pets.
                        </p>
                    </div>
                    <Link to="/blog" className="group flex items-center gap-2 text-black font-medium border-b border-black/20 pb-0.5 hover:border-black transition-all text-sm whitespace-nowrap hidden md:flex">
                        View All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x scroll-pl-2 -mx-3 px-3 md:mx-0 md:px-0">
                    {displayTips.map((tip, index) => (
                        <Link to={tip.slug} key={index} className="group flex-none w-[75vw] md:w-auto">
                            <div className="aspect-[3/2] overflow-hidden rounded-xl md:rounded-3xl mb-3 md:mb-6">
                                <img
                                    src={tip.image}
                                    alt={tip.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <h3 className="text-base md:text-2xl font-serif font-medium text-black mb-1 md:mb-3 group-hover:text-furco-brown transition-colors line-clamp-2">{tip.title}</h3>
                            <p className="text-black/60 mb-2 md:mb-4 leading-relaxed text-xs md:text-base line-clamp-2">{tip.desc}</p>
                            <span className="text-xs md:text-sm font-medium text-black border-b border-black/20 pb-0.5 group-hover:border-black transition-all inline-block">Read More</span>
                        </Link>
                    ))}
                </div>
                {/* Mobile View All Link */}
                <div className="md:hidden mt-4 text-center">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-black font-medium hover:text-furco-gold transition-colors text-sm">
                        View All Articles <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PetParentingTips;
