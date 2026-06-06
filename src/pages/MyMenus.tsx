import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, Plus, Edit2, Link, Trash2, Eye, Calendar } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ConfirmModal } from '../components/common/Modal';
import { useMenuStore } from '../stores/menuStore';
import { useToast } from '../components/common/Toast';

const MyMenus: React.FC = () => {
  const navigate = useNavigate();
  const { menus, deleteMenu, setMenu } = useMenuStore();
  const { showToast } = useToast();
  
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);

  const handleEdit = (menuId: string) => {
    const menu = menus.find(m => m.id === menuId);
    if (menu) {
      setMenu(menu);
      navigate(`/editor/${menu.templateId}`);
    }
  };

  const handlePreview = (menuId: string) => {
    navigate(`/preview/${menuId}`, { state: { from: 'my-menus' } });
  };

  const handleCopyLink = (menuId: string) => {
    const link = `${window.location.origin}/shared/${menuId}`;
    navigator.clipboard.writeText(link);
    showToast('success', '链接已复制到剪贴板');
  };

  const handleDelete = (menuId: string) => {
    deleteMenu(menuId);
    setDeleteConfirm(null);
    showToast('success', '菜单已删除');
  };

  const handleCreateNew = () => {
    navigate('/');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Utensils className="w-8 h-8 text-amber-600" />
              <span className="text-xl font-bold text-gray-900">菜单大师</span>
            </button>
            <nav className="flex items-center gap-6">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                模板
              </button>
              <button
                onClick={() => navigate('/my-menus')}
                className="text-amber-600 font-semibold"
              >
                我的菜单
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">我的菜单</h1>
          <Button onClick={handleCreateNew}>
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
            <Button size="lg" onClick={handleCreateNew}>
              <Plus size={20} className="mr-2" />
              创建新菜单
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu, index) => (
              <motion.div
                key={menu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className="group">
                  <div
                    className="h-48 flex items-center justify-center cursor-pointer"
                    style={{ backgroundColor: menu.style.backgroundColor }}
                    onClick={() => handlePreview(menu.id)}
                  >
                    <div className="text-center p-4">
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
                        className="text-sm"
                        style={{ color: menu.style.textColor, opacity: 0.6 }}
                      >
                        {menu.categories.length} 个分类 ·{' '}
                        {menu.categories.reduce((acc, cat) => acc + cat.dishes.length, 0)} 道菜
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{menu.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye size={12} />
                        <span>{menu.viewCount || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                      <Calendar size={12} />
                      <span>更新于 {formatDate(menu.updatedAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => handleEdit(menu.id)}
                      >
                        <Edit2 size={14} className="mr-1" />
                        编辑
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyLink(menu.id)}
                        title="复制链接"
                      >
                        <Link size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirm(menu.id)}
                        title="删除"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
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
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="删除菜单"
        message="确定要删除此菜单吗？此操作不可撤销。"
        confirmText="删除"
        variant="danger"
      />
    </div>
  );
};

export default MyMenus;
