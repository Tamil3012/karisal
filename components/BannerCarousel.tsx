import React, { useState } from 'react';
import type { CarouselProps, RadioChangeEvent } from 'antd';
import { Carousel, Radio } from 'antd';

type DotPlacement = CarouselProps['dotPlacement'];

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '700px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const BannerCarousel: React.FC = () => {
  const [dotPlacement, setDotPlacement] = useState<DotPlacement>('end');

  const handlePositionChange = ({ target: { value } }: RadioChangeEvent) => {
    setDotPlacement(value);
  };

  return (
    <>
      
      <Carousel dotPlacement={dotPlacement}>
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
    </>
  );
};

export default BannerCarousel;
