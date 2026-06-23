import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TranslationSet, Language, Role } from '../types';

interface OnboardingProps {
  t: TranslationSet;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onComplete: (familyName: string, role: Role, initialMemberId: string) => void;
}

export default function Onboarding({ t, lang, onLanguageChange, onComplete }: OnboardingProps) {
  const [step, setStep] = useState<number>(1); // 1: Language, 2: Choose Create/Join, 3: Create (Name) or Join (OTP), 4: Wait/Join Success
  const [flow, setFlow] = useState<'create' | 'join' | null>(null);
  
  // Create flow states
  const [familyName, setFamilyName] = useState<string>('');
  const [familyEmoji, setFamilyEmoji] = useState<string>('🏡');
  const [nameError, setNameError] = useState<string>('');
  
  // Join flow states
  const [otpCode, setOtpCode] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState<string>('');
  const [isWaitingApproved, setIsWaitingApproved] = useState<boolean>(false);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (flow === 'create') {
        setStep(3); // Go to family name entry
      } else if (flow === 'join') {
        setStep(3); // Go to OTP entry
      }
    }
  };

  const handleLangSelect = (selectedLang: Language) => {
    onLanguageChange(selectedLang);
  };

  // Create Family action
  const handleCreateFamily = () => {
    if (familyName.trim().length < 3) {
      setNameError(lang === 'uz' ? "Kamida 3 belgi kiriting" : lang === 'ru' ? "Минимум 3 символа" : "Minimum 3 characters");
      return;
    }
    setNameError('');
    setStep(4); // Show code screen
  };

  const handleFinishCreate = () => {
    // Finish onboarding as OWNER
    onComplete(`${familyEmoji} ${familyName}`, 'OWNER', '1');
  };

  // Join Family OTP action
  const handleOtpInput = (index: number, val: string) => {
    if (/[^0-9]/g.test(val)) return; // numbers only
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // auto focus next helper
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleJoinVerify = () => {
    const fullCode = otpCode.join('');
    if (fullCode.length < 6) {
      setOtpError(lang === 'uz' ? "Kodni to'liq kiriting" : lang === 'ru' ? "Введите код полностью" : "Enter full code");
      return;
    }

    if (fullCode === '123456' || fullCode === '654321') {
      setOtpError('');
      setIsWaitingApproved(true);
      setStep(4); // Go to waiting approval
    } else {
      setOtpError(lang === 'uz' ? "Kod topilmadi yoki muddati o'tgan (Sinov uchun: 123456)" : lang === 'ru' ? "Код не найден или устарел (Тест: 123456)" : "Code not found or expired (Test: 123456)");
    }
  };

  const handleSimulateApprove = () => {
    // Complete onboarding as MEMBER or CHILD
    onComplete('👨‍👩‍👧 Karimovlar oilasi', 'MEMBER', '2'); // simulating joining Jasur
  };

  return (
    <div id="onboarding_wrapper" className="flex flex-col h-full bg-slate-900 text-slate-100 justify-between p-6">
      
      {/* Upper Logo / Welcome */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={`header-${step}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center mt-6 text-center"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg ring-4 ring-emerald-500/20 mb-4 scale-animation">
            {step === 1 ? '🌐' : (flow === 'create' ? familyEmoji : '👥')}
          </div>
          <h1 className="font-sans text-3xl font-bold tracking-tight text-white mb-1">
            @uyimiz
          </h1>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Main Form Area */}
      <div className="my-auto flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Language selection */}
          {step === 1 && (
            <motion.div
              key="step-lang"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 mt-4"
            >
              <h2 className="text-lg font-semibold text-center text-slate-200 mb-2">
                {t.chooseLang}
              </h2>
              
              <button
                id="btn-lang-uz"
                onClick={() => handleLangSelect('uz')}
                className={`py-4 px-6 rounded-xl flex items-center justify-between border-2 transition-all ${
                  lang === 'uz' 
                    ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md' 
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="flex items-center gap-3 text-base">
                  <span className="text-xl">🇺🇿</span> O'zbekcha
                </span>
                {lang === 'uz' && <span className="text-emerald-500 font-bold">✓</span>}
              </button>

              <button
                id="btn-lang-ru"
                onClick={() => handleLangSelect('ru')}
                className={`py-4 px-6 rounded-xl flex items-center justify-between border-2 transition-all ${
                  lang === 'ru' 
                    ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md' 
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="flex items-center gap-3 text-base">
                  <span className="text-xl">🇷🇺</span> Русский
                </span>
                {lang === 'ru' && <span className="text-emerald-500 font-bold">✓</span>}
              </button>

              <button
                id="btn-lang-en"
                onClick={() => handleLangSelect('en')}
                className={`py-4 px-6 rounded-xl flex items-center justify-between border-2 transition-all ${
                  lang === 'en' 
                    ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md' 
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="flex items-center gap-3 text-base">
                  <span className="text-xl">🇬🇧</span> English
                </span>
                {lang === 'en' && <span className="text-emerald-500 font-bold">✓</span>}
              </button>

              <p className="text-xs text-center text-slate-500 mt-2">
                {t.langNotice}
              </p>
            </motion.div>
          )}

          {/* STEP 2: Choose flow (Create vs Join) */}
          {step === 2 && (
            <motion.div
              key="step-flow"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 mt-4"
            >
              <h2 className="text-lg font-semibold text-center text-slate-200 mb-2">
                {t.hasFamilyQuestion}
              </h2>

              <button
                id="btn-flow-create"
                onClick={() => setFlow('create')}
                className={`p-5 rounded-2xl flex flex-col text-left border-2 transition-all gap-2 ${
                  flow === 'create'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3 font-semibold text-lg">
                  <span className="text-2xl">🏡</span> {t.createFamilyOpt}
                </div>
                <p className="text-xs text-slate-400 pl-8 leading-normal">
                  {t.createFamilyDesc}
                </p>
              </button>

              <button
                id="btn-flow-join"
                onClick={() => setFlow('join')}
                className={`p-5 rounded-2xl flex flex-col text-left border-2 transition-all gap-2 ${
                  flow === 'join'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3 font-semibold text-lg">
                  <span className="text-2xl">🔗</span> {t.joinFamilyOpt}
                </div>
                <p className="text-xs text-slate-400 pl-8 leading-normal">
                  {t.joinFamilyDesc}
                </p>
              </button>
            </motion.div>
          )}

          {/* STEP 3 (Create): Enter Family Name */}
          {step === 3 && flow === 'create' && (
            <motion.div
              key="step-name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 mt-4"
            >
              <label id="lbl-family-name" className="text-lg font-semibold text-center text-slate-200 mb-1">
                {t.enterFamilyName}
              </label>

              <div className="flex gap-2">
                <select
                  id="select-family-emoji"
                  value={familyEmoji}
                  onChange={(e) => setFamilyEmoji(e.target.value)}
                  className="bg-slate-800 border-2 border-slate-700 rounded-xl px-3 py-3 text-2xl focus:border-emerald-500 outline-none text-white cursor-pointer"
                >
                  <option value="🏡">🏡</option>
                  <option value="🏠">🏠</option>
                  <option value="🏰">🏰</option>
                  <option value="⛺">⛺</option>
                  <option value="🌸">🌸</option>
                  <option value="⭐">⭐</option>
                  <option value="🦁">🦁</option>
                </select>

                <input
                  id="input-family-name"
                  type="text"
                  value={familyName}
                  onChange={(e) => {
                    setFamilyName(e.target.value);
                    if (e.target.value.trim().length >= 3) {
                      setNameError('');
                    }
                  }}
                  placeholder={t.familyNamePlaceholder}
                  className={`flex-1 bg-slate-800/80 border-2 rounded-xl py-3 px-4 font-medium text-white focus:outline-none focus:border-emerald-500 transition-all ${
                    nameError ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
              </div>

              {nameError && (
                <p id="name-error-msg" className="text-xs text-red-500 text-center font-medium">⚠️ {nameError}</p>
              )}

              <p className="text-xs text-slate-500 text-center mt-1leading-relaxed">
                {lang === 'uz' 
                  ? 'Qulay va oilangizga xos nom bering, masalan: Soliyevlar, Baxtli oila.'
                  : lang === 'ru'
                  ? 'Дайте удобное и понятное название, например: Ивановы, Счастливая Семья.'
                  : 'Call it something familiar, like: Smiths, Happy Family.'}
              </p>
            </motion.div>
          )}

          {/* STEP 3 (Join): Enter OTP Invite Code */}
          {step === 3 && flow === 'join' && (
            <motion.div
              key="step-otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 mt-4 text-center"
            >
              <label id="lbl-otp" className="text-lg font-semibold text-slate-200">
                {t.enterInviteCode}
              </label>
              <p className="text-xs text-slate-400 -mt-2 leading-relaxed">
                {t.otpDescription}
              </p>

              <div className="flex justify-center gap-2 mt-2">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 h-12 bg-slate-800 border-2 border-slate-700 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
                  />
                ))}
              </div>

              {otpError && (
                <p id="otp-error-msg" className="text-xs text-red-500 font-medium">⚠️ {otpError}</p>
              )}

              <div className="flex flex-col gap-2 mt-4">
                <button
                  id="btn-verify-otp"
                  onClick={handleJoinVerify}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium text-sm transition-all"
                >
                  {lang === 'uz' ? 'Kodni Tasdiqlash' : 'Проверить код'}
                </button>
                <div className="text-slate-500 text-xs mt-2">
                  {lang === 'uz' ? 'Yordam: Kod oila boshlig\'i (Owner) tomonidan yuboriladi.' : 'Подсказка: Код отправляется главой семьи.'}
                  <br />
                  <span className="text-emerald-400/80 font-mono text-xs">{lang === 'uz' ? 'Sinov kodi: 123456' : 'Для теста: 123456'}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4 (Create success): Share Code screen */}
          {step === 4 && flow === 'create' && (
            <motion.div
              key="step-create-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-4 mt-4 text-center items-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-1">
                🎉
              </div>
              <h2 className="text-xl font-bold text-white">
                {familyName} {t.successTitle}
              </h2>
              <p className="text-xs text-slate-400 pl-2 pr-2 leading-relaxed">
                {lang === 'uz' 
                  ? "Oilangiz muvaffaqiyatli ro'yxatdan o'tdi. Endi oila a'zolarini taklif qilish uchun maxsus koddan foydalaning:" 
                  : "Семья успешно зарегистрирована! Поделитесь этим кодом приглашения, чтобы добавить членов:"}
              </p>

              {/* Large Invitation Code Card */}
              <div className="w-full bg-slate-800 border-2 border-emerald-500/40 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-inner my-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                  INVITATION CODE
                </span>
                <span className="text-3xl font-mono font-bold tracking-widest text-white selection:bg-emerald-500">
                  UYZ129
                </span>
                <span className="text-[10px] text-slate-500">
                  {lang === 'uz' ? '7 kun davomida amal qiladi' : 'Действителен в течение 7 дней'}
                </span>
              </div>

              <div className="flex gap-2 w-full mt-2">
                <button
                  id="btn-copy-code"
                  onClick={() => alert(lang === 'uz' ? 'Taklif kodi nusxalandi!' : 'Код приглашения скопирован!')}
                  className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 py-3 rounded-xl text-sm font-medium hover:bg-slate-750 transition-all"
                >
                  📋 {t.copyBtn}
                </button>
                <button
                  id="btn-share-code"
                  onClick={() => alert(lang === 'uz' ? 'Telegram share ochildi' : 'Telegram share открыт')}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 py-3 rounded-xl text-sm font-bold transition-all"
                >
                  📤 {t.shareBtn}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 (Join success/Waiting): Approval sequence */}
          {step === 4 && flow === 'join' && (
            <motion.div
              key="step-join-waiting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-4 mt-4 text-center items-center"
            >
              {isWaitingApproved ? (
                <>
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-700 animate-pulse"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                    <span className="text-2xl">⏳</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mt-2">
                    {t.waitingApproval}
                  </h2>
                  
                  <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                    {t.waitingDesc}
                  </p>

                  <div className="w-full bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl text-xs text-slate-400 leading-normal">
                    💡 <strong>{lang === 'uz' ? "Simulyatsiya:" : "Симуляция:"}</strong> {lang === 'uz' ? "Sizni kutish tizimida deb tasavvur qilamiz. Admin (Oila boshlig'i) Telegram botda sizni qabul qilish tugmasini bosishi bilan ushbu ekran o'zgaradi." : "Мы симулируем ожидание. Как только Админ подтвердит ваш запрос в боте, вы перейдете дальше."}
                  </div>

                  {/* Simulator approval helper button */}
                  <button
                    id="btn-simulate-approve"
                    onClick={handleSimulateApprove}
                    className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md active:scale-98"
                  >
                    👑 {lang === 'uz' ? "Admin bo'lib tasdiqlash" : "Подтвердить за Админа"} (Simulate)
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-1">
                    ✅
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {t.successTitle}
                  </h2>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Primary Bottom Navigation for Onboarding steps */}
      <div className="flex gap-3 justify-end mt-4">
        {step > 1 && step < 4 && (
          <button
            id="btn-onboarding-back"
            onClick={() => setStep(prev => prev - 1)}
            className="px-5 py-3 rounded-xl font-medium text-sm text-slate-400 hover:text-white transition-all"
          >
            {t.back}
          </button>
        )}

        {/* Dynamic button next */}
        {step === 1 && (
          <button
            id="btn-onboarding-step1-next"
            onClick={handleNextStep}
            className="w-full bg-emerald-500 text-slate-950 font-bold py-3.5 px-6 rounded-xl text-center active:scale-95 hover:bg-emerald-400 transition-all"
          >
            {t.continue}
          </button>
        )}

        {step === 2 && (
          <button
            id="btn-onboarding-step2-next"
            onClick={handleNextStep}
            disabled={flow === null}
            className={`w-full py-3.5 px-6 rounded-xl text-center font-bold transition-all ${
              flow === null
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 text-slate-950 active:scale-95 hover:bg-emerald-400'
            }`}
          >
            {t.continue}
          </button>
        )}

        {step === 3 && flow === 'create' && (
          <button
            id="btn-onboarding-step3-create"
            onClick={handleCreateFamily}
            disabled={familyName.trim().length < 3}
            className={`w-full py-3.5 px-6 rounded-xl text-center font-bold transition-all ${
              familyName.trim().length < 3
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 text-slate-950 active:scale-95 hover:bg-emerald-400'
            }`}
          >
            {t.continue}
          </button>
        )}

        {step === 4 && flow === 'create' && (
          <button
            id="btn-onboarding-finish-create"
            onClick={handleFinishCreate}
            className="w-full bg-emerald-500 text-slate-950 font-bold py-3.5 px-6 rounded-xl text-center active:scale-95 hover:bg-emerald-400 transition-all"
          >
            {lang === 'uz' ? 'Bosh sahifaga o\'tish 🚀' : 'Перейти к Dashboard 🚀'}
          </button>
        )}
      </div>

    </div>
  );
}
