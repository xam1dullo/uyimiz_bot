// API client, response parsers, and Mini App auth headers.
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

import {
  ApiParseError,
  isRecord,
  parseApiArray,
  readBoolean,
  readEnum,
  readNumber,
  readNumberArray,
  readOptionalEnum,
  readTrimmedString,
  unwrapApiData,
} from './api-response';

export {
  ApiParseError,
  assertApiArray,
  getApiErrorMessage,
  isRecord,
  parseApiArray,
  parseApiData,
  parseRequiredApiArray,
  readApiArray,
  readBoolean,
  readEnum,
  readNumber,
  readNumberArray,
  readOptionalEnum,
  readString,
  readStringArray,
  readTrimmedString,
  unwrapApiData,
  type ApiDataEnvelope,
  type ApiErrorEnvelope,
  type ApiParser,
  type ApiResponse,
} from './api-response';
export {
  isValidationFailure,
  isValidationSuccess,
  validateBirthdayDate,
  validateBirthdayDateParts,
  validateBudgetAmount,
  validateBudgetCategoryId,
  validateReminderScheduledAt,
  validateReminderTitle,
  validateTaskTitle,
  validationFailure,
  validationSuccess,
  type AmountValidationOptions,
  type BirthdayDatePartsInput,
  type BirthdayDateValidationOptions,
  type FutureDateValidationOptions,
  type TextValidationOptions,
  type ValidationFailure,
  type ValidationIssue,
  type ValidationIssueCode,
  type ValidationResult,
  type ValidationSuccess,
} from './validation';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';
const REQUEST_TIMEOUT_MS = 15000;
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TELEGRAM_INIT_DATA_KEY = 'telegram_init_data';
const TELEGRAM_INIT_DATA_HEADER = 'X-Telegram-Init-Data';

const TRANSACTION_TYPES = ['income', 'expense'] as const;
const TASK_STATUSES = ['pending', 'in_progress', 'completed', 'overdue', 'cancelled'] as const;
const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
const REMINDER_TYPES = ['one_time', 'daily', 'weekly', 'monthly', 'yearly'] as const;

export type TransactionTypeDto = (typeof TRANSACTION_TYPES)[number];
export type TaskStatusDto = (typeof TASK_STATUSES)[number];
export type TaskPriorityDto = (typeof TASK_PRIORITIES)[number];
export type ReminderTypeDto = (typeof REMINDER_TYPES)[number];

export interface AuthTokenDto {
  accessToken: string;
  refreshToken: string;
}

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

export interface BirthdayListResponse {
  data: BirthdayDto[];
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
  type: TransactionTypeDto;
  categoryId: string;
  amount: number;
  description?: string;
}

export interface CreateTaskInput {
  familyId: string;
  title: string;
  priority?: Extract<TaskPriorityDto, 'low' | 'medium' | 'high'>;
  points?: number;
}

export interface CreateReminderInput {
  familyId: string;
  title: string;
  scheduledAt: string;
  type: ReminderTypeDto;
  description?: string;
}

export interface TaskDto {
  id: string;
  title: string;
  status: TaskStatusDto;
  priority: TaskPriorityDto;
  points: number;
  assigneeId?: string;
  familyId?: string;
  createdAt?: string;
}

export interface BudgetTransactionDto {
  id?: string;
  familyId?: string;
  type: TransactionTypeDto;
  categoryId?: string;
  category?: string;
  amount: number;
  description?: string;
  txDate?: string;
  createdAt?: string;
}

export interface BudgetCategoryDto {
  id: string;
  name: string;
  icon?: string;
  type?: TransactionTypeDto;
  sortOrder?: number;
}

export interface ReminderDto {
  id: string;
  title: string;
  scheduledAt: string;
  type: ReminderTypeDto;
  description?: string;
  familyId?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface FamilyMemberDto {
  id: string;
  userId?: string;
  familyId?: string;
  name: string;
  role?: string;
  email?: string;
  points: number;
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const api = axios.create({ baseURL: API_URL, timeout: REQUEST_TIMEOUT_MS });

let refreshRequest: Promise<AuthTokenDto> | null = null;

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredTelegramInitData(): string | null {
  return localStorage.getItem(TELEGRAM_INIT_DATA_KEY);
}

export function storeAuthTokens(tokens: AuthTokenDto): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearAuthTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  const telegramInitData = getStoredTelegramInitData();

  if (token) {
    setRequestHeader(config, 'Authorization', `Bearer ${token}`);
  }

  if (telegramInitData) {
    setRequestHeader(config, TELEGRAM_INIT_DATA_HEADER, telegramInitData);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry || isAuthRefreshRequest(originalRequest)) {
      clearAuthTokens();
      return Promise.reject(error);
    }

    const refreshTokenValue = getStoredRefreshToken();
    if (!refreshTokenValue) {
      clearAuthTokens();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const tokens = await refreshAuthTokens(refreshTokenValue);
      storeAuthTokens(tokens);
      setRequestHeader(originalRequest, 'Authorization', `Bearer ${tokens.accessToken}`);
      return api(originalRequest);
    } catch (refreshError: unknown) {
      clearAuthTokens();
      return Promise.reject(refreshError);
    }
  },
);

export function parseAuthTokens(payload: unknown, fallbackRefreshToken?: string): AuthTokenDto | null {
  const data = unwrapApiData(payload);

  if (!isRecord(data)) {
    return null;
  }

  const accessToken = readTrimmedString(data, 'accessToken');
  const refreshToken = readTrimmedString(data, 'refreshToken') ?? fallbackRefreshToken;

  return accessToken && refreshToken ? { accessToken, refreshToken } : null;
}

export function parseBalance(payload: unknown): number {
  const data = unwrapApiData(payload);

  if (typeof data === 'number' && Number.isFinite(data)) {
    return data;
  }

  return isRecord(data) ? readNumber(data, 'balance') ?? 0 : 0;
}

export function parseTaskDto(value: unknown): TaskDto | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readTrimmedString(value, 'id');
  const title = readTrimmedString(value, 'title');

  if (!id || !title) {
    return null;
  }

  return {
    id,
    title,
    status: readEnum(value.status, TASK_STATUSES, 'pending'),
    priority: readEnum(value.priority, TASK_PRIORITIES, 'medium'),
    points: readNumber(value, 'points') ?? 0,
    assigneeId: readTrimmedString(value, 'assigneeId') ?? readTrimmedString(value, 'assignedTo'),
    familyId: readTrimmedString(value, 'familyId'),
    createdAt: readTrimmedString(value, 'createdAt'),
  };
}

export function parseTaskList(payload: unknown): TaskDto[] {
  return parseApiArray(payload, parseTaskDto);
}

export function parseBudgetTransactionDto(value: unknown): BudgetTransactionDto | null {
  if (!isRecord(value)) {
    return null;
  }

  const type = readOptionalEnum(value.type, TRANSACTION_TYPES);
  const amount = readNumber(value, 'amount');

  if (!type || amount === undefined) {
    return null;
  }

  return {
    id: readTrimmedString(value, 'id'),
    familyId: readTrimmedString(value, 'familyId'),
    type,
    categoryId: readTrimmedString(value, 'categoryId'),
    category: readLocalizedString(value.category),
    amount,
    description: readTrimmedString(value, 'description'),
    txDate: readTrimmedString(value, 'txDate'),
    createdAt: readTrimmedString(value, 'createdAt'),
  };
}

export function parseBudgetTransactions(payload: unknown): BudgetTransactionDto[] {
  return parseApiArray(payload, parseBudgetTransactionDto);
}

export function parseBudgetCategoryDto(value: unknown): BudgetCategoryDto | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readTrimmedString(value, 'id');
  const name = readLocalizedString(value.name);

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    icon: readTrimmedString(value, 'icon'),
    type: readOptionalEnum(value.type, TRANSACTION_TYPES),
    sortOrder: readNumber(value, 'sortOrder'),
  };
}

export function parseBudgetCategories(payload: unknown): BudgetCategoryDto[] {
  return parseApiArray(payload, parseBudgetCategoryDto);
}

export function parseReminderDto(value: unknown): ReminderDto | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readTrimmedString(value, 'id');
  const title = readTrimmedString(value, 'title');
  const scheduledAt = readTrimmedString(value, 'scheduledAt');

  if (!id || !title || !scheduledAt) {
    return null;
  }

  return {
    id,
    title,
    scheduledAt,
    type: readEnum(value.type, REMINDER_TYPES, 'one_time'),
    description: readTrimmedString(value, 'description'),
    familyId: readTrimmedString(value, 'familyId'),
    isActive: readBoolean(value, 'isActive') ?? true,
    createdAt: readTrimmedString(value, 'createdAt'),
  };
}

export function parseReminders(payload: unknown): ReminderDto[] {
  return parseApiArray(payload, parseReminderDto);
}

export function parseBirthdayDto(value: unknown): BirthdayDto | null {
  if (!isRecord(value)) {
    return null;
  }

  const name = readTrimmedString(value, 'name');
  if (!name) {
    return null;
  }

  return {
    id: readTrimmedString(value, 'id'),
    name,
    birthDate: readTrimmedString(value, 'birthDate'),
    date: readTrimmedString(value, 'date'),
    day: readNumber(value, 'day'),
    month: readNumber(value, 'month'),
    relation: readTrimmedString(value, 'relation'),
    notifyDaysBefore: readNumberArray(value, 'notifyDaysBefore'),
    createdAt: readTrimmedString(value, 'createdAt'),
  };
}

export function parseBirthdays(payload: unknown): BirthdayDto[] {
  return parseApiArray(payload, parseBirthdayDto);
}

export function parseBirthdayListResponse(payload: unknown): BirthdayListResponse {
  return { data: parseBirthdays(payload) };
}

export function parseFamilyMemberDto(value: unknown): FamilyMemberDto | null {
  if (!isRecord(value)) {
    return null;
  }

  const userId = readTrimmedString(value, 'userId');
  const id = readTrimmedString(value, 'id') ?? userId;
  const name = readTrimmedString(value, 'name') ?? id;

  if (!id || !name) {
    return null;
  }

  return {
    id,
    userId,
    familyId: readTrimmedString(value, 'familyId'),
    name,
    role: readTrimmedString(value, 'role'),
    email: readTrimmedString(value, 'email'),
    points: readNumber(value, 'points') ?? 0,
  };
}

export function parseFamilyMembers(payload: unknown): FamilyMemberDto[] {
  return parseApiArray(payload, parseFamilyMemberDto);
}

export async function refreshAuthTokens(refreshTokenValue: string): Promise<AuthTokenDto> {
  refreshRequest ??= requestFreshAuthTokens(refreshTokenValue).finally(() => {
    refreshRequest = null;
  });

  return refreshRequest;
}

// Auth
export async function getToken(initData: string): Promise<AuthTokenDto> {
  const { data } = await api.post<unknown>('/auth/verify', { initData });
  return requireAuthTokens(data);
}

export async function refreshToken(token: string): Promise<AuthTokenDto> {
  const { data } = await api.post<unknown>('/auth/refresh', { refreshToken: token });
  return requireAuthTokens(data, token);
}

// Family
export async function getFamily(familyId: string): Promise<unknown> {
  const { data } = await api.get<unknown>(`/families/${familyId}`);
  return data;
}

export async function getMembers(familyId: string): Promise<FamilyMemberDto[]> {
  const { data } = await api.get<unknown>(`/families/${familyId}/members`);
  return parseFamilyMembers(data);
}

export async function createFamily(name: string): Promise<unknown> {
  const { data } = await api.post<unknown>('/families', { name });
  return data;
}

export async function joinFamily(code: string): Promise<unknown> {
  const { data } = await api.post<unknown>('/families/join', { code });
  return data;
}

// Budget
export async function getBalance(familyId: string): Promise<number> {
  const { data } = await api.get<unknown>(`/families/${familyId}/budget/balance`);
  return parseBalance(data);
}

export async function getTransactions(
  familyId: string,
  params?: Record<string, string>,
): Promise<BudgetTransactionDto[]> {
  const { data } = await api.get<unknown>(`/families/${familyId}/budget`, { params });
  return parseBudgetTransactions(data);
}

export async function addBudgetRecord(payload: AddBudgetRecordInput): Promise<unknown> {
  const { data } = await api.post<unknown>(`/families/${payload.familyId}/budget`, payload);
  return data;
}

export async function getBudgetCategories(): Promise<BudgetCategoryDto[]> {
  const { data } = await api.get<unknown>('/budget/categories');
  return parseBudgetCategories(data);
}

// Tasks
export async function getTasks(familyId: string, status?: string): Promise<TaskDto[]> {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  const { data } = await api.get<unknown>(`/families/${familyId}/tasks`, { params });
  return parseTaskList(data);
}

export async function createTask(payload: CreateTaskInput): Promise<unknown> {
  const { data } = await api.post<unknown>(`/families/${payload.familyId}/tasks`, payload);
  return data;
}

export async function completeTask(taskId: string): Promise<unknown> {
  const { data } = await api.patch<unknown>(`/tasks/${taskId}/complete`);
  return data;
}

// Reminders
export async function getReminders(familyId: string): Promise<ReminderDto[]> {
  const { data } = await api.get<unknown>(`/families/${familyId}/reminders`);
  return parseReminders(data);
}

export async function createReminder(payload: CreateReminderInput): Promise<unknown> {
  const { data } = await api.post<unknown>(`/families/${payload.familyId}/reminders`, payload);
  return data;
}

export async function snoozeReminder(reminderId: string, minutes: number): Promise<unknown> {
  const { data } = await api.post<unknown>(`/reminders/${reminderId}/snooze`, { minutes });
  return data;
}

// Birthdays
export async function getBirthdays(familyId: string): Promise<BirthdayListResponse> {
  const { data } = await api.get<unknown>(`/families/${familyId}/birthdays`);
  return parseBirthdayListResponse(data);
}

export async function addBirthday(payload: CreateBirthdayInput): Promise<unknown> {
  const { data } = await api.post<unknown>(`/families/${payload.familyId}/birthdays`, payload);
  return data;
}

export const apiClient = api;

function setRequestHeader(config: InternalAxiosRequestConfig, key: string, value: string): void {
  const headers = AxiosHeaders.from(config.headers);
  headers.set(key, value);
  config.headers = headers;
}

function isAuthRefreshRequest(config: InternalAxiosRequestConfig): boolean {
  return (config.url ?? '').includes('/auth/refresh');
}

async function requestFreshAuthTokens(refreshTokenValue: string): Promise<AuthTokenDto> {
  const { data } = await axios.post<unknown>(
    `${API_URL}/auth/refresh`,
    { refreshToken: refreshTokenValue },
    { headers: getTelegramInitDataHeaders(), timeout: REQUEST_TIMEOUT_MS },
  );

  return requireAuthTokens(data, refreshTokenValue);
}

function requireAuthTokens(payload: unknown, fallbackRefreshToken?: string): AuthTokenDto {
  const tokens = parseAuthTokens(payload, fallbackRefreshToken);

  if (!tokens) {
    throw new ApiParseError('Expected auth token response', payload);
  }

  return tokens;
}

function readLocalizedString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value.trim() || undefined;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  for (const key of ['uz', 'en', 'ru']) {
    const localized = readTrimmedString(value, key);
    if (localized) {
      return localized;
    }
  }

  for (const item of Object.values(value)) {
    if (typeof item === 'string' && item.trim()) {
      return item.trim();
    }
  }

  return undefined;
}

function getTelegramInitDataHeaders(): Record<string, string> | undefined {
  const telegramInitData = getStoredTelegramInitData();
  return telegramInitData ? { [TELEGRAM_INIT_DATA_HEADER]: telegramInitData } : undefined;
}

export default api;
