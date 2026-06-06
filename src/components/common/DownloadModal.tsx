import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { FileImage, FileText, FileSpreadsheet, Download } from 'lucide-react';

interface DownloadOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  format: 'jpg' | 'png' | 'pdf' | 'doc';
}

interface ResolutionOption {
  id: string;
  label: string;
  scale: number;
}

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuName: string;
  onDownload: (format: string, resolution: string) => Promise<void>;
  isDownloading: boolean;
}

const downloadOptions: DownloadOption[] = [
  {
    id: 'jpg',
    label: '下载图片 (JPG)',
    description: '适合在社交媒体分享',
    icon: <FileImage size={24} />,
    format: 'jpg'
  },
  {
    id: 'png',
    label: '下载图片 (PNG)',
    description: '高清透明背景图片',
    icon: <FileImage size={24} />,
    format: 'png'
  },
  {
    id: 'pdf',
    label: '下载 PDF',
    description: '适合打印和文档存档',
    icon: <FileText size={24} />,
    format: 'pdf'
  },
  {
    id: 'doc',
    label: '下载 DOC',
    description: '适合 Word 文档编辑',
    icon: <FileSpreadsheet size={24} />,
    format: 'doc'
  },
];

const resolutionOptions: ResolutionOption[] = [
  { id: '1x', label: '720p (普通)', scale: 1 },
  { id: '2x', label: '1080p (高清)', scale: 2 },
  { id: '3x', label: '2K (超清)', scale: 3 },
  { id: '4x', label: '4K (极致)', scale: 4 },
];

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  menuName,
  onDownload,
  isDownloading
}) => {
  const [selectedResolution, setSelectedResolution] = useState<string>('2x');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="下载菜单"
      size="md"
    >
      <div className="space-y-4">
        <p className="text-gray-600">选择您要下载的文件格式：</p>
        
        <div className="grid grid-cols-1 gap-3">
          {downloadOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onDownload(option.format, selectedResolution)}
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
  );
};
