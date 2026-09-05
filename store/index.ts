import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_USERS, INITIAL_WORKSPACES, INITIAL_PROJECTS, INITIAL_TASKS } from '../lib/mockdata';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  userId?: string; // Associated user ID
  name: string;
  color: string;
}

const loadState = () => {
  if (typeof window === 'undefined') return undefined;
  try {
    const saved = localStorage.getItem('app_state');
    return saved ? JSON.parse(saved) : undefined;
  } catch {
    return undefined;
  }
};

const savedState = loadState();

const authSlice = createSlice({
  name: 'auth',
  initialState: savedState?.auth || {
    currentUser: null as User | null,
    users: (INITIAL_USERS as User[]) || [],
    isAuthenticated: false,
    pendingVerificationEmail: null as string | null
  },
  reducers: {
    setPendingEmail: (state, action: PayloadAction<string>) => {
      state.pendingVerificationEmail = action.payload;
    },
    verifyAndLogin: (state, action: PayloadAction<{ email: string }>) => {
      let user = state.users.find((u: User) => u.email.toLowerCase() === action.payload.email.toLowerCase());
      if (!user) {
        user = {
          id: `user-${Date.now()}`,
          name: action.payload.email.split('@')[0],
          email: action.payload.email,
          role: 'admin',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${action.payload.email}`
        };
        state.users.push(user);
      }
      state.currentUser = user;
      state.isAuthenticated = true;
      state.pendingVerificationEmail = null;
    },
    updateProfile: (state, action: PayloadAction<{ name: string; email: string }>) => {
      if (state.currentUser) {
        state.currentUser.name = action.payload.name;
        state.currentUser.email = action.payload.email;
        const index = state.users.findIndex((u: User) => u.id === state.currentUser?.id);
        if (index !== -1) {
          state.users[index].name = action.payload.name;
          state.users[index].email = action.payload.email;
        }
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u: User) => u.id !== action.payload);
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
      const user = state.users.find((u: User) => u.id === action.payload);
      if (user) state.currentUser = user;
    }
  }
});

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: savedState?.workspace || {
    workspaces: INITIAL_WORKSPACES || [],
    activeWorkspaceId: 'ws-1',
    projects: INITIAL_PROJECTS || [],
    activeProjectId: 'proj-1'
  },
  reducers: {
    setActiveWorkspace: (state, action: PayloadAction<string>) => { state.activeWorkspaceId = action.payload; },
    setActiveProject: (state, action: PayloadAction<string>) => { state.activeProjectId = action.payload; },
    addProject: (state, action: PayloadAction<Project>) => { state.projects.push(action.payload); }
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: savedState?.tasks || {
    items: INITIAL_TASKS || [],
    pastHistory: [],
    futureHistory: [],
    activeView: 'kanban',
    searchQuery: '',
    filterPriority: 'all',
    selectedTaskId: null,
    notifications: []
  },
  reducers: {
    setActiveView: (state, action: PayloadAction<string>) => { state.activeView = action.payload; },
    setSearchQuery: (state, action: PayloadAction<string>) => { state.searchQuery = action.payload; },
    setFilterPriority: (state, action: PayloadAction<string>) => { state.filterPriority = action.payload; },
    setSelectedTaskId: (state, action: PayloadAction<string | null>) => { state.selectedTaskId = action.payload; },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const task = state.items.find((t: any) => t.id === action.payload.id);
      if (task) task.status = action.payload.status;
    },
    updateTaskPriority: (state, action: PayloadAction<{ id: string; priority: string }>) => {
      const task = state.items.find((t: any) => t.id === action.payload.id);
      if (task) task.priority = action.payload.priority;
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t: any) => t.id !== action.payload);
    },
    addTask: (state, action: PayloadAction<any>) => {
      state.items.push(action.payload);
    },
    addComment: (state, action: PayloadAction<{ taskId: string; comment: any }>) => {
      const task = state.items.find((t: any) => t.id === action.payload.taskId);
      if (task) {
        if (!task.comments) task.comments = [];
        task.comments.push(action.payload.comment);
      }
    },
    undo: (state) => {},
    redo: (state) => {},
    clearNotifications: (state) => { state.notifications = []; }
  }
});

export const { setPendingEmail, verifyAndLogin, updateProfile, deleteUser, logout, switchUser } = authSlice.actions;
export const { setActiveWorkspace, setActiveProject, addProject } = workspaceSlice.actions;
export const { 
  setActiveView, setSearchQuery, setFilterPriority, setSelectedTaskId, 
  updateTaskStatus, updateTaskPriority, deleteTask, addTask, addComment, undo, redo, clearNotifications 
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