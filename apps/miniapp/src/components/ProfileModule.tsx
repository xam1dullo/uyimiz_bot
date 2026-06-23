import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TranslationSet, FamilyMember, Birthday, Role, Language, Currency } from '../types';
import { FAQ_DATA } from '../data';
import { 
  Users, Gift, Bell, Globe, HelpCircle, LogOut, ChevronRight, 
  ArrowLeft, Award, Copy, Check, Share2, Plus, Trash2, X, Trophy, Sun, DollarSign
} from 'lucide-react';
import LeaderboardModule from './LeaderboardModule';

interface ProfileModuleProps {
  t: TranslationSet;
  role: Role;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currency?: Currency;
  onCurrencyChange?: (c: Currency) => void;
  currentUser: FamilyMember;
  members: FamilyMember[];
  birthdays: Birthday[];
  onAddBirthday: (birthday: Omit<Birthday, 'id' | 'daysLeft'>) => void;
  onDeleteBirthday: (id: string) => void;
  onResetApp: () => void;
  subSection?: 'main' | 'family' | 'birthdays' | 'help' | 'leaderboard';
  onSubSectionChange?: (sub: 'main' | 'family' | 'birthdays' | 'help' | 'leaderboard') => void;
  onRemoveMember?: (id: string) => void;
  onChangeMemberRole?: (id: string, newRole: Role) => void;
}

export default function ProfileModule({
  t,
  role,
  lang,
  onLanguageChange,
  currency,
  onCurrencyChange,
  currentUser,
  members,
  birthdays,
  onAddBirthday,
  onDeleteBirthday,
  onResetApp,
  subSection: propSubSection,
  onSubSectionChange,
  onRemoveMember,
  onChangeMemberRole
}: ProfileModuleProps) {
  // Navigation states within Me/Profile
  const [localSubSection, setLocalSubSection] = useState<'main' | 'family' | 'birthdays' | 'help' | 'leaderboard'>('main');

  const subSection = propSubSection !== undefined ? propSubSection : localSubSection;
  const setSubSection = (val: 'main' | 'family' | 'birthdays' | 'help' | 'leaderboard') => {
    if (onSubSectionChange) {
      onSubSectionChange(val);
    } else {
      setLocalSubSection(val);
    }
  };

  // Sheet states
  const [isLangSheetOpen, setIsLangSheetOpen] = useState(false);
  const [isCurrencySheetOpen, setIsCurrencySheetOpen] = useState(false);
  const [isBirthSheetOpen, setIsBirthSheetOpen] = useState(false);

  // New Birthday field states
  const [babyName, setBabyName] = useState('');
  const [babyRelation, setBabyRelation] = useState('Boshqa');
  const [babyDay, setBabyDay] = useState(1);
  const [babyMonth, setBabyMonth] = useState('iyun');
  const [babyAge, setBabyAge] = useState(25);

  // Copied indicator
  const [copiedLink, setCopiedLink] = useState(false);

  // Theme tracking state
  const [isLightMode, setIsLightMode] = useState(() => 
    typeof document !== 'undefined' && document.documentElement.classList.contains('theme-light')
  );

  const monthsList = [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 
    'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
  ];

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateBirthday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!babyName.trim()) return;

    onAddBirthday({
      name: babyName.trim(),
      relationship: babyRelation,
      date: `${babyDay}-${babyMonth}`,
      age: babyAge
    });

    forceCloseBirthSheet();
  };

  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const handleCloseBirthSheet = () => {
    const isDirty = babyName.trim() !== '' || babyRelation !== 'Boshqa' || babyDay !== 1 || babyMonth !== 'iyun' || babyAge !== 25;
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      forceCloseBirthSheet();
    }
  };

  const forceCloseBirthSheet = () => {
    setIsBirthSheetOpen(false);
    setShowDiscardConfirm(false);
    // Reset fields
    setBabyName('');
    setBabyRelation('Boshqa');
    setBabyDay(1);
    setBabyMonth('iyun');
    setBabyAge(25);
  };

  const onAttemptCloseRef = React.useRef(handleCloseBirthSheet);
  onAttemptCloseRef.current = handleCloseBirthSheet;

  React.useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.BackButton) {
      if (isBirthSheetOpen) {
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
  }, [isBirthSheetOpen]);

  return (
    <div id="profile_module_wrapper" className="flex flex-col h-full bg-slate-950 text-slate-100 pb-32 overflow-y-auto">
      
      {/* 1. MAIN PROFILE SECTION */}
      {subSection === 'main' && (
        <div className="px-3 pt-3 pb-8 flex flex-col gap-4">
          
          {/* Header banner layout */}
          <div className="flex flex-col items-center text-center mt-1 bg-gradient-to-b from-slate-900 to-slate-950 pt-4 pb-3 px-3 rounded-3xl border border-slate-900 shadow-md relative overflow-hidden">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-4xl shadow-inner border-2 border-slate-700/60 mb-2 scale-animation">
              {currentUser.avatar}
            </div>
            
            <h3 id="txt-profile-name" className="text-xl font-bold text-white tracking-tight leading-none mb-1">
              {currentUser.name}
            </h3>
            
            <p className="text-xs text-emerald-400/90 font-medium bg-emerald-500/10 py-1 px-3 rounded-full mt-1 border border-emerald-500/10">
              {currentUser.role === 'OWNER' ? '👑 ' + (lang === 'uz' ? 'Oila Egasi' : 'Владелец') : currentUser.role === 'CHILD' ? '👦 ' + (lang === 'uz' ? 'Bola' : 'Ребенок') : '👤 ' + (lang === 'uz' ? 'A\'zo' : 'Член семьи')}
            </p>

            {/* Quick stats grid below avatar (Zilola mock stats) */}
            <div className="grid grid-cols-3 gap-0 w-full border-t border-slate-850/60 pt-3 mt-3 text-center">
              <div className="flex flex-col items-center px-2">
                <span className="text-lg font-black text-white font-mono">{currentUser.points}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.pointsScore}</span>
              </div>
              <div className="flex flex-col items-center border-x border-slate-850/40 px-2">
                <span className="text-lg font-black text-white font-mono">47</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.tasksStat}</span>
              </div>
              <div className="flex flex-col items-center px-2">
                <span className="text-lg font-black text-white font-mono">12</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.remindersStat}</span>
              </div>
            </div>
          </div>

          {/* Settings Menu List options */}
          <div className="flex flex-col bg-slate-900/60 border border-slate-900/80 rounded-3xl overflow-hidden p-2">
            
            {/* Oila / FamilyMembers button (Hidden/Disabled for child based on role) */}
            {role !== 'CHILD' && (
              <button
                id="menu-btn-family"
                onClick={() => setSubSection('family')}
                className="w-full flex justify-between items-center py-3.5 px-3 hover:bg-slate-850 rounded-2xl text-left transition-all"
              >
                <span className="flex items-center gap-3 font-semibold text-sm text-slate-200">
                  <Users size={16} className="text-sky-400" /> {t.familySection}
                </span>
                <div className="flex items-center gap-1.5 font-sans">
                  <span className="text-xs text-slate-500 font-medium">{members.length} kishi</span>
                  <ChevronRight size={14} className="text-slate-600" />
                </div>
              </button>
            )}

            {/* Tug'ilgan kunlar / Birthdays menu item */}
            <button
              id="menu-btn-birthdays"
              onClick={() => setSubSection('birthdays')}
              className="w-full flex justify-between items-center py-3.5 px-3 hover:bg-slate-850 rounded-2xl text-left transition-all border-t border-slate-850/20"
            >
              <span className="flex items-center gap-3 font-semibold text-sm text-slate-200">
                <Gift size={16} className="text-rose-400" /> {t.birthdaysSection}
              </span>
              <div className="flex items-center gap-1.5 font-sans">
                <span className="text-xs text-slate-500 font-medium">{birthdays.length} ta</span>
                <ChevronRight size={14} className="text-slate-600" />
              </div>
            </button>

            {/* Theme Toggle Button */}
            <button
              id="menu-btn-theme"
              onClick={() => {
                const currentTheme = document.documentElement.classList.contains('theme-light') ? 'light' : 'editorial';
                const newTheme = currentTheme === 'light' ? 'editorial' : 'light';
                if (newTheme === 'light') {
                  document.documentElement.classList.add('theme-light');
                } else {
                  document.documentElement.classList.remove('theme-light');
                }
                localStorage.setItem('uy_theme', newTheme);
                // force re-render if needed, we'll just toggle local state too
                setIsLightMode(newTheme === 'light');
              }}
              className="w-full flex justify-between items-center py-3.5 px-3 hover:bg-slate-850 rounded-2xl text-left transition-all border-t border-slate-850/20"
            >
              <span className="flex items-center gap-3 font-semibold text-sm text-slate-200">
                <Sun size={16} className="text-amber-500" /> {lang === 'uz' ? 'Yorug\' yoki qorong\'u dizayn' : 'Светлая/Темная тема'}
              </span>
              <div className="flex items-center gap-1.5 font-sans">
                <span className="text-xs font-bold text-slate-400 uppercase">{isLightMode ? (lang === 'uz' ? 'Yorug\'' : 'Светлая') : (lang === 'uz' ? 'Qorong\'u' : 'Темная')}</span>
                <ChevronRight size={14} className="text-slate-600" />
              </div>
            </button>

            {/* Quick language toggle */}
            <button
              id="menu-btn-language"
              onClick={() => setIsLangSheetOpen(true)}
              className="w-full flex justify-between items-center py-3.5 px-3 hover:bg-slate-850 rounded-2xl text-left transition-all border-t border-slate-850/20"
            >
              <span className="flex items-center gap-3 font-semibold text-sm text-slate-200">
                <Globe size={16} className="text-emerald-400" /> {t.languageSection}
              </span>
              <div className="flex items-center gap-1.5 font-sans">
                <span className="text-xs font-bold text-slate-400 uppercase">{lang === 'uz' ? '🇺🇿 O\'zbek' : lang === 'ru' ? '🇷🇺 Рус' : '🇬🇧 Eng'}</span>
                <ChevronRight size={14} className="text-slate-600" />
              </div>
            </button>

            <button
              id="menu-btn-currency"
              onClick={() => setIsCurrencySheetOpen(true)}
              className="w-full flex justify-between items-center py-3.5 px-3 hover:bg-slate-850 rounded-2xl text-left transition-all border-t border-slate-850/20"
            >
              <span className="flex items-center gap-3 font-semibold text-sm text-slate-200">
                <DollarSign size={16} className="text-emerald-400" /> {lang === 'uz' ? 'Pul Birligi' : 'Валюта'}
              </span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-xs font-bold text-emerald-500 uppercase">{currency || 'UZS'}</span>
                <ChevronRight size={14} className="text-slate-600" />
              </div>
            </button>

            {/* Help / FAQ answers button */}
            <button
              id="menu-btn-help"
              onClick={() => setSubSection('help')}
              className="w-full flex justify-between items-center py-3.5 px-3 hover:bg-slate-850 rounded-2xl text-left transition-all border-t border-slate-850/20"
            >
              <span className="flex items-center gap-3 font-semibold text-sm text-slate-200">
                <HelpCircle size={16} className="text-amber-400" /> {t.helpSection}
              </span>
              <ChevronRight size={14} className="text-slate-600" />
            </button>

            {/* Leaderboard menu button for adults */}
            {role !== 'CHILD' && (
              <button
                id="menu-btn-leaderboard"
                onClick={() => setSubSection('leaderboard')}
                className="w-full flex justify-between items-center py-3.5 px-3 hover:bg-slate-850 rounded-2xl text-left transition-all border-t border-slate-850/20"
              >
                <span className="flex items-center gap-3 font-semibold text-sm text-slate-200">
                  <Trophy size={16} className="text-amber-450" /> {t.leaderboardTitle}
                </span>
                <ChevronRight size={14} className="text-slate-600" />
              </button>
            )}

          </div>

          {/* Reset App / LOGOUT Button */}
          <button
            id="btn-logout-app"
            onClick={onResetApp}
            className="w-full bg-slate-900 hover:bg-red-500/10 hover:border-red-500/40 border border-slate-800 text-red-400 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all mt-4 text-sm active:scale-98"
          >
            <LogOut size={16} /> {t.logoutBtn}
          </button>

        </div>
      )}

      {/* 2. FAMILY SUB-SECTION (PRD: Section 5.7 Owner list / edit) */}
      {subSection === 'family' && (
        <div id="section-family-members" className="p-4 flex flex-col gap-4">
          
          {/* Header row and back controller */}
          <div className="flex items-center gap-3 mb-2">
            <button
              id="btn-family-back"
              onClick={() => setSubSection('main')}
              className="p-2 bg-slate-900 border border-slate-850 rounded-xl hover:text-white transition-all text-slate-400 shrink-0"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="font-bold text-lg text-white font-sans">{t.familySection}</span>
          </div>

          {/* Members list view */}
          <div className="flex flex-col gap-2">
            {members.map(member => (
              <div
                key={member.id}
                className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm hover:border-slate-800 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-2xl border border-slate-700/65 shrink-0 select-none">
                    {member.avatar}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                      {member.name}
                      {member.isSelf && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 py-0.5 px-1.5 rounded uppercase">Men</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                      <span>{member.role === 'OWNER' ? '👑 Oila boshlig\'i (Owner)' : member.role === 'CHILD' ? '👦 Kichik farzand (Child)' : '👤 Oila a\'zosi (Member)'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Last Active visual badge (only shown if not owner editing this member) */}
                  {!(currentUser.role === 'OWNER' && !member.isSelf) && (
                    <span className={`text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap shrink-0 ${
                      member.lastActive === 'Online' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-950'
                    }`}>
                      {member.lastActive}
                    </span>
                  )}

                  {/* Owner actions */}
                  {currentUser.role === 'OWNER' && !member.isSelf && (
                    <div className="flex items-center gap-2">
                      <select
                        value={member.role}
                        id={`select-role-${member.id}`}
                        onChange={(e) => {
                          if (onChangeMemberRole) onChangeMemberRole(member.id, e.target.value as Role);
                        }}
                        className="bg-slate-950 text-white border border-slate-800 rounded-lg p-1 text-[10px] font-bold cursor-pointer"
                      >
                        <option value="OWNER">OWNER</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="CHILD">CHILD</option>
                      </select>

                      <button
                        id={`btn-remove-member-${member.id}`}
                        onClick={() => {
                          const confirmMsg = lang === 'uz' 
                            ? `Haqiqatan ham bu a'zoni oiladan o'chirmoqchimisiz?` 
                            : `Вы действительно хотите удалить этого участника из семьи?`;
                          if (confirm(confirmMsg)) {
                            if (onRemoveMember) onRemoveMember(member.id);
                          }
                        }}
                        className="text-slate-600 hover:text-red-400 p-1.5 rounded-lg border border-transparent hover:border-slate-800 transition-all shrink-0"
                        title={lang === 'uz' ? "O'chirish" : "Удалить"}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Invitation Copy Code Card for Owner (PRD: Section 5.7 / 14.2) */}
          {currentUser.role === 'OWNER' ? (
            <div id="card-owner-invite" className="bg-slate-900/40 border border-slate-900 p-5 rounded-3xl flex flex-col gap-3 mt-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>

              <div className="flex items-center gap-2">
                <span className="text-xl">🔗</span>
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">{t.inviteLinkTitle}</span>
              </div>

              <p className="text-xs text-slate-400 leading-normal">
                {lang === 'uz' 
                  ? "Yangi oila a'zolarini qo'shish uchun havolani (yoki UYZ129 kodini) yuboring:" 
                  : "Поделитесь ссылкой-приглашением, чтобы добавить новых участников в семью:"}
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-xs text-slate-300 break-all select-all flex items-center justify-between">
                <span>uyimiz.app/join/UYZ129</span>
                <button
                  id="btn-copy-invite-link"
                  onClick={handleCopyLink}
                  className="text-slate-500 hover:text-emerald-400 p-1 rounded-lg"
                  title={t.copyBtn}
                >
                  {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
              </div>

              {copiedLink && (
                <p className="text-[10px] text-emerald-400 font-bold -mt-1 pl-1">✓ {t.copiedMsg}</p>
              )}

              <div className="flex gap-2 w-full mt-1">
                <button
                  id="btn-share-invite-link"
                  onClick={() => alert('Invited link shared via Telegram share! Code: UYZ129')}
                  className="w-full bg-slate-850 hover:bg-slate-800 text-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-800 flex items-center justify-center gap-1.5"
                >
                  <Share2 size={13} /> {t.shareBtn}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/20 p-4 border border-slate-900 rounded-2xl text-xs text-slate-500 italic mt-3">
              🔒 {t.ownerOnlyMsg}
            </div>
          )}

        </div>
      )}

      {/* 3. BIRTHDAYS SUB-SECTION */}
      {subSection === 'birthdays' && (
        <div id="section-birthdays" className="p-4 flex flex-col gap-4">
          
          {/* Header title controller */}
          <div className="flex items-center justify-between gap-3 mb-2 shrink-0">
            <div className="flex items-center gap-3">
              <button
                id="btn-birthdays-back"
                onClick={() => setSubSection('main')}
                className="p-2 bg-slate-900 border border-slate-850 rounded-xl hover:text-white transition-all text-slate-400 shrink-0"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="font-bold text-lg text-white font-sans">{t.birthdaysSection}</span>
            </div>
            
            <button
              id="btn-trigger-add-birthday"
              onClick={() => setIsBirthSheetOpen(true)}
              className="text-xs bg-emerald-500 hover:bg-emerald-450 text-slate-950 py-1.5 px-3 rounded-lg font-black flex items-center gap-1 transition-all"
            >
              <Plus size={14} className="stroke-[3px]" /> Qo'shish
            </button>
          </div>

          {/* Birthdays lists container (PRD: Section 5.6) */}
          <div className="flex flex-col gap-2">
            {[...birthdays].sort((a, b) => a.daysLeft - b.daysLeft).map(birth => {
              return (
                <div
                  key={birth.id}
                  id={`birthday-detail-card-${birth.id}`}
                  className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-800 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-xl shrink-0">
                      🎂
                    </span>
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-slate-100 flex items-center gap-2 truncate">
                        {birth.name}
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-1000 py-0.5 px-1.5 rounded uppercase font-mono">
                          {birth.relationship}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Sana: <strong className="text-slate-300 font-medium">{birth.date}</strong> · <span className="text-rose-400/80 font-medium">{birth.age} yoshga to'ladi</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="py-1.5 px-3 text-xs font-bold text-rose-400 bg-rose-500/10 rounded-full border border-rose-500/15 whitespace-nowrap leading-none flex items-center">
                      {birth.daysLeft} {t.daysLeftText}
                    </span>
                    
                    <button
                      id={`btn-delete-birthday-${birth.id}`}
                      onClick={() => {
                        if (confirm('Rostdan ham o\'chirib tashlamoqchimisiz?')) {
                          onDeleteBirthday(birth.id);
                        }
                      }}
                      className="text-slate-600 hover:text-red-400 p-1.5 rounded-lg"
                      title={t.deleteText}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 4. HELP / FAQ SUB-SECTION */}
      {subSection === 'help' && (
        <div id="section-help-faq" className="p-4 flex flex-col gap-4">
          
          <div className="flex items-center gap-3 mb-2">
            <button
              id="btn-help-back"
              onClick={() => setSubSection('main')}
              className="p-2 bg-slate-900 border border-slate-850 rounded-xl hover:text-white transition-all text-slate-400 shrink-0"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="font-bold text-lg text-white font-sans">{t.helpSection}</span>
          </div>

          <div id="faq-accordions" className="flex flex-col gap-3">
            {FAQ_DATA.map((faq, index) => {
              return (
                <div
                  key={index}
                  className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col gap-2.5 shadow-sm"
                >
                  <h4 className="text-sm font-bold text-white flex gap-2">
                    <span className="text-amber-400">❓</span> {faq.q}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed border-t border-slate-850/60 pt-2 pl-6">
                    {faq.a}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 5. LEADERBOARD SUB-SECTION */}
      {subSection === 'leaderboard' && (
        <div id="section-leaderboard" className="p-4 flex flex-col gap-4 h-full">
          <div className="flex items-center gap-3 mb-2">
            <button
              id="btn-leaderboard-back"
              onClick={() => setSubSection('main')}
              className="p-2 bg-slate-900 border border-slate-850 rounded-xl hover:text-white transition-all text-slate-400 shrink-0"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="font-bold text-lg text-white font-sans">{t.leaderboardTitle}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <LeaderboardModule t={t} lang={lang} members={members} />
          </div>
        </div>
      )}

      {/* CURRENCY BOTTOM SHEET SELECTION WIDGET */}
      <AnimatePresence>
        {isCurrencySheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 z-[100] cursor-pointer"
              onClick={() => setIsCurrencySheetOpen(false)}
            ></motion.div>

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 z-[101] flex flex-col gap-3 text-left"
            >
              <div className="w-20 h-2 bg-slate-700/60 rounded-full mx-auto my-3 shrink-0"></div>
              
              <div className="flex justify-between items-center text-sm font-bold border-b border-slate-850 pb-2">
                <span className="text-white">💲 {lang === 'uz' ? 'Pul birligini tanlang' : 'Выберите валюту'}</span>
                <button onClick={() => setIsCurrencySheetOpen(false)} className="text-slate-500">✕</button>
              </div>

              <div className="flex flex-col gap-2 py-2">
                {[
                  { id: 'UZS', label: 'UZS (So\'m)' },
                  { id: 'USD', label: 'USD ($)' },
                  { id: 'RUB', label: 'RUB (₽)' },
                  { id: 'EUR', label: 'EUR (€)' }
                ].map(curr => (
                  <button
                    key={curr.id}
                    onClick={() => {
                      if (onCurrencyChange) onCurrencyChange(curr.id as Currency);
                      setIsCurrencySheetOpen(false);
                    }}
                    className={`w-full flex justify-between items-center bg-slate-950 p-4 rounded-xl border transition-all ${currency === curr.id ? 'border-emerald-500 shadow-md scale-[1.02]' : 'border-slate-800 hover:border-slate-700'}`}
                  >
                    <span className="font-bold text-slate-200">{curr.label}</span>
                    {currency === curr.id && <span className="text-emerald-400">✓</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PRIMARY LANGUAGES BOTTOM SHEET SELECTION WIDGET */}
      <AnimatePresence>
        {isLangSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 z-[100] cursor-pointer"
              onClick={() => setIsLangSheetOpen(false)}
              id="sheet-backdrop-lang"
            ></motion.div>

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 z-[101] flex flex-col gap-3 text-left"
              id="sheet-lang-options"
            >
              <div className="w-20 h-2 bg-slate-700/60 rounded-full mx-auto my-3 shrink-0"></div>
              
              <div className="flex justify-between items-center text-sm font-bold border-b border-slate-850 pb-2">
                <span className="text-white">🌐 {t.chooseLang}</span>
                <button onClick={() => setIsLangSheetOpen(false)} className="text-slate-500">✕</button>
              </div>

              <div className="flex flex-col gap-2 py-2">
                <button
                  id="btn-lang-sel-uz"
                  onClick={() => {
                    onLanguageChange('uz');
                    setIsLangSheetOpen(false);
                  }}
                  className={`py-3 px-4 rounded-xl flex justify-between font-bold text-sm transition-all ${
                    lang === 'uz' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <span>🇺🇿 O'zbekcha</span>
                  {lang === 'uz' && <span>✓</span>}
                </button>

                <button
                  id="btn-lang-sel-ru"
                  onClick={() => {
                    onLanguageChange('ru');
                    setIsLangSheetOpen(false);
                  }}
                  className={`py-3 px-4 rounded-xl flex justify-between font-bold text-sm transition-all ${
                    lang === 'ru' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <span>🇷🇺 Русский</span>
                  {lang === 'ru' && <span>✓</span>}
                </button>

                <button
                  id="btn-lang-sel-en"
                  onClick={() => {
                    onLanguageChange('en');
                    setIsLangSheetOpen(false);
                  }}
                  className={`py-3 px-4 rounded-xl flex justify-between font-bold text-sm transition-all ${
                    lang === 'en' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <span>🇬🇧 English</span>
                  {lang === 'en' && <span>✓</span>}
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* MOCK BIRTHDAYS ADDER DRAWER SHEET */}
        {isBirthSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 z-[100] cursor-pointer"
              onClick={handleCloseBirthSheet}
              id="sheet-backdrop-birth"
            ></motion.div>

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 border-t border-slate-800 rounded-t-3xl z-[101] overflow-hidden flex flex-col max-h-[90vh]"
              id="sheet-birthday-adder"
            >
              <div className="w-full flex justify-center py-4 shrink-0">
                <div className="w-20 h-2 bg-slate-700/60 rounded-full cursor-row-resize" onClick={handleCloseBirthSheet}></div>
              </div>

              <div className="px-5 pb-3 border-b border-slate-850 flex justify-between items-center font-bold">
                <span className="text-sm font-extrabold text-white">🍰 {lang === 'uz' ? 'Tug\'ilgan kun kiritish' : 'Добавить день рождения'}</span>
                <button
                  onClick={handleCloseBirthSheet}
                  className="text-slate-500 hover:text-white p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateBirthday} className="p-5 overflow-y-auto flex flex-col gap-4">
                
                {/* Ism */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-bold">👤 {lang === 'uz' ? 'Ism sharifi' : 'Имя'}</label>
                  <input
                    id="input-birth-name"
                    type="text"
                    required
                    value={babyName}
                    onChange={(e) => setBabyName(e.target.value)}
                    onFocus={(e) => {
                      setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
                    }}
                    placeholder="Masalan: Nilufar, Mahmud amaki..."
                    className="bg-slate-950 border-2 border-slate-850 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 font-medium text-white"
                  />
                </div>

                {/* Kim? Relationship */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-bold">👥 Kim? (Qarindoshlik)</label>
                  <select
                    id="select-birth-relation"
                    value={babyRelation}
                    onChange={(e) => setBabyRelation(e.target.value)}
                    className="bg-slate-950 border-2 border-slate-850 text-xs text-white p-3 rounded-xl outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Ota">Ota</option>
                    <option value="Ona">Ona</option>
                    <option value="Aka/opa">Aka / Opa</option>
                    <option value="Do'st">Do'st</option>
                    <option value="Buvi/Bobo">Buvi / Bobo</option>
                    <option value="Boshqa">Boshqa</option>
                  </select>
                </div>

                {/* Date splits Day & Month */}
                <div className="grid grid-cols-2 gap-3 font-semibold">
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 font-bold">📅 Kun</label>
                    <select
                      value={babyDay}
                      onChange={(e) => setBabyDay(parseInt(e.target.value))}
                      className="bg-slate-950 border-2 border-slate-850 text-xs text-white p-2.5 rounded-xl cursor-pointer"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 font-bold">📅 Oy</label>
                    <select
                      value={babyMonth}
                      onChange={(e) => setBabyMonth(e.target.value)}
                      className="bg-slate-950 border-2 border-slate-850 text-xs text-white p-2.5 rounded-xl cursor-pointer text-capitalize"
                    >
                      {monthsList.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Expected turning age */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-bold">⭐ {lang === 'uz' ? 'Necha yoshga to\'ladi?' : 'Сколько исполнится?'}</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={babyAge}
                    onChange={(e) => setBabyAge(parseInt(e.target.value))}
                    onFocus={(e) => {
                      setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
                    }}
                    className="bg-slate-950 border-2 border-slate-850 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 font-bold text-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  id="submit-birthday-add"
                  className="w-full bg-emerald-500 hover:bg-emerald-450 text-slate-950 py-3.5 rounded-xl text-sm font-black transition-all shadow-md mt-2"
                >
                  🎉 {lang === 'uz' ? 'Tug\'ilgan kunni saqlash' : 'Сохранить день рождения'}
                </button>

              </form>

            </motion.div>

            {showDiscardConfirm && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[999]" id="birth-discard-confirm-dialog">
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
                      id="btn-birth-confirm-keep"
                      onClick={() => setShowDiscardConfirm(false)}
                      className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-800"
                    >
                      {lang === 'uz' ? 'Tahrirlashda davom etish' : lang === 'ru' ? 'Продолжить' : 'Keep editing'}
                    </button>
                    <button
                      id="btn-birth-confirm-discard"
                      onClick={forceCloseBirthSheet}
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
