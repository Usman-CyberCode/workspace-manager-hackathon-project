export const INITIAL_USERS = [
  { id: 'u-1', name: 'Alex Owner', email: 'owner@workspace.com', role: 'owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'u-2', name: 'Sarah Admin', email: 'admin@workspace.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 'u-3', name: 'Mike Member', email: 'member@workspace.com', role: 'member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
  { id: 'u-4', name: 'Emma Viewer', email: 'viewer@workspace.com', role: 'viewer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
];

export const INITIAL_WORKSPACES = [
  { id: 'ws-1', name: 'Engineering HQ', icon: '💻', members: ['u-1', 'u-2', 'u-3', 'u-4'] },
];

export const INITIAL_PROJECTS = [
  { id: 'proj-1', workspaceId: 'ws-1', name: 'Sprint Launch', color: 'bg-blue-500' },
];

export const INITIAL_TASKS = [
  {
    id: 't-1',
    projectId: 'proj-1',
    title: 'Design Wireframes',
    description: 'Create initial UI wireframes for dashboard',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-09-15',
    assigneeId: 'u-3',
    labels: ['UI/UX'],
    subtasks: [{ id: 'st-1', title: 'Header Design', completed: true }]
  },
  {
    id: 't-2',
    projectId: 'proj-1',
    title: 'Setup Redux State',
    description: 'Configure store, persistence and slices',
    status: 'in-progress',
    priority: 'urgent',
    dueDate: '2026-09-10',
    assigneeId: 'u-1',
    labels: ['Frontend'],
    subtasks: []
  }
];