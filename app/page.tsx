'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addNotification, addActivity } from '@/store';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import KanbanBoard from '@/components/KanbanBoard';
import TableView from '@/components/TableView';
import CalendarView from '@/components/CalendarView';
import ListView from '@/components/ListView';
import LandingPage from '@/components/LandingPage';
import CommandPalette from '@/components/CommandPalette';
import TaskDetailModal from '@/components/TaskDetailModal';
import NewTaskModal from '@/components/NewTaskModal';
import ProjectModal from '@/components/ProjectModal';
import WorkspaceModal from '@/components/WorkspaceModal';
import WorkspaceSettingsModal from '@/components/WorkspaceSettingsModal';
import ActivityLogModal from '@/components/ActivityLogModal';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import ToastContainer from '@/components/ToastContainer';

export default function Home() {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { theme, isLiveSimEnabled } = useSelector((state: RootState) => state.ui);
  const { activeView } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Capstone Domain 9: Simulated "Live" Updates pushing realistic fake team events
  useEffect(() => {
    if (!mounted || !isAuthenticated || !isLiveSimEnabled) return;

    const simulatedEvents = [
      {
        title: 'Team Update',
        text: 'Sarah Chen updated status on "Design Dark-Themed OTP Auth Screen"',
        action: 'status_changed' as const,
        details: 'Sarah Chen marked OTP Auth as validated',
        user: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' }
      },
      {
        title: 'New Comment',
        text: 'Mike Ross: "Sprint launch PDF export styles look crisp!"',
        action: 'commented' as const,
        details: 'Mike Ross commented on Sprint Launch',
        user: { name: 'Mike Ross', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
      }
    ];

    const interval = setInterval(() => {
      const randomEvent = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      dispatch(addNotification({
        title: randomEvent.title,
        text: randomEvent.text,
        time: 'Just now',
        type: 'mention'
      }));
      dispatch(addActivity({
        workspaceId: 'ws-1',
        projectId: 'proj-1',
        userId: 'u-2',
        userName: randomEvent.user.name,
        userAvatar: randomEvent.user.avatar,
        action: randomEvent.action,
        details: randomEvent.details,
        timestamp: 'Just now'
      }));
    }, 45000); // Push once every 45s

    return () => clearInterval(interval);
  }, [mounted, isAuthenticated, isLiveSimEnabled, dispatch]);

  if (!mounted) return null;

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      {!isAuthenticated ? (
        <LandingPage />
      ) : (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-100 selection:text-blue-900">
          
          {/* Fixed Left Sidebar */}
          <Sidebar 
            mobileOpen={mobileSidebarOpen} 
            onCloseMobile={() => setMobileSidebarOpen(false)} 
          />

          {/* Main Workspace Area */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
            <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
            <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {activeView === 'kanban' && <KanbanBoard />}
              {activeView === 'table' && <TableView />}
              {activeView === 'calendar' && <CalendarView />}
              {activeView === 'list' && <ListView />}
            </main>
          </div>

          {/* All Modular Modals & Overlays */}
          <TaskDetailModal />
          <NewTaskModal />
          <ProjectModal />
          <WorkspaceModal />
          <WorkspaceSettingsModal />
          <ActivityLogModal />
          <KeyboardShortcutsModal />
          <CommandPalette />
          <ToastContainer />
        </div>
      )}
    </div>
  );
}