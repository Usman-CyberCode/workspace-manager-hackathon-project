import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_USERS, INITIAL_WORKSPACES, INITIAL_PROJECTS, INITIAL_TASKS } from '@/lib/mockdata';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface CommentItem {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface Attachment {
  name: string;
  url: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  comments?: CommentItem[];
  subtasks?: Subtask[];
  attachments?: Attachment[];
}

export interface Project {
  id: string;
  workspaceId: string;
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
    currentUser: (INITIAL_USERS?.[0] as User) || null,
    users: (INITIAL_USERS as User[]) || [],
    isAuthenticated: true
  },
  reducers: {
    login: (state, action: PayloadAction<{ email: string }>) => {
      const user = state.users.find((u: User) => u.email.toLowerCase() === action.payload.email.toLowerCase());
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
      const user = state.users.find((u: User) => u.id === action.payload);
      if (user) state.currentUser = user;
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
    }
  }
});

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: savedState?.workspace || {
    workspaces: INITIAL_WORKSPACES || [],
    activeWorkspaceId: 'ws-1',
    projects: (INITIAL_PROJECTS as Project[]) || [],
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
    items: (INITIAL_TASKS as Task[]) || [],
    pastHistory: [] as Task[][],
    futureHistory: [] as Task[][],
    activeView: 'kanban',
    searchQuery: '',
    filterPriority: 'all',
    selectedTaskId: null as string | null,
    notifications: [
      { id: '1', text: 'Sarah Admin assigned a new task to you', time: '10:30 AM' },
      { id: '2', text: 'Alex Owner mentioned you in Sprint Launch', time: '11:15 AM' }
    ] as Array<{ id: string; text: string; time: string }>
  },
  reducers: {
    setActiveView: (state, action: PayloadAction<string>) => { state.activeView = action.payload; },
    setSearchQuery: (state, action: PayloadAction<string>) => { state.searchQuery = action.payload; },
    setFilterPriority: (state, action: PayloadAction<string>) => { state.filterPriority = action.payload; },
    setSelectedTaskId: (state, action: PayloadAction<string | null>) => { state.selectedTaskId = action.payload; },

    addTask: (state, action: PayloadAction<Task>) => {
      state.pastHistory.push(JSON.parse(JSON.stringify(state.items)));
      state.futureHistory = [];
      state.items.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Partial<Task> & { id: string }>) => {
      const index = state.items.findIndex((t: Task) => t.id === action.payload.id);
      if (index !== -1) {
        state.pastHistory.push(JSON.parse(JSON.stringify(state.items)));
        state.futureHistory = [];
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const task = state.items.find((t: Task) => t.id === action.payload.id);
      if (task) {
        state.pastHistory.push(JSON.parse(JSON.stringify(state.items)));
        state.futureHistory = [];
        task.status = action.payload.status;
      }
    },
    updateTaskPriority: (state, action: PayloadAction<{ id: string; priority: string }>) => {
      const task = state.items.find((t: Task) => t.id === action.payload.id);
      if (task) {
        state.pastHistory.push(JSON.parse(JSON.stringify(state.items)));
        state.futureHistory = [];
        task.priority = action.payload.priority;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.pastHistory.push(JSON.parse(JSON.stringify(state.items)));
      state.futureHistory = [];
      state.items = state.items.filter((t: Task) => t.id !== action.payload);
    },
    toggleSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.items.find((t: Task) => t.id === action.payload.taskId);
      if (task && task.subtasks) {
        const sub = task.subtasks.find((s: Subtask) => s.id === action.payload.subtaskId);
        if (sub) sub.completed = !sub.completed;
      }
    },
    convertSubtaskToTask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.items.find((t: Task) => t.id === action.payload.taskId);
      if (task && task.subtasks) {
        const subIndex = task.subtasks.findIndex((s: Subtask) => s.id === action.payload.subtaskId);
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
    addComment: (state, action: PayloadAction<{ taskId: string; comment: CommentItem }>) => {
      const task = state.items.find((t: Task) => t.id === action.payload.taskId);
      if (task) {
        if (!task.comments) task.comments = [];
        task.comments.push(action.payload.comment);
      }
    },
    clearNotifications: (state) => { state.notifications = []; },
    undo: (state) => {
      if (state.pastHistory.length > 0) {
        const prev = state.pastHistory.pop();
        if (prev) {
          state.futureHistory.push(JSON.parse(JSON.stringify(state.items)));
          state.items = prev;
        }
      }
    },
    redo: (state) => {
      if (state.futureHistory.length > 0) {
        const next = state.futureHistory.pop();
        if (next) {
          state.pastHistory.push(JSON.parse(JSON.stringify(state.items)));
          state.items = next;
        }
      }
    },
    importStateData: (state, action: PayloadAction<{ tasks?: { items?: Task[] } }>) => {
      if (action.payload?.tasks?.items) state.items = action.payload.tasks.items;
    }
  }
});

export const { login, logout, switchUser, updateProfile } = authSlice.actions;
export const { setActiveWorkspace, setActiveProject, addProject } = workspaceSlice.actions;
export const { 
  addTask, updateTask, updateTaskStatus, updateTaskPriority, deleteTask, 
  toggleSubtask, convertSubtaskToTask, addComment,
  setActiveView, setSearchQuery, setFilterPriority, setSelectedTaskId,
  clearNotifications, undo, redo, importStateData 
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