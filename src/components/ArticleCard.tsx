import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, Image, Video, FileText, Check } from 'lucide-react';
import type { Article } from '@/types';
import { priorityLabels, riskLevelLabels } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';

interface ArticleCardProps {
  article: Article;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export default function ArticleCard({ article, selectable = false, selected = false, onSelect }: ArticleCardProps) {
  const navigate = useNavigate();
  const batchMode = useAppStore((state) => state.batchMode);

  const priorityColors: Record<string, string> = {
    high: 'bg-danger-50 text-danger-600',
    medium: 'bg-warning-50 text-warning-600',
    low: 'bg-success-50 text-success-600',
  };

  const riskColors: Record<string, string> = {
    high: 'bg-danger-50 text-danger-600',
    medium: 'bg-warning-50 text-warning-600',
    low: 'bg-success-50 text-success-600',
  };

  const ContentIcon = article.contentType === 'image' ? Image : article.contentType === 'video' ? Video : FileText;

  const handleClick = () => {
    if (batchMode && onSelect) {
      onSelect(article.id);
    } else {
      navigate(`/detail/${article.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-xl shadow-card p-4 mb-3 cursor-pointer transition-all active:scale-[0.98] ${
        selected ? 'ring-2 ring-primary-500 bg-primary-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {batchMode && (
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
            selected ? 'bg-primary-600 border-primary-600' : 'border-neutral-300'
          }`}>
            {selected && <Check size={14} className="text-white" strokeWidth={3} />}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-[15px] font-semibold text-neutral-900 line-clamp-2 leading-snug flex-1">
              {article.title}
            </h3>
            <ContentIcon size={18} className="text-neutral-400 flex-shrink-0 mt-0.5" />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[11px] rounded-full font-medium">
              {article.category}
            </span>
            <span className={`px-2 py-0.5 text-[11px] rounded-full font-medium ${priorityColors[article.priority]}`}>
              {priorityLabels[article.priority]}
            </span>
            {article.isOverdue && (
              <span className="px-2 py-0.5 bg-danger-50 text-danger-600 text-[11px] rounded-full font-medium flex items-center gap-1">
                <AlertTriangle size={12} />
                已超时
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-500 text-[12px]">
              <span>{article.author}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{article.submitTime.split(' ')[1]}</span>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-[11px] rounded-full font-medium ${riskColors[article.riskLevel]}`}>
              {riskLevelLabels[article.riskLevel]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
