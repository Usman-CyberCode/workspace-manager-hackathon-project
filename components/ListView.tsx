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
        className={`group flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer ${
          isSelected ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/30' : ''
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
              <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {task.title}
              </h4>
              {task.labels?.map((lbl) => (
                <span key={lbl} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded-md">
                  {lbl}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5 max-w-lg">
              {task.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {subtaskCount > 0 && (
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
              ☑ {completedSubtasks}/{subtaskCount}
            </span>
          )}

          <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
            task.priority === 'urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300' :
            task.priority === 'high' ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300' :
            task.priority === 'medium' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300' :
            'bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
          }`}>
            {task.priority}
          </span>

          <div className="flex items-center gap-1.5">
            {assignee && (
              <img 
                src={assignee.avatar} 
                alt={assignee.name} 
                className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                title={assignee.name}
              />
            )}
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">📅 {task.dueDate}</span>
          </div>

          {!isViewer && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteTask(task.id));
              }}
              className="text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-bold p-1 cursor-pointer"
              title="Delete task"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  };

  const statusGroups = [
    { key: 'todo', title: 'To Do', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
    { key: 'in-progress', title: 'In Progress', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
    { key: 'done', title: 'Completed', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' }
  ];

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* List Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Task List Overview</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{filteredTasks.length} tasks matching active filters</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-slate-400">Group By:</label>
          <select
            value={groupBy}
            onChange={(e: any) => setGroupBy(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold px-3 py-1.5 rounded-xl outline-none cursor-pointer text-xs"
          >
            <option value="status">Status</option>
            <option value="priority">Priority</option>
            <option value="none">No Grouping</option>
          </select>
        </div>
      </div>

      {groupBy === 'status' ? (
        <div className="space-y-5">
          {statusGroups.map((grp) => {
            const groupTasks = filteredTasks.filter((t: TaskItem) => t.status === grp.key);
            return (
              <div key={grp.key} className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${grp.bg} ${grp.color}`}>
                    {grp.title} ({groupTasks.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {groupTasks.length === 0 ? (
                    <div className="p-4 bg-slate-50/50 dark:bg-slate-950/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-slate-400 text-xs">
                      No tasks in {grp.title}
                    </div>
                  ) : (
                    groupTasks.map((t: TaskItem) => renderTaskRow(t))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No tasks found.
            </div>
          ) : (
            filteredTasks.map((t: TaskItem) => renderTaskRow(t))
          )}
        </div>
      )}
    </div>
  );
}
