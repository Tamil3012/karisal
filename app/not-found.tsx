'use client';

import FuzzyText from '@/components/FuzzyText';
import Link from 'next/link';
// import FuzzyText from '@/app/components/FuzzyText'; 
import { useState } from 'react';

export default function NotFound() {
  const [enableHover] = useState(true);
  const [hoverIntensity] = useState(0.5);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center">
        <FuzzyText 
          baseIntensity={0.2} 
          hoverIntensity={hoverIntensity} 
          enableHover={enableHover}
          fontSize="clamp(4rem, 15vw, 12rem)"
          color="#000"
        >
          404
        </FuzzyText>
        
        <h2 className="text-2xl md:text-4xl font-bold text-black mt-8 mb-4">
          Page Not Found
        </h2>
       
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
