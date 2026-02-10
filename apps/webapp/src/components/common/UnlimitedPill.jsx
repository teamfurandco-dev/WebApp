import React from 'react';

/**
 * UnlimitedPill component recreates the design from the user's provided image.
 * It features a black capsule with gold "Unlimited" text and a thick gold bottom border.
 */
const UnlimitedPill = () => {
  return (
    <div className="flex flex-col w-full items-start justify-center">
      {/* The Black Capsule Pill */}
      <div className="relative overflow-hidden bg-black rounded-r-full pl-8 pr-16 py-4 flex items-center shadow-2xl group transition-all duration-500 hover:pr-20">
        <span className="text-[#B8860B] text-4xl md:text-5xl font-bold tracking-tight font-sans selection:bg-[#B8860B] selection:text-black">
          Unlimited
        </span>

        {/* Subtle inner glow for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B8860B]/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      ` }} />
    </div>
  );
};

export default UnlimitedPill;
