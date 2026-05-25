import { describe, it, expect } from 'vitest';
import { ImportantTaskEntity } from '../important-task.entity';

describe('ImportantTaskEntity', () => {
  it('creates with defaults', () => {
    const t = ImportantTaskEntity.create('f1', 'Buy house', 'u1');
    expect(t.title).toBe('Buy house');
    expect(t.isCompleted).toBe(false);
    expect(t.progress).toBe(0);
    expect(t.priority).toBe('medium');
  });
  it('throws on empty title', () => {
    expect(() => ImportantTaskEntity.create('f1', '', 'u1')).toThrow('IMPORTANT_TASK_TITLE_REQUIRED');
  });
  it('complete() sets isCompleted', () => {
    const t = ImportantTaskEntity.create('f1', 'Test', 'u1');
    t.complete();
    expect(t.isCompleted).toBe(true);
    expect(t.completedAt).toBeInstanceOf(Date);
  });
  it('updateProgress clamps 0-100', () => {
    const t = ImportantTaskEntity.create('f1', 'Test', 'u1');
    t.updateProgress(150);
    expect(t.progress).toBe(100);
    t.updateProgress(-5);
    expect(t.progress).toBe(0);
    t.updateProgress(42);
    expect(t.progress).toBe(42);
  });
});
