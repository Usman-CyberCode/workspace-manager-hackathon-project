'use client';
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

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <main className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
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