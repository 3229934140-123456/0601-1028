import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MoreVertical } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSearch?: boolean;
  showMore?: boolean;
  rightAction?: React.ReactNode;
  onSearchClick?: () => void;
  onMoreClick?: () => void;
}

export default function Header({
  title,
  showBack = false,
  showSearch = false,
  showMore = false,
  rightAction,
  onSearchClick,
  onMoreClick,
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[56px] bg-white border-b border-neutral-200 flex items-center justify-between px-4 z-40">
      <div className="flex items-center w-10">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 -ml-2 flex items-center justify-center text-neutral-700 active:bg-neutral-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
      
      <h1 className="text-[17px] font-semibold text-neutral-900 truncate">
        {title}
      </h1>
      
      <div className="flex items-center gap-1 w-10 justify-end">
        {rightAction}
        {showSearch && (
          <button
            onClick={onSearchClick}
            className="w-10 h-10 -mr-2 flex items-center justify-center text-neutral-700 active:bg-neutral-100 rounded-full transition-colors"
          >
            <Search size={20} />
          </button>
        )}
        {showMore && (
          <button
            onClick={onMoreClick}
            className="w-10 h-10 -mr-2 flex items-center justify-center text-neutral-700 active:bg-neutral-100 rounded-full transition-colors"
          >
            <MoreVertical size={20} />
          </button>
        )}
      </div>
    </header>
  );
}
