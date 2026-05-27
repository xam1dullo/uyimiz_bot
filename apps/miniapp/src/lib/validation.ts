export type ValidationIssueCode =
  | 'required'
  | 'invalid_type'
  | 'too_long'
  | 'invalid_number'
  | 'not_positive'
  | 'too_large'
  | 'invalid_date'
  | 'past_date'
  | 'future_date'
  | 'invalid_day'
  | 'invalid_month'
  | 'invalid_year';

export interface ValidationIssue {
  field: string;
  code: ValidationIssueCode;
}

export interface ValidationSuccess<TValue> {
  ok: true;
  value: TValue;
}

export interface ValidationFailure {
  ok: false;
  issue: ValidationIssue;
}

export type ValidationResult<TValue> = ValidationSuccess<TValue> | ValidationFailure;

export interface TextValidationOptions {
  field?: string;
  maxLength?: number;
}

export interface AmountValidationOptions {
  field?: string;
  maxAmount?: number;
}

export interface FutureDateValidationOptions {
  field?: string;
  now?: Date;
  requireFuture?: boolean;
}

export interface BirthdayDateValidationOptions {
  field?: string;
  now?: Date;
  minYear?: number;
  allowFuture?: boolean;
}

export interface BirthdayDatePartsInput {
  day: unknown;
  month: unknown;
  year: unknown;
}

const DEFAULT_TITLE_MAX_LENGTH = 120;
const DEFAULT_AMOUNT_MAX = 1_000_000_000_000;
const DEFAULT_MIN_BIRTH_YEAR = 1900;

export function validationSuccess<TValue>(value: TValue): ValidationSuccess<TValue> {
  return { ok: true, value };
}

export function validationFailure(field: string, code: ValidationIssueCode): ValidationFailure {
  return { ok: false, issue: { field, code } };
}

export function isValidationSuccess<TValue>(result: ValidationResult<TValue>): result is ValidationSuccess<TValue> {
  return result.ok;
}

export function isValidationFailure<TValue>(result: ValidationResult<TValue>): result is ValidationFailure {
  return !result.ok;
}

export function validateTaskTitle(value: unknown, options: TextValidationOptions = {}): ValidationResult<string> {
  return validateRequiredText(value, {
    field: options.field ?? 'title',
    maxLength: options.maxLength ?? DEFAULT_TITLE_MAX_LENGTH,
  });
}

export function validateReminderTitle(value: unknown, options: TextValidationOptions = {}): ValidationResult<string> {
  return validateRequiredText(value, {
    field: options.field ?? 'title',
    maxLength: options.maxLength ?? DEFAULT_TITLE_MAX_LENGTH,
  });
}

export function validateBudgetCategoryId(value: unknown, field = 'categoryId'): ValidationResult<string> {
  return validateRequiredText(value, { field, maxLength: 120 });
}

export function validateBudgetAmount(value: unknown, options: AmountValidationOptions = {}): ValidationResult<number> {
  const field = options.field ?? 'amount';
  const maxAmount = options.maxAmount ?? DEFAULT_AMOUNT_MAX;
  const parsed = parseAmount(value);

  if (parsed === null) {
    return value === '' || value === null || value === undefined
      ? validationFailure(field, 'required')
      : validationFailure(field, 'invalid_number');
  }

  if (parsed <= 0) {
    return validationFailure(field, 'not_positive');
  }

  if (parsed > maxAmount) {
    return validationFailure(field, 'too_large');
  }

  return validationSuccess(parsed);
}

export function validateReminderScheduledAt(
  value: unknown,
  options: FutureDateValidationOptions = {},
): ValidationResult<string> {
  const field = options.field ?? 'scheduledAt';
  const requireFuture = options.requireFuture ?? true;

  if (typeof value !== 'string') {
    return validationFailure(field, value === null || value === undefined ? 'required' : 'invalid_type');
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return validationFailure(field, 'required');
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return validationFailure(field, 'invalid_date');
  }

  if (requireFuture && parsed.getTime() <= (options.now ?? new Date()).getTime()) {
    return validationFailure(field, 'past_date');
  }

  return validationSuccess(trimmed);
}

export function validateBirthdayDate(
  value: unknown,
  options: BirthdayDateValidationOptions = {},
): ValidationResult<string> {
  const field = options.field ?? 'birthDate';

  if (typeof value !== 'string') {
    return validationFailure(field, value === null || value === undefined ? 'required' : 'invalid_type');
  }

  const parts = parseDateOnly(value);
  if (parts === null) {
    return validationFailure(field, value.trim() ? 'invalid_date' : 'required');
  }

  return validateBirthdayParts(parts.day, parts.month, parts.year, options);
}

export function validateBirthdayDateParts(
  input: BirthdayDatePartsInput,
  options: BirthdayDateValidationOptions = {},
): ValidationResult<string> {
  const day = parseInteger(input.day);
  if (day === null) {
    return validationFailure('day', 'invalid_day');
  }

  const month = parseInteger(input.month);
  if (month === null) {
    return validationFailure('month', 'invalid_month');
  }

  const year = parseInteger(input.year);
  if (year === null) {
    return validationFailure('year', 'invalid_year');
  }

  return validateBirthdayParts(day, month, year, options);
}

function validateRequiredText(value: unknown, options: Required<TextValidationOptions>): ValidationResult<string> {
  if (typeof value !== 'string') {
    return validationFailure(options.field, value === null || value === undefined ? 'required' : 'invalid_type');
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return validationFailure(options.field, 'required');
  }

  if (trimmed.length > options.maxLength) {
    return validationFailure(options.field, 'too_long');
  }

  return validationSuccess(trimmed);
}

function validateBirthdayParts(
  day: number,
  month: number,
  year: number,
  options: BirthdayDateValidationOptions,
): ValidationResult<string> {
  const field = options.field ?? 'birthDate';
  const now = options.now ?? new Date();
  const minYear = options.minYear ?? DEFAULT_MIN_BIRTH_YEAR;
  const allowFuture = options.allowFuture ?? false;

  if (month < 1 || month > 12) {
    return validationFailure('month', 'invalid_month');
  }

  if (year < minYear || year > now.getFullYear()) {
    return validationFailure('year', 'invalid_year');
  }

  const date = new Date(year, month - 1, day);
  const isSameDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  if (!isSameDate) {
    return validationFailure('day', 'invalid_day');
  }

  if (!allowFuture) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (date.getTime() > today.getTime()) {
      return validationFailure(field, 'future_date');
    }
  }

  return validationSuccess(formatDateOnly(year, month, day));
}

function parseAmount(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().replace(/\s+/g, '').replace(',', '.');
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDateOnly(value: string): { day: number; month: number; year: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }

  const year = Number.parseInt(match[1] ?? '', 10);
  const month = Number.parseInt(match[2] ?? '', 10);
  const day = Number.parseInt(match[3] ?? '', 10);

  return Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)
    ? { day, month, year }
    : null;
}

function parseInteger(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === 'string' && /^-?\d+$/.test(value.trim())) {
    const parsed = Number.parseInt(value.trim(), 10);
    return Number.isInteger(parsed) ? parsed : null;
  }

  return null;
}

function formatDateOnly(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
