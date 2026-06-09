import React from 'react';
import { useMenuStore, getCurrencySymbol, unitOptions } from '../../stores/menuStore';
import type { Menu, TextStyle } from '../../types';

interface PreviewCanvasProps {
  menu?: Menu | null;
  mode?: 'phone' | 'tablet' | 'desktop';
  disableScaling?: boolean;
  zoom?: number;
  autoFit?: boolean;
}

const getUnitLabel = (unitCode?: string) => {
  if (!unitCode) return '/份';
  const unit = unitOptions.find(u => u.code === unitCode);
  return unit?.label || '/份';
};

const getTextStyle = (customStyle: TextStyle | undefined, defaultFontFamily: string, defaultFontSize: number, defaultColor: string, scale: number = 1, finalScale: number = 1) => {
  return {
    fontFamily: customStyle?.fontFamily || defaultFontFamily,
    fontSize: customStyle?.fontSize ? `${customStyle.fontSize * scale * finalScale}px` : `${defaultFontSize * scale * finalScale}px`,
    color: customStyle?.textColor || defaultColor};
};

const renderOriginalPrice = (priceText: string, priceStyle: any, opacity: number = 0.6) => {
  return (
    <span
      data-original-price="true"
      style={{
        display: 'block',
        color: priceStyle.color,
        fontFamily: priceStyle.fontFamily,
        fontSize: priceStyle.fontSize,
        lineHeight: priceStyle.lineHeight || 1.2,
        opacity: opacity,
        padding: '0',
        margin: '0',
        textDecoration: 'line-through',
      }}
    >
      {priceText}
    </span>
  );
};

const renderOriginalPriceNoScale = (priceText: string, priceStyle: any, opacity: number = 0.6) => {
  return renderOriginalPrice(priceText, priceStyle, opacity);
};

// 分类内容包装器，应用对齐方式
const CategoryWrapper = ({ 
  category, 
  children, 
  style, 
  optimalScale, 
  finalScale 
}: { 
  category: any, 
  children: React.ReactNode, 
  style: any, 
  optimalScale: number, 
  finalScale: number 
}) => {
  const textAlign = category.textAlign || 'left';
  const justifyContent = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start';
  const textAlignStyle = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'right' : 'left';
  
  return (
    <div style={{ textAlign: textAlignStyle as any }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: justifyContent as any, 
        width: '100%' 
      }}>
        {children}
      </div>
    </div>
  );
};

const pageSizeDimensions: Record<string, { width: number; height: number }> = {
  'A3': { width: 297, height: 420 },
  'A3-landscape': { width: 420, height: 297 },
  'A4': { width: 210, height: 297 },
  'A4-landscape': { width: 297, height: 210 },
  'A5': { width: 148, height: 210 },
  'A5-landscape': { width: 210, height: 148 },
  'A6': { width: 105, height: 148 },
  'A7': { width: 74, height: 105 },
  'A8': { width: 52, height: 74 },
  'B4': { width: 250, height: 353 },
  'B4-landscape': { width: 353, height: 250 },
  'B5': { width: 176, height: 250 },
  'B5-landscape': { width: 250, height: 176 },
  '16k': { width: 184, height: 260 },
  '32k': { width: 130, height: 184 },
  'poster-large': { width: 420, height: 570 },
  'poster-wide': { width: 500, height: 700 },
  'poster-landscape-small': { width: 420, height: 297 },
  'poster-landscape-medium': { width: 594, height: 420 },
  'poster-landscape-large': { width: 841, height: 594 },
  'banner-small': { width: 600, height: 200 },
  'banner-medium': { width: 900, height: 300 },
  'banner-large': { width: 1200, height: 400 },
  'rollup': { width: 600, height: 1600 },
  'business-card': { width: 90, height: 54 },
  'table-card': { width: 100, height: 150 }};

const mmToPixelRatio = 2.83465;

const calculateOptimalOverlay = (textColor: string) => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const getLuminance = (r: number, g: number, b: number) => {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const textRgb = hexToRgb(textColor);
    if (!textRgb) {
      return { color: '#FFFFFF', opacity: 0.85 };
    }

    const textLuminance = getLuminance(textRgb.r, textRgb.g, textRgb.b);

    if (textLuminance < 0.5) {
      // 深色文字，使用白色或浅色遮罩
      return { color: '#FFFFFF', opacity: 0.85 };
    } else {
      // 浅色文字，使用黑色或深色遮罩
      return { color: '#000000', opacity: 0.8 };
    }
  };

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  menu,
  mode = 'desktop',
  disableScaling = false,
  zoom = 1,
  autoFit = false
}) => {
  const { currentMenu } = useMenuStore();
  const displayMenu = menu || currentMenu;

  if (!displayMenu) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        暂无菜单内容
      </div>
    );
  }

  const { style, categories } = displayMenu;
  
  const formatPrice = (price: number, priceString?: string, unit?: string): string => {
    const symbol = getCurrencySymbol(style.currency);
    let priceStr: string;
    
    if (priceString !== undefined) {
      priceStr = priceString;
    } else {
      priceStr = price.toFixed(2);
    }
    
    let result = `${symbol}${priceStr}`;
    if (unit) {
      result += getUnitLabel(unit);
    }
    return result;
  };

  const pageSize = pageSizeDimensions[style.pageSize] || pageSizeDimensions['A4'];
  const pageWidth = pageSize.width * mmToPixelRatio;
  const pageHeight = pageSize.height * mmToPixelRatio;

  const deviceConfigs = {
    phone: { maxWidth: 375, maxHeight: 800, scale: 0.85, padding: '16px' },
    tablet: { maxWidth: 768, maxHeight: 1024, scale: 0.92, padding: '24px' },
    desktop: { maxWidth: 1600, maxHeight: 1200, scale: 1, padding: '32px' }};

  const deviceConfig = deviceConfigs[mode];

  const isWideLayout = pageWidth > pageHeight * 1.5;
  
  let scaleRatio = 1;
  
  if (!disableScaling) {
    if (isWideLayout) {
      scaleRatio = Math.min(deviceConfig.maxHeight / pageHeight, 1);
    } else {
      const scaleByWidth = deviceConfig.maxWidth / pageWidth;
      const scaleByHeight = deviceConfig.maxHeight / pageHeight;
      scaleRatio = Math.min(scaleByWidth, scaleByHeight, 1);
    }
  }
  
  // 在 autoFit 模式下，根据当前视口大小自动计算缩放比例
  const calculateAutoFitScale = () => {
    if (!autoFit) return scaleRatio;
    
    try {
      if (typeof window !== 'undefined') {
        const availableWidth = window.innerWidth - 64; // 减去 padding
        const availableHeight = window.innerHeight - 200; // 减去 header 高度
        
        const scaleByWidth = availableWidth / pageWidth;
        const scaleByHeight = availableHeight / pageHeight;
        
        return Math.min(scaleByWidth, scaleByHeight, zoom, 1);
      }
    } catch (e) {
      // 如果获取 window 失败，使用默认缩放
    }
    return scaleRatio;
  };
  
  const autoFitScale = calculateAutoFitScale();
  
  // 在 disableScaling 模式下，确保所有缩放都是 1；autoFit 模式下使用自动计算的缩放
  const finalScale = disableScaling ? 1 : (autoFit ? autoFitScale : (scaleRatio * zoom));
  const displayWidth = disableScaling ? pageWidth : (pageWidth * finalScale);
  const displayHeight = disableScaling ? pageHeight : (pageHeight * finalScale);

  // 页面边距计算 - 将用户选择的单位转换为像素
  const convertToPixels = (value: number, unit: 'mm' | 'cm' | 'px' | undefined) => {
    switch (unit) {
      case 'cm':
        return value * 37.795275591; // 1cm ≈ 37.795px
      case 'mm':
        return value * 3.7795275591; // 1mm ≈ 3.7795px
      case 'px':
      default:
        return value;
    }
  };

  // 获取页面边距（像素）
  const getPageMargin = () => {
    const margin = style.pageMargin || { top: 20, right: 20, bottom: 20, left: 20 };
    const unit = style.pageMarginUnit || 'mm';
    return {
      top: convertToPixels(margin.top, unit),
      right: convertToPixels(margin.right, unit),
      bottom: convertToPixels(margin.bottom, unit),
      left: convertToPixels(margin.left, unit),
    };
  };

  // 统一处理背景图片，无论它在哪个字段
  const getActualBackgroundImage = () => {
    if (style.backgroundType === 'image') {
      return style.backgroundImage || style.backgroundColor;
    }
    return undefined;
  };

  const getBackgroundStyle = () => {
    const actualBackgroundImage = getActualBackgroundImage();
    switch (style.backgroundType) {
      case 'gradient':
        return {
          background: style.backgroundImage || style.backgroundColor || '#FFFFFF',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'};
      case 'image':
        return {
          backgroundImage: actualBackgroundImage ? `url(${actualBackgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'};
      case 'solid':
      default:
        return {
          backgroundColor: style.backgroundColor || '#FFFFFF'};
    }
  };

  const getMaskFilter = () => {
    const mask = style.backgroundMask;
    switch (mask) {
      case 'rgba(0,0,0,0.1)':
        return 'brightness(0.9)';
      case 'rgba(0,0,0,0.3)':
        return 'brightness(0.7)';
      case 'rgba(0,0,0,0.5)':
        return 'brightness(0.5)';
      case 'blur':
        return 'blur(4px) brightness(0.85)';
      case 'sepia':
        return 'sepia(0.6) brightness(0.9)';
      case 'grayscale':
        return 'grayscale(1) brightness(0.9)';
      case 'warm':
        return 'sepia(0.3) brightness(1.05) contrast(0.95)';
      default:
        return 'none';
    }
  };

  const isImageBackground = style.backgroundType === 'image';
  const actualBackgroundImage = getActualBackgroundImage();

  const calculateOptimalScale = () => {
    // 在 disableScaling 模式下，不进行自适应缩放，确保内容完全填充页面
    if (disableScaling) {
      return 1;
    }
    
    let scale = 1;
    
    const totalDishes = categories.reduce((sum, cat) => sum + cat.dishes.length, 0);
    
    if (totalDishes > 20) {
      scale = 0.7;
    } else if (totalDishes > 15) {
      scale = 0.8;
    } else if (totalDishes > 10) {
      scale = 0.9;
    }
    
    return scale;
  };

  const optimalScale = calculateOptimalScale();

  const renderDishImage = (dish: any, additionalStyle: React.CSSProperties = {}) => {
    if (!dish.image || dish.image.trim() === '') return null;
    
    const transform = dish.imageTransform;
    const hasTransform = transform && (transform.scale !== 1 || transform.x !== 0 || transform.y !== 0);
    
    return (
      <img
        src={dish.image}
        alt={dish.name}
        className={`w-full h-full ${hasTransform ? '' : 'object-cover'}`}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          // 如果图片加载失败，不显示任何内容
          img.style.display = 'none';
        }}
        style={{
          ...additionalStyle,
          ...(hasTransform ? {
            objectFit: 'none',
            transform: `translate(${transform.x * finalScale}px, ${transform.y * finalScale}px) scale(${transform.scale})`,
            transformOrigin: 'center center'} : {})}}
      />
    );
  };

  const renderDishItem = (dish: any) => {
    const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
    const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
    const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.85, style.textColor + 'CC', deviceConfig.scale * optimalScale, finalScale);
    
    return (
      <div className="flex items-start gap-4" style={{ gap: `${16 * optimalScale * finalScale}px` }}>
        {dish.image && dish.image.trim() !== '' && (
          <div className="flex-shrink-0 rounded-lg overflow-hidden bg-gray-100" style={{ width: `${80 * optimalScale * finalScale}px`, height: `${80 * optimalScale * finalScale}px` }}>
            {renderDishImage(dish)}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-medium" style={nameStyle}>{dish.name}</div>
            <div className="flex flex-col items-end" style={{ gap: `${4 * optimalScale * finalScale}px` }}>
              <span className="font-semibold" style={priceStyle}>
                {formatPrice(dish.price, dish.priceString, dish.unit)}
              </span>
              {dish.originalPrice && (
                renderOriginalPrice(
                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                  priceStyle,
                  0.6
                )
              )}
            </div>
          </div>
          {dish.description && (
            <div style={descStyle}>
              {dish.description}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDishCard = (dish: any) => {
    const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
    const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
    const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.85, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
    
    return (
      <div className="bg-white bg-opacity-90 rounded-lg p-4 shadow-md" style={{ padding: `${16 * optimalScale * finalScale}px` }}>
        {dish.image && dish.image.trim() !== '' && (
          <div className="w-full rounded-lg overflow-hidden bg-gray-100 mb-3" style={{ height: `${128 * optimalScale * finalScale}px`, marginBottom: `${12 * optimalScale * finalScale}px` }}>
            {renderDishImage(dish)}
          </div>
        )}
        <div className="flex items-start justify-between mb-2" style={{ marginBottom: `${8 * optimalScale * finalScale}px` }}>
          <div className="font-medium" style={nameStyle}>{dish.name}</div>
          <div className="flex flex-col items-end" style={{ gap: `${4 * optimalScale * finalScale}px` }}>
            <span className="font-semibold" style={priceStyle}>
              {formatPrice(dish.price, dish.unit)}
            </span>
            {dish.originalPrice && (
              renderOriginalPrice(
                formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                priceStyle,
                0.6
              )
            )}
          </div>
        </div>
        {dish.description && (
          <div style={descStyle}>
            {dish.description}
          </div>
        )}
      </div>
    );
  };

  const renderDishListItem = (dish: any) => {
    const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
    const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
    const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.7, style.textColor + '99', deviceConfig.scale * optimalScale, finalScale);
    
    return (
      <div className="flex items-center justify-between py-2 border-b border-gray-200" style={{ paddingTop: `${8 * optimalScale * finalScale}px`, paddingBottom: `${8 * optimalScale * finalScale}px` }}>
        <div className="flex items-center gap-3" style={{ gap: `${12 * optimalScale * finalScale}px` }}>
          {dish.image && dish.image.trim() !== '' && (
            <div className="rounded-lg overflow-hidden bg-gray-100" style={{ width: `${48 * optimalScale * finalScale}px`, height: `${48 * optimalScale * finalScale}px` }}>
              {renderDishImage(dish)}
            </div>
          )}
          <div>
            <div className="font-medium" style={nameStyle}>{dish.name}</div>
            {dish.description && (
              <div style={descStyle}>
                {dish.description}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end" style={{ gap: `${4 * optimalScale * finalScale}px` }}>
          <span className="font-semibold" style={priceStyle}>
            {formatPrice(dish.price, dish.priceString, dish.unit)}
          </span>
          {dish.originalPrice && (
            renderOriginalPrice(
              formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
              priceStyle,
              0.6
            )
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (style.layoutType) {
      case 'horizontal':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize * 0.9, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.7, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                      
                      return (
                        <div key={dish.id} className="flex flex-col gap-2" style={{ gap: `${8 * optimalScale * finalScale}px` }}>
                          {dish.image && dish.image.trim() !== '' && (
                            <div className="w-full h-24 rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow" style={{ height: `${96 * optimalScale * finalScale}px` }}>
                              {renderDishImage(dish)}
                            </div>
                          )}
                          <div className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-gray-50 transition-colors" style={{ padding: `${8 * optimalScale * finalScale}px` }}>
                            <div className="font-medium" style={nameStyle}>{dish.name}</div>
                            {dish.description && (
                              <div style={descStyle}>
                                {dish.description}
                              </div>
                            )}
                            <div className="flex flex-col items-center mt-1" style={{ gap: `${4 * optimalScale * finalScale}px`, marginTop: `${4 * optimalScale * finalScale}px` }}>
                              <span className="font-semibold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.6
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'grid':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="grid grid-cols-3 gap-4" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize * 0.85, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.65, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                      
                      return (
                        <div key={dish.id} className="bg-white bg-opacity-90 rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ padding: `${12 * optimalScale * finalScale}px` }}>
                          {dish.image && dish.image.trim() !== '' && (
                            <div className="w-full h-20 rounded-lg overflow-hidden bg-gray-100 mb-2 shadow-sm" style={{ height: `${80 * optimalScale * finalScale}px`, marginBottom: `${8 * optimalScale * finalScale}px` }}>
                              {renderDishImage(dish)}
                            </div>
                          )}
                          <div className="flex flex-col items-center text-center">
                            <div className="font-medium" style={nameStyle}>{dish.name}</div>
                            {dish.description && (
                              <div style={descStyle}>
                                {dish.description}
                              </div>
                            )}
                            <div className="flex flex-col items-center mt-2" style={{ gap: `${4 * optimalScale * finalScale}px`, marginTop: `${8 * optimalScale * finalScale}px` }}>
                              <span className="font-semibold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.6
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'card':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="flex flex-col" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.85, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                      
                      return (
                        <div key={dish.id} className="bg-white bg-opacity-95 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 flex gap-4 transform hover:-translate-y-1" style={{ padding: `${16 * optimalScale * finalScale}px`, gap: `${16 * optimalScale * finalScale}px` }}>
                          {dish.image && dish.image.trim() !== '' && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-gray-100" style={{ width: `${80 * optimalScale * finalScale}px`, height: `${80 * optimalScale * finalScale}px` }}>
                              {renderDishImage(dish)}
                            </div>
                          )}
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="font-medium" style={nameStyle}>{dish.name}</div>
                            {dish.description && (
                              <div style={descStyle}>
                                {dish.description}
                              </div>
                            )}
                            <div className="flex flex-col items-start mt-2" style={{ gap: `${4 * optimalScale * finalScale}px`, marginTop: `${8 * optimalScale * finalScale}px` }}>
                              <span className="font-semibold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.6
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'list':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="space-y-1" style={{ gap: `${4 * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish) => (
                      <div key={dish.id}>
                        {renderDishListItem(dish)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'magazine':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category, catIndex) => (
              <div key={category.id} className="relative">
                <h2
                  className="font-semibold mb-3 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.25 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${12 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-5 h-5 rounded-full mr-2 object-cover" style={{ width: `${20 * optimalScale * finalScale}px`, height: `${20 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="grid grid-cols-12 gap-3" style={{ gap: `${12 * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish, dishIndex) => {
                      const isLarge = dishIndex === 0 && catIndex === 0;
                      const isDouble = dishIndex % 3 === 1 && !isLarge;
                      const isTriple = dishIndex % 3 === 2 && !isLarge;
                      
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, isLarge ? style.fontSize * 1.15 : style.fontSize * 0.9, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, isLarge ? style.fontSize * 1.05 : style.fontSize * 0.85, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.75, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                      
                      return (
                        <div
                          key={dish.id}
                          className={isLarge ? 'col-span-12' : isDouble ? 'col-span-5' : isTriple ? 'col-span-4' : 'col-span-3'}
                        >
                          <div className="bg-white bg-opacity-80 rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
                            {dish.image && dish.image.trim() !== '' && (
                              <div className={`overflow-hidden`} style={{ height: isLarge ? `${160 * optimalScale * finalScale}px` : `${112 * optimalScale * finalScale}px` }}>
                                {renderDishImage(dish)}
                              </div>
                            )}
                            <div className="flex-1 flex flex-col justify-center" style={{ padding: `${10 * optimalScale * finalScale}px` }}>
                              <div className="flex flex-col items-center text-center">
                                <div className="font-medium" style={nameStyle}>{dish.name}</div>
                                {dish.description && (
                                  <div style={{ ...descStyle, marginTop: `${2 * optimalScale * finalScale}px` }}>
                                    {dish.description}
                                  </div>
                                )}
                                <div className="flex flex-col items-center" style={{ gap: `${4 * optimalScale * finalScale}px`, marginTop: `${6 * optimalScale * finalScale}px` }}>
                                  <span className="font-semibold" style={priceStyle}>
                                    {formatPrice(dish.price, dish.priceString, dish.unit)}
                                  </span>
                                  {dish.originalPrice && (
                                    renderOriginalPrice(
                                      formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                      priceStyle,
                                      0.6
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'compact':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-2 pb-1 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.15 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '20',
                    marginBottom: `${8 * optimalScale * finalScale}px`,
                    paddingBottom: `${4 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-4 h-4 rounded-full mr-2 object-cover" style={{ width: `${16 * optimalScale * finalScale}px`, height: `${16 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-sm">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5" style={{ gap: `${style.spacing.dishGap * 0.5 * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize * 0.85, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize * 0.8, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.65, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                      
                      return (
                        <div key={dish.id} className="bg-white bg-opacity-75 rounded px-2 py-2" style={{ paddingLeft: `${8 * optimalScale * finalScale}px`, paddingRight: `${8 * optimalScale * finalScale}px`, paddingTop: `${8 * optimalScale * finalScale}px`, paddingBottom: `${8 * optimalScale * finalScale}px` }}>
                          <div className="flex items-center justify-between">
                            <div className="font-medium truncate" style={nameStyle}>{dish.name}</div>
                            <span className="font-semibold whitespace-nowrap ml-2" style={{ ...priceStyle, marginLeft: `${8 * optimalScale * finalScale}px` }}>
                              {formatPrice(dish.price, dish.priceString, dish.unit)}
                            </span>
                          </div>
                          {dish.description && (
                            <div style={{ ...descStyle, marginTop: `${2 * optimalScale * finalScale}px` }} className="text-xs truncate">
                              {dish.description}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'premium':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <div className="text-center mb-6" style={{ marginBottom: `${24 * optimalScale * finalScale}px` }}>
                  <div className="">
                    <h2
                      className="font-semibold tracking-wider"
                      style={{
                        fontSize: `${style.fontSize * 1.3 * optimalScale * finalScale}px`,
                        color: style.textColor,
                        borderBottom: `2px solid ${style.textColor}40`,
                        paddingBottom: `${8 * optimalScale * finalScale}px`,
                        display: 'inline-block'
                      }}
                    >
                      {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-5 h-5 rounded-full mr-2 inline object-cover" style={{ width: `${20 * optimalScale * finalScale}px`, height: `${20 * optimalScale * finalScale}px` }} /> : <span className="mr-2">{category.icon}</span>)}
                      {category.name}
                    </h2>
                  </div>
                </div>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="space-y-4" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish, index) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.75, style.textColor + '88', deviceConfig.scale * optimalScale, finalScale);
                      
                      return (
                        <div key={dish.id} className="relative">
                          <div className="flex items-baseline justify-between mb-1" style={{ marginBottom: `${4 * optimalScale * finalScale}px` }}>
                            <div className="font-medium" style={nameStyle}>{dish.name}</div>
                            <span className="font-semibold" style={priceStyle}>
                              {formatPrice(dish.price, dish.priceString, dish.unit)}
                            </span>
                          </div>
                          <div className="absolute inset-x-0 top-3 border-t border-dashed border-gray-300" style={{ borderColor: style.textColor + '30', top: `${12 * optimalScale * finalScale}px` }}></div>
                          <div className="flex items-baseline justify-between" style={{ marginTop: `${4 * optimalScale * finalScale}px` }}>
                            {dish.description && (
                              <div style={descStyle} className="text-sm">
                                {dish.description}
                              </div>
                            )}
                            {dish.originalPrice && (
                              <span
                                data-original-price="true"
                                className="whitespace-nowrap"
                                style={{
                                  color: priceStyle.color,
                                  fontFamily: priceStyle.fontFamily,
                                  fontSize: `calc(${priceStyle.fontSize} * 0.8)`,
                                  textDecoration: 'line-through',
                                  opacity: 0.5,
                                }}
                              >
                                {formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'carousel':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="overflow-x-auto pb-2" style={{ paddingBottom: `${8 * optimalScale * finalScale}px` }}>
                    <div className="flex gap-4" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px`, minWidth: 'max-content' }}>
                      {category.dishes.map((dish) => {
                        const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                        const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize * 0.85, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                        const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.7, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                        
                        return (
                          <div key={dish.id} className="flex-shrink-0" style={{ width: `${192 * optimalScale * finalScale}px` }}>
                            <div className="bg-white bg-opacity-90 rounded-xl overflow-hidden shadow-lg h-full">
                              {dish.image && dish.image.trim() !== '' && (
                                <div className="w-full overflow-hidden" style={{ height: `${128 * optimalScale * finalScale}px` }}>
                                  {renderDishImage(dish)}
                                </div>
                              )}
                              <div style={{ padding: `${12 * optimalScale * finalScale}px` }}>
                                <div className="text-center">
                              <div className="font-medium" style={nameStyle}>{dish.name}</div>
                              {dish.description && (
                                <div style={{ ...descStyle, marginTop: `${4 * optimalScale * finalScale}px` }} className="text-xs">
                                  {dish.description}
                                </div>
                              )}
                              <div className="flex flex-col items-center" style={{ marginTop: `${8 * optimalScale * finalScale}px` }}>
                                <span className="font-semibold text-lg" style={priceStyle}>
                                  {formatPrice(dish.price, dish.priceString, dish.unit)}
                                </span>
                                {dish.originalPrice && (
                                  renderOriginalPrice(
                                    formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                    priceStyle,
                                    0.6
                                  )
                                )}
                              </div>
                            </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'polaroid':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize * 0.85, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.7, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                      
                      return (
                        <div key={dish.id} className="flex flex-col items-center">
                          <div className="bg-white shadow-lg transform rotate-1 hover:rotate-0 transition-transform" style={{ padding: `${12 * optimalScale * finalScale}px`, paddingBottom: `${32 * optimalScale * finalScale}px`, width: `${200 * optimalScale * finalScale}px` }}>
                            {dish.image && dish.image.trim() !== '' ? (
                              <div className="w-full bg-gray-200 overflow-hidden" style={{ height: `${140 * optimalScale * finalScale}px` }}>
                                {renderDishImage(dish)}
                              </div>
                            ) : (
                              <div className="w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{ height: `${140 * optimalScale * finalScale}px` }}>
                                <div className="text-gray-400 text-4xl">🍽️</div>
                              </div>
                            )}
                          </div>
                          <div className="text-center mt-3 z-10" style={{ marginTop: `${12 * optimalScale * finalScale}px` }}>
                            <div className="font-medium" style={nameStyle}>{dish.name}</div>
                            {dish.description && (
                              <div style={{ ...descStyle, marginTop: `${4 * optimalScale * finalScale}px` }} className="text-xs">
                                {dish.description}
                              </div>
                            )}
                            <div className="flex flex-col items-center" style={{ marginTop: `${8 * optimalScale * finalScale}px` }}>
                              <span className="font-semibold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.6
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'featured':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="space-y-4">
                    {category.dishes.map((dish, index) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.8, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                      
                      if (index === 0) {
                        return (
                          <div key={dish.id} className="bg-white rounded-xl p-4 shadow-lg" style={{ padding: `${16 * optimalScale * finalScale}px` }}>
                            <div className="flex gap-4" style={{ gap: `${16 * optimalScale * finalScale}px` }}>
                              {dish.image && dish.image.trim() !== '' && (
                                <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0" style={{ width: `${128 * optimalScale * finalScale}px`, height: `${128 * optimalScale * finalScale}px` }}>
                                  {renderDishImage(dish)}
                                </div>
                              )}
                              <div className="flex-1 flex flex-col justify-center">
                                <div className="font-bold text-lg" style={{ ...nameStyle, fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px` }}>{dish.name}</div>
                                {dish.description && (
                                  <div style={{ ...descStyle, marginTop: `${8 * optimalScale * finalScale}px` }}>
                                    {dish.description}
                                  </div>
                                )}
                                <div className="flex flex-col items-start mt-3" style={{ gap: `${4 * optimalScale * finalScale}px`, marginTop: `${12 * optimalScale * finalScale}px` }}>
                                  <span className="font-bold text-xl" style={{ ...priceStyle, fontSize: `${style.fontSize * 1.3 * optimalScale * finalScale}px` }}>
                                    {formatPrice(dish.price, dish.priceString, dish.unit)}
                                  </span>
                                  {dish.originalPrice && (
                                    renderOriginalPrice(
                                      formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                      priceStyle,
                                      0.6
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={dish.id} className="bg-white rounded-lg p-3 shadow-md flex gap-3" style={{ padding: `${12 * optimalScale * finalScale}px`, gap: `${12 * optimalScale * finalScale}px` }}>
                          {dish.image && dish.image.trim() !== '' && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ width: `${64 * optimalScale * finalScale}px`, height: `${64 * optimalScale * finalScale}px` }}>
                              {renderDishImage(dish)}
                            </div>
                          )}
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <div className="font-medium" style={nameStyle}>{dish.name}</div>
                              {dish.description && (
                                <div style={{ ...descStyle, marginTop: `${4 * optimalScale * finalScale}px` }} className="text-xs">
                                  {dish.description}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end" style={{ marginLeft: `${12 * optimalScale * finalScale}px` }}>
                              <span className="font-semibold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.6
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'masonry':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="grid grid-cols-3 gap-3" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish, index) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize * 0.8, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize * 0.75, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.6, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                      
                      const heights = [160, 120, 140, 180, 130, 150];
                      const height = heights[index % heights.length];
                      
                      return (
                        <div key={dish.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                          {dish.image && dish.image.trim() !== '' && (
                            <div className="overflow-hidden" style={{ height: `${height * optimalScale * finalScale}px` }}>
                              {renderDishImage(dish)}
                            </div>
                          )}
                          <div style={{ padding: `${8 * optimalScale * finalScale}px` }}>
                            <div className="text-center font-medium truncate" style={nameStyle}>{dish.name}</div>
                            {dish.description && (
                              <div style={{ ...descStyle, marginTop: `${4 * optimalScale * finalScale}px`, textAlign: 'center' }} className="text-xs truncate">
                                {dish.description}
                              </div>
                            )}
                            <div className="text-center mt-2" style={{ marginTop: `${8 * optimalScale * finalScale}px` }}>
                              <span className="font-semibold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'alternating':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="space-y-4">
                    {category.dishes.map((dish, index) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.8, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                      const isEven = index % 2 === 0;
                      
                      return (
                        <div key={dish.id} className={`flex gap-4 items-center ${isEven ? '' : 'flex-row-reverse'}`} style={{ gap: `${16 * optimalScale * finalScale}px` }}>
                          {dish.image && dish.image.trim() !== '' && (
                            <div className="w-1/3 rounded-lg overflow-hidden shadow-md flex-shrink-0" style={{ width: `${120 * optimalScale * finalScale}px`, height: `${80 * optimalScale * finalScale}px` }}>
                              {renderDishImage(dish)}
                            </div>
                          )}
                          <div className={`flex-1 ${isEven ? 'text-left' : 'text-right'}`}>
                            <div className="font-medium" style={nameStyle}>{dish.name}</div>
                            {dish.description && (
                              <div style={{ ...descStyle, marginTop: `${8 * optimalScale * finalScale}px` }}>
                                {dish.description}
                              </div>
                            )}
                            <div className={`flex flex-col ${isEven ? 'items-start' : 'items-end'} mt-2`} style={{ marginTop: `${8 * optimalScale * finalScale}px` }}>
                              <span className="font-semibold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.6
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'minimal':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-6"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    marginBottom: `${24 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 inline object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="space-y-6">
                    {category.dishes.map((dish) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.75, style.textColor + '88', deviceConfig.scale * optimalScale, finalScale);
                      
                      return (
                        <div key={dish.id} className="relative">
                          <div className="flex items-end justify-between mb-2" style={{ marginBottom: `${8 * optimalScale * finalScale}px` }}>
                            <div className="font-medium" style={nameStyle}>{dish.name}</div>
                            <div className="flex flex-col items-end">
                              <span className="font-semibold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.5
                                )
                              )}
                            </div>
                          </div>
                          <div className="absolute inset-x-0 top-full border-t" style={{ borderColor: style.textColor + '20', top: `${20 * optimalScale * finalScale}px` }}></div>
                          {dish.description && (
                            <div style={{ ...descStyle, marginTop: `${8 * optimalScale * finalScale}px` }}>
                              {dish.description}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'elegant':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <div className="text-center mb-6" style={{ marginBottom: `${24 * optimalScale * finalScale}px` }}>
                  <div className=" px-6 py-3 rounded-lg" style={{ backgroundColor: style.textColor + '08' }}>
                    <h2
                      className="font-semibold tracking-wide"
                      style={{
                        fontSize: `${style.fontSize * 1.3 * optimalScale * finalScale}px`,
                        color: style.textColor}}
                    >
                      {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-5 h-5 rounded-full mr-2 inline object-cover" style={{ width: `${20 * optimalScale * finalScale}px`, height: `${20 * optimalScale * finalScale}px` }} /> : <span className="mr-2">{category.icon}</span>)}
                      {category.name}
                    </h2>
                  </div>
                </div>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="space-y-3">
                    {category.dishes.map((dish) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize * 0.95, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize * 0.95, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.75, style.textColor + '99', deviceConfig.scale * optimalScale, finalScale);
                      
                      return (
                        <div key={dish.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border-l-4" style={{ padding: `${16 * optimalScale * finalScale}px`, borderLeftColor: style.textColor + '60', borderLeftWidth: `${3 * optimalScale * finalScale}px` }}>
                          <div className="flex items-center justify-between gap-4" style={{ gap: `${16 * optimalScale * finalScale}px` }}>
                            {dish.image && dish.image.trim() !== '' && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ width: `${64 * optimalScale * finalScale}px`, height: `${64 * optimalScale * finalScale}px` }}>
                                {renderDishImage(dish)}
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-medium" style={nameStyle}>{dish.name}</div>
                              {dish.description && (
                                <div style={{ ...descStyle, marginTop: `${4 * optimalScale * finalScale}px` }}>
                                  {dish.description}
                                </div>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0 flex flex-col items-end">
                              <span className="font-semibold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.5
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'mosaic':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2" style={{ gap: `${8 * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish, index) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize * 0.75, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize * 0.7, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      
                      const isLarge = index === 0;
                      const spanClass = isLarge ? 'col-span-2 row-span-2' : '';
                      
                      return (
                        <div key={dish.id} className={`relative overflow-hidden rounded-lg ${spanClass}`} style={{ backgroundColor: style.textColor + '08' }}>
                          {dish.image && dish.image.trim() !== '' ? (
                            <div className="w-full overflow-hidden" style={{ height: isLarge ? `${200 * optimalScale * finalScale}px` : `${120 * optimalScale * finalScale}px` }}>
                              {renderDishImage(dish)}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center" style={{ height: isLarge ? `${200 * optimalScale * finalScale}px` : `${120 * optimalScale * finalScale}px` }}>
                              <div className="text-4xl opacity-30">🍽️</div>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                            <div className="text-white font-medium truncate" style={{ ...nameStyle, fontSize: `${style.fontSize * 0.8 * optimalScale * finalScale}px` }}>{dish.name}</div>
                            <div className="text-white/90 font-semibold" style={{ ...priceStyle, fontSize: `${style.fontSize * 0.85 * optimalScale * finalScale}px` }}>
                              {formatPrice(dish.price, dish.priceString, dish.unit)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'custom':
        const customColumns = style.customLayout?.columns || 3;
        const customRows = style.customLayout?.rows || 2;
        
        // 计算最大可用列数和行数
        const minCardWidth = 120; // 最小卡片宽度（像素）
        const minCardHeight = 160; // 最小卡片高度（像素）
        const padding = 64; // 页面内边距（像素）
        const colGap = style.spacing.dishGap * mmToPixelRatio;
        const rowGap = style.spacing.dishGap * mmToPixelRatio;
        
        const availableWidth = pageWidth - padding * 2;
        const availableHeight = pageHeight - padding * 2;
        
        // 计算最大允许的列数和行数
        let maxColumns = customColumns;
        let maxRows = customRows;
        
        // 找到最大允许的列数
        for (let c = customColumns; c >= 1; c--) {
          const requiredWidth = minCardWidth * c + colGap * (c - 1);
          if (requiredWidth <= availableWidth) {
            maxColumns = c;
            break;
          }
        }
        
        // 找到最大允许的行数
        for (let r = customRows; r >= 1; r--) {
          const requiredHeight = minCardHeight * r + rowGap * (r - 1);
          if (requiredHeight <= availableHeight) {
            maxRows = r;
            break;
          }
        }
        
        const isOver = maxColumns < customColumns || maxRows < customRows;
        
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {/* 显示超出范围的提示 */}
            {isOver && (
              <div 
                className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm mb-4"
                style={{
                  fontSize: `${12 * optimalScale * finalScale}px`,
                  padding: `${8 * optimalScale * finalScale}px ${16 * optimalScale * finalScale}px`,
                  marginBottom: `${16 * optimalScale * finalScale}px`
                }}
              >
                {maxColumns < customColumns && maxRows < customRows ? (
                  <>列数和行数超出页面大小范围，已自动隐藏最后{customColumns - maxColumns}列和最后{customRows - maxRows}行</>
                ) : maxColumns < customColumns ? (
                  <>列数超出页面大小范围，已自动隐藏最后{customColumns - maxColumns}列</>
                ) : (
                  <>行数超出页面大小范围，已自动隐藏最后{customRows - maxRows}行</>
                )}
              </div>
            )}
            
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div 
                    className="grid gap-4" 
                    style={{ 
                      gridTemplateColumns: `repeat(${maxColumns}, 1fr)`,
                      gap: `${style.spacing.dishGap * optimalScale * finalScale}px` 
                    }}
                  >
                    {category.dishes.slice(0, maxColumns * maxRows).map((dish) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize * 0.85, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.7, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                      
                      return (
                        <div 
                          key={dish.id} 
                          className="bg-white bg-opacity-90 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                          style={{ padding: `${16 * optimalScale * finalScale}px` }}
                        >
                          {dish.image && dish.image.trim() !== '' && (
                            <div 
                              className="w-full rounded-lg overflow-hidden bg-gray-100 mb-3 shadow-sm" 
                              style={{ 
                                height: `${(160 / maxRows) * optimalScale * finalScale}px`, 
                                marginBottom: `${12 * optimalScale * finalScale}px` 
                              }}
                            >
                              {renderDishImage(dish)}
                            </div>
                          )}
                          <div className="flex flex-col items-center text-center">
                            <div className="font-medium" style={nameStyle}>{dish.name}</div>
                            {dish.description && (
                              <div style={descStyle} className="mt-1">
                                {dish.description}
                              </div>
                            )}
                            <div className="flex flex-col items-center mt-2" style={{ gap: `${4 * optimalScale * finalScale}px`, marginTop: `${8 * optimalScale * finalScale}px` }}>
                              <span className="font-semibold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.6
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'spotlight':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => {
              const hasDishes = category.dishes.length > 0;
              const firstDish = hasDishes ? category.dishes[0] : null;
              const remainingDishes = hasDishes ? category.dishes.slice(1) : [];
              
              return (
                <div key={category.id}>
                  <h2
                    className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                    style={{
                      fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                      borderColor: style.textColor + '30',
                      marginBottom: `${16 * optimalScale * finalScale}px`,
                      paddingBottom: `${8 * optimalScale * finalScale}px`}}
                  >
                    {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                    {category.name}
                  </h2>

                  {!hasDishes ? (
                    <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                  ) : (
                    <div className="space-y-6" style={{ gap: `${style.spacing.dishGap * 2 * optimalScale * finalScale}px` }}>
                      {/* 聚光灯菜品 */}
                      {firstDish && (
                        <div 
                          className="bg-white bg-opacity-95 rounded-2xl p-6 shadow-2xl border-2 border-amber-400"
                          style={{ padding: `${24 * optimalScale * finalScale}px` }}
                        >
                          <div className="flex items-center gap-6" style={{ gap: `${24 * optimalScale * finalScale}px` }}>
                            {firstDish.image && firstDish.image.trim() !== '' && (
                              <div 
                                className="flex-shrink-0 rounded-xl overflow-hidden shadow-lg"
                                style={{ width: `${240 * optimalScale * finalScale}px`, height: `${200 * optimalScale * finalScale}px` }}
                              >
                                {renderDishImage(firstDish)}
                              </div>
                            )}
                            <div className="flex-1 flex flex-col justify-center">
                              <div 
                                className="text-amber-600 font-bold mb-2 flex items-center gap-2"
                                style={{ fontSize: `${style.fontSize * 0.9 * optimalScale * finalScale}px`, marginBottom: `${8 * optimalScale * finalScale}px`, gap: `${8 * optimalScale * finalScale}px` }}
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ width: `${20 * optimalScale * finalScale}px`, height: `${20 * optimalScale * finalScale}px` }}>
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                招牌推荐
                              </div>
                              <div 
                                className="font-bold text-2xl"
                                style={{ 
                                  ...getTextStyle(firstDish.nameStyle, style.fontFamily, style.fontSize * 1.5, style.textColor, deviceConfig.scale * optimalScale, finalScale),
                                  marginBottom: `${8 * optimalScale * finalScale}px`
                                }}
                              >
                                {firstDish.name}
                              </div>
                              {firstDish.description && (
                                <div 
                                  className="text-gray-600 mb-4"
                                  style={{ 
                                    ...getTextStyle(firstDish.descriptionStyle, style.fontFamily, style.fontSize * 1.1, style.textColor + '88', deviceConfig.scale * optimalScale, finalScale),
                                    marginBottom: `${16 * optimalScale * finalScale}px`
                                  }}
                                >
                                  {firstDish.description}
                                </div>
                              )}
                              <div className="flex flex-col items-start" style={{ gap: `${4 * optimalScale * finalScale}px` }}>
                                <span 
                                  className="font-bold text-3xl text-amber-600"
                                  style={{
                                    ...getTextStyle(firstDish.priceStyle, style.fontFamily, style.fontSize * 1.8, style.textColor, deviceConfig.scale * optimalScale, finalScale),
                                    color: '#d97706'
                                  }}
                                >
                                  {formatPrice(firstDish.price, firstDish.priceString, firstDish.unit)}
                                </span>
                                {firstDish.originalPrice && (
                                  renderOriginalPrice(
                                    formatPrice(firstDish.originalPrice, firstDish.originalPriceString, firstDish.unit),
                                    getTextStyle(firstDish.priceStyle, style.fontFamily, style.fontSize * 1.2, style.textColor, deviceConfig.scale * optimalScale, finalScale),
                                    0.5
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 其他菜品 */}
                      {remainingDishes.length > 0 && (
                        <div className="grid grid-cols-2 gap-4" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                          {remainingDishes.map((dish) => {
                            const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize * 0.95, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                            const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize * 0.9, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                            const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.75, style.textColor + '99', deviceConfig.scale * optimalScale, finalScale);
                            
                            return (
                              <div 
                                key={dish.id} 
                                className="bg-white bg-opacity-85 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
                                style={{ padding: `${16 * optimalScale * finalScale}px` }}
                              >
                                <div className="flex items-start gap-4" style={{ gap: `${16 * optimalScale * finalScale}px` }}>
                                  {dish.image && dish.image.trim() !== '' && (
                                    <div 
                                      className="flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                                      style={{ width: `${100 * optimalScale * finalScale}px`, height: `${80 * optimalScale * finalScale}px` }}
                                    >
                                      {renderDishImage(dish)}
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium" style={nameStyle}>{dish.name}</div>
                                    {dish.description && (
                                      <div style={descStyle} className="mt-1 truncate">
                                        {dish.description}
                                      </div>
                                    )}
                                    <div className="flex flex-col items-start mt-2" style={{ gap: `${4 * optimalScale * finalScale}px`, marginTop: `${8 * optimalScale * finalScale}px` }}>
                                      <span className="font-semibold" style={priceStyle}>
                                        {formatPrice(dish.price, dish.priceString, dish.unit)}
                                      </span>
                                      {dish.originalPrice && (
                                        renderOriginalPrice(
                                          formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                          priceStyle,
                                          0.6
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      case 'gallery':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="grid grid-cols-3 gap-4" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish, index) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize * 1.1, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      
                      // 不同位置使用不同大小
                      const isLarge = index % 4 === 0;
                      const colSpan = isLarge ? 'col-span-2 row-span-2' : '';
                      const height = isLarge ? 240 : 140;
                      
                      return (
                        <div
                          key={dish.id}
                          className={`relative overflow-hidden rounded-xl group ${colSpan}`}
                        >
                          {dish.image && dish.image.trim() !== '' ? (
                            <div className="w-full transition-transform duration-500 group-hover:scale-105" style={{ height: `${height * optimalScale * finalScale}px` }}>
                              {renderDishImage(dish)}
                            </div>
                          ) : (
                            <div 
                              className="w-full flex items-center justify-center bg-gray-100"
                              style={{ height: `${height * optimalScale * finalScale}px` }}
                            >
                              <div className="text-4xl opacity-30">🍽️</div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                            <div className="absolute bottom-0 left-0 right-0 p-4" style={{ padding: `${16 * optimalScale * finalScale}px` }}>
                              <div className="text-white font-medium mb-1" style={{ ...nameStyle, color: '#ffffff', marginBottom: `${4 * optimalScale * finalScale}px` }}>{dish.name}</div>
                              <div className="text-white font-bold" style={{ ...priceStyle, color: '#ffffff' }}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'newspaper':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b-2 flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.5 * optimalScale * finalScale}px`,
                    borderColor: style.textColor,
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="grid grid-cols-2 gap-x-8" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.75, style.textColor + '99', deviceConfig.scale * optimalScale, finalScale);
                      
                      return (
                        <div key={dish.id} className="flex flex-col border-b border-dashed pb-4" style={{ paddingBottom: `${16 * optimalScale * finalScale}px` }}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-bold" style={nameStyle}>{dish.name}</div>
                              {dish.description && (
                                <div className="mt-1" style={descStyle}>
                                  {dish.description}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end" style={{ marginLeft: `${8 * optimalScale * finalScale}px` }}>
                              <span className="font-bold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.5
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'tag':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="flex flex-wrap gap-3" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish, index) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const colors = ['#FFF3CD', '#D1FAE5', '#DBEAFE', '#FCE7F3', '#FEF3C7', '#E0E7FF', '#FEE2E2', '#F0FDF4'];
                      const bgColor = colors[index % colors.length];
                      
                      return (
                        <div key={dish.id} className="px-4 py-3 rounded-lg shadow-sm" style={{ padding: `${12 * optimalScale * finalScale}px`, backgroundColor: bgColor }}>
                          <div className="font-medium text-center" style={nameStyle}>{dish.name}</div>
                          <div className="text-center mt-1" style={{ marginTop: `${4 * optimalScale * finalScale}px` }}>
                            <span className="font-semibold" style={priceStyle}>
                              {formatPrice(dish.price, dish.priceString, dish.unit)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'vertical':
      default:
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => {
              const textAlign = category.textAlign || 'left';
              const h2AlignClass = textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start';
              const dishAlignClass = textAlign === 'center' ? 'flex-col items-center text-center' : textAlign === 'right' ? 'flex-row-reverse' : '';
              
              return (
                <CategoryWrapper 
                  key={category.id} 
                  category={category} 
                  style={style} 
                  optimalScale={optimalScale} 
                  finalScale={finalScale}
                >
                  <h2
                    className={`font-semibold mb-4 pb-2 border-b flex items-center gap-2 ${h2AlignClass}`}
                    style={{
                      fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                      borderColor: style.textColor + '30',
                      marginBottom: `${16 * optimalScale * finalScale}px`,
                      paddingBottom: `${8 * optimalScale * finalScale}px`,
                      width: '100%'}}
                  >
                    {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                    {category.name}
                  </h2>

                  {category.dishes.length === 0 ? (
                    <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                  ) : (
                    <div className="flex flex-col" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px`, width: '100%' }}>
                      {category.dishes.map((dish) => {
                        const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                        const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                        const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.85, style.textColor + 'CC', deviceConfig.scale * optimalScale, finalScale);
                        
                        return (
                          <div 
                            key={dish.id} 
                            className={`flex items-start gap-4 ${dishAlignClass}`} 
                            style={{ gap: `${16 * optimalScale * finalScale}px`, width: '100%' }}
                          >
                            {dish.image && dish.image.trim() !== '' && (
                              <div className="flex-shrink-0 rounded-lg overflow-hidden bg-gray-100" style={{ width: `${80 * optimalScale * finalScale}px`, height: `${80 * optimalScale * finalScale}px` }}>
                                {renderDishImage(dish)}
                              </div>
                            )}
                            <div className="flex-1" style={{ textAlign: textAlign as any }}>
                              <div className="flex justify-between items-baseline" style={{ flexDirection: textAlign === 'right' ? 'row-reverse' : 'row' }}>
                                <div className="font-medium" style={nameStyle}>{dish.name}</div>
                                <span className="font-semibold whitespace-nowrap" style={priceStyle}>
                                  {formatPrice(dish.price, dish.priceString, dish.unit)}
                                </span>
                              </div>
                              <div className="flex justify-between items-baseline" style={{ flexDirection: textAlign === 'right' ? 'row-reverse' : 'row', marginTop: `${4 * optimalScale * finalScale}px` }}>
                                {dish.description && (
                                  <div style={descStyle}>
                                    {dish.description}
                                  </div>
                                )}
                                {dish.originalPrice && (
                                  <span
                                    data-original-price="true"
                                    className="whitespace-nowrap"
                                    style={{
                                      color: priceStyle.color,
                                      fontFamily: priceStyle.fontFamily,
                                      fontSize: `calc(${priceStyle.fontSize} * 0.8)`,
                                      textDecoration: 'line-through',
                                      opacity: 0.6,
                                    }}
                                  >
                                    {formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CategoryWrapper>
              );
            })}
          </div>
        );
    }
  };

  // 在 disableScaling 模式下，使用完全独立的渲染逻辑，不使用任何缩放
  if (disableScaling) {
    // 创建一个不依赖缩放的 text style 函数
    const getTextStyleNoScale = (customStyle: TextStyle | undefined, defaultFontFamily: string, defaultFontSize: number, defaultColor: string) => {
      return {
        fontFamily: customStyle?.fontFamily || defaultFontFamily,
        fontSize: customStyle?.fontSize ? `${customStyle.fontSize}px` : `${defaultFontSize}px`,
        color: customStyle?.textColor || defaultColor};
    };

    // 渲染菜品图片（无缩放）
    const renderDishImageNoScale = (dish: any) => {
      return (
        <img
          src={dish.image}
          alt={dish.name}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'}}
        />
      );
    };

    // 垂直布局（无缩放）
    const renderVerticalNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                borderColor: style.textColor + '30',
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="flex flex-col" style={{ gap: `${style.spacing.dishGap}px` }}>
                {category.dishes.map((dish) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.85, style.textColor + 'CC');
                  
                  return (
                    <div key={dish.id} className="flex items-start gap-4">
                      {dish.image && dish.image.trim() !== '' && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100" style={{ width: '80px', height: '80px' }}>
                          {renderDishImageNoScale(dish)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                          <div className="font-medium" style={nameStyle}>
                            {dish.name}
                          </div>
                          <span className="font-semibold whitespace-nowrap" style={priceStyle}>
                            {formatPrice(dish.price, dish.priceString, dish.unit)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline" style={{ marginTop: '4px' }}>
                          {dish.description && (
                            <div style={descStyle}>
                              {dish.description}
                            </div>
                          )}
                          {dish.originalPrice && (
                            <span
                              data-original-price="true"
                              className="whitespace-nowrap"
                              style={{
                                color: priceStyle.color,
                                fontFamily: priceStyle.fontFamily,
                                fontSize: `calc(${priceStyle.fontSize} * 0.8)`,
                                textDecoration: 'line-through',
                                opacity: 0.6,
                              }}
                            >
                              {formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 水平双栏布局（无缩放）
    const renderHorizontalNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                borderColor: style.textColor + '30',
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="grid grid-cols-2 gap-4" style={{ gap: `${style.spacing.dishGap}px` }}>
                {category.dishes.map((dish) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize * 0.9, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.7, style.textColor + 'B3');
                  
                  return (
                    <div key={dish.id} className="flex flex-col gap-2" style={{ gap: '8px' }}>
                      {dish.image && dish.image.trim() !== '' && (
                        <div className="w-full h-24 rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow" style={{ height: '96px' }}>
                          {renderDishImageNoScale(dish)}
                        </div>
                      )}
                      <div className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-gray-50 transition-colors" style={{ padding: '8px' }}>
                        <div className="font-medium" style={nameStyle}>{dish.name}</div>
                        {dish.description && (
                          <div style={descStyle}>
                            {dish.description}
                          </div>
                        )}
                        <div className="flex flex-col items-center mt-1" style={{ gap: '4px', marginTop: '4px' }}>
                          <span className="font-semibold" style={priceStyle}>
                            {formatPrice(dish.price, dish.priceString, dish.unit)}
                          </span>
                          {dish.originalPrice && (
                            renderOriginalPrice(
                              formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                              priceStyle,
                              0.6
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 网格布局（无缩放）
    const renderGridNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                borderColor: style.textColor + '30',
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="grid grid-cols-3 gap-4" style={{ gap: `${style.spacing.dishGap}px` }}>
                {category.dishes.map((dish) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize * 0.85, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.65, style.textColor + 'B3');
                  
                  return (
                    <div key={dish.id} className="bg-white bg-opacity-90 rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ padding: '12px' }}>
                      {dish.image && dish.image.trim() !== '' && (
                        <div className="w-full h-20 rounded-lg overflow-hidden bg-gray-100 mb-2 shadow-sm" style={{ height: '80px', marginBottom: '8px' }}>
                          {renderDishImageNoScale(dish)}
                        </div>
                      )}
                      <div className="flex flex-col items-center text-center">
                        <div className="font-medium" style={nameStyle}>{dish.name}</div>
                        {dish.description && (
                          <div style={descStyle}>
                            {dish.description}
                          </div>
                        )}
                        <div className="flex flex-col items-center mt-2" style={{ gap: '4px', marginTop: '8px' }}>
                          <span className="font-semibold" style={priceStyle}>
                            {formatPrice(dish.price, dish.priceString, dish.unit)}
                          </span>
                          {dish.originalPrice && (
                            renderOriginalPrice(
                              formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                              priceStyle,
                              0.6
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 自定义布局（无缩放）
    const renderCustomNoScale = () => {
      const customColumns = style.customLayout?.columns || 3;
      const customRows = style.customLayout?.rows || 2;
      
      // 计算最大可用列数和行数（与正常模式相同的逻辑）
      const minCardWidth = 120; // 最小卡片宽度（像素）
      const minCardHeight = 160; // 最小卡片高度（像素）
      const padding = 64; // 页面内边距（像素）
      const colGap = style.spacing.dishGap * mmToPixelRatio;
      const rowGap = style.spacing.dishGap * mmToPixelRatio;
      
      const availableWidth = pageWidth - padding * 2;
      const availableHeight = pageHeight - padding * 2;
      
      // 计算最大允许的列数和行数
      let maxColumns = customColumns;
      let maxRows = customRows;
      
      // 找到最大允许的列数
      for (let c = customColumns; c >= 1; c--) {
        const requiredWidth = minCardWidth * c + colGap * (c - 1);
        if (requiredWidth <= availableWidth) {
          maxColumns = c;
          break;
        }
      }
      
      // 找到最大允许的行数
      for (let r = customRows; r >= 1; r--) {
        const requiredHeight = minCardHeight * r + rowGap * (r - 1);
        if (requiredHeight <= availableHeight) {
          maxRows = r;
          break;
        }
      }
      
      const isOver = maxColumns < customColumns || maxRows < customRows;
      
      return (
        <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
          {/* 显示超出范围的提示 */}
          {isOver && (
            <div 
              className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm mb-4"
              style={{
                fontSize: '12px',
                padding: '8px 16px',
                marginBottom: '16px'
              }}
            >
              {maxColumns < customColumns && maxRows < customRows ? (
                <>列数和行数超出页面大小范围，已自动隐藏最后{customColumns - maxColumns}列和最后{customRows - maxRows}行</>
              ) : maxColumns < customColumns ? (
                <>列数超出页面大小范围，已自动隐藏最后{customColumns - maxColumns}列</>
              ) : (
                <>行数超出页面大小范围，已自动隐藏最后{customRows - maxRows}行</>
              )}
            </div>
          )}
          
          {categories.map((category) => (
            <div key={category.id}>
              <h2
                className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                style={{
                  fontSize: `${style.fontSize * 1.2}px`,
                  borderColor: style.textColor + '30',
                  marginBottom: '16px',
                  paddingBottom: '8px'}}
              >
                {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                  <img
                    src={category.icon}
                    alt=""
                    className="w-6 h-6 rounded-full mr-2 object-cover"
                    style={{ width: '24px', height: '24px' }}
                  />
                ) : (
                  category.icon && <span className="mr-2">{category.icon}</span>
                )}
                {category.name}
              </h2>

              {category.dishes.length === 0 ? (
                <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
              ) : (
                <div 
                  className="grid gap-4" 
                  style={{ 
                    gridTemplateColumns: `repeat(${maxColumns}, 1fr)`,
                    gap: `${style.spacing.dishGap}px` 
                  }}
                >
                  {category.dishes.slice(0, maxColumns * maxRows).map((dish) => {
                    const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor);
                    const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize * 0.85, style.textColor);
                    const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.7, style.textColor + 'B3');
                    
                    return (
                      <div 
                        key={dish.id} 
                        className="bg-white bg-opacity-90 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        style={{ padding: '16px' }}
                      >
                        {dish.image && dish.image.trim() !== '' && (
                          <div 
                            className="w-full rounded-lg overflow-hidden bg-gray-100 mb-3 shadow-sm" 
                            style={{ 
                              height: `${160 / maxRows}px`, 
                              marginBottom: '12px' 
                            }}
                          >
                            {renderDishImageNoScale(dish)}
                          </div>
                        )}
                        <div className="flex flex-col items-center text-center">
                          <div className="font-medium" style={nameStyle}>{dish.name}</div>
                          {dish.description && (
                            <div style={descStyle} className="mt-1">
                              {dish.description}
                            </div>
                          )}
                          <div className="flex flex-col items-center mt-2" style={{ gap: '4px', marginTop: '8px' }}>
                            <span className="font-semibold" style={priceStyle}>
                              {formatPrice(dish.price, dish.priceString, dish.unit)}
                            </span>
                            {dish.originalPrice && (
                              renderOriginalPrice(
                                formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                priceStyle,
                                0.6
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    };

    // 聚光灯布局（无缩放）
    const renderSpotlightNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => {
          const hasDishes = category.dishes.length > 0;
          const firstDish = hasDishes ? category.dishes[0] : null;
          const remainingDishes = hasDishes ? category.dishes.slice(1) : [];
          
          return (
            <div key={category.id}>
              <h2
                className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                style={{
                  fontSize: `${style.fontSize * 1.2}px`,
                  borderColor: style.textColor + '30',
                  marginBottom: '16px',
                  paddingBottom: '8px'}}
              >
                {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                  <img
                    src={category.icon}
                    alt=""
                    className="w-6 h-6 rounded-full mr-2 object-cover"
                    style={{ width: '24px', height: '24px' }}
                  />
                ) : (
                  category.icon && <span className="mr-2">{category.icon}</span>
                )}
                {category.name}
              </h2>

              {!hasDishes ? (
                <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
              ) : (
                <div className="space-y-6" style={{ gap: `${style.spacing.dishGap * 2}px` }}>
                  {/* 聚光灯菜品 */}
                  {firstDish && (
                    <div 
                      className="bg-white bg-opacity-95 rounded-2xl p-6 shadow-2xl border-2 border-amber-400"
                      style={{ padding: '24px' }}
                    >
                      <div className="flex items-center gap-6" style={{ gap: '24px' }}>
                        {firstDish.image && firstDish.image.trim() !== '' && (
                          <div 
                            className="flex-shrink-0 rounded-xl overflow-hidden shadow-lg"
                            style={{ width: '240px', height: '200px' }}
                          >
                            {renderDishImageNoScale(firstDish)}
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-center">
                          <div 
                            className="text-amber-600 font-bold mb-2 flex items-center gap-2"
                            style={{ fontSize: `${style.fontSize * 0.9}px`, marginBottom: '8px', gap: '8px' }}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            招牌推荐
                          </div>
                          <div 
                            className="font-bold text-2xl"
                            style={{ 
                              ...getTextStyleNoScale(firstDish.nameStyle, style.fontFamily, style.fontSize * 1.5, style.textColor),
                              marginBottom: '8px'
                            }}
                          >
                            {firstDish.name}
                          </div>
                          {firstDish.description && (
                            <div 
                              className="text-gray-600 mb-4"
                              style={{ 
                                ...getTextStyleNoScale(firstDish.descriptionStyle, style.fontFamily, style.fontSize * 1.1, style.textColor + '88'),
                                marginBottom: '16px'
                              }}
                            >
                              {firstDish.description}
                            </div>
                          )}
                          <div className="flex flex-col items-start" style={{ gap: '4px' }}>
                            <span 
                              className="font-bold text-3xl text-amber-600"
                              style={{
                                ...getTextStyleNoScale(firstDish.priceStyle, style.fontFamily, style.fontSize * 1.8, style.textColor),
                                color: '#d97706'
                              }}
                            >
                              {formatPrice(firstDish.price, firstDish.priceString, firstDish.unit)}
                            </span>
                            {firstDish.originalPrice && (
                              renderOriginalPrice(
                                formatPrice(firstDish.originalPrice, firstDish.originalPriceString, firstDish.unit),
                                getTextStyleNoScale(firstDish.priceStyle, style.fontFamily, style.fontSize * 1.2, style.textColor),
                                0.5
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 其他菜品 */}
                  {remainingDishes.length > 0 && (
                    <div className="grid grid-cols-2 gap-4" style={{ gap: `${style.spacing.dishGap}px` }}>
                      {remainingDishes.map((dish) => {
                        const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize * 0.95, style.textColor);
                        const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize * 0.9, style.textColor);
                        const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.75, style.textColor + '99');
                        
                        return (
                          <div 
                            key={dish.id} 
                            className="bg-white bg-opacity-85 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
                            style={{ padding: '16px' }}
                          >
                            <div className="flex items-start gap-4" style={{ gap: '16px' }}>
                              {dish.image && dish.image.trim() !== '' && (
                                <div 
                                  className="flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                                  style={{ width: '100px', height: '80px' }}
                                >
                                  {renderDishImageNoScale(dish)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium" style={nameStyle}>{dish.name}</div>
                                {dish.description && (
                                  <div style={descStyle} className="mt-1 truncate">
                                    {dish.description}
                                  </div>
                                )}
                                <div className="flex flex-col items-start mt-2" style={{ gap: '4px', marginTop: '8px' }}>
                                  <span className="font-semibold" style={priceStyle}>
                                    {formatPrice(dish.price, dish.priceString, dish.unit)}
                                  </span>
                                  {dish.originalPrice && (
                                    renderOriginalPrice(
                                      formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                      priceStyle,
                                      0.6
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );

    // 画廊风格（无缩放）
    const renderGalleryNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                borderColor: style.textColor + '30',
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="grid grid-cols-3 gap-4" style={{ gap: `${style.spacing.dishGap}px` }}>
                {category.dishes.map((dish, index) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize * 1.1, style.textColor);
                  
                  // 不同位置使用不同大小
                  const isLarge = index % 4 === 0;
                  const colSpan = isLarge ? 'col-span-2 row-span-2' : '';
                  const height = isLarge ? 240 : 140;
                  
                  return (
                    <div
                      key={dish.id}
                      className={`relative overflow-hidden rounded-xl group ${colSpan}`}
                    >
                      {dish.image && dish.image.trim() !== '' ? (
                        <div className="w-full transition-transform duration-500 group-hover:scale-105" style={{ height: `${height}px` }}>
                          {renderDishImageNoScale(dish)}
                        </div>
                      ) : (
                        <div 
                          className="w-full flex items-center justify-center bg-gray-100"
                          style={{ height: `${height}px` }}
                        >
                          <div className="text-4xl opacity-30">🍽️</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ padding: '16px' }}>
                          <div className="text-white font-medium mb-1" style={{ ...nameStyle, color: '#ffffff', marginBottom: '4px' }}>{dish.name}</div>
                          <div className="text-white font-bold" style={{ ...priceStyle, color: '#ffffff' }}>
                            {formatPrice(dish.price, dish.priceString, dish.unit)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 报纸式（无缩放）
    const renderNewspaperNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b-2 flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.5}px`,
                borderColor: style.textColor,
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-8" style={{ gap: `${style.spacing.dishGap}px` }}>
                {category.dishes.map((dish, index) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.75, style.textColor + '99');
                  
                  return (
                    <div key={dish.id} className="flex flex-col border-b border-dashed pb-4" style={{ paddingBottom: '16px' }}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-bold" style={nameStyle}>{dish.name}</div>
                          {dish.description && (
                            <div className="mt-1" style={{ marginTop: '4px', ...descStyle }}>
                              {dish.description}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end" style={{ marginLeft: '8px' }}>
                          <span className="font-bold" style={{ ...priceStyle, fontWeight: 700 }}>
                            {formatPrice(dish.price, dish.priceString, dish.unit)}
                          </span>
                          {dish.originalPrice && (
                            renderOriginalPrice(
                              formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                              priceStyle,
                              0.5
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 标签式（无缩放）
    const renderTagNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                borderColor: style.textColor + '30',
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="flex flex-wrap gap-3" style={{ gap: `${style.spacing.dishGap}px` }}>
                {category.dishes.map((dish, index) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor);
                  const colors = ['#FFF3CD', '#D1FAE5', '#DBEAFE', '#FCE7F3', '#FEF3C7', '#E0E7FF', '#FEE2E2', '#F0FDF4'];
                  const bgColor = colors[index % colors.length];
                  
                  return (
                    <div key={dish.id} className="px-4 py-3 rounded-lg shadow-sm" style={{ padding: '12px', backgroundColor: bgColor }}>
                      <div className="font-medium text-center" style={nameStyle}>{dish.name}</div>
                      <div className="text-center mt-1" style={{ marginTop: '4px' }}>
                        <span className="font-semibold" style={{ ...priceStyle, fontWeight: 600 }}>
                          {formatPrice(dish.price, dish.priceString, dish.unit)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 卡片布局（无缩放）
    const renderCardNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                borderColor: style.textColor + '30',
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="flex flex-col" style={{ gap: `${style.spacing.dishGap}px` }}>
                {category.dishes.map((dish) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.85, style.textColor + 'B3');
                  
                  return (
                    <div key={dish.id} className="bg-white bg-opacity-95 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 flex gap-4 transform hover:-translate-y-1" style={{ padding: '16px', gap: '16px' }}>
                      {dish.image && dish.image.trim() !== '' && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-gray-100" style={{ width: '80px', height: '80px' }}>
                          {renderDishImageNoScale(dish)}
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="font-medium" style={nameStyle}>{dish.name}</div>
                        {dish.description && (
                          <div style={descStyle}>
                            {dish.description}
                          </div>
                        )}
                        <div className="flex flex-col items-start mt-2" style={{ gap: '4px', marginTop: '8px' }}>
                          <span className="font-semibold" style={priceStyle}>
                            {formatPrice(dish.price, dish.priceString, dish.unit)}
                          </span>
                          {dish.originalPrice && (
                            renderOriginalPrice(
                              formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                              priceStyle,
                              0.6
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 列表布局（无缩放）
    const renderListNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                borderColor: style.textColor + '30',
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="space-y-1" style={{ gap: '4px' }}>
                {category.dishes.map((dish) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.7, style.textColor + '99');
                  
                  return (
                    <div key={dish.id} className="flex items-center justify-between py-2 border-b border-gray-200" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                      <div className="flex items-center gap-3" style={{ gap: '12px' }}>
                        {dish.image && dish.image.trim() !== '' && (
                          <div className="rounded-lg overflow-hidden bg-gray-100" style={{ width: '48px', height: '48px' }}>
                            {renderDishImageNoScale(dish)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium" style={nameStyle}>{dish.name}</div>
                          {dish.description && (
                            <div style={descStyle}>
                              {dish.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end" style={{ gap: '4px' }}>
                        <span className="font-semibold" style={priceStyle}>
                          {formatPrice(dish.price, dish.priceString, dish.unit)}
                        </span>
                        {dish.originalPrice && (
                          renderOriginalPrice(
                            formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                            priceStyle,
                            0.6
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 杂志排版（无缩放）
    const renderMagazineNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category, catIndex) => (
          <div key={category.id} className="relative">
            <h2
              className="font-semibold mb-3 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.25}px`,
                borderColor: style.textColor + '30',
                marginBottom: '12px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-5 h-5 rounded-full mr-2 object-cover"
                  style={{ width: '20px', height: '20px' }}
                />
              ) : (
                category.icon && <span className="mr-2 text-lg">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="grid grid-cols-12 gap-3" style={{ gap: '12px' }}>
                {category.dishes.map((dish, dishIndex) => {
                  const isLarge = dishIndex === 0 && catIndex === 0;
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, isLarge ? style.fontSize * 1.15 : style.fontSize * 0.9, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, isLarge ? style.fontSize * 1.05 : style.fontSize * 0.85, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.75, style.textColor + 'B3');
                  
                  return (
                    <div
                      key={dish.id}
                      className={isLarge ? 'col-span-12' : 'col-span-4'}
                    >
                      <div className="bg-white bg-opacity-80 rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
                        {dish.image && dish.image.trim() !== '' && (
                          <div style={{ height: isLarge ? '160px' : '112px' }}>
                            {renderDishImageNoScale(dish)}
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-center" style={{ padding: '10px' }}>
                          <div className="flex flex-col items-center text-center">
                            <div className="font-medium" style={nameStyle}>{dish.name}</div>
                            {dish.description && (
                              <div style={{ ...descStyle, marginTop: '2px' }}>
                                {dish.description}
                              </div>
                            )}
                            <div className="flex flex-col items-center" style={{ gap: '4px', marginTop: '6px' }}>
                              <span className="font-semibold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.6
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 紧凑排版（无缩放）
    const renderCompactNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-2 pb-1 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.15}px`,
                borderColor: style.textColor + '20',
                marginBottom: '8px',
                paddingBottom: '4px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-4 h-4 rounded-full mr-2 object-cover"
                  style={{ width: '16px', height: '16px' }}
                />
              ) : (
                category.icon && <span className="mr-2 text-sm">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="grid grid-cols-2 gap-1.5" style={{ gap: `${style.spacing.dishGap * 0.5}px` }}>
                {category.dishes.map((dish) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize * 0.85, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize * 0.8, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.65, style.textColor + 'B3');
                  
                  return (
                    <div key={dish.id} className="bg-white bg-opacity-75 rounded px-2 py-2" style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}>
                      <div className="flex items-center justify-between">
                        <div className="font-medium truncate" style={nameStyle}>{dish.name}</div>
                        <span className="font-semibold whitespace-nowrap ml-2" style={{ ...priceStyle, fontWeight: 600, marginLeft: '8px' }}>
                          {formatPrice(dish.price, dish.priceString, dish.unit)}
                        </span>
                      </div>
                      {dish.description && (
                        <div style={{ ...descStyle, marginTop: '2px' }} className="text-xs truncate">
                          {dish.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 精致排版（无缩放）
    const renderPremiumNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <div className="text-center mb-6" style={{ marginBottom: '24px' }}>
              <div className="">
                <h2
                  className="font-semibold tracking-wider"
                  style={{
                    fontSize: `${style.fontSize * 1.3}px`,
                    color: style.textColor,
                    borderBottom: `2px solid ${style.textColor}40`,
                    paddingBottom: '8px',
                    display: 'inline-block'}}
                >
                  {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                    <img
                      src={category.icon}
                      alt=""
                      className="w-5 h-5 rounded-full mr-2 inline object-cover"
                      style={{ width: '20px', height: '20px', display: 'inline' }}
                    />
                  ) : (
                    category.icon && <span className="mr-2">{category.icon}</span>
                  )}
                  {category.name}
                </h2>
              </div>
            </div>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="space-y-4" style={{ gap: `${style.spacing.dishGap}px` }}>
                {category.dishes.map((dish) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.75, style.textColor + '88');
                  
                  return (
                    <div key={dish.id} className="relative">
                      <div className="flex items-baseline justify-between mb-1" style={{ marginBottom: '4px' }}>
                        <div className="font-medium" style={nameStyle}>{dish.name}</div>
                        <span className="font-semibold" style={{ ...priceStyle, fontWeight: 600 }}>
                          {formatPrice(dish.price, dish.priceString, dish.unit)}
                        </span>
                      </div>
                      <div className="absolute inset-x-0 top-3 border-t border-dashed" style={{ borderColor: style.textColor + '30', top: '12px' }}></div>
                      <div className="flex items-baseline justify-between" style={{ marginTop: '4px' }}>
                        {dish.description && (
                          <div style={descStyle} className="text-sm">
                            {dish.description}
                          </div>
                        )}
                        {dish.originalPrice && (
                          <span
                            data-original-price="true"
                            className="whitespace-nowrap"
                            style={{
                              color: priceStyle.color,
                              fontFamily: priceStyle.fontFamily,
                              fontSize: `calc(${priceStyle.fontSize} * 0.8)`,
                              textDecoration: 'line-through',
                              opacity: 0.5,
                            }}
                          >
                            {formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 轮播卡片（无缩放）- 这里用网格布局代替轮播
    const renderCarouselNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                borderColor: style.textColor + '30',
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2 text-lg">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="grid grid-cols-3 gap-4" style={{ gap: `${style.spacing.dishGap}px` }}>
                {category.dishes.map((dish) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize * 0.85, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.7, style.textColor + 'B3');
                  
                  return (
                    <div key={dish.id} className="flex-shrink-0">
                      <div className="bg-white bg-opacity-90 rounded-xl overflow-hidden shadow-lg h-full">
                        {dish.image && dish.image.trim() !== '' && (
                          <div style={{ height: '128px' }}>
                            {renderDishImageNoScale(dish)}
                          </div>
                        )}
                        <div style={{ padding: '12px' }}>
                          <div className="text-center">
                            <div className="font-medium" style={nameStyle}>{dish.name}</div>
                            {dish.description && (
                              <div style={{ ...descStyle, marginTop: '4px' }} className="text-xs">
                                {dish.description}
                              </div>
                            )}
                            <div style={{ marginTop: '8px' }}>
                              <div className="flex flex-col items-center justify-center gap-1">
                                <span className="font-semibold text-lg" style={{ ...priceStyle, fontWeight: 600 }}>
                                  {formatPrice(dish.price, dish.priceString, dish.unit)}
                                </span>
                                {dish.originalPrice && (
                                  renderOriginalPrice(
                                    formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                    priceStyle,
                                    0.6
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 宝丽来风格（无缩放）
    const renderPolaroidNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                borderColor: style.textColor + '30',
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2 text-lg">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="grid grid-cols-3 gap-4" style={{ gap: `${style.spacing.dishGap}px` }}>
                {category.dishes.map((dish) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize * 0.85, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.7, style.textColor + 'B3');
                  
                  return (
                    <div key={dish.id} className="flex flex-col items-center">
                      <div className="bg-white shadow-lg" style={{ padding: '12px', paddingBottom: '32px', width: '200px' }}>
                        {dish.image && dish.image.trim() !== '' ? (
                          <div className="w-full bg-gray-200" style={{ height: '140px' }}>
                            {renderDishImageNoScale(dish)}
                          </div>
                        ) : (
                          <div className="w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{ height: '140px' }}>
                            <div className="text-gray-400 text-4xl">🍽️</div>
                          </div>
                        )}
                      </div>
                      <div className="text-center mt-3 z-10" style={{ marginTop: '12px' }}>
                        <div className="font-medium" style={nameStyle}>{dish.name}</div>
                        {dish.description && (
                          <div style={{ ...descStyle, marginTop: '4px' }} className="text-xs">
                            {dish.description}
                          </div>
                        )}
                        <div style={{ marginTop: '8px' }}>
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="font-semibold" style={{ ...priceStyle, fontWeight: 600 }}>
                              {formatPrice(dish.price, dish.priceString, dish.unit)}
                            </span>
                            {dish.originalPrice && (
                              renderOriginalPrice(
                                formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                priceStyle,
                                0.6
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 特色推荐（无缩放）
    const renderFeaturedNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                borderColor: style.textColor + '30',
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2 text-lg">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="space-y-4">
                {category.dishes.map((dish, index) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.8, style.textColor + 'B3');
                  
                  if (index === 0) {
                    return (
                      <div key={dish.id} className="bg-white rounded-xl p-4 shadow-lg" style={{ padding: '16px' }}>
                        <div className="flex gap-4" style={{ gap: '16px' }}>
                          {dish.image && dish.image.trim() !== '' && (
                            <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0" style={{ width: '128px', height: '128px' }}>
                              {renderDishImageNoScale(dish)}
                            </div>
                          )}
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="font-bold text-lg" style={{ ...nameStyle, fontSize: `${style.fontSize * 1.2}px` }}>{dish.name}</div>
                            {dish.description && (
                              <div style={{ ...descStyle, marginTop: '8px' }}>
                                {dish.description}
                              </div>
                            )}
                            <div className="flex flex-col items-start mt-3" style={{ gap: '4px', marginTop: '12px' }}>
                              <span className="font-bold text-xl" style={{ ...priceStyle, fontSize: `${style.fontSize * 1.3}px`, fontWeight: 700 }}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.6
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={dish.id} className="bg-white rounded-lg p-3 shadow-md flex gap-3" style={{ padding: '12px', gap: '12px' }}>
                      {dish.image && dish.image.trim() !== '' && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ width: '64px', height: '64px' }}>
                          {renderDishImageNoScale(dish)}
                        </div>
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <div className="font-medium" style={nameStyle}>{dish.name}</div>
                          {dish.description && (
                            <div style={{ ...descStyle, marginTop: '4px' }} className="text-xs">
                              {dish.description}
                            </div>
                          )}
                        </div>
                        <div style={{ marginLeft: '12px' }} className="flex flex-col items-end">
                          <span className="font-semibold" style={{ ...priceStyle, fontWeight: 600 }}>
                            {formatPrice(dish.price, dish.priceString, dish.unit)}
                          </span>
                          {dish.originalPrice && (
                            renderOriginalPrice(
                              formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                              priceStyle,
                              0.6
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 瀑布流（无缩放）
    const renderMasonryNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                borderColor: style.textColor + '30',
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2 text-lg">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="grid grid-cols-3 gap-3" style={{ gap: `${style.spacing.dishGap}px` }}>
                {category.dishes.map((dish, index) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize * 0.8, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize * 0.75, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.6, style.textColor + 'B3');
                  
                  const heights = [160, 120, 140, 180, 130, 150];
                  const height = heights[index % heights.length];
                  
                  return (
                    <div key={dish.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      {dish.image && dish.image.trim() !== '' && (
                        <div style={{ height: `${height}px` }}>
                          {renderDishImageNoScale(dish)}
                        </div>
                      )}
                      <div style={{ padding: '8px' }}>
                        <div className="text-center font-medium truncate" style={nameStyle}>{dish.name}</div>
                        {dish.description && (
                          <div style={{ ...descStyle, marginTop: '4px', textAlign: 'center' }} className="text-xs truncate">
                            {dish.description}
                          </div>
                        )}
                        <div className="text-center mt-2" style={{ marginTop: '8px' }}>
                          <span className="font-semibold" style={{ ...priceStyle, fontWeight: 600 }}>
                            {formatPrice(dish.price, dish.priceString, dish.unit)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 左右交错（无缩放）
    const renderAlternatingNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                borderColor: style.textColor + '30',
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2 text-lg">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="space-y-4">
                {category.dishes.map((dish, index) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.8, style.textColor + 'B3');
                  const isEven = index % 2 === 0;
                  
                  return (
                    <div key={dish.id} className={`flex gap-4 items-center ${isEven ? '' : 'flex-row-reverse'}`} style={{ gap: '16px' }}>
                      {dish.image && dish.image.trim() !== '' && (
                        <div className="w-1/3 rounded-lg overflow-hidden shadow-md flex-shrink-0" style={{ width: '120px', height: '80px' }}>
                          {renderDishImageNoScale(dish)}
                        </div>
                      )}
                      <div className={`flex-1 ${isEven ? 'text-left' : 'text-right'}`}>
                        <div className="font-medium" style={nameStyle}>{dish.name}</div>
                        {dish.description && (
                          <div style={{ ...descStyle, marginTop: '8px' }}>
                            {dish.description}
                          </div>
                        )}
                        <div className="mt-2" style={{ marginTop: '8px' }}>
                          <div className={`flex flex-col gap-1 ${isEven ? 'items-start' : 'items-end'}`} style={{ gap: '4px' }}>
                            <span className="font-semibold" style={{ ...priceStyle, fontWeight: 600 }}>
                              {formatPrice(dish.price, dish.priceString, dish.unit)}
                            </span>
                            {dish.originalPrice && (
                              renderOriginalPrice(
                                formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                priceStyle,
                                0.6
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 极简风格（无缩放）
    const renderMinimalNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-6"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                marginBottom: '24px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 inline object-cover"
                  style={{ width: '24px', height: '24px', display: 'inline' }}
                />
              ) : (
                category.icon && <span className="mr-2">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="space-y-6">
                {category.dishes.map((dish) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.75, style.textColor + '88');
                  
                  return (
                    <div key={dish.id} className="relative">
                      <div className="flex items-end justify-between mb-2" style={{ marginBottom: '8px' }}>
                        <div className="font-medium" style={nameStyle}>{dish.name}</div>
                        <div className="flex flex-col items-end">
                          <span className="font-semibold" style={{ ...priceStyle, fontWeight: 600 }}>
                            {formatPrice(dish.price, dish.priceString, dish.unit)}
                          </span>
                          {dish.originalPrice && (
                            renderOriginalPrice(
                              formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                              priceStyle,
                              0.5
                            )
                          )}
                        </div>
                      </div>
                      <div className="absolute inset-x-0 top-full border-t" style={{ borderColor: style.textColor + '20', top: '20px' }}></div>
                      {dish.description && (
                        <div style={{ ...descStyle, marginTop: '8px' }}>
                          {dish.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 优雅格调（无缩放）
    const renderElegantNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <div className="text-center mb-6" style={{ marginBottom: '24px' }}>
              <div className=" px-6 py-3 rounded-lg" style={{ backgroundColor: style.textColor + '08' }}>
                <h2
                  className="font-semibold tracking-wide"
                  style={{
                    fontSize: `${style.fontSize * 1.3}px`,
                    color: style.textColor}}
                >
                  {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                    <img
                      src={category.icon}
                      alt=""
                      className="w-5 h-5 rounded-full mr-2 inline object-cover"
                      style={{ width: '20px', height: '20px', display: 'inline' }}
                    />
                  ) : (
                    category.icon && <span className="mr-2">{category.icon}</span>
                  )}
                  {category.name}
                </h2>
              </div>
            </div>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="space-y-3">
                {category.dishes.map((dish) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize * 0.95, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize * 0.95, style.textColor);
                  const descStyle = getTextStyleNoScale(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.75, style.textColor + '99');
                  
                  return (
                    <div key={dish.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border-l-4" style={{ padding: '16px', borderLeftColor: style.textColor + '60', borderLeftWidth: '3px' }}>
                      <div className="flex items-center justify-between gap-4" style={{ gap: '16px' }}>
                        {dish.image && dish.image.trim() !== '' && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ width: '64px', height: '64px' }}>
                            {renderDishImageNoScale(dish)}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium" style={nameStyle}>{dish.name}</div>
                          {dish.description && (
                            <div style={{ ...descStyle, marginTop: '4px' }}>
                              {dish.description}
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0 flex flex-col items-end">
                          <span className="font-semibold" style={{ ...priceStyle, fontWeight: 600 }}>
                            {formatPrice(dish.price, dish.priceString, dish.unit)}
                          </span>
                          {dish.originalPrice && (
                            renderOriginalPrice(
                              formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                              priceStyle,
                              0.5
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 马赛克风格（无缩放）
    const renderMosaicNoScale = () => (
      <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap}px` }}>
        {categories.map((category) => (
          <div key={category.id}>
            <h2
              className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
              style={{
                fontSize: `${style.fontSize * 1.2}px`,
                borderColor: style.textColor + '30',
                marginBottom: '16px',
                paddingBottom: '8px'}}
            >
              {category.icon && (typeof category.icon === 'string' && (category.icon.startsWith('data:') || category.icon.startsWith('http'))) ? (
                <img
                  src={category.icon}
                  alt=""
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                  style={{ width: '24px', height: '24px' }}
                />
              ) : (
                category.icon && <span className="mr-2 text-lg">{category.icon}</span>
              )}
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <p className="text-sm text-gray-400" style={{ fontSize: '14px' }}>暂无菜品</p>
            ) : (
              <div className="grid grid-cols-3 gap-2" style={{ gap: '8px' }}>
                {category.dishes.map((dish, index) => {
                  const nameStyle = getTextStyleNoScale(dish.nameStyle, style.fontFamily, style.fontSize * 0.75, style.textColor);
                  const priceStyle = getTextStyleNoScale(dish.priceStyle, style.fontFamily, style.fontSize * 0.7, style.textColor);
                  
                  const isLarge = index === 0;
                  const spanClass = isLarge ? 'col-span-2 row-span-2' : '';
                  
                  return (
                    <div key={dish.id} className={`relative overflow-hidden rounded-lg ${spanClass}`} style={{ backgroundColor: style.textColor + '08' }}>
                      {dish.image && dish.image.trim() !== '' ? (
                        <div className="w-full" style={{ height: isLarge ? '200px' : '120px' }}>
                          {renderDishImageNoScale(dish)}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center" style={{ height: isLarge ? '200px' : '120px' }}>
                          <div className="text-4xl opacity-30">🍽️</div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="text-white font-medium truncate" style={{ ...nameStyle, fontSize: `${style.fontSize * 0.8}px`, color: 'white' }}>{dish.name}</div>
                        <div className="flex items-center gap-1">
                          {dish.originalPrice && (
                            <span
                              data-original-price="true"
                              className="text-xs opacity-50"
                              style={{ 
                                color: 'rgba(255, 255, 255, 0.7)', 
                                fontFamily: priceStyle.fontFamily,
                                fontSize: priceStyle.fontSize,
                                display: 'inline-block',
                                position: 'relative',
                                verticalAlign: 'baseline'
                              }}
                            >
                              {formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit)}
                              <svg
                                style={{
                                  position: 'absolute',
                                  left: 0,
                                  top: 0,
                                  width: '100%',
                                  height: '100%',
                                  pointerEvents: 'none',
                                  opacity: 0.5
                                }}
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                              >
                                <line
                                  x1="0"
                                  y1="50"
                                  x2="100"
                                  y2="50"
                                  stroke="rgba(255, 255, 255, 0.7)"
                                  strokeWidth="2"
                                />
                              </svg>
                            </span>
                          )}
                          <span className="font-semibold" style={{
                            ...priceStyle,
                            fontSize: `${style.fontSize * 0.85}px`,
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 600}}>
                            {formatPrice(dish.price, dish.priceString, dish.unit)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    // 根据布局类型选择渲染函数
    const renderContentNoScale = () => {
      switch (style.layoutType) {
        case 'horizontal':
          return renderHorizontalNoScale();
        case 'grid':
          return renderGridNoScale();
        case 'card':
          return renderCardNoScale();
        case 'list':
          return renderListNoScale();
        case 'magazine':
          return renderMagazineNoScale();
        case 'compact':
          return renderCompactNoScale();
        case 'premium':
          return renderPremiumNoScale();
        case 'carousel':
          return renderCarouselNoScale();
        case 'polaroid':
          return renderPolaroidNoScale();
        case 'featured':
          return renderFeaturedNoScale();
        case 'masonry':
          return renderMasonryNoScale();
        case 'alternating':
          return renderAlternatingNoScale();
        case 'minimal':
          return renderMinimalNoScale();
        case 'elegant':
          return renderElegantNoScale();
        case 'mosaic':
          return renderMosaicNoScale();
        case 'custom':
          return renderCustomNoScale();
        case 'spotlight':
          return renderSpotlightNoScale();
        case 'gallery':
          return renderGalleryNoScale();
        case 'newspaper':
          return renderNewspaperNoScale();
        case 'tag':
          return renderTagNoScale();
        case 'vertical':
        default:
          return renderVerticalNoScale();
      }
    };

    return (
      <div
        style={{
          width: `${pageWidth}px`,
          minHeight: `${pageHeight}px`,
          position: 'relative',
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize}px`,
          color: style.textColor,
          ...getBackgroundStyle(),
          overflow: 'visible'}}
      >
        {/* 背景图片 */}
        {isImageBackground && actualBackgroundImage && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              minHeight: `${pageHeight}px`,
              backgroundImage: `url(${actualBackgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: getMaskFilter(),
              transform: style.backgroundMask === 'blur' ? 'scale(1.05)' : 'scale(1)'}}
          />
        )}
        
        {/* 背景遮罩 - 增强对比度 */}
        {isImageBackground && actualBackgroundImage && (() => {
          const optimalOverlay = calculateOptimalOverlay(style.textColor);
          return (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                minHeight: `${pageHeight}px`,
                zIndex: 5,
                pointerEvents: 'none',
                backgroundColor: optimalOverlay.color,
                // 增加默认的遮罩透明度，确保文字足够清晰
                opacity: Math.max(0.6, optimalOverlay.opacity)}}
            />
          );
        })()}
        
        {/* 内容区域 - 使用无缩放的布局，应用页面边距 */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            paddingTop: `${getPageMargin().top}px`,
            paddingRight: `${getPageMargin().right}px`,
            paddingBottom: `${getPageMargin().bottom}px`,
            paddingLeft: `${getPageMargin().left}px`,
            width: '100%',
            minHeight: `${pageHeight}px`,
            boxSizing: 'border-box'}}
        >
          <h1
            style={{
              textAlign: 'center',
              marginBottom: '32px',
              fontWeight: 'bold',
              fontSize: `${style.fontSize * 1.5}px`}}
          >
            {displayMenu.name}
          </h1>

          {categories.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                color: '#9CA3AF',
                paddingTop: '48px',
                paddingBottom: '48px',
                fontSize: '16px'}}
            >
              <p>暂无菜品</p>
              <p style={{ marginTop: '8px', fontSize: '14px' }}>请添加菜品分类和菜品</p>
            </div>
          ) : (
            renderContentNoScale()
          )}
        </div>
      </div>
    );
  }

  // 正常预览模式
  return (
    <div 
      className={`${disableScaling ? '' : 'flex justify-center items-center'}`}
      style={{ 
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <div
        className={`${disableScaling ? '' : 'shadow-2xl rounded-lg'} overflow-hidden relative`}
        style={{
          width: `${displayWidth}px`,
          minHeight: `${displayHeight}px`,
          height: disableScaling ? `${displayHeight}px` : undefined,
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize * finalScale}px`,
          color: style.textColor,
          ...getBackgroundStyle()}}
      >
        {isImageBackground && actualBackgroundImage && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${actualBackgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: getMaskFilter(),
              transform: style.backgroundMask === 'blur' ? 'scale(1.05)' : 'scale(1)'}}
          />
        )}
        
        {isImageBackground && actualBackgroundImage && (() => {
          const optimalOverlay = calculateOptimalOverlay(style.textColor);
          return (
            <div
              className="absolute inset-0 z-5 pointer-events-none"
              style={{
                backgroundColor: optimalOverlay.color,
                opacity: Math.max(0.6, optimalOverlay.opacity),
                top: 0,
                left: 0,
                right: 0,
                bottom: 0}}
            />
          );
        })()}
        
        <div
          className="relative z-10"
          style={{
            paddingTop: `${getPageMargin().top * optimalScale * finalScale}px`,
            paddingRight: `${getPageMargin().right * optimalScale * finalScale}px`,
            paddingBottom: `${getPageMargin().bottom * optimalScale * finalScale}px`,
            paddingLeft: `${getPageMargin().left * optimalScale * finalScale}px`,
            height: '100%',
            boxSizing: 'border-box'
          }}
        >


          <h1
            className="text-center mb-8 font-bold"
            style={{ fontSize: `${style.fontSize * 1.5 * optimalScale * finalScale}px`, marginBottom: `${32 * optimalScale * finalScale}px` }}
          >
            {displayMenu.name}
          </h1>

          {categories.length === 0 ? (
            <div className="text-center text-gray-400 py-12" style={{ fontSize: `${16 * optimalScale * finalScale}px`, paddingTop: `${48 * optimalScale * finalScale}px`, paddingBottom: `${48 * optimalScale * finalScale}px` }}>
              <p>暂无菜品</p>
              <p className="text-sm mt-2">请添加菜品分类和菜品</p>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};
