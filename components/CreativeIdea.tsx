'use client';

import RotatingText from './RotatingText';

export default function CreativeIdea() {
  return (
    <div className="">
      <div className="text-center flex">
        <h1 className="text-5xl md:text-7xl font-bold text-sky-950 mb-8">
          We Create
        </h1>
        
        <RotatingText
          texts={['React', 'Bits', 'Is', 'Cool!']}
          mainClassName="px-2 sm:px-2 md:px-3 h-fit bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg text-4xl md:text-6xl font-bold"
          staggerFrom="last"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />
        
      </div>
    </div>
  );
}