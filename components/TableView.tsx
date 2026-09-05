'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setSelectedTaskId, toggleSelectTask, updateTaskStatus, updateTaskPriority, deleteTask } from '@/store';
import { TaskItem, Subtask } from '@/lib/mockdata';

export default function TableView() {
  const dispatch = useDispatch();
  const { items: tasks, searchQuery, filterPriority, filterStatus, selectedTaskIds } = useSelector((state: RootState) => state.tasks);
  const activeProjectId = useSelector((state: RootState) => state.workspace.activeProjectId);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const isViewer = currentUser?.role === 'viewer';

  const [sortColumn, setSortColumn] = useState<'title' | 'status' | 'priority' | 'dueDate'>('dueDate');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredTasks = tasks.filter((t: TaskItem) => {
    const matchesProject = t.projectId === activeProjectId;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesProject && matchesSearch && matchesPriority && matchesStatus;
  }).sort((a: TaskItem, b: TaskItem) => {
    const fieldA = a[sortColumn];
    const fieldB = b[sortColumn];
    if (fieldA < fieldB) return sortAsc ? -1 : 1;
    if (fieldA > fieldB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (col: typeof sortColumn) => {
    if (sortColumn === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(col);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-xs font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <th className="p-3.5 w-10 text-center">
                <span className="sr-only">Select</span>
              </th>
              <th className="p-3.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('title')}>
                Task Title {sortColumn === 'title' && (sortAsc ? '▲' : '▼')}
              </th>
              <th className="p-3.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('status')}>
                Status {sortColumn === 'status' && (sortAsc ? '▲' : '▼')}
              </th>
              <th className="p-3.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('priority')}>
                Priority {sortColumn === 'priority' && (sortAsc ? '▲' : '▼')}
              </th>
              <th className="p-3.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('dueDate')}>
                Due Date {sortColumn === 'dueDate' && (sortAsc ? '▲' : '▼')}
              </th>
              <th className="p-3.5">Subtasks</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                  No tasks matching the selected filters.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task: TaskItem) => {
                const isSelected = selectedTaskIds.includes(task.id);
                const subtaskCount = task.subtasks?.length || 0;
                const completedSubtasks = task.subtasks?.filter((s: Subtask) => s.completed).length || 0;

                return (
                  <tr 
                    key={task.id} 
                    onClick={() => dispatch(setSelectedTaskId(task.id))}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => dispatch(toggleSelectTask(task.id))}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{task.title}</span>
                        {task.attachments?.length > 0 && (
                          <span className="text-[10px] text-slate-400" title="Has attachments">📎</span>
                        )}
                        {task.comments?.length > 0 && (
                          <span className="text-[10px] text-blue-500 font-normal">💬 {task.comments.length}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        disabled={isViewer}
                        value={task.status}
                        onChange={(e: any) => dispatch(updateTaskStatus({ id: task.id, status: e.target.value }))}
                        className="bg-transparent font-bold capitalize text-slate-700 outline-none cursor-pointer text-xs"
                      >
                        <option value="todo">🟡 To Do</option>
                        <option value="in-progress">🟢 In Progress</option>
                        <option value="done">🔴 Completed</option>
                      </select>
                    </td>
                    <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        disabled={isViewer}
                        value={task.priority}
                        onChange={(e: any) => dispatch(updateTaskPriority({ id: task.id, priority: e.target.value }))}
                        className="bg-transparent font-extrabold uppercase text-[10px] text-slate-700 outline-none cursor-pointer"
                      >
                        <option value="urgent">🔴 Urgent</option>
                        <option value="high">🟡 High</option>
                        <option value="medium">🟢 Medium</option>
                        <option value="low">⚪ Low</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-slate-500 font-medium">
                      📅 {task.dueDate}
                    </td>
                    <td className="p-3.5">
                      {subtaskCount > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-600 h-full rounded-full"
                              style={{ width: `${(completedSubtasks / subtaskCount) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold">{completedSubtasks}/{subtaskCount}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      {!isViewer && (
                        <button 
                          onClick={() => dispatch(deleteTask(task.id))}
                          className="text-rose-500 hover:text-rose-700 font-bold text-[11px] p-1 cursor-pointer"
                          title="Delete task"
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
