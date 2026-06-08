import { create } from 'zustand';
import type { Article, Opinion, Rule, ScheduleItem, UserStats, DraftOpinion } from '@/types';
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
  
  setSelectedCategory: (category: string) => void;
  setSelectedPriority: (priority: string) => void;
  setSearchQuery: (query: string) => void;
  toggleSelectArticle: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setBatchMode: (mode: boolean) => void;
  
  approveArticle: (id: string, opinion: string) => void;
  rejectArticle: (id: string, opinion: string) => void;
  returnArticle: (id: string, opinion: string) => void;
  batchApprove: () => void;
  
  toggleFavoriteOpinion: (id: string) => void;
  incrementOpinionUsage: (id: string) => void;
  
  saveDraftOpinion: (articleId: string, content: string) => void;
  getDraftOpinion: (articleId: string) => DraftOpinion | undefined;
  removeDraftOpinion: (articleId: string) => void;
  
  getFilteredArticles: () => Article[];
  getOverdueCount: () => number;
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

export const useAppStore = create<AppState>((set, get) => ({
  articles: mockArticles,
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
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedPriority: (priority) => set({ selectedPriority: priority }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
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
    const articles = state.articles.map((a) =>
      a.id === id ? { ...a, status: 'approved' as const } : a
    );
    return { articles, userStats: { ...state.userStats, todayCount: state.userStats.todayCount + 1 } };
  }),
  
  rejectArticle: (id, opinion) => set((state) => {
    const articles = state.articles.map((a) =>
      a.id === id ? { ...a, status: 'rejected' as const } : a
    );
    return { articles };
  }),
  
  returnArticle: (id, opinion) => set((state) => {
    const articles = state.articles.map((a) =>
      a.id === id ? { ...a, status: 'returned' as const } : a
    );
    return { articles };
  }),
  
  batchApprove: () => set((state) => {
    const articles = state.articles.map((a) =>
      state.selectedIds.includes(a.id) && a.riskLevel === 'low'
        ? { ...a, status: 'approved' as const }
        : a
    );
    const approvedCount = state.articles.filter(
      (a) => state.selectedIds.includes(a.id) && a.riskLevel === 'low'
    ).length;
    return {
      articles,
      selectedIds: [],
      batchMode: false,
      userStats: { ...state.userStats, todayCount: state.userStats.todayCount + approvedCount },
    };
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
    const { articles, selectedCategory, selectedPriority, searchQuery } = get();
    return articles.filter((a) => {
      if (a.status !== 'pending') return false;
      if (selectedCategory !== '全部' && a.category !== selectedCategory) return false;
      if (selectedPriority !== 'all' && a.priority !== selectedPriority) return false;
      if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  },
  
  getOverdueCount: () => {
    return get().articles.filter((a) => a.status === 'pending' && a.isOverdue).length;
  },
}));
