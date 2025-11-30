import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoriesSection from '@/components/home/CategoriesSection';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      
      {/* Newsletter / CTA Section */}
      <section className="bg-furco-black text-white py-16 md:py-24">
        <div className="container px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Join the Fur & Co Family</h2>
          <p className="text-lg text-gray-300 max-w-[600px] mx-auto">
            Get exclusive offers, pet care tips, and early access to new products delivered straight to your inbox.
          </p>
          {/* Placeholder for Newsletter Form - Reusing Footer logic conceptually */}
        </div>
      </section>
    </div>
  );
};

export default Home;
