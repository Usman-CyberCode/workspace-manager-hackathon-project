'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setSelectedTaskId } from '@/store';
import { TaskItem } from '@/lib/mockdata';

export default function CalendarView() {
  const dispatch = useDispatch();
  const { items: tasks, searchQuery, filterPriority, filterStatus } = useSelector((state: RootState) => state.tasks);
  const activeProjectId = useSelector((state: RootState) => state.workspace.activeProjectId);

  const [currentMonth, setCurrentMonth] = useState('2026-09');

  const filteredTasks = tasks.filter((t: TaskItem) => {
    const matchesProject = t.projectId === activeProjectId;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesProject && matchesSearch && matchesPriority && matchesStatus;
  });

  const daysInMonth = 30; // September 2026 has 30 days
  const startDayOffset = 1; // Tuesday start

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs font-sans text-xs">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900">September 2026</h3>
          <p className="text-[11px] text-slate-500 font-medium">Sprint release cycle calendar</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500">
            {filteredTasks.length} Scheduled Tasks
          </span>
        </div>
      </div>

      {/* Weekday Names */}
      <div className="grid grid-cols-7 gap-2 text-center font-extrabold text-[10px] text-slate-400 uppercase tracking-wider mb-2">
        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Offset days */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`offset-${i}`} className="min-h-[95px] bg-slate-50/40 rounded-xl border border-slate-100 p-1.5 opacity-40" />
        ))}

        {/* 30 Days of September */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateStr = `2026-09-${dayNum.toString().padStart(2, '0')}`;
          const dayTasks = filteredTasks.filter((t: TaskItem) => t.dueDate === dateStr);

          return (
            <div 
              key={dayNum} 
              className="min-h-[95px] bg-slate-50/60 rounded-xl border border-slate-200/80 p-1.5 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[11px] font-extrabold px-1.5 py-0.2 rounded-md ${
                  dayTasks.length > 0 ? 'bg-slate-200/80 text-slate-800' : 'text-slate-400'
                }`}>
                  {dayNum}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[9px] font-bold text-blue-600">
                    {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="space-y-1 overflow-y-auto max-h-16 flex-1 pr-0.5">
                {dayTasks.map((t: TaskItem) => (
                  <div
                    key={t.id}
                    onClick={() => dispatch(setSelectedTaskId(t.id))}
                    className={`p-1 rounded-md text-[10px] font-bold truncate cursor-pointer shadow-2xs transition-transform active:scale-95 ${
                      t.status === 'done' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : t.status === 'in-progress'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                    title={t.title}
                  >
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
