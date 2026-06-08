import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, AlertTriangle, FileText, Shield, X } from 'lucide-react';
import Header from '@/components/Header';
import { useAppStore } from '@/store/useAppStore';

export default function RulesPage() {
  const rules = useAppStore((state) => state.rules);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['内容安全']);

  const categories = Array.from(new Set(rules.map((r) => r.category)));

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    '内容安全': <Shield size={18} className="text-danger-500" />,
    '内容质量': <FileText size={18} className="text-primary-500" />,
    '专业审核': <AlertTriangle size={18} className="text-warning-500" />,
  };

  const filteredRules = rules.filter(
    (rule) =>
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRulesByCategory = (category: string) => {
    return searchQuery
      ? filteredRules.filter((r) => r.category === category)
      : rules.filter((r) => r.category === category);
  };

  return (
    <div className="min-h-screen">
      {showSearch ? (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[56px] bg-white border-b border-neutral-200 flex items-center gap-2 px-4 z-40 animate-fade-in">
          <div className="flex-1 flex items-center bg-neutral-100 rounded-full px-4 py-2">
            <Search size={18} className="text-neutral-400 mr-2" />
            <input
              type="text"
              placeholder="搜索规则..."
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
          title="审核规则"
          showSearch
          onSearchClick={() => setShowSearch(true)}
        />
      )}

      <div className="page-content">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-5 mb-4 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <BookOpen size={22} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold">审核规则手册</h2>
              <p className="text-[12px] text-white/70">共 {rules.length} 条规则</p>
            </div>
          </div>
          <p className="text-[13px] text-white/80 leading-relaxed">
            请严格按照审核规范处理内容，确保发布高质量内容安全第一道防线。
          </p>
        </div>

        {searchQuery && (
          <p className="text-[13px] text-neutral-500 mb-3">
            找到 {filteredRules.length} 条相关规则
          </p>
        )}

        <div className="space-y-3">
          {categories.map((category) => {
            const categoryRules = getRulesByCategory(category);
            const isExpanded = expandedCategories.includes(category);

            if (searchQuery && categoryRules.length === 0) return null;

            return (
              <div
                key={category}
                className="bg-white rounded-2xl shadow-card overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-4 py-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center">
                      {categoryIcons[category] || <FileText size={18} className="text-neutral-500" />}
                    </div>
                    <div className="text-left">
                      <h3 className="text-[15px] font-semibold text-neutral-900">
                        {category}
                      </h3>
                      <p className="text-[12px] text-neutral-400">
                        {categoryRules.length} 条规则
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-neutral-400" />
                  ) : (
                    <ChevronDown size={20} className="text-neutral-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-neutral-100">
                    {categoryRules.map((rule, idx) => (
                      <div
                        key={rule.id}
                        className={`px-4 py-4 ${
                          idx < categoryRules.length - 1
                            ? 'border-b border-neutral-50'
                            : ''
                        }`}
                      >
                        <h4 className="text-[14px] font-semibold text-neutral-900 mb-2">
                          {rule.title}
                        </h4>
                        <p className="text-[13px] text-neutral-600 leading-relaxed mb-3">
                          {rule.description}
                        </p>
                        <div className="bg-neutral-50 rounded-lg p-3">
                          <p className="text-[12px] font-medium text-neutral-700 mb-2">
                            📌 示例说明
                          </p>
                          <ul className="space-y-1.5">
                            {rule.examples.map((example, i) => (
                              <li
                                key={i}
                                className="text-[12px] text-neutral-600 flex items-start gap-2"
                              >
                                <span className="text-primary-500 mt-0.5">•</span>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {searchQuery && filteredRules.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <Search size={28} className="text-neutral-300" />
          </div>
          <p className="text-[14px]">未找到相关规则</p>
          <p className="text-[12px] text-neutral-400 mt-1">试试其他关键词</p>
        </div>
      )}
    </div>
    </div>
  );
}
