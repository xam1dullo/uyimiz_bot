import { useState, useEffect } from 'react';
import { 
  Role, Language, Currency, FamilyMember, BudgetEntry, Task, Reminder, Birthday 
} from '../types';
import { 
  INITIAL_MEMBERS, INITIAL_BUDGET, 
  INITIAL_TASKS, INITIAL_REMINDERS, INITIAL_BIRTHDAYS 
} from '../data';

export function useAppState() {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    const val = localStorage.getItem('uy_onboarded');
    return val === 'true';
  });

  const [lang, setLang] = useState<Language>(() => {
    const val = localStorage.getItem('uy_lang');
    return (val as Language) || 'uz';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const val = localStorage.getItem('uy_currency');
    return (val as Currency) || 'UZS';
  });

  const [simulatedRole, setSimulatedRole] = useState<Role>(() => {
    const val = localStorage.getItem('uy_sim_role');
    return (val as Role) || 'OWNER';
  });

  const [familyName, setFamilyName] = useState<string>(() => {
    return localStorage.getItem('uy_family_name') || '🏡 Karimovlar oilasi';
  });

  const [members, setMembers] = useState<FamilyMember[]>(() => {
    const val = localStorage.getItem('uy_members');
    return val ? JSON.parse(val) : INITIAL_MEMBERS;
  });

  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>(() => {
    const val = localStorage.getItem('uy_budget');
    return val ? JSON.parse(val) : INITIAL_BUDGET;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const val = localStorage.getItem('uy_tasks');
    return val ? JSON.parse(val) : INITIAL_TASKS;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const val = localStorage.getItem('uy_reminders');
    return val ? JSON.parse(val) : INITIAL_REMINDERS;
  });

  const [birthdays, setBirthdays] = useState<Birthday[]>(() => {
    const val = localStorage.getItem('uy_birthdays');
    return val ? JSON.parse(val) : INITIAL_BIRTHDAYS;
  });

  // Sync to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('uy_onboarded', String(isOnboarded));
    localStorage.setItem('uy_lang', lang);
    localStorage.setItem('uy_currency', currency);
    localStorage.setItem('uy_sim_role', simulatedRole);
    localStorage.setItem('uy_family_name', familyName);
    localStorage.setItem('uy_members', JSON.stringify(members));
    localStorage.setItem('uy_budget', JSON.stringify(budgetEntries));
    localStorage.setItem('uy_tasks', JSON.stringify(tasks));
    localStorage.setItem('uy_reminders', JSON.stringify(reminders));
    localStorage.setItem('uy_birthdays', JSON.stringify(birthdays));
  }, [isOnboarded, lang, currency, simulatedRole, familyName, members, budgetEntries, tasks, reminders, birthdays]);

  return {
    isOnboarded, setIsOnboarded,
    lang, setLang,
    currency, setCurrency,
    simulatedRole, setSimulatedRole,
    familyName, setFamilyName,
    members, setMembers,
    budgetEntries, setBudgetEntries,
    tasks, setTasks,
    reminders, setReminders,
    birthdays, setBirthdays
  };
}
