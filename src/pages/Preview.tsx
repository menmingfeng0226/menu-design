
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, Tablet, Monitor, Copy, Download, QrCode, FileImage, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { PreviewCanvas } from '../components/preview/PreviewCanvas';
import { OfflineDownloader } from '../components/preview/OfflineDownloader';
import { useMenuStore } from '../stores/menuStore';
import { useMembershipStore } from '../stores/membershipStore';
import { useToast } from '../components/common/Toast';
import type { Menu } from '../types';

interface ResolutionOption {
  id: string;
  label: string;
  scale: number;
}

const resolutionOptions: ResolutionOption[] = [
  { id: '1x', label: '720p (普通)', scale: 1 },
  { id: '2x', label: '1080p (高清)', scale: 2 },
  { id: '3x', label: '2K (超清)', scale: 3 },
  { id: '4x', label: '4K (极致)', scale: 4 },
];

const Preview: React.FC = () => {
  const navigate = useNavigate();
  const { menuId } = useParams();
  const { menus, currentMenu } = useMenuStore();
  const { showToast } = useToast();
  const { useDownload, canDownload, openRegistrationModal } = useMembershipStore();
  
  const [previewMode, setPreviewMode] = useState<'phone' | 'tablet' | 'desktop'>('desktop');
  const [autoFit, setAutoFit] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<string>('2x');
  const [downloadConfig, setDownloadConfig] = useState<{
    menu: Menu;
    format: 'jpg' | 'png' | 'pdf' | 'doc';
    resolution: string;
  } | null>(null);

  const menu = menus.find(m => m.id === menuId) || (currentMenu?.id === menuId ? currentMenu : null);

  // 现在Home页面已经实现离线下载功能，此代码不再需要

  const handleBack = () => {
    navigate('/?tab=my-menus');
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3)); // 最大3倍
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5)); // 最小0.5倍
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/shared/${menuId}`;
    navigator.clipboard.writeText(link);
    showToast('success', '链接已复制到剪贴板');
  };

  const handleDownload = (format: string, resolution: string) => {
    if (!menu) return;

    // 检查是否可以下载
    if (!canDownload()) {
      openRegistrationModal();
      return;
    }

    setShowDownloadModal(false);
    setDownloadConfig({
      menu,
      format: format as 'jpg' | 'png' | 'pdf' | 'doc',
      resolution
    });
  };

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">未找到菜单</p>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  const previewModes = [
    { id: 'phone' as const, icon: Smartphone, label: '手机' },
    { id: 'tablet' as const, icon: Tablet, label: '平板' },
    { id: 'desktop' as const, icon: Monitor, label: '电脑' },
  ];

  const downloadOptions = [
    { id: 'jpg', label: '下载图片 (JPG)', description: '适合在社交媒体分享', icon: <FileImage size={24} />, format: 'jpg' },
    { id: 'png', label: '下载图片 (PNG)', description: '高清透明背景图片', icon: <FileImage size={24} />, format: 'png' },
    { id: 'pdf', label: '下载 PDF', description: '适合打印和文档存档', icon: <FileText size={24} />, format: 'pdf' },
    { id: 'doc', label: '下载 DOC', description: '适合 Word 文档编辑', icon: <FileSpreadsheet size={24} />, format: 'doc' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span>返回</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {menu.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleCopyLink}>
              <Copy size={18} className="mr-1" />
              复制链接
            </Button>
            <Button size="sm" onClick={() => setShowDownloadModal(true)}>
              <Download size={18} className="mr-1" />
              下载
            </Button>
            <Button size="sm" onClick={() => setShowShareModal(true)}>
              <QrCode size={18} className="mr-1" />
              分享
            </Button>
          </div>
        </div>
      </header>

      {/* Preview Mode Selector */}
      <div className="fixed top-14 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            {previewModes.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setPreviewMode(id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${previewMode === id
                    ? 'bg-amber-100 text-amber-700 border border-amber-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'}
                `}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
            <div className="ml-4 border-l border-gray-300 pl-4 flex items-center gap-2">
            <button
              onClick={() => setAutoFit(!autoFit)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
                autoFit ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent'
              }`}
            >
              {autoFit ? '自动适配' : '自动适配'}
            </button>
            {!autoFit && (
              <>
                <span className="text-sm text-gray-500 mr-2">缩放: {(zoomLevel * 100).toFixed(0)}%</span>
                <button
                  onClick={handleZoomOut}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg border border-transparent transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  <span>缩小</span>
                </button>
                <button
                  onClick={handleZoomIn}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg border border-transparent transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>放大</span>
                </button>
              </>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Preview Canvas */}
      <main className="flex-1 pt-28 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full flex items-center justify-center p-4"
        >
          <PreviewCanvas 
            menu={menu} 
            mode={previewMode} 
            zoom={autoFit ? zoomLevel : 1} 
            autoFit={autoFit}
          />
        </motion.div>
      </main>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="分享菜单"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-48 h-48 bg-gray-200 mx-auto rounded-lg flex items-center justify-center mb-4">
              <QrCode size={120} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              扫描二维码分享菜单
            </p>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">分享链接</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${window.location.origin}/shared/${menuId}`}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <Button onClick={handleCopyLink} size="sm">
                复制
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Download Modal */}
      <Modal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        title="下载菜单"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">选择您要下载的文件格式：</p>
          
          <div className="grid grid-cols-1 gap-3">
            {downloadOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleDownload(option.format, selectedResolution)}
                disabled={isDownloading}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{option.label}</h4>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
                <Download size={16} className="text-gray-400" />
              </button>
            ))}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">分辨率大小</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {resolutionOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedResolution(option.id)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    selectedResolution === option.id
                      ? 'bg-amber-100 border-2 border-amber-500 text-amber-700'
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {isDownloading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
              <p className="text-gray-600">正在生成文件，请稍候...</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Offline Downloader */}
      {downloadConfig && (
        <OfflineDownloader
          menu={downloadConfig.menu}
          format={downloadConfig.format}
          resolution={downloadConfig.resolution}
          onDownload={() => {
            setIsDownloading(true);
            showToast('info', '正在准备下载...');
          }}
          onSuccess={() => {
            // 下载成功后调用 useDownload 更新下载次数
            useDownload();
            setIsDownloading(false);
            setDownloadConfig(null);
            showToast('success', '下载成功！');
          }}
          onError={() => {
            setIsDownloading(false);
            setDownloadConfig(null);
            showToast('error', '下载失败，请重试');
          }}
        />
      )}
    </div>
  );
};

export default Preview;

