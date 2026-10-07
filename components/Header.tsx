'use client';

import React from 'react';
import { BookOpen, FileCheck2, Award, Sparkles, LogIn, User as UserIcon, LogOut, History } from 'lucide-react';

interface HeaderProps {
  activeTab: 'outcomes' | 'exam' | 'result';
  setActiveTab: (tab: 'outcomes' | 'exam' | 'result') => void;
  hasExam: boolean;
  hasResult: boolean;
  user: { id: number; name: string; email: string } | null;
  onOpenAuthModal: () => void;
  onOpenHistoryDrawer: () => void;
  onLogout: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  hasExam,
  hasResult,
  user,
  onOpenAuthModal,
  onOpenHistoryDrawer,
  onLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Sınav Yap
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                  10 Soru • 100 Puan • 40 Dk
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Öğrenme çıktılarına dayalı yapay zekâ sınav ve karne platformu
              </p>
            </div>
          </div>

          {/* Center Navigation & Auth actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="flex items-center gap-1 sm:gap-2">
              {/* 1. Öğrenme Çıktıları */}
              <button
                onClick={() => setActiveTab('outcomes')}
                className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'outcomes'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">1.</span>
                <span>Kazanımlar</span>
              </button>

              {/* 2. Sınav Hazırla / Çöz */}
              <button
                onClick={() => {
                  if (hasExam) setActiveTab('exam');
                }}
                disabled={!hasExam}
                className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  !hasExam
                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                    : activeTab === 'exam'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={!hasExam ? 'Önce öğrenme çıktılarını girip sınavı oluşturun' : ''}
              >
                <FileCheck2 className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">2.</span>
                <span>Sınav</span>
                {hasExam && !hasResult && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>

              {/* 3. Sonuç */}
              <button
                onClick={() => {
                  if (hasResult) setActiveTab('result');
                }}
                disabled={!hasResult}
                className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  !hasResult
                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                    : activeTab === 'result'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={!hasResult ? 'Sınav tamamlandıktan sonra sonuçlar görüntülenir' : ''}
              >
                <Award className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">3.</span>
                <span>Sonuç</span>
                {hasResult && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </button>
            </nav>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenHistoryDrawer}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  title="Geçmiş sınavların ve karnelerin"
                >
                  <History className="w-4 h-4 text-blue-600" />
                  <span className="hidden lg:inline">Geçmişim</span>
                </button>

                <div className="flex items-center gap-2 pl-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-800 hidden md:inline">
                    {user.name}
                  </span>
                  <button
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Çıkış Yap"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Giriş Yap</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
