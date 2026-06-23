import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TranslationSet, Task, TaskStatus, FamilyMember, Role, Language } from '../types';
import { Plus, Check, ChevronDown, Award, Calendar, RotateCcw, User, Tag, X, Edit3 } from 'lucide-react';

interface TasksModuleProps {
  t: TranslationSet;
  role: Role;
  lang: Language;
  members: FamilyMember[];
  tasks: Task[];
  currentUser: FamilyMember;
  onAddTask: (task: Omit<Task, 'id' | 'status'>) => void;
  onEditTask?: (taskId: string, task: Omit<Task, 'id' | 'status'>) => void;
  onCompleteTask: (taskId: string) => void;
  isAddSheetOpenInitially?: boolean;
  onCloseAddSheetInitially?: () => void;
}

export default function TasksModule({
  t,
  role,
  lang,
  members,
  tasks,
  currentUser,
  onAddTask,
  onEditTask,
  onCompleteTask,
  isAddSheetOpenInitially = false,
  onCloseAddSheetInitially
}: TasksModuleProps) {
  const [activeTab, setActiveTab] = useState<TaskStatus>('NEW');
  const [filterScope, setFilterScope] = useState<'MY' | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'DATE' | 'POINTS'>('DATE');

  // Sheet creation state
  const [isSheetOpen, setIsSheetOpen] = useState(isAddSheetOpenInitially);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('🧹');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState<string>(role === 'CHILD' ? currentUser.id : 'all');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Bugun, 20:00');
  const [newTaskRepeat, setNewTaskRepeat] = useState('Bir marta');
  const [newTaskPoints, setNewTaskPoints] = useState(30);

  const taskCategories = ['🧹', '🛒', '🍽', '👶', '🔧', '📦', '🌱', '🎓', '🏥', '➕'];

  React.useEffect(() => {
    if (isAddSheetOpenInitially) {
      setIsSheetOpen(true);
    }
  }, [isAddSheetOpenInitially]);

  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const handleCloseSheet = () => {
    const defaultAssignee = role === 'CHILD' ? currentUser.id : 'all';
    const isDirty = newTaskTitle.trim() !== '' || newTaskCategory !== '🧹' || newTaskAssignedTo !== defaultAssignee || newTaskDueDate !== 'Bugun, 20:00' || newTaskRepeat !== 'Bir marta' || newTaskPoints !== 30;
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      forceCloseSheet();
    }
  };

  const forceCloseSheet = () => {
    setIsSheetOpen(false);
    setShowDiscardConfirm(false);
    if (onCloseAddSheetInitially) onCloseAddSheetInitially();
    // reset states
    setEditingTaskId(null);
    setNewTaskTitle('');
    setNewTaskCategory('🧹');
    setNewTaskAssignedTo(role === 'CHILD' ? currentUser.id : 'all');
    setNewTaskPoints(30);
  };

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id);
    setNewTaskTitle(task.title);
    setNewTaskCategory(task.category);
    setNewTaskAssignedTo(task.assignedTo);
    setNewTaskDueDate(task.dueDate);
    setNewTaskRepeat(task.repeat || 'Bir marta');
    setNewTaskPoints(task.points);
    setIsSheetOpen(true);
  };

  const onAttemptCloseRef = React.useRef(handleCloseSheet);
  onAttemptCloseRef.current = handleCloseSheet;

  React.useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.BackButton) {
      if (isSheetOpen) {
        tg.BackButton.show();
        const callback = () => onAttemptCloseRef.current();
        tg.BackButton.onClick(callback);
        return () => {
          tg.BackButton.offClick(callback);
          tg.BackButton.hide();
        };
      } else {
        tg.BackButton.hide();
      }
    }
  }, [isSheetOpen]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (editingTaskId && onEditTask) {
      onEditTask(editingTaskId, {
        title: newTaskTitle.trim(),
        category: newTaskCategory,
        assignedTo: newTaskAssignedTo,
        dueDate: newTaskDueDate,
        repeat: newTaskRepeat,
        points: newTaskPoints
      });
    } else {
      onAddTask({
        title: newTaskTitle.trim(),
        category: newTaskCategory,
        assignedTo: newTaskAssignedTo,
        dueDate: newTaskDueDate,
        repeat: newTaskRepeat,
        points: newTaskPoints
      });
    }

    forceCloseSheet();
  };

  // Perform filtering & sorting
  const filteredTasks = tasks.filter(task => {
    // 1. Status Match
    if (task.status !== activeTab) return false;

    // 2. Role constraints (Child only matches child's own, never others)
    if (role === 'CHILD') {
      const childId = currentUser.id;
      return task.assignedTo === childId;
    }

    // 3. User Filter scope
    if (filterScope === 'MY') {
      return task.assignedTo === currentUser.id;
    }

    return true; // ALL
  });

  // Sort
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'POINTS') {
      return b.points - a.points;
    }
    // Simple mock date comparison
    return a.dueDate.localeCompare(b.dueDate);
  });

  // Points autocomputer based on categories
  const handleCategoryChoice = (cat: string) => {
    setNewTaskCategory(cat);
    // automatic default weights depending on category
    if (cat === '🧹') setNewTaskPoints(30);
    else if (cat === '🛒') setNewTaskPoints(40);
    else if (cat === '🍽') setNewTaskPoints(15);
    else if (cat === '👶') setNewTaskPoints(50);
    else if (cat === '🌱') setNewTaskPoints(10);
    else setNewTaskPoints(25);
  };

  return (
    <div id="tasks_module_view" className="flex flex-col h-full bg-slate-950 text-slate-100 relative">
      
      {/* Scrollable Main Block */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-32 flex flex-col gap-2.5">
        
        {/* Module title header */}
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800/40 p-3 px-4 rounded-[28px] shrink-0 shadow-lg">
          <span className="font-display font-black text-xl text-white tracking-tight">
            {t.tasksTitle}
          </span>
          {role !== 'CHILD' && (
            <button
              id="btn-trigger-add-task-header"
              onClick={() => setIsSheetOpen(true)}
              className="text-xs bg-emerald-500 hover:bg-emerald-450 text-slate-950 py-2 px-4 rounded-full font-extrabold flex items-center gap-1 transition-all shadow-sm border border-white/5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Plus size={14} className="stroke-[3px]" /> {t.addTaskTitle}
            </button>
          )}
        </div>

        {/* 3 Status Tab Buttons (Yangi, Jarayonda, Bajarilgan) */}
        <div id="tasks-status-tabs" className="grid grid-cols-3 bg-slate-900 border border-slate-800/40 px-3 py-1.5 gap-0 rounded-[22px] shrink-0 shadow-md">
          <button
            id="tab-tasks-new"
            onClick={() => setActiveTab('NEW')}
            className={`py-2.5 px-3 rounded-[16px] transition-all relative ${
              activeTab === 'NEW' ? 'bg-slate-850 text-emerald-400 text-sm font-bold shadow-sm' : 'text-slate-400 hover:text-white text-sm font-medium'
            }`}
          >
            {t.tabNew} ({tasks.filter(t => t.status === 'NEW' && (role === 'CHILD' ? t.assignedTo === currentUser.id : true)).length})
          </button>
          <button
            id="tab-tasks-inprogress"
            onClick={() => setActiveTab('IN_PROGRESS')}
            className={`py-2.5 px-3 rounded-[16px] transition-all relative ${
              activeTab === 'IN_PROGRESS' ? 'bg-slate-850 text-emerald-400 text-sm font-bold shadow-sm' : 'text-slate-400 hover:text-white text-sm font-medium'
            }`}
          >
            {t.tabInProgress} ({tasks.filter(t => t.status === 'IN_PROGRESS' && (role === 'CHILD' ? t.assignedTo === currentUser.id : true)).length})
          </button>
          <button
            id="tab-tasks-done"
            onClick={() => setActiveTab('DONE')}
            className={`py-2.5 px-3 rounded-[16px] transition-all relative ${
              activeTab === 'DONE' ? 'bg-slate-850 text-emerald-400 text-sm font-bold shadow-sm' : 'text-slate-400 hover:text-white text-sm font-medium'
            }`}
          >
            {t.tabDone} ({tasks.filter(t => t.status === 'DONE' && (role === 'CHILD' ? t.assignedTo === currentUser.id : true)).length})
          </button>
        </div>

        {/* Points Summary Section */}
        <div className="bg-slate-900 border border-slate-800/40 rounded-[28px] p-4 shrink-0 shadow-md flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">{lang === 'uz' ? "Ishlangan ballar (XP)" : "Earned Points (XP)"}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {members.map(member => {
              const pts = tasks.filter(t => t.status === 'DONE' && t.assignedTo === member.id).reduce((sum, t) => sum + t.points, 0);
              return (
                <div key={member.id} className="flex items-center gap-2 bg-slate-950 border border-slate-800/60 rounded-xl px-3 py-2 flex-1 min-w-[120px]">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm shadow-inner shrink-0">
                    {member.avatar || '👤'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-wider">{member.name}</span>
                    <span className="text-sm font-black text-amber-400 font-display">{pts}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2 Filter Sub-panel bars (Mening vs Oila hammasi, hidden for CHILD role) */}
        {role !== 'CHILD' && (
          <div id="tasks-filter-bar" className="flex justify-between items-center gap-3 shrink-0">
            <div className="flex bg-slate-900 p-1 border border-slate-850 rounded-xl gap-2">
              <button
                id="btn-tasks-scope-my"
                onClick={() => setFilterScope('MY')}
                className={`px-4 py-2 rounded-lg text-xs transition-all ${
                  filterScope === 'MY' ? 'bg-slate-850 text-white font-bold' : 'text-slate-400 hover:text-white font-medium'
                }`}
              >
                👤 {t.filterMy}
              </button>
              <button
                id="btn-tasks-scope-all"
                onClick={() => setFilterScope('ALL')}
                className={`px-4 py-2 rounded-lg text-xs transition-all ${
                  filterScope === 'ALL' ? 'bg-slate-850 text-white font-bold' : 'text-slate-400 hover:text-white font-medium'
                }`}
              >
                👨‍👩‍👧 {t.filterAll}
              </button>
            </div>

            {/* Sortermethod button */}
            <button
              id="btn-tasks-sort-toggle"
              onClick={() => setSortBy(prev => prev === 'DATE' ? 'POINTS' : 'DATE')}
              className="text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 p-2 px-3 rounded-xl flex items-center gap-1.5"
            >
              📊 {sortBy === 'DATE' ? 'Muddati bo\'yicha' : 'Ballar bo\'yicha'}
            </button>
          </div>
        )}

        {/* Tasks list entries wrapper */}
        <div id="tasks-scroll-list" className="flex flex-col gap-3">
          {sortedTasks.length === 0 ? (
            <div id="tasks-empty-stage" className="flex flex-col items-center justify-center p-12 bg-slate-900/30 border border-slate-900/80 rounded-3xl text-center gap-2">
              <span className="text-3xl">🎉</span>
              <p className="text-xs text-slate-400 font-bold">{t.noTasksToday}</p>
              {role !== 'CHILD' && (
                <button
                  id="btn-empty-add-task"
                  onClick={() => setIsSheetOpen(true)}
                  className="mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-4 rounded-xl text-xs transition-all"
                >
                  ➕ {t.addTaskTitle}
                </button>
              )}
            </div>
          ) : (
            sortedTasks.map(task => {
              const assignedUser = members.find(m => m.id === task.assignedTo);
              const isPastDate = task.dueDate.includes('Kecha') || task.dueDate.includes('oldin');
              const isToday = task.dueDate.includes('Bugun');

              const dateBadgeColor = isPastDate 
                ? 'text-red-400 bg-red-500/10' 
                : isToday 
                  ? 'text-amber-400 bg-amber-500/10' 
                  : 'text-slate-400 bg-slate-800';

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={task.id}
                  className={`border p-3 mx-0 rounded-[28px] flex flex-col gap-3 transition-all shadow-md ${
                    task.status === 'DONE' 
                      ? 'bg-slate-900/30 border-slate-900/40 filter opacity-60' 
                      : 'bg-slate-900 border-slate-800/40 hover:border-slate-800/80'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3.5 min-w-0">
                      <span className="w-11 h-11 bg-slate-850 rounded-[18px] flex items-center justify-center text-xl shrink-0">
                        {task.category}
                      </span>
                      <div className="min-w-0">
                        <h4 className={`text-base font-semibold leading-snug ${task.status === 'DONE' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {task.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5 truncate max-w-[120px]">
                            <User size={12} className="text-emerald-400" /> {assignedUser ? assignedUser.name : 'All Family'}
                          </span>
                          <span className="text-slate-700">•</span>
                          <span className="flex items-center gap-1.5 text-slate-400">
                             <RotateCcw size={12} className="text-violet-400" /> {task.repeat}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Points visual value indicator */}
                    <span className="bg-slate-950/60 font-mono text-xs font-black text-amber-400 p-1.5 px-3 rounded-full border border-slate-800/60 shrink-0">
                      ⭐ {task.points}b
                    </span>
                  </div>

                  {/* Actions bottom banner inside card */}
                  <div className="flex justify-between items-center border-t border-slate-850/30 pt-2 mt-2 gap-2">
                    <span className={`text-[10px] font-black p-1 px-3 rounded-full uppercase tracking-wider ${dateBadgeColor}`}>
                      🕒 {task.dueDate}
                    </span>

                    <div className="flex gap-2">
                      {role !== 'CHILD' && task.status !== 'DONE' && (
                        <button
                          onClick={() => handleEditClick(task)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3 rounded-full font-bold transition-all"
                        >
                          <Edit3 size={12} className="stroke-[3px]" />
                        </button>
                      )}
                      {task.status !== 'DONE' && (
                        <button
                          id={`btn-complete-inner-task-${task.id}`}
                          onClick={() => onCompleteTask(task.id)}
                          className="bg-emerald-500 hover:bg-emerald-450 text-slate-950 hover:shadow-emerald-500/10 hover:shadow-lg active:scale-95 py-2 px-5 rounded-full font-black text-xs transition-all flex items-center gap-1 hover:brightness-110 cursor-pointer"
                        >
                          <Check size={12} className="stroke-[3px]" /> {t.taskDoneBtn}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          
          {sortedTasks.length > 0 && (
            <div className="mt-2 bg-slate-900/40 border border-slate-800/60 rounded-[24px] p-6 flex flex-col items-center text-center gap-2 shadow-sm">
              <span className="text-2xl opacity-80 filter drop-shadow-sm mb-1">✨</span>
              <span className="text-sm font-bold text-slate-300">
                {lang === 'uz' ? 'Bugun boshqa vazifa yo‘q' : 'Сегодня задач больше нет'}
              </span>
              {role !== 'CHILD' && (
                <p className="text-[11px] font-medium text-slate-500">
                  {lang === 'uz' ? 'Yangi vazifa qo‘shish uchun + tugmasidan foydalaning' : 'Используйте кнопку + чтобы добавить новую задачу'}
                </p>
              )}
            </div>
          )}
        </div>

      </div>

      {/* FIXED BUTTON TO ADD FOR ADULTS */}
      {role !== 'CHILD' && (
        <motion.div 
          drag 
          dragConstraints={{ left: -300, right: 0, top: -600, bottom: 0 }} 
          className="fixed bottom-[88px] right-3 z-40 flex flex-col items-end gap-3 pointer-events-auto cursor-grab"
        >
          <button
            id="btn-trigger-add-task-fixed"
            onClick={() => setIsSheetOpen(true)}
            className="pointer-events-auto w-14 h-14 rounded-[20px] flex items-center justify-center shadow-[0_16px_32px_rgba(212,77,41,0.2)] transition-all duration-300 active:scale-90 relative overflow-hidden bg-emerald-500 text-white border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>
            <Plus size={26} className="font-bold stroke-[3px]" />
          </button>
        </motion.div>
      )}

      {/* DYNAMIC BOTTOM SHEET DIALOG CREATOR */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 z-[100] cursor-pointer"
              onClick={handleCloseSheet}
              id="sheet-backdrop-task"
            ></motion.div>

            {/* Drawer Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 border-t border-slate-800 rounded-t-3xl z-[101] overflow-hidden flex flex-col max-h-[90vh]"
              id="sheet-task-editor"
            >
              
              {/* drag handle bar */}
              <div className="w-full flex justify-center py-4">
                <div className="w-20 h-2 bg-slate-700/60 rounded-full cursor-row-resize" onClick={handleCloseSheet}></div>
              </div>

              {/* Upper Header Control panel */}
              <div className="px-5 pb-3 border-b border-slate-850 flex justify-between items-center font-bold">
                <span className="text-sm font-extrabold text-white">
                  {editingTaskId ? (lang === 'uz' ? "Vazifani o'zgartirish" : 'Редактировать задачу') : t.addTaskTitle}
                </span>
                <button
                  id="btn-sheet-task-close"
                  onClick={handleCloseSheet}
                  className="text-slate-500 hover:text-white p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form elements scrolling wrapper */}
              <form onSubmit={handleCreateTask} className="px-4 pt-4 overflow-y-auto pb-48 flex flex-col gap-4">
                
                {/* 1. Title Input field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-bold">{lang === 'uz' ? 'Vazifa sarlavhasi' : 'Название задачи'}</label>
                  <input
                    id="input-task-title"
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onFocus={(e) => {
                      setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
                    }}
                    placeholder={t.taskTitlePlaceholder}
                    className="bg-slate-950 border-2 border-slate-850 rounded-xl p-3 text-sm font-medium text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* 2. Emoji Category Selector Grid */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-bold">📂 {lang === 'uz' ? 'Kategoriya emojisi' : 'Эмодзи категории'}</label>
                  <div className="grid grid-cols-5 gap-2" id="box-task-categories">
                    {taskCategories.map(cat => (
                      <button
                        type="button"
                        key={cat}
                        id={`btn-task-cat-select-${cat}`}
                        onClick={() => handleCategoryChoice(cat)}
                        className={`py-2 rounded-xl text-lg flex items-center justify-center transition-all ${
                          newTaskCategory === cat
                            ? 'bg-emerald-500/10 border-2 border-emerald-500 text-white'
                            : 'bg-slate-950 border border-slate-850 hover:border-slate-800 text-slate-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Manage Assignee picker inside card form */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-bold">👤 {t.assignTo}</label>
                  <select
                    id="select-task-assignee"
                    value={newTaskAssignedTo}
                    onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                    disabled={role === 'CHILD'}
                    className="bg-slate-950 border-2 border-slate-850 text-xs text-white p-3 rounded-xl outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {role !== 'CHILD' && <option value="all">👨‍👩‍👧 {lang === 'uz' ? 'Butun oilaga (All Family)' : 'Всей семье'}</option>}
                    {members
                      .filter(m => role === 'CHILD' ? m.id === currentUser.id : true)
                      .map(m => (
                      <option key={m.id} value={m.id}>
                        {m.avatar} {m.name} ({m.role === 'OWNER' ? '👑 Egasi' : m.role === 'CHILD' ? '👦 Bola' : '👤 A\'zo'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grid container for schedule & due fields */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Due Date field selector placeholder */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 font-bold">📅 {lang === 'uz' ? 'Muddat' : 'Срок'}</label>
                    <select
                      id="select-task-due"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="bg-slate-950 border-2 border-slate-850 text-xs text-white p-3 rounded-xl outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Bugun, 20:00">📅 Bugun, 20:00</option>
                      <option value="Ertaga, 12:00">📅 Ertaga, 12:00</option>
                      <option value="Ertaga, 18:00">📅 Ertaga, 18:00</option>
                      <option value="Kelasi dushanba, 09:00">📅 Kelasi hafta</option>
                    </select>
                  </div>

                  {/* Repeat configuration */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 font-bold">🔁 {lang === 'uz' ? 'Takrorlanish' : 'Повторение'}</label>
                    <select
                      id="select-task-repeat"
                      value={newTaskRepeat}
                      onChange={(e) => setNewTaskRepeat(e.target.value)}
                      className="bg-slate-950 border-2 border-slate-850 text-xs text-white p-3 rounded-xl outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Bir marta">One-time</option>
                      <option value="Har kuni">Daily</option>
                      <option value="Har hafta">Weekly</option>
                    </select>
                  </div>

                </div>

                {/* 4. Points reward slider value */}
                <div className="flex flex-col gap-1.5 bg-slate-950 border border-slate-850 p-3.5 rounded-2xl">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">⭐ {t.pointsText} mukofoti</span>
                    <span id="lbl-task-points-preview" className="text-amber-400 bg-amber-500/10 p-1 px-2.5 rounded-lg">{newTaskPoints} ball (XP)</span>
                  </div>
                  <input
                    id="range-task-points"
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(parseInt(e.target.value))}
                    className="w-full mt-2 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500 flex justify-between mt-1">
                    <span>10 ball (Yengil)</span>
                    <span>100 ball (Og'ir yumush)</span>
                  </div>
                </div>

                {/* Form submit button */}
                <button
                  type="submit"
                  id="btn-task-form-submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-xl text-sm font-black tracking-wide transition-all shadow-md active:scale-95"
                >
                  ✅ {t.tabNew} {lang === 'uz' ? 'vazifani yaratish' : 'создать задачу'}
                </button>

              </form>

            </motion.div>

            {showDiscardConfirm && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[999]" id="task-discard-confirm-dialog">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full text-center flex flex-col gap-4 shadow-xl">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-xl mx-auto animate-pulse">⚠️</div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'uz' ? 'O\'zgarishlarni bekor qilamiz?' : lang === 'ru' ? 'Отменить изменения?' : 'Discard changes?'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'uz' ? 'Kiritilgan barcha maʼlumotlar oʻchib ketadi.' : lang === 'ru' ? 'Введенные данные будут утеряны.' : 'Your entered data will be lost.'}
                  </p>
                  <div className="flex gap-3 mt-2">
                    <button
                      id="btn-task-confirm-keep"
                      onClick={() => setShowDiscardConfirm(false)}
                      className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-800"
                    >
                      {lang === 'uz' ? 'Tahrirlashda davom etish' : lang === 'ru' ? 'Продолжить' : 'Keep editing'}
                    </button>
                    <button
                      id="btn-task-confirm-discard"
                      onClick={forceCloseSheet}
                      className="flex-1 bg-red-500 hover:bg-red-650 text-white py-2.5 rounded-xl text-xs font-bold transition-all"
                    >
                      {lang === 'uz' ? 'Oʻchirish' : lang === 'ru' ? 'Сбросить' : 'Discard'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
