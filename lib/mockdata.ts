export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar: string;
  title: string;
}

export interface WorkspaceMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

export interface Workspace {
  id: string;
  name: string;
  icon: string;
  color: string;
  defaultView: 'kanban' | 'table' | 'calendar' | 'list';
  members: WorkspaceMember[];
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  members: string[]; // user IDs
  archived: boolean;
  template?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  dataUrl?: string;
  uploadedAt: string;
}

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  time: string;
  mentions?: string[];
}

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate: string;
  assigneeId: string;
  labels: string[];
  subtasks: Subtask[];
  attachments: Attachment[];
  comments: TaskComment[];
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  workspaceId: string;
  projectId: string;
  taskId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: 'created' | 'edited' | 'status_changed' | 'commented' | 'deleted' | 'subtask_completed';
  details: string;
  timestamp: string;
}

export const INITIAL_USERS: MockUser[] = [
  {
    id: 'u-1',
    name: 'Alex Morgan',
    email: 'alex@devon.io',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Founder & Tech Lead'
  },
  {
    id: 'u-2',
    name: 'Sarah Chen',
    email: 'sarah@devon.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Product Manager'
  },
  {
    id: 'u-3',
    name: 'Mike Ross',
    email: 'mike@devon.io',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Frontend Engineer'
  },
  {
    id: 'u-4',
    name: 'Emma Watson',
    email: 'emma@devon.io',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'External Stakeholder / Client'
  },
];

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Dev on Core HQ',
    icon: '⚡',
    color: '#3b82f6',
    defaultView: 'kanban',
    members: [
      { userId: 'u-1', role: 'owner' },
      { userId: 'u-2', role: 'admin' },
      { userId: 'u-3', role: 'member' },
      { userId: 'u-4', role: 'viewer' },
    ]
  },
  {
    id: 'ws-2',
    name: 'Product Design Studio',
    icon: '🎨',
    color: '#8b5cf6',
    defaultView: 'table',
    members: [
      { userId: 'u-1', role: 'owner' },
      { userId: 'u-2', role: 'admin' },
    ]
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    workspaceId: 'ws-1',
    name: 'Sprint Launch 2026',
    description: 'Q3 product release cycle including Notion dashboard, real-time Kanban, and multi-user roles.',
    color: 'bg-blue-600',
    icon: '🚀',
    members: ['u-1', 'u-2', 'u-3', 'u-4'],
    archived: false,
    template: 'sprint'
  },
  {
    id: 'proj-2',
    workspaceId: 'ws-1',
    name: 'Bug Triage & QA',
    description: 'Critical issue tracking, automated test coverage, and regression prevention.',
    color: 'bg-rose-500',
    icon: '🐞',
    members: ['u-1', 'u-3'],
    archived: false,
    template: 'bug-tracker'
  },
  {
    id: 'proj-3',
    workspaceId: 'ws-1',
    name: 'Marketing & SEO Growth',
    description: 'Landing page conversion testing, social media campaigns, and analytics.',
    color: 'bg-emerald-500',
    icon: '📈',
    members: ['u-2'],
    archived: false,
    template: 'marketing'
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    projectId: 'proj-1',
    title: 'Architect Notion-style 3-Column Kanban Board',
    description: 'Build drag and drop board with yellow (#f59e0b) To Do, green (#10b981) In Progress, and red (#f43f5e) Completed accents with smooth drop animations.',
    status: 'todo',
    priority: 'urgent',
    dueDate: '2026-09-12',
    assigneeId: 'u-3',
    labels: ['Frontend', 'UI/UX'],
    subtasks: [
      { id: 'st-1', title: 'Thick color accent borders on top of columns', completed: true },
      { id: 'st-2', title: 'Integrate @hello-pangea/dnd with optimistic state', completed: true },
      { id: 'st-3', title: 'Add subtask progress bars on cards', completed: false }
    ],
    attachments: [
      { id: 'att-1', name: 'kanban-spec.pdf', size: '1.2 MB', type: 'application/pdf', uploadedAt: '2026-09-04' }
    ],
    comments: [
      {
        id: 'c-1',
        authorId: 'u-2',
        authorName: 'Sarah Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        text: 'Make sure the badge counters update reactively when dragging cards! @mike',
        time: '10:45 AM',
        mentions: ['mike']
      }
    ],
    createdAt: '2026-09-01'
  },
  {
    id: 't-2',
    projectId: 'proj-1',
    title: 'Configure Redux Toolkit State & Client Persistence',
    description: 'Implement slices for workspaces, projects, tasks, comments, activity log, and JSON backup export.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-09-10',
    assigneeId: 'u-1',
    labels: ['Architecture', 'Redux'],
    subtasks: [
      { id: 'st-4', title: 'Define workspace & task models', completed: true },
      { id: 'st-5', title: 'Hook localStorage synchronization subscriber', completed: true },
      { id: 'st-6', title: 'Support JSON import/export validation', completed: false }
    ],
    attachments: [],
    comments: [
      {
        id: 'c-2',
        authorId: 'u-1',
        authorName: 'Alex Morgan',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'State is currently persisting properly across page reloads.',
        time: '02:15 PM'
      }
    ],
    createdAt: '2026-09-02'
  },
  {
    id: 't-3',
    projectId: 'proj-1',
    title: 'Design Dark-Themed OTP Auth Screen',
    description: 'Build 4-digit auto-advancing verification code inputs with paste support, simulated OTP fill, and work email verification.',
    status: 'done',
    priority: 'high',
    dueDate: '2026-09-08',
    assigneeId: 'u-3',
    labels: ['Auth', 'Security'],
    subtasks: [
      { id: 'st-7', title: 'Work email validation', completed: true },
      { id: 'st-8', title: 'Auto-focus next input box on type', completed: true },
      { id: 'st-9', title: 'Quick fill demo code (1234)', completed: true }
    ],
    attachments: [],
    comments: [],
    createdAt: '2026-09-03'
  },
  {
    id: 't-4',
    projectId: 'proj-1',
    title: 'Implement Print Media Rules for Clean PDF Export',
    description: 'Hide sidebars and navigation headers during window.print(), scaling the 3 columns cleanly onto a professional PDF sprint report.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-09-14',
    assigneeId: 'u-3',
    labels: ['Export', 'CSS'],
    subtasks: [
      { id: 'st-10', title: 'Add @media print rules in globals.css', completed: true },
      { id: 'st-11', title: 'Insert print header with sprint summary and timestamp', completed: false }
    ],
    attachments: [],
    comments: [],
    createdAt: '2026-09-04'
  },
  {
    id: 't-5',
    projectId: 'proj-1',
    title: 'Multi-Persona Role-Based Access Control',
    description: 'Enforce permission rules: Viewer role cannot edit/delete tasks or drag columns. Show clear Access Denied notification.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-09-18',
    assigneeId: 'u-2',
    labels: ['Security', 'Roles'],
    subtasks: [
      { id: 'st-12', title: 'Lock persona switcher to bottom of sidebar', completed: true },
      { id: 'st-13', title: 'Simulate access denied toast notifications', completed: false }
    ],
    attachments: [],
    comments: [],
    createdAt: '2026-09-05'
  }
];

export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    workspaceId: 'ws-1',
    projectId: 'proj-1',
    taskId: 't-3',
    userId: 'u-3',
    userName: 'Mike Ross',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    action: 'status_changed',
    details: 'Moved "Design Dark-Themed OTP Auth Screen" to Completed',
    timestamp: '10 minutes ago'
  },
  {
    id: 'act-2',
    workspaceId: 'ws-1',
    projectId: 'proj-1',
    taskId: 't-1',
    userId: 'u-2',
    userName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    action: 'commented',
    details: 'Commented on "Architect Notion-style 3-Column Kanban Board"',
    timestamp: '25 minutes ago'
  },
  {
    id: 'act-3',
    workspaceId: 'ws-1',
    projectId: 'proj-1',
    taskId: 't-2',
    userId: 'u-1',
    userName: 'Alex Morgan',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    action: 'created',
    details: 'Created task "Configure Redux Toolkit State & Client Persistence"',
    timestamp: '1 hour ago'
  }
];

export const PROJECT_TEMPLATES = [
  {
    id: 'sprint',
    name: 'Agile Sprint Release',
    icon: '🚀',
    description: 'Sprint planning with Backlog, In Development, QA, and Done pipeline.',
    tasks: [
      { title: 'Sprint Backlog Grooming', status: 'todo', priority: 'high', labels: ['Planning'] },
      { title: 'API Integration & Tests', status: 'in-progress', priority: 'urgent', labels: ['Backend'] },
      { title: 'Production Deployment Checklist', status: 'todo', priority: 'medium', labels: ['DevOps'] }
    ]
  },
  {
    id: 'bug-tracker',
    name: 'Bug Triage & Defect Management',
    icon: '🐞',
    description: 'Log, prioritize, reproduce, and resolve critical regressions.',
    tasks: [
      { title: 'Investigate Memory Leak on Mobile Safari', status: 'todo', priority: 'urgent', labels: ['Bug'] },
      { title: 'Fix Z-Index overlap on dropdown popover', status: 'in-progress', priority: 'medium', labels: ['UI'] }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing & Content Pipeline',
    icon: '📢',
    description: 'Editorial calendar, product launches, copywriting and ad assets.',
    tasks: [
      { title: 'Draft Product Launch Blog Post', status: 'in-progress', priority: 'high', labels: ['Content'] },
      { title: 'Design Social Media Announcement Assets', status: 'todo', priority: 'medium', labels: ['Design'] }
    ]
  }
];