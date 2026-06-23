import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Role, FamilyMember } from './types';
import { TRANSLATIONS, INITIAL_MEMBERS, INITIAL_BUDGET, INITIAL_TASKS, INITIAL_REMINDERS, INITIAL_BIRTHDAYS } from './data';

import Onboarding from './components/Onboarding';
import LoginPortal from './components/LoginPortal';
import Dashboard from './components/Dashboard';
import BudgetModule from './components/BudgetModule';
import TasksModule from './components/TasksModule';
import RemindersModule from './components/RemindersModule';
import ProfileModule from './components/ProfileModule';
import LeaderboardModule from './components/LeaderboardModule';

import { 
  Home, CreditCard, CheckSquare, Bell, User, Trophy
} from 'lucide-react';

import { useAppState } from './hooks/useAppState';
import { useTimeClock } from './hooks/useTimeClock';
import { useTaskAlarm } from './hooks/useTaskAlarm';
import { useAppHandlers } from './hooks/useAppHandlers';

export default function App() {
  const {
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
  } = useAppState();

  const [activeTab, setActiveTab ] = useState<number>(0);
  const [profileSubSection, setProfileSubSection] = useState<'main' | 'family' | 'birthdays' | 'help' | 'leaderboard'>('main');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [confettiBurst, setConfettiBurst] = useState<boolean>(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'onboarding'>('login');
  
  const [externalAddFABAction, setExternalAddFABAction] = useState<'expense' | 'task' | 'reminder' | null>(null);

  const { timeClock, setTimeClock } = useTimeClock();

  const t = (TRANSLATIONS[lang] ?? TRANSLATIONS.uz)!;

  const handleSetTab = (idx: number, subSec?: 'main' | 'family' | 'birthdays' | 'help' | 'leaderboard') => {
    setActiveTab(idx);
    if (subSec) {
      setProfileSubSection(subSec);
    } else {
      setProfileSubSection('main');
    }
  };

  useEffect(() => {
    // Reset profile subsection if not on the Profile tab
    const profileTabIdx = simulatedRole === 'CHILD' ? 3 : 4;
    if (activeTab !== profileTabIdx) {
      setProfileSubSection('main');
    }
  }, [activeTab, simulatedRole]);

  const getCurrentUser = (): FamilyMember => {
    const found = members.find(m => m.role === simulatedRole);
    return found || members[0] || { id: '1', name: 'User', role: 'OWNER', avatar: '👑', points: 0, lastActive: 'Online' };
  };

  const currentUser = getCurrentUser();

  const { activeTaskAlarm, setActiveTaskAlarm, setNotifiedTaskIds } = useTaskAlarm(
    isOnboarded, timeClock, tasks, simulatedRole, currentUser
  );

  const {
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
  } = useAppHandlers({
    lang, setLang, currency, setCurrency, simulatedRole, setSimulatedRole,
    familyName, setFamilyName, members, setMembers,
    budgetEntries, setBudgetEntries, tasks, setTasks,
    reminders, setReminders, birthdays, setBirthdays,
    setIsOnboarded, setAuthScreen, setActiveTab,
    setActiveTaskAlarm, setNotifiedTaskIds, setToastMessage,
    setConfettiBurst, currentUser
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Navigation Setup depending on Simulated Role

  // - CHILD: Bosh (0), Vazifalar (1), Reyting (2), Men (3)
  // - Others: Bosh (0), Byudjet (1), Vazifalar (2), Eslatmalar (3), Men (4)
  const getTabsConfig = () => {
    const allTabs = [
      { id: 'dashboard', label: t.tabHome, icon: Home },
      { id: 'budget', label: t.tabBudget, icon: CreditCard, hideFor: ['CHILD'] },
      { id: 'tasks', label: simulatedRole === 'CHILD' ? t.childOnlyTasks : t.tabTasks, icon: CheckSquare },
      { id: 'reminders', label: t.tabReminders, icon: Bell, hideFor: ['CHILD'] },
      { id: 'rating', label: t.tabRating, icon: Trophy, showFor: ['CHILD'] },
      { id: 'profile', label: t.tabMe, icon: User }
    ];

    return allTabs.filter(tab => {
      if (tab.hideFor?.includes(simulatedRole)) return false;
      if (tab.showFor && !tab.showFor.includes(simulatedRole)) return false;
      return true;
    });
  };

  const tabsConfig = getTabsConfig();

  // Render proper module workspace depending on currently active tab
  const renderTabContent = () => {
    const currentTabId = tabsConfig[activeTab]?.id || 'dashboard';

    switch (currentTabId) {
      case 'dashboard':
        return (
          <Dashboard
            t={t}
            lang={lang}
            currency={currency}
            userName={currentUser.name}
            familyName={familyName}
            role={simulatedRole}
            members={members}
            budgetEntries={budgetEntries}
            tasks={tasks}
            reminders={reminders}
            birthdays={birthdays}
            onSetTab={handleSetTab}
            onCompleteTask={handleCompleteTask}
            onOpenFABAction={(action) => {
              setExternalAddFABAction(action);
              if (action === 'expense') {
                const idx = tabsConfig.findIndex((t: any) => t.id === 'budget');
                if (idx !== -1) setActiveTab(idx);
              }
              if (action === 'task') {
                const idx = tabsConfig.findIndex((t: any) => t.id === 'tasks');
                if (idx !== -1) setActiveTab(idx);
              }
              if (action === 'reminder') {
                const idx = tabsConfig.findIndex((t: any) => t.id === 'reminders');
                if (idx !== -1) setActiveTab(idx);
              }
            }}
          />
        );
      case 'budget':
        return (
          <BudgetModule
            t={t}
            role={simulatedRole}
            lang={lang}
            currency={currency}
            members={members}
            entries={budgetEntries}
            currentUser={currentUser}
            onAddEntry={handleAddBudgetEntry}
            onDeleteEntry={handleDeleteBudgetEntry}
            isAddSheetOpenInitially={externalAddFABAction === 'expense'}
            onCloseAddSheetInitially={() => setExternalAddFABAction(null)}
          />
        );
      case 'tasks':
        return (
          <TasksModule
            t={t}
            role={simulatedRole}
            lang={lang}
            members={members}
            tasks={tasks}
            currentUser={currentUser}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onCompleteTask={handleCompleteTask}
            isAddSheetOpenInitially={externalAddFABAction === 'task'}
            onCloseAddSheetInitially={() => setExternalAddFABAction(null)}
          />
        );
      case 'reminders':
        return (
          <RemindersModule
            t={t}
            role={simulatedRole}
            lang={lang}
            members={members}
            reminders={reminders}
            currentUser={currentUser}
            onAddReminder={handleAddReminder}
            onEditReminder={handleEditReminder}
            onSnoozeReminder={handleSnoozeReminder}
            onArchiveReminder={handleArchiveReminder}
            onDeleteReminder={handleDeleteReminder}
            isAddSheetOpenInitially={externalAddFABAction === 'reminder'}
            onCloseAddSheetInitially={() => setExternalAddFABAction(null)}
          />
        );
      case 'rating':
        return <LeaderboardModule t={t} lang={lang} members={members} />;
      case 'profile':
        return (
          <ProfileModule
            t={t}
            role={simulatedRole}
            lang={lang}
            onLanguageChange={setLang}
            currency={currency}
            onCurrencyChange={setCurrency}
            currentUser={currentUser}
            members={members}
            birthdays={birthdays}
            onAddBirthday={handleAddBirthday}
            onDeleteBirthday={handleDeleteBirthday}
            onResetApp={handleResetApp}
            subSection={profileSubSection}
            onSubSectionChange={setProfileSubSection}
            onRemoveMember={handleRemoveMember}
            onChangeMemberRole={handleChangeMemberRole}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div id="full-viewport-app" className="h-[100dvh] w-full bg-slate-950 text-slate-100 font-sans flex flex-col antialiased select-none overflow-hidden relative">
      
      {/* DYNAMIC WORKSPACE SCREEN */}
      <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col min-h-0">
        
        {/* Confetti canvas-free visual splash */}
        {confettiBurst && (
          <div className="absolute inset-0 pointer-events-none z-[100] flex justify-center items-center overflow-hidden">
            <div className="relative w-40 h-40">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const r = 40 + Math.random() * 40;
                const dx = Math.cos(angle) * r;
                const dy = Math.sin(angle) * r;
                const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#f43f5e', '#a855f7'];
                const randColor = colors[Math.floor(Math.random() * colors.length)];
                return (
                  <div
                    key={i}
                    className="absolute w-2 h-4 rounded-full opacity-0 animate-confetti"
                    style={{
                      left: '50%',
                      top: '50%',
                      backgroundColor: randColor,
                      animationDelay: `${Math.random() * 0.15}s`,
                      transform: `translate(${dx}px, ${dy}px) rotate(${Math.random() * 360}deg)`
                    }}
                  ></div>
                );
              })}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl animate-toast bg-emerald-500/95 py-2 px-4 shadow-xl text-slate-900 font-extrabold rounded-2xl border-2 border-emerald-400 animate-pulse-subtle">
                  {lang === 'uz' ? '🏅 Muvaffaqiyat!' : '🏅 Успех!'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Custom Interactive dynamic toast drawer alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg border border-emerald-400 z-[120] text-center whitespace-nowrap"
              id="global-toast-notification"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Interactive Task Alarm push notification card */}
        <AnimatePresence>
          {activeTaskAlarm && (
            <>
              {/* Backdrop overlay blur only inside the phone glass screen */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs z-[100]"
                onClick={() => setActiveTaskAlarm(null)}
              />

              {/* Elegant push banner container */}
              <motion.div
                initial={{ opacity: 0, y: -100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -100, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="absolute top-3 left-3 right-3 bg-slate-900/95 border-2 border-amber-500/40 rounded-2xl p-4.5 shadow-2xl z-[101] flex flex-col gap-3.5"
                id="due-task-alarm-popup"
              >
                {/* Header line */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold text-xs tracking-wide">
                    <span className="animate-bounce">⏰</span>
                    {lang === 'uz' ? "Vazifa muddati keldi!" : "Срок задачи наступил!"}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 bg-slate-950 py-0.5 px-2 rounded-full border border-slate-850">
                    {timeClock}
                  </span>
                </div>

                {/* Task Title & Meta Row */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-xl rounded-xl flex items-center justify-center shrink-0">
                    {activeTaskAlarm.category}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-white leading-normal truncate">
                      {activeTaskAlarm.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-semibold">
                      👤 {activeTaskAlarm.assignedTo === 'all' 
                        ? (lang === 'uz' ? "Oila umumiy" : "Общее для всех") 
                        : (lang === 'uz' ? "Sizga yuklatilgan" : "Назначено вам")}
                    </p>
                  </div>
                </div>

                {/* Points visual pill */}
                <div className="bg-slate-950 border border-slate-850 p-2 rounded-xl flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold">{lang === 'uz' ? "Mukofot balli" : "Награда за выполнение"}</span>
                  <span className="text-amber-400 font-black flex items-center gap-1">
                    ⭐ +{activeTaskAlarm.points} XP
                  </span>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <button
                    id="btn-alarm-dismiss"
                    onClick={() => setActiveTaskAlarm(null)}
                    className="py-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer text-center"
                  >
                    {lang === 'uz' ? "Yopish" : "Закрыть"}
                  </button>
                  <button
                    id="btn-alarm-complete"
                    onClick={() => {
                      const taskId = activeTaskAlarm.id;
                      handleCompleteTask(taskId);
                      setActiveTaskAlarm(null);
                    }}
                    className="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/10 transition-all active:scale-95 cursor-pointer text-center"
                  >
                    {lang === 'uz' ? "Bajardim " : "Выполнил "}✓
                  </button>
                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Dynamic component routing according to Onboarding State */}
        {!isOnboarded ? (
          authScreen === 'login' ? (
            <LoginPortal
              lang={lang}
              onLanguageChange={setLang}
              onLoginComplete={handleLoginComplete}
              onToggleOnboarding={() => setAuthScreen('onboarding')}
            />
          ) : (
            <div className="h-full flex flex-col justify-between">
              <div className="p-3 bg-slate-900 border-b border-slate-850 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold text-slate-300">🏡 Oila yaratish makoni</span>
                <button
                  id="btn-back-to-login"
                  onClick={() => setAuthScreen('login')}
                  className="px-3 py-1 bg-slate-950 hover:bg-slate-800 text-emerald-400 font-bold rounded-lg text-[10px] transition-all cursor-pointer"
                >
                  🔐 {lang === 'uz' ? 'Tizimga kirish' : 'Вход в систему'}
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <Onboarding
                  t={t}
                  lang={lang}
                  onLanguageChange={setLang}
                  onComplete={handleCompleteOnboarding}
                />
              </div>
            </div>
          )
        ) : (
          renderTabContent()
        )}

      </div>

      {/* FOOTER BOTTOM NAVIGATION PANELS (PRD: Section 4.1) */}
      {isOnboarded && (
        <div 
          id="simulated-bottom-navigation" 
          className="shrink-0 z-[100] relative select-none flex justify-center w-full"
          style={{
            background: 'rgba(15, 20, 28, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)'
          }}
        >
          <div
            style={{
              paddingTop: '8px',
              paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))',
              maxWidth: '480px',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}
          >
            {tabsConfig.map((tab, idx) => {
              const isActive = activeTab === idx;
              const strokeColor = isActive ? "#34d399" : "#6b7280";
              const fillColor = isActive ? "rgba(52, 211, 153, 0.13)" : "none";
              
              let svgContent = null;
              if (tab.icon === Home) {
                svgContent = (
                  <>
                    <path d="M4 10.5L11 3.5L18 10.5" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 9.5V19C6 19.5523 6.44772 20 7 20H9.5V15H12.5V20H15C15.5523 20 16 19.5523 16 19V9.5" fill={fillColor} stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                );
              } else if (tab.icon === CreditCard) {
                svgContent = (
                  <>
                    <rect x="2" y="5" width="18" height="13" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 10.5H20" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="6.5" cy="14.5" r="1.2" fill={strokeColor} />
                  </>
                );
              } else if (tab.icon === CheckSquare) {
                svgContent = (
                  <>
                    <path d="M14 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V7L14 3Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 8H13" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 12H11" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 16.5L10 18L14 13.5" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                );
              } else if (tab.icon === Bell) {
                svgContent = (
                  <>
                    <path d="M6 16C6 12 7.5 11 7.5 8C7.5 5.5 9 4 11 4C13 4 14.5 5.5 14.5 8C14.5 11 16 12 16 16H6Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.5 16H17.5" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="11" cy="2.5" r="1.2" fill={strokeColor} />
                    <path d="M9 16.5C9.27614 17.8807 10.4284 18.5 11 18.5C11.5716 18.5 12.7239 17.8807 13 16.5" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                );
              } else if (tab.icon === User) {
                svgContent = (
                  <>
                    <circle cx="11" cy="7" r="3.5" fill={fillColor} stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.5 19.5C4.5 15.5 7 13.5 11 13.5C15 13.5 17.5 15.5 17.5 19.5" fill={fillColor} stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                );
              } else {
                svgContent = (
                  <>
                    <path d="M7 4H15" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 4C7 8 8 13.5 11 13.5C14 13.5 15 8 15 4" fill={fillColor} stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 5H4.5C3.67157 5 3 5.67157 3 6.5C3 8 4.5 10 6.5 10H7.5" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 5H17.5C18.3284 5 19 5.67157 19 6.5C19 8 17.5 10 15.5 10H14.5" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 13.5V18" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 18H14" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                );
              }

              return (
                <button
                  key={tab.label}
                  onClick={() => {
                    setActiveTab(idx);
                    setExternalAddFABAction(null);
                  }}
                  style={{
                    border: 'none',
                    background: isActive ? 'rgba(52, 211, 153, 0.08)' : 'transparent',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    padding: '6px 12px',
                    minWidth: '56px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <div style={{
                    transition: 'transform 0.18s ease',
                    transform: isActive ? 'translateY(-1px)' : 'translateY(0)'
                  }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {svgContent}
                    </svg>
                  </div>
                  <span 
                    style={{
                      fontSize: '11px',
                      marginTop: '3px',
                      color: isActive ? '#34d399' : '#6b7280',
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: isActive ? '0.01em' : 'normal',
                      lineHeight: 1,
                      transition: 'all 0.18s ease'
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* FLOATING TWEAK MENU (For switching roles/colors in production testing) */}
      <div className="fixed top-4 right-4 z-[999] opacity-30 hover:opacity-100 transition-opacity">
        <div className="bg-slate-900/90 backdrop-blur border border-slate-800 p-2 rounded-2xl shadow-2xl flex flex-col gap-2">
          <span className="text-[8px] font-black text-slate-500 uppercase px-1 text-center">Tweak Setup</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => { setSimulatedRole('OWNER'); showToast('Role: OWNER 👑'); }}
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs border ${simulatedRole === 'OWNER' ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-slate-950 border-slate-800'}`}
              title="OWNER Role"
            >👑</button>
            <button
              onClick={() => { setSimulatedRole('MEMBER'); showToast('Role: MEMBER 👤'); }}
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs border ${simulatedRole === 'MEMBER' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-slate-950 border-slate-800'}`}
              title="MEMBER Role"
            >👤</button>
            <button
              onClick={() => { 
                setSimulatedRole('CHILD'); 
                if (activeTab === 1 || activeTab === 3) setActiveTab(0);
                if (activeTab === 4) setActiveTab(3);
                showToast('Role: CHILD 👦'); 
              }}
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs border ${simulatedRole === 'CHILD' ? 'bg-amber-500/20 border-amber-500/50' : 'bg-slate-950 border-slate-800'}`}
              title="CHILD Role"
            >👦</button>
          </div>
        </div>
      </div>

    </div>
  );
}
