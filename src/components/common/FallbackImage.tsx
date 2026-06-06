
import React, { useState } from 'react';

interface FallbackImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  style?: React.CSSProperties;
}

export const FallbackImage: React.FC<FallbackImageProps> = ({ 
  src, alt, className, fallbackText, style
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 生成随机背景色
  const getRandomColor = () => {
    const colors = [
      '#FFE4E1', '#E6E6FA', '#FFF0F5', '#F0FFF0', '#FFFFF0',
      '#F5F5DC', '#E0FFFF', '#FAFAD2', '#DDA0DD', '#B0E0E6',
      '#FFFAF0', '#F0E68C', '#D3D3D3', '#F5DEB3', '#E6D5B8'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const backgroundColor = getRandomColor();

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
  };

  return (
    <div
      className={`${className} relative flex items-center justify-center`}
      style={{
        ...style,
        backgroundColor: imageError ? backgroundColor : undefined,
        background: imageError ? undefined : 'linear-gradient(to bottom, #f9f9f9, #f0f0f0)',
      }}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* 加载中或加载失败时显示占位符 */}
      {!imageLoaded && (
        <div className="flex flex-col items-center justify-center text-gray-400 z-10">
          <div className="text-4xl mb-2">🍽️</div>
          <div className="text-xs font-medium text-gray-500">
            {fallbackText || alt}
          </div>
        </div>
      )}
    </div>
  );
};
