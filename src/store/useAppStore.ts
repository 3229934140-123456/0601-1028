import { create } from 'zustand';
import type { Article, Opinion, Rule, ScheduleItem, UserStats, DraftOpinion, ReviewRecord } from '@/types';
import { mockArticles, mockOpinions, mockRules, mockSchedule, mockUserStats, reviewGroups } from '@/data/mockData';

interface AppState {
  articles: Article[];
  opinions: Opinion[];
  rules: Rule[];
  schedule: ScheduleItem[];
  userStats: UserStats;
  draftOpinions: DraftOpinion[];
  
  selectedCategory: string;
  selectedPriority: string;
  searchQuery: string;
  selectedIds: string[];
  batchMode: boolean;
  searchMode: boolean;
  
  currentReviewGroup: string;
  
  setSelectedCategory: (category: string) => void;
  setSelectedPriority: (priority: string) => void;
  setSearchQuery: (query: string) => void;
  setSearchMode: (mode: boolean) => void;
  toggleSelectArticle: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setBatchMode: (mode: boolean) => void;
  setCurrentReviewGroup: (group: string) => void;
  
  approveArticle: (id: string, opinion: string) => void;
  rejectArticle: (id: string, opinion: string) => void;
  returnArticle: (id: string, opinion: string) => void;
  forwardArticle: (id: string, opinion: string, target: string) => void;
  batchApprove: () => void;
  
  professionalApprove: (id: string, opinion: string) => void;
  professionalReject: (id: string, opinion: string) => void;
  professionalReturn: (id: string, opinion: string) => void;
  
  setPublishTime: (id: string, publishTime: string) => void;
  
  toggleFavoriteOpinion: (id: string) => void;
  incrementOpinionUsage: (id: string) => void;
  
  saveDraftOpinion: (articleId: string, content: string) => void;
  getDraftOpinion: (articleId: string) => DraftOpinion | undefined;
  removeDraftOpinion: (articleId: string) => void;
  
  getFilteredArticles: () => Article[];
  getSearchResults: () => Article[];
  getOverdueCount: () => number;
  getArticleById: (id: string) => Article | undefined;
  getForwardedArticles: (group?: string) => Article[];
  getScheduleByDate: (date: string) => ScheduleItem[];
  getScheduleByCategory: (category: string, date?: string) => ScheduleItem[];
}

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

const initArticles = (): Article[] => {
  return mockArticles.map((a) => ({
    ...a,
    reviewHistory: [],
  }));
};

const initSchedule = (): ScheduleItem[] => {
  return mockSchedule;
};

const addHistoryRecord = (article: Article, record: ReviewRecord): Article => {
  return {
    ...article,
    reviewHistory: [...(article.reviewHistory || []), record],
  };
};

export const useAppStore = create<AppState>((set, get) => ({
  articles: loadFromStorage('articles', initArticles()),
  opinions: loadFromStorage('opinions', mockOpinions),
  rules: mockRules,
  schedule: loadFromStorage('schedule', initSchedule()),
  userStats: loadFromStorage('userStats', mockUserStats),
  draftOpinions: loadFromStorage('draftOpinions', []),
  
  selectedCategory: '全部',
  selectedPriority: 'all',
  searchQuery: '',
  selectedIds: [],
  batchMode: false,
  searchMode: false,
  currentReviewGroup: reviewGroups[0],
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedPriority: (priority) => set({ selectedPriority: priority }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchMode: (mode) => set({ searchMode: mode, searchQuery: '' }),
  setCurrentReviewGroup: (group) => set({ currentReviewGroup: group }),
  
  toggleSelectArticle: (id) => set((state) => {
    const selected = state.selectedIds.includes(id)
      ? state.selectedIds.filter((i) => i !== id)
      : [...state.selectedIds, id];
    return { selectedIds: selected };
  }),
  
  selectAll: () => set((state) => {
    const filtered = get().getFilteredArticles();
    const allIds = filtered.map((a) => a.id);
    return { selectedIds: allIds };
  }),
  
  clearSelection: () => set({ selectedIds: [], batchMode: false }),
  setBatchMode: (mode) => set({ batchMode: mode, selectedIds: [] }),
  
  approveArticle: (id, opinion) => set((state) => {
    const record: ReviewRecord = {
      id: `r-${Date.now()}`,
      action: 'approved',
      opinion,
      reviewer: '张审核',
      time: new Date().toLocaleString('zh-CN'),
    };
    
    const articles = state.articles.map((a) =>
      a.id === id ? addHistoryRecord(a, record) : a
    );
    
    const article = articles.find((a) => a.id === id);
    let schedule = [...state.schedule];
    
    if (article) {
      const existingIndex = schedule.findIndex((s) => s.id === `sch-${id}`);
      if (existingIndex >= 0) {
        schedule[existingIndex] = {
          ...schedule[existingIndex],
          status: 'scheduled' as const,
        };
      } else if (article.publishTime) {
        schedule.push({
          id: `sch-${article.id}`,
          title: article.title,
          category: article.category,
          publishTime: article.publishTime.replace('T', ' '),
          status: 'scheduled',
        });
      }
    }
    
    saveToStorage('articles', articles);
    saveToStorage('schedule', schedule);
    
    return {
      articles,
      schedule,
      userStats: { ...state.userStats, todayCount: state.userStats.todayCount + 1 },
    };
  }),
  
  rejectArticle: (id, opinion) => set((state) => {
    const record: ReviewRecord = {
      id: `r-${Date.now()}`,
      action: 'rejected',
      opinion,
      reviewer: '张审核',
      time: new Date().toLocaleString('zh-CN'),
    };
    const articles = state.articles.map((a) =>
      a.id === id ? addHistoryRecord(a, record) : a
    );
    saveToStorage('articles', articles);
    return { articles };
  }),
  
  returnArticle: (id, opinion) => set((state) => {
    const record: ReviewRecord = {
      id: `r-${Date.now()}`,
      action: 'returned',
      opinion,
      reviewer: '张审核',
      time: new Date().toLocaleString('zh-CN'),
    };
    const articles = state.articles.map((a) =>
      a.id === id ? addHistoryRecord(a, record) : a
    );
    saveToStorage('articles', articles);
    return { articles };
  }),
  
  forwardArticle: (id, opinion, target) => set((state) => {
    const article = state.articles.find((a) => a.id === id);
    const oldForwardedTo = article?.forwardedTo;
    
    const record: ReviewRecord = {
      id: `r-${Date.now()}`,
      action: oldForwardedTo ? 'forward_change' : 'forwarded',
      opinion,
      reviewer: '张审核',
      time: new Date().toLocaleString('zh-CN'),
      forwardedTo: target,
      oldValue: oldForwardedTo,
      newValue: target,
    };
    
    const articles = state.articles.map((a) =>
      a.id === id
        ? { ...addHistoryRecord(a, record), status: 'forwarded' as const, forwardedTo: target }
        : a
    );
    saveToStorage('articles', articles);
    return { articles };
  }),
  
  professionalApprove: (id, opinion) => set((state) => {
    const record: ReviewRecord = {
      id: `r-${Date.now()}`,
      action: 'approved',
      opinion,
      reviewer: '李专业审核',
      time: new Date().toLocaleString('zh-CN'),
    };
    
    const articles = state.articles.map((a) =>
      a.id === id ? { ...addHistoryRecord(a, record), status: 'approved' as const } : a
    );
    
    const article = articles.find((a) => a.id === id);
    let schedule = [...state.schedule];
    
    if (article) {
      const existingIndex = schedule.findIndex((s) => s.id === `sch-${id}`);
      if (existingIndex >= 0) {
        schedule[existingIndex] = {
          ...schedule[existingIndex],
          status: 'scheduled' as const,
        };
      } else if (article.publishTime) {
        schedule.push({
          id: `sch-${article.id}`,
          title: article.title,
          category: article.category,
          publishTime: article.publishTime.replace('T', ' '),
          status: 'scheduled',
        });
      }
    }
    
    saveToStorage('articles', articles);
    saveToStorage('schedule', schedule);
    
    return {
      articles,
      schedule,
      userStats: { ...state.userStats, todayCount: state.userStats.todayCount + 1 },
    };
  }),
  
  professionalReject: (id, opinion) => set((state) => {
    const record: ReviewRecord = {
      id: `r-${Date.now()}`,
      action: 'rejected',
      opinion,
      reviewer: '李专业审核',
      time: new Date().toLocaleString('zh-CN'),
    };
    const articles = state.articles.map((a) =>
      a.id === id ? { ...addHistoryRecord(a, record), status: 'rejected' as const } : a
    );
    saveToStorage('articles', articles);
    return { articles };
  }),
  
  professionalReturn: (id, opinion) => set((state) => {
    const record: ReviewRecord = {
      id: `r-${Date.now()}`,
      action: 'returned',
      opinion,
      reviewer: '李专业审核',
      time: new Date().toLocaleString('zh-CN'),
    };
    const articles = state.articles.map((a) =>
      a.id === id ? { ...addHistoryRecord(a, record), status: 'returned' as const } : a
    );
    saveToStorage('articles', articles);
    return { articles };
  }),
  
  batchApprove: () => set((state) => {
    const approvedIds: string[] = [];
    const articles = state.articles.map((a) => {
      if (state.selectedIds.includes(a.id) && a.riskLevel === 'low') {
        approvedIds.push(a.id);
        const record: ReviewRecord = {
          id: `r-${Date.now()}-${a.id}`,
          action: 'approved',
          opinion: '批量通过 - 低风险内容',
          reviewer: '张审核',
          time: new Date().toLocaleString('zh-CN'),
        };
        return addHistoryRecord(a, record);
      }
      return a;
    });
    saveToStorage('articles', articles);
    
    return {
      articles,
      selectedIds: [],
      batchMode: false,
      userStats: { ...state.userStats, todayCount: state.userStats.todayCount + approvedIds.length },
    };
  }),
  
  setPublishTime: (id, publishTime) => set((state) => {
    const article = state.articles.find((a) => a.id === id);
    const oldPublishTime = article?.publishTime;
    
    const record: ReviewRecord = {
      id: `r-${Date.now()}`,
      action: 'publish_time_change',
      opinion: oldPublishTime ? '修改发布时间' : '设置发布时间',
      reviewer: '张审核',
      time: new Date().toLocaleString('zh-CN'),
      oldValue: oldPublishTime ? oldPublishTime.replace('T', ' ') : undefined,
      newValue: publishTime.replace('T', ' '),
    };
    
    const articles = state.articles.map((a) =>
      a.id === id ? { ...addHistoryRecord(a, record), publishTime } : a
    );
    
    let schedule = state.schedule.filter((s) => s.id !== `sch-${id}`);
    const updatedArticle = articles.find((a) => a.id === id);
    if (updatedArticle) {
      schedule.push({
        id: `sch-${id}`,
        title: updatedArticle.title,
        category: updatedArticle.category,
        publishTime: publishTime.replace('T', ' '),
        status: updatedArticle.status === 'approved' ? 'scheduled' : 'scheduled',
      });
    }
    
    saveToStorage('articles', articles);
    saveToStorage('schedule', schedule);
    
    return { articles, schedule };
  }),
  
  toggleFavoriteOpinion: (id) => set((state) => {
    const opinions = state.opinions.map((o) =>
      o.id === id ? { ...o, isFavorite: !o.isFavorite } : o
    );
    saveToStorage('opinions', opinions);
    return { opinions };
  }),
  
  incrementOpinionUsage: (id) => set((state) => {
    const opinions = state.opinions.map((o) =>
      o.id === id ? { ...o, usageCount: o.usageCount + 1 } : o
    );
    saveToStorage('opinions', opinions);
    return { opinions };
  }),
  
  saveDraftOpinion: (articleId, content) => set((state) => {
    const existingIndex = state.draftOpinions.findIndex((d) => d.articleId === articleId);
    let draftOpinions;
    if (existingIndex >= 0) {
      draftOpinions = state.draftOpinions.map((d, i) =>
        i === existingIndex ? { ...d, content, savedAt: new Date().toISOString() } : d
      );
    } else {
      draftOpinions = [...state.draftOpinions, {
        articleId,
        content,
        savedAt: new Date().toISOString(),
      }];
    }
    saveToStorage('draftOpinions', draftOpinions);
    return { draftOpinions };
  }),
  
  getDraftOpinion: (articleId) => {
    return get().draftOpinions.find((d) => d.articleId === articleId);
  },
  
  removeDraftOpinion: (articleId) => set((state) => {
    const draftOpinions = state.draftOpinions.filter((d) => d.articleId !== articleId);
    saveToStorage('draftOpinions', draftOpinions);
    return { draftOpinions };
  }),
  
  getFilteredArticles: () => {
    const { articles, selectedCategory, selectedPriority } = get();
    return articles.filter((a) => {
      if (a.status !== 'pending') return false;
      if (selectedCategory !== '全部' && a.category !== selectedCategory) return false;
      if (selectedPriority !== 'all' && a.priority !== selectedPriority) return false;
      return true;
    });
  },
  
  getSearchResults: () => {
    const { articles, searchQuery } = get();
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return articles.filter((a) =>
      a.title.toLowerCase().includes(query) ||
      a.author.toLowerCase().includes(query)
    );
  },
  
  getOverdueCount: () => {
    return get().articles.filter((a) => a.status === 'pending' && a.isOverdue).length;
  },
  
  getArticleById: (id) => {
    return get().articles.find((a) => a.id === id);
  },
  
  getForwardedArticles: (group) => {
    const { articles } = get();
    return articles.filter((a) => {
      if (a.status !== 'forwarded') return false;
      if (group && a.forwardedTo !== group) return false;
      return true;
    });
  },
  
  getScheduleByDate: (date) => {
    return get().schedule.filter((s) => s.publishTime.startsWith(date));
  },
  
  getScheduleByCategory: (category, date) => {
    const schedule = get().schedule;
    return schedule.filter((s) => {
      if (category !== '全部' && s.category !== category) return false;
      if (date && !s.publishTime.startsWith(date)) return false;
      return true;
    });
  },
}));
