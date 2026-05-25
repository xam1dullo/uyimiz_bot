import { describe, it, expect } from 'vitest';
import { TaskEntity } from '../task.entity';

describe('TaskEntity', () => {
  const validParams = {
    familyId: 'f1', title: 'Clean room', createdBy: 'u1',
  };

  describe('create', () => {
    it('creates task with pending status', () => {
      const task = TaskEntity.create(validParams);
      expect(task.status).toBe('pending');
      expect(task.id).toBeTruthy();
      expect(task.points).toBe(0);
      expect(task.repeat).toBe('none');
      expect(task.assignedTo).toBeNull();
      expect(task.description).toBeNull();
    });

    it('throws on empty title', () => {
      expect(() => TaskEntity.create({ ...validParams, title: '' }))
        .toThrow('TASK_TITLE_REQUIRED');
    });

    it('throws on whitespace-only title', () => {
      expect(() => TaskEntity.create({ ...validParams, title: '   ' }))
        .toThrow('TASK_TITLE_REQUIRED');
    });

    it('accepts optional fields', () => {
      const task = TaskEntity.create({
        ...validParams,
        priority: 'high',
        points: 10,
        assignedTo: 'u2',
        description: 'Use vacuum',
      });
      expect(task.priority).toBe('high');
      expect(task.points).toBe(10);
      expect(task.assignedTo).toBe('u2');
      expect(task.description).toBe('Use vacuum');
    });
  });

  describe('complete', () => {
    it('marks task as completed with timestamp', () => {
      const task = TaskEntity.create(validParams);
      task.complete();
      expect(task.status).toBe('completed');
      expect(task.completedAt).toBeInstanceOf(Date);
      expect(task.completedAt!.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('start', () => {
    it('marks task as in_progress', () => {
      const task = TaskEntity.create(validParams);
      task.start();
      expect(task.status).toBe('in_progress');
    });
  });

  describe('cancel', () => {
    it('marks task as cancelled', () => {
      const task = TaskEntity.create(validParams);
      task.cancel();
      expect(task.status).toBe('cancelled');
    });
  });

  describe('updateTitle', () => {
    it('updates title and updatedAt', () => {
      const task = TaskEntity.create(validParams);
      const prev = task.updatedAt;
      task.updateTitle('New title');
      expect(task.title).toBe('New title');
      expect(task.updatedAt.getTime()).toBeGreaterThanOrEqual(prev.getTime());
    });

    it('throws on empty title', () => {
      const task = TaskEntity.create(validParams);
      expect(() => task.updateTitle('')).toThrow('TASK_TITLE_REQUIRED');
    });
  });

  describe('immutable fields', () => {
    it('id, familyId, createdBy never change', () => {
      const task = TaskEntity.create(validParams);
      // TypeScript readonly — compile-time protection
      expect(task.id).toBeTruthy();
      expect(task.familyId).toBe('f1');
      expect(task.createdBy).toBe('u1');
    });
  });
});
