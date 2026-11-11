import React from 'react';
import { ChevronLeft, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: {
    label: string;
    path?: string;
  }[];
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav className="bg-[#EEF1F3]/80 border-b border-[#BAC3CE]/40 py-2.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-600" aria-label="مسیریاب صفحه">
      <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
        <button 
          onClick={() => onNavigate('/')} 
          className="hover:text-[#0C2340] flex items-center gap-1 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>خانه</span>
        </button>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400 rotate-180" />
              {isLast || !item.path ? (
                <span className="text-[#0C2340] font-semibold truncate max-w-xs sm:max-w-md">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => onNavigate(item.path!)}
                  className="hover:text-[#0C2340] transition-colors truncate max-w-xs"
                >
                  {item.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
