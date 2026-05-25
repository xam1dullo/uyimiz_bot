// ─── API Client ───
import axios from 'axios';

const API_URL = 'http://localhost:3000/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ═══ Budget ═══
export const getBudgets = (familyId: string) =>
  apiClient.get(`/budget?familyId=${familyId}`).then(r => r.data);

export const getBudgetReport = (familyId: string, period: string) =>
  apiClient.get(`/budget/${familyId}/report?period=${period}`).then(r => r.data);

export const getBalance = (familyId: string) =>
  apiClient.get(`/budget/${familyId}/balance`).then(r => r.data);

// ═══ Tasks ═══
export const getTasks = (familyId: string, status?: string) =>
  apiClient.get(`/tasks?familyId=${familyId}${status ? `&status=${status}` : ''}`).then(r => r.data);

export const completeTask = (taskId: string) =>
  apiClient.patch(`/tasks/${taskId}`, { status: 'done' }).then(r => r.data);

// ═══ Families ═══
export const getFamilies = () => apiClient.get('/families/me').then(r => r.data);

// ═══ Leaderboard ═══
export const getLeaderboard = (familyId: string) =>
  apiClient.get(`/leaderboard?familyId=${familyId}`).then(r => r.data);
