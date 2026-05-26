// ─── API Client ───
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token and Telegram initData
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ═══ Auth ═══
export const getToken = (initData: string) =>
  apiClient.post('/auth/token', { initData }).then(r => r.data);

export const refreshToken = (refreshToken: string) =>
  apiClient.post('/auth/refresh', { refreshToken }).then(r => r.data);

export const verifyToken = (token: string) =>
  apiClient.post('/auth/verify', { token }).then(r => r.data);

// ═══ Families ═══
export const createFamily = (data: { name: string }) =>
  apiClient.post('/families', data).then(r => r.data);

export const getFamily = (familyId: string) =>
  apiClient.get(`/families/${familyId}`).then(r => r.data);

export const getFamilyMembers = (familyId: string) =>
  apiClient.get(`/families/${familyId}/members`).then(r => r.data);

export const generateInvite = (familyId: string) =>
  apiClient.post('/invites/generate', { familyId }).then(r => r.data);

// ═══ Budget ═══
export const getBudgets = (familyId: string) =>
  apiClient.get(`/budget/${familyId}/summary`).then(r => r.data);

export const getBalance = (familyId: string) =>
  apiClient.get(`/budget/${familyId}/balance`).then(r => r.data);

export const addBudgetRecord = (data: {
  familyId: string;
  type: 'income' | 'expense';
  categoryId: string;
  amount: number;
  description?: string;
}) => apiClient.post('/budget/records', data).then(r => r.data);

export const getBudgetCategories = (type?: 'income' | 'expense') =>
  apiClient.get(`/budget/categories${type ? `/${type}` : ''}`).then(r => r.data);

// ═══ Tasks ═══
export const getTasks = (familyId: string, status?: string) =>
  apiClient.get(`/tasks?familyId=${familyId}${status ? `&status=${status}` : ''}`).then(r => r.data);

export const createTask = (data: {
  familyId: string;
  title: string;
  description?: string;
  priority?: string;
  points?: number;
  assignedTo?: string;
}) => apiClient.post('/tasks', data).then(r => r.data);

export const completeTask = (taskId: string) =>
  apiClient.patch(`/tasks/${taskId}/complete`).then(r => r.data);

// ═══ Reminders ═══
export const getReminders = (familyId: string) =>
  apiClient.get(`/reminders?familyId=${familyId}`).then(r => r.data);

export const createReminder = (data: {
  familyId: string;
  title: string;
  description?: string;
  type?: string;
  scheduledAt: string;
}) => apiClient.post('/reminders', data).then(r => r.data);

// ═══ Birthdays ═══
export const getBirthdays = (familyId: string) =>
  apiClient.get(`/birthdays?familyId=${familyId}`).then(r => r.data);

export const addBirthday = (data: {
  familyId: string;
  name: string;
  birthDate: string;
  notifyDaysBefore?: number[];
}) => apiClient.post('/birthdays', data).then(r => r.data);
