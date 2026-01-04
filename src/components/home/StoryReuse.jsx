import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StoryReuse = () => {
    return (
        <section className="py-8 md:py-0 min-h-[calc(100vh-80px-13vh)] flex flex-col justify-center bg-white border-t border-black/5">
            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col justify-center">
                {/* Standard Section Header */}
                <div className="mb-6 md:mb-8 pt-4">
                    <h2 className="text-3xl md:text-4xl font-serif font-medium text-black mb-2">
                        Keeping Pets Happy
                    </h2>
                    <p className="text-black/60 text-base md:text-lg font-light">
                        Solutions designed for real-life moments.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">

                    {/* Featured Context: Anxiety / Calm */}
                    <div className="relative group rounded-[2rem] md:rounded-[3rem] overflow-hidden h-[350px] md:h-[450px] shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1510771463146-e89e6e86560e?q=80&w=1000&auto=format&fit=crop"
                            alt="Calm Dog"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                            <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full inline-block text-xs font-bold uppercase tracking-wider mb-4">
                                Best for Anxious Pets
                            </div>
                            <h3 className="text-3xl md:text-4xl font-serif font-medium mb-4">Finding Calm in Chaos</h3>
                            <p className="text-white/80 mb-6 md:mb-8 max-w-md text-sm md:text-base">Our calming hemp oil isn't just a treat—it's a tool to help your pet navigate storms, separation, and travel with peace.</p>
                            <Button className="bg-white text-black hover:bg-furco-cream border-none rounded-full px-6 md:px-8">
                                Shop Calming Oil
                            </Button>
                        </div>
                    </div>

                    {/* Supporting Products / Context */}
                    <div className="flex flex-col gap-6 md:gap-8">

                        {/* Card 1 */}
                        <div className="bg-[#FAF8F5] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 group hover:bg-[#F2E8D5] transition-colors duration-500">
                            <div className="w-24 h-24 md:w-40 md:h-40 rounded-2xl overflow-hidden flex-shrink-0">
                                <img src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=1000&auto=format&fit=crop" alt="Toy" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="text-furco-brown text-xs font-bold uppercase tracking-wider mb-2">Ideal for Apartment Living</div>
                                <h4 className="text-xl md:text-2xl font-serif font-medium mb-2">Enrichment Play Rope</h4>
                                <p className="text-black/60 mb-4 text-sm">Mental stimulation for indoor days. Keeps them busy, saves your furniture.</p>
                                <div className="flex items-center gap-2 text-sm font-medium border-b border-black/10 items-start self-start inline-block">
                                    Read More
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#FAF8F5] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 group hover:bg-[#F2E8D5] transition-colors duration-500">
                            <div className="w-24 h-24 md:w-40 md:h-40 rounded-2xl overflow-hidden flex-shrink-0">
                                <img src="https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=1000&auto=format&fit=crop" alt="Bed" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="text-furco-brown text-xs font-bold uppercase tracking-wider mb-2">Vet Recommended for Seniors</div>
                                <h4 className="text-xl md:text-2xl font-serif font-medium mb-2">Orthopedic Rest</h4>
                                <p className="text-black/60 mb-4 text-sm">Supportive memory foam that relieves joint pressure. Because they deserve the best sleep.</p>
                                <div className="flex items-center gap-2 text-sm font-medium border-b border-black/10 items-start self-start inline-block">
                                    Read More
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default StoryReuse;
