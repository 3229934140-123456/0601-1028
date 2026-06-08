import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, ArrowLeftRight, Columns, Rows } from 'lucide-react';
import Header from '@/components/Header';
import { useAppStore } from '@/store/useAppStore';

type DiffMode = 'split' | 'unified';

export default function ComparePage() {
  const { id } = useParams<{ id: string }>();
  const articles = useAppStore((state) => state.articles);
  const article = articles.find((a) => a.id === id);

  const [leftVersion, setLeftVersion] = useState(0);
  const [rightVersion, setRightVersion] = useState(1);
  const [diffMode, setDiffMode] = useState<DiffMode>('split');
  const [showLeftPicker, setShowLeftPicker] = useState(false);
  const [showRightPicker, setShowRightPicker] = useState(false);

  const versions = article?.versions || [];

  const diffResult = useMemo(() => {
    if (versions.length < 2) return null;
    
    const oldText = versions[leftVersion]?.content || '';
    const newText = versions[rightVersion]?.content || '';
    
    const oldWords = oldText.split(/([，。、；：\s])/);
    const newWords = newText.split(/([，。、；：\s])/);
    
    const oldSet = new Set(oldWords.filter((w) => w.trim()));
    const newSet = new Set(newWords.filter((w) => w.trim()));
    
    return {
      oldWords: oldWords.map((word, idx) => ({
        word,
        type: word.trim() && !newSet.has(word) ? 'removed' : 'normal',
        key: `old-${idx}`,
      })),
      newWords: newWords.map((word, idx) => ({
        word,
        type: word.trim() && !oldSet.has(word) ? 'added' : 'normal',
        key: `new-${idx}`,
      })),
    };
  }, [versions, leftVersion, rightVersion]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">稿件不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="版本对比" showBack />

      <div className="page-content">
        <div className="bg-white rounded-2xl shadow-card p-4 mb-4">
          <h2 className="text-[15px] font-semibold text-neutral-900 mb-3">
            {article.title}
          </h2>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLeftPicker(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-neutral-100 rounded-lg text-[13px] text-neutral-700"
              >
                <span className="font-medium">V{versions[leftVersion]?.version}</span>
                <ChevronDown size={14} />
              </button>
              
              <ArrowLeftRight size={18} className="text-neutral-400" />
              
              <button
                onClick={() => setShowRightPicker(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-primary-100 rounded-lg text-[13px] text-primary-700"
              >
                <span className="font-medium">V{versions[rightVersion]?.version}</span>
                <ChevronDown size={14} />
              </button>
            </div>
            
            <div className="flex bg-neutral-100 rounded-lg p-0.5">
              <button
                onClick={() => setDiffMode('split')}
                className={`p-1.5 rounded-md transition-colors ${
                  diffMode === 'split' ? 'bg-white shadow-sm' : 'text-neutral-500'
                }`}
              >
                <Columns size={16} />
              </button>
              <button
                onClick={() => setDiffMode('unified')}
                className={`p-1.5 rounded-md transition-colors ${
                  diffMode === 'unified' ? 'bg-white shadow-sm' : 'text-neutral-500'
                }`}
              >
                <Rows size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[12px] text-neutral-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-danger-100 border border-danger-300"></div>
              <span>删除内容</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-success-100 border border-success-300"></div>
              <span>新增内容</span>
            </div>
          </div>
        </div>

        {diffResult && (
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {diffMode === 'split' ? (
              <div className="grid grid-cols-2 divide-x divide-neutral-200">
                <div className="p-4">
                  <div className="text-[12px] text-neutral-500 mb-2 pb-2 border-b border-neutral-100">
                    V{versions[leftVersion]?.version} · {versions[leftVersion]?.editor}
                  </div>
                  <p className="text-[14px] leading-7 text-neutral-700">
                    {diffResult.oldWords.map((item) => (
                      <span
                        key={item.key}
                        className={
                          item.type === 'removed'
                            ? 'bg-danger-100 text-danger-700 line-through rounded px-0.5'
                            : ''
                        }
                      >
                        {item.word}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-[12px] text-neutral-500 mb-2 pb-2 border-b border-neutral-100">
                    V{versions[rightVersion]?.version} · {versions[rightVersion]?.editor}
                  </div>
                  <p className="text-[14px] leading-7 text-neutral-700">
                    {diffResult.newWords.map((item) => (
                      <span
                        key={item.key}
                        className={
                          item.type === 'added'
                            ? 'bg-success-100 text-success-700 rounded px-0.5'
                            : ''
                        }
                      >
                        {item.word}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="text-[12px] text-neutral-500 mb-2 pb-2 border-b border-neutral-100">
                  合并视图
                </div>
                <p className="text-[14px] leading-7 text-neutral-700">
                  {diffResult.newWords.map((item) => (
                    <span
                      key={item.key}
                      className={
                        item.type === 'added'
                          ? 'bg-success-100 text-success-700 rounded px-0.5'
                          : ''
                      }
                    >
                      {item.word}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-[14px] font-semibold text-neutral-900 mb-3">版本历史</h3>
          <div className="bg-white rounded-2xl shadow-card divide-y divide-neutral-100">
            {versions.map((v, idx) => (
              <div key={v.id} className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  idx === rightVersion ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  <span className="text-[13px] font-bold">V{v.version}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-neutral-900">版本 {v.version}</span>
                    {idx === versions.length - 1 && (
                      <span className="px-1.5 py-0.5 bg-primary-100 text-primary-600 text-[10px] rounded-full font-medium">
                        最新
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    {v.editor} · {v.submitTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showLeftPicker && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center animate-fade-in"
          onClick={() => setShowLeftPicker(false)}
        >
          <div
            className="w-full max-w-[480px] bg-white rounded-t-3xl p-4 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-4" />
            <h3 className="text-[16px] font-semibold text-neutral-900 mb-3">选择左侧版本</h3>
            <div className="space-y-2">
              {versions.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setLeftVersion(idx);
                    setShowLeftPicker(false);
                  }}
                  className={`w-full p-3 rounded-xl text-left flex items-center gap-3 ${
                    idx === leftVersion ? 'bg-primary-50 border border-primary-200' : 'bg-neutral-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    idx === leftVersion ? 'bg-primary-200 text-primary-700' : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    <span className="text-[12px] font-bold">V{v.version}</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">版本 {v.version}</p>
                    <p className="text-[12px] text-neutral-500">{v.editor} · {v.submitTime}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showRightPicker && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center animate-fade-in"
          onClick={() => setShowRightPicker(false)}
        >
          <div
            className="w-full max-w-[480px] bg-white rounded-t-3xl p-4 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-4" />
            <h3 className="text-[16px] font-semibold text-neutral-900 mb-3">选择右侧版本</h3>
            <div className="space-y-2">
              {versions.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setRightVersion(idx);
                    setShowRightPicker(false);
                  }}
                  className={`w-full p-3 rounded-xl text-left flex items-center gap-3 ${
                    idx === rightVersion ? 'bg-primary-50 border border-primary-200' : 'bg-neutral-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    idx === rightVersion ? 'bg-primary-200 text-primary-700' : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    <span className="text-[12px] font-bold">V{v.version}</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">版本 {v.version}</p>
                    <p className="text-[12px] text-neutral-500">{v.editor} · {v.submitTime}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
