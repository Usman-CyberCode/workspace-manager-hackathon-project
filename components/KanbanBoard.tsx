'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  RootState, updateTaskStatus, updateTaskPriority, deleteTask, 
  undo, redo, setSelectedTaskId 
} from '@/store';

const COLUMNS = [
  { id: 'todo', label: 'To Do', border: 'border-yellow-400 bg-amber-50/20' },
  { id: 'in-progress', label: 'In Progress', border: 'border-green-500 bg-emerald-50/20' },
  { id: 'done', label: 'Completed', border: 'border-red-500 bg-rose-50/20' }
];

export default function KanbanBoard() {
  const { 
    items: tasks = [], 
    pastHistory = [], 
    futureHistory = [], 
    activeView = 'kanban', 
    searchQuery = '', 
    filterPriority = 'all' 
  } = useSelector((state: RootState) => state.tasks) || {};

  const activeProjectId = useSelector((state: RootState) => state.workspace.activeProjectId);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
    <div className="p-8 w-full max-w-7xl mx-auto font-sans bg-slate-50 min-h-screen">
      
      {/* Top Title & Undo/Redo Bar */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Dev on</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">Project task execution workspace.</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => dispatch(undo())} 
            disabled={(pastHistory?.length || 0) === 0}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              (pastHistory?.length || 0) > 0 
                ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 shadow-xs' 
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            ↩️ Undo ({(pastHistory?.length || 0)})
          </button>

          <button 
            onClick={() => dispatch(redo())} 
            disabled={(futureHistory?.length || 0) === 0}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              (futureHistory?.length || 0) > 0 
                ? 'bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100 shadow-xs' 
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            ↪️ Redo ({(futureHistory?.length || 0)})
          </button>
        </div>
      </div>

      {/* 1. KANBAN BOARD VIEW */}
      {activeView === 'kanban' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLUMNS.map(col => (
              <div 
                key={col.id} 
                className={`bg-slate-100/80 p-4 rounded-2xl border-t-4 ${col.border} border-x border-b border-slate-200 min-h-[520px] flex flex-col shadow-xs`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-700">{col.label}</span>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
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
                              className={`bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all cursor-pointer ${
                                snapshot.isDragging ? 'rotate-1 scale-102 ring-2 ring-blue-500 shadow-xl' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-sm text-slate-900 leading-snug">{task.title}</h4>
                                <select 
                                  value={task.priority}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => dispatch(updateTaskPriority({ id: task.id, priority: e.target.value }))}
                                  className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border-none outline-none cursor-pointer"
                                >
                                  <option value="urgent">🔴 Urgent</option>
                                  <option value="high">🟡 High</option>
                                  <option value="medium">🟢 Medium</option>
                                </select>
                              </div>
                              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{task.description}</p>

                              {task.comments?.length > 0 && (
                                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-bold text-blue-600 flex items-center gap-1">
                                  💬 {task.comments.length} comment(s)
                                </div>
                              )}

                              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-400 font-medium">📅 {task.dueDate}</span>
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

      {/* 2. TABLE VIEW */}
      {activeView === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-xs shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-slate-100 text-slate-600 uppercase font-bold">
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t: any) => (
                <tr key={t.id} onClick={() => dispatch(setSelectedTaskId(t.id))} className="hover:bg-slate-50 cursor-pointer">
                  <td className="p-4 font-bold text-slate-900">{t.title}</td>
                  <td className="p-4 capitalize font-semibold text-slate-600">{t.status}</td>
                  <td className="p-4 uppercase font-bold">{t.priority}</td>
                  <td className="p-4 text-slate-500">{t.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. CALENDAR VIEW */}
      {activeView === 'calendar' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs shadow-xs">
          <h3 className="font-bold mb-4 text-slate-900 text-sm">Calendar Overview</h3>
          <div className="grid grid-cols-7 gap-2 text-center font-bold text-slate-400 mb-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }).map((_, i) => {
              const dayStr = `2026-09-${(i + 1).toString().padStart(2, '0')}`;
              const dayTasks = filteredTasks.filter((t: any) => t.dueDate === dayStr);
              return (
                <div key={i} className="min-h-[90px] border border-slate-200 rounded-xl p-2 bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-400">{i + 1}</span>
                  {dayTasks.map((t: any) => (
                    <div key={t.id} onClick={() => dispatch(setSelectedTaskId(t.id))} className="bg-blue-600 text-white text-[10px] p-1 rounded mt-1 truncate cursor-pointer font-bold">
                      {t.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. LIST VIEW */}
      {activeView === 'list' && (
        <div className="space-y-3 max-w-4xl">
          {filteredTasks.map((task: any) => (
            <div key={task.id} onClick={() => dispatch(setSelectedTaskId(task.id))} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{task.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-slate-100 font-bold text-xs rounded-lg uppercase">{task.priority}</span>
                <button onClick={(e) => { e.stopPropagation(); dispatch(setSelectedTaskId(task.id)); }} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs">
                  Display Modal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}