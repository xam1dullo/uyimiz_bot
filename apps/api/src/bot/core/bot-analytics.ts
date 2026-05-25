import { Injectable, Logger } from '@nestjs/common';

interface AnalyticsEvent {
  userId: string;
  event: string;
  timestamp: number;
  metadata?: Record<string, string>;
}

@Injectable()
export class BotAnalytics {
  private readonly logger = new Logger(BotAnalytics.name);
  private events: AnalyticsEvent[] = [];

  track(userId: string, event: string, metadata?: Record<string, string>): void {
    this.events.push({
      userId, event,
      timestamp: Date.now(),
      metadata,
    });

    // Keep last 1000 events max
    if (this.events.length > 1000) {
      this.events = this.events.slice(-500);
    }

    this.logger.debug(`📊 ${event} | user: ${userId}`);
  }

  getStats(): { totalUsers: number; topEvents: Array<{ event: string; count: number }> } {
    const uniqueUsers = new Set(this.events.map(e => e.userId));
    const counts: Record<string, number> = {};
    for (const e of this.events) {
      counts[e.event] = (counts[e.event] ?? 0) + 1;
    }
    return {
      totalUsers: uniqueUsers.size,
      topEvents: Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([event, count]) => ({ event, count })),
    };
  }
}
