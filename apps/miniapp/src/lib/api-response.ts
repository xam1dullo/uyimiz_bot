export interface ApiDataEnvelope<TData> {
  data: TData;
}

export interface ApiErrorEnvelope {
  error?: string;
  message?: string | string[];
  statusCode?: number;
}

export type ApiResponse<TData> = TData | ApiDataEnvelope<TData>;
export type ApiParser<TData> = (value: unknown) => TData | null;

export class ApiParseError extends Error {
  constructor(message: string, readonly payload?: unknown) {
    super(message);
    this.name = 'ApiParseError';
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

export function readTrimmedString(record: Record<string, unknown>, key: string): string | undefined {
  const value = readString(record, key)?.trim();
  return value ? value : undefined;
}

export function readNumber(record: Record<string, unknown>, key: string): number | undefined {
  const value = record[key];

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function readBoolean(record: Record<string, unknown>, key: string): boolean | undefined {
  const value = record[key];
  return typeof value === 'boolean' ? value : undefined;
}

export function readStringArray(record: Record<string, unknown>, key: string): string[] | undefined {
  const value = record[key];
  return Array.isArray(value) && value.every((item) => typeof item === 'string') ? [...value] : undefined;
}

export function readNumberArray(record: Record<string, unknown>, key: string): number[] | undefined {
  const value = record[key];
  return Array.isArray(value) && value.every((item) => typeof item === 'number' && Number.isFinite(item))
    ? [...value]
    : undefined;
}

export function readEnum<TValue extends string>(
  value: unknown,
  allowedValues: readonly TValue[],
  fallback: TValue,
): TValue {
  return typeof value === 'string' && allowedValues.includes(value as TValue) ? (value as TValue) : fallback;
}

export function readOptionalEnum<TValue extends string>(
  value: unknown,
  allowedValues: readonly TValue[],
): TValue | undefined {
  return typeof value === 'string' && allowedValues.includes(value as TValue) ? (value as TValue) : undefined;
}

export function unwrapApiData(payload: unknown): unknown {
  return isRecord(payload) && 'data' in payload ? payload.data : payload;
}

export function readApiArray(payload: unknown): unknown[] {
  const data = unwrapApiData(payload);
  return Array.isArray(data) ? data : [];
}

export function assertApiArray(payload: unknown): unknown[] {
  const data = unwrapApiData(payload);

  if (!Array.isArray(data)) {
    throw new ApiParseError('Expected API response data to be an array', payload);
  }

  return data;
}

export function parseApiArray<TItem>(payload: unknown, parseItem: ApiParser<TItem>): TItem[] {
  const items: TItem[] = [];

  for (const item of readApiArray(payload)) {
    const parsed = parseItem(item);
    if (parsed !== null) {
      items.push(parsed);
    }
  }

  return items;
}

export function parseRequiredApiArray<TItem>(payload: unknown, parseItem: ApiParser<TItem>): TItem[] {
  const items: TItem[] = [];

  for (const item of assertApiArray(payload)) {
    const parsed = parseItem(item);
    if (parsed === null) {
      throw new ApiParseError('Expected API response item to match parser', item);
    }
    items.push(parsed);
  }

  return items;
}

export function parseApiData<TData>(payload: unknown, parseData: ApiParser<TData>): TData | null {
  return parseData(unwrapApiData(payload));
}

export function getApiErrorMessage(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }

  const message = payload.message;
  if (typeof message === 'string') {
    return message;
  }

  if (Array.isArray(message) && message.every((item) => typeof item === 'string')) {
    return message.join(', ');
  }

  return readString(payload, 'error') ?? null;
}
