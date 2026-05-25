export function formatCurrency(amount: number, currency = 'UZS'): string {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d.,]/g, '').replace(/,/g, '');
  return Number(cleaned);
}
