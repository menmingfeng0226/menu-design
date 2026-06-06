import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Eye, Users } from 'lucide-react';
import { FallbackImage } from '../common/FallbackImage';
import { useMenuStore } from '../../stores/menuStore';
import type { Template } from '../../types';

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  onPreview: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect, onPreview }) => {
  const templateUsageStats = useMenuStore((state) => state.templateUsageStats);
  
  // 统计所有用户的累积使用次数：只显示用户实际使用该模板的次数，未使用时显示0
  const totalUsage = templateUsageStats[template.id] || 0;

  return (
    <Card hover className="group">
      <div className="relative overflow-hidden">
        <FallbackImage
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          fallbackText={template.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Button size="sm" className="shadow-lg" onClick={() => onSelect(template)}>
            立即使用
          </Button>
        </div>
        {/* 使用人数 - 左上角，统计所有用户的累积使用次数，未使用时为0 */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
          <Users size={12} />
          {totalUsage > 0 ? `${totalUsage}+` : '0'}
        </div>
        {/* 预览按钮 - 右上角 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview(template);
          }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-gray-700 hover:bg-white transition-colors shadow-sm"
        >
          <Eye size={16} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
        <p className="text-sm text-gray-500">{template.category}</p>
      </div>
    </Card>
  );
};
