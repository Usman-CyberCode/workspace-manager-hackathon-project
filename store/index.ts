import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  MockUser, Workspace, WorkspaceMember, Project, TaskItem, Subtask, Attachment, 
  TaskComment, ActivityEvent, INITIAL_USERS, INITIAL_WORKSPACES, 
  INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_ACTIVITIES, PROJECT_TEMPLATES 
} from '../lib/mockdata';

// Helper for loading persisted state safely
const loadState = () => {
  if (typeof window === 'undefined') return undefined;
  try {
    const saved = localStorage.getItem('devon_workspace_state_v2');
    return saved ? JSON.parse(saved) : undefined;
  } catch {
    return undefined;
  }
};

const savedState = loadState();

// ==========================================
// 1. AUTH & USER SLICE
// ==========================================
const initialAuthState = savedState?.auth || {
  currentUser: INITIAL_USERS[0] as MockUser | null,
  users: INITIAL_USERS as MockUser[],
  isAuthenticated: true, // Default to true or authenticated after OTP
  pendingVerificationEmail: null as string | null
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setPendingEmail: (state, action: PayloadAction<string>) => {
      state.pendingVerificationEmail = action.payload;
    },
    verifyAndLogin: (state, action: PayloadAction<{ email: string }>) => {
      let user = state.users.find((u: MockUser) => u.email.toLowerCase() === action.payload.email.toLowerCase());
      if (!user) {
        user = {
          id: `u-${Date.now()}`,
          name: action.payload.email.split('@')[0].replace('.', ' '),
          email: action.payload.email,
          role: 'admin',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${action.payload.email}`,
          title: 'Team Member'
        };
        state.users.push(user);
      }
      state.currentUser = user;
      state.isAuthenticated = true;
      state.pendingVerificationEmail = null;
    },
    signUpUser: (state, action: PayloadAction<{ name: string; email: string; role: MockUser['role'] }>) => {
      const newUser: MockUser = {
        id: `u-${Date.now()}`,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${action.payload.email}`,
        title: 'New Member'
      };
      state.users.push(newUser);
      state.currentUser = newUser;
      state.isAuthenticated = true;
      state.pendingVerificationEmail = null;
    },
    updateProfile: (state, action: PayloadAction<{ name: string; email: string; title?: string; avatar?: string }>) => {
      if (state.currentUser) {
        state.currentUser.name = action.payload.name;
        state.currentUser.email = action.payload.email;
        if (action.payload.title) state.currentUser.title = action.payload.title;
        if (action.payload.avatar) state.currentUser.avatar = action.payload.avatar;
        const index = state.users.findIndex((u: MockUser) => u.id === state.currentUser?.id);
        if (index !== -1) {
          state.users[index] = { ...state.currentUser };
        }
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u: MockUser) => u.id !== action.payload);
      if (state.currentUser?.id === action.payload) {
        state.currentUser = state.users[0] || null;
        if (!state.currentUser) state.isAuthenticated = false;
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.pendingVerificationEmail = null;
    },
    switchUser: (state, action: PayloadAction<string>) => {
      const user = state.users.find((u: MockUser) => u.id === action.payload);
      if (user) state.currentUser = user;
    }
  }
});

// ==========================================
// 2. WORKSPACE & PROJECT SLICE
// ==========================================
const initialWorkspaceState = savedState?.workspace || {
  workspaces: INITIAL_WORKSPACES as Workspace[],
  activeWorkspaceId: 'ws-1',
  projects: INITIAL_PROJECTS as Project[],
  activeProjectId: 'proj-1'
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: initialWorkspaceState,
  reducers: {
    setActiveWorkspace: (state, action: PayloadAction<string>) => {
      state.activeWorkspaceId = action.payload;
      // Auto-select first project of the workspace if active project is not in this workspace
      const projInWs = state.projects.find((p: Project) => p.workspaceId === action.payload && !p.archived);
      if (projInWs) {
        state.activeProjectId = projInWs.id;
      }
    },
    setActiveProject: (state, action: PayloadAction<string>) => {
      state.activeProjectId = action.payload;
    },
    createWorkspace: (state, action: PayloadAction<{ name: string; icon: string; color: string; defaultView: Workspace['defaultView'] }>) => {
      const newWs: Workspace = {
        id: `ws-${Date.now()}`,
        name: action.payload.name,
        icon: action.payload.icon || '📁',
        color: action.payload.color || '#3b82f6',
        defaultView: action.payload.defaultView || 'kanban',
        members: [{ userId: 'u-1', role: 'owner' }]
      };
      state.workspaces.push(newWs);
      state.activeWorkspaceId = newWs.id;

      // Also create a default project in it
      const defaultProj: Project = {
        id: `proj-${Date.now()}`,
        workspaceId: newWs.id,
        name: 'General Tasks',
        description: 'Default project for tracking tasks.',
        color: 'bg-blue-600',
        icon: '📋',
        members: ['u-1'],
        archived: false
      };
      state.projects.push(defaultProj);
      state.activeProjectId = defaultProj.id;
    },
    renameWorkspace: (state, action: PayloadAction<{ id: string; name: string; icon?: string; color?: string; defaultView?: Workspace['defaultView'] }>) => {
      const ws = state.workspaces.find((w: Workspace) => w.id === action.payload.id);
      if (ws) {
        ws.name = action.payload.name;
        if (action.payload.icon) ws.icon = action.payload.icon;
        if (action.payload.color) ws.color = action.payload.color;
        if (action.payload.defaultView) ws.defaultView = action.payload.defaultView;
      }
    },
    deleteWorkspace: (state, action: PayloadAction<string>) => {
      if (state.workspaces.length <= 1) return; // Keep at least one workspace
      state.workspaces = state.workspaces.filter((w: Workspace) => w.id !== action.payload);
      state.projects = state.projects.filter((p: Project) => p.workspaceId !== action.payload);
      if (state.activeWorkspaceId === action.payload) {
        state.activeWorkspaceId = state.workspaces[0].id;
        const firstProj = state.projects.find((p: Project) => p.workspaceId === state.activeWorkspaceId);
        if (firstProj) state.activeProjectId = firstProj.id;
      }
    },
    inviteWorkspaceMember: (state, action: PayloadAction<{ workspaceId: string; userId: string; role: Workspace['members'][0]['role'] }>) => {
      const ws = state.workspaces.find((w: Workspace) => w.id === action.payload.workspaceId);
      if (ws) {
        const existing = ws.members.find((m: WorkspaceMember) => m.userId === action.payload.userId);
        if (!existing) {
          ws.members.push({ userId: action.payload.userId, role: action.payload.role });
        }
      }
    },
    updateMemberRole: (state, action: PayloadAction<{ workspaceId: string; userId: string; role: Workspace['members'][0]['role'] }>) => {
      const ws = state.workspaces.find((w: Workspace) => w.id === action.payload.workspaceId);
      if (ws) {
        const m = ws.members.find((mem: WorkspaceMember) => mem.userId === action.payload.userId);
        if (m) m.role = action.payload.role;
      }
    },
    createProject: (state, action: PayloadAction<Omit<Project, 'id'>>) => {
      const newProj: Project = {
        ...action.payload,
        id: `proj-${Date.now()}`
      };
      state.projects.push(newProj);
      state.activeProjectId = newProj.id;
    },
    renameProject: (state, action: PayloadAction<{ id: string; name: string; description?: string; color?: string; icon?: string }>) => {
      const proj = state.projects.find((p: Project) => p.id === action.payload.id);
      if (proj) {
        proj.name = action.payload.name;
        if (action.payload.description !== undefined) proj.description = action.payload.description;
        if (action.payload.color) proj.color = action.payload.color;
        if (action.payload.icon) proj.icon = action.payload.icon;
      }
    },
    archiveProject: (state, action: PayloadAction<string>) => {
      const proj = state.projects.find((p: Project) => p.id === action.payload);
      if (proj) {
        proj.archived = !proj.archived;
        // If archived active project, select another one
        if (proj.archived && state.activeProjectId === proj.id) {
          const another = state.projects.find((p: Project) => p.workspaceId === proj.workspaceId && !p.archived && p.id !== proj.id);
          if (another) state.activeProjectId = another.id;
        }
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p: Project) => p.id !== action.payload);
      if (state.activeProjectId === action.payload) {
        const another = state.projects.find((p: Project) => p.workspaceId === state.activeWorkspaceId && !p.archived);
        if (another) state.activeProjectId = another.id;
      }
    }
  }
});

// ==========================================
// 3. TASKS & VIEWS SLICE (With Undo/Redo & Subtasks)
// ==========================================
const initialTaskState = savedState?.tasks || {
  items: INITIAL_TASKS as TaskItem[],
  pastHistory: [] as TaskItem[][],
  futureHistory: [] as TaskItem[][],
  activeView: 'kanban' as 'kanban' | 'table' | 'calendar' | 'list',
  searchQuery: '',
  filterPriority: 'all',
  filterStatus: 'all',
  filterAssignee: 'all',
  filterLabel: 'all',
  sortBy: 'dueDate' as 'dueDate' | 'priority' | 'createdAt' | 'title',
  groupBy: 'none' as 'none' | 'status' | 'assignee' | 'priority' | 'label',
  selectedTaskId: null as string | null,
  selectedTaskIds: [] as string[] // For bulk multi-select
};

const pushHistory = (state: any) => {
  // Deep clone current items for undo
  state.pastHistory.push(JSON.parse(JSON.stringify(state.items)));
  if (state.pastHistory.length > 20) state.pastHistory.shift();
  state.futureHistory = [];
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState: initialTaskState,
  reducers: {
    setActiveView: (state, action: PayloadAction<'kanban' | 'table' | 'calendar' | 'list'>) => {
      state.activeView = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterPriority: (state, action: PayloadAction<string>) => {
      state.filterPriority = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
    setFilterAssignee: (state, action: PayloadAction<string>) => {
      state.filterAssignee = action.payload;
    },
    setFilterLabel: (state, action: PayloadAction<string>) => {
      state.filterLabel = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'dueDate' | 'priority' | 'createdAt' | 'title'>) => {
      state.sortBy = action.payload;
    },
    setGroupBy: (state, action: PayloadAction<'none' | 'status' | 'assignee' | 'priority' | 'label'>) => {
      state.groupBy = action.payload;
    },
    setSelectedTaskId: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
    toggleSelectTask: (state, action: PayloadAction<string>) => {
      const idx = state.selectedTaskIds.indexOf(action.payload);
      if (idx !== -1) {
        state.selectedTaskIds.splice(idx, 1);
      } else {
        state.selectedTaskIds.push(action.payload);
      }
    },
    selectAllTasks: (state, action: PayloadAction<string[]>) => {
      state.selectedTaskIds = action.payload;
    },
    clearSelectedTasks: (state) => {
      state.selectedTaskIds = [];
    },
    // Task CRUD
    addTask: (state, action: PayloadAction<Omit<TaskItem, 'id' | 'createdAt'>>) => {
      pushHistory(state);
      const newTask: TaskItem = {
        ...action.payload,
        id: `t-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        subtasks: action.payload.subtasks || [],
        attachments: action.payload.attachments || [],
        comments: action.payload.comments || []
      };
      state.items.push(newTask);
    },
    editTask: (state, action: PayloadAction<Partial<TaskItem> & { id: string }>) => {
      pushHistory(state);
      const idx = state.items.findIndex((t: TaskItem) => t.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload };
      }
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: TaskItem['status'] }>) => {
      pushHistory(state);
      const task = state.items.find((t: TaskItem) => t.id === action.payload.id);
      if (task) task.status = action.payload.status;
    },
    updateTaskPriority: (state, action: PayloadAction<{ id: string; priority: TaskItem['priority'] }>) => {
      pushHistory(state);
      const task = state.items.find((t: TaskItem) => t.id === action.payload.id);
      if (task) task.priority = action.payload.priority;
    },
    updateTaskAssignee: (state, action: PayloadAction<{ id: string; assigneeId: string }>) => {
      pushHistory(state);
      const task = state.items.find((t: TaskItem) => t.id === action.payload.id);
      if (task) task.assigneeId = action.payload.assigneeId;
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      pushHistory(state);
      state.items = state.items.filter((t: TaskItem) => t.id !== action.payload);
      state.selectedTaskIds = state.selectedTaskIds.filter((id: string) => id !== action.payload);
      if (state.selectedTaskId === action.payload) state.selectedTaskId = null;
    },
    duplicateTask: (state, action: PayloadAction<string>) => {
      pushHistory(state);
      const task = state.items.find((t: TaskItem) => t.id === action.payload);
      if (task) {
        const copy: TaskItem = {
          ...JSON.parse(JSON.stringify(task)),
          id: `t-${Date.now()}`,
          title: `${task.title} (Copy)`,
          createdAt: new Date().toISOString().split('T')[0]
        };
        state.items.push(copy);
      }
    },
    // Bulk Operations
    bulkUpdateStatus: (state, action: PayloadAction<TaskItem['status']>) => {
      if (state.selectedTaskIds.length === 0) return;
      pushHistory(state);
      state.items.forEach((t: TaskItem) => {
        if (state.selectedTaskIds.includes(t.id)) {
          t.status = action.payload;
        }
      });
      state.selectedTaskIds = [];
    },
    bulkUpdateAssignee: (state, action: PayloadAction<string>) => {
      if (state.selectedTaskIds.length === 0) return;
      pushHistory(state);
      state.items.forEach((t: TaskItem) => {
        if (state.selectedTaskIds.includes(t.id)) {
          t.assigneeId = action.payload;
        }
      });
      state.selectedTaskIds = [];
    },
    bulkDeleteTasks: (state) => {
      if (state.selectedTaskIds.length === 0) return;
      pushHistory(state);
      state.items = state.items.filter((t: TaskItem) => !state.selectedTaskIds.includes(t.id));
      state.selectedTaskIds = [];
    },
    // Nested Subtasks
    addSubtask: (state, action: PayloadAction<{ taskId: string; title: string }>) => {
      const task = state.items.find((t: TaskItem) => t.id === action.payload.taskId);
      if (task) {
        if (!task.subtasks) task.subtasks = [];
        task.subtasks.push({
          id: `st-${Date.now()}`,
          title: action.payload.title,
          completed: false
        });
      }
    },
    toggleSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.items.find((t: TaskItem) => t.id === action.payload.taskId);
      if (task?.subtasks) {
        const sub = task.subtasks.find((s: Subtask) => s.id === action.payload.subtaskId);
        if (sub) sub.completed = !sub.completed;
      }
    },
    deleteSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.items.find((t: TaskItem) => t.id === action.payload.taskId);
      if (task?.subtasks) {
        task.subtasks = task.subtasks.filter((s: Subtask) => s.id !== action.payload.subtaskId);
      }
    },
    convertSubtaskToTask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.items.find((t: TaskItem) => t.id === action.payload.taskId);
      if (task?.subtasks) {
        const sub = task.subtasks.find((s: Subtask) => s.id === action.payload.subtaskId);
        if (sub) {
          pushHistory(state);
          state.items.push({
            id: `t-${Date.now()}`,
            projectId: task.projectId,
            title: sub.title,
            description: `Converted from subtask of "${task.title}"`,
            status: sub.completed ? 'done' : 'todo',
            priority: 'medium',
            dueDate: task.dueDate,
            assigneeId: task.assigneeId,
            labels: [...task.labels],
            subtasks: [],
            attachments: [],
            comments: [],
            createdAt: new Date().toISOString().split('T')[0]
          });
          task.subtasks = task.subtasks.filter((s: Subtask) => s.id !== action.payload.subtaskId);
        }
      }
    },
    convertTaskToSubtask: (state, action: PayloadAction<{ sourceTaskId: string; targetTaskId: string }>) => {
      const source = state.items.find((t: TaskItem) => t.id === action.payload.sourceTaskId);
      const target = state.items.find((t: TaskItem) => t.id === action.payload.targetTaskId);
      if (source && target && source.id !== target.id) {
        pushHistory(state);
        if (!target.subtasks) target.subtasks = [];
        target.subtasks.push({
          id: `st-${Date.now()}`,
          title: source.title,
          completed: source.status === 'done'
        });
        state.items = state.items.filter((t: TaskItem) => t.id !== source.id);
      }
    },
    // Attachments
    addAttachment: (state, action: PayloadAction<{ taskId: string; attachment: Attachment }>) => {
      const task = state.items.find((t: TaskItem) => t.id === action.payload.taskId);
      if (task) {
        if (!task.attachments) task.attachments = [];
        task.attachments.push(action.payload.attachment);
      }
    },
    deleteAttachment: (state, action: PayloadAction<{ taskId: string; attachmentId: string }>) => {
      const task = state.items.find((t: TaskItem) => t.id === action.payload.taskId);
      if (task?.attachments) {
        task.attachments = task.attachments.filter((a: Attachment) => a.id !== action.payload.attachmentId);
      }
    },
    // Comments
    addComment: (state, action: PayloadAction<{ taskId: string; comment: TaskComment }>) => {
      const task = state.items.find((t: TaskItem) => t.id === action.payload.taskId);
      if (task) {
        if (!task.comments) task.comments = [];
        task.comments.push(action.payload.comment);
      }
    },
    editComment: (state, action: PayloadAction<{ taskId: string; commentId: string; text: string }>) => {
      const task = state.items.find((t: TaskItem) => t.id === action.payload.taskId);
      if (task?.comments) {
        const comment = task.comments.find((c: TaskComment) => c.id === action.payload.commentId);
        if (comment) comment.text = action.payload.text;
      }
    },
    deleteComment: (state, action: PayloadAction<{ taskId: string; commentId: string }>) => {
      const task = state.items.find((t: TaskItem) => t.id === action.payload.taskId);
      if (task?.comments) {
        task.comments = task.comments.filter((c: TaskComment) => c.id !== action.payload.commentId);
      }
    },
    // Undo / Redo
    undo: (state) => {
      if (state.pastHistory.length > 0) {
        state.futureHistory.push(JSON.parse(JSON.stringify(state.items)));
        const previous = state.pastHistory.pop();
        if (previous) state.items = previous;
      }
    },
    redo: (state) => {
      if (state.futureHistory.length > 0) {
        state.pastHistory.push(JSON.parse(JSON.stringify(state.items)));
        const next = state.futureHistory.pop();
        if (next) state.items = next;
      }
    },
    // Import entire state
    importTasks: (state, action: PayloadAction<TaskItem[]>) => {
      pushHistory(state);
      state.items = action.payload;
    }
  }
});

// ==========================================
// 4. ACTIVITY LOG SLICE
// ==========================================
const initialActivityState = savedState?.activity || {
  events: INITIAL_ACTIVITIES as ActivityEvent[]
};

const activitySlice = createSlice({
  name: 'activity',
  initialState: initialActivityState,
  reducers: {
    addActivity: (state, action: PayloadAction<Omit<ActivityEvent, 'id'>>) => {
      state.events.unshift({
        ...action.payload,
        id: `act-${Date.now()}`
      });
      if (state.events.length > 100) state.events.pop();
    },
    clearActivity: (state) => {
      state.events = [];
    }
  }
});

// ==========================================
// 5. NOTIFICATIONS SLICE
// ==========================================
export interface NotificationItem {
  id: string;
  title: string;
  text: string;
  time: string;
  read: boolean;
  type: 'assignment' | 'mention' | 'due' | 'system';
}

const initialNotificationState = savedState?.notifications || {
  items: [
    {
      id: 'notif-1',
      title: 'New Mention',
      text: 'Sarah Chen mentioned you in "Architect Notion-style 3-Column Kanban Board"',
      time: '10 mins ago',
      read: false,
      type: 'mention'
    },
    {
      id: 'notif-2',
      title: 'Task Due Approaching',
      text: '"Design Dark-Themed OTP Auth Screen" is scheduled for completion soon',
      time: '1 hour ago',
      read: false,
      type: 'due'
    }
  ] as NotificationItem[],
  preferences: {
    onAssigned: true,
    onMentioned: true,
    onDueDateApproaching: true
  }
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: initialNotificationState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id' | 'read'>>) => {
      state.items.unshift({
        ...action.payload,
        id: `notif-${Date.now()}`,
        read: false
      });
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const n = state.items.find((item: NotificationItem) => item.id === action.payload);
      if (n) n.read = true;
    },
    markAllAsRead: (state) => {
      state.items.forEach((item: NotificationItem) => { item.read = true; });
    },
    clearNotifications: (state) => {
      state.items = [];
    },
    togglePreference: (state, action: PayloadAction<'onAssigned' | 'onMentioned' | 'onDueDateApproaching'>) => {
      state.preferences[action.payload] = !state.preferences[action.payload];
    }
  }
});

// ==========================================
// 6. UI & SYSTEM UTILITIES SLICE
// ==========================================
export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  actionLabel?: string;
  onAction?: () => void;
}

const initialUIState = savedState?.ui || {
  theme: 'light' as 'light' | 'dark',
  isOffline: false,
  isLiveSimEnabled: true,
  commandPaletteOpen: false,
  keyboardShortcutsOpen: false,
  activeModal: null as 'newProject' | 'newWorkspace' | 'workspaceSettings' | 'activityLog' | 'shortcuts' | 'profile' | 'newTask' | null,
  toasts: [] as Toast[]
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUIState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleOffline: (state) => {
      state.isOffline = !state.isOffline;
    },
    toggleLiveSim: (state) => {
      state.isLiveSimEnabled = !state.isLiveSimEnabled;
    },
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>) => {
      state.commandPaletteOpen = action.payload;
    },
    setKeyboardShortcutsOpen: (state, action: PayloadAction<boolean>) => {
      state.keyboardShortcutsOpen = action.payload;
    },
    setActiveModal: (state, action: PayloadAction<typeof initialUIState.activeModal>) => {
      state.activeModal = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      state.toasts.push({
        ...action.payload,
        id: `toast-${Date.now()}`
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t: Toast) => t.id !== action.payload);
    }
  }
});

// Export all actions
export const { 
  setPendingEmail, verifyAndLogin, signUpUser, updateProfile, deleteUser, logout, switchUser 
} = authSlice.actions;

export const { 
  setActiveWorkspace, setActiveProject, createWorkspace, renameWorkspace, deleteWorkspace, 
  inviteWorkspaceMember, updateMemberRole, createProject, renameProject, archiveProject, deleteProject 
} = workspaceSlice.actions;

export const addProject = createProject;

export const { 
  setActiveView, setSearchQuery, setFilterPriority, setFilterStatus, setFilterAssignee, setFilterLabel, 
  setSortBy, setGroupBy, setSelectedTaskId, toggleSelectTask, selectAllTasks, clearSelectedTasks, 
  addTask, editTask, updateTaskStatus, updateTaskPriority, updateTaskAssignee, deleteTask, duplicateTask, 
  bulkUpdateStatus, bulkUpdateAssignee, bulkDeleteTasks, addSubtask, toggleSubtask, deleteSubtask, 
  convertSubtaskToTask, convertTaskToSubtask, addAttachment, deleteAttachment, addComment, editComment, 
  deleteComment, undo, redo, importTasks 
} = taskSlice.actions;

export const { addActivity, clearActivity } = activitySlice.actions;
export const { addNotification, markAsRead, markAllAsRead, clearNotifications, togglePreference } = notificationSlice.actions;
export const { 
  setTheme, toggleTheme, toggleOffline, toggleLiveSim, setCommandPaletteOpen, 
  setKeyboardShortcutsOpen, setActiveModal, addToast, removeToast 
} = uiSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    workspace: workspaceSlice.reducer,
    tasks: taskSlice.reducer,
    activity: activitySlice.reducer,
    notifications: notificationSlice.reducer,
    ui: uiSlice.reducer,
  }
});

// Persist all slices to LocalStorage
store.subscribe(() => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('devon_workspace_state_v2', JSON.stringify(store.getState()));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;