'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  RootState, updateTaskStatus, updateTaskPriority, deleteTask, 
  duplicateTask, setSelectedTaskId, toggleSelectTask, addToast, 
  setActiveModal 
} from '@/store';
import TableView from './TableView';
import CalendarView from './CalendarView';
import ListView from './ListView';
import { TaskItem, MockUser, Project, Workspace, Subtask } from '@/lib/mockdata';

export default function KanbanBoard() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const { 
    items: tasks = [], 
    activeView = 'kanban', 
    searchQuery = '', 
    filterPriority = 'all', 
    filterStatus = 'all',
    selectedTaskIds = [] 
  } = state.tasks;
  
  const { activeWorkspaceId, workspaces = [], activeProjectId, projects = [] } = state.workspace;
  const { currentUser, users = [] } = state.auth;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const activeWorkspace = workspaces.find((w: Workspace) => w.id === activeWorkspaceId);
  const activeProject = projects.find((p: Project) => p.id === activeProjectId);
  const isViewer = currentUser?.role === 'viewer';

  // Filter tasks for active project and search/priority filters
  const filteredTasks = tasks.filter((t: TaskItem) => {
    const matchesProject = t.projectId === activeProjectId;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesProject && matchesSearch && matchesPriority && matchesStatus;
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    if (isViewer) {
      dispatch(addToast({ message: 'Access Denied: Viewers cannot move tasks.', type: 'error' }));
      return;
    }
    const { draggableId, destination } = result;
    dispatch(updateTaskStatus({ 
      id: draggableId, 
      status: destination.droppableId as TaskItem['status'] 
    }));
  };

  const todoTasks = filteredTasks.filter((t: TaskItem) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t: TaskItem) => t.status === 'in-progress');
  const doneTasks = filteredTasks.filter((t: TaskItem) => t.status === 'done');

  return (
    <div className="w-full max-w-7xl mx-auto font-sans pb-16">
      
      {/* Print-Only Header (visible only during window.print()) */}
      <div className="print-only-header">
        <h1 className="text-2xl font-black text-slate-900">Dev on Workspace Report</h1>
        <p className="text-xs text-slate-600 mt-1">
          Workspace: <strong>{activeWorkspace?.name}</strong> • Project: <strong>{activeProject?.name}</strong> • Date: {new Date().toLocaleDateString()}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          Total Tasks: {filteredTasks.length} (To Do: {todoTasks.length} | In Progress: {inProgressTasks.length} | Completed: {doneTasks.length})
        </p>
      </div>

      {/* Board Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeProject?.name || 'Sprint Launch'}
            </h2>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-extrabold uppercase">
              {filteredTasks.length} Tasks
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {activeProject?.description || 'Active sprint workspace execution board'}
          </p>
        </div>

        {/* Quick Filter Info & Actions */}
        <div className="flex items-center gap-2">
          {searchQuery && (
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-xl font-medium">
              Filtering by: "{searchQuery}"
            </span>
          )}

          {!isViewer && (
            <button
              onClick={() => dispatch(setActiveModal('newTask'))}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>+</span>
              <span>Add Task</span>
            </button>
          )}
        </div>
      </div>

      {/* RENDER VIEWS */}

      {/* 1. KANBAN BOARD VIEW */}
      {activeView === 'kanban' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-grid grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* COLUMN 1: TO DO (Yellow Accent #f59e0b) */}
            <div 
              className="kanban-column bg-slate-50/80 rounded-2xl border border-slate-200/90 overflow-hidden min-h-[550px] flex flex-col shadow-2xs"
              style={{ borderTop: '6px solid #f59e0b' }}
            >
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span className="font-black text-xs uppercase tracking-wider text-slate-800">To Do</span>
                  </div>
                  <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-extrabold">
                    {todoTasks.length}
                  </span>
                </div>

                <Droppable droppableId="todo">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3 flex-1">
                      {todoTasks.map((task: TaskItem, index: number) => (
                        <TaskCard key={task.id} task={task} index={index} isViewer={isViewer} />
                      ))}
                      {provided.placeholder}
                      {todoTasks.length === 0 && (
                        <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium italic">
                          Drop tasks here
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>

            {/* COLUMN 2: IN PROGRESS (Green Accent #10b981) */}
            <div 
              className="kanban-column bg-slate-50/80 rounded-2xl border border-slate-200/90 overflow-hidden min-h-[550px] flex flex-col shadow-2xs"
              style={{ borderTop: '6px solid #10b981' }}
            >
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span className="font-black text-xs uppercase tracking-wider text-slate-800">In Progress</span>
                  </div>
                  <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-extrabold">
                    {inProgressTasks.length}
                  </span>
                </div>

                <Droppable droppableId="in-progress">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3 flex-1">
                      {inProgressTasks.map((task: TaskItem, index: number) => (
                        <TaskCard key={task.id} task={task} index={index} isViewer={isViewer} />
                      ))}
                      {provided.placeholder}
                      {inProgressTasks.length === 0 && (
                        <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium italic">
                          Drop tasks here
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>

            {/* COLUMN 3: COMPLETED (Red Accent #f43f5e) */}
            <div 
              className="kanban-column bg-slate-50/80 rounded-2xl border border-slate-200/90 overflow-hidden min-h-[550px] flex flex-col shadow-2xs"
              style={{ borderTop: '6px solid #f43f5e' }}
            >
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    <span className="font-black text-xs uppercase tracking-wider text-slate-800">Completed</span>
                  </div>
                  <span className="text-[11px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full font-extrabold">
                    {doneTasks.length}
                  </span>
                </div>

                <Droppable droppableId="done">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3 flex-1">
                      {doneTasks.map((task: TaskItem, index: number) => (
                        <TaskCard key={task.id} task={task} index={index} isViewer={isViewer} />
                      ))}
                      {provided.placeholder}
                      {doneTasks.length === 0 && (
                        <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium italic">
                          Drop tasks here
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>

          </div>
        </DragDropContext>
      )}

      {/* 2. TABLE VIEW */}
      {activeView === 'table' && <TableView />}

      {/* 3. CALENDAR VIEW */}
      {activeView === 'calendar' && <CalendarView />}

      {/* 4. LIST VIEW */}
      {activeView === 'list' && <ListView />}

    </div>
  );
}

// Minimalist Notion-Style Task Card Component
function TaskCard({ task, index, isViewer }: { task: TaskItem; index: number; isViewer: boolean }) {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.auth.users);
  const selectedTaskIds = useSelector((state: RootState) => state.tasks.selectedTaskIds);
  const isSelected = selectedTaskIds.includes(task.id);

  const assignee = users.find((u: MockUser) => u.id === task.assigneeId);
  const subtaskCount = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s: Subtask) => s.completed).length || 0;
  const progressPercent = subtaskCount > 0 ? (completedSubtasks / subtaskCount) * 100 : 0;

  return (
    <Draggable draggableId={task.id} index={index} isDragDisabled={isViewer}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => dispatch(setSelectedTaskId(task.id))}
          className={`kanban-card group bg-white p-4 rounded-2xl border transition-all cursor-pointer ${
            isSelected 
              ? 'border-blue-500 bg-blue-50/20 shadow-md ring-1 ring-blue-500' 
              : 'border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md'
          } ${snapshot.isDragging ? 'rotate-1 scale-102 ring-2 ring-blue-500 shadow-2xl z-50' : ''}`}
        >
          {/* Card Top Row: Checkbox, Priority Badge, Quick Actions */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isSelected}
                onClick={(e) => e.stopPropagation()}
                onChange={() => dispatch(toggleSelectTask(task.id))}
                className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer w-3.5 h-3.5"
              />
              <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md ${
                task.priority === 'urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                task.priority === 'high' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                task.priority === 'medium' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {task.priority}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity no-print">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(duplicateTask(task.id));
                  dispatch(addToast({ message: 'Task duplicated successfully!', type: 'info' }));
                }}
                className="text-slate-400 hover:text-slate-800 p-1 text-xs"
                title="Duplicate task"
              >
                📋
              </button>
              {!isViewer && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(deleteTask(task.id));
                    dispatch(addToast({ message: 'Task deleted.', type: 'info' }));
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1 text-xs font-bold"
                  title="Delete task"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <h4 className="font-extrabold text-xs text-slate-900 leading-snug mb-1 group-hover:text-blue-600 transition-colors">
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2.5">
              {task.description}
            </p>
          )}

          {/* Subtask Progress Bar */}
          {subtaskCount > 0 && (
            <div className="mb-2.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
                <span>Subtasks</span>
                <span>{completedSubtasks}/{subtaskCount} ({Math.round(progressPercent)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Bottom Card Footer: Date, Assignee, Comments, Attachments */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span>📅 {task.dueDate}</span>
              {task.comments?.length > 0 && (
                <span className="flex items-center gap-0.5 text-blue-600 font-bold" title="Comments">
                  💬 {task.comments.length}
                </span>
              )}
              {task.attachments?.length > 0 && (
                <span className="text-slate-400" title="File attachments">
                  📎 {task.attachments.length}
                </span>
              )}
            </div>

            {assignee && (
              <img 
                src={assignee.avatar} 
                alt={assignee.name} 
                className="w-5 h-5 rounded-full object-cover border border-slate-200"
                title={`Assigned to ${assignee.name} (${assignee.role})`}
              />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}