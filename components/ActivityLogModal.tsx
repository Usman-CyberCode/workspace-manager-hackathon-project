'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setActiveModal, clearActivity } from '@/store';
import { ActivityEvent, MockUser } from '@/lib/mockdata';

export default function ActivityLogModal() {
  const dispatch = useDispatch();
  const { activeModal } = useSelector((state: RootState) => state.ui);
  const { events = [] } = useSelector((state: RootState) => state.activity);
  const { users = [] } = useSelector((state: RootState) => state.auth);

  const [filterUser, setFilterUser] = useState('all');
  const [filterAction, setFilterAction] = useState('all');

  if (activeModal !== 'activityLog') return null;

  const filteredEvents = events.filter((e: ActivityEvent) => {
    const matchUser = filterUser === 'all' || e.userId === filterUser;
    const matchAction = filterAction === 'all' || e.action === filterAction;
    return matchUser && matchAction;
  });

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-scaleUp text-slate-800">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900">Workspace Activity Log</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time audit trail and team event timeline</p>
          </div>
          <button 
            onClick={() => dispatch(setActiveModal(null))}
            className="p-1 text-slate-400 hover:text-slate-800 font-bold rounded-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2 mb-4 text-xs">
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none"
          >
            <option value="all">All Members</option>
            {users.map((u: MockUser) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none"
          >
            <option value="all">All Actions</option>
            <option value="status_changed">Status Changed</option>
            <option value="created">Created</option>
            <option value="commented">Commented</option>
            <option value="edited">Edited</option>
          </select>

          <button
            onClick={() => dispatch(clearActivity())}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all cursor-pointer"
          >
            Clear
          </button>
        </div>

        {/* Events Stream */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
          {filteredEvents.length === 0 ? (
            <p className="text-slate-400 text-center py-10 italic">No activity matching filters.</p>
          ) : (
            filteredEvents.map((evt: ActivityEvent) => (
              <div key={evt.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={evt.userAvatar} alt={evt.userName} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <span className="font-bold text-slate-900 block">{evt.userName}</span>
                    <span className="text-[11px] text-slate-600 leading-tight block">{evt.details}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono font-medium shrink-0">
                  {evt.timestamp}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
