import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, AlertTriangle, ChevronRight, Image, Video, FileText } from 'lucide-react';
import Header from '@/components/Header';
import { useAppStore } from '@/store/useAppStore';
import { reviewGroups, priorityLabels } from '@/data/mockData';
import type { Article } from '@/types';

export default function ProfessionalPage() {
  const navigate = useNavigate();
  const getForwardedArticles = useAppStore((state) => state.getForwardedArticles);
  const currentReviewGroup = useAppStore((state) => state.currentReviewGroup);
  const setCurrentReviewGroup = useAppStore((state) => state.setCurrentReviewGroup);
  
  const articles = getForwardedArticles(currentReviewGroup);

  const priorityColors: Record<string, string> = {
    high: 'bg-danger-50 text-danger-600',
    medium: 'bg-warning-50 text-warning-600',
    low: 'bg-success-50 text-success-600',
  };

  const getGroupCount = (group: string) => {
    return getForwardedArticles(group).length;
  };

  const ArticleCard = ({ article }: { article: Article }) => {
    const ContentIcon = article.contentType === 'image' ? Image : article.contentType === 'video' ? Video : FileText;

    return (
      <div
        onClick={() => navigate(`/detail/${article.id}?mode=professional`)}
        className="bg-white rounded-xl shadow-card p-4 mb-3 cursor-pointer transition-all active:scale-[0.98]"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-[15px] font-semibold text-neutral-900 line-clamp-2 leading-snug flex-1">
                {article.title}
              </h3>
              <ContentIcon size={18} className="text-neutral-400 flex-shrink-0 mt-0.5" />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[11px] rounded-full font-medium">
                专业审核
              </span>
              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[11px] rounded-full font-medium">
                {article.category}
              </span>
              <span className={`px-2 py-0.5 text-[11px] rounded-full font-medium ${priorityColors[article.priority]}`}>
                {priorityLabels[article.priority]}
              </span>
              {article.isOverdue && (
                <span className="px-2 py-0.5 bg-danger-50 text-danger-600 text-[11px] rounded-full font-medium flex items-center gap-1">
                  <AlertTriangle size={12} />
                  超时
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-500 text-[12px]">
                <span>{article.author}</span>
                <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{article.submitTime}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-neutral-300" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header title="专业审核" />

      <div className="page-content">
        <div className="mb-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-1">
            {reviewGroups.map((group) => (
              <button
                key={group}
                onClick={() => setCurrentReviewGroup(group)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  currentReviewGroup === group
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200'
                }`}
              >
                <Users size={14} />
                {group}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  currentReviewGroup === group ? 'bg-white/20' : 'bg-neutral-100'
                }`}>
                  {getGroupCount(group)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Users size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-purple-700">
              {currentReviewGroup}
            </p>
            <p className="text-[12px] text-purple-600/70">
              当前组有 {articles.length} 篇待审核稿件
            </p>
          </div>
        </div>

        {articles.length > 0 ? (
          <div className="space-y-1">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <Users size={28} className="text-neutral-300" />
            </div>
            <p className="text-[14px] mb-1">暂无转交稿件</p>
            <p className="text-[12px] text-neutral-400">{currentReviewGroup} 暂未收到转审稿</p>
          </div>
        )}
      </div>
    </div>
  );
}
