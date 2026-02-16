import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useHomeData } from '@/hooks/useQueries';

// Components
import HomeHero from '@/components/home/HomeHero';
import CareCategories from '@/components/home/CareCategories';
import PhilosophyStrip from '@/components/home/PhilosophyStrip';
import CuratedEssentials from '@/components/home/CuratedEssentials';
import StoryReuse from '@/components/home/StoryReuse';
import WhyChoose from '@/components/home/WhyChoose';
import CommunityTestimonials from '@/components/home/CommunityTestimonials';
import PetParentingTips from '@/components/home/PetParentingTips';
import LifestyleCTA from '@/components/home/LifestyleCTA';

const Home = () => {
  const { switchMode } = useTheme();
  const { data: homeData, isLoading, error } = useHomeData();

  useEffect(() => {
    switchMode('GATEWAY');
    window.scrollTo(0, 0);
  }, [switchMode]);

  const isLoadingOrError = isLoading || error;
  
  if (isLoadingOrError) {
    return (
      <div className="w-full flex flex-col min-h-screen bg-[#FDFBF7] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-furco-gold"></div>
        <p className="mt-4 text-furco-brown">Loading...</p>
      </div>
    );
  }

  const data = homeData || {
    hero: { title: 'Welcome to Fur & Co', subtitle: 'Premium pet care', ctaText: 'Shop Now', ctaLink: '/products' },
    featuredProducts: [],
    categories: [],
    featuredBlogs: []
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FDFBF7] overflow-x-hidden">

      {/* 1. Hero Section (Static, No Slider) */}
      <HomeHero hero={data?.hero} />

      {/* 2. Care Categories (3 Large Tiles) */}
      <CareCategories categories={data?.categories} />

      {/* 3. Philosophy Strip (Signal values) */}
      <PhilosophyStrip />

      {/* 4. Curated Essentials (6 Products max) */}
      <CuratedEssentials products={data?.featuredProducts} />

      {/* 5. Story-Led Product Reuse (Contextual) */}
      <StoryReuse />

      {/* 6. Why Choose Fur & Co (4 minimal cards) */}
      <WhyChoose />

      {/* 7. Community / Social Proof */}
      <CommunityTestimonials />

      {/* 8. Pet Parenting Tips (3 blog cards) */}
      <PetParentingTips blogs={data?.featuredBlogs} />

      {/* 9. Lifestyle CTA (Emotional Close) */}
      <LifestyleCTA />

    </div>
  );
};

export default Home;
