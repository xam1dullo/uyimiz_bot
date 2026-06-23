import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Role, Language } from '../types';
import { 
  Key, ShieldCheck, Trophy, Sparkles, LogIn, Send, 
  AlertTriangle, Smartphone, User, Lock, CheckCircle2 
} from 'lucide-react';

interface LoginPortalProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginComplete: (role: Role, familyName: string, userName: string, customAvatar: string) => void;
  onToggleOnboarding?: () => void;
}

export default function LoginPortal({ lang, onLanguageChange, onLoginComplete, onToggleOnboarding }: LoginPortalProps) {
  const [activeTab, setActiveTab] = useState<'demo' | 'password' | 'telegram'>('demo');
  
  // Custom login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Telegram auth custom simulator states
  const [telegramStep, setTelegramStep] = useState<'idle' | 'linking' | 'success'>('idle');
  const [tgName, setTgName] = useState('Hamidullo_Uz');
  const [tgRole, setTgRole] = useState<Role>('MEMBER');

  const t = {
    uz: {
      title: "Gateway orqali kirish",
      sub: "Kiring va oilaviy raqamli makoningizni boshqaring",
      langSelector: "Tizim tili",
      demoTitle: "🚀 Tezkor Demo Rejim",
      demoDesc: "Siz uchun maxsus oldindan tayyorlangan rollardan birini faollashtiring:",
      roleOwner: "Zilola (Oila boshlig'i)",
      roleOwnerDesc: "Moliyaviy hisobotlar, vazifalar yaratish va cheksiz boshqaruv ruxsati",
      roleMember: "Jasur (Oila a'zosi)",
      roleMemberDesc: "Kunlik xarajatlar kiritish, topshiriqlar bajarish va eslatmalar ko'rish",
      roleChild: "Sarvar (Farzand roli)",
      roleChildDesc: "Soddalashtirilgan reyting va o'yin-kulgi ko'rinishidgai vazifalar zali",
      passTitle: "🔐 Login va Parol (Demosiz)",
      passDesc: "Barcha ma'lumotlaringizni noldan boshlash uchun o'z hisobingizga kiring:",
      passHint: "Mavjud hisoblar test uchun: login 'admin', 'jasur' yoki 'sarvar' parol esa '12345'",
      userPlaceholder: "Login yoki telefon raqam...",
      passPlaceholder: "Maxfiy parolingiz...",
      submitBtn: "Tizimga xavfsiz kirish",
      tgTitle: "📱 Telegram Widget Login",
      tgDesc: "Telegram WebApp orqali avtomatik identifikatsiyani faollashtiring:",
      tgConnectBtn: "Telegram orqali ulanish",
      tgLinking: "Tasdiqlanmoqda, biroz kuting...",
      tgSuccess: "Mini App muvaffaqiyatli bog'landi!",
      tgFinishBtn: "Mini Appga kirish 🚀",
      errorEmpty: "Iltimos, barcha maydonlarni to'ldiring",
      errorWrong: "Login yoki parol noto'g'ri (Maslahat: parolni '12345' qiling)",
    },
    ru: {
      title: "Вход в систему",
      sub: "Войдите и управляйте своим цифровым семейным пространством",
      langSelector: "Язык интерфейса",
      demoTitle: "🚀 Быстрый Демо Режим",
      demoDesc: "Активируйте одну из специально подготовленных демо-ролей:",
      roleOwner: "Зилола (Глава семьи)",
      roleOwnerDesc: "Финансовые отчеты, создание задач и неограниченный доступ",
      roleMember: "Жасур (Член семьи)",
      roleMemberDesc: "Ввод расходов, выполнение поручений и просмотр напоминаний",
      roleChild: "Сарвар (Ребенок)",
      roleChildDesc: "Геймифицированный зал задач, баллы рейтинга и награды",
      passTitle: "🔐 Логин и Пароль",
      passDesc: "Войдите в систему для создания чистой базы или под учетными записями:",
      passHint: "Для теста: логин 'admin', 'jasur' или 'sarvar', пароль '12345'",
      userPlaceholder: "Логин или номер телефона...",
      passPlaceholder: "Ваш секретный пароль...",
      submitBtn: "Безопасный вход",
      tgTitle: "📱 Вход через Telegram Widget",
      tgDesc: "Активируйте автоматическую авторизацию через Telegram WebApp:",
      tgConnectBtn: "Подключить через Telegram",
      tgLinking: "Идет верификация, подождите...",
      tgSuccess: "Mini App успешно привязан!",
      tgFinishBtn: "Войти в Mini App 🚀",
      errorEmpty: "Пожалуйста, заполните все поля",
      errorWrong: "Неверный логин или пароль (Подсказка: используйте пароль '12345')",
    }
  }[lang === 'uz' ? 'uz' : 'ru'];

  // Handle local credential submission
  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError(t.errorEmpty);
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    // Simulate short loader for supreme feel
    setTimeout(() => {
      setIsLoggingIn(false);
      const cleanUser = username.trim().toLowerCase();
      
      if (password === '12345') {
        if (cleanUser === 'admin') {
          onLoginComplete('OWNER', '🏡 Karimovlar makoni', 'Zilola Karimboyeva (Admin)', '👩');
        } else if (cleanUser === 'jasur') {
          onLoginComplete('MEMBER', '🏡 Karimovlar makoni', 'Jasur Karimboyev', '👨');
        } else if (cleanUser === 'sarvar') {
          onLoginComplete('CHILD', '🏡 Karimovlar makoni', 'Sarvar Karimov', '👦');
        } else {
          // Dynamic user create as Member
          onLoginComplete('MEMBER', '🏡 Yangi oila', username, '👤');
        }
      } else {
        setLoginError(t.errorWrong);
      }
    }, 900);
  };

  // Simulating the dynamic API widget for Telegram WebApp Integration
  const startTelegramMockAuth = () => {
    setTelegramStep('linking');
    setTimeout(() => {
      setTelegramStep('success');
    }, 1500);
  };

  const handleTelegramFinish = () => {
    onLoginComplete(tgRole, '🏝 Telegram Oila Makoni', tgName, tgRole === 'OWNER' ? '👑' : tgRole === 'CHILD' ? '👦' : '⚡');
  };

  return (
    <div id="login-portal-wrapper" className="flex flex-col h-full bg-slate-900 justify-between p-5 min-h-0">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col items-center text-center pt-2 gap-1.5">
        <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-2xl shadow-xl border border-emerald-400/20 mb-1 scale-animation">
          🏡
        </div>
        <h1 className="font-display font-black text-2xl text-white tracking-tight">@uyimiz</h1>
        <p className="text-[11px] text-slate-400 max-w-[260px] leading-relaxed font-medium">
          {t.sub}
        </p>

        {/* Short language swapper */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850 mt-2">
          <button 
            id="lang-portal-uz"
            onClick={() => onLanguageChange('uz')}
            className={`py-1 px-2.5 rounded-lg text-[10px] font-bold ${lang === 'uz' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            UZB
          </button>
          <button 
            id="lang-portal-ru"
            onClick={() => onLanguageChange('ru')}
            className={`py-1 px-2.5 rounded-lg text-[10px] font-bold ${lang === 'ru' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            РУС
          </button>
        </div>
      </div>

      {/* Main Tabs Selection Grid */}
      <div className="bg-slate-950 border border-slate-850 p-1 rounded-xl grid grid-cols-3 gap-1 my-3 select-none">
        <button
          id="tab-btn-demo"
          onClick={() => { setActiveTab('demo'); setLoginError(''); }}
          className={`py-2 text-[10px] font-extrabold uppercase rounded-lg text-center transition-all ${
            activeTab === 'demo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {lang === 'uz' ? '⚡ Demo' : '⚡ Демо'}
        </button>
        <button
          id="tab-btn-pass"
          onClick={() => { setActiveTab('password'); setLoginError(''); }}
          className={`py-2 text-[10px] font-extrabold uppercase rounded-lg text-center transition-all ${
            activeTab === 'password' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {lang === 'uz' ? '🔑 Login' : '🔑 Логин'}
        </button>
        <button
          id="tab-btn-tg"
          onClick={() => { setActiveTab('telegram'); setLoginError(''); }}
          className={`py-2 text-[10px] font-extrabold uppercase rounded-lg text-center transition-all ${
            activeTab === 'telegram' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {lang === 'uz' ? '📱 Telegram' : '📱 Телеграм'}
        </button>
      </div>

      {/* Workspace Display Area */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-0 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DEMO MOCKUP ROLES */}
          {activeTab === 'demo' && (
            <motion.div
              key="login-demo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-2.5"
            >
              <div className="text-center mb-1">
                <span className="text-xs font-bold text-slate-300">{t.demoTitle}</span>
                <p className="text-[10px] text-slate-550 leading-relaxed mt-0.5">{t.demoDesc}</p>
              </div>

              {/* OWNER BUTTON */}
              <button
                id="portal-btn-owner"
                onClick={() => onLoginComplete('OWNER', '🏡 Karimovlar oilasi', 'Zilola Karimboyeva', '👩')}
                className="w-full p-3.5 bg-slate-950 border border-slate-850 hover:border-emerald-500/40 rounded-2xl text-left flex items-start gap-3 transition-all transform hover:scale-[1.01]"
              >
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-center text-lg shrink-0">
                  👑
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{t.roleOwner}</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">Owner</span>
                  </div>
                  <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">{t.roleOwnerDesc}</p>
                </div>
              </button>

              {/* MEMBER BUTTON */}
              <button
                id="portal-btn-member"
                onClick={() => onLoginComplete('MEMBER', '🏡 Karimovlar oilasi', 'Jasur Karimov', '👨')}
                className="w-full p-3.5 bg-slate-950 border border-slate-850 hover:border-blue-500/40 rounded-2xl text-left flex items-start gap-3 transition-all transform hover:scale-[1.01]"
              >
                <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl flex items-center justify-center text-lg shrink-0">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{t.roleMember}</span>
                    <span className="text-[9px] bg-blue-500/20 text-blue-450 font-bold px-2 py-0.5 rounded-full">Member</span>
                  </div>
                  <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">{t.roleMemberDesc}</p>
                </div>
              </button>

              {/* CHILD BUTTON */}
              <button
                id="portal-btn-child"
                onClick={() => onLoginComplete('CHILD', '🏡 Karimovlar oilasi', "Sarvar (O'g'il)", '👦')}
                className="w-full p-3.5 bg-slate-950 border border-slate-850 hover:border-amber-550/40 rounded-2xl text-left flex items-start gap-3 transition-all transform hover:scale-[1.01]"
              >
                <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 text-amber-450 rounded-xl flex items-center justify-center text-lg shrink-0">
                  👦
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{t.roleChild}</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-450 font-bold px-2 py-0.5 rounded-full">Farzand</span>
                  </div>
                  <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">{t.roleChildDesc}</p>
                </div>
              </button>
            </motion.div>
          )}

          {/* TAB 2: SECURE PASSWORD AUTH */}
          {activeTab === 'password' && (
            <motion.div
              key="login-password"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <form onSubmit={handleCredentialLogin} className="flex flex-col gap-3.5">
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-350">{t.passTitle}</span>
                  <p className="text-[9px] text-slate-500 leading-relaxed mt-1">{t.passDesc}</p>
                </div>

                <div className="flex flex-col gap-2">
                  {/* USERNAME FIELD */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                      <User size={14} />
                    </span>
                    <input
                      id="input-portal-username"
                      type="text"
                      className="w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                      placeholder={t.userPlaceholder}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  {/* PASSWORD FIELD */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                      <Lock size={14} />
                    </span>
                    <input
                      id="input-portal-password"
                      type="password"
                      className="w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                      placeholder={t.passPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {loginError && (
                  <span id="portal-error-alert" className="text-[10px] font-bold text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 text-center flex items-center justify-center gap-1.5 leading-normal">
                    <AlertTriangle size={12} className="shrink-0" /> {loginError}
                  </span>
                )}

                <button
                  id="btn-portal-submit-login"
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs tracking-wide shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <LogIn size={13} /> {t.submitBtn}
                    </>
                  )}
                </button>

                {/* Helpful Hints Card (PRD: Premium accessibility standard) */}
                <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl flex items-start gap-2">
                  <span className="text-amber-450 shrink-0 mt-0.5">💡</span>
                  <div className="min-w-0">
                    <span className="text-[9px] font-semibold text-slate-450 leading-relaxed block">
                      {t.passHint}
                    </span>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* TAB 3: TELEGRAM AUTO-WIDGET GATEWAY */}
          {activeTab === 'telegram' && (
            <motion.div
              key="login-telegram"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-3"
            >
              <div className="text-center">
                <span className="text-xs font-bold text-slate-300">{t.tgTitle}</span>
                <p className="text-[10px] text-slate-400 mt-1 mb-2 leading-relaxed">{t.tgDesc}</p>
              </div>

              {telegramStep === 'idle' && (
                <div className="flex flex-col gap-4 text-center">
                  <div className="bg-slate-950 border-2 border-slate-850 p-4 rounded-2xl flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-full flex items-center justify-center text-xl animate-pulse">
                      💬
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white block">Telegram Widget Session API</span>
                      <span className="text-[9px] text-slate-500 mt-0.5 block">tg-authv2_token_payload_sig</span>
                    </div>
                  </div>

                  <button
                    id="btn-tg-widget-connect"
                    onClick={startTelegramMockAuth}
                    className="py-3 px-4 bg-sky-500 text-white hover:bg-sky-400 font-bold rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/10"
                  >
                    <Smartphone size={14} /> {t.tgConnectBtn}
                  </button>
                </div>
              )}

              {telegramStep === 'linking' && (
                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-slate-800"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-sky-500 border-t-transparent animate-spin"></div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 font-mono">
                    {t.tgLinking}
                  </span>
                </div>
              )}

              {telegramStep === 'success' && (
                <div className="bg-slate-950 border-2 border-emerald-500/30 rounded-2xl p-4 flex flex-col gap-3 text-center">
                  <div className="mx-auto w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 font-bold text-lg">
                    <CheckCircle2 size={18} />
                  </div>
                  
                  <div>
                    <span className="text-xs font-bold text-white block">{t.tgSuccess}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">verified_hash_ok_2026</span>
                  </div>

                  {/* Simulation profile settings */}
                  <div className="bg-slate-900 border border-slate-805 p-3 rounded-xl text-left flex flex-col gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                        Telegram Display Name
                      </label>
                      <input
                        id="input-telegram-name"
                        type="text"
                        value={tgName}
                        onChange={(e) => setTgName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.0 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                        Select Simulation Role in Family
                      </label>
                      <select
                        id="select-telegram-role"
                        value={tgRole}
                        onChange={(e) => setTgRole(e.target.value as Role)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-1 text-xs text-white focus:outline-none focus:border-emerald-500 py-1"
                      >
                        <option value="OWNER">Owner (Oila Boshlig'i)</option>
                        <option value="MEMBER">Member (Oilaviy a'zo)</option>
                        <option value="CHILD">Child (Farzand)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    id="btn-tg-completion"
                    onClick={handleTelegramFinish}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs tracking-wide transition-all active:scale-95"
                  >
                    {t.tgFinishBtn}
                  </button>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Onboarding alternative trigger */}
      {onToggleOnboarding && (
        <div className="text-center py-2 shrink-0">
          <button
            id="btn-goto-onboarding"
            onClick={onToggleOnboarding}
            className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 transition-colors underline cursor-pointer"
          >
            {lang === 'uz' ? "🏡 Yangi oila yaratish yoki taklif kodidan foydalanish" : "🏡 Использовать код приглашения или создать новую семью"}
          </button>
        </div>
      )}

      {/* Decorative Branding Line */}
      <div className="text-center pt-3 border-t border-slate-850 mt-2">
        <span className="text-[9px] font-mono text-slate-600 block">
          ⚡ @uyimiz Family Management Platform v2.0
        </span>
      </div>

    </div>
  );
}
