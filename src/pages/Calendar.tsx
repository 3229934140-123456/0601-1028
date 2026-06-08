import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';
import Header from '@/components/Header';
import { useAppStore } from '@/store/useAppStore';

export default function CalendarPage() {
  const schedule = useAppStore((state) => state.schedule);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1));
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-08');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getScheduleCount = (day: number) => {
    const dateStr = formatDate(day);
    return schedule.filter((s) => s.publishTime.startsWith(dateStr)).length;
  };

  const getDaySchedule = (dateStr: string) => {
    return schedule.filter((s) => s.publishTime.startsWith(dateStr));
  };

  const selectedDaySchedule = getDaySchedule(selectedDate);

  const categoryColors: Record<string, string> = {
    '时政新闻': 'bg-red-100 text-red-600',
    '社会民生': 'bg-orange-100 text-orange-600',
    '财经科技': 'bg-blue-100 text-blue-600',
    '文化娱乐': 'bg-purple-100 text-purple-600',
    '体育健康': 'bg-green-100 text-green-600',
    '教育职场': 'bg-indigo-100 text-indigo-600',
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const today = '2026-06-08';

  return (
    <div className="min-h-screen">
      <Header title="栏目排期" />

      <div className="page-content">
        <div className="bg-white rounded-2xl shadow-card p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-neutral-100"
            >
              <ChevronLeft size={20} className="text-neutral-600" />
            </button>
            <h2 className="text-[17px] font-semibold text-neutral-900">
              {year}年{month + 1}月
            </h2>
            <button
              onClick={nextMonth}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-neutral-100"
            >
              <ChevronRight size={20} className="text-neutral-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day, idx) => (
              <div
                key={day}
                className={`text-center text-[12px] font-medium py-2 ${
                  idx === 0 || idx === 6 ? 'text-neutral-400' : 'text-neutral-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }
              const dateStr = formatDate(day);
              const count = getScheduleCount(day);
              const isSelected = dateStr === selectedDate;
              const isToday = dateStr === today;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square flex flex-col items-center justify-center relative rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-primary-600 text-white'
                      : isToday
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span className={`text-[14px] font-medium ${
                    isSelected ? '' : idx % 7 === 0 || idx % 7 === 6 ? 'text-neutral-400' : ''
                  }`}>
                    {day}
                  </span>
                  {count > 0 && (
                    <div className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-primary-500'
                    }`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-neutral-900 flex items-center gap-2">
              <CalendarIcon size={18} className="text-primary-600" />
              {selectedDate} 排期
            </h3>
            <span className="text-[12px] text-neutral-500">
              共 {selectedDaySchedule.length} 篇
            </span>
          </div>

          <div className="space-y-2">
            {selectedDaySchedule.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-card p-4 flex items-center gap-3"
              >
                <div className={`w-1 h-10 rounded-full ${
                  item.status === 'published' ? 'bg-success-500' : 'bg-primary-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-medium text-neutral-900 truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                      categoryColors[item.category] || 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                      <Clock size={12} />
                      <span>{item.publishTime.split(' ')[1]}</span>
                    </div>
                  </div>
                </div>
                {item.status === 'published' ? (
                  <div className="flex items-center gap-1 text-success-600">
                    <CheckCircle size={16} />
                    <span className="text-[12px] font-medium">已发布</span>
                  </div>
                ) : (
                  <span className="px-2.5 py-1 bg-primary-50 text-primary-600 text-[11px] rounded-full font-medium">
                    待发布
                  </span>
                )}
              </div>
            ))}
          </div>

          {selectedDaySchedule.length === 0 && (
            <div className="bg-white rounded-2xl shadow-card py-10 flex flex-col items-center justify-center text-neutral-400">
              <CalendarIcon size={36} className="mb-2 text-neutral-300" />
              <p className="text-[13px]">当日暂无排期</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-card p-4">
          <h3 className="text-[15px] font-semibold text-neutral-900 mb-3">各栏目今日稿件</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(categoryColors).map(([name, color]) => {
              const count = schedule.filter(
                (s) => s.category === name && s.publishTime.startsWith(today)
              ).length;
              return (
                <div
                  key={name}
                  className="bg-neutral-50 rounded-xl p-3 text-center"
                >
                  <p className="text-[20px] font-bold text-neutral-800">{count}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
