import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-furco-black">About Fur & Co</h1>
        <p className="text-xl text-muted-foreground">
          "The Animal Aura" - We believe every pet deserves the best.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary/20">
          <img 
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop" 
            alt="Happy pets" 
            className="object-cover w-full h-full"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Founded in 2023, Fur & Co started with a simple mission: to provide Indian pet parents with premium, trustworthy products for their furry family members. We understand that pets are not just animals; they are the aura of our homes.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            From nutritious food to durable toys, every product we curate is tested and loved by our own pets. We are committed to quality, transparency, and the well-being of dogs and cats across the country.
          </p>
          <Button size="lg" className="bg-furco-black text-white hover:bg-furco-brown-dark">Read More</Button>
        </div>
      </div>

      <div className="mt-24 text-center space-y-12">
        <h2 className="text-3xl font-bold">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-furco-cream/30 rounded-xl space-y-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-2xl">🌿</div>
            <h3 className="text-xl font-semibold">Natural Ingredients</h3>
            <p className="text-muted-foreground">We prioritize natural, safe, and healthy ingredients in all our food products.</p>
          </div>
          <div className="p-6 bg-furco-cream/30 rounded-xl space-y-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-2xl">🚚</div>
            <h3 className="text-xl font-semibold">Fast Delivery</h3>
            <p className="text-muted-foreground">Get your pet essentials delivered to your doorstep quickly and reliably.</p>
          </div>
          <div className="p-6 bg-furco-cream/30 rounded-xl space-y-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-2xl">❤️</div>
            <h3 className="text-xl font-semibold">Made with Love</h3>
            <p className="text-muted-foreground">Every product is chosen with the same love and care we give our own pets.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
