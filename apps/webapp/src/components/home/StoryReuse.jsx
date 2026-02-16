import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const StoryReuse = () => {
    return (
        <section className="py-6 md:py-0 min-h-[60vh] md:min-h-[calc(100vh-80px-13vh)] flex flex-col justify-center bg-white border-t border-black/5">
            <div className="container mx-auto px-3 md:px-8 h-full flex flex-col justify-center">
                {/* Standard Section Header */}
                <div className="mb-4 md:mb-6 py-[5px]">
                    <h2 className="text-2xl md:text-4xl font-peace-sans font-medium text-black mb-1 md:mb-2">
                        Keeping Pets Happy
                    </h2>
                    <p className="text-black/60 text-sm md:text-lg font-light">
                        Solutions designed for real-life moments.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12 items-center">

                    {/* Featured Context: Anxiety / Calm */}
                    <div className="relative group rounded-2xl md:rounded-[3rem] overflow-hidden h-[280px] md:h-[450px] shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1510771463146-e89e6e86560e?q=80&w=1000&auto=format&fit=crop"
                            alt="Calm Dog"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        <div className="absolute bottom-0 left-0 p-4 md:p-10 text-white">
                            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full inline-block text-[10px] font-bold uppercase tracking-wider mb-2 md:mb-4">
                                Best for Anxious Pets
                            </div>
                            <h3 className="text-xl md:text-4xl font-serif font-medium mb-2 md:mb-4">Finding Calm in Chaos</h3>
                            <p className="text-white/80 mb-3 md:mb-6 max-md:text-xs line-clamp-2">Our calming hemp oil isn't just a treat—it's a tool to help your pet navigate storms.</p>
                            <Link to="/products">
                                <Button className="bg-white text-black hover:bg-furco-cream border-none rounded-full px-4 md:px-8 h-9 md:h-10 text-sm">
                                    Shop Now
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Supporting Products / Context */}
                    <div className="flex flex-col gap-3 md:gap-8">

                        {/* Card 1 */}
                        <Link to="/products" className="bg-[#FAF8F5] rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-8 group hover:bg-[#F2E8D5] transition-colors duration-500">
                            <div className="w-20 h-20 md:w-40 md:h-40 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0">
                                <img src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=1000&auto=format&fit=crop" alt="Toy" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="text-furco-brown text-[10px] font-bold uppercase tracking-wider mb-1 md:mb-2">Apartment Living</div>
                                <h4 className="text-base md:text-2xl font-serif font-medium mb-1 md:mb-2">Enrichment Play</h4>
                                <p className="text-black/60 mb-2 md:mb-4 text-xs md:text-sm line-clamp-2">Mental stimulation for indoor days.</p>
                                <div className="flex items-center gap-2 text-xs md:text-sm font-medium border-b border-black/10 group-hover:border-black transition-all">
                                    Shop Now
                                </div>
                            </div>
                        </Link>

                        {/* Card 2 */}
                        <Link to="/products" className="bg-[#FAF8F5] rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-8 group hover:bg-[#F2E8D5] transition-colors duration-500">
                            <div className="w-20 h-20 md:w-40 md:h-40 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0">
                                <img src="https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=1000&auto=format&fit=crop" alt="Bed" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="text-furco-brown text-[10px] font-bold uppercase tracking-wider mb-1 md:mb-2">For Seniors</div>
                                <h4 className="text-base md:text-2xl font-serif font-medium mb-1 md:mb-2">Orthopedic Rest</h4>
                                <p className="text-black/60 mb-2 md:mb-4 text-xs md:text-sm line-clamp-2">Supportive memory foam.</p>
                                <div className="flex items-center gap-2 text-xs md:text-sm font-medium border-b border-black/10 group-hover:border-black transition-all">
                                    Shop Now
                                </div>
                            </div>
                        </Link>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default StoryReuse;
