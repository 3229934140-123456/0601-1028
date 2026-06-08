import { useState } from 'react';
import { Search, Star, Copy, Check, Plus, X } from 'lucide-react';
import Header from '@/components/Header';
import { useAppStore } from '@/store/useAppStore';

type TabType = 'all' | 'favorite';

export default function OpinionsPage() {
  const opinions = useAppStore((state) => state.opinions);
  const toggleFavoriteOpinion = useAppStore((state) => state.toggleFavoriteOpinion);
  const incrementOpinionUsage = useAppStore((state) => state.incrementOpinionUsage);

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const categories = ['全部', '通过类', '修改类', '驳回类', '转交类'];

  const filteredOpinions = opinions.filter((op) => {
    if (activeTab === 'favorite' && !op.isFavorite) return false;
    if (selectedCategory !== '全部' && op.category !== selectedCategory) return false;
    if (searchQuery && !op.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    incrementOpinionUsage(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const favoriteCount = opinions.filter((o) => o.isFavorite).length;

  return (
    <div className="min-h-screen">
      {showSearch ? (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[56px] bg-white border-b border-neutral-200 flex items-center gap-2 px-4 z-40 animate-fade-in">
          <div className="flex-1 flex items-center bg-neutral-100 rounded-full px-4 py-2">
            <Search size={18} className="text-neutral-400 mr-2" />
            <input
              type="text"
              placeholder="搜索意见..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[15px] text-neutral-800 placeholder:text-neutral-400"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-neutral-400">
                <X size={18} />
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setShowSearch(false);
              setSearchQuery('');
            }}
            className="text-primary-600 font-medium text-[15px]"
          >
            取消
          </button>
        </div>
      ) : (
        <Header
          title="审核意见"
          showSearch
          onSearchClick={() => setShowSearch(true)}
          rightAction={
            <button className="w-10 h-10 -mr-2 flex items-center justify-center text-primary-600">
              <Plus size={22} />
            </button>
          }
        />
      )}

      <div className="page-content">
        <div className="flex bg-white rounded-2xl shadow-card p-1 mb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 h-10 rounded-xl text-[14px] font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-neutral-600'
            }`}
          >
            全部意见
          </button>
          <button
            onClick={() => setActiveTab('favorite')}
            className={`flex-1 h-10 rounded-xl text-[14px] font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'favorite'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-neutral-600'
            }`}
          >
            <Star size={16} className={activeTab === 'favorite' ? 'fill-white' : ''} />
            我的收藏
            {favoriteCount > 0 && (
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                activeTab === 'favorite' ? 'bg-white/20' : 'bg-neutral-100'
              }`}>
                {favoriteCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-neutral-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {searchQuery && (
          <p className="text-[13px] text-neutral-500 mb-3">
            找到 {filteredOpinions.length} 条相关意见
          </p>
        )}

        <div className="space-y-3">
          {filteredOpinions.map((opinion) => (
            <div
              key={opinion.id}
              className="bg-white rounded-2xl shadow-card p-4 animate-fade-in"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-[14px] text-neutral-800 leading-relaxed flex-1">
                  {opinion.content}
                </p>
                <button
                  onClick={() => toggleFavoriteOpinion(opinion.id)}
                  className="flex-shrink-0"
                >
                  <Star
                    size={20}
                    className={
                      opinion.isFavorite
                        ? 'text-warning-500 fill-warning-500'
                        : 'text-neutral-300'
                    }
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[11px] rounded-full">
                    {opinion.category}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    使用 {opinion.usageCount} 次
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(opinion.id, opinion.content)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-[12px] font-medium active:bg-primary-100 transition-colors"
                >
                  {copiedId === opinion.id ? (
                    <>
                      <Check size={14} />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      复制
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOpinions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <Star size={28} className="text-neutral-300" />
            </div>
            <p className="text-[14px] mb-1">
              {activeTab === 'favorite' ? '暂无收藏的意见' : '暂无相关意见'}
            </p>
            <p className="text-[12px] text-neutral-400">
              {activeTab === 'favorite' ? '点击星星收藏常用意见' : '试试其他关键词搜索'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
