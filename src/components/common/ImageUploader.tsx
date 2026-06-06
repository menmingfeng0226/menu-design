import React, { useState, useCallback, useRef } from 'react';
import { Maximize2, Minimize2, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

type LayoutType = 'vertical' | 'horizontal' | 'grid' | 'card' | 'list' | 'magazine' | 'compact' | 'premium' | 'carousel' | 'polaroid' | 'featured' | 'masonry' | 'alternating' | 'minimal' | 'elegant' | 'mosaic' | 'custom' | 'spotlight' | 'gallery' | 'newspaper' | 'tag';

interface ImageTransform {
  scale: number;
  x: number;
  y: number;
}

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  layoutType?: LayoutType;
  imageTransform?: ImageTransform;
  onTransformChange?: (transform: ImageTransform) => void;
}

const getAspectRatio = (layoutType: LayoutType): { width: string; height: string } => {
  switch (layoutType) {
    case 'vertical':
    case 'grid':
    case 'list':
    case 'masonry':
    case 'featured':
    case 'compact':
    case 'minimal':
      return { width: 'w-full', height: 'aspect-[3/2]' };
    case 'horizontal':
    case 'card':
    case 'carousel':
    case 'polaroid':
    case 'premium':
    case 'elegant':
    case 'alternating':
      return { width: 'w-full', height: 'aspect-[5/3]' };
    case 'magazine':
    case 'mosaic':
      return { width: 'w-full', height: 'aspect-[16/10]' };
    default:
      return { width: 'w-full', height: 'aspect-[5/3]' };
  }
};

const getAspectRatioLabel = (layoutType: LayoutType): string => {
  switch (layoutType) {
    case 'vertical':
    case 'grid':
    case 'list':
    case 'masonry':
    case 'featured':
    case 'compact':
    case 'minimal':
      return '3:2';
    case 'horizontal':
    case 'card':
    case 'carousel':
    case 'polaroid':
    case 'premium':
    case 'elegant':
    case 'alternating':
      return '5:3';
    case 'magazine':
    case 'mosaic':
      return '16:10';
    default:
      return '5:3';
  }
};

const isValidImageUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  return url.startsWith('http://') || 
         url.startsWith('https://') || 
         url.startsWith('data:image/');
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, label, layoutType = 'vertical', imageTransform, onTransformChange }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [scale, setScale] = useState(imageTransform?.scale ?? 1);
  const [position, setPosition] = useState({ x: imageTransform?.x ?? 0, y: imageTransform?.y ?? 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const aspectRatio = getAspectRatio(layoutType);
  const hasValidImage = isValidImageUrl(value);
  
  // 监听 imageTransform 变化，同步状态
  React.useEffect(() => {
    if (imageTransform) {
      setScale(imageTransform.scale);
      setPosition({ x: imageTransform.x, y: imageTransform.y });
    }
  }, [imageTransform]);

  const notifyTransformChange = useCallback((newScale: number, newPosition: { x: number; y: number }) => {
    if (onTransformChange) {
      onTransformChange({ scale: newScale, x: newPosition.x, y: newPosition.y });
    }
  }, [onTransformChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange(result);
        setImageLoaded(false);
        setImageError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setImageLoaded(false);
    setImageError(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  const handleZoomIn = useCallback(() => {
    setScale(prev => {
      const newScale = Math.min(prev + 0.25, 3);
      notifyTransformChange(newScale, position);
      return newScale;
    });
  }, [notifyTransformChange, position]);

  const handleZoomOut = useCallback(() => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.25, 0.25);
      notifyTransformChange(newScale, position);
      return newScale;
    });
  }, [notifyTransformChange, position]);

  const handleResetScale = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    notifyTransformChange(1, { x: 0, y: 0 });
  }, [notifyTransformChange]);

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // 允许在任何时候拖动，不仅仅是缩放后
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  }, [position]);

  const handleDragMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    setPosition({ x: newX, y: newY });
    notifyTransformChange(scale, { x: newX, y: newY });
    e.preventDefault();
  }, [isDragging, startPos, scale, notifyTransformChange]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // 添加触摸事件支持
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setStartPos({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    e.preventDefault();
  }, [position]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const newX = touch.clientX - startPos.x;
    const newY = touch.clientY - startPos.y;
    setPosition({ x: newX, y: newY });
    notifyTransformChange(scale, { x: newX, y: newY });
    e.preventDefault();
  }, [isDragging, startPos, scale, notifyTransformChange]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => {
      const newScale = Math.min(Math.max(prev + delta, 0.25), 3);
      notifyTransformChange(newScale, position);
      return newScale;
    });
  }, [notifyTransformChange, position]);

  const shouldShowPreview = hasValidImage && !imageError && (imageLoaded || !value.startsWith('http'));

  return (
    <div className="space-y-4">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      
      {/* 上传区域 */}
      <div className="relative">
        {!shouldShowPreview ? (
          <label className={`flex flex-col items-center justify-center ${aspectRatio.width} ${aspectRatio.height} border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-amber-400 hover:border-solid transition-all`}>
            <div className="flex flex-col items-center justify-center">
              <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">点击上传</span> 或拖拽文件到此处</p>
              <p className="text-xs text-amber-600 font-medium mb-1">推荐图片比例: {getAspectRatioLabel(layoutType)}</p>
              <p className="text-xs text-gray-400">支持 PNG, JPG, GIF 等格式</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div 
            ref={containerRef}
            className={`relative group ${aspectRatio.width} ${aspectRatio.height} overflow-hidden rounded-lg bg-gray-900 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {value.startsWith('http') && !imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
                <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            <img
              ref={imageRef}
              src={value}
              alt="Preview"
              className={`${isDragging ? '' : 'transition-all duration-200 ease-out'} ${value.startsWith('http') && !imageLoaded ? 'opacity-0' : 'opacity-100'}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: scale > 1 || (position.x !== 0 || position.y !== 0) ? 'none' : 'cover',
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                userSelect: 'none',
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              draggable={false}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  title="缩小"
                >
                  <ZoomOut className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  title="放大"
                >
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handleResetScale}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  title="重置"
                >
                  <RotateCcw className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setIsZoomed(true)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  title="全屏"
                >
                  <Maximize2 className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handleRemoveImage}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-red-100 transition-colors"
                  title="删除"
                >
                  <X className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
            {scale > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs">
                {Math.round(scale * 100)}%
              </div>
            )}
            {/* 拖动提示 */}
            {scale !== 1 || position.x !== 0 || position.y !== 0 ? (
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs">
                拖动调整位置
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* 缩放查看模态框 */}
      {isZoomed && shouldShowPreview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh]"
            onWheel={handleWheel}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <div 
              className={`relative overflow-auto max-h-[80vh] rounded-lg ${isDragging ? 'cursor-grabbing' : 'cursor-move'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                ref={imageRef}
                src={value}
                alt="Zoomed"
                className={`${isDragging ? '' : 'transition-all duration-200 ease-out'} rounded-lg`}
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: 'center center',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  userSelect: 'none',
                }}
                draggable={false}
              />
            </div>
            <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-xl">
              <button
                onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="放大 (+)"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="缩小 (-)"
              >
                <ZoomOut className="w-5 h-5 text-gray-700" />
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={(e) => { e.stopPropagation(); handleResetScale(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="重置"
              >
                <RotateCcw className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="关闭"
              >
                <Minimize2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
              {Math.round(scale * 100)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
