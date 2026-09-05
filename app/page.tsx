'use client';
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import KanbanBoard from "@/components/KanbanBoard";
import CommandPalette from "@/components/CommandPalette";
import TaskDetailModal from "@/components/TaskDetailModal";
import LoginScreen from "@/components/LoginScreen";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isAuthenticated) return <LoginScreen />;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Structural Fix: Sidebar strictly renders ONCE here */}
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <Navbar />
        <main className="flex-1 p-6">
          <KanbanBoard />
        </main>
      </div>
      <CommandPalette />
      <TaskDetailModal />
    </div>
  );
}