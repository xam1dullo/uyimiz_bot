// ─── API Client (Axios) ───
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

const api = axios.create({ baseURL: API_URL, timeout: 15000 });

// Attach JWT token
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('access_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Refresh on 401
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: refresh });
          localStorage.setItem('access_token', data.accessToken);
          if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);
          err.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(err.config);
        } catch { /* fall through */ }
      }
    }
    return Promise.reject(err);
  }
);


export interface BirthdayDto {
  id?: string;
  name: string;
  birthDate?: string;
  date?: string;
  day?: number;
  month?: number;
  relation?: string;
  notifyDaysBefore?: number[];
  createdAt?: string;
}

export interface CreateBirthdayInput {
  familyId: string;
  name: string;
  birthDate: string;
  relation?: string;
  notifyDaysBefore?: number[];
}

export interface AddBudgetRecordInput {
  familyId: string;
  type: 'income' | 'expense';
  categoryId: string;
  amount: number;
  description?: string;
}

export interface CreateTaskInput {
  familyId: string;
  title: string;
  priority?: 'low' | 'medium' | 'high';
  points?: number;
}

export interface CreateReminderInput {
  familyId: string;
  title: string;
  scheduledAt: string;
  type: 'one_time' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  description?: string;
}

export interface TaskDto {
  id: string;
  title: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  points: number;
  assigneeId?: string;
  familyId?: string;
  createdAt?: string;
}

// ─── Auth ───
export async function getToken(initData: string) {
  const { data } = await api.post('/auth/verify', { initData });
  return data;
}

export async function refreshToken(token: string) {
  const { data } = await api.post('/auth/refresh', { refreshToken: token });
  return data;
}

// ─── Family ───
export async function getFamily(familyId: string) {
  const { data } = await api.get(`/families/${familyId}`);
  return data;
}
export async function getMembers(familyId: string) {
  const { data } = await api.get(`/families/${familyId}/members`);
  return data;
}
export async function createFamily(name: string) {
  const { data } = await api.post('/families', { name });
  return data;
}
export async function joinFamily(code: string) {
  const { data } = await api.post('/families/join', { code });
  return data;
}

// ─── Budget ───
export async function getBalance(familyId: string) {
  const { data } = await api.get(`/families/${familyId}/budget/balance`);
  return data.balance ?? data;
}
export async function getTransactions(familyId: string, params?: Record<string, string>) {
  const { data } = await api.get(`/families/${familyId}/budget`, { params });
  return Array.isArray(data) ? data : data.data ?? [];
}
export async function addBudgetRecord(payload: AddBudgetRecordInput) {
  const { data } = await api.post(`/families/${payload.familyId}/budget`, payload);
  return data;
}
export async function getBudgetCategories() {
  const { data } = await api.get('/budget/categories');
  return Array.isArray(data) ? data : data.data ?? [];
}

// ─── Tasks ───
export async function getTasks(familyId: string, status?: string) {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  const { data } = await api.get(`/families/${familyId}/tasks`, { params });
  return Array.isArray(data) ? data : data.data ?? [];
}
export async function createTask(payload: CreateTaskInput) {
  const { data } = await api.post(`/families/${payload.familyId}/tasks`, payload);
  return data;
}
export async function completeTask(taskId: string) {
  const { data } = await api.patch(`/tasks/${taskId}/complete`);
  return data;
}

// ─── Reminders ───
export async function getReminders(familyId: string) {
  const { data } = await api.get(`/families/${familyId}/reminders`);
  return Array.isArray(data) ? data : data.data ?? [];
}
export async function createReminder(payload: CreateReminderInput) {
  const { data } = await api.post(`/families/${payload.familyId}/reminders`, payload);
  return data;
}
export async function snoozeReminder(reminderId: string, minutes: number) {
  const { data } = await api.post(`/reminders/${reminderId}/snooze`, { minutes });
  return data;
}

// ─── Birthdays ───
export async function getBirthdays(familyId: string) {
  const { data } = await api.get(`/families/${familyId}/birthdays`);
  return Array.isArray(data) ? data : data.data ?? [];
}
export async function addBirthday(payload: CreateBirthdayInput) {
  const { data } = await api.post(`/families/${payload.familyId}/birthdays`, payload);
  return data;
}

export default api;
