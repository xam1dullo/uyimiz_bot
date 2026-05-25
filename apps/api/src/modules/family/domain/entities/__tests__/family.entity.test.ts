import { describe, it, expect } from 'vitest';
import { FamilyEntity } from '../family.entity';

describe('FamilyEntity', () => {
  it('creates with name and auto-generated code', () => {
    const f = FamilyEntity.create('My Family', 'ABC123');
    expect(f.id).toBeTruthy();
    expect(f.name).toBe('My Family');
    expect(f.code).toBe('ABC123');
    expect(f.createdAt).toBeInstanceOf(Date);
  });

  it('updateName changes name and updatedAt', () => {
    const f = FamilyEntity.create('Old', 'X');
    const prev = f.updatedAt;
    f.updateName('New');
    expect(f.name).toBe('New');
    expect(f.updatedAt.getTime()).toBeGreaterThanOrEqual(prev.getTime());
  });
});
