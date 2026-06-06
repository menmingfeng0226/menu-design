import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PreviewCanvas } from './PreviewCanvas';
import type { Menu } from '../../types';

interface OfflineDownloaderProps {
  menu: Menu;
  format: 'jpg' | 'png' | 'pdf' | 'doc';
  resolution?: string;
  onDownload: () => void;
  onSuccess: () => void;
  onError: () => void;
}

// 页面尺寸定义，与 PreviewCanvas 保持一致
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
  'table-card': { width: 100, height: 150 },
};

const mmToPixelRatio = 2.83465;

const getResolutionScale = (resolution?: string): number => {
  switch (resolution) {
    case '1x':
      return 1;
    case '2x':
      return 2;
    case '3x':
      return 3;
    case '4x':
      return 4;
    default:
      return 2; // 默认使用 2x
  }
};

export const OfflineDownloader: React.FC<OfflineDownloaderProps> = ({
  menu,
  format,
  resolution = '2x', // 默认使用 2x
  onDownload,
  onSuccess,
  onError
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasDownloadedRef = useRef(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // 获取页面尺寸
  const pageSize = pageSizeDimensions[menu.style.pageSize] || pageSizeDimensions['A4'];
  const pageWidthPx = pageSize.width * mmToPixelRatio;
  const pageHeightPx = pageSize.height * mmToPixelRatio;

  const downloadAsImage = (canvas: HTMLCanvasElement, fileName: string, format: 'jpg' | 'png') => {
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsVisible(false);
        onSuccess();
      } else {
        setIsVisible(false);
        onError();
      }
    }, mimeType, 0.95);
  };

  const downloadAsPDF = (canvas: HTMLCanvasElement, fileName: string, pageSize: string) => {
    const imgData = canvas.toDataURL('image/png');
    
    const dimensions = pageSizeDimensions[pageSize] || pageSizeDimensions['A4'];
    const isLandscape = dimensions.width > dimensions.height;
    
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [dimensions.width, dimensions.height]
    });
    
    const imgWidth = dimensions.width;
    const imgHeight = dimensions.height;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${fileName}.pdf`);
    setIsVisible(false);
    onSuccess();
  };

  const downloadAsDocWithImage = (canvas: HTMLCanvasElement, fileName: string) => {
    const imgData = canvas.toDataURL('image/png', 0.95);
    
    let content = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>${fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 14px; color: #333; margin: 0; padding: 0; }
          .menu-image { display: block; width: 100%; height: auto; }
        </style>
      </head>
      <body>
        <img src="${imgData}" class="menu-image" alt="${fileName}">
      </body></html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsVisible(false);
    onSuccess();
  };

  const performDownload = async () => {
    if (hasDownloadedRef.current || !containerRef.current) return;
    hasDownloadedRef.current = true;

    try {
      onDownload();
      
      // 等待所有图片加载完成
      const container = containerRef.current;
      const images = container.querySelectorAll('img');
      const imagePromises: Promise<void>[] = [];
      
      images.forEach(img => {
        if (!img.complete) {
          const promise = new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            setTimeout(resolve, 5000);
          });
          imagePromises.push(promise);
        }
      });
      
      if (imagePromises.length > 0) {
        await Promise.all(imagePromises);
        console.log(`等待了 ${imagePromises.length} 张图片加载完成`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));

      // 获取实际内容高度（不限制高度）
      const contentHeight = Math.max(container.scrollHeight, pageHeightPx);
      
      // 获取分辨率缩放比例
      const scale = getResolutionScale(resolution);
      
      const canvas = await html2canvas(container, {
        width: pageWidthPx,
        height: contentHeight,
        useCORS: true,
        backgroundColor: menu.style.backgroundColor || '#FFFFFF',
        allowTaint: true,
        logging: false,
        scale: scale,
        scrollX: 0,
        scrollY: 0,
        windowWidth: pageWidthPx,
        windowHeight: contentHeight,
        imageTimeout: 0,
        removeContainer: false,
      });

      if (format === 'jpg' || format === 'png') {
        downloadAsImage(canvas, menu.name || '菜单', format);
      } else if (format === 'pdf') {
        downloadAsPDF(canvas, menu.name || '菜单', menu.style.pageSize);
      } else if (format === 'doc') {
        downloadAsDocWithImage(canvas, menu.name || '菜单');
      }
    } catch (error) {
      console.error('下载失败:', error);
      setIsVisible(false);
      onError();
    }
  };

  useEffect(() => {
    setCanvasReady(true);
  }, []);

  useEffect(() => {
    if (canvasReady) {
      performDownload();
    }
  }, [canvasReady]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      data-download-container="true"
      style={{
        position: 'fixed',
        left: '0',
        top: '0',
        zIndex: 99999,
        width: `${pageWidthPx}px`,
        minHeight: `${pageHeightPx}px`,
        overflow: 'visible',
        backgroundColor: menu.style.backgroundColor || '#FFFFFF',
        boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
      }}
    >
      <PreviewCanvas menu={menu} mode="desktop" disableScaling={true} />
    </div>
  );
};
