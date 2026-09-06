'use client';
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, renameWorkspace, deleteWorkspace, inviteWorkspaceMember, 
  updateMemberRole, setActiveModal, addToast, importTasks 
} from '@/store';
import { Workspace, MockUser, WorkspaceMember } from '@/lib/mockdata';
import { FileText, Download, Upload } from 'lucide-react';

export default function WorkspaceSettingsModal() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const { activeModal } = state.ui;
  const { workspaces = [], activeWorkspaceId } = state.workspace;
  const { users = [], currentUser } = state.auth;

  const workspace = workspaces.find((w: Workspace) => w.id === activeWorkspaceId) || workspaces[0];

  const [name, setName] = useState(workspace?.name || '');
  const [icon, setIcon] = useState(workspace?.icon || '⚡');
  const [color, setColor] = useState(workspace?.color || '#3b82f6');
  const [defaultView, setDefaultView] = useState(workspace?.defaultView || 'kanban');
  const [selectedInviteUser, setSelectedInviteUser] = useState(users[0]?.id || '');
  const [selectedInviteRole, setSelectedInviteRole] = useState<'owner' | 'admin' | 'member' | 'viewer'>('member');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (activeModal !== 'workspaceSettings' || !workspace) return null;

  const isOwner = currentUser?.role === 'owner';

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(renameWorkspace({
      id: workspace.id,
      name,
      icon,
      color,
      defaultView: defaultView as any
    }));
    dispatch(addToast({ message: 'Workspace settings saved!', type: 'success' }));
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInviteUser) return;
    dispatch(inviteWorkspaceMember({
      workspaceId: workspace.id,
      userId: selectedInviteUser,
      role: selectedInviteRole
    }));
    dispatch(addToast({ message: 'Member added to workspace!', type: 'success' }));
  };

  const handleDeleteWorkspace = () => {
    if (workspaces.length <= 1) {
      alert("Cannot delete the last remaining workspace!");
      return;
    }
    if (confirm(`Are you sure you want to permanently delete "${workspace.name}" and all its projects?`)) {
      dispatch(deleteWorkspace(workspace.id));
      dispatch(setActiveModal(null));
      dispatch(addToast({ message: 'Workspace deleted.', type: 'info' }));
    }
  };

  // Handle PDF Export
  const handleExportPDF = () => {
    dispatch(addToast({ message: 'Preparing printable workspace PDF report...', type: 'info' }));
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Handle JSON Backup Export
  const handleExportJSON = () => {
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        version: '2.0',
        workspace: state.workspace,
        tasks: state.tasks.items,
        users: state.auth.users
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const anchor = document.createElement('a');
      anchor.setAttribute("href", dataStr);
      anchor.setAttribute("download", `devon_workspace_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      dispatch(addToast({ message: 'JSON backup downloaded successfully!', type: 'success' }));
    } catch (e) {
      dispatch(addToast({ message: 'Failed to export JSON backup.', type: 'error' }));
    }
  };

  // Handle JSON Import
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported.tasks)) {
          dispatch(importTasks(imported.tasks));
          dispatch(addToast({ message: `Successfully restored ${imported.tasks.length} tasks!`, type: 'success' }));
        } else if (Array.isArray(imported)) {
          dispatch(importTasks(imported));
          dispatch(addToast({ message: `Restored ${imported.length} tasks!`, type: 'success' }));
        } else {
          throw new Error('Invalid schema');
        }
      } catch (err) {
        dispatch(addToast({ message: 'Invalid JSON backup file format.', type: 'error' }));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl animate-scaleUp text-slate-800 overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-5">
          <div>
            <h3 className="text-base font-black text-slate-900">Workspace Settings</h3>
            <p className="text-xs text-slate-500 font-medium">Manage properties, team members, export data, and backups</p>
          </div>
          <button 
            onClick={() => dispatch(setActiveModal(null))}
            className="p-1 text-slate-400 hover:text-slate-800 font-bold rounded-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Settings */}
        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs pb-5 border-b border-slate-100">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Workspace Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 font-bold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Workspace Icon
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
              >
                <option value="⚡">⚡ Lightning</option>
                <option value="🎨">🎨 Studio</option>
                <option value="🏢">🏢 Company HQ</option>
                <option value="💻">💻 Engineering</option>
                <option value="🧪">🧪 R&D Lab</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Accent Color
              </label>
              <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded-xl">
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <span className="font-mono text-[11px] text-slate-600 uppercase font-bold">{color}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </form>

        {/* Data Export, Backup & Restore Section */}
        <div className="py-5 border-b border-slate-100 text-xs">
          <div className="mb-3">
            <h4 className="font-black text-sm text-slate-900">Data Management & Backups</h4>
            <p className="text-[11px] text-slate-500">Export workspace reports or download and restore JSON backups.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Export PDF */}
            <button
              type="button"
              onClick={handleExportPDF}
              className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl text-left transition-all cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-rose-100 text-rose-600 w-fit mb-2 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-bold text-rose-900 block text-xs">Export PDF</span>
              <span className="text-[10px] text-rose-600 block mt-0.5">3-column printable report</span>
            </button>

            {/* Download JSON Backup */}
            <button
              type="button"
              onClick={handleExportJSON}
              className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl text-left transition-all cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 w-fit mb-2 group-hover:scale-105 transition-transform">
                <Download className="w-4 h-4" />
              </div>
              <span className="font-bold text-emerald-900 block text-xs">Backup JSON</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Download full state</span>
            </button>

            {/* Restore JSON Backup */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl text-left transition-all cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600 w-fit mb-2 group-hover:scale-105 transition-transform">
                <Upload className="w-4 h-4" />
              </div>
              <span className="font-bold text-blue-900 block text-xs">Restore Backup</span>
              <span className="text-[10px] text-blue-600 block mt-0.5">Upload JSON file</span>
            </button>
          </div>

          {/* Hidden File Input for JSON Restore */}
          <input 
            ref={fileInputRef} 
            type="file" 
            accept=".json" 
            className="hidden" 
            onChange={handleImportJSON} 
          />
        </div>

        {/* Members Management Section */}
        <div className="py-5 border-b border-slate-100 text-xs">
          <h4 className="font-black text-sm text-slate-900 mb-3">Workspace Members</h4>
          
          <div className="space-y-2 mb-4 max-h-44 overflow-y-auto pr-1">
            {workspace.members.map((member: WorkspaceMember) => {
              const u = users.find((user: MockUser) => user.id === member.userId);
              if (!u) return null;
              return (
                <div key={member.userId} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-[10px] text-slate-400">{u.email}</span>
                    </div>
                  </div>

                  <select
                    disabled={!isOwner}
                    value={member.role}
                    onChange={(e: any) => dispatch(updateMemberRole({
                      workspaceId: workspace.id,
                      userId: member.userId,
                      role: e.target.value
                    }))}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700 outline-none cursor-pointer text-xs"
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              );
            })}
          </div>

          {/* Fake Invite Member Form */}
          <form onSubmit={handleInvite} className="flex gap-2">
            <select
              value={selectedInviteUser}
              onChange={(e) => setSelectedInviteUser(e.target.value)}
              className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
            >
              {users.map((u: MockUser) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>

            <select
              value={selectedInviteRole}
              onChange={(e: any) => setSelectedInviteRole(e.target.value)}
              className="w-28 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
              <option value="owner">Owner</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs"
            >
              Invite +
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="pt-5 text-xs">
          <h4 className="font-black text-rose-600 mb-1">Danger Zone</h4>
          <p className="text-[11px] text-slate-500 mb-3">Irreversible deletion of this workspace and all associated projects and tasks.</p>
          <button
            type="button"
            onClick={handleDeleteWorkspace}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 font-black rounded-xl text-xs transition-all cursor-pointer"
          >
            Delete Workspace Permanently 🗑️
          </button>
        </div>

      </div>
    </div>
  );
}
