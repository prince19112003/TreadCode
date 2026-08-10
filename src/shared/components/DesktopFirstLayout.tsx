import React from 'react';

interface DesktopFirstLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  timeline?: React.ReactNode;
}

/**
 * Foundation for the responsive Desktop-First Layout.
 * 
 * WHY:
 * - Ensures that the application provides a primary layout structure that adapts to Tablets and Phones.
 * - Enforces the usage of defined regions (sidebar, timeline, main content) to keep features isolated.
 */
export const DesktopFirstLayout: React.FC<DesktopFirstLayoutProps> = ({ children, sidebar, timeline }) => {
  return (
    <div className="flex flex-col h-screen w-screen bg-background text-primary overflow-hidden">
      {/* Top Header Placeholder */}
      <header className="h-14 border-b border-divider flex items-center px-4 bg-paper shrink-0">
        <h1 className="text-lg font-extrabold"><span className="text-white">Tread</span><span className="text-indigo-400">Code</span></h1>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Main Workspace (Renderer / Editor) */}
        <main className="flex-1 bg-background relative overflow-hidden flex flex-col">
          <div className="flex-1 relative">
            {children}
          </div>
          
          {/* Timeline Region - Bottom of workspace on Desktop */}
          {timeline && (
            <div className="h-24 md:h-32 border-t border-divider bg-elevated shrink-0 w-full z-10">
              {timeline}
            </div>
          )}
        </main>

        {/* Right Sidebar - Stacked on Mobile, Right side on Desktop */}
        {sidebar && (
          <aside className="w-full md:w-80 lg:w-96 border-l border-divider bg-paper flex flex-col shrink-0 h-[40vh] md:h-auto overflow-y-auto">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
};
