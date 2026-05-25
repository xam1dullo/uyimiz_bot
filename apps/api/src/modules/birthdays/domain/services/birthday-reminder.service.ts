import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BirthdayReminderService {
  private readonly logger = new Logger(BirthdayReminderService.name);

  /** Calculate which notify days trigger today. Leap-year safe. */
  getNotificationDays(birthDate: string, notifyDays: number[] = [7, 3, 1]): number[] {
    const today = new Date();
    const birth = this.parseDate(birthDate, today.getFullYear());
    let daysUntil = this.daysBetween(today, birth);
    
    if (daysUntil < 0) {
      const nextBirth = this.parseDate(birthDate, today.getFullYear() + 1);
      daysUntil = this.daysBetween(today, nextBirth);
    }
    
    return notifyDays.filter((d) => daysUntil === d);
  }

  /** Feb 29 → Feb 28 in non-leap years */
  private parseDate(dateStr: string, year: number): Date {
    const [month, day] = dateStr.split('-').map(Number);
    const m = month ?? 1;
    const d = day ?? 1;
    if (m === 2 && d === 29 && !this.isLeap(year)) return new Date(year, 1, 28);
    return new Date(year, m - 1, d);
  }

  private isLeap(y: number): boolean { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  private daysBetween(a: Date, b: Date): number { return Math.ceil((b.getTime() - a.getTime()) / 86400000); }
}
