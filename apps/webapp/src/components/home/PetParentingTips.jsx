import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const tips = [
    {
        title: "5 Signs Your Dog Stressed",
        desc: "Learn to read your pet's body language and help them find their calm.",
        image: "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Nutrition Myths Debunked",
        desc: "We spoke to top vets to separate fact from fiction in pet diets.",
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Apartment Enrichment 101",
        desc: "Small space? No problem. Keeping your pet active indoors.",
        image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1000&auto=format&fit=crop"
    }
];

const PetParentingTips = () => {
    return (
        <section className="pt-16 md:pt-20 pb-8 md:pb-12 bg-white border-t border-black/5">
            <div className="container mx-auto px-4 md:px-8">
                {/* Standard Section Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-12 gap-4 py-[5px]">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-peace-sans font-medium text-black mb-2">
                            Pet Parenting Tips
                        </h2>
                        <p className="text-black/60 text-base md:text-lg font-light">
                            Expert advice for happier, healthier pets.
                        </p>
                    </div>
                    <Link to="/blog" className="group flex items-center gap-2 text-black font-medium border-b border-black/20 pb-1 hover:border-black transition-all text-sm md:text-base whitespace-nowrap">
                        View All Articles
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-none scroll-pl-4">
                    {tips.map((tip, index) => (
                        <Link to="/blog" key={index} className="group flex-none w-[80vw] md:w-auto">
                            <div className="aspect-[3/2] overflow-hidden rounded-2xl md:rounded-3xl mb-4 md:mb-6">
                                <img
                                    src={tip.image}
                                    alt={tip.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif font-medium text-black mb-2 md:mb-3 group-hover:text-furco-brown transition-colors">{tip.title}</h3>
                            <p className="text-black/60 mb-3 md:mb-4 leading-relaxed text-sm md:text-base">{tip.desc}</p>
                            <span className="text-sm font-bold text-black border-b border-black/20 pb-1 group-hover:border-black transition-all inline-block">Read Article</span>
                        </Link>
                    ))}
                </div>
                {/* Mobile View All Link */}
                <div className="md:hidden mt-4 text-center">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-black font-medium hover:text-furco-gold transition-colors text-sm">
                        Read Our Blog <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PetParentingTips;
