'use client';
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import KanbanBoard from "@/components/KanbanBoard";
import CommandPalette from "@/components/CommandPalette";
import TaskDetailModal from "@/components/TaskDetailModal";
import LoginScreen from "@/components/LoginScreen";

export default function Home() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const theme = useSelector((state: RootState) => state.tasks.theme);

  // Apply dark mode class to HTML document tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <main className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <KanbanBoard />
      </div>
      <CommandPalette />
      <TaskDetailModal />
    </main>
  );
}