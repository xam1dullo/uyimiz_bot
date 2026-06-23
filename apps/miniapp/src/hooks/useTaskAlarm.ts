import { useState, useEffect } from 'react';
import { Task, FamilyMember } from '../types';

export function useTaskAlarm(
  isOnboarded: boolean, 
  timeClock: string, 
  tasks: Task[], 
  simulatedRole: string, 
  currentUser: FamilyMember
) {
  const [activeTaskAlarm, setActiveTaskAlarm] = useState<Task | null>(null);
  const [notifiedTaskIds, setNotifiedTaskIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isOnboarded) return;
    
    const overdueTasks = tasks.filter(task => {
      if (task.status === 'DONE') return false;
      const isAssignedToMe = task.assignedTo === currentUser.id || task.assignedTo === 'all';
      if (!isAssignedToMe) return false;
      
      // Prevent key double trigger
      if (notifiedTaskIds.includes(task.id)) return false;
      
      const timeMatch = task.dueDate.match(/(\d{2}):(\d{2})/);
      if (!timeMatch) return false;
      
      const [_, hr, mn] = timeMatch;
      const taskTimeStr = `${hr}:${mn}`;
      
      const isToday = task.dueDate.toLowerCase().includes('bugun') || 
                      task.dueDate.toLowerCase().includes('today') ||
                      task.dueDate.toLowerCase().includes('hozir') ||
                      task.dueDate.toLowerCase().includes('сейчас') ||
                      task.dueDate.toLowerCase().includes('сегодня');
      
      return isToday && taskTimeStr === timeClock;
    });

    if (overdueTasks.length > 0) {
      const topTask = overdueTasks[0];
      if (!topTask) return;
      // Set active task alarm and register it to notified queue
      setActiveTaskAlarm(topTask);
      setNotifiedTaskIds(prev => [...prev, topTask.id]);
    }
  }, [timeClock, tasks, simulatedRole, isOnboarded, notifiedTaskIds, currentUser.id]);

  return { activeTaskAlarm, setActiveTaskAlarm, notifiedTaskIds, setNotifiedTaskIds };
}
