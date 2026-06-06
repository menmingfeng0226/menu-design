import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronDown, Plus, Trash2, Edit2, Copy, Upload, GripVertical, Palette } from 'lucide-react';
import { useMenuStore, getCurrencySymbol, unitOptions } from '../../stores/menuStore';
import { Button } from '../common/Button';
import { ConfirmModal } from '../common/Modal';
import { IconPicker } from '../common/IconPicker';
import type { Category, Dish } from '../../types';

interface CategoryTreeProps {
  onAddDish: (categoryId: string) => void;
}

const getUnitLabel = (unitCode?: string) => {
  if (!unitCode) return '/份';
  const unit = unitOptions.find(u => u.code === unitCode);
  return unit?.label || '/份';
};

export const CategoryTree: React.FC<CategoryTreeProps> = ({ onAddDish }) => {
  const {
    currentMenu,
    selectedCategoryId,
    selectedDishId,
    selectCategory,
    selectDish,
    deleteCategory,
    deleteDish,
    updateCategory,
    copyDish,
    reorderCategory,
    reorderDish,
  } = useMenuStore();

  const [draggedItem, setDraggedItem] = useState<{ type: 'category' | 'dish'; id: string; categoryId?: string } | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteDishConfirm, setDeleteDishConfirm] = useState<{ categoryId: string; dishId: string } | null>(null);
  const [uploadingIcon, setUploadingIcon] = useState<string | null>(null);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [selectedCategoryIdForIcon, setSelectedCategoryIdForIcon] = useState<string | null>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleCategoryDragStart = (e: React.DragEvent, categoryId: string, index: number) => {
    setDraggedItem({ type: 'category', id: categoryId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'category', id: categoryId, index }));
  };

  const handleCategoryDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleCategoryDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'category' && parsed.index !== toIndex) {
        reorderCategory(parsed.index, toIndex);
      }
    } catch (err) {
      console.error('Failed to parse drag data:', err);
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleCategoryDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDishDragStart = (e: React.DragEvent, categoryId: string, dishId: string, dishIndex: number) => {
    setDraggedItem({ type: 'dish', id: dishId, categoryId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'dish', categoryId, dishId, dishIndex }));
  };

  const handleDishDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCategoryId(categoryId);
  };

  const handleDishDrop = (e: React.DragEvent, categoryId: string, dishIndex: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'dish' && parsed.categoryId === categoryId && parsed.dishIndex !== dishIndex) {
        reorderDish(categoryId, parsed.dishIndex, dishIndex);
      }
    } catch (err) {
      console.error('Failed to parse drag data:', err);
    }
    setDraggedItem(null);
    setDragOverCategoryId(null);
  };

  const handleDishDragEnd = () => {
    setDraggedItem(null);
    setDragOverCategoryId(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category.id);
    setEditingName(category.name);
  };

  const handleSaveCategory = () => {
    if (editingCategory && editingName.trim()) {
      updateCategory(editingCategory, { name: editingName.trim() });
      setEditingCategory(null);
      setEditingName('');
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
    setDeleteConfirm(null);
    if (selectedCategoryId === categoryId) {
      selectCategory(null);
    }
  };

  const handleDeleteDish = () => {
    if (deleteDishConfirm) {
      deleteDish(deleteDishConfirm.categoryId, deleteDishConfirm.dishId);
      if (selectedDishId === deleteDishConfirm.dishId) {
        selectDish(null);
      }
      setDeleteDishConfirm(null);
    }
  };

  const handleIconSelect = (icon: string) => {
    if (selectedCategoryIdForIcon) {
      updateCategory(selectedCategoryIdForIcon, { icon });
    }
  };

  const handleOpenIconPicker = (categoryId: string, category: Category) => {
    setSelectedCategoryIdForIcon(categoryId);
    setIsIconPickerOpen(true);
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateCategory(categoryId, { icon: result });
        setUploadingIcon(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveIcon = (categoryId: string) => {
    updateCategory(categoryId, { icon: undefined });
  };

  if (!currentMenu) {
    return (
      <div className="text-center text-gray-500 py-8">
        未加载菜单
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">菜品分类</h3>
          <span className="text-xs text-gray-400">(可拖拽移动)</span>
        </div>
      </div>

      {currentMenu.categories.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p className="mb-2">暂无分类</p>
          <p className="text-sm">点击下方按钮添加</p>
        </div>
      ) : (
        <div className="space-y-1">
          {currentMenu.categories.map((category, catIndex) => (
            <div key={category.id}>
              <div
                className={`
                  flex items-center gap-2 p-2 rounded-lg cursor-pointer
                  transition-colors
                  ${selectedCategoryId === category.id ? 'bg-amber-50 border border-amber-200' : 'hover:bg-gray-50'}
                  ${dragOverIndex === catIndex ? 'ring-2 ring-amber-400 ring-offset-1' : ''}
                `}
                onClick={() => selectCategory(category.id)}
                draggable
                onDragStart={(e) => handleCategoryDragStart(e, category.id, catIndex)}
                onDragOver={(e) => handleCategoryDragOver(e, catIndex)}
                onDrop={(e) => handleCategoryDrop(e, catIndex)}
                onDragEnd={handleCategoryDragEnd}
              >
                <span className="text-gray-400 hover:text-gray-500 cursor-grab active:cursor-grabbing" title="拖拽移动分类">
                  <GripVertical size={16} />
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(category.id);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {editingCategory === category.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleSaveCategory}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveCategory();
                      if (e.key === 'Escape') {
                        setEditingCategory(null);
                        setEditingName('');
                      }
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <div className="relative w-6 h-6 flex items-center justify-center">
                      {category.icon && (
                        <>
                          {!category.icon.startsWith('data:') && !category.icon.startsWith('http') ? (
                            <span className="text-lg">{category.icon}</span>
                          ) : (
                            <img
                              src={category.icon}
                              alt=""
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveIcon(category.id);
                            }}
                            className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-600"
                            title="删除图标"
                          >
                            ×
                          </button>
                        </>
                      )}
                      {!category.icon && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenIconPicker(category.id, category);
                            }}
                            className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-dashed border-gray-300 hover:border-amber-500 hover:bg-amber-50 cursor-pointer transition-colors"
                            title="选择图标"
                          >
                            <Palette size={10} className="text-gray-400" />
                          </button>
                          <label
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-dashed border-gray-300 hover:border-amber-500 hover:bg-amber-50 cursor-pointer transition-colors"
                            title="上传图标"
                          >
                            <Upload size={10} className="text-gray-400" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleIconUpload(e, category.id)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                      {category.icon && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenIconPicker(category.id, category);
                          }}
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center hover:bg-blue-600"
                          title="更换图标"
                        >
                          ✎
                        </button>
                      )}
                    </div>
                    <span className="flex-1 font-medium text-gray-900 text-sm ml-2">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({category.dishes.length})
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCategory(category);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="编辑分类"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(category.id);
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>

              {expandedCategories.has(category.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {category.dishes.map((dish, dishIndex) => (
                    <div
                      key={dish.id}
                      className={`
                        flex items-center gap-2 p-2 rounded cursor-pointer
                        transition-colors
                        ${selectedDishId === dish.id ? 'bg-amber-50 border border-amber-200' : 'hover:bg-gray-50'}
                        ${dragOverCategoryId === category.id ? 'ring-2 ring-amber-400 ring-offset-1' : ''}
                      `}
                      onClick={() => selectDish(dish.id)}
                      draggable
                      onDragStart={(e) => handleDishDragStart(e, category.id, dish.id, dishIndex)}
                      onDragOver={(e) => handleDishDragOver(e, category.id)}
                      onDrop={(e) => handleDishDrop(e, category.id, dishIndex)}
                      onDragEnd={handleDishDragEnd}
                    >
                      <span className="text-gray-400 hover:text-gray-500 cursor-grab active:cursor-grabbing" title="拖拽移动菜品">
                        <GripVertical size={14} />
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {dish.image && dish.image.trim() !== '' && (dish.image.startsWith('data:') || dish.image.startsWith('http')) && (
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-6 h-6 rounded object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          )}
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {dish.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {getCurrencySymbol(currentMenu.style.currency)}{dish.price.toFixed(2)}{getUnitLabel(dish.unit)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyDish(category.id, dish.id);
                        }}
                        className="text-gray-400 hover:text-amber-600"
                        title="复制菜品"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteDishConfirm({ categoryId: category.id, dishId: dish.id });
                        }}
                        className="text-gray-400 hover:text-red-600"
                        title="删除菜品"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => onAddDish(category.id)}
                    className="flex items-center gap-1 w-full p-2 text-sm text-amber-600 hover:bg-amber-50 rounded transition-colors"
                  >
                    <Plus size={14} />
                    添加菜品
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDeleteCategory(deleteConfirm)}
        title="删除分类"
        message="确定要删除此分类吗？该分类下的所有菜品也会被删除。"
        confirmText="删除"
        variant="danger"
      />

      <ConfirmModal
        isOpen={deleteDishConfirm !== null}
        onClose={() => setDeleteDishConfirm(null)}
        onConfirm={handleDeleteDish}
        title="删除菜品"
        message="确定要删除此菜品吗？"
        confirmText="删除"
        variant="danger"
      />

      <IconPicker
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelect={handleIconSelect}
        currentIcon={selectedCategoryIdForIcon ? currentMenu.categories.find(c => c.id === selectedCategoryIdForIcon)?.icon : undefined}
      />
    </div>
  );
};
