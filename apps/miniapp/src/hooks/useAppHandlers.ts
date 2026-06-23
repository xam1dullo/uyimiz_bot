import { Role, Language, FamilyMember, BudgetEntry, Task, Reminder, Birthday } from '../types';
import { TRANSLATIONS, INITIAL_MEMBERS, INITIAL_BUDGET, INITIAL_TASKS, INITIAL_REMINDERS, INITIAL_BIRTHDAYS } from '../data';

export function useAppHandlers({
  lang, setLang,
  simulatedRole, setSimulatedRole,
  familyName: _familyName, setFamilyName,
  members: _members, setMembers,
  budgetEntries, setBudgetEntries,
  tasks, setTasks,
  reminders, setReminders,
  birthdays, setBirthdays,
  setIsOnboarded,
  setAuthScreen,
  setActiveTab,
  setActiveTaskAlarm,
  setNotifiedTaskIds,
  setToastMessage,
  setConfettiBurst,
  currentUser
}: any) {
  
  const t = (TRANSLATIONS[lang as Language] ?? TRANSLATIONS.uz)!;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleResetApp = () => {
    if (confirm(lang === 'uz' ? "App holati va barcha yozuvlar dastlabki holatga qaytariladi. Rozimisiz?" : "Все данные будут сброшены к начальным. Продолжить?")) {
      localStorage.clear();
      setIsOnboarded(false);
      setAuthScreen('login');
      setLang('uz');
      setSimulatedRole('OWNER');
      setFamilyName('🏡 Karimovlar oilasi');
      setMembers(INITIAL_MEMBERS);
      setBudgetEntries(INITIAL_BUDGET);
      setTasks(INITIAL_TASKS);
      setReminders(INITIAL_REMINDERS);
      setBirthdays(INITIAL_BIRTHDAYS);
      setActiveTab(0);
      setActiveTaskAlarm(null);
      setNotifiedTaskIds([]);
      showToast('Dastur qayta sozlandi! 🔄');
    }
  };

  const handleAddBudgetEntry = (newEntry: Omit<BudgetEntry, 'id'>) => {
    const entry: BudgetEntry = {
      ...newEntry,
      id: 'b' + (budgetEntries.length + 1) + Math.floor(Math.random() * 100)
    };
    setBudgetEntries((prev: BudgetEntry[]) => [entry, ...prev]);
    showToast(`💸 ${entry.amount.toLocaleString(lang === 'en' ? 'en-US' : 'uz-UZ')} UZS - ${entry.category} ${t.addedSuccess}`);
  };

  const handleDeleteBudgetEntry = (id: string) => {
    const entry = budgetEntries.find((e: BudgetEntry) => e.id === id);
    if (!entry) return;

    if (simulatedRole === 'OWNER' || entry.addedBy === currentUser.name) {
      setBudgetEntries((prev: BudgetEntry[]) => prev.filter(e => e.id !== id));
      showToast(lang === 'uz' ? "Yozuv muvaffaqiyatli o'chirildi 🗑" : 'Запись успешно удалена 🗑');
    } else {
      showToast(`⚠️ ${t.ownerOnlyMsg}`);
    }
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'status'>) => {
    const task: Task = {
      ...newTask,
      id: 't' + (tasks.length + 1) + Math.floor(Math.random() * 100),
      status: 'NEW'
    };
    setTasks((prev: Task[]) => [task, ...prev]);
    showToast(`✅ "${task.title}" ${t.addedSuccess}`);
  };

  const handleEditTask = (taskId: string, updatedTask: Omit<Task, 'id' | 'status'>) => {
    setTasks((prev: Task[]) => prev.map(tk => {
      if (tk.id === taskId) {
        return { ...tk, ...updatedTask };
      }
      return tk;
    }));
    showToast(lang === 'uz' ? `✏️ "${updatedTask.title}" yangilandi` : `✏️ "${updatedTask.title}" обновлена`);
  };

  const handleCompleteTask = (taskId: string) => {
    const matchedTask = tasks.find((tk: Task) => tk.id === taskId);
    if (!matchedTask) return;

    setTasks((prev: Task[]) => prev.map(tk => {
      if (tk.id === taskId) {
        return { ...tk, status: 'DONE' };
      }
      return tk;
    }));

    setMembers((prev: FamilyMember[]) => prev.map(m => {
      if (m.role === simulatedRole) {
        return { ...m, points: m.points + matchedTask.points };
      }
      return m;
    }));

    setConfettiBurst(true);
    setTimeout(() => setConfettiBurst(false), 1500);
    showToast(`🏅 +${matchedTask.points} ${t.congratsPoints}`);
  };

  const handleAddReminder = (newRem: Omit<Reminder, 'id' | 'isPast'>) => {
    const reminder: Reminder = {
      ...newRem,
      id: 'r' + (reminders.length + 1) + Math.floor(Math.random() * 100)
    };
    setReminders((prev: Reminder[]) => [reminder, ...prev]);
    showToast(`🔔 "${reminder.title}" ${t.addedSuccess}`);
  };

  const handleEditReminder = (id: string, updatedRem: Omit<Reminder, 'id' | 'isPast'>) => {
    setReminders((prev: Reminder[]) => prev.map(rem => {
      if (rem.id === id) {
        return { ...rem, ...updatedRem };
      }
      return rem;
    }));
    showToast(lang === 'uz' ? `🔔 "${updatedRem.title}" yangilandi` : `🔔 "${updatedRem.title}" обновлено`);
  };

  const handleSnoozeReminder = (id: string, minutes: number) => {
    setReminders((prev: Reminder[]) => prev.map(rem => {
      if (rem.id === id) {
        const snoozeCount = (rem.snoozedCount || 0) + 1;
        return {
          ...rem,
          time: lang === 'uz' ? `Keyingi safar, +${minutes}daqiqadan keyin` : `Отложено на +${minutes} мин`,
          snoozedCount: snoozeCount
        };
      }
      return rem;
    }));
    showToast(`⏰ ${minutes} ${t.snoozeAdded}`);
  };

  const handleArchiveReminder = (id: string) => {
    setReminders((prev: Reminder[]) => prev.map(rem => {
      if (rem.id === id) {
        return { ...rem, isPast: true };
      }
      return rem;
    }));
    showToast(lang === 'uz' ? "Eslatma o'qildi va olib tashlandi 📬" : 'Напоминание архивировано 📬');
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev: Reminder[]) => prev.filter(rem => rem.id !== id));
    showToast(lang === 'uz' ? "Eslatma butunlay o'chirildi 🗑" : 'Напоминание успешно удалено 🗑');
  };

  const handleAddBirthday = (newBirth: Omit<Birthday, 'id' | 'daysLeft'>) => {
    const bday: Birthday = {
      ...newBirth,
      id: 'birth' + (birthdays.length + 1) + Math.floor(Math.random() * 100),
      daysLeft: Math.floor(Math.random() * 25) + 2 // simulated random closeness
    };
    setBirthdays((prev: Birthday[]) => [bday, ...prev]);
    showToast(`🍰 "${bday.name}" ${lang === 'uz' ? "tug'ilgan kunlar taqvimiga qo'shildi" : 'добавлен в дни рождения'}`);
  };

  const handleDeleteBirthday = (id: string) => {
    setBirthdays((prev: Birthday[]) => prev.filter(b => b.id !== id));
    showToast(lang === 'uz' ? "Tug'ilgan kun o'chirildi 🗑" : 'Удалено из календаря 🗑');
  };

  const handleLoginComplete = (role: Role, familyNameInput: string, userNameInput: string, customAvatar: string) => {
    setSimulatedRole(role);
    setFamilyName(familyNameInput);

    setMembers((prev: FamilyMember[]) => prev.map((m: FamilyMember) => {
      if (m.role === role) {
        return {
          ...m,
          name: userNameInput,
          avatar: customAvatar,
          isSelf: true
        };
      }
      return { ...m, isSelf: m.role === role };
    }));

    setIsOnboarded(true);
    setActiveTab(0);
    showToast(lang === 'uz' ? 'Tizimga muvaffaqiyatli kirdingiz! 🏡' : 'Вход выполнен успешно! 🏡');
  };

  const handleCompleteOnboarding = (nameOfFamily: string, startRole: Role, _initialMemberId: string) => {
    setFamilyName(nameOfFamily);
    setSimulatedRole(startRole);
    
    setMembers((prev: FamilyMember[]) => prev.map((m: FamilyMember) => {
      if (m.id === '1') {
        const parts = nameOfFamily.split(' ');
        const surnameOnly = parts.length > 1 ? parts[1] : 'Karimova';
        return {
          ...m,
          name: startRole === 'OWNER' ? 'Zilola ' + surnameOnly : m.name,
          role: startRole,
          avatar: startRole === 'OWNER' ? '👩' : '👨'
        };
      }
      return m;
    }));

    setIsOnboarded(true);
    setActiveTab(0);
    showToast(lang === 'uz' ? 'Oila makoniga xush kelibsiz! 🏡' : 'Добро пожаловать в семейное гнездышко! 🏡');
  };

  const handleRemoveMember = (id: string) => {
    if (simulatedRole !== 'OWNER') return;
    setMembers((prev: FamilyMember[]) => prev.filter(m => m.id !== id));
    showToast(lang === 'uz' ? "Oila a'zosi o'chirildi 🗑" : "Член семьи удален 🗑");
  };

  const handleChangeMemberRole = (id: string, newRole: Role) => {
    if (simulatedRole !== 'OWNER') return;
    setMembers((prev: FamilyMember[]) => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    showToast(lang === 'uz' ? "Rol muvaffaqiyatli o'zgartirildi 👤" : "Роль успешно изменена 👤");
  };

  return {
    handleResetApp,
    handleAddBudgetEntry,
    handleDeleteBudgetEntry,
    handleAddTask,
    handleEditTask,
    handleCompleteTask,
    handleAddReminder,
    handleEditReminder,
    handleSnoozeReminder,
    handleArchiveReminder,
    handleDeleteReminder,
    handleAddBirthday,
    handleDeleteBirthday,
    handleLoginComplete,
    handleCompleteOnboarding,
    handleRemoveMember,
    handleChangeMemberRole,
  };
}
