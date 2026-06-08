import { NavLink } from 'react-router-dom';
import { FileText, Calendar, BookOpen, User, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function BottomNav() {
  const overdueCount = useAppStore((state) => state.getOverdueCount());

  const navItems = [
    { path: '/', label: '待审', icon: FileText, badge: overdueCount },
    { path: '/opinions', label: '意见', icon: MessageSquare },
    { path: '/calendar', label: '日历', icon: Calendar },
    { path: '/rules', label: '规则', icon: BookOpen },
    { path: '/profile', label: '我的', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-neutral-200 shadow-navbar z-50">
      <div className="flex items-center justify-around h-[60px]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-[60px] h-full transition-colors relative ${
                isActive ? 'text-primary-600' : 'text-neutral-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2.5 bg-danger-500 text-white text-[10px] font-medium rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[11px] mt-1 font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
