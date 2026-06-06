import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, ImageIcon } from 'lucide-react';
import { foodIcons } from '../../data/icons';

interface IconPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (icon: string) => void;
  currentIcon?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({ isOpen, onClose, onSelect, currentIcon }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploadedIcons, setUploadedIcons] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('customIcons');
    if (saved) {
      setUploadedIcons(JSON.parse(saved));
    }
  }, []);

  const filteredIcons = foodIcons
    .filter(cat => !selectedCategory || cat.category.includes(selectedCategory))
    .flatMap(cat => cat.icons);

  const handleIconSelect = (icon: string) => {
    onSelect(icon);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const newIcons = [...uploadedIcons, result];
        setUploadedIcons(newIcons);
        localStorage.setItem('customIcons', JSON.stringify(newIcons));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCustomIcon = (index: number) => {
    const newIcons = uploadedIcons.filter((_, i) => i !== index);
    setUploadedIcons(newIcons);
    localStorage.setItem('customIcons', JSON.stringify(newIcons));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-gray-900">选择图标</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex gap-2 p-4 border-b overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
              selectedCategory === null
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {foodIcons.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                selectedCategory === cat.category
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        <div className="p-4 overflow-y-auto max-h-[40vh]">
          {uploadedIcons.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">我的图标</span>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {uploadedIcons.map((icon, index) => (
                  <div key={index} className="relative group">
                    <button
                      onClick={() => handleIconSelect(icon)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-md ${
                        currentIcon === icon ? 'ring-2 ring-amber-500 bg-amber-50' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <img src={icon} alt="" className="w-8 h-8 object-cover rounded" />
                    </button>
                    <button
                      onClick={() => handleRemoveCustomIcon(index)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">食物图标</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2 py-1 text-xs text-amber-600 hover:bg-amber-50 rounded transition-colors"
              >
                <Upload size={12} />
                上传图标
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <div className="grid grid-cols-8 gap-2">
              {filteredIcons.length > 0 ? (
                filteredIcons.map((icon, index) => (
                  <button
                    key={index}
                    onClick={() => handleIconSelect(icon)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl transition-all hover:scale-110 hover:shadow-md ${
                      currentIcon === icon ? 'ring-2 ring-amber-500 bg-amber-50' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {icon}
                  </button>
                ))
              ) : (
                <div className="col-span-8 text-center text-gray-400 py-8">
                  <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">未找到匹配的图标</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};
