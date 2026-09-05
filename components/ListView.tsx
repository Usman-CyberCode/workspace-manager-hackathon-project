'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setSelectedTaskId, toggleSelectTask, deleteTask } from '@/store';
import { TaskItem, MockUser, Subtask } from '@/lib/mockdata';

export default function ListView() {
  const dispatch = useDispatch();
  const { items: tasks, searchQuery, filterPriority, filterStatus, selectedTaskIds } = useSelector((state: RootState) => state.tasks);
  const activeProjectId = useSelector((state: RootState) => state.workspace.activeProjectId);
  const users = useSelector((state: RootState) => state.auth.users);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const isViewer = currentUser?.role === 'viewer';

  const [groupBy, setGroupBy] = useState<'status' | 'priority' | 'assignee' | 'none'>('status');

  const filteredTasks = tasks.filter((t: TaskItem) => {
    const matchesProject = t.projectId === activeProjectId;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesProject && matchesSearch && matchesPriority && matchesStatus;
  });

  // Group tasks
  const renderTaskRow = (task: TaskItem) => {
    const isSelected = selectedTaskIds.includes(task.id);
    const assignee = users.find((u: MockUser) => u.id === task.assigneeId);
    const subtaskCount = task.subtasks?.length || 0;
    const completedSubtasks = task.subtasks?.filter((s: Subtask) => s.completed).length || 0;

    return (
      <div 
        key={task.id}
        onClick={() => dispatch(setSelectedTaskId(task.id))}
        className={`group flex items-center justify-between p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer ${
          isSelected ? 'border-blue-500 bg-blue-50/20' : ''
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <input 
            type="checkbox"
            checked={isSelected}
            onChange={() => dispatch(toggleSelectTask(task.id))}
            onClick={(e) => e.stopPropagation()}
            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {task.title}
              </h4>
              {task.labels?.map((lbl) => (
                <span key={lbl} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md">
                  {lbl}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5 max-w-lg">
              {task.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {subtaskCount > 0 && (
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
              ☑ {completedSubtasks}/{subtaskCount}
            </span>
          )}

          <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
            task.priority === 'urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
            task.priority === 'high' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
            task.priority === 'medium' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            'bg-slate-50 text-slate-600 border border-slate-200'
          }`}>
            {task.priority}
          </span>

          <div className="flex items-center gap-1.5">
            {assignee && (
              <img 
                src={assignee.avatar} 
                alt={assignee.name} 
                className="w-5 h-5 rounded-full object-cover border border-slate-200" 
                title={assignee.name}
              />
            )}
            <span className="text-[11px] text-slate-400 font-medium">📅 {task.dueDate}</span>
          </div>

          {!isViewer && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteTask(task.id));
              }}
              className="text-slate-300 hover:text-rose-600 text-xs font-bold p-1 cursor-pointer"
              title="Delete task"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  };

  const getGroups = () => {
    if (groupBy === 'none') {
      return [{ title: 'All Tasks', items: filteredTasks }];
    }
    if (groupBy === 'status') {
      return [
        { title: '🟡 To Do', items: filteredTasks.filter((t: TaskItem) => t.status === 'todo') },
        { title: '🟢 In Progress', items: filteredTasks.filter((t: TaskItem) => t.status === 'in-progress') },
        { title: '🔴 Completed', items: filteredTasks.filter((t: TaskItem) => t.status === 'done') },
      ];
    }
    if (groupBy === 'priority') {
      return [
        { title: '🔴 Urgent', items: filteredTasks.filter((t: TaskItem) => t.priority === 'urgent') },
        { title: '🟡 High', items: filteredTasks.filter((t: TaskItem) => t.priority === 'high') },
        { title: '🟢 Medium', items: filteredTasks.filter((t: TaskItem) => t.priority === 'medium') },
        { title: '⚪ Low', items: filteredTasks.filter((t: TaskItem) => t.priority === 'low') },
      ];
    }
    if (groupBy === 'assignee') {
      return users.map((u: MockUser) => ({
        title: `👤 ${u.name} (${u.role})`,
        items: filteredTasks.filter((t: TaskItem) => t.assigneeId === u.id)
      }));
    }
    return [];
  };

  const groups = getGroups();

  return (
    <div className="space-y-6 font-sans">
      {/* Group By Selector Controls */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Group by:</span>
          <div className="flex gap-1">
            {(['status', 'priority', 'assignee', 'none'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setGroupBy(mode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  groupBy === mode ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-bold text-slate-400">
          {filteredTasks.length} Total Tasks
        </span>
      </div>

      {/* Render Groups */}
      <div className="space-y-6">
        {groups.map((group: { title: string; items: TaskItem[] }, idx: number) => (
          <div key={idx} className="space-y-2.5">
            <div className="flex items-center gap-2 px-1">
              <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                {group.title}
              </h3>
              <span className="text-[10px] font-bold bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded-full">
                {group.items.length}
              </span>
            </div>

            <div className="space-y-2">
              {group.items.length === 0 ? (
                <div className="p-4 bg-white/60 border border-slate-200/60 rounded-2xl text-center text-xs text-slate-400 font-medium italic">
                  No tasks in this group
                </div>
              ) : (
                group.items.map(renderTaskRow)
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
