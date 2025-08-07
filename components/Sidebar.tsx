import React, { useState } from 'react';
import type { Page } from '../types';

interface SidebarProps {
  pages: Page[];
  activePage: string;
  setActivePage: (pageId: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ pages, activePage, setActivePage, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`bg-bg-panel border-r border-slate-200 p-4 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <div className={`mb-8 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
         <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
         </div>
         <h1 className={`text-xl font-bold text-text-primary whitespace-nowrap transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100 delay-100'}`}>NAVA Academy</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul>
          {pages.map((page) => (
            <li key={page.id} className="mb-2">
              <button
                onClick={() => setActivePage(page.id)}
                title={isCollapsed ? page.label : undefined}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''} ${
                  activePage === page.id
                    ? 'bg-brand-primary text-white font-semibold shadow-md'
                    : 'text-text-secondary hover:bg-bg-panel-hover hover:text-text-primary'
                }`}
              >
                <div className="flex-shrink-0">{page.icon}</div>
                <span className={`whitespace-nowrap transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100 delay-100'}`}>{page.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer Area */}
      <div className="flex-shrink-0">
        <div className="border-t border-slate-200 pt-2 space-y-1">
            <button 
                onClick={onLogout}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 text-text-secondary hover:bg-bg-panel-hover hover:text-text-primary ${isCollapsed ? 'justify-center' : ''}`}
                title="Logout"
            >
                 <div className="flex-shrink-0">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                     </svg>
                </div>
                <span className={`whitespace-nowrap transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100 delay-100'}`}>Logout</span>
            </button>
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 text-text-secondary hover:bg-bg-panel-hover hover:text-text-primary ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Expand' : 'Collapse'}
            >
                 <div className="flex-shrink-0">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {isCollapsed 
                            ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            : <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        }
                     </svg>
                </div>
                <span className={`whitespace-nowrap transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100 delay-100'}`}>Collapse</span>
            </button>
        </div>
        <div className={`mt-2 text-center text-xs text-text-muted whitespace-nowrap transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
            <p>PDPL Compliance Notice</p>
            <p>Access is restricted to authorized users.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
