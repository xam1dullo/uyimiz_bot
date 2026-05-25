import { describe, it, expect } from 'vitest';
import { HealthController } from '../health.controller';

describe('HealthController', () => {
  const ctrl = new HealthController();
  
  it('GET /api/health → 200 ok', () => {
    const res = ctrl.check();
    expect(res.status).toBe('ok');
    expect(res.timestamp).toBeTruthy();
  });
});
