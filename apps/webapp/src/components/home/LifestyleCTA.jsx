import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ctaSectionImage from '@/assets/cta_section_home.png';

const LifestyleCTA = () => {
    return (
        <section className="py-12 md:py-24 min-h-[50vh] md:min-h-[calc(100vh-80px-13vh)] flex flex-col justify-center bg-[#FDFBF7]">
            <div className="container mx-auto px-3 md:px-8 h-full flex flex-col justify-center">
                <div className="relative rounded-2xl md:rounded-[3rem] overflow-hidden h-[300px] md:h-[500px] shadow-xl">
                    <img
                        src={ctaSectionImage}
                        alt="Pet Love"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-16">
                        <h2 className="text-xl md:text-5xl lg:text-6xl font-serif font-medium text-white mb-4 md:mb-8 drop-shadow-lg max-w-3xl">
                            Thoughtfully designed care for the ones who trust you the most.
                        </h2>
                        <Link to="/products">
                            <Button className="bg-white text-black hover:bg-furco-cream border-none rounded-full px-6 py-3 md:px-12 md:py-6 text-sm md:text-xl transition-all shadow-xl hover:scale-105">
                                Explore Essentials
                                <ArrowRight className="ml-2 w-4 h-4 md:w-6 md:h-6" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LifestyleCTA;
