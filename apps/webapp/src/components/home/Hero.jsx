import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-furco-yellow overflow-hidden">
      <div className="container px-4 md:px-6 py-12 md:py-24 lg:py-32 flex flex-col-reverse md:flex-row items-center gap-8">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-furco-black">
            The Animal Aura
          </h1>
          <p className="text-lg md:text-xl text-furco-brown-dark max-w-[600px] mx-auto md:mx-0">
            Premium pet care products for your furry friends. Discover nutrition, toys, and accessories that they'll love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/products">
              <Button size="lg" className="w-full sm:w-auto bg-furco-black text-white hover:bg-furco-brown-dark">
                Shop Now
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-furco-black text-furco-black hover:bg-furco-cream">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="relative z-10">
             {/* Placeholder for Hero Image - In real app use actual image */}
             <img 
               src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop" 
               alt="Happy Dog" 
               className="rounded-2xl shadow-2xl w-full max-w-[500px] mx-auto object-cover aspect-square"
             />
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-furco-yellow-light/50 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
