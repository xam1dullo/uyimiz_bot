import { describe, it, expect, beforeAll } from 'vitest';
import { JwtService } from '../jwt.service';

describe('JwtService', () => {
  let jwt: JwtService;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-min-32-chars-long!!';
    jwt = new JwtService();
  });

  it('signs and verifies a token', () => {
    const token = jwt.sign({ sub: 'u1', telegramId: 'tg123' });
    expect(token).toBeTruthy();
    const payload = jwt.verify(token);
    expect(payload).toBeTruthy();
    expect(payload!.sub).toBe('u1');
    expect(payload!.telegramId).toBe('tg123');
  });

  it('includes familyId and role', () => {
    const token = jwt.sign({ sub: 'u2', telegramId: 'tg456', familyId: 'f1', role: 'admin' });
    const payload = jwt.verify(token);
    expect(payload!.familyId).toBe('f1');
    expect(payload!.role).toBe('admin');
  });

  it('returns null for invalid token', () => {
    expect(jwt.verify('invalid.token.here')).toBeNull();
    expect(jwt.verify('')).toBeNull();
  });

  it('returns null for expired token', () => {
    const token = jwt.sign({ sub: 'u1', telegramId: 'tg' }, -1); // expired immediately
    expect(jwt.verify(token)).toBeNull();
  });

  it('returns null for tampered token', () => {
    const token = jwt.sign({ sub: 'u1', telegramId: 'tg123' });
    const tampered = token.slice(0, -5) + 'xxxxx';
    expect(jwt.verify(tampered)).toBeNull();
  });
});
