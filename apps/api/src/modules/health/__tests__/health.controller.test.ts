import { describe, it, expect } from 'vitest';
import { HealthController } from '../health.controller';

describe('HealthController', () => {
  it('returns ok status with timestamp', () => {
    const ctrl = new HealthController();
    const result = ctrl.check();
    expect(result.status).toBe('ok');
    expect(result.timestamp).toBeTruthy();
    expect(new Date(result.timestamp).getTime()).toBeLessThanOrEqual(Date.now());
  });
});
