import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Undo2, Redo2, Eye, Save, Plus, Edit2, ArrowUp } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input, Textarea } from '../components/common/Input';
import { Tabs } from '../components/common/Tabs';
import { CategoryTree } from '../components/editor/CategoryTree';
import { StylePanel } from '../components/editor/StylePanel';
import { PreviewCanvas } from '../components/preview/PreviewCanvas';
import { useMenuStore, createNewCategory, createNewDish, getCurrencySymbol, currencyOptions, unitOptions } from '../stores/menuStore';
import { useToast } from '../components/common/Toast';
import { ImageUploader } from '../components/common/ImageUploader';
import type { Dish, TextStyle } from '../types';

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const location = useLocation();
  const {
    currentMenu,
    setMenu: updateMenu,
    setMenu: storeSetMenu,
    saveMenu,
    undo,
    redo,
    historyIndex,
    history,
    addCategory,
    addDish,
    updateDish,
    updateStyle,
    applyDishStyleToAll,
    applyDishUnitToAll: applyUnitToAllDishes,
    selectCategory,
    selectedCategoryId,
    selectedDishId,
    selectDish
  } = useMenuStore();
  const { showToast } = useToast();

  const handlePriceInput = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    let newValue = value.replace(/[^\d.]/g, '');
    
    const parts = newValue.split('.');
    if (parts.length > 2) {
      newValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    if (newValue.includes('.')) {
      const [integerPart, decimalPart] = newValue.split('.');
      newValue = integerPart + '.' + (decimalPart?.slice(0, 2) || '');
    }
    
    setter(newValue);
  };

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddDish, setShowAddDish] = useState(false);
  const [showEditDish, setShowEditDish] = useState(false);
  const [addDishCategoryId, setAddDishCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [dishName, setDishName] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [dishOriginalPrice, setDishOriginalPrice] = useState('');
  const [dishUnit, setDishUnit] = useState('portion');
  const [dishDescription, setDishDescription] = useState('');
  const [dishImage, setDishImage] = useState('');
  const [dishImageTransform, setDishImageTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [nameStyle, setNameStyle] = useState<{ fontFamily?: string; fontSize?: number; textColor?: string }>({});
  const [priceStyle, setPriceStyle] = useState<{ fontFamily?: string; fontSize?: number; textColor?: string }>({});
  const [descriptionStyle, setDescriptionStyle] = useState<{ fontFamily?: string; fontSize?: number; textColor?: string }>({});
  const [applyNameStyleToAll, setApplyNameStyleToAll] = useState(false);
  const [applyPriceStyleToAll, setApplyPriceStyleToAll] = useState(false);
  const [applyDescriptionStyleToAll, setApplyDescriptionStyleToAll] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [menuName, setMenuName] = useState(currentMenu?.name || '我的菜单');
  const [activeTab, setActiveTab] = useState('style');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedMenuNameRef = useRef<string>(currentMenu?.name || '');
  const initialMenuStateRef = useRef<string>('');
  const [showBackToTop, setShowBackToTop] = useState(false);



  React.useEffect(() => {
    if (currentMenu) {
      setMenuName(currentMenu.name);
      lastSavedMenuNameRef.current = currentMenu.name;
      if (history.length === 0 || historyIndex === -1) {
        storeSetMenu(currentMenu);
      }
      initialMenuStateRef.current = JSON.stringify(currentMenu);
    }
  }, [currentMenu, storeSetMenu, history.length, historyIndex]);

  useEffect(() => {
    if (currentMenu) {
      const currentState = JSON.stringify(currentMenu);
      setHasUnsavedChanges(currentState !== initialMenuStateRef.current);
    }
  }, [currentMenu]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const handleLeave = () => {
    if (hasUnsavedChanges) {
      setShowLeaveConfirm(true);
    } else {
      navigate('/?tab=my-menus');
    }
  };

  const handleConfirmLeave = async (saveChanges: boolean) => {
    setShowLeaveConfirm(false);
    if (saveChanges && currentMenu) {
      updateMenu({ ...currentMenu, name: menuName });
      saveMenu();
      showToast('success', '菜单保存成功');
    }
    navigate('/?tab=my-menus');
  };

  useEffect(() => {
    const state = location.state as any;
    if (state?.from === 'preview') {
      if (state.activeTab !== undefined) {
        setActiveTab(state.activeTab);
      }
      if (state.scrollPosition !== undefined) {
        setTimeout(() => {
          const rightPanel = document.querySelector('.w-80') as HTMLElement;
          if (rightPanel) {
            rightPanel.scrollTop = state.scrollPosition;
          }
        }, 100);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (menuName !== lastSavedMenuNameRef.current && currentMenu) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        updateMenu({ ...currentMenu, name: menuName });
        saveMenu();
        lastSavedMenuNameRef.current = menuName;
      }, 1000);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [menuName, currentMenu, updateMenu, saveMenu]);

  const handleSave = () => {
    if (!currentMenu) return;

    updateMenu({ ...currentMenu, name: menuName });
    saveMenu();
    showToast('success', '菜单保存成功');
  };

  const handlePreview = () => {
    if (!currentMenu) return;

    updateMenu({ ...currentMenu, name: menuName });
    saveMenu(); // 确保保存到 menus 数组
    
    // 保存当前滚动位置和活动标签
    const rightPanel = document.querySelector('.w-80') as HTMLElement;
    const scrollPosition = rightPanel?.scrollTop || 0;
    
    navigate(`/preview/${currentMenu.id}`, { 
      state: { 
        from: 'editor', 
        templateId: currentMenu.templateId,
        scrollPosition,
        activeTab
      } 
    });
  };

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      showToast('error', '请输入分类名称');
      return;
    }

    const newCategory = createNewCategory(categoryName.trim());
    addCategory(newCategory);
    setCategoryName('');
    setShowAddCategory(false);
    showToast('success', '分类添加成功');
  };

  const handleAddDish = () => {
    if (!dishName.trim()) {
      showToast('error', '请输入菜品名称');
      return;
    }

    if (!dishPrice || Number(dishPrice) <= 0) {
      showToast('error', '请输入有效的价格');
      return;
    }

    if (!addDishCategoryId) {
      showToast('error', '请先选择分类');
      return;
    }

    const newDish = createNewDish(dishName.trim(), Number(dishPrice));
    newDish.priceString = dishPrice;
    newDish.unit = dishUnit;
    if (dishDescription.trim()) {
      newDish.description = dishDescription.trim();
    }
    if (dishOriginalPrice) {
      newDish.originalPrice = Number(dishOriginalPrice);
      newDish.originalPriceString = dishOriginalPrice;
    }
    if (dishImage) {
      newDish.image = dishImage;
      if (dishImageTransform.scale !== 1 || dishImageTransform.x !== 0 || dishImageTransform.y !== 0) {
        newDish.imageTransform = dishImageTransform;
      }
    }
    
    const defaultFontFamily = currentMenu?.style.fontFamily || '';
    const defaultFontSize = currentMenu?.style.fontSize || 16;
    const defaultTextColor = currentMenu?.style.textColor || '#333333';
    
    const nameStyleIsDefault = 
      nameStyle.fontFamily === defaultFontFamily && 
      nameStyle.fontSize === defaultFontSize && 
      nameStyle.textColor === defaultTextColor;
    
    const priceStyleIsDefault = 
      priceStyle.fontFamily === defaultFontFamily && 
      priceStyle.fontSize === defaultFontSize && 
      priceStyle.textColor === defaultTextColor;
    
    const descriptionStyleIsDefault = 
      descriptionStyle.fontFamily === defaultFontFamily && 
      descriptionStyle.fontSize === defaultFontSize && 
      descriptionStyle.textColor === defaultTextColor;
    
    if (!nameStyleIsDefault) {
      newDish.nameStyle = nameStyle;
    }
    if (!priceStyleIsDefault) {
      newDish.priceStyle = priceStyle;
    }
    if (!descriptionStyleIsDefault) {
      newDish.descriptionStyle = descriptionStyle;
    }

    if (applyNameStyleToAll) {
      applyDishStyleToAll('nameStyle', nameStyle);
    }
    if (applyPriceStyleToAll) {
      applyDishStyleToAll('priceStyle', priceStyle);
      applyUnitToAllDishes(dishUnit);
    }
    if (applyDescriptionStyleToAll) {
      applyDishStyleToAll('descriptionStyle', descriptionStyle);
    }

    addDish(addDishCategoryId, newDish);
    setDishName('');
    setDishPrice('');
    setDishOriginalPrice('');
    setDishDescription('');
    setDishImage('');
    setNameStyle({});
    setPriceStyle({});
    setDescriptionStyle({});
    setShowAddDish(false);
    setAddDishCategoryId(null);
    showToast('success', '菜品添加成功');
  };

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setDishName(dish.name);
    setDishPrice(dish.priceString || dish.price.toString());
    setDishOriginalPrice(dish.originalPriceString || dish.originalPrice?.toString() || '');
    setDishUnit(dish.unit || 'portion');
    setDishDescription(dish.description || '');
    setDishImage(dish.image || '');
    setDishImageTransform(dish.imageTransform || { scale: 1, x: 0, y: 0 });
    
    const defaultFontFamily = currentMenu?.style.fontFamily || '';
    const defaultFontSize = currentMenu?.style.fontSize || 16;
    const defaultTextColor = currentMenu?.style.textColor || '#333333';
    
    setNameStyle({
      fontFamily: dish.nameStyle?.fontFamily ?? defaultFontFamily,
      fontSize: dish.nameStyle?.fontSize ?? defaultFontSize,
      textColor: dish.nameStyle?.textColor ?? defaultTextColor
    });
    setPriceStyle({
      fontFamily: dish.priceStyle?.fontFamily ?? defaultFontFamily,
      fontSize: dish.priceStyle?.fontSize ?? defaultFontSize,
      textColor: dish.priceStyle?.textColor ?? defaultTextColor
    });
    setDescriptionStyle({
      fontFamily: dish.descriptionStyle?.fontFamily ?? defaultFontFamily,
      fontSize: dish.descriptionStyle?.fontSize ?? defaultFontSize,
      textColor: dish.descriptionStyle?.textColor ?? defaultTextColor
    });
    setShowEditDish(true);
  };

  const handleSaveEditDish = () => {
    if (!editingDish) return;
    if (!dishName.trim()) {
      showToast('error', '请输入菜品名称');
      return;
    }
    if (!dishPrice || Number(dishPrice) <= 0) {
      showToast('error', '请输入有效的价格');
      return;
    }

    const hasTransform = dishImageTransform.scale !== 1 || dishImageTransform.x !== 0 || dishImageTransform.y !== 0;
    
    const defaultFontFamily = currentMenu?.style.fontFamily || '';
    const defaultFontSize = currentMenu?.style.fontSize || 16;
    const defaultTextColor = currentMenu?.style.textColor || '#333333';
    
    const oldNameStyle = editingDish?.nameStyle;
    const oldPriceStyle = editingDish?.priceStyle;
    const oldDescriptionStyle = editingDish?.descriptionStyle;
    
    const nameStyleChanged = 
      nameStyle.fontFamily !== (oldNameStyle?.fontFamily ?? defaultFontFamily) || 
      nameStyle.fontSize !== (oldNameStyle?.fontSize ?? defaultFontSize) || 
      nameStyle.textColor !== (oldNameStyle?.textColor ?? defaultTextColor);
    
    const priceStyleChanged = 
      priceStyle.fontFamily !== (oldPriceStyle?.fontFamily ?? defaultFontFamily) || 
      priceStyle.fontSize !== (oldPriceStyle?.fontSize ?? defaultFontSize) || 
      priceStyle.textColor !== (oldPriceStyle?.textColor ?? defaultTextColor);
    
    const descriptionStyleChanged = 
      descriptionStyle.fontFamily !== (oldDescriptionStyle?.fontFamily ?? defaultFontFamily) || 
      descriptionStyle.fontSize !== (oldDescriptionStyle?.fontSize ?? defaultFontSize) || 
      descriptionStyle.textColor !== (oldDescriptionStyle?.textColor ?? defaultTextColor);
    
    const nameStyleIsDefault = 
      nameStyle.fontFamily === defaultFontFamily && 
      nameStyle.fontSize === defaultFontSize && 
      nameStyle.textColor === defaultTextColor;
    
    const priceStyleIsDefault = 
      priceStyle.fontFamily === defaultFontFamily && 
      priceStyle.fontSize === defaultFontSize && 
      priceStyle.textColor === defaultTextColor;
    
    const descriptionStyleIsDefault = 
      descriptionStyle.fontFamily === defaultFontFamily && 
      descriptionStyle.fontSize === defaultFontSize && 
      descriptionStyle.textColor === defaultTextColor;
    
    const updateData: Partial<Dish> = {
      name: dishName.trim(),
      price: Number(dishPrice),
      priceString: dishPrice,
      unit: dishUnit,
      description: dishDescription.trim() || undefined,
      originalPrice: dishOriginalPrice ? Number(dishOriginalPrice) : undefined,
      originalPriceString: dishOriginalPrice || undefined,
      image: dishImage || '',
      imageTransform: hasTransform ? dishImageTransform : undefined,
      nameStyle: nameStyleChanged ? (nameStyleIsDefault ? undefined : nameStyle) : oldNameStyle,
      priceStyle: priceStyleChanged ? (priceStyleIsDefault ? undefined : priceStyle) : oldPriceStyle,
      descriptionStyle: descriptionStyleChanged ? (descriptionStyleIsDefault ? undefined : descriptionStyle) : oldDescriptionStyle,
    };

    updateDish(editingDish.id, updateData);
    
    if (applyNameStyleToAll) {
      applyDishStyleToAll('nameStyle', nameStyleIsDefault ? undefined : nameStyle);
    }
    if (applyPriceStyleToAll) {
      applyDishStyleToAll('priceStyle', priceStyleIsDefault ? undefined : priceStyle);
      applyUnitToAllDishes(dishUnit);
    }
    if (applyDescriptionStyleToAll) {
      applyDishStyleToAll('descriptionStyle', descriptionStyleIsDefault ? undefined : descriptionStyle);
    }
    
    setShowEditDish(false);
    setEditingDish(null);
    setDishName('');
    setDishPrice('');
    setDishOriginalPrice('');
    setDishUnit('portion');
    setDishDescription('');
    setDishImage('');
    setNameStyle({});
    setPriceStyle({});
    setDescriptionStyle({});
    setApplyNameStyleToAll(false);
    setApplyPriceStyleToAll(false);
    setApplyDescriptionStyleToAll(false);
    showToast('success', '菜品修改成功');
  };

  const handleAddDishFromTree = (categoryId: string) => {
    setAddDishCategoryId(categoryId);
    setDishName('');
    setDishPrice('');
    setDishOriginalPrice('');
    setDishUnit('portion');
    setDishDescription('');
    setDishImage('');
    
    const defaultFontFamily = currentMenu?.style.fontFamily || '';
    const defaultFontSize = currentMenu?.style.fontSize || 16;
    const defaultTextColor = currentMenu?.style.textColor || '#333333';
    
    setNameStyle({
      fontFamily: defaultFontFamily,
      fontSize: defaultFontSize,
      textColor: defaultTextColor
    });
    setPriceStyle({
      fontFamily: defaultFontFamily,
      fontSize: defaultFontSize,
      textColor: defaultTextColor
    });
    setDescriptionStyle({
      fontFamily: defaultFontFamily,
      fontSize: defaultFontSize,
      textColor: defaultTextColor
    });
    setShowAddDish(true);
  };

  if (!currentMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">未找到菜单</p>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-50 sticky top-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLeave}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">返回</span>
            </button>
            <Input
              className="border-gray-300 bg-white text-xl font-semibold"
              type="text"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="菜单名称"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              title="撤销"
            >
              <Undo2 size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              title="重做"
            >
              <Redo2 size={18} />
            </Button>
            <Button variant="secondary" size="sm" onClick={handlePreview}>
              <Eye size={18} className="mr-1" />
              预览
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save size={18} className="mr-1" />
              保存
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Categories */}
        <aside className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <CategoryTree onAddDish={handleAddDishFromTree} />

          <Button
            className="w-full mt-4"
            variant="secondary"
            onClick={() => setShowAddCategory(true)}
          >
            <Plus size={18} className="mr-2" />
            添加分类
          </Button>
        </aside>

        {/* Right Panel - Style & Edit */}
        <aside className="flex-1 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <Tabs
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={[
              {
                id: 'style',
                label: '背景排版',
                content: <StylePanel />,
              },
              {
                id: 'edit',
                label: selectedDishId ? '编辑菜品' : '选中菜品',
                content: (() => {
                  const selectedDish = currentMenu.categories.flatMap(cat => cat.dishes).find(d => d.id === selectedDishId);
                  if (selectedDish) {
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{selectedDish.name}</h3>
                          <Button size="sm" onClick={() => handleEditDish(selectedDish)}>
                            <Edit2 size={14} className="mr-1" />
                            编辑
                          </Button>
                        </div>
                        {selectedDish.image && (
                          <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={selectedDish.image}
                              alt={selectedDish.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="text-gray-600">
                          <p>活动价：{getCurrencySymbol(currentMenu.style.currency)}{selectedDish.price.toFixed(2)}</p>
                          {selectedDish.originalPrice && (
                            <p>
                              原价：<span className={selectedDish.originalPrice <= selectedDish.price ? 'text-red-500' : ''}>
                                {getCurrencySymbol(currentMenu.style.currency)}{selectedDish.originalPrice.toFixed(2)}
                              </span>
                              {selectedDish.originalPrice <= selectedDish.price && <span className="ml-2 text-xs text-red-500">（原价小于等于活动价）</span>}
                            </p>
                          )}
                          {selectedDish.description && <p>描述：{selectedDish.description}</p>}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      <p className="text-gray-500 text-sm">请选择左侧分类树中的菜品来编辑详情</p>
                    </div>
                  );
                })(),
              },
            ]}
          />
        </aside>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={handleBackToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300 flex items-center justify-center z-50 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        title="快速置顶"
      >
        <ArrowUp size={20} />
      </button>

      {/* Add Category Modal */}
      <Modal
        isOpen={showAddCategory}
        onClose={() => {
          setShowAddCategory(false);
          setCategoryName('');
        }}
        title="添加分类"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowAddCategory(false)}>
              取消
            </Button>
            <Button onClick={handleAddCategory}>添加</Button>
          </div>
        }
      >
        <Input
          label="分类名称"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="例如：凉菜、热菜、饮品等"
          autoFocus
        />
      </Modal>

      {/* Add Dish Modal */}
      <Modal
        isOpen={showAddDish}
        onClose={() => {
          setShowAddDish(false);
          setDishName('');
          setDishPrice('');
          setDishOriginalPrice('');
          setDishDescription('');
          setDishImage('');
          setAddDishCategoryId(null);
        }}
        title="添加菜品"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowAddDish(false)}>
              取消
            </Button>
            <Button onClick={handleAddDish}>添加</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <Input
              label="菜品名称"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="例如：宫保鸡丁"
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">字体设置（可选）</label>
                <select
                  value={nameStyle.fontFamily || currentMenu?.style.fontFamily || ''}
                  onChange={(e) => setNameStyle({ ...nameStyle, fontFamily: e.target.value || undefined })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">使用全局字体</option>
                  <option value="Noto Sans SC">思源黑体</option>
                  <option value="Noto Serif SC">思源宋体</option>
                  <option value="Ma Shan Zheng">马善政楷书</option>
                  <option value="ZCOOL KuaiLe">站酷高端黑</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">字体大小</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={nameStyle.fontSize || currentMenu?.style.fontSize || 16}
                    onChange={(e) => setNameStyle({ ...nameStyle, fontSize: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {nameStyle.fontSize || currentMenu?.style.fontSize || 16}px
                  </span>
                </div>
              </div>
              <div className="w-20">
                <label className="block text-xs font-medium text-gray-500 mb-1">颜色</label>
                <input
                  type="color"
                  value={nameStyle.textColor || currentMenu?.style.textColor || '#333333'}
                  onChange={(e) => setNameStyle({ ...nameStyle, textColor: e.target.value })}
                  className="w-full h-8 rounded-md cursor-pointer border border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="applyNameStyleToAll"
                checked={applyNameStyleToAll}
                onChange={(e) => setApplyNameStyleToAll(e.target.checked)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="applyNameStyleToAll" className="ml-2 text-sm text-gray-600">
                设置应用到所有菜品
              </label>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  label="活动价"
                  type="text"
                  value={dishPrice}
                  onChange={(e) => handlePriceInput(e.target.value, setDishPrice)}
                  placeholder="支持输入2位小数"
                />
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Input
                    label="原价（可选）"
                    type="text"
                    value={dishOriginalPrice}
                    onChange={(e) => handlePriceInput(e.target.value, setDishOriginalPrice)}
                    placeholder="支持输入2位小数"
                    className={
                      dishOriginalPrice && dishPrice && Number(dishOriginalPrice) <= Number(dishPrice)
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {dishOriginalPrice && dishPrice && Number(dishOriginalPrice) <= Number(dishPrice) && (
                    <p className="mt-1 text-xs text-red-500">原价小于等于活动价</p>
                  )}
                </div>
              </div>
              <div className="w-28">
                <label className="block text-sm font-medium text-gray-700 mb-1">规格</label>
                <select
                  value={dishUnit}
                  onChange={(e) => setDishUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  style={{ fontSize: '0.875rem' }}
                  required
                >
                  {unitOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">字体设置（可选）</label>
                <select
                  value={priceStyle.fontFamily || currentMenu?.style.fontFamily || ''}
                  onChange={(e) => setPriceStyle({ ...priceStyle, fontFamily: e.target.value || undefined })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">使用全局字体</option>
                  <option value="Noto Sans SC">思源黑体</option>
                  <option value="Noto Serif SC">思源宋体</option>
                  <option value="Ma Shan Zheng">马善政楷书</option>
                  <option value="ZCOOL KuaiLe">站酷高端黑</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">字体大小</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={priceStyle.fontSize || currentMenu?.style.fontSize || 16}
                    onChange={(e) => setPriceStyle({ ...priceStyle, fontSize: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {priceStyle.fontSize || currentMenu?.style.fontSize || 16}px
                  </span>
                </div>
              </div>
              <div className="w-20">
                <label className="block text-xs font-medium text-gray-500 mb-1">颜色</label>
                <input
                  type="color"
                  value={priceStyle.textColor || currentMenu?.style.textColor || '#333333'}
                  onChange={(e) => setPriceStyle({ ...priceStyle, textColor: e.target.value })}
                  className="w-full h-8 rounded-md cursor-pointer border border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="applyPriceStyleToAll"
                checked={applyPriceStyleToAll}
                onChange={(e) => setApplyPriceStyleToAll(e.target.checked)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="applyPriceStyleToAll" className="ml-2 text-sm text-gray-600">
                设置应用到所有菜品
              </label>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <Textarea
              label="描述（可选）"
              value={dishDescription}
              onChange={(e) => setDishDescription(e.target.value)}
              placeholder="简要描述菜品特色"
              rows={3}
            />
            <div className="flex gap-2 mt-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">字体设置（可选）</label>
                <select
                  value={descriptionStyle.fontFamily || currentMenu?.style.fontFamily || ''}
                  onChange={(e) => setDescriptionStyle({ ...descriptionStyle, fontFamily: e.target.value || undefined })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">使用全局字体</option>
                  <option value="Noto Sans SC">思源黑体</option>
                  <option value="Noto Serif SC">思源宋体</option>
                  <option value="Ma Shan Zheng">马善政楷书</option>
                  <option value="ZCOOL KuaiLe">站酷高端黑</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">字体大小</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={descriptionStyle.fontSize || currentMenu?.style.fontSize || 16}
                    onChange={(e) => setDescriptionStyle({ ...descriptionStyle, fontSize: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {descriptionStyle.fontSize || currentMenu?.style.fontSize || 16}px
                  </span>
                </div>
              </div>
              <div className="w-20">
                <label className="block text-xs font-medium text-gray-500 mb-1">颜色</label>
                <input
                  type="color"
                  value={descriptionStyle.textColor || currentMenu?.style.textColor || '#333333'}
                  onChange={(e) => setDescriptionStyle({ ...descriptionStyle, textColor: e.target.value })}
                  className="w-full h-8 rounded-md cursor-pointer border border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="applyDescriptionStyleToAll"
                checked={applyDescriptionStyleToAll}
                onChange={(e) => setApplyDescriptionStyleToAll(e.target.checked)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="applyDescriptionStyleToAll" className="ml-2 text-sm text-gray-600">
                设置应用到所有菜品
              </label>
            </div>
          </div>
          <Input
            label="图片（可选）"
            type="text"
            value={dishImage}
            onChange={(e) => setDishImage(e.target.value)}
            placeholder="输入图片链接"
          />
          <ImageUploader
            value={dishImage}
            onChange={setDishImage}
            label="或上传图片"
            layoutType={currentMenu?.style.layoutType}
            imageTransform={dishImageTransform}
            onTransformChange={setDishImageTransform}
          />
        </div>
      </Modal>

      {/* Edit Dish Modal */}
      <Modal
        isOpen={showEditDish}
        onClose={() => {
          setShowEditDish(false);
          setEditingDish(null);
          setDishName('');
          setDishPrice('');
          setDishOriginalPrice('');
          setDishDescription('');
          setDishImage('');
        }}
        title="编辑菜品"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowEditDish(false)}>
              取消
            </Button>
            <Button onClick={handleSaveEditDish}>保存</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <Input
              label="菜品名称"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="例如：宫保鸡丁"
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">字体设置（可选）</label>
                <select
                  value={nameStyle.fontFamily || currentMenu?.style.fontFamily || ''}
                  onChange={(e) => setNameStyle({ ...nameStyle, fontFamily: e.target.value || undefined })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">使用全局字体</option>
                  <option value="Noto Sans SC">思源黑体</option>
                  <option value="Noto Serif SC">思源宋体</option>
                  <option value="Ma Shan Zheng">马善政楷书</option>
                  <option value="ZCOOL KuaiLe">站酷高端黑</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">字体大小</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={nameStyle.fontSize || currentMenu?.style.fontSize || 16}
                    onChange={(e) => setNameStyle({ ...nameStyle, fontSize: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {nameStyle.fontSize || currentMenu?.style.fontSize || 16}px
                  </span>
                </div>
              </div>
              <div className="w-20">
                <label className="block text-xs font-medium text-gray-500 mb-1">颜色</label>
                <input
                  type="color"
                  value={nameStyle.textColor || currentMenu?.style.textColor || '#333333'}
                  onChange={(e) => setNameStyle({ ...nameStyle, textColor: e.target.value })}
                  className="w-full h-8 rounded-md cursor-pointer border border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="applyNameStyleToAll"
                checked={applyNameStyleToAll}
                onChange={(e) => setApplyNameStyleToAll(e.target.checked)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="applyNameStyleToAll" className="ml-2 text-sm text-gray-600">
                设置应用到所有菜品
              </label>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  label="活动价"
                  type="text"
                  value={dishPrice}
                  onChange={(e) => handlePriceInput(e.target.value, setDishPrice)}
                  placeholder="支持输入2位小数"
                />
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Input
                    label="原价（可选）"
                    type="text"
                    value={dishOriginalPrice}
                    onChange={(e) => handlePriceInput(e.target.value, setDishOriginalPrice)}
                    placeholder="支持输入2位小数"
                    className={
                      dishOriginalPrice && dishPrice && Number(dishOriginalPrice) <= Number(dishPrice)
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {dishOriginalPrice && dishPrice && Number(dishOriginalPrice) <= Number(dishPrice) && (
                    <p className="mt-1 text-xs text-red-500">原价小于等于活动价</p>
                  )}
                </div>
              </div>
              <div className="w-28">
                <label className="block text-sm font-medium text-gray-700 mb-1">规格</label>
                <select
                  value={dishUnit}
                  onChange={(e) => setDishUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  style={{ fontSize: '0.875rem' }}
                  required
                >
                  {unitOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">字体设置（可选）</label>
                <select
                  value={priceStyle.fontFamily || currentMenu?.style.fontFamily || ''}
                  onChange={(e) => setPriceStyle({ ...priceStyle, fontFamily: e.target.value || undefined })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">使用全局字体</option>
                  <option value="Noto Sans SC">思源黑体</option>
                  <option value="Noto Serif SC">思源宋体</option>
                  <option value="Ma Shan Zheng">马善政楷书</option>
                  <option value="ZCOOL KuaiLe">站酷高端黑</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">字体大小</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={priceStyle.fontSize || currentMenu?.style.fontSize || 16}
                    onChange={(e) => setPriceStyle({ ...priceStyle, fontSize: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {priceStyle.fontSize || currentMenu?.style.fontSize || 16}px
                  </span>
                </div>
              </div>
              <div className="w-20">
                <label className="block text-xs font-medium text-gray-500 mb-1">颜色</label>
                <input
                  type="color"
                  value={priceStyle.textColor || currentMenu?.style.textColor || '#333333'}
                  onChange={(e) => setPriceStyle({ ...priceStyle, textColor: e.target.value })}
                  className="w-full h-8 rounded-md cursor-pointer border border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="applyPriceStyleToAll"
                checked={applyPriceStyleToAll}
                onChange={(e) => setApplyPriceStyleToAll(e.target.checked)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="applyPriceStyleToAll" className="ml-2 text-sm text-gray-600">
                设置应用到所有菜品
              </label>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <Textarea
              label="描述（可选）"
              value={dishDescription}
              onChange={(e) => setDishDescription(e.target.value)}
              placeholder="简要描述菜品特色"
              rows={3}
            />
            <div className="flex gap-2 mt-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">字体设置（可选）</label>
                <select
                  value={descriptionStyle.fontFamily || currentMenu?.style.fontFamily || ''}
                  onChange={(e) => setDescriptionStyle({ ...descriptionStyle, fontFamily: e.target.value || undefined })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">使用全局字体</option>
                  <option value="Noto Sans SC">思源黑体</option>
                  <option value="Noto Serif SC">思源宋体</option>
                  <option value="Ma Shan Zheng">马善政楷书</option>
                  <option value="ZCOOL KuaiLe">站酷高端黑</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">字体大小</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={descriptionStyle.fontSize || currentMenu?.style.fontSize || 16}
                    onChange={(e) => setDescriptionStyle({ ...descriptionStyle, fontSize: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {descriptionStyle.fontSize || currentMenu?.style.fontSize || 16}px
                  </span>
                </div>
              </div>
              <div className="w-20">
                <label className="block text-xs font-medium text-gray-500 mb-1">颜色</label>
                <input
                  type="color"
                  value={descriptionStyle.textColor || currentMenu?.style.textColor || '#333333'}
                  onChange={(e) => setDescriptionStyle({ ...descriptionStyle, textColor: e.target.value })}
                  className="w-full h-8 rounded-md cursor-pointer border border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="applyDescriptionStyleToAll"
                checked={applyDescriptionStyleToAll}
                onChange={(e) => setApplyDescriptionStyleToAll(e.target.checked)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="applyDescriptionStyleToAll" className="ml-2 text-sm text-gray-600">
                设置应用到所有菜品
              </label>
            </div>
          </div>
          <Input
            label="图片（可选）"
            type="text"
            value={dishImage}
            onChange={(e) => setDishImage(e.target.value)}
            placeholder="输入图片链接"
          />
          <ImageUploader
            value={dishImage}
            onChange={setDishImage}
            label="或上传图片"
            layoutType={currentMenu?.style.layoutType}
            imageTransform={dishImageTransform}
            onTransformChange={setDishImageTransform}
          />
        </div>
      </Modal>

      {/* Leave Confirm Modal */}
      <Modal
        isOpen={showLeaveConfirm}
        onClose={() => setShowLeaveConfirm(false)}
        title="确认退出"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => handleConfirmLeave(false)}>
              不保存
            </Button>
            <Button onClick={() => handleConfirmLeave(true)}>
              保存并退出
            </Button>
          </div>
        }
      >
        <p className="text-gray-600">您的菜单有未保存的更改，确定要退出吗？</p>
      </Modal>
    </div>
  );
};

export default Editor;
