'use client';

interface LoadingProps {
  circleColor?: string;
  shadowColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ 
  circleColor = '#ffffff', 
  shadowColor = 'rgba(255, 255, 255, 0.2)',
  size = 'md'
}: LoadingProps) {
  const sizes = {
    sm: { width: '40px', height: '20px', circleSize: '6px' },
    md: { width: '60px', height: '30px', circleSize: '8px' },
    lg: { width: '80px', height: '40px', circleSize: '10px' }
  };

  const currentSize = sizes[size];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="typing-indicator" style={{ width: currentSize.width, height: currentSize.height }}>
        {/* Typing Circles */}
        <div className="typing-circle" style={{ backgroundColor: circleColor, width: currentSize.circleSize, height: currentSize.circleSize }}></div>
        <div className="typing-circle typing-circle-2" style={{ backgroundColor: circleColor, width: currentSize.circleSize, height: currentSize.circleSize }}></div>
        <div className="typing-circle typing-circle-3" style={{ backgroundColor: circleColor, width: currentSize.circleSize, height: currentSize.circleSize }}></div>
        
        {/* Typing Shadows */}
        <div className="typing-shadow" style={{ backgroundColor: shadowColor }}></div>
        <div className="typing-shadow typing-shadow-2" style={{ backgroundColor: shadowColor }}></div>
        <div className="typing-shadow typing-shadow-3" style={{ backgroundColor: shadowColor }}></div>
      </div>

      <style jsx>{`
        .typing-indicator {
          position: relative;
          z-index: 4;
        }

        .typing-circle {
          position: absolute;
          border-radius: 50%;
          left: 15%;
          transform-origin: 50%;
          animation: typing-circle 0.5s alternate infinite ease;
        }

        @keyframes typing-circle {
          0% {
            top: 20px;
            height: 5px;
            border-radius: 50px 50px 25px 25px;
            transform: scaleX(1.7);
          }
          40% {
            height: ${currentSize.circleSize};
            border-radius: 50%;
            transform: scaleX(1);
          }
          100% {
            top: 0%;
          }
        }

        .typing-circle-2 {
          left: 45%;
          animation-delay: 0.2s;
        }

        .typing-circle-3 {
          left: auto;
          right: 15%;
          animation-delay: 0.3s;
        }

        .typing-shadow {
          width: 5px;
          height: 4px;
          border-radius: 50%;
          position: absolute;
          top: 30px;
          transform-origin: 50%;
          z-index: 3;
          left: 15%;
          filter: blur(1px);
          animation: typing-shadow 0.5s alternate infinite ease;
        }

        @keyframes typing-shadow {
          0% {
            transform: scaleX(1.5);
          }
          40% {
            transform: scaleX(1);
            opacity: 0.7;
          }
          100% {
            transform: scaleX(0.2);
            opacity: 0.4;
          }
        }

        .typing-shadow-2 {
          left: 45%;
          animation-delay: 0.2s;
        }

        .typing-shadow-3 {
          left: auto;
          right: 15%;
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}
