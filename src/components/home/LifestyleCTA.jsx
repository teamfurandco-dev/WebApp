import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const LifestyleCTA = () => {
    return (
        <section className="py-20 md:py-24 min-h-[calc(100vh-80px-13vh)] flex flex-col justify-center bg-[#FDFBF7]">
            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col justify-center">
                <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden h-[400px] md:h-[500px] shadow-2xl">
                    <img
                        src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2600&auto=format&fit=crop"
                        alt="Pet Love"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 md:p-16">
                        <h2 className="text-3xl md:text-6xl font-serif font-medium text-white mb-6 md:mb-8 drop-shadow-lg max-w-3xl">
                            Thoughtfully designed care for the ones who trust you the most.
                        </h2>
                        <Link to="/products">
                            <Button className="bg-white text-black hover:bg-furco-cream border-none rounded-full px-8 py-4 md:px-12 md:py-6 text-base md:text-xl transition-all shadow-xl hover:scale-105">
                                Explore Our Essentials
                                <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LifestyleCTA;
