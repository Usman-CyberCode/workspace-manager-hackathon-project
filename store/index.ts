import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_USERS, INITIAL_WORKSPACES, INITIAL_PROJECTS, INITIAL_TASKS } from '../lib/mockdata';

const loadState = () => {
  if (typeof window === 'undefined') return undefined;
  const saved = localStorage.getItem('app_state');
  return saved ? JSON.parse(saved) : undefined;
};

const savedState = loadState();

const authSlice = createSlice({
  name: 'auth',
  initialState: savedState?.auth || {
    currentUser: INITIAL_USERS[0],
    users: INITIAL_USERS,
    isAuthenticated: true
  },
  reducers: {
    login: (state, action: PayloadAction<{ email: string }>) => {
      const user = state.users.find((u: any) => u.email.toLowerCase() === action.payload.email.toLowerCase());
      if (user) {
        state.currentUser = user;
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    switchUser: (state, action: PayloadAction<string>) => {
      const user = state.users.find((u: any) => u.id === action.payload);
      if (user) state.currentUser = user;
    }
  }
});

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: savedState?.workspace || {
    workspaces: INITIAL_WORKSPACES,
    activeWorkspaceId: 'ws-1',
    projects: INITIAL_PROJECTS,
    activeProjectId: 'proj-1'
  },
  reducers: {
    setActiveWorkspace: (state, action: PayloadAction<string>) => { state.activeWorkspaceId = action.payload; },
    setActiveProject: (state, action: PayloadAction<string>) => { state.activeProjectId = action.payload; },
    addWorkspace: (state, action: PayloadAction<any>) => { state.workspaces.push(action.payload); },
    deleteWorkspace: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter((w: any) => w.id !== action.payload);
    },
    addProject: (state, action: PayloadAction<any>) => { state.projects.push(action.payload); }
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: savedState?.tasks || {
    items: INITIAL_TASKS,
    history: [] as any[],
    activeView: 'kanban',
    searchQuery: '',
    filterPriority: 'all',
    filterStatus: 'all',
    selectedTaskId: null as string | null,
    activities: [] as any[],
    notifications: [] as any[],
    theme: 'dark'
  },
  reducers: {
    setActiveView: (state, action: PayloadAction<string>) => { state.activeView = action.payload; },
    setSearchQuery: (state, action: PayloadAction<string>) => { state.searchQuery = action.payload; },
    setFilterPriority: (state, action: PayloadAction<string>) => { state.filterPriority = action.payload; },
    setFilterStatus: (state, action: PayloadAction<string>) => { state.filterStatus = action.payload; },
    setSelectedTaskId: (state, action: PayloadAction<string | null>) => { state.selectedTaskId = action.payload; },
    toggleTheme: (state) => { 
      state.theme = state.theme === 'dark' ? 'light' : 'dark'; 
    },

    addTask: (state, action: PayloadAction<any>) => {
      state.history.push(JSON.parse(JSON.stringify(state.items)));
      state.items.push(action.payload);
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const task = state.items.find((t: any) => t.id === action.payload.id);
      if (task) {
        state.history.push(JSON.parse(JSON.stringify(state.items)));
        task.status = action.payload.status;
      }
    },
    updateTaskPriority: (state, action: PayloadAction<{ id: string; priority: string }>) => {
      const task = state.items.find((t: any) => t.id === action.payload.id);
      if (task) {
        state.history.push(JSON.parse(JSON.stringify(state.items)));
        task.priority = action.payload.priority;
      }
    },
    updateTask: (state, action: PayloadAction<any>) => {
      const index = state.items.findIndex((t: any) => t.id === action.payload.id);
      if (index !== -1) {
        state.history.push(JSON.parse(JSON.stringify(state.items)));
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.history.push(JSON.parse(JSON.stringify(state.items)));
      state.items = state.items.filter((t: any) => t.id !== action.payload);
    },
    toggleSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.items.find((t: any) => t.id === action.payload.taskId);
      if (task) {
        const sub = task.subtasks?.find((s: any) => s.id === action.payload.subtaskId);
        if (sub) sub.completed = !sub.completed;
      }
    },
    convertSubtaskToTask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.items.find((t: any) => t.id === action.payload.taskId);
      if (task && task.subtasks) {
        const subIndex = task.subtasks.findIndex((s: any) => s.id === action.payload.subtaskId);
        if (subIndex !== -1) {
          const sub = task.subtasks[subIndex];
          task.subtasks.splice(subIndex, 1);
          state.items.push({
            id: Date.now().toString(),
            projectId: task.projectId,
            title: sub.title,
            description: `Converted from subtask of "${task.title}"`,
            status: task.status,
            priority: 'medium',
            dueDate: new Date().toISOString().split('T')[0],
            subtasks: []
          });
        }
      }
    },
    addComment: (state, action: PayloadAction<{ taskId: string; comment: any }>) => {
      const task = state.items.find((t: any) => t.id === action.payload.taskId);
      if (task) {
        if (!task.comments) task.comments = [];
        task.comments.push(action.payload.comment);
      }
    },
    pushNotification: (state, action: PayloadAction<any>) => { state.notifications.unshift(action.payload); },
    clearNotifications: (state) => { state.notifications = []; },
    undo: (state) => {
      if (state.history.length > 0) state.items = state.history.pop()!;
    },
    importStateData: (state, action: PayloadAction<any>) => {
      if (action.payload.tasks?.items) state.items = action.payload.tasks.items;
    }
  }
});

export const { login, logout, switchUser } = authSlice.actions;
export const { setActiveWorkspace, setActiveProject, addWorkspace, deleteWorkspace, addProject } = workspaceSlice.actions;
export const { 
  addTask, updateTaskStatus, updateTaskPriority, updateTask, deleteTask, toggleSubtask, convertSubtaskToTask, addComment,
  setActiveView, setSearchQuery, setFilterPriority, setFilterStatus, setSelectedTaskId, toggleTheme,
  pushNotification, clearNotifications, undo, importStateData 
} = taskSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    workspace: workspaceSlice.reducer,
    tasks: taskSlice.reducer,
  }
});

store.subscribe(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('app_state', JSON.stringify(store.getState()));
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;