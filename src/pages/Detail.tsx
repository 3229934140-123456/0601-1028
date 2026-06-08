import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Clock,
  User,
  AlertTriangle,
  GitCompare,
  Calendar as CalendarIcon,
  Send,
  Save,
  RotateCcw,
  X,
  ChevronDown,
  Star,
  ExternalLink,
  History,
  CheckCircle,
  XCircle,
  RotateCcw as RotateIcon,
  Forward,
} from 'lucide-react';
import Header from '@/components/Header';
import { useAppStore } from '@/store/useAppStore';
import { priorityLabels, riskLevelLabels, reviewGroups } from '@/data/mockData';
import type { SensitiveSection } from '@/types';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isProfessionalMode = searchParams.get('mode') === 'professional';
  
  const getArticleById = useAppStore((state) => state.getArticleById);
  const opinions = useAppStore((state) => state.opinions);
  const approveArticle = useAppStore((state) => state.approveArticle);
  const rejectArticle = useAppStore((state) => state.rejectArticle);
  const returnArticle = useAppStore((state) => state.returnArticle);
  const forwardArticle = useAppStore((state) => state.forwardArticle);
  const setPublishTime = useAppStore((state) => state.setPublishTime);
  const saveDraftOpinion = useAppStore((state) => state.saveDraftOpinion);
  const getDraftOpinion = useAppStore((state) => state.getDraftOpinion);
  const removeDraftOpinion = useAppStore((state) => state.removeDraftOpinion);
  const toggleFavoriteOpinion = useAppStore((state) => state.toggleFavoriteOpinion);
  const incrementOpinionUsage = useAppStore((state) => state.incrementOpinionUsage);
  const professionalApprove = useAppStore((state) => state.professionalApprove);
  const professionalReject = useAppStore((state) => state.professionalReject);
  const professionalReturn = useAppStore((state) => state.professionalReturn);

  const article = id ? getArticleById(id) : undefined;

  const [opinion, setOpinion] = useState('');
  const [showOpinionPicker, setShowOpinionPicker] = useState(false);
  const [activeSensitive, setActiveSensitive] = useState<SensitiveSection | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [publishDate, setPublishDate] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showForwardPicker, setShowForwardPicker] = useState(false);

  const draft = id ? getDraftOpinion(id) : undefined;

  useEffect(() => {
    if (draft) {
      setOpinion(draft.content);
    }
  }, [draft]);

  useEffect(() => {
    if (article?.publishTime) {
      setPublishDate(article.publishTime);
    }
  }, [article?.publishTime]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">稿件不存在</p>
      </div>
    );
  }

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

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: '待审核', color: 'bg-warning-50 text-warning-600' },
    approved: { label: '已通过', color: 'bg-success-50 text-success-600' },
    rejected: { label: '已驳回', color: 'bg-danger-50 text-danger-600' },
    returned: { label: '已退回', color: 'bg-neutral-100 text-neutral-600' },
    forwarded: { label: '已转交', color: 'bg-purple-50 text-purple-600' },
  };

  const renderContentWithHighlights = () => {
    if (!article.sensitiveSections || article.sensitiveSections.length === 0) {
      return <p className="text-[15px] leading-7 text-neutral-700">{article.content}</p>;
    }

    const sections = [...article.sensitiveSections].sort((a, b) => a.startIndex - b.startIndex);
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    sections.forEach((section, idx) => {
      if (section.startIndex > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>
            {article.content.slice(lastIndex, section.startIndex)}
          </span>
        );
      }
      parts.push(
        <span
          key={`sensitive-${idx}`}
          className="sensitive-highlight px-0.5 rounded"
          onClick={() => setActiveSensitive(section)}
        >
          {article.content.slice(section.startIndex, section.endIndex)}
        </span>
      );
      lastIndex = section.endIndex;
    });

    if (lastIndex < article.content.length) {
      parts.push(<span key="text-last">{article.content.slice(lastIndex)}</span>);
    }

    return <p className="text-[15px] leading-7 text-neutral-700">{parts}</p>;
  };

  const handleApprove = () => {
    if (id) {
      if (isProfessionalMode) {
        professionalApprove(id, opinion);
      } else {
        approveArticle(id, opinion);
      }
      if (draft) removeDraftOpinion(id);
      setOpinion('');
      if (isProfessionalMode) {
        navigate('/professional');
      } else {
        navigate('/');
      }
    }
  };

  const handleReject = () => {
    if (id) {
      if (isProfessionalMode) {
        professionalReject(id, opinion);
      } else {
        rejectArticle(id, opinion);
      }
      if (draft) removeDraftOpinion(id);
      setOpinion('');
      if (isProfessionalMode) {
        navigate('/professional');
      } else {
        navigate('/');
      }
    }
  };

  const handleReturn = () => {
    if (id) {
      if (isProfessionalMode) {
        professionalReturn(id, opinion);
      } else {
        returnArticle(id, opinion);
      }
      if (draft) removeDraftOpinion(id);
      setOpinion('');
      if (isProfessionalMode) {
        navigate('/professional');
      } else {
        navigate('/');
      }
    }
  };

  const handleForward = (target: string) => {
    if (id) {
      forwardArticle(id, opinion, target);
      if (draft) removeDraftOpinion(id);
      setShowActionSheet(false);
      setOpinion('');
    }
  };

  const handleSaveDraft = () => {
    if (id) {
      saveDraftOpinion(id, opinion);
    }
  };

  const handleSetPublishTime = () => {
    if (id && publishDate) {
      setPublishTime(id, publishDate);
      setShowSchedulePicker(false);
    }
  };

  const insertOpinion = (opId: string, text: string) => {
    setOpinion((prev) => (prev ? prev + '\n' + text : text));
    incrementOpinionUsage(opId);
    setShowOpinionPicker(false);
  };

  const favoriteOpinions = opinions.filter((o) => o.isFavorite);

  const isPending = article.status === 'pending';
  const isForwarded = article.status === 'forwarded';
  const isProcessed = !isPending && !isForwarded;
  const canEdit = isProfessionalMode ? isForwarded : isPending;
  const isReadOnly = !canEdit;

  const getForwardInfo = () => {
    if (!article.forwardedTo || !article.reviewHistory) return null;
    const forwardRecord = [...article.reviewHistory].reverse().find(
      (r) => r.action === 'forwarded' || r.action === 'forward_change'
    );
    return forwardRecord || null;
  };

  const forwardInfo = getForwardInfo();

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approved': return <CheckCircle size={16} className="text-success-500" />;
      case 'rejected': return <XCircle size={16} className="text-danger-500" />;
      case 'returned': return <RotateIcon size={16} className="text-neutral-500" />;
      case 'forwarded': return <Forward size={16} className="text-purple-500" />;
      case 'forward_change': return <Forward size={16} className="text-purple-500" />;
      case 'publish_time_change': return <CalendarIcon size={16} className="text-primary-500" />;
      default: return null;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'approved': return '通过';
      case 'rejected': return '驳回';
      case 'returned': return '退回修改';
      case 'forwarded': return '转交专业审核';
      case 'forward_change': return '变更转交对象';
      case 'publish_time_change': return '设置发布时间';
      default: return action;
    }
  };

  return (
    <div className="min-h-screen pb-[180px]">
      <Header
        title="稿件详情"
        showBack
        showMore
        rightAction={
          <div className="flex items-center gap-2">
            {article.reviewHistory?.length && article.reviewHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="w-10 h-10 -mr-2 flex items-center justify-center text-primary-600"
              >
                <History size={20} />
              </button>
            )}
            <button
              onClick={() => navigate(`/compare/${id}`)}
              className="flex items-center gap-1 text-[13px] text-primary-600 font-medium"
            >
              <GitCompare size={16} />
              对比
            </button>
          </div>
        }
      />

      <div className="page-content">
        <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h1 className="text-[20px] font-bold text-neutral-900 leading-tight flex-1">
              {article.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-[12px] rounded-full font-medium">
              {article.category}
            </span>
            <span className={`px-2.5 py-1 text-[12px] rounded-full font-medium ${priorityColors[article.priority]}`}>
              {priorityLabels[article.priority]}
            </span>
            <span className={`px-2.5 py-1 text-[12px] rounded-full font-medium ${riskColors[article.riskLevel]}`}>
              {riskLevelLabels[article.riskLevel]}风险
            </span>
            <span className={`px-2.5 py-1 text-[12px] rounded-full font-medium ${statusLabels[article.status].color}`}>
              {statusLabels[article.status].label}
            </span>
            {article.isOverdue && (
              <span className="px-2.5 py-1 bg-danger-50 text-danger-600 text-[12px] rounded-full font-medium flex items-center gap-1">
                <AlertTriangle size={12} />
                已超时
              </span>
            )}
          </div>

          {article.forwardedTo && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-3">
                <Forward size={20} className="text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-purple-700 mb-1">
                    {isProfessionalMode ? '由审核组转交' : `已转交给：${article.forwardedTo}`}
                  </p>
                  {forwardInfo && (
                    <>
                      <p className="text-[12px] text-purple-600/80 mb-1">
                        转交时间：{forwardInfo.time}
                      </p>
                      <p className="text-[12px] text-purple-600/80">
                        转交人：{forwardInfo.reviewer}
                      </p>
                      {forwardInfo.opinion && (
                        <p className="text-[12px] text-purple-700 mt-2 pt-2 border-t border-purple-200/50">
                          意见：{forwardInfo.opinion}
                        </p>
                      )}
                    </>
                  )}
                  {!isProfessionalMode && !isProcessed && (
                    <button
                      onClick={() => setShowForwardPicker(true)}
                      className="text-[12px] text-purple-600 font-medium mt-2 flex items-center gap-1"
                    >
                      <ExternalLink size={12} />
                      重新选择审核组
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-[13px] text-neutral-500 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{article.submitTime}</span>
            </div>
          </div>

          {article.publishTime && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-50">
              <CalendarIcon size={14} className="text-primary-500" />
              <span className="text-[12px] text-neutral-600">
                预定发布时间：{article.publishTime.replace('T', ' ')}
              </span>
            </div>
          )}
        </div>

        {article.sensitiveSections.length > 0 && (
          <div className="bg-warning-50 border border-warning-500/20 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-warning-600" />
              <span className="text-[14px] font-semibold text-warning-700">
                发现 {article.sensitiveSections.length} 处敏感内容
              </span>
            </div>
            <p className="text-[12px] text-warning-600">
              点击黄色高亮区域可查看详细说明和相关规则
            </p>
          </div>
        )}

        {article.contentType === 'image' && article.images && (
          <div className="bg-white rounded-2xl shadow-card p-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
              {article.images.map((img, idx) => (
                <div key={idx} className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {article.contentType === 'video' && (
          <div className="bg-white rounded-2xl shadow-card p-4 mb-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <video
                src={article.videoUrl}
                controls
                className="w-full h-full object-cover"
                poster="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20thumbnail%20play%20button&image_size=landscape_16_9"
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold text-neutral-900">内容正文</h2>
            <span className="text-[12px] text-neutral-400">共 {article.versions.length} 个版本</span>
          </div>
          <div className="prose prose-sm max-w-none">
            {renderContentWithHighlights()}
          </div>
        </div>

        {article.reviewHistory?.length && article.reviewHistory.length > 0 && (
          <button
            onClick={() => setShowHistory(true)}
            className="w-full bg-white rounded-2xl shadow-card p-4 mb-4 flex items-center gap-3 active:bg-neutral-50"
          >
            <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
              <History size={18} className="text-primary-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[14px] font-medium text-neutral-900">审核历史</p>
              <p className="text-[12px] text-neutral-500">共 {article.reviewHistory.length} 条记录</p>
            </div>
            <ChevronDown size={18} className="text-neutral-400 -rotate-90" />
          </button>
        )}

        <div className="bg-white rounded-2xl shadow-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-neutral-900">审核意见</h3>
            <div className="flex items-center gap-2">
              {!isReadOnly && (
                <>
                  <button
                    onClick={() => setShowOpinionPicker(true)}
                    className="text-[12px] text-primary-600 flex items-center gap-1"
                  >
                    <Star size={14} />
                    常用意见
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    className="text-[12px] text-neutral-500 flex items-center gap-1"
                  >
                    <Save size={14} />
                    暂存
                  </button>
                </>
              )}
            </div>
          </div>
          {isReadOnly ? (
            <div className="p-3 bg-neutral-50 rounded-xl text-[14px] text-neutral-600">
              {article.reviewHistory?.length && article.reviewHistory.length > 0
                ? article.reviewHistory[article.reviewHistory.length - 1].opinion || '（无审核意见）'
                : '（无审核意见）'}
            </div>
          ) : (
            <>
              <textarea
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                placeholder="请输入审核意见..."
                className="w-full h-24 px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[14px] text-neutral-800 placeholder:text-neutral-400 resize-none focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              />
              {draft && (
                <p className="text-[12px] text-neutral-400 mt-2">
                  上次暂存: {new Date(draft.savedAt).toLocaleString('zh-CN')}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {isProcessed ? (
        <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-neutral-200 px-4 py-3 z-40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="flex-1 h-11 bg-neutral-100 text-neutral-700 rounded-xl text-[13px] font-medium active:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <History size={18} />
              审核记录
            </button>
            <button
              onClick={() => navigate(`/compare/${id}`)}
              className="flex-1 h-11 bg-neutral-100 text-neutral-700 rounded-xl text-[13px] font-medium active:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <GitCompare size={18} />
              版本对比
            </button>
            <button
              onClick={() => navigate('/calendar')}
              className="flex-1 h-11 bg-primary-50 text-primary-600 rounded-xl text-[13px] font-medium active:bg-primary-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <CalendarIcon size={18} />
              查看排期
            </button>
          </div>
        </div>
      ) : canEdit ? (
        <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-neutral-200 px-4 py-3 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReturn}
              className="flex-1 h-11 bg-neutral-100 text-neutral-700 rounded-xl text-[14px] font-medium active:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={18} />
              退回修改
            </button>
            <button
              onClick={handleReject}
              className="flex-1 h-11 bg-danger-500 text-white rounded-xl text-[14px] font-medium active:bg-danger-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <X size={18} />
              驳回
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 h-11 bg-success-500 text-white rounded-xl text-[14px] font-medium active:bg-success-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <Send size={18} />
              {isProfessionalMode ? '专业通过' : '通过'}
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            <button
              onClick={() => setShowSchedulePicker(true)}
              className="flex items-center gap-1 text-[12px] text-neutral-500"
            >
              <CalendarIcon size={14} />
              {publishDate ? `发布时间: ${publishDate.replace('T', ' ')}` : '设置发布时间'}
            </button>
            {!isProfessionalMode && (
              <button
                onClick={() => setShowActionSheet(true)}
                className="flex items-center gap-1 text-[12px] text-primary-600"
              >
                <ExternalLink size={14} />
                转交专业审核
              </button>
            )}
          </div>
        </div>
      ) : null}

      {activeSensitive && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center animate-fade-in"
          onClick={() => setActiveSensitive(null)}
        >
          <div
            className="w-full max-w-[480px] bg-white rounded-t-3xl p-5 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-4" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-warning-100 flex items-center justify-center">
                <AlertTriangle size={18} className="text-warning-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-neutral-900">{activeSensitive.type}</h3>
                <p className="text-[12px] text-neutral-500">第 {activeSensitive.startIndex} 字起</p>
              </div>
            </div>
            <p className="text-[14px] text-neutral-700 leading-relaxed mb-4 bg-warning-50 p-3 rounded-lg">
              {activeSensitive.description}
            </p>
            <button
              onClick={() => navigate('/rules')}
              className="w-full h-11 bg-primary-50 text-primary-600 rounded-xl text-[14px] font-medium"
            >
              查看相关规则
            </button>
          </div>
        </div>
      )}

      {showOpinionPicker && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center animate-fade-in"
          onClick={() => setShowOpinionPicker(false)}
        >
          <div
            className="w-full max-w-[480px] bg-white rounded-t-3xl max-h-[70vh] overflow-hidden animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-neutral-100">
              <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-neutral-900">常用意见</h3>
                <button
                  onClick={() => setShowOpinionPicker(false)}
                  className="text-neutral-400"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[60vh] p-4 space-y-2">
              {favoriteOpinions.length > 0 && (
                <p className="text-[12px] text-neutral-500 mb-2">⭐ 我的收藏</p>
              )}
              {favoriteOpinions.map((op) => (
                <div
                  key={op.id}
                  onClick={() => insertOpinion(op.id, op.content)}
                  className="p-3 bg-neutral-50 rounded-xl cursor-pointer active:bg-neutral-100 transition-colors"
                >
                  <p className="text-[14px] text-neutral-800 mb-1.5">{op.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400">{op.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-neutral-400">使用 {op.usageCount} 次</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteOpinion(op.id);
                        }}
                      >
                        <Star
                          size={14}
                          className={op.isFavorite ? 'text-warning-500 fill-warning-500' : 'text-neutral-300'}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-[12px] text-neutral-500 mt-4 mb-2">📋 全部意见</p>
              {opinions
                .filter((o) => !o.isFavorite)
                .map((op) => (
                  <div
                    key={op.id}
                    onClick={() => insertOpinion(op.id, op.content)}
                    className="p-3 bg-neutral-50 rounded-xl cursor-pointer active:bg-neutral-100 transition-colors"
                  >
                    <p className="text-[14px] text-neutral-800 mb-1.5">{op.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400">{op.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-neutral-400">使用 {op.usageCount} 次</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteOpinion(op.id);
                          }}
                        >
                          <Star size={14} className="text-neutral-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {showSchedulePicker && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center animate-fade-in"
          onClick={() => setShowSchedulePicker(false)}
        >
          <div
            className="w-full max-w-[480px] bg-white rounded-t-3xl p-5 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-4" />
            <h3 className="text-[16px] font-semibold text-neutral-900 mb-4">设置发布时间</h3>
            <input
              type="datetime-local"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full h-12 px-4 bg-neutral-50 border border-neutral-200 rounded-xl text-[14px] focus:outline-none focus:border-primary-400"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowSchedulePicker(false)}
                className="flex-1 h-11 bg-neutral-100 text-neutral-700 rounded-xl text-[14px] font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSetPublishTime}
                disabled={!publishDate}
                className="flex-1 h-11 bg-primary-600 text-white rounded-xl text-[14px] font-medium disabled:opacity-50"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {(showActionSheet || showForwardPicker) && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center animate-fade-in"
          onClick={() => {
            setShowActionSheet(false);
            setShowForwardPicker(false);
          }}
        >
          <div
            className="w-full max-w-[480px] bg-neutral-100 rounded-t-3xl p-4 space-y-2 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[12px] text-neutral-500 text-center pb-2">
              {showForwardPicker ? '重新选择审核组' : '选择转交对象'}
            </p>
            <div className="bg-white rounded-2xl overflow-hidden">
              {reviewGroups.map((group, idx) => (
                <button
                  key={group}
                  onClick={() => handleForward(group)}
                  className={`w-full h-12 text-[15px] text-primary-600 font-medium ${
                    idx < reviewGroups.length - 1 ? 'border-b border-neutral-100' : ''
                  }`}
                >
                  转交给{group}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setShowActionSheet(false);
                setShowForwardPicker(false);
              }}
              className="w-full h-12 bg-white rounded-2xl text-[15px] text-neutral-700 font-medium"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {showHistory && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center animate-fade-in"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="w-full max-w-[480px] bg-white rounded-t-3xl max-h-[70vh] overflow-hidden animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-neutral-100 z-10">
              <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-neutral-900">审核历史</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-neutral-400"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[60vh] p-4">
              <div className="relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-neutral-200" />
                {article.reviewHistory?.slice().reverse().map((record, idx) => (
                  <div key={record.id} className="relative pl-8 pb-5">
                    <div className="absolute left-0 top-0.5 w-[22px] h-[22px] rounded-full bg-white border-2 border-neutral-200 flex items-center justify-center">
                      {getActionIcon(record.action)}
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-medium text-neutral-800">
                          {getActionLabel(record.action)}
                        </span>
                        <span className="text-[11px] text-neutral-400">{record.time}</span>
                      </div>
                      <p className="text-[12px] text-neutral-600">
                        操作人：{record.reviewer}
                      </p>
                      {record.forwardedTo && (
                        <p className="text-[12px] text-purple-600 mt-1">
                          转交给：{record.forwardedTo}
                        </p>
                      )}
                      {record.action === 'publish_time_change' && record.oldValue && (
                        <p className="text-[12px] text-neutral-500 mt-1">
                          原时间：{record.oldValue}
                        </p>
                      )}
                      {record.action === 'publish_time_change' && record.newValue && (
                        <p className="text-[12px] text-primary-600 mt-1">
                          新时间：{record.newValue}
                        </p>
                      )}
                      {record.action === 'forward_change' && record.oldValue && (
                        <p className="text-[12px] text-neutral-500 mt-1">
                          原审核组：{record.oldValue}
                        </p>
                      )}
                      {record.action === 'forward_change' && record.newValue && (
                        <p className="text-[12px] text-purple-600 mt-1">
                          新审核组：{record.newValue}
                        </p>
                      )}
                      {record.opinion && (
                        <p className="text-[13px] text-neutral-700 mt-2 pt-2 border-t border-neutral-200">
                          {record.opinion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
