import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, BookOpen, Plus, Edit2, Link, Trash2, Eye, Calendar, Pin, ChevronUp, Copy, Download, Crown } from 'lucide-react';
import { TemplateCard } from '../components/templates/TemplateCard';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ConfirmModal, Modal } from '../components/common/Modal';
import { Tooltip } from '../components/common/Tooltip';
import { DownloadModal } from '../components/common/DownloadModal';
import { OfflineDownloader } from '../components/preview/OfflineDownloader';
import { PreviewCanvas } from '../components/preview/PreviewCanvas';
import { useMenuStore, createNewMenuFromTemplate, createNewMenu } from '../stores/menuStore';
import { useMembershipStore } from '../stores/membershipStore';
import { templates, templateCategories } from '../data/templates';
import { useToast } from '../components/common/Toast';
import RegistrationModal from '../components/membership/RegistrationModal';
import LoginModal from '../components/membership/LoginModal';
import PaymentModal from '../components/membership/PaymentModal';
import MembershipPage from './MembershipPage';
import type { Template, Menu } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setTemplates, setMenu, menus, deleteMenu, togglePinMenu, copyMenu, recordTemplateUsage, templateUsageStats } = useMenuStore();
  const { 
    isRegistrationModalOpen, 
    isPaymentModalOpen, 
    closeRegistrationModal, 
    closePaymentModal,
    handleReferral,
    useDownload,
    canDownload,
    openRegistrationModal 
  } = useMembershipStore();
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadConfig, setDownloadConfig] = useState<{
    menu: Menu;
    format: 'jpg' | 'png' | 'pdf' | 'doc';
  } | null>(null);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const categoriesRef = React.useRef<HTMLDivElement>(null);
  
  const tabParam = searchParams.get('tab');
  const activeTab = tabParam === 'my-menus' ? 'my-menus' : tabParam === 'membership' ? 'membership' : 'templates';
  
  // 处理推荐码
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      handleReferral(ref);
      // 移除URL中的ref参数，保持URL整洁
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('ref');
      setSearchParams(newParams, { replace: true });
    }
  }, []);

  useEffect(() => {
    // 按用户使用次数降序排列：使用 templateUsageStats 中的数据
    const sortedTemplates = [...templates].sort((a, b) => {
      const usageA = templateUsageStats[a.id] || 0;
      const usageB = templateUsageStats[b.id] || 0;
      return usageB - usageA;
    });
    setTemplates(sortedTemplates);
  }, [setTemplates, templateUsageStats]);

  useEffect(() => {
    // 按用户使用次数降序排列：使用 templateUsageStats 中的数据
    let sortedTemplates = [...templates].sort((a, b) => {
      const usageA = templateUsageStats[a.id] || 0;
      const usageB = templateUsageStats[b.id] || 0;
      return usageB - usageA;
    });
    
    if (selectedCategory !== '全部') {
      sortedTemplates = sortedTemplates.filter(t => t.category === selectedCategory);
    }
    
    setFilteredTemplates(sortedTemplates);
  }, [selectedCategory, templateUsageStats]);

  const handleSelectTemplate = (template: Template) => {
    const newMenu = createNewMenuFromTemplate(template);
    setMenu(newMenu);
    recordTemplateUsage(template.id);
    navigate(`/editor/${template.id}`);
  };

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
  };

  const handleCreateMenu = () => {
    const defaultStyle = templates[0].style;
    const newMenu = createNewMenu('custom', defaultStyle);
    setMenu(newMenu);
    navigate(`/editor/custom`);
  };

  const handleEditMenu = (menuId: string) => {
    const menu = menus.find(m => m.id === menuId);
    if (menu) {
      setMenu(menu);
      navigate(`/editor/${menu.templateId}`);
    }
  };

  const handlePreviewMenu = (menuId: string) => {
    navigate(`/preview/${menuId}`, { state: { from: 'home' } });
  };

  const handleCopyLink = (menuId: string) => {
    const link = `${window.location.origin}/shared/${menuId}`;
    navigator.clipboard.writeText(link);
    showToast('success', '链接已复制到剪贴板');
  };

  const handleDeleteMenu = (menuId: string) => {
    deleteMenu(menuId);
    setDeleteConfirm(null);
    showToast('success', '菜单已删除');
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return '刚刚';
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return d.toLocaleDateString('zh-CN');
  };

  const getMenuById = (menuId: string) => {
    return menus.find(m => m.id === menuId);
  };

  const handleDownload = async (format: string) => {
    if (!showDownloadModal) return;
    const menu = getMenuById(showDownloadModal);
    if (!menu) return;

    // 检查是否可以下载
    if (!canDownload()) {
      openRegistrationModal();
      return;
    }

    setShowDownloadModal(null);
    setDownloadConfig({
      menu,
      format: format as 'jpg' | 'png' | 'pdf' | 'doc'
    });
  };

  const handleTabChange = (tab: 'templates' | 'my-menus' | 'membership') => {
    if (tab === 'templates') {
      setSearchParams({});
    } else {
      setSearchParams({ tab });
    }
  };

  const handleSliderMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current || !categoriesRef.current) return;
      
      const sliderRect = sliderRef.current.getBoundingClientRect();
      let newPosition = e.clientX - sliderRect.left;
      newPosition = Math.max(0, Math.min(newPosition, sliderRect.width));
      
      setSliderPosition(newPosition);
      
      const categoriesContainer = categoriesRef.current;
      const maxScrollLeft = categoriesContainer.scrollWidth - categoriesContainer.clientWidth;
      const scrollPercent = newPosition / sliderRect.width;
      categoriesContainer.scrollLeft = scrollPercent * maxScrollLeft;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  React.useEffect(() => {
    const handleCategoriesScroll = () => {
      if (!categoriesRef.current || !sliderRef.current) return;
      
      const categoriesContainer = categoriesRef.current;
      const scrollPercent = categoriesContainer.scrollLeft / (categoriesContainer.scrollWidth - categoriesContainer.clientWidth);
      const sliderWidth = sliderRef.current.clientWidth;
      setSliderPosition(scrollPercent * sliderWidth);
    };

    const categoriesContainer = categoriesRef.current;
    if (categoriesContainer) {
      categoriesContainer.addEventListener('scroll', handleCategoriesScroll);
    }

    return () => {
      if (categoriesContainer) {
        categoriesContainer.removeEventListener('scroll', handleCategoriesScroll);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => handleTabChange('templates')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Utensils className="w-8 h-8 text-amber-600" />
              <span className="text-xl font-bold text-gray-900">菜单大师</span>
            </button>
            <nav className="flex items-center gap-6">
              <button
                onClick={() => handleTabChange('templates')}
                className={`font-semibold transition-colors ${
                  activeTab === 'templates' ? 'text-amber-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                模板
              </button>
              <button
                onClick={() => handleTabChange('my-menus')}
                className={`font-semibold transition-colors ${
                  activeTab === 'my-menus' ? 'text-amber-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                我的菜单
              </button>
              <button
                onClick={() => handleTabChange('membership')}
                className={`font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === 'membership' ? 'text-amber-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Crown className="w-4 h-4" />
                会员权益
              </button>
            </nav>
          </div>
        </div>
      </header>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-amber-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-700 transition-colors z-50"
          aria-label="返回顶部"
        >
          <ChevronUp size={24} />
        </button>
      )}

      {activeTab === 'templates' ? (
        <>
          {/* Hero Section */}
          <section className="py-16 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-7xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                选择适合你的菜单模板
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                模版仅供参考，使用后可在“我的菜单”里自主编辑
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={handleCreateMenu}>
                  <Plus size={20} className="mr-2" />
                  创建空白菜单
                </Button>
              </div>
            </motion.div>
          </section>

          {/* Category Filter */}
          <section className="px-4 mb-8">
            <div className="max-w-7xl mx-auto">
              <div className="relative">
                {/* 可拖拽滑轨 */}
                <div 
                  ref={sliderRef}
                  className="h-2 bg-gray-100 rounded-full mb-4 cursor-pointer relative"
                >
                  <div
                    className="absolute h-6 w-24 bg-amber-400 rounded-full -top-2 cursor-grab active:cursor-grabbing shadow-md transition-transform"
                    style={{ 
                      left: `calc(${sliderPosition}px - 48px)`,
                      transform: isDragging ? 'scale(1.1)' : 'scale(1)'
                    }}
                    onMouseDown={handleSliderMouseDown}
                  />
                </div>
                <div 
                  ref={categoriesRef}
                  className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                >
                  {templateCategories.map((category) => (
                    <button
                      key={category}
                      onClick={(e) => {
                        setSelectedCategory(category);
                        
                        const button = e.currentTarget;
                        const sliderContainer = sliderRef.current;
                        
                        if (sliderContainer) {
                          const buttonRect = button.getBoundingClientRect();
                          const sliderRect = sliderContainer.getBoundingClientRect();
                          const sliderWidth = sliderRect.width;
                          const sliderCenterPosition = buttonRect.left - sliderRect.left + buttonRect.width / 2;
                          
                          setSliderPosition(Math.max(0, Math.min(sliderCenterPosition, sliderWidth)));
                        }
                      }}
                      className={`
                        px-5 py-2.5 rounded-full whitespace-nowrap transition-all flex-shrink-0 snap-center
                        ${selectedCategory === category
                          ? 'bg-amber-600 text-white shadow-md scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-amber-300'}
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Templates Grid - 按人气值降序排列 */}
          <section className="px-4 pb-16">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TemplateCard
                    template={template}
                    onSelect={handleSelectTemplate}
                    onPreview={handlePreviewTemplate}
                  />
                  </motion.div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">该分类暂无模板</p>
                  <p className="text-sm mt-2">敬请期待更多模板</p>
                </div>
              )}
            </div>
          </section>
        </>
      ) : activeTab === 'membership' ? (
        <MembershipPage />
      ) : (
        /* 我的菜单 TAB */
        <section className="px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">我的菜单</h1>
              <Button onClick={handleCreateMenu}>
                <Plus size={20} className="mr-2" />
                创建新菜单
              </Button>
            </div>

            {menus.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-amber-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Utensils size={48} className="text-amber-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  还没有菜单
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  创建你的第一个菜单，让顾客体验数字化点餐的便捷
                </p>
                <Button size="lg" onClick={handleCreateMenu}>
                  <Plus size={20} className="mr-2" />
                  创建新菜单
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menus
                  .sort((a, b) => {
                    if (a.pinned && !b.pinned) return -1;
                    if (!a.pinned && b.pinned) return 1;
                    if (a.pinned && b.pinned) {
                      return (b.pinnedAt?.getTime() || 0) - (a.pinnedAt?.getTime() || 0);
                    }
                    return 0;
                  })
                  .map((menu, index) => (
                    <motion.div
                      key={menu.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card hover className="relative overflow-hidden">
                        {/* 右上角下载按钮 */}
                        <div className="absolute top-3 right-3 z-10">
                          <Tooltip content="下载菜单">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDownloadModal(menu.id);
                              }}
                              className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white"
                            >
                              <Download size={14} />
                            </Button>
                          </Tooltip>
                        </div>
                        
                        <div
                          className="h-48 flex items-center justify-center cursor-pointer relative"
                          onClick={() => handlePreviewMenu(menu.id)}
                          style={{
                            backgroundColor: menu.style.backgroundColor,
                            backgroundImage: menu.style.backgroundType === 'image' && menu.style.backgroundImage
                              ? `url(${menu.style.backgroundImage})`
                              : undefined,
                            backgroundSize: menu.style.backgroundType === 'image' ? 'cover' : undefined,
                            backgroundPosition: menu.style.backgroundType === 'image' ? 'center' : undefined,
                          }}
                        >
                          {menu.style.backgroundType === 'image' && (
                            <div className="absolute inset-0 bg-white/70" />
                          )}
                          <div className="text-center p-4 relative z-10">
                            <h3
                              className="font-bold mb-4"
                              style={{
                                fontSize: `${menu.style.fontSize * 1.5}px`,
                                color: menu.style.textColor,
                                fontFamily: menu.style.fontFamily,
                              }}
                            >
                              {menu.name}
                            </h3>
                            <p
                              className="text-sm font-semibold"
                              style={{ color: menu.style.textColor, opacity: 0.8 }}
                            >
                              {menu.categories.length} 个分类 ·{' '}
                              {menu.categories.reduce((acc, cat) => acc + cat.dishes.length, 0)} 道菜
                            </p>
                          </div>
                        </div>

                        <div className="p-4 pb-8">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{menu.name}</h3>
                            <div className="flex items-center gap-2">
              <Tooltip content={menu.pinned ? '取消置顶' : '置顶菜单'}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => togglePinMenu(menu.id)}
                  className={menu.pinned ? 'text-amber-600 hover:bg-amber-50' : 'text-gray-500 hover:bg-gray-50'}
                >
                  <Pin size={14} className={menu.pinned ? 'fill-current' : ''} />
                </Button>
              </Tooltip>
              <Tooltip content="复制菜单">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    copyMenu(menu.id);
                    showToast('success', '菜单已复制');
                  }}
                  className="text-gray-500 hover:bg-gray-50"
                >
                  <Copy size={14} />
                </Button>
              </Tooltip>
            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                            <Calendar size={12} />
                            <span>更新于 {formatDate(menu.updatedAt)}</span>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="flex-1"
                              onClick={() => handleEditMenu(menu.id)}
                            >
                              <Edit2 size={14} className="mr-1" />
                              编辑
                            </Button>
                            <Tooltip content="复制链接" position="top">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyLink(menu.id)}
                              >
                                <Link size={14} />
                              </Button>
                            </Tooltip>
                            <Tooltip content="删除菜单" position="top">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeleteConfirm(menu.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={deleteConfirm !== null}
            onClose={() => setDeleteConfirm(null)}
            onConfirm={() => deleteConfirm && handleDeleteMenu(deleteConfirm)}
            title="删除菜单"
            message="确定要删除此菜单吗？此操作不可撤销。"
            confirmText="删除"
            variant="danger"
          />
        </section>
      )}

      {/* Template Preview Modal */}
      <Modal
        isOpen={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
        title={previewTemplate?.name}
        size="lg"
      >
        {previewTemplate && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-start', 
            overflow: 'hidden',
            padding: '16px',
            maxHeight: '85vh'
          }}>
            {/* 缩放显示，从顶部对齐，确保完整预览 */}
            <div style={{ 
              transform: 'scale(0.6)', 
              transformOrigin: 'top center'
            }}>
              <PreviewCanvas 
                menu={createNewMenuFromTemplate(previewTemplate)} 
                mode="desktop" 
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Download Modal */}
      {showDownloadModal && (
        <DownloadModal
          isOpen={showDownloadModal !== null}
          onClose={() => setShowDownloadModal(null)}
          menuName={getMenuById(showDownloadModal)?.name || '菜单'}
          onDownload={handleDownload}
          isDownloading={isDownloading}
        />
      )}

      {/* Offline Downloader */}
      {downloadConfig && (
        <OfflineDownloader
          menu={downloadConfig.menu}
          format={downloadConfig.format}
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

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={closeRegistrationModal}
        onSwitchToLogin={() => {
          closeRegistrationModal();
          setIsLoginModalOpen(true);
        }}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          openRegistrationModal();
        }}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
      />
    </div>
  );
};

export default Home;
