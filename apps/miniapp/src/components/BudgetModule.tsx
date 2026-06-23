import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TranslationSet, BudgetEntry, FamilyMember, Role, Currency } from '../types';
import { BUDGET_CATEGORIES } from '../data';
import { Plus, Trash2, ArrowUpRight, ArrowDownLeft, Calendar, FileText, ChevronLeft, BarChart3, ListCollapse, X } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface BudgetModuleProps {
  t: TranslationSet;
  role: Role;
  lang?: string;
  currency?: Currency;
  members: FamilyMember[];
  entries: BudgetEntry[];
  currentUser: FamilyMember;
  onAddEntry: (entry: Omit<BudgetEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
  isAddSheetOpenInitially?: boolean;
  onCloseAddSheetInitially?: () => void;
}

export default function BudgetModule({
  t,
  role,
  lang,
  currency = 'UZS',
  members,
  entries,
  currentUser,
  onAddEntry,
  onDeleteEntry,
  isAddSheetOpenInitially = false,
  onCloseAddSheetInitially
}: BudgetModuleProps) {
  const [subTab, setSubTab] = useState<'list' | 'reports'>('list'); // 'list' or 'reports'
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [period, setPeriod] = useState<'THIS_MONTH' | 'LAST_MONTH' | 'WEEKLY'>('THIS_MONTH');
  
  // Sheet Adding flow state
  const [isSheetOpen, setIsSheetOpen] = useState(isAddSheetOpenInitially);
  const [addStep, setAddStep] = useState(1); // 1: Select Type, 2: Keypad Amount, 3: Category Select, 4: Note & Save
  
  // Custom Categories state
  const [budgetCategories, setBudgetCategories] = useState(() => {
    const saved = localStorage.getItem('uyimiz-budget-categories');
    return saved ? JSON.parse(saved) : BUDGET_CATEGORIES;
  });
  
  React.useEffect(() => {
    localStorage.setItem('uyimiz-budget-categories', JSON.stringify(budgetCategories));
  }, [budgetCategories]);

  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [newCatColor, setNewCatColor] = useState('#10b981');

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    setBudgetCategories((prev: any) => [...prev, { name: newCatName, icon: newCatIcon, color: newCatColor }]);
    setNewCatName('');
  };

  const handleDeleteCategory = (catName: string) => {
    setBudgetCategories((prev: any) => prev.filter((c: any) => c.name !== catName));
  };
  
  const [newType, setNewType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [newAmountStr, setNewAmountStr] = useState('');
  const [newCategory, setNewCategory] = useState('Oziq-ovqat');
  const [newCategoryIcon, setNewCategoryIcon] = useState('🛒');
  const [newNote, setNewNote] = useState('');
  const [newDate, setNewDate] = useState('Bugun');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  React.useEffect(() => {
    if (isAddSheetOpenInitially) {
      setIsSheetOpen(true);
      setAddStep(1);
    }
  }, [isAddSheetOpenInitially]);

  const handleCloseSheet = () => {
    const isDirty = newAmountStr !== '' || newNote !== '' || newType !== 'EXPENSE' || addStep > 1;
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
    setAddStep(1);
    setNewAmountStr('');
    setNewNote('');
    setNewType('EXPENSE');
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

  // Safe checks for budget access
  if (role === 'CHILD') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-950 text-slate-100">
        <span className="text-4xl mb-4">🔒</span>
        <h3 className="text-lg font-bold text-red-400 mb-2">{t.cantAccessMsg}</h3>
      </div>
    );
  }

  const formatAmountSpaces = (amountStr: string) => {
    if (!amountStr) return '0';
    return amountStr.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // 1. Keypad Actions
  const handleKeyPress = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    if (!cleanNum) return;
    setNewAmountStr(prev => {
      const combined = (prev + cleanNum).replace(/\D/g, '');
      if (combined.length >= 9) return combined.slice(0, 9);
      if (combined === '0' || combined === '00') return '';
      return combined;
    });
  };

  const handleBackspace = () => {
    setNewAmountStr(prev => prev.slice(0, -1));
  };

  const handleKeypadSubmit = () => {
    const val = parseInt(newAmountStr, 10);
    if (!newAmountStr || isNaN(val) || val <= 0) return;
    setAddStep(3); // Next to Category selection
  };

  const handleSelectCategory = (name: string, icon: string) => {
    setNewCategory(name);
    setNewCategoryIcon(icon);
    setAddStep(4); // Next to summary note save
  };

  const handleAddSubmit = () => {
    const freshAmount = parseInt(newAmountStr, 10);
    if (isNaN(freshAmount) || freshAmount <= 0) return;

    onAddEntry({
      amount: freshAmount,
      type: newType,
      category: newCategory,
      icon: newCategoryIcon,
      note: newNote,
      date: newDate === 'Bugun' ? 'Bugun, ' + new Date().toLocaleTimeString('uz-UZ', {hour: '2-digit', minute: '2-digit'}) : newDate,
      addedBy: currentUser.name
    });

    forceCloseSheet();
  };

  // Filters calculation
  const filteredEntries = entries.filter(e => {
    // filter type
    if (filterType === 'INCOME' && e.type !== 'INCOME') return false;
    if (filterType === 'EXPENSE' && e.type !== 'EXPENSE') return false;
    // period simulator
    if (period === 'LAST_MONTH') {
      return e.date.includes('kun oldin') || e.date.includes('Kecha');
    }
    if (period === 'WEEKLY') {
      return e.date.includes('Bugun') || e.date.includes('Kecha');
    }
    return true; // THIS_MONTH
  });

  // Aggregations
  const incomeTotal = filteredEntries.filter(e => e.type === 'INCOME').reduce((sum, e) => sum + e.amount, 0);
  const expenseTotal = filteredEntries.filter(e => e.type === 'EXPENSE').reduce((sum, e) => sum + e.amount, 0);
  const totalBalanceVal = incomeTotal - expenseTotal;

  // Report analytics: Categorised Expense sum
  const expensesOnly = filteredEntries.filter(e => e.type === 'EXPENSE');
  const expensesByCategory: Record<string, { sum: number, icon: string, color: string }> = {};

  // populate categories
  expensesOnly.forEach(e => {
    const matchedCategory = budgetCategories.find((c: any) => c.name === e.category) || { color: '#6b7280' };
    if (!expensesByCategory[e.category]) {
      expensesByCategory[e.category!] = { sum: 0, icon: e.icon, color: matchedCategory.color };
    }
    expensesByCategory[e.category!]!.sum += e.amount;
  });

  const categoriesSortedList = Object.entries(expensesByCategory)
    .sort((a, b) => b[1].sum - a[1].sum);

  const totalExpenseSum = Object.values(expensesByCategory).reduce((sum, item) => sum + item.sum, 0);

  return (
    <div id="budget_view_wrapper" className="flex flex-col h-full bg-slate-950 text-slate-100 relative justify-between">
      
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-32 flex flex-col gap-2.5">
        
        {/* Header with Sub-tabs */}
        <div id="budget-module-title" className="flex justify-between items-center bg-slate-900 border border-slate-800/40 p-3 px-4 rounded-[28px] shrink-0 shadow-lg">
          <span className="font-display font-black text-xl text-white tracking-tight">
            {t.budgetTitle}
          </span>
          <div className="flex bg-slate-950 p-1 rounded-full border border-slate-850">
            <button
              id="subtab-budget-list"
              onClick={() => setSubTab('list')}
              className={`px-4 py-2 text-xs font-bold font-sans flex items-center gap-1.5 rounded-full transition-all cursor-pointer ${
                subTab === 'list' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListCollapse size={13} /> List
            </button>
            <button
              id="subtab-budget-reports"
              onClick={() => setSubTab('reports')}
              className={`px-4 py-2 text-xs font-bold font-sans flex items-center gap-1.5 rounded-full transition-all cursor-pointer ${
                subTab === 'reports' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 size={13} /> Report
            </button>
          </div>
        </div>

        {/* 1. LIST SUB-TAB VIEW */}
        {subTab === 'list' && (
          <div className="flex flex-col gap-2.5">
            
            {/* Filter buttons */}
            <div id="budget-filter-bar" className="flex justify-between items-center gap-2">
              <div className="flex bg-slate-900 border border-slate-850 p-1 rounded-xl">
                <button
                  id="btn-filter-type-all"
                  onClick={() => setFilterType('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterType === 'ALL' ? 'bg-slate-850 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.all}
                </button>
                <button
                  id="btn-filter-type-income"
                  onClick={() => setFilterType('INCOME')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterType === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📥 {t.income}
                </button>
                <button
                  id="btn-filter-type-expense"
                  onClick={() => setFilterType('EXPENSE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterType === 'EXPENSE' ? 'bg-red-500/10 text-red-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📤 {t.expense}
                </button>
              </div>

              {/* Period Dropdown */}
              <select
                id="select-budget-period"
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-300 py-2 px-3 rounded-xl outline-none focus:border-emerald-500"
              >
                <option value="THIS_MONTH">📅 {t.periodThisMonth}</option>
                <option value="LAST_MONTH">📅 {t.periodLastMonth}</option>
                <option value="WEEKLY">📅 {t.periodWeekly}</option>
              </select>
            </div>

            {/* Balances Board */}
            <div id="budget-balances-board" className="bg-slate-900/40 border border-slate-900 p-3 rounded-3xl grid grid-cols-3 gap-0 text-center shadow-md">
              <div className="flex flex-col items-center px-2">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">{t.income}</span>
                <span className="text-sm font-bold text-emerald-400 mt-1">+{incomeTotal.toLocaleString('uz-UZ')} {currency}</span>
              </div>
              <div className="border-x border-slate-850/80 flex flex-col items-center px-2">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">{t.expense}</span>
                <span className="text-sm font-bold text-red-400 mt-1">-{expenseTotal.toLocaleString('uz-UZ')} {currency}</span>
              </div>
              <div className="flex flex-col items-center px-2">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">{t.balance}</span>
                <span className={`text-sm font-bold mt-1 ${totalBalanceVal >= 0 ? 'text-white' : 'text-red-400'}`}>
                  {totalBalanceVal.toLocaleString('uz-UZ')} {currency}
                </span>
              </div>
            </div>

            {/* Transactions entries list */}
            <div className="flex flex-col gap-2">
              {filteredEntries.length === 0 ? (
                <div id="budget-empty-slate" className="flex flex-col items-center justify-center p-8 bg-slate-900/30 rounded-3xl border border-slate-900 text-center gap-2">
                  <span className="text-3xl">💰</span>
                  <p className="text-xs text-slate-400 font-medium">{t.noTasksToday.replace('vazifalar', 'yozuvlar')}</p>
                  <button
                    id="btn-empty-add-trans"
                    onClick={() => setIsSheetOpen(true)}
                    className="mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-4 rounded-xl text-xs transition-colors active:scale-95"
                  >
                    ➕ {t.addTransactionTitle}
                  </button>
                </div>
              ) : (
                filteredEntries.map(entry => {
                  const canDelete = role === 'OWNER' || entry.addedBy === currentUser.name;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={entry.id}
                      className="bg-slate-900 border border-slate-850 px-3 py-3 rounded-2xl flex items-center justify-between gap-2.5 group hover:border-slate-800 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                          entry.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {entry.icon}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-100 flex items-center gap-1.5 truncate">
                            {entry.category}
                            {entry.note && (
                              <span className="text-[10px] font-normal text-slate-500 max-w-xs truncate py-0.5 bg-slate-950 px-1.5 rounded text-left">
                                {entry.note}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span className="font-semibold truncate max-w-[80px]">{entry.addedBy.split(' ')[0]}</span>
                            <span>•</span>
                            <span>{entry.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-auto pl-2">
                        <span className={`text-base font-medium font-mono ${
                          entry.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {entry.type === 'INCOME' ? '+' : '-'}{entry.amount.toLocaleString('uz-UZ')} {currency}
                        </span>
                        
                        {canDelete && (
                          <button
                            id={`btn-delete-entry-${entry.id}`}
                            onClick={() => {
                              if (confirm(t.deleteText + "?")) {
                                onDeleteEntry(entry.id);
                              }
                            }}
                            className="text-slate-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-850 border border-transparent hover:border-slate-800 transition-all"
                            title={t.deleteText}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* 2. REPORTS SUB-TAB VIEW (Custom SVGs) */}
        {subTab === 'reports' && (() => {
          // Helper for trend analysis: parse human dates to offsets of 0..6 days ago
          const getDayOffset = (dateStr: string): number => {
            if (!dateStr) return -1;
            const normalized = dateStr.trim();
            if (normalized.startsWith('Bugun')) return 0;
            if (normalized.startsWith('Kecha')) return 1;
            
            // check for matches like 'X kun oldin'
            const match = normalized.match(/(\d+)\s+kun\s+oldin/i);
            if (match) {
              return parseInt(match[1]!, 10);
            }
            
            // Fallback to parse JS Date if possible
            try {
              const rawDate = new Date(normalized);
              if (!isNaN(rawDate.getTime())) {
                const today = new Date();
                const diffTime = today.getTime() - rawDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                return diffDays >= 0 ? diffDays : 0;
              }
            } catch (e) {
              // ignore
            }

            return -1;
          };

          const get7DaysData = () => {
            const data: Array<{ offset: number; name: string; income: number; expense: number }> = [];
            const today = new Date();
            
            const uzDays = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
            const ruDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
            const enDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayNames = lang === 'ru' ? ruDays : (lang === 'en' ? enDays : uzDays);

            // Initialize the array for last 7 days (index 0 is 6 days ago, index 6 is today)
            for (let i = 6; i >= 0; i--) {
              const d = new Date();
              d.setDate(today.getDate() - i);
              
              const weekdayName = dayNames[d.getDay()] ?? '';
              const label = i === 0 ? (lang === 'ru' ? 'Сегодня' : 'Bugun') : 
                            i === 1 ? (lang === 'ru' ? 'Вчера' : 'Kecha') : 
                            weekdayName;

              data.push({
                offset: i,
                name: label,
                income: 0,
                expense: 0
              });
            }

            // Aggregate stats from entries
            entries.forEach(entry => {
              const offset = getDayOffset(entry.date);
              if (offset >= 0 && offset <= 6) {
                const item = data.find(d => d.offset === offset);
                if (item) {
                  if (entry.type === 'INCOME') {
                    item.income += entry.amount;
                  } else if (entry.type === 'EXPENSE') {
                    item.expense += entry.amount;
                  }
                }
              }
            });

            return data;
          };

          const trendData = get7DaysData();

          return (
            <div id="reports-analytics-view" className="flex flex-col gap-5">
            
            {/* Top Period Selector */}
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.reportsTab}</span>
              <select
                id="select-budget-period-rep"
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-300 py-1.5 px-3 rounded-xl outline-none"
              >
                <option value="THIS_MONTH"> Buena Vista: {t.periodThisMonth}</option>
                <option value="LAST_MONTH">{t.periodLastMonth}</option>
                <option value="WEEKLY">{t.periodWeekly}</option>
              </select>
            </div>

            {/* Custom Pie/Donut Chart representation in responsive SVG */}
            <div className="bg-slate-900 border border-slate-850 p-3 rounded-2xl flex flex-col items-center gap-3 relative overflow-hidden shadow-md">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider text-left w-full uppercase">{t.categoriesTitle}</h3>
              
              {totalExpenseSum === 0 ? (
                <div className="py-4 font-medium italic text-xs text-slate-500">Hech qanday xarajat mavjud emas</div>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-around mt-1">
                  
                  {/* Beautiful SVG Donut Chart */}
                  <div className="relative w-40 h-40 shrink-0">
                    <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                      {/* background track */}
                      <circle cx="21" cy="21" r="15.91" fill="transparent" stroke="#1e293b" strokeWidth="4"></circle>
                      
                      {/* Dynamic segments generator */}
                      {(() => {
                        let accumulatedPercent = 0;
                        return categoriesSortedList.map(([catName, data], index) => {
                          const percentage = (data.sum / totalExpenseSum) * 100;
                          const dashArray = `${percentage} ${100 - percentage}`;
                          const dashOffset = 100 - accumulatedPercent;
                          accumulatedPercent += percentage;

                          return (
                            <circle
                              key={catName}
                              cx="21"
                              cy="21"
                              r="15.91"
                              fill="transparent"
                              stroke={data.color}
                              strokeWidth="4"
                              strokeDasharray={dashArray}
                              strokeDashoffset={dashOffset}
                            />
                          );
                        });
                      })()}
                    </svg>

                    {/* inner text display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Xarajatlar</span>
                      <span className="text-xs font-extrabold text-white break-all max-w-[100px] leading-tight">
                        {totalExpenseSum.toLocaleString('uz-UZ').split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{currency}</span>
                    </div>
                  </div>

                  {/* Custom legend with percentages */}
                  <div className="flex flex-col gap-2 w-full max-w-[180px]">
                    {categoriesSortedList.slice(0, 4).map(([catName, data]) => {
                      const share = Math.round((data.sum / totalExpenseSum) * 100);
                      return (
                        <div key={catName} className="flex items-center justify-between text-xs gap-3">
                          <span className="flex items-center gap-2 text-slate-300 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.color }}></span>
                            <span className="truncate">{data.icon} {catName}</span>
                          </span>
                          <span className="font-bold text-white shrink-0 font-mono">{share}%</span>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}
            </div>

            {/* Table layout representing categories analytics (PRD: Section 5.3) */}
            <div className="bg-slate-900 border border-slate-850 p-3 rounded-2xl flex flex-col gap-2.5 shadow-md">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">{t.categoriesTitle} (Jadval)</h3>
              <div className="flex flex-col gap-3">
                {categoriesSortedList.map(([catName, data]) => {
                  const share = Math.round((data.sum / totalExpenseSum) * 100);
                  return (
                    <div key={catName} className="flex flex-col gap-1 text-xs mb-2">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>{data.icon} {catName}</span>
                        <div className="flex gap-2">
                          <span className="font-bold text-slate-100">{data.sum.toLocaleString('uz-UZ')} {currency}</span>
                          <span className="text-slate-500 font-mono font-bold">({share}%)</span>
                        </div>
                      </div>
                      {/* elegant bar loader indicator */}
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${share}%`, backgroundColor: data.color }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Real Trend Analysis Line Chart comparing spending vs income over the last 7 days */}
            <div className="bg-slate-900 border border-slate-850 p-3 rounded-2xl flex flex-col gap-2.5 shadow-md">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                📈 {lang === 'uz' ? 'Oxirgi 7 kunlik moliyaviy tendensiya' : 'Финансовый тренд за последние 7 дней'}
              </h3>
              <div id="chart-trend-7days-container" className="w-full h-48 bg-slate-950 border border-slate-850 rounded-2xl p-2 pt-3 shadow-inner overflow-hidden flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => {
                        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                        if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
                        return value;
                      }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px', color: '#f1f5f9' }}
                      itemStyle={{ color: '#fff' }}
                      labelClassName="font-extrabold text-slate-400 mb-1 block"
                      formatter={(value: any, name: any) => [Number(value).toLocaleString('uz-UZ') + ' ' + currency, name]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#10b981" 
                      strokeWidth={2.5} 
                      dot={{ r: 3, strokeWidth: 1 }} 
                      activeDot={{ r: 5 }} 
                      name={t.income}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expense" 
                      stroke="#ef4444" 
                      strokeWidth={2.5} 
                      dot={{ r: 3, strokeWidth: 1 }} 
                      activeDot={{ r: 5 }} 
                      name={t.expense}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 justify-center text-[10px] font-bold">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-1 bg-emerald-400 rounded-full"></span> {t.income}
                </span>
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-2.5 h-1 bg-red-400 rounded-full"></span> {t.expense}
                </span>
              </div>
            </div>

          </div>
        )})()}

      </div>

      {/* FIXED FLOATING ACTION BUTTON */}
      {subTab === 'list' && (
        <motion.div drag dragConstraints={{ left: -300, right: 0, top: -600, bottom: 0 }} className="fixed bottom-[88px] right-3 z-40 flex flex-col items-end gap-3 pointer-events-auto cursor-grab">
          <button
            id="btn-trigger-add-transaction"
            onClick={() => setIsSheetOpen(true)}
            className="pointer-events-auto w-14 h-14 rounded-[20px] flex items-center justify-center shadow-[0_16px_32px_rgba(212,77,41,0.2)] transition-all duration-300 active:scale-90 relative overflow-hidden bg-emerald-500 text-white border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>
            <Plus size={26} className="font-bold stroke-[3px]" />
          </button>
        </motion.div>
      )}

      {/* DYNAMIC MULTI-STEP BOTTOM SHEET FOR ADDING TRANSACTIONS */}
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
              id="sheet-backdrop"
            ></motion.div>

            {/* Bottom Sheet Modal Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 border-t border-slate-800 rounded-t-3xl z-[101] overflow-hidden flex flex-col max-h-[92vh]"
              id="sheet-container"
            >
              
              {/* Drag handle block */}
              <div className="w-full flex justify-center py-4 shrink-0">
                <div className="w-20 h-2 bg-slate-700/60 rounded-full hover:bg-slate-600 cursor-row-resize" onClick={handleCloseSheet}></div>
              </div>

              {/* Upper Header Control */}
              <div className="px-4 pb-2 border-b border-slate-850 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  {addStep > 1 && (
                    <button
                      id="btn-sheet-back"
                      onClick={() => setAddStep(prev => prev - 1)}
                      className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-0.5"
                    >
                      <ChevronLeft size={16} /> {t.back} ({addStep - 1}/4)
                    </button>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.addTransactionTitle}</span>
                <button
                  id="btn-sheet-close"
                  onClick={handleCloseSheet}
                  className="text-slate-500 hover:text-white p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Step Forms */}
              <div className="p-5 overflow-y-auto pb-10 flex-1 flex flex-col justify-start gap-4">

                {/* STEP 1: SELECT TRANSACTION TYPE */}
                {addStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4 text-center"
                    id="add-step-1"
                  >
                    <h3 className="text-lg font-bold text-white mb-2">{t.whatToAdd}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Expense Card selector */}
                      <button
                        id="btn-choose-expense"
                        onClick={() => {
                          setNewType('EXPENSE');
                          setAddStep(2);
                        }}
                        className="p-6 bg-slate-950 border-2 border-slate-800 hover:border-red-500/60 rounded-2xl flex flex-col items-center gap-3 transition-all"
                      >
                        <span className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center text-2xl">
                          💸
                        </span>
                        <span className="font-bold text-red-400 text-sm">{t.expense}</span>
                      </button>

                      {/* Income Card selector */}
                      <button
                        id="btn-choose-income"
                        onClick={() => {
                          setNewType('INCOME');
                          setAddStep(2);
                        }}
                        className="p-6 bg-slate-950 border-2 border-slate-800 hover:border-emerald-500/60 rounded-2xl flex flex-col items-center gap-3 transition-all"
                      >
                        <span className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl">
                          💚
                        </span>
                        <span className="font-bold text-emerald-400 text-sm">{t.income}</span>
                      </button>

                    </div>
                  </motion.div>
                )}

                {/* STEP 2: ENTER AMOUNT STRING IN KEYPAD */}
                {addStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4"
                    id="add-step-2"
                  >
                    <span className="text-[10px] text-slate-500 font-bold uppercase text-center tracking-widest">{t.amountText} ({newType === 'INCOME' ? 'Daromad' : 'Xarajat'})</span>
                    
                    {/* Amount large display */}
                    <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex items-center justify-center">
                      <span id="txt-amount-display" className="text-3xl font-mono font-black text-white select-none whitespace-nowrap overflow-x-auto selection:bg-emerald-500">
                        {formatAmountSpaces(newAmountStr)} 
                        <span className="text-xs text-slate-500 font-bold uppercase ml-2">{currency}</span>
                      </span>
                    </div>

                    {/* Simple Custom Phone Dial Keyboard layout (PRD: Section 5.3) */}
                    <div className="grid grid-cols-3 gap-2 text-center select-none py-1">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                        <button
                          key={num}
                          id={`keypad-${num}`}
                          onClick={() => handleKeyPress(num)}
                          className="py-3 bg-slate-850 hover:bg-slate-800 active:bg-slate-750 rounded-xl text-xl font-bold font-mono text-white transition-all shadow-sm active:scale-95"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        id="keypad-dot"
                        onClick={() => handleKeyPress('00')}
                        className="py-3 bg-slate-850 hover:bg-slate-800 active:bg-slate-750 rounded-xl text-lg font-bold font-mono text-white transition-all active:scale-95"
                      >
                        00
                      </button>
                      <button
                        id="keypad-0"
                        onClick={() => handleKeyPress('0')}
                        className="py-3 bg-slate-850 hover:bg-slate-800 active:bg-slate-750 rounded-xl text-xl font-bold font-mono text-white transition-all active:scale-95"
                      >
                        0
                      </button>
                      <button
                        id="keypad-backspace"
                        onClick={handleBackspace}
                        className="py-3 bg-slate-800 hover:bg-slate-700 text-red-400 font-bold rounded-xl flex items-center justify-center transition-all active:scale-95 font-mono"
                      >
                        ⌫
                      </button>
                    </div>

                    <button
                      id="btn-keypad-next"
                      onClick={handleKeypadSubmit}
                      disabled={!newAmountStr || parseInt(newAmountStr) <= 0}
                      className={`py-3.5 rounded-xl font-bold transition-all ${
                        !newAmountStr || parseInt(newAmountStr) <= 0
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-500 text-slate-950 active:scale-95 hover:bg-emerald-400'
                      }`}
                    >
                      {t.continue}
                    </button>
                  </motion.div>
                )}

                {/* STEP 3: SELECT CATEGORY GRID */}
                {addStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4"
                    id="add-step-3"
                  >
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.selectCategory}</span>
                      <button 
                        onClick={() => setIsManageCategoriesOpen(true)} 
                        className="text-[10px] text-sky-400 font-bold uppercase hover:text-sky-300 transition-colors bg-sky-500/10 px-2 py-1 rounded-md"
                      >
                        {lang === 'uz' ? 'Tahrirlash' : 'Настроить'}
                      </button>
                    </div>
                    
                    {/* Categories grid */}
                    <div id="grid-sheet-categories" className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[300px] p-1">
                      {budgetCategories.map((cat: any) => (
                        <button
                          key={cat.name}
                          id={`btn-cat-${cat.name}`}
                          onClick={() => handleSelectCategory(cat.name, cat.icon)}
                          className="p-4 bg-slate-950 border border-slate-850 rounded-xl hover:border-emerald-500 flex flex-col items-center gap-1.5 transition-all text-center group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-all">{cat.icon}</span>
                          <span className="text-[10px] text-slate-300 font-medium truncate w-full">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: NOTES, DATE ADJUSTMENT & SUBMIT */}
                {addStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4"
                    id="add-step-4"
                  >
                    <span className="text-[10px] text-slate-500 font-bold uppercase text-center tracking-widest">{t.finishAndSave}</span>

                    {/* Summary Preview indicator */}
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{newCategoryIcon}</span>
                        <div>
                          <p className="text-xs text-slate-400">{newCategory}</p>
                          <p className="text-xs text-slate-500 font-bold mt-0.5">{newType === 'INCOME' ? '📥 Daromad' : '📤 Xarajat'}</p>
                        </div>
                      </div>
                      <span className="font-mono text-base font-extrabold text-white">
                        {formatAmountSpaces(newAmountStr)} {currency}
                      </span>
                    </div>

                    {/* Note Input */}
                    <div className="flex flex-col gap-1.5 mt-2">
                      <label className="text-xs text-slate-400 font-bold">{t.optionalNote}</label>
                      <input
                        id="input-trans-note"
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onFocus={(e) => {
                          setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
                        }}
                        placeholder="Masalan: Bozorlik, non, go'sht..."
                        className="bg-slate-950 border-2 border-slate-850 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 font-medium text-white"
                      />
                    </div>

                    {/* Quick Date picker */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-400 font-bold">{t.transactionDate}</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Bugun', 'Kecha', '3 kun oldin'].map(dt => (
                          <button
                            key={dt}
                            id={`btn-date-${dt}`}
                            onClick={() => setNewDate(dt)}
                            className={`py-2 rounded-lg text-xs font-medium transition-all border ${
                              newDate === dt
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                                : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                            }`}
                          >
                            {dt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      id="btn-sheet-submit"
                      onClick={handleAddSubmit}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-xl text-sm font-black transition-all shadow-md active:scale-95"
                    >
                      ✅ {t.save}
                    </button>
                  </motion.div>
                )}

              </div>

            </motion.div>

            {showDiscardConfirm && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[999]" id="discard-confirm-dialog">
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
                      id="btn-confirm-keep"
                      onClick={() => setShowDiscardConfirm(false)}
                      className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-800"
                    >
                      {lang === 'uz' ? 'Tahrirlashda davom etish' : lang === 'ru' ? 'Продолжить' : 'Keep editing'}
                    </button>
                    <button
                      id="btn-confirm-discard"
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
      <AnimatePresence>
        {isManageCategoriesOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 z-[110] cursor-pointer"
              onClick={() => setIsManageCategoriesOpen(false)}
            />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] h-full bg-slate-900 border-t border-slate-800 z-[120] rounded-t-[32px] overflow-hidden flex flex-col pt-4 mx-auto max-w-[600px] shadow-[0_-20px_48px_rgba(15,23,42,0.5)]"
            >
              <div className="w-20 h-2 bg-slate-600/50 rounded-full mx-auto my-3 shrink-0" />
              
              <div className="flex justify-between items-center px-6 pb-4 border-b border-white/5 shrink-0">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  {lang === 'uz' ? 'Kategoriyalarni tahrirlash' : 'Настроить категории'}
                </h3>
                <button
                  onClick={() => setIsManageCategoriesOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
                
                {/* Add new form */}
                <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800/80 flex flex-col gap-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {lang === 'uz' ? 'Yangi qo\'shish' : 'Добавить новую'}
                  </span>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Icon (e.g. 🍔)"
                      value={newCatIcon}
                      onChange={e => setNewCatIcon(e.target.value)}
                      className="w-16 bg-slate-900 border border-slate-800 rounded-xl px-2 py-3 text-center text-xl outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder={lang === 'uz' ? 'Nomi' : 'Название'}
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                  
                  <button 
                    onClick={handleAddCategory}
                    disabled={!newCatName.trim()}
                    className="mt-1 w-full bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-300 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                  >
                    + {lang === 'uz' ? 'Qo\'shish' : 'Добавить'}
                  </button>
                </div>

                {/* List of categories */}
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-2">
                    {lang === 'uz' ? 'Mavjud kategoriyalar' : 'Доступные категории'}
                  </span>
                  
                  {budgetCategories.map((cat: any) => (
                    <div key={cat.name} className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800/50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="font-semibold text-slate-300">{cat.name}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteCategory(cat.name)}
                        className="p-2 text-rose-500/80 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
