import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

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

  // Enforce Gateway theme on mount
  useEffect(() => {
    switchMode('GATEWAY');
    window.scrollTo(0, 0);
  }, [switchMode]);

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FDFBF7] overflow-x-hidden">

      {/* 1. Hero Section (Static, No Slider) */}
      <HomeHero />

      {/* 2. Care Categories (3 Large Tiles) */}
      <CareCategories />

      {/* 3. Philosophy Strip (Signal values) */}
      <PhilosophyStrip />

      {/* 4. Curated Essentials (6 Products max) */}
      <CuratedEssentials />

      {/* 5. Story-Led Product Reuse (Contextual) */}
      <StoryReuse />

      {/* 6. Why Choose Fur & Co (4 minimal cards) */}
      <WhyChoose />

      {/* 7. Community / Social Proof */}
      <CommunityTestimonials />

      {/* 8. Pet Parenting Tips (3 blog cards) */}
      <PetParentingTips />

      {/* 9. Lifestyle CTA (Emotional Close) */}
      <LifestyleCTA />

    </div>
  );
};

export default Home;
