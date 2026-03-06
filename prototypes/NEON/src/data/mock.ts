// Shared mock data for all theme prototypes

export const MOCK_USER = {
  name: "Summer",
  role: "System Architect",
  avatarUrl: "https://i.pravatar.cc/150?u=summer",
};

export const MOCK_STATS = [
  { label: 'Total Designs', value: 21, trend: '+3', trendUp: true },
  { label: 'New Themes', value: 5, trend: '+2', trendUp: true },
  { label: 'Total Modules', value: 105, trend: '+12', trendUp: true },
  { label: 'System Health', value: '98%', trend: '+1%', trendUp: true },
];

export const MOCK_PROJECTS = [
  { id: '1', name: 'PRISM', description: 'Spectrum Analysis', category: 'Science', status: 'Active', progress: 85 },
  { id: '2', name: 'ZEN', description: 'Oriental Zen', category: 'Zen', status: 'Planning', progress: 20 },
  { id: '3', name: 'FORGE', description: 'Industrial Workshop', category: 'Industrial', status: 'Active', progress: 60 },
  { id: '4', name: 'GLITCH', description: 'Cyberpunk Chaos', category: 'Cyberpunk', status: 'Completed', progress: 100 },
  { id: '5', name: 'EPOCH', description: 'Archaeological Timeline', category: 'History', status: 'Active', progress: 45 },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'New Theme Deployed', message: 'ZEN has been deployed successfully.', time: '2 hours ago', read: false },
  { id: 'n2', title: 'System Update', message: 'Framework upgraded to React 19.', time: '5 hours ago', read: true },
  { id: 'n3', title: 'Build Failed', message: 'EPOCH build encountered an error.', time: '1 day ago', read: true },
];

export const MOCK_CHART_DATA = [
  { name: 'Mon', active: 4000, new: 2400, amt: 2400 },
  { name: 'Tue', active: 3000, new: 1398, amt: 2210 },
  { name: 'Wed', active: 2000, new: 9800, amt: 2290 },
  { name: 'Thu', active: 2780, new: 3908, amt: 2000 },
  { name: 'Fri', active: 1890, new: 4800, amt: 2181 },
  { name: 'Sat', active: 2390, new: 3800, amt: 2500 },
  { name: 'Sun', active: 3490, new: 4300, amt: 2100 },
];

export const MOCK_INBOX = [
  { id: 'i1', content: 'React Performance Optimization Article', type: 'link', time: '2 hours ago' },
  { id: 'i2', content: 'Idea: Decentralized storage for notes', type: 'thought', time: '5 hours ago' },
  { id: 'i3', content: 'Read Wabi-sabi principles', type: 'task', time: '1 day ago' },
];

export const MOCK_EVALUATIONS = [
  { id: 'e1', title: 'AI Writing Assistant', difficulty: 'Low', value: 'High', status: 'Do Now' },
  { id: 'e2', title: 'Custom Operating System', difficulty: 'High', value: 'High', status: 'Plan' },
  { id: 'e3', title: 'Redesign old themes', difficulty: 'High', value: 'Low', status: 'Drop' },
];

export const MOCK_BLUEPRINT_NODES = [
  { id: 'b1', label: 'React Hooks', status: 'mastered' },
  { id: 'b2', label: 'TypeScript', status: 'learning' },
  { id: 'b3', label: 'State Management', status: 'mastered' },
  { id: 'b4', label: 'Performance Optimization', status: 'exploring' },
];
