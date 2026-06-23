import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { TranslationSet, FamilyMember, BudgetEntry, Task, Reminder, Birthday, Role, Language } from '../types';
import { Plus, ChevronRight, DollarSign, Calendar, Bell, Trophy, Check, CreditCard, GripHorizontal, Edit3, Target, Search, X, ChevronUp, ChevronDown } from 'lucide-react';

interface DashboardProps {
  t: TranslationSet;
  lang: Language;
  currency?: string;
  userName: string;
  familyName: string;
  role: Role;
  members: FamilyMember[];
  budgetEntries: BudgetEntry[];
  tasks: Task[];
  reminders: Reminder[];
  birthdays: Birthday[];
  onSetTab: (tabIndex: number) => void;
  onCompleteTask: (taskId: string) => void;
  onOpenFABAction: (actionType: 'expense' | 'task' | 'reminder') => void;
}

export default function Dashboard({
  t,
  lang,
  currency = 'UZS',
  userName,
  familyName,
  role,
  members,
  budgetEntries,
  tasks,
  reminders,
  birthdays,
  onSetTab,
  onCompleteTask,
  onOpenFABAction
}: DashboardProps) {
  const [showFABMenu, setShowFABMenu] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Default block rendering order
  const defaultOrder = ['header', 'goals', 'budget', 'tasks', 'reminder', 'birthday', 'leaderboard'];
  const [blockOrder, setBlockOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('uy_dashboard_order');
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        const currentSet = new Set(parsed);
        defaultOrder.forEach(item => {
          if (!currentSet.has(item)) parsed.push(item);
        });
        return parsed;
      }
    } catch(e) {}
    return defaultOrder;
  });

  useEffect(() => {
    localStorage.setItem('uy_dashboard_order', JSON.stringify(blockOrder));
  }, [blockOrder]);

  const handleOrderChange = (newOrder: string[]) => {
    setBlockOrder(newOrder);
  };

  const moveBlock = (item: string, direction: 'up' | 'down') => {
    const index = blockOrder.indexOf(item);
    if (index === -1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 1 || newIndex >= blockOrder.length) return; // Prevent swapping with header (index 0)

    const newOrder = [...blockOrder];
    const temp = newOrder[index]!;
    newOrder[index] = newOrder[newIndex]!;
    newOrder[newIndex] = temp;
    setBlockOrder(newOrder);
  };

  // 1. Get greeting message depending on hour
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs >= 5 && hrs < 12) return t.greetingMorning;
    if (hrs >= 12 && hrs < 18) return t.greetingAfternoon;
    return t.greetingEvening;
  };

  // 2. Budget calculation (Total income/expense for current month based on preset)
  const incomeEntries = budgetEntries.filter(e => e.type === 'INCOME');
  const expenseEntries = budgetEntries.filter(e => e.type === 'EXPENSE');

  const totalIncome = incomeEntries.reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = expenseEntries.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const formatCurrency = (val: number) => {
    return val.toLocaleString('uz-UZ') + ' ' + currency;
  };

  // 3. Tasks filter
  // - Child role: only tasks assigned to child or all, and status not DONE
  // - Others: both assigned to self or family-wide tasks, status not DONE
  const allAssignedTasks = tasks.filter(task => {
    if (role === 'CHILD') {
      return task.assignedTo === '3' || task.assignedTo === '4';
    }
    return true;
  });
  const activeTasks = allAssignedTasks.filter(task => task.status !== 'DONE');
  const completedTasksCount = allAssignedTasks.filter(task => task.status === 'DONE').length;
  const totalTasksCount = allAssignedTasks.length;
  const goalPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const displayTasks = activeTasks.slice(0, isTasksExpanded ? 6 : 3);

  // 4. Closest reminder
  const closestReminder = reminders.find(r => !r.isPast);

  // 5. Closest birthday
  const closestBirthday = birthdays.length > 0 ? birthdays.reduce((min, b) => b.daysLeft < min.daysLeft ? b : min, birthdays[0]!) : null;

  // 6. Mini Leaderboard items (Sort descending by points, show top 2)
  const leaderboardList = [...members].sort((a, b) => b.points - a.points).slice(0, 2);

  // 7. Global Search Query matching
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const matchedTasks = trimmedQuery ? tasks.filter(task => 
    task.title.toLowerCase().includes(trimmedQuery) || 
    task.category.toLowerCase().includes(trimmedQuery)
  ) : [];

  const matchedBudget = trimmedQuery && role !== 'CHILD' ? budgetEntries.filter(b => 
    b.category.toLowerCase().includes(trimmedQuery) || 
    (b.note && b.note.toLowerCase().includes(trimmedQuery))
  ) : [];

  const matchedReminders = trimmedQuery && role !== 'CHILD' ? reminders.filter(r => 
    r.title.toLowerCase().includes(trimmedQuery) || 
    (r.note && r.note.toLowerCase().includes(trimmedQuery))
  ) : [];

  const hasAnyResults = matchedTasks.length > 0 || matchedBudget.length > 0 || matchedReminders.length > 0;

  const blocksMap: Partial<Record<string, React.ReactNode>> = {
    header: (
      <div
        key="header"
        id="dash-header-block"
        className="flex flex-col gap-2 mt-2 bg-gradient-to-br from-slate-900/80 to-slate-900/30 p-3 rounded-[32px] border border-slate-800/50 shadow-lg relative overflow-hidden backdrop-blur-sm"
      >
        <div className="flex items-center justify-between relative z-10">
          <span className="text-sm font-medium text-slate-400 capitalize flex items-center gap-1.5 tracking-tight font-sans">
            ✨ {getGreeting()},
          </span>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`text-xs px-4 py-2 rounded-full font-bold flex items-center gap-1.5 transition-all relative z-50 shadow-sm ${
              isEditMode ? 'bg-emerald-500 text-slate-950 font-extrabold scale-105' : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/40 hover:bg-slate-850'
            }`}
          >
            {isEditMode ? <Check size={13} strokeWidth={3} /> : <Edit3 size={13} />}
            {isEditMode ? (lang === 'uz' ? 'Saqlash' : 'Done') : (lang === 'uz' ? 'Tartiblash' : 'Edit Layout')}
          </button>
        </div>
        <h2 id="welcome-username" className="text-4xl font-black text-white tracking-tight leading-none mt-1 font-display">
          {userName}
        </h2>
        
        {/* Global Search Bar */}
        <div className="relative mt-4">
          <div
            className={`flex items-center gap-3 h-[46px] px-4 rounded-[16px] transition-all duration-300 ${
              searchQuery.length > 0 
                ? 'bg-slate-800/80 border-[1.5px] border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.05)]' 
                : 'bg-slate-900 border-[1.5px] border-slate-700/40 hover:border-slate-600/50'
            }`}
          >
            <Search 
              size={18} 
              className={`shrink-0 transition-colors duration-300 ${
                searchQuery.length > 0 ? 'text-emerald-400' : 'text-slate-500'
              }`} 
            />
            <input
              type="text"
              inputMode="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur();
              }}
              className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-slate-100 placeholder:text-slate-500/80 caret-emerald-400 placeholder:font-medium"
              placeholder={lang === 'uz' ? "Qidiruv (vazifa, xarajat, eslatma)..." : "Поиск (задача, расход, заметка)..."}
            />
            {searchQuery.length > 0 && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-6 h-6 rounded-full bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors animate-in fade-in"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {searchQuery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.15 } }}
                className="absolute top-full left-0 right-0 z-50 mt-2 bg-slate-900/95 backdrop-blur-xl rounded-[20px] border border-slate-700/50 shadow-2xl shadow-black/50 overflow-hidden"
              >
                {!hasAnyResults ? (
                  <div className="p-8 text-center text-sm text-slate-500 flex flex-col items-center gap-3">
                    <Search size={28} className="text-slate-600/50 mb-1" />
                    <span className="font-medium">{lang === 'uz' ? 'Natija topilmadi' : 'Ничего не найдено'}</span>
                  </div>
                ) : (
                  <div className="max-h-[340px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {[
                      ...matchedTasks.map(t => ({ id: `t-${t.id}`, label: t.title, typeText: lang === 'uz' ? 'Vazifa' : 'Задача', icon: '✅', onClick: () => { onSetTab(role === 'CHILD' ? 1 : 2); setSearchQuery(''); } })),
                      ...matchedBudget.map(b => ({ id: `b-${b.id}`, label: b.note || b.category, typeText: lang === 'uz' ? 'Xarajat' : 'Расход', icon: '💸', onClick: () => { onSetTab(1); setSearchQuery(''); } })),
                      ...matchedReminders.map(r => ({ id: `r-${r.id}`, label: r.title, typeText: lang === 'uz' ? 'Eslatma' : 'Заметка', icon: '🔔', onClick: () => { onSetTab(3); setSearchQuery(''); } }))
                    ].map(item => (
                      <div
                        key={item.id}
                        onClick={item.onClick}
                        className="flex items-center gap-3 p-3 rounded-[14px] cursor-pointer transition-all active:scale-[0.98] hover:bg-slate-800/60 group"
                      >
                        <div className="w-11 h-11 rounded-[12px] bg-slate-800/80 flex items-center justify-center text-xl shrink-0 group-hover:bg-slate-800 transition-colors border border-slate-700/30 shadow-sm">
                            {item.icon}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="text-[15px] font-bold text-slate-200 truncate pr-2 tracking-tight">
                            {item.label.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')).map((part, i) => 
                              part.toLowerCase() === searchQuery.trim().toLowerCase() ? 
                                <span key={i} className="text-emerald-400 font-extrabold">{part}</span> : 
                                <span key={i}>{part}</span>
                            )}
                          </div>
                          <div className="text-[12px] text-slate-500 font-medium tracking-wide mt-0.5 uppercase">
                            {item.typeText}
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/50 text-xs text-slate-400 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-subtle"></span>
          <span className="font-bold text-slate-200">{familyName}</span>
          <span className="text-slate-705">•</span>
          <span>{members.length} {t.membersCount}</span>
        </div>
      </div>
    ),
    goals: (
      <div
        key="goals"
        id="dash-goals-widget"
        className="bg-slate-900/70 border border-slate-800/40 rounded-[28px] p-5 flex flex-col gap-4 my-1 shadow-sm"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-400 flex items-center gap-1.5 font-sans">
            <Target size={14} className="text-emerald-400" /> {lang === 'uz' ? 'KUNLIK MAQSAD' : 'DAILY GOALS'}
          </h3>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">{goalPercentage}%</span>
        </div>
        
        <div className="flex flex-col gap-3 mt-1">
          <div className="flex justify-between items-end">
            <span className="text-slate-200 text-sm font-semibold leading-tight">
              {lang === 'uz' ? 'Bugun bajarilgan vazifalar' : 'Tasks completed today'}
            </span>
            <div className="text-right flex items-baseline">
              <span className="text-2xl font-black text-emerald-400 leading-none font-display">{completedTasksCount}</span>
              <span className="text-slate-500 font-bold text-xs uppercase ml-1">/ {totalTasksCount}</span>
            </div>
          </div>
          
          <div className="h-4 w-full bg-slate-800/60 rounded-full overflow-hidden shadow-inner mt-1">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${goalPercentage}%` }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            />
          </div>
        </div>
      </div>
    ),
    budget: role !== 'CHILD' ? (
      <div
        key="budget"
        id="dash-balance-card"
        className="bg-slate-900/80 border border-slate-800/40 p-3 rounded-[32px] shadow-xl relative overflow-hidden h-full"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex justify-between items-center mb-4">
          <span id="txt-month-lbl" className="text-xs font-semibold tracking-widest uppercase text-slate-400 flex items-center gap-1.5 font-sans">
            <CreditCard size={14} className="text-emerald-400" /> {t.thisMonth}
          </span>
          <button
            id="lnk-view-report"
            onClick={() => onSetTab(1)}
            className="text-xs text-slate-400 hover:text-emerald-400 font-bold transition-all flex items-center gap-0.5"
          >
            {t.viewReport}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center pt-1">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-1.5">{t.income}</span>
            <span id="val-dash-income" className="text-xl font-bold tabular-nums text-emerald-400 break-all font-display">{formatCurrency(totalIncome).split(' ')[0]} <span className="text-[10px] block text-emerald-500/95 font-bold uppercase tracking-wider">{currency}</span></span>
          </div>
          <div className="border-x border-slate-800/40 flex flex-col items-center">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-1.5">{t.expense}</span>
            <span id="val-dash-expense" className="text-xl font-bold tabular-nums text-rose-400 break-all font-display">{formatCurrency(totalExpense).split(' ')[0]} <span className="text-[10px] block text-rose-500/95 font-bold uppercase tracking-wider">{currency}</span></span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-1.5">{t.balance}</span>
            <span id="val-dash-balance" className={`text-xl font-bold tabular-nums break-all font-display ${netBalance >= 0 ? 'text-white' : 'text-red-500'}`}>
              {formatCurrency(netBalance).split(' ')[0]} <span className="text-[10px] block text-slate-400/90 font-bold uppercase tracking-wider">{currency}</span>
            </span>
          </div>
        </div>
      </div>
    ) : null,
    tasks: (
      <motion.div
        layout
        key="tasks"
        id="dash-tasks-widget"
        className="bg-slate-900/50 border border-slate-800/40 rounded-[32px] p-3 flex flex-col gap-4 h-full transition-all duration-300 shadow-md"
      >
        <div 
          className="flex justify-between items-center cursor-pointer group"
          onClick={() => {
            if (activeTasks.length > 3) setIsTasksExpanded(!isTasksExpanded);
          }}
        >
          <div className="flex items-center gap-2">
            <h3 id="lbl-dash-tasks" className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5 transition-colors group-hover:text-emerald-400">
              <Check size={16} className="text-emerald-400" /> {t.tasksWidgetTitle}
            </h3>
            {activeTasks.length > 3 && (
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-extrabold">
                {activeTasks.length} {t.all} 
              </span>
            )}
          </div>
          <button
            id="lnk-all-tasks"
            onClick={(e) => {
              e.stopPropagation();
              onSetTab(role === 'CHILD' ? 1 : 2);
            }}
            className="text-xs text-slate-300 hover:text-emerald-400 font-bold flex items-center bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-xl transition-all border border-slate-700/20"
          >
            {tasks.filter(t => t.status !== 'DONE').length} {t.tabNew.toLowerCase()} <ChevronRight size={14} />
          </button>
        </div>
        <motion.div layout className="flex flex-col gap-2.5 relative overflow-hidden transition-all duration-3001">
          {displayTasks.length === 0 ? (
            <p id="txt-no-tasks" className="text-xs text-slate-500 text-center py-4 italic font-medium">
              {t.noTasksToday}
            </p>
          ) : (
            displayTasks.map(task => {
              const assignedUser = members.find(m => m.id === task.assignedTo);
              return (
                <div
                  key={task.id}
                  id={`widget-task-card-${task.id}`}
                  className="bg-slate-900/70 border border-slate-800/40 p-3 rounded-[22px] flex items-center justify-between gap-4 hover:border-emerald-500/30 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="w-11 h-11 bg-slate-800/85 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 leading-none">
                      {task.category}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-100 truncate pr-1">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1">
                        <span className="truncate bg-slate-800/40 px-1.5 py-0.5 rounded text-[10px] text-slate-300">{assignedUser ? assignedUser.name : 'All'}</span>
                        <span>•</span>
                        <span className="text-emerald-400/90 font-bold">{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    id={`btn-complete-task-dash-${task.id}`}
                    onClick={() => onCompleteTask(task.id)}
                    className="bg-emerald-500/10 hover:bg-emerald-500/25 active:scale-95 text-emerald-400 px-3.5 py-2 rounded-2xl font-extrabold text-xs flex items-center gap-1 transition-all shrink-0 relative z-20"
                  >
                    ⭐ {task.points}b
                  </button>
                </div>
              );
            })
          )}
        </motion.div>
      </motion.div>
    ),
    reminder: role !== 'CHILD' ? (
      <div
        key="reminder"
        id="dash-reminder-block"
        className="bg-slate-900/50 border border-slate-800/40 rounded-[32px] p-3 flex flex-col gap-4 h-full shadow-md"
      >
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
          <Bell size={14} className="text-violet-400" /> {t.upcomingReminder}
        </h3>
        {closestReminder ? (
          <div id="closest-reminder-card" className="bg-slate-900/70 border border-slate-800/40 p-3 rounded-[22px] flex flex-col gap-2.5 shadow-sm">
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider bg-violet-500/10 py-1 px-2.5 rounded-xl">
                🔔 {closestReminder.time}
              </span>
              <button
                id="lnk-reminders-all"
                onClick={() => onSetTab(3)}
                className="text-xs text-slate-400 hover:text-emerald-400 font-bold transition-all"
              >
                {t.all}
              </button>
            </div>
            <p id="txt-reminder-title" className="text-sm font-bold text-slate-100 leading-tight">
              "{closestReminder.title}"
            </p>
            {closestReminder.note && (
              <p className="text-xs text-slate-400 font-medium">
                📝 {closestReminder.note}
              </p>
            )}
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              👤 For: {closestReminder.assignedTo === 'all' ? 'All Family' : (members.find(m => m.id === closestReminder.assignedTo)?.name || 'Me')}
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4 italic font-medium">
            {t.noRemindersToday}
          </p>
        )}
      </div>
    ) : null,
    birthday: (
      <div
        key="birthday"
        id="dash-birthday-block"
        className="bg-slate-900/50 border border-slate-800/40 rounded-[32px] p-3 flex flex-col gap-4 h-full shadow-md"
      >
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
          <span className="text-rose-400">🎂</span> {t.upcomingBirthday}
        </h3>
        {closestBirthday ? (
          <div id="closest-birthday-card" className="bg-slate-900/70 border border-slate-800/40 p-3 rounded-[22px] flex flex-col gap-2.5 shadow-sm animate-pulse-subtle">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider bg-rose-500/10 py-1 px-3 rounded-xl self-start">
              🎉 {closestBirthday.daysLeft} {t.daysLeftText}
            </span>
            <p id="txt-birthday-person" className="text-sm font-bold text-slate-100 leading-tight">
              {closestBirthday.name}
            </p>
            <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
              <span>{closestBirthday.date} · {closestBirthday.age} {t.yearsOldText}</span>
              <span className="text-slate-305 uppercase text-[10px] bg-slate-800/80 px-2.5 py-1 rounded-lg font-bold">
                {closestBirthday.relationship}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4 italic font-medium">
            {lang === 'uz' ? "Yaqin orada tug'ilgan kun yo'q" : 'В ближайшее время дней рождения нет'}
          </p>
        )}
      </div>
    ),
    leaderboard: (
      <div
        key="leaderboard"
        id="dash-leaderboard-widget"
        className="bg-slate-900/50 border border-slate-800/40 rounded-[32px] p-3 flex flex-col gap-4 my-1 h-full shadow-md"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
            <Trophy size={14} className="text-amber-400" /> {t.weeklyLeaderboard}
          </h3>
          <button
            id="lnk-view-leaderboard"
            onClick={() => onSetTab(role === 'CHILD' ? 2 : 4)}
            className="text-xs text-slate-400 hover:text-amber-400 font-bold transition-all flex items-center"
          >
            {t.viewFullRating}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {leaderboardList.map((m, index) => (
            <div
              key={m.id}
              className="bg-slate-900/70 border border-slate-800/40 p-3 rounded-[22px] flex items-center justify-between gap-2.5 shadow-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg shadow-inner ${index === 0 ? 'bg-amber-500/10' : 'bg-slate-850'}`}>
                  {index === 0 ? '🥇' : '🥈'}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-100 truncate">{m.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-400 font-extrabold">{m.role === 'OWNER' ? '👑 Egasi' : m.role === 'CHILD' ? '👦 Bola' : "👤 A'zo"}</p>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-amber-400">{m.points}b</span>
            </div>
          ))}
        </div>
      </div>
    )
  };

  return (
    <div id="dashboard_view" className="flex flex-col px-3 pt-2 pb-32 overflow-y-auto h-full bg-slate-950 text-slate-100 relative">
      
      <Reorder.Group 
        axis="y" 
        values={blockOrder} 
        onReorder={handleOrderChange} 
        className="flex flex-col gap-2.5 list-none m-0 p-0"
      >
        <AnimatePresence>
          {blockOrder.map((item) => {
            const content = blocksMap[item];
            if (!content) return null;
            
            return (
              <Reorder.Item
                key={item}
                value={item}
                dragListener={isEditMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={`relative outline-none ${isEditMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
                whileDrag={{ scale: 1.02, zIndex: 50 }}
              >
                {/* Edit Mode Overlay and Handle */}
                <AnimatePresence>
                  {isEditMode && item !== 'header' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute -top-4 right-4 flex items-center gap-2 p-1.5 px-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 z-50 shadow-2xl backdrop-blur-md select-none"
                    >
                      {/* Move block Up */}
                      <button
                        title={lang === 'uz' ? "Tepaga ko'chirish" : "Переместить вверх"}
                        disabled={blockOrder.indexOf(item) <= 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          moveBlock(item, 'up');
                        }}
                        className={`hover:text-emerald-400 p-1 rounded-full transition-all active:scale-90 ${
                          blockOrder.indexOf(item) <= 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-800'
                        }`}
                      >
                        <ChevronUp size={15} className="stroke-[2.5px]" />
                      </button>

                      {/* Divider */}
                      <span className="text-slate-800 text-xs">|</span>

                      {/* Drag handle */}
                      <div 
                        className="text-slate-500 hover:text-slate-300 p-1 flex items-center justify-center cursor-grab active:cursor-grabbing" 
                        title="Drag to reorder"
                      >
                        <GripHorizontal size={14} />
                      </div>

                      {/* Divider */}
                      <span className="text-slate-800 text-xs">|</span>

                      {/* Move block Down */}
                      <button
                        title={lang === 'uz' ? "Pastga ko'chirish" : "Переместить вниз"}
                        disabled={blockOrder.indexOf(item) === blockOrder.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          moveBlock(item, 'down');
                        }}
                        className={`hover:text-emerald-400 p-1 rounded-full transition-all active:scale-90 ${
                          blockOrder.indexOf(item) === blockOrder.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-800'
                        }`}
                      >
                        <ChevronDown size={15} className="stroke-[2.5px]" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className={`transition-all duration-300 w-full ${isEditMode && item !== 'header' ? 'opacity-70 pointer-events-none scale-[0.98]' : ''}`}>
                  {content}
                </div>
              </Reorder.Item>
            );
          })}
        </AnimatePresence>
      </Reorder.Group>

      {/* 6. Floating Action Button Menu (Premium TMA Style, Draggable) */}
      <motion.div 
        drag 
        dragConstraints={{ left: -300, right: 0, top: -600, bottom: 0 }} 
        className="fixed bottom-[88px] right-3 z-50 flex flex-col items-end gap-3 cursor-grab"
      >
        <AnimatePresence>
          {showFABMenu && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 10, scale: 0.9, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex flex-col items-end gap-3 mb-2"
              id="fab-actions-menu"
            >
              {role !== 'CHILD' && (
                <button
                  id="fab-action-expense"
                  onClick={() => {
                    onOpenFABAction('expense');
                    setShowFABMenu(false);
                  }}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-white/10 font-bold px-4 py-3 gap-3 rounded-[20px] text-white flex items-center text-sm shadow-[0_8px_32px_rgba(0,0,0,0.12)] transform active:scale-95 transition-all"
                >
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-white/10">
                    <span className="text-xl leading-none">💸</span> 
                  </div>
                  <span className="tracking-wide">{t.addExpenseAction}</span>
                </button>
              )}
              
              <button
                id="fab-action-task"
                onClick={() => {
                  onOpenFABAction('task');
                  setShowFABMenu(false);
                }}
                className="bg-slate-900/80 hover:bg-slate-900 border border-white/10 font-bold px-4 py-3 gap-3 rounded-[20px] text-white flex items-center text-sm shadow-[0_8px_32px_rgba(0,0,0,0.12)] transform active:scale-95 transition-all"
              >
                <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-white/10">
                  <span className="text-xl leading-none">✅</span>
                </div>
                <span className="tracking-wide">{t.addTaskAction}</span>
              </button>

              {role !== 'CHILD' && (
                <button
                  id="fab-action-reminder"
                  onClick={() => {
                    onOpenFABAction('reminder');
                    setShowFABMenu(false);
                  }}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-white/10 font-bold px-4 py-3 gap-3 rounded-[20px] text-white flex items-center text-sm shadow-[0_8px_32px_rgba(0,0,0,0.12)] transform active:scale-95 transition-all"
                >
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-white/10">
                    <span className="text-xl leading-none">🔔</span>
                  </div>
                  <span className="tracking-wide">{t.addReminderAction}</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          id="btn-fast-fab"
          onClick={() => setShowFABMenu(prev => !prev)}
          className={`w-14 h-14 rounded-[20px] flex items-center justify-center shadow-[0_16px_32px_rgba(212,77,41,0.2)] transition-all duration-300 active:scale-90 relative overflow-hidden ${
            showFABMenu ? 'bg-slate-800 text-slate-300 border border-slate-700/50 rotate-45 rounded-[16px]' : 'bg-emerald-500 text-white border border-white/10'
          }`}
          title={t.fastActions}
        >
          {/* Glass reflect */}
          {!showFABMenu && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>}
          <Plus size={26} className="font-bold stroke-[3px]" />
        </button>
      </motion.div>

    </div>
  );
}
