'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { RootState, updateTaskStatus, updateTaskPriority, deleteTask, undo, setSelectedTaskId } from '@/store';

const COLUMNS = [
  { id: 'todo', label: 'To Do', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'in-progress', label: 'In Progress', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'done', label: 'Completed', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
];

export default function KanbanBoard() {
  const { items: tasks, history, activeView, searchQuery, filterPriority } = useSelector((state: RootState) => state.tasks);
  const activeProjectId = useSelector((state: RootState) => state.workspace.activeProjectId);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const dispatch = useDispatch();

  const isViewer = currentUser?.role === 'viewer';

  const filteredTasks = tasks.filter((t: any) => {
    const matchesProject = t.projectId === activeProjectId;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchesProject && matchesSearch && matchesPriority;
  });

  const onDragEnd = (result: any) => {
    if (!result.destination || isViewer) return;
    dispatch(updateTaskStatus({ id: result.draggableId, status: result.destination.droppableId }));
  };

  return (
    <div className="p-6 w-full max-w-[1600px] mx-auto animate-fadeIn duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            Workspace Dashboard
          </h2>
        </div>
        {history.length > 0 && (
          <button 
            onClick={() => dispatch(undo())} 
            className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-bold hover:bg-amber-500 hover:text-white transition-all shadow-lg active:scale-95"
          >
            ↩️ Undo Action ({history.length})
          </button>
        )}
      </div>

      {/* --- 1. KANBAN VIEW --- */}
      {activeView === 'kanban' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLUMNS.map(col => (
              <div key={col.id} className="bg-slate-200/50 dark:bg-slate-900/40 backdrop-blur-xl p-5 rounded-3xl border border-slate-300/50 dark:border-slate-800/80 min-h-[550px] flex flex-col shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase border ${col.badge}`}>
                    {col.label}
                  </span>
                  <span className="text-xs bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full font-bold">
                    {filteredTasks.filter((t: any) => t.status === col.id).length}
                  </span>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3 flex-1">
                      {filteredTasks.filter((t: any) => t.status === col.id).map((task: any, index: number) => (
                        <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={isViewer}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => dispatch(setSelectedTaskId(task.id))}
                              className={`bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer ${
                                snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl ring-2 ring-blue-500 z-50' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-snug">{task.title}</h4>
                                
                                {/* Priority Picker */}
                                <select 
                                  value={task.priority}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => dispatch(updateTaskPriority({ id: task.id, priority: e.target.value }))}
                                  className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 dark:text-white border-none outline-none cursor-pointer"
                                >
                                  <option value="urgent">🔴 Urgent</option>
                                  <option value="high">🟡 High</option>
                                  <option value="medium">🟢 Medium</option>
                                </select>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{task.description}</p>
                              
                              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs">
                                <span className="text-slate-400 text-[11px] font-medium">📅 {task.dueDate}</span>
                                {!isViewer && (
                                  <button onClick={(e) => { e.stopPropagation(); dispatch(deleteTask(task.id)); }} className="text-red-500 hover:text-red-700 font-bold text-[11px]">
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* --- 2. TABLE VIEW --- */}
      {activeView === 'list' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse text-xs dark:text-slate-200">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-slate-800/50 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <th className="p-4">Task Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTasks.map((t: any) => (
                <tr key={t.id} onClick={() => dispatch(setSelectedTaskId(t.id))} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer">
                  <td className="p-4 font-bold text-slate-800 dark:text-white">{t.title}</td>
                  <td className="p-4"><span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg capitalize font-bold">{t.status}</span></td>
                  <td className="p-4">
                    <select 
                      value={t.priority}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => dispatch(updateTaskPriority({ id: t.id, priority: e.target.value }))}
                      className="text-xs font-bold uppercase p-1 rounded bg-slate-100 dark:bg-slate-800 outline-none"
                    >
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                    </select>
                  </td>
                  <td className="p-4 text-slate-400">{t.dueDate}</td>
                  <td className="p-4 text-right">
                    {!isViewer && (
                      <button onClick={(e) => { e.stopPropagation(); dispatch(deleteTask(t.id)); }} className="text-red-500 font-bold hover:underline">
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- 3. CALENDAR VIEW --- */}
      {activeView === 'calendar' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Task Due Date Calendar View</h3>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }).map((_, i) => {
              const dayStr = `2026-09-${(i + 1).toString().padStart(2, '0')}`;
              const dayTasks = filteredTasks.filter((t: any) => t.dueDate === dayStr);
              return (
                <div key={i} className="min-h-[90px] border dark:border-slate-800 rounded-2xl p-2 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400">{i + 1}</span>
                  <div className="space-y-1">
                    {dayTasks.map((t: any) => (
                      <div key={t.id} onClick={() => dispatch(setSelectedTaskId(t.id))} className="bg-blue-600 text-white text-[9px] p-1 rounded-lg truncate cursor-pointer font-bold">
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}