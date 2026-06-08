import { create } from 'zustand';
import type { Article, Opinion, Rule, ScheduleItem, UserStats, DraftOpinion, ReviewRecord } from '@/types';
import { mockArticles, mockOpinions, mockRules, mockSchedule, mockUserStats } from '@/data/mockData';

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
  
  setSelectedCategory: (category: string) => void;
  setSelectedPriority: (priority: string) => void;
  setSearchQuery: (query: string) => void;
  setSearchMode: (mode: boolean) => void;
  toggleSelectArticle: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setBatchMode: (mode: boolean) => void;
  
  approveArticle: (id: string, opinion: string) => void;
  rejectArticle: (id: string, opinion: string) => void;
  returnArticle: (id: string, opinion: string) => void;
  forwardArticle: (id: string, opinion: string, target: string) => void;
  batchApprove: () => void;
  
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

export const useAppStore = create<AppState>((set, get) => ({
  articles: loadFromStorage('articles', initArticles()),
  opinions: loadFromStorage('opinions', mockOpinions),
  rules: mockRules,
  schedule: mockSchedule,
  userStats: mockUserStats,
  draftOpinions: loadFromStorage('draftOpinions', []),
  
  selectedCategory: '全部',
  selectedPriority: 'all',
  searchQuery: '',
  selectedIds: [],
  batchMode: false,
  searchMode: false,
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedPriority: (priority) => set({ selectedPriority: priority }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchMode: (mode) => set({ searchMode: mode, searchQuery: '' }),
  
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
      a.id === id ? { ...a, status: 'approved' as const, reviewHistory: [...(a.reviewHistory || []), record] } : a
    );
    saveToStorage('articles', articles);
    
    const schedule = [...state.schedule];
    const article = articles.find((a) => a.id === id);
    if (article?.publishTime) {
      schedule.push({
        id: `sch-${article.id}`,
        title: article.title,
        category: article.category,
        publishTime: article.publishTime.replace('T', ' '),
        status: 'scheduled',
      });
    }
    
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
      a.id === id ? { ...a, status: 'rejected' as const, reviewHistory: [...(a.reviewHistory || []), record] } : a
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
      a.id === id ? { ...a, status: 'returned' as const, reviewHistory: [...(a.reviewHistory || []), record] } : a
    );
    saveToStorage('articles', articles);
    return { articles };
  }),
  
  forwardArticle: (id, opinion, target) => set((state) => {
    const record: ReviewRecord = {
      id: `r-${Date.now()}`,
      action: 'forwarded',
      opinion,
      reviewer: '张审核',
      time: new Date().toLocaleString('zh-CN'),
      forwardedTo: target,
    };
    const articles = state.articles.map((a) =>
      a.id === id
        ? { ...a, status: 'forwarded' as const, forwardedTo: target, reviewHistory: [...(a.reviewHistory || []), record] }
        : a
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
        return { ...a, status: 'approved' as const, reviewHistory: [...(a.reviewHistory || []), record] };
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
    const articles = state.articles.map((a) =>
      a.id === id ? { ...a, publishTime } : a
    );
    saveToStorage('articles', articles);
    
    const schedule = state.schedule.filter((s) => s.id !== `sch-${id}`);
    const article = articles.find((a) => a.id === id);
    if (article) {
      schedule.push({
        id: `sch-${id}`,
        title: article.title,
        category: article.category,
        publishTime: publishTime.replace('T', ' '),
        status: 'scheduled',
      });
    }
    
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
}));
