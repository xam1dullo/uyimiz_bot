export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatTime(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelative(date: Date): string {
  const now = Date.now();
  const diff = date.getTime() - now;
  const abs = Math.abs(diff);
  const seconds = Math.floor(abs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} kun`;
  if (hours > 0) return `${hours} soat`;
  if (minutes > 0) return `${minutes} daqiqa`;
  return `${seconds} soniya`;
}
