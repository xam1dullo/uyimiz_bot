import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { TranslationSet, Reminder, FamilyMember, Role, Language } from '../types';
import { Plus, Bell, Clock, ChevronDown, ChevronUp, Check, User, RotateCcw, X, CalendarDays, Calendar, Edit3 } from 'lucide-react';

interface RemindersModuleProps {
  t: TranslationSet;
  role: Role;
  lang: Language;
  members: FamilyMember[];
  reminders: Reminder[];
  currentUser: FamilyMember;
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'isPast'>) => void;
  onEditReminder?: (id: string, reminder: Omit<Reminder, 'id' | 'isPast'>) => void;
  onSnoozeReminder: (id: string, minutes: number) => void;
  onArchiveReminder: (id: string) => void;
  onDeleteReminder?: (id: string) => void;
  isAddSheetOpenInitially?: boolean;
  onCloseAddSheetInitially?: () => void;
}

export default function RemindersModule({
  t,
  role,
  lang,
  members,
  reminders,
  currentUser,
  onAddReminder,
  onEditReminder,
  onSnoozeReminder,
  onArchiveReminder,
  onDeleteReminder,
  isAddSheetOpenInitially = false,
  onCloseAddSheetInitially
}: RemindersModuleProps) {
  // Add sheet states
  const [isSheetOpen, setIsSheetOpen] = useState(isAddSheetOpenInitially);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newAssignedTo, setNewAssignedTo] = useState('all');
  const [newTime, setNewTime] = useState('Bugun, 18:00');
  const [newRepeat, setNewRepeat] = useState('Bir marta');

  // Calendar strip state
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const calendarTouchStartRef = React.useRef<{ x: number; y: number } | null>(null);
  
  const getLocalDateString = (d: Date) => {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  }, []);
  
  const todayDateStr = React.useMemo(() => getLocalDateString(today), [today]);
  const [selectedDateStr, setSelectedDateStr] = useState(todayDateStr);
  const [visibleMonthStr, setVisibleMonthStr] = useState('');

  const calendarDays = React.useMemo(() => {
    const days: Date[] = [];
    
    const isValidDate = (year: number, month: number, day: number) => {
      const d = new Date(year, month, day);
      return d.getFullYear() === year &&
             d.getMonth() === month &&
             d.getDate() === day;
    };

    let year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();

    while (days.length < 365) {
      if (isValidDate(year, month, day)) {
        days.push(new Date(year, month, day));
        day++;
      } else {
        day = 1;
        month++;
        if (month > 11) {
          month = 0;
          year++;
        }
      }
    }
    return days;
  }, [today]);

  React.useEffect(() => {
    const monthNames = lang === 'uz' 
        ? ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
        : ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    setVisibleMonthStr(`${monthNames[today.getMonth()]} ${today.getFullYear()}`);
  }, [lang, today]);

  const [startIndex, setStartIndex] = useState(0);
  const WINDOW_SIZE = 80;
  const endIndex = Math.min(365, startIndex + WINDOW_SIZE);

  const handleCalendarScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    
    // Each item has a 68px footprint (60px card size + 8px gap)
    const visibleStart = Math.floor(scrollLeft / 68);
    const visibleEnd = visibleStart + Math.ceil(container.clientWidth / 68);

    // If we approach within 15 items of the currently rendered pool boundaries, we shift/re-center
    if (visibleStart < startIndex + 15 && startIndex > 0) {
      const newStart = Math.max(0, Math.floor(visibleStart - (WINDOW_SIZE / 2)));
      const alignedStart = Math.floor(newStart / 5) * 5;
      if (alignedStart !== startIndex) {
        setStartIndex(alignedStart);
      }
    } else if (visibleEnd > endIndex - 15 && endIndex < 365) {
      const newStart = Math.min(365 - WINDOW_SIZE, Math.floor(visibleStart - (WINDOW_SIZE / 2)));
      const alignedStart = Math.floor(newStart / 5) * 5;
      if (alignedStart !== startIndex) {
        setStartIndex(alignedStart);
      }
    }

    // Determine centered container item to sync month label correctly
    const centerPos = scrollLeft + container.clientWidth / 2;
    const approxCenterIndex = Math.max(0, Math.floor(centerPos / 68));
    const centerDate = calendarDays[approxCenterIndex];
    if (centerDate) {
      const monthNames = lang === 'uz' 
        ? ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
        : ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
      const monthStr = `${monthNames[centerDate.getMonth()]} ${centerDate.getFullYear()}`;
      if (visibleMonthStr !== monthStr) {
        setVisibleMonthStr(monthStr);
      }
    }
  };

  const handleTodayClick = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    setStartIndex(0);
    setSelectedDateStr(todayDateStr);
    const monthNames = lang === 'uz' 
        ? ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
        : ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    setVisibleMonthStr(`${monthNames[today.getMonth()]} ${today.getFullYear()}`);
  };

  // Snooze sheet states
  const [snoozeTargetId, setSnoozeTargetId] = useState<string | null>(null);

  // Confirmation states
  const [confirmAction, setConfirmAction] = useState<{ id: string; type: 'archive' | 'delete' } | null>(null);

  React.useEffect(() => {
    if (isAddSheetOpenInitially) {
      setIsSheetOpen(true);
    }
  }, [isAddSheetOpenInitially]);

  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const handleCloseSheet = () => {
    // Dirty protection check on any modified field
    const isDirty = newTitle.trim() !== '' || newNote.trim() !== '' || newAssignedTo !== 'all' || newTime !== 'Bugun, 18:00' || newRepeat !== 'Bir marta';
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
    // Reset fields
    setEditingReminderId(null);
    setNewTitle('');
    setNewNote('');
    setNewAssignedTo('all');
  };

  const handleEditClick = (reminder: Reminder) => {
    setEditingReminderId(reminder.id);
    setNewTitle(reminder.title);
    setNewNote(reminder.note || '');
    setNewAssignedTo(reminder.assignedTo);
    setNewTime(reminder.time);
    setNewRepeat(reminder.repeat || 'Bir marta');
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

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (editingReminderId && onEditReminder) {
      onEditReminder(editingReminderId, {
        title: newTitle.trim(),
        note: newNote.trim() || undefined,
        assignedTo: newAssignedTo,
        time: newTime,
        repeat: newRepeat,
        snoozedCount: 0
      });
    } else {
      onAddReminder({
        title: newTitle.trim(),
        note: newNote.trim() || undefined,
        assignedTo: newAssignedTo,
        time: newTime,
        repeat: newRepeat,
        snoozedCount: 0
      });
    }

    forceCloseSheet();
  };

  const handleSnoozeChoice = (minutes: number) => {
    if (!snoozeTargetId) return;
    onSnoozeReminder(snoozeTargetId, minutes);
    setSnoozeTargetId(null); // Close snooze modal
  };

  // Safe check for CHILD role
  if (role === 'CHILD') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-950 text-slate-100">
        <span className="text-4xl mb-4">🔒</span>
        <h3 className="text-lg font-bold text-red-400 mb-2">{t.cantAccessMsg}</h3>
      </div>
    );
  }

  const upcomingRemindersAll = reminders.filter(r => !r.isPast);
  const pastReminders = reminders.filter(r => r.isPast);

  // Simple heuristic for mapping reminders to days for prototype purposes
  const isReminderForDate = (rem: any, dateStr: string) => {
    const tLower = rem.time.toLowerCase();
    
    // Simulate prototype matches based on current offset simulation
    // Compare string dates to today and tomorrow
    const dDate = new Date(dateStr);
    const offset = Math.round((dDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (offset === 0) return tLower.includes('bugun') || tLower.includes('today') || tLower.includes('сегодня');
    if (offset === 1) return tLower.includes('ertaga') || tLower.includes('tomorrow') || tLower.includes('завтра');
    if (offset === 3) return tLower.includes('3 kundan');
    return false; // Other days won't match our hardcoded example strings
  };

  const getRemindersCountForDate = (dateStr: string) => {
    return upcomingRemindersAll.filter(rem => isReminderForDate(rem, dateStr)).length;
  };

  const upcomingReminders = upcomingRemindersAll.filter(rem => isReminderForDate(rem, selectedDateStr));

  return (
    <div id="reminders_module_wrapper" className="flex flex-col h-full bg-slate-950 text-slate-100 relative justify-between">
      
      {/* Scrollable Main Block */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-32 flex flex-col gap-2.5">
        
        {/* Header container */}
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800/40 p-3 px-4 rounded-[28px] shrink-0 shadow-lg">
          <span className="font-display font-black text-xl text-white tracking-tight">
            {t.remindersTitle}
          </span>
          <button
            id="btn-trigger-add-reminder-header"
            onClick={() => setIsSheetOpen(true)}
            className="text-xs bg-emerald-500 hover:bg-emerald-450 text-slate-950 py-2 px-4 rounded-full font-extrabold flex items-center gap-1 transition-all shadow-sm border border-white/5 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus size={14} className="stroke-[3px]" /> {lang === 'uz' ? 'Eslatka' : 'Напомнить'}
          </button>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between px-2 pt-2 -mb-2">
          <motion.div 
            key={visibleMonthStr} 
            initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} 
            className="text-lg font-bold tracking-tight text-white capitalize flex items-center gap-1"
          >
            {visibleMonthStr}
          </motion.div>
          <button 
            type="button"
            onClick={handleTodayClick}
            className="text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
          >
            <CalendarDays size={14} /> {lang === 'uz' ? 'Bugun' : 'Сегодня'}
          </button>
        </div>

        {/* Horizontal Calendar Strip with Swipe Isolation and Butter-Smooth Scrolling */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleCalendarScroll}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            if (touch) {
              calendarTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
            }
            // Isolate touches within the calendar to prevent interfering with iOS swipe back
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            if (calendarTouchStartRef.current) {
              const touch = e.touches[0];
              if (touch) {
                const diffX = Math.abs(touch.clientX - calendarTouchStartRef.current.x);
                const diffY = Math.abs(touch.clientY - calendarTouchStartRef.current.y);
                if (diffX > diffY) {
                  // Horizontal swipe detected - stop propagation to avoid closing the mini app
                  e.stopPropagation();
                }
              }
            } else {
              e.stopPropagation();
            }
          }}
          style={{ touchAction: 'pan-x', overscrollBehaviorX: 'contain', paddingTop: '8px' }}
          className="flex items-center w-full overflow-x-auto scrollbar-none pb-2 -mx-3 px-3 gap-2 snap-x snap-mandatory pointer-events-auto"
        >
          {/* Left virtualization spacer */}
          {startIndex > 0 && (
            <div style={{ flexShrink: 0, width: `${(startIndex * 68) - 8}px` }} />
          )}

          {calendarDays.slice(startIndex, endIndex).map((date, index) => {
            const dateStr = getLocalDateString(date);
            const isToday = dateStr === todayDateStr;
            const isSelected = selectedDateStr === dateStr;
            const dayNum = date.getDate();
            
            const daysUz = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];
            const daysRu = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
            const dayStr = lang === 'uz' ? daysUz[date.getDay()] : daysRu[date.getDay()];

            const count = getRemindersCountForDate(dateStr);
            const absoluteIndex = startIndex + index;
            
            return (
              <button
                key={dateStr}
                data-index={absoluteIndex}
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(50);
                  setSelectedDateStr(dateStr);
                  const monthNames = lang === 'uz' 
                      ? ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
                      : ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
                  setVisibleMonthStr(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
                }}
                className={`date-chip flex-none w-[60px] h-[76px] flex flex-col items-center justify-center rounded-[20px] transition-all duration-300 relative snap-center active:scale-95 border ${
                  isSelected 
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_8px_16px_rgba(16,185,129,0.25)] border-emerald-400 z-10' 
                    : isToday 
                      ? 'bg-slate-900 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-900 border-slate-800 shadow-sm hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                {isToday && !isSelected && (
                  <span className="absolute top-1.5 text-[9px] font-bold text-emerald-500 uppercase">Bugun</span>
                )}
                
                <span className={`text-[12px] font-bold tracking-wide mt-1 mb-0.5 ${
                  isSelected ? 'text-emerald-50' : 'text-slate-500'
                }`}>
                  {dayStr}
                </span>
                
                <span className={`leading-none ${
                  isSelected ? 'text-white text-xl font-bold' : 'text-slate-400 text-lg font-medium'
                }`}>
                  {dayNum}
                </span>

                <div className="h-4 flex items-end justify-center mt-1">
                  {count === 1 ? (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
                  ) : count > 1 ? (
                    <div className={`text-[10px] font-bold px-1.5 rounded p-0.5 leading-none ${isSelected ? 'bg-white text-emerald-600' : 'bg-amber-400/20 text-amber-400'}`}>
                      {count}
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}

          {/* Right virtualization spacer */}
          {endIndex < 365 && (
            <div style={{ flexShrink: 0, width: `${((365 - endIndex) * 68) - 8}px` }} />
          )}

          {/* Spacer to allow full scroll to end visually */}
          <div className="w-1 flex-none" />
        </div>

        {/* 1. UPCOMING REMINDERS */}
        <div className="flex flex-col gap-2">
          <span className="px-0 mt-3 mb-2 text-xs font-semibold tracking-widest uppercase text-slate-400">
            {lang === 'uz' 
              ? `${selectedDateStr.split('-')[2]!}-${(() => {
                  const m = parseInt(selectedDateStr.split('-')[1]!, 10) - 1;
                  return ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'][m];
                })()} eslatmalari` 
              : `Напоминания на ${selectedDateStr.split('-')[2]!} ${(() => {
                  const m = parseInt(selectedDateStr.split('-')[1]!, 10) - 1;
                  return ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][m];
                })()}`
            }
          </span>

          {upcomingReminders.length === 0 ? (
            <div id="reminders-upcoming-empty" className="flex flex-col items-center justify-center p-4 bg-slate-900/40 border border-slate-800/60 rounded-3xl text-center gap-3">
              <span className="text-4xl opacity-80 filter drop-shadow-sm">😌</span>
              <p className="text-sm font-bold text-slate-300">
                {lang === 'uz' ? 'Bu kunda eslatma yo‘q' : 'На этот день нет напоминаний'}
              </p>
              <button 
                onClick={() => setIsSheetOpen(true)}
                className="text-xs font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 rounded-xl transition-all"
              >
                + {lang === 'uz' ? 'Eslatka qo‘shish' : 'Добавить напоминание'}
              </button>
            </div>
          ) : (
            upcomingReminders.map(rem => {
              const assignedUser = members.find(m => m.id === rem.assignedTo);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={rem.id}
                  id={`reminder-card-${rem.id}`}
                  className="bg-slate-900 border border-slate-850 px-3 py-3 rounded-2xl flex flex-col gap-3 hover:border-slate-800 transition-all shadow-sm"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex gap-3 min-w-0">
                      <span className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl shrink-0 border border-purple-500/10 scale-and-pulsate">
                        🔔
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {rem.title}
                        </h4>
                        {rem.note && (
                          <p className="text-xs text-slate-400 font-medium mt-1">
                            📝 {rem.note}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 font-medium">
                          <span className="flex items-center gap-1 truncate max-w-[120px]">
                            <User size={12} /> {rem.assignedTo === 'all' ? 'All Family' : (assignedUser ? assignedUser.name : 'Me')}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-purple-400">
                            <Clock size={12} /> {rem.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Snooze Trigger button */}
                    <button
                      id={`btn-snooze-reminder-${rem.id}`}
                      onClick={() => setSnoozeTargetId(rem.id)}
                      className="bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-300 font-bold py-1.5 px-3 rounded-xl text-2xs transition-all active:scale-95 flex items-center gap-1 whitespace-nowrap shrink-0"
                    >
                      ⏰ {t.btnSnooze.split(' ')[0]}
                    </button>
                  </div>

                  {/* Complete & Delete markers link */}
                  <div className="flex justify-between items-center mt-1 border-t border-slate-850/40 pt-2 shrink-0">
                    <div className="flex gap-4">
                      <button
                        id={`btn-delete-reminder-${rem.id}`}
                        onClick={() => setConfirmAction({ id: rem.id, type: 'delete' })}
                        className="text-[10px] uppercase font-bold text-slate-600 hover:text-red-500 flex items-center gap-1 transition-all cursor-pointer pointer-events-auto"
                      >
                        🗑 {lang === 'uz' ? 'O\'chirish' : lang === 'ru' ? 'Удалить' : 'Delete'}
                      </button>
                      <button
                        id={`btn-edit-reminder-${rem.id}`}
                        onClick={() => handleEditClick(rem)}
                        className="text-[10px] uppercase font-bold text-slate-600 hover:text-blue-500 flex items-center gap-1 transition-all cursor-pointer pointer-events-auto"
                      >
                        <Edit3 size={11} className="stroke-[2.5px]" /> {lang === 'uz' ? 'O\'zgartirish' : lang === 'ru' ? 'Изменить' : 'Edit'}
                      </button>
                    </div>

                    <button
                      id={`btn-archive-reminder-${rem.id}`}
                      onClick={() => setConfirmAction({ id: rem.id, type: 'archive' })}
                      className="text-[10px] uppercase font-bold text-slate-600 hover:text-emerald-500 flex items-center gap-1 transition-all cursor-pointer pointer-events-auto"
                    >
                      ✓ {lang === 'uz' ? 'O\'qildi deb belgilash' : 'Прочитано'}
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* 2. PAST REMINDERS */}
        {pastReminders.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <span className="pt-3 pb-1 px-0 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              ✓ {t.sectionPast} ({pastReminders.length})
            </span>
            <div className="flex flex-col gap-2 opacity-50">
              {pastReminders.map(rem => (
                <div
                  key={rem.id}
                  id={`past-reminder-${rem.id}`}
                  className="bg-slate-900/60 border border-slate-900 p-3.5 rounded-xl flex items-center justify-between gap-3 text-sm text-slate-600"
                >
                  <span className="truncate pr-2 line-through font-medium text-slate-600">"{rem.title}"</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono bg-slate-950 p-1 px-2 rounded font-medium whitespace-nowrap text-xs text-slate-500">🕒 {rem.time}</span>
                    <button
                      id={`btn-delete-past-reminder-${rem.id}`}
                      onClick={() => setConfirmAction({ id: rem.id, type: 'delete' })}
                      className="p-1 hover:text-red-400 text-slate-500 hover:text-red-400 transition-colors cursor-pointer pointer-events-auto text-[13px]"
                      title={lang === 'uz' ? 'O\'chirish' : lang === 'ru' ? 'Удалить' : 'Delete'}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FOOTER FIXED INJECT TRIGGER FOR ADULTS */}
      <motion.div drag dragConstraints={{ left: -300, right: 0, top: -600, bottom: 0 }} className="fixed bottom-[88px] right-3 z-40 flex flex-col items-end gap-3 pointer-events-auto cursor-grab">
        <button
          id="btn-trigger-add-reminder-fixed"
          onClick={() => setIsSheetOpen(true)}
          className="pointer-events-auto w-14 h-14 rounded-[20px] flex items-center justify-center shadow-[0_16px_32px_rgba(212,77,41,0.2)] transition-all duration-300 active:scale-90 relative overflow-hidden bg-emerald-500 text-white border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>
          <Plus size={26} className="font-bold stroke-[3px]" />
        </button>
      </motion.div>

      {/* DYNAMIC BACKDROP & SHEETS FOR SNOOZE & ADD */}
      <AnimatePresence>
        
        {/* SNOOZE TIME PERIOD SHEETS CONTAINER */}
        {snoozeTargetId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 z-[100] cursor-pointer"
              onClick={() => setSnoozeTargetId(null)}
              id="sheet-backdrop-snooze"
            ></motion.div>

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 border-t border-emerald-500/20 rounded-t-3xl p-5 z-[101] flex flex-col gap-4 text-center"
              id="sheet-snooze-options"
            >
              <div className="w-20 h-2 bg-slate-700/60 rounded-full mx-auto my-3 shrink-0"></div>
              
              <div className="flex justify-between items-center text-sm font-bold border-b border-slate-850 pb-2">
                <span className="text-white">⏰ {t.snoozeTitle}</span>
                <button onClick={() => setSnoozeTargetId(null)} className="text-slate-500 p-1">✕</button>
              </div>

              {/* Snooze grid increments options (PRD: Section 6.4) */}
              <div className="grid grid-cols-2 gap-3 py-2">
                {[
                  { label: '10 Daqiqa', val: 10 },
                  { label: '30 Daqiqa', val: 30 },
                  { label: '1 Soat', val: 60 },
                  { label: '3 Soat', val: 180 }
                ].map(opt => (
                  <button
                    key={opt.label}
                    id={`btn-snooze-period-${opt.val}`}
                    onClick={() => handleSnoozeChoice(opt.val)}
                    className="py-3 px-4 bg-slate-850 hover:bg-slate-800 text-slate-100 font-bold rounded-2xl border border-slate-800 hover:border-emerald-500 transition-all text-sm active:scale-95"
                  >
                    ⏰ {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* CREATE REMINDER DRAWER SHEET */}
        {isSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 z-[100] cursor-pointer"
              onClick={handleCloseSheet}
              id="sheet-backdrop-reminder"
            ></motion.div>

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 border-t border-slate-800 rounded-t-3xl z-[101] overflow-hidden flex flex-col max-h-[85vh]"
              id="sheet-reminder-creator"
            >
              <div className="w-full flex justify-center py-4">
                <div className="w-20 h-2 bg-slate-700/60 rounded-full cursor-row-resize" onClick={handleCloseSheet}></div>
              </div>

              <div className="px-5 pb-3 border-b border-slate-850 flex justify-between items-center font-bold">
                <span className="text-sm font-extrabold text-white">{lang === 'uz' ? 'Yangi Eslatma' : 'Создать напоминание'}</span>
                <button
                  id="btn-sheet-reminder-close"
                  onClick={handleCloseSheet}
                  className="text-slate-500 hover:text-white p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateReminder} className="px-4 pt-4 pb-6 overflow-y-auto flex flex-col gap-4">
                
                {/* 1. Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-bold">🔔 {lang === 'uz' ? 'Sarlavha' : 'Что напомнить'}</label>
                  <input
                    id="input-reminder-title"
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onFocus={(e) => {
                      setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
                    }}
                    placeholder="Masalan: Shifokor ko'rigi, Dori ichish..."
                    className="bg-slate-950 border-2 border-slate-850 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 font-medium text-white"
                  />
                </div>

                {/* 2. Details Note */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-bold">💬 {lang === 'uz' ? 'Batafsil matn (ixtiyoriy)' : 'Описание (необязательно)'}</label>
                  <input
                    id="input-reminder-note"
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onFocus={(e) => {
                      setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
                    }}
                    placeholder="Tafsilotlarni kiriting..."
                    className="bg-slate-950 border-2 border-slate-850 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 font-medium text-white"
                  />
                </div>

                {/* 3. Assigned user */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-bold">👤 {lang === 'uz' ? 'Kimga yuborilsin?' : 'Кому напомнить?'}</label>
                  <select
                    id="select-reminder-assign"
                    value={newAssignedTo}
                    onChange={(e) => setNewAssignedTo(e.target.value)}
                    className="bg-slate-950 border-2 border-slate-850 text-xs text-white p-3 rounded-xl outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">👨‍👩‍👧 Hammaga (All Family)</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.avatar} {m.name} ({m.role === 'OWNER' ? '👑 Egasi' : m.role === 'CHILD' ? '👦 Bola' : '👤 A\'zo'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grid for schedule selection */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Quick Timer dates */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 font-bold">📅 {lang === 'uz' ? 'Qachon?' : 'Когда'}</label>
                    <select
                      id="select-reminder-time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="bg-slate-950 border-2 border-slate-850 text-xs text-white p-3 rounded-xl outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Bugun, 18:00">Bugun, 18:00</option>
                      <option value="Bugun, 21:00">Bugun, 21:00</option>
                      <option value="Ertaga, 09:00">Ertaga, 09:00</option>
                      <option value="3 kundan keyin, 19:30">3 kundan keyin, 19:30</option>
                    </select>
                  </div>

                  {/* Repeat config */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 font-bold">🔁 Takrorlanish</label>
                    <select
                      id="select-reminder-repeat"
                      value={newRepeat}
                      onChange={(e) => setNewRepeat(e.target.value)}
                      className="bg-slate-950 border-2 border-slate-850 text-xs text-white p-3 rounded-xl outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Bir marta">One-time</option>
                      <option value="Har kuni">Daily</option>
                      <option value="Har oy">Monthly</option>
                    </select>
                  </div>

                </div>

                {/* Submit trigger button */}
                <button
                  type="submit"
                  id="btn-reminder-submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-450 text-slate-950 py-3.5 rounded-xl text-sm font-black transition-all shadow-md active:scale-95 mt-2"
                >
                  🔔 {lang === 'uz' ? 'Eslatmani Faollashtirish' : 'Создать напоминание'}
                </button>

              </form>

            </motion.div>

            {showDiscardConfirm && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[999]" id="reminder-discard-confirm-dialog">
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
                      id="btn-reminder-confirm-keep"
                      onClick={() => setShowDiscardConfirm(false)}
                      className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-800"
                    >
                      {lang === 'uz' ? 'Tahrirlashda davom etish' : lang === 'ru' ? 'Продолжить' : 'Keep editing'}
                    </button>
                    <button
                      id="btn-reminder-confirm-discard"
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

        {/* CONFIRMATION DIALOG FOR ARCHIVING/DELETING */}
        {confirmAction && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 z-[110] cursor-pointer"
              onClick={() => setConfirmAction(null)}
              id="confirm-backdrop"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[30%] max-w-sm mx-auto bg-slate-900 border-2 border-slate-100 p-6 rounded-3xl z-[111] flex flex-col gap-4 text-center shadow-2xl animate-toast"
              id="confirm-dialog-wrapper"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center text-xl shrink-0 border border-slate-850">
                {confirmAction.type === 'delete' ? '🗑️' : '📥'}
              </div>

              <div>
                <h3 className="font-display font-medium text-lg text-white mb-2 leading-tight">
                  {confirmAction.type === 'delete' 
                    ? (lang === 'uz' ? 'Butunlay o\'chirish' : lang === 'ru' ? 'Удалить навсегда' : 'Delete Permanently')
                    : (lang === 'uz' ? 'O\'qildi deb belgilash' : lang === 'ru' ? 'Пометить как прочитанное' : 'Mark as Read')
                  }
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-normal mb-3">
                  {confirmAction.type === 'delete'
                    ? (lang === 'uz' 
                        ? 'Rostdan ham ushbu eslatmani butunlay o\'chirmoqchimisiz? Bu amalni ortga qaytarib bo\'lmaydi.' 
                        : lang === 'ru' 
                        ? 'Вы действительно хотите навсегда удалить это напоминание? Это действие необратимо.' 
                        : 'Are you sure you want to permanently delete this reminder? This action cannot be undone.')
                    : (lang === 'uz'
                        ? 'Ushbu eslatmani oila a\'zolari uchun yakunlangan/o\'qilgan deb belgilamoqchimisiz?'
                        : lang === 'ru'
                        ? 'Вы действительно хотите отметить это напоминание как прочитанное для всех членов семьи?'
                        : 'Do you want to mark this reminder as read and archive it?')
                  }
                </p>

                {/* Target Reminder Context (Calendar details included) */}
                {(() => {
                  const targetRem = reminders.find(r => r.id === confirmAction.id);
                  if (!targetRem) return null;
                  return (
                    <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl text-left flex flex-col gap-1">
                      <span className="text-xs font-bold text-white truncate">
                        📌 {targetRem.title}
                      </span>
                      {targetRem.note && (
                        <span className="text-[11px] text-slate-400 truncate">
                          📝 {targetRem.note}
                        </span>
                      )}
                      <span className="text-[10px] text-purple-400 font-bold flex items-center gap-1 mt-0.5 font-mono">
                        📅 {targetRem.time} {targetRem.repeat && `(${targetRem.repeat})`}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  id="btn-confirm-cancel"
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className="py-2.5 px-4 bg-slate-950 hover:bg-slate-850 text-slate-150 font-bold rounded-xl border border-slate-850 transition-all text-xs active:scale-95 cursor-pointer"
                >
                  {lang === 'uz' ? 'Bekor qilish' : lang === 'ru' ? 'Отмена' : 'Cancel'}
                </button>
                <button
                  id="btn-confirm-execute"
                  type="button"
                  onClick={() => {
                    if (confirmAction.type === 'delete') {
                      if (onDeleteReminder) {
                        onDeleteReminder(confirmAction.id);
                      }
                    } else {
                      onArchiveReminder(confirmAction.id);
                    }
                    setConfirmAction(null);
                  }}
                  className={`py-2.5 px-4 text-white font-bold rounded-xl transition-all text-xs active:scale-95 border border-slate-100/10 cursor-pointer ${
                    confirmAction.type === 'delete' 
                      ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                      : 'bg-emerald-500 hover:bg-emerald-450 text-slate-950'
                  }`}
                >
                  {confirmAction.type === 'delete'
                    ? (lang === 'uz' ? 'O\'chirish' : lang === 'ru' ? 'Удалить' : 'Delete')
                    : (lang === 'uz' ? 'Tasdiqlash' : lang === 'ru' ? 'Подтвердить' : 'Confirm')
                  }
                </button>
              </div>
            </motion.div>
          </>
        )}

      </AnimatePresence>

    </div>
  );
}
