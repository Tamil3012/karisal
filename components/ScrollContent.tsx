'use client';

import { useState } from 'react';
import ScrollVelocity from './ScrollVelocity';

export default function ScrollContent() {
  const [velocity] = useState(100);

  return (
    <div className="w-full bg-gradient-to-b from-black via-gray-900 to-black">
      

      {/* Scroll Velocity Section */}
      <div className="w-full py-8 md:py-12">
        <ScrollVelocity
          texts={['ரௌத்ரம் பழகு', 'Scroll Down']} 
          velocity={velocity} 
          className="text-white px-2 py-2 sm:px-4 Ananthabairavi"
          parallaxClassName=""
        />
      </div>

    </div>
  );
}
