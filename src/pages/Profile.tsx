import {
  User,
  FileCheck,
  Clock,
  TrendingUp,
  ChevronRight,
  Save,
  Bell,
  Moon,
  HelpCircle,
  LogOut,
  BarChart3,
  PieChart,
  Settings,
} from 'lucide-react';
import Header from '@/components/Header';
import { useAppStore } from '@/store/useAppStore';

export default function ProfilePage() {
  const userStats = useAppStore((state) => state.userStats);
  const draftOpinions = useAppStore((state) => state.draftOpinions);

  const statCards = [
    { label: '今日处理', value: userStats.todayCount, icon: FileCheck, color: 'bg-primary-500' },
    { label: '本周处理', value: userStats.weekCount, icon: BarChart3, color: 'bg-success-500' },
    { label: '本月处理', value: userStats.monthCount, icon: PieChart, color: 'bg-warning-500' },
    { label: '通过率', value: `${userStats.approvalRate}%`, icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const maxWeekly = Math.max(...userStats.weeklyData.map((d) => d.count));

  const menuGroups = [
    {
      title: '工具',
      items: [
        {
          icon: Save,
          label: '离线暂存',
          value: `${draftOpinions.length} 条草稿`,
          color: 'text-primary-600 bg-primary-50',
        },
        {
          icon: Bell,
          label: '消息通知',
          value: '超时提醒已开启',
          color: 'text-warning-600 bg-warning-50',
        },
      ],
    },
    {
      title: '设置',
      items: [
        {
          icon: Moon,
          label: '深色模式',
          value: '跟随系统',
          color: 'text-neutral-600 bg-neutral-100',
        },
        {
          icon: Settings,
          label: '提醒设置',
          value: '',
          color: 'text-blue-600 bg-blue-50',
        },
      ],
    },
    {
      title: '其他',
      items: [
        {
          icon: HelpCircle,
          label: '帮助与反馈',
          value: '',
          color: 'text-green-600 bg-green-50',
        },
        {
          icon: LogOut,
          label: '退出登录',
          value: '',
          color: 'text-danger-600 bg-danger-50',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Header title="个人中心" showMore />

      <div className="page-content">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-5 text-white mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
              <User size={28} />
            </div>
            <div className="flex-1">
              <h2 className="text-[18px] font-semibold">张审核</h2>
              <p className="text-[13px] text-white/70">高级审核员 · 内容安全组</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="px-2.5 py-1 bg-white/20 rounded-full text-[12px]">
              审核等级 Lv.4
            </span>
            <span className="px-2.5 py-1 bg-white/20 rounded-full text-[12px]">
              准确率 98.5%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {statCards.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={18} className="text-white" />
                </div>
                <TrendingUp size={14} className="text-success-500" />
              </div>
              <p className="text-[24px] font-bold text-neutral-900 leading-none">
                {stat.value}
              </p>
              <p className="text-[12px] text-neutral-500 mt-1.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-card p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-neutral-900">本周处理趋势</h3>
            <span className="text-[12px] text-neutral-400">单位：篇</span>
          </div>
          <div className="flex items-end justify-between h-28 gap-1">
            {userStats.weeklyData.map((item, idx) => {
              const height = (item.count / maxWeekly) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-neutral-500">{item.count}</span>
                  <div
                    className="w-full bg-primary-100 rounded-t-lg relative overflow-hidden"
                    style={{ height: '80px' }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-4 mb-4">
          <h3 className="text-[15px] font-semibold text-neutral-900 mb-3">
            栏目分布
          </h3>
          <div className="space-y-2.5">
            {userStats.categoryStats.slice(0, 5).map((stat, idx) => {
              const max = Math.max(...userStats.categoryStats.map((s) => s.count));
              const percent = (stat.count / max) * 100;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-neutral-700">{stat.category}</span>
                    <span className="text-[12px] text-neutral-500">{stat.count} 篇</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="mb-4">
            {group.title && (
              <p className="text-[12px] text-neutral-500 mb-2 px-1">{group.title}</p>
            )}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              {group.items.map((item, iIdx) => (
                <button
                  key={iIdx}
                  className={`w-full px-4 py-3.5 flex items-center gap-3 active:bg-neutral-50 transition-colors ${
                    iIdx < group.items.length - 1 ? 'border-b border-neutral-50' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                    <item.icon size={16} />
                  </div>
                  <span className="flex-1 text-left text-[14px] text-neutral-800">
                    {item.label}
                  </span>
                  {item.value && (
                    <span className="text-[12px] text-neutral-400">{item.value}</span>
                  )}
                  <ChevronRight size={16} className="text-neutral-300" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center py-4">
          <p className="text-[12px] text-neutral-400">内容审核 App v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
