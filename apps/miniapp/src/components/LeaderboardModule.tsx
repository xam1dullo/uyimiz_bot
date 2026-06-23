import React from 'react';
import { motion } from 'motion/react';
import { TranslationSet, FamilyMember, Language } from '../types';
import { Crown, Trophy, Star, ChevronLeft, Award, Medal } from 'lucide-react';

interface LeaderboardModuleProps {
  t: TranslationSet;
  lang: Language;
  members: FamilyMember[];
}

export default function LeaderboardModule({ t, lang, members }: LeaderboardModuleProps) {
  // Sort members descending by points
  const sorted = [...members].sort((a, b) => b.points - a.points);
  const first = sorted[0];

  return (
    <div id="leaderboard_view_wrapper" className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto pb-32 relative">
      
      {/* Header title */}
      <div className="flex justify-between items-center px-4 pt-6 pb-2 shrink-0">
        <h2 className="font-sans font-bold text-2xl tracking-tight text-white">
          {lang === 'uz' ? 'Bu hafta reyting' : 'Рейтинг этой недели'}
        </h2>
      </div>

      {first && (
        <div className="px-4 py-2 shrink-0">
          <div className="bg-gradient-to-br from-amber-500/20 to-slate-900 border border-amber-500/30 rounded-[28px] p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_16px_32px_rgba(245,158,11,0.1)]">
            <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 to-transparent pointer-events-none" />
            
            <Crown size={32} className="text-amber-400 mb-2 drop-shadow-md z-10" />
            
            <div className="relative z-10">
              <span className="text-6xl filter drop-shadow-lg mb-2 block text-center">🥇 {first.avatar}</span>
            </div>
            
            <span className="text-2xl font-bold tracking-tight text-white mb-1 z-10 relative mt-2">
              {first.name.split(' ')[0]}
            </span>
            
            <div className="bg-amber-400/20 text-amber-300 font-bold font-mono tracking-widest px-4 py-1.5 rounded-full text-sm z-10 relative">
              {first.points} ball
            </div>
          </div>
        </div>
      )}

      {/* Rows */}
      <div className="flex flex-col gap-2 px-4 py-4 flex-1">
        {sorted.map((m, index) => {
          if (index === 0) return null; // Skip first, already hero
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={m.id}
              className="p-4 rounded-3xl flex items-center justify-between border transition-all shadow-sm bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-bold text-slate-500/60 text-lg w-4 text-center">
                  {index + 1}
                </span>

                <span className="w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center text-2xl border border-slate-800 shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                  {m.avatar}
                </span>

                <div className="min-w-0 flex flex-col justify-center">
                  <span className="text-sm font-bold text-slate-200 truncate">
                    {m.name.split(' ')[0]}
                  </span>
                  
                  {/* Status/Role subtitle */}
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                    {m.role === 'OWNER' ? 'Owner' : m.role === 'CHILD' ? 'Bola' : 'A\'zo'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shadow-inner">
                <span className="font-mono text-sm font-black text-slate-300">
                  {m.points} <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none block">ball</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Achievement Card */}
      <div className="px-4 pb-8 shrink-0 mt-2">
        <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-slate-900 p-5 rounded-[28px] border border-emerald-500/20 flex flex-col items-center text-center gap-2 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px]" />
          <span className="text-4xl filter drop-shadow mb-1">🌟</span>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none bg-emerald-500/10 px-3 py-1.5 rounded-full inline-block">
            {lang === 'uz' ? 'Oila Qahramoni' : 'Герой Семьи'}
          </span>
          <p className="text-xs font-semibold text-slate-400 max-w-[200px] mt-1 relative z-10">
            {lang === 'uz' ? 'Oila yetakchisi qimmatbaho mukofotlarga ega bo\'ladi!' : 'Лидер семьи получает ценные призы!'}
          </p>
        </div>
      </div>

    </div>
  );
}
