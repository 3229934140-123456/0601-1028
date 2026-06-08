import { useState } from 'react';
import { Search, Filter, CheckSquare, Square, X, AlertTriangle, Zap } from 'lucide-react';
import Header from '@/components/Header';
import ArticleCard from '@/components/ArticleCard';
import { useAppStore } from '@/store/useAppStore';
import { categories } from '@/data/mockData';

export default function PendingPage() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const {
    selectedCategory,
    selectedPriority,
    searchQuery,
    batchMode,
    selectedIds,
    getFilteredArticles,
    getOverdueCount,
    setSelectedCategory,
    setSelectedPriority,
    setSearchQuery,
    setBatchMode,
    toggleSelectArticle,
    selectAll,
    clearSelection,
    batchApprove,
  } = useAppStore();

  const articles = getFilteredArticles();
  const overdueCount = getOverdueCount();
  
  const lowRiskSelectedCount = selectedIds.filter((id) => {
    const article = articles.find((a) => a.id === id);
    return article?.riskLevel === 'low';
  }).length;

  const priorities = [
    { value: 'all', label: '全部' },
    { value: 'high', label: '高优' },
    { value: 'medium', label: '中优' },
    { value: 'low', label: '低优' },
  ];

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setShowSearch(false);
  };

  return (
    <div className="min-h-screen">
      {showSearch ? (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[56px] bg-white border-b border-neutral-200 flex items-center gap-2 px-4 z-50 animate-fade-in">
          <div className="flex-1 flex items-center bg-neutral-100 rounded-full px-4 py-2">
            <Search size={18} className="text-neutral-400 mr-2" />
            <input
              type="text"
              placeholder="搜索历史稿件..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              className="flex-1 bg-transparent outline-none text-[15px] text-neutral-800 placeholder:text-neutral-400"
              autoFocus
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="text-neutral-400">
                <X size={18} />
              </button>
            )}
          </div>
          <button
            onClick={handleClearSearch}
            className="text-primary-600 font-medium text-[15px]"
          >
            取消
          </button>
        </div>
      ) : (
        <Header
          title="待审核"
          showSearch
          showMore
          onSearchClick={() => setShowSearch(true)}
          rightAction={
            <button
              onClick={() => setBatchMode(!batchMode)}
              className={`text-[13px] font-medium px-3 py-1.5 rounded-full ${
                batchMode ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-700'
              }`}
            >
              {batchMode ? '取消' : '批量'}
            </button>
          }
        />
      )}

      <div className="page-content">
        {overdueCount > 0 && !searchQuery && (
          <div className="bg-danger-50 border border-danger-500/20 rounded-xl p-3 mb-4 flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-danger-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-danger-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-danger-700">
                {overdueCount} 篇稿件已超时
              </p>
              <p className="text-[12px] text-danger-600">请尽快处理，避免影响发布排期</p>
            </div>
          </div>
        )}

        {searchQuery && (
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[13px] text-neutral-500">搜索 "{searchQuery}"</span>
            <span className="text-[13px] text-neutral-400">·</span>
            <span className="text-[13px] text-neutral-500">{articles.length} 条结果</span>
          </div>
        )}

        {!searchQuery && (
          <>
            <div className="mb-3 -mx-4 px-4 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-neutral-600 border border-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setSelectedPriority(p.value)}
                  className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-colors ${
                    selectedPriority === p.value
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {p.label}
                </button>
              ))}
              <div className="flex-1" />
              <button className="flex items-center gap-1 px-3 py-1 text-[12px] text-neutral-500 bg-neutral-100 rounded-lg">
                <Filter size={14} />
                筛选
              </button>
            </div>
          </>
        )}

        {batchMode && (
          <div className="bg-white rounded-xl shadow-card p-3 mb-4 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <button
                onClick={selectAll}
                className="flex items-center gap-2"
              >
                {selectedIds.length === articles.length && articles.length > 0 ? (
                  <CheckSquare size={20} className="text-primary-600" />
                ) : (
                  <Square size={20} className="text-neutral-400" />
                )}
                <span className="text-[14px] text-neutral-700">
                  已选 {selectedIds.length} 篇
                </span>
              </button>
            </div>
            <button
              onClick={batchApprove}
              disabled={lowRiskSelectedCount === 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-success-500 text-white rounded-lg text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed active:bg-success-600 transition-colors"
            >
              <Zap size={16} />
              批量通过低风险 ({lowRiskSelectedCount})
            </button>
          </div>
        )}

        <div className="space-y-1">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              selectable={batchMode}
              selected={selectedIds.includes(article.id)}
              onSelect={() => toggleSelectArticle(article.id)}
            />
          ))}
        </div>

        {articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <Search size={28} className="text-neutral-300" />
            </div>
            <p className="text-[14px]">暂无待审核内容</p>
          </div>
        )}
      </div>
    </div>
  );
}
