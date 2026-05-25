import { describe, it, expect } from 'vitest';
import { MemberEntity } from '../member.entity';

describe('MemberEntity', () => {
  it('creates with default role parent and lang uz', () => {
    const m = MemberEntity.create('tg123', 'Ali', 'f1');
    expect(m.telegramId).toBe('tg123');
    expect(m.name).toBe('Ali');
    expect(m.role).toBe('parent');
    expect(m.lang).toBe('uz');
    expect(m.familyId).toBe('f1');
  });

  it('accepts custom role and lang', () => {
    const m = MemberEntity.create('tg456', 'Vali', 'f1', 'admin', 'ru');
    expect(m.role).toBe('admin');
    expect(m.lang).toBe('ru');
  });

  it('updateRole changes role', () => {
    const m = MemberEntity.create('tg789', 'Gani', 'f1');
    m.updateRole('child');
    expect(m.role).toBe('child');
  });
});
