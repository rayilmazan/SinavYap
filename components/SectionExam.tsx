'use client';

import React, { useState, useEffect } from 'react';
import { ExamData, OptionKey } from '@/lib/types';
import {
  FileText,
  CheckCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Hash,
  RefreshCw,
  Send,
  AlertTriangle,
  Layers,
  Eye,
  CheckCircle2,
  Clock,
  Hourglass,
} from 'lucide-react';

const EXAM_DURATION_SECONDS = 40 * 60; // 40 minutes = 2400 seconds

interface SectionExamProps {
  examData: ExamData;
  studentCode: string;
  setStudentCode: (code: string) => void;
  userAnswers: Record<number, OptionKey | null>;
  setUserAnswers: React.Dispatch<
    React.SetStateAction<Record<number, OptionKey | null>>
  >;
  onFinishExam: (timeSpentSeconds?: number) => void;
  onBackToOutcomes: () => void;
}

export function SectionExam({
  examData,
  studentCode,
  setStudentCode,
  userAnswers,
  setUserAnswers,
  onFinishExam,
  onBackToOutcomes,
}: SectionExamProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  // 40 Minutes Countdown Timer
  const [timeLeft, setTimeLeft] = useState<number>(EXAM_DURATION_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowTimeUpModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalQuestions = examData.questions.length;
  const currentQuestion = examData.questions[currentQuestionIndex];

  // Count answered questions
  const answeredCount = Object.values(userAnswers).filter(
    (ans) => ans !== null && ans !== undefined
  ).length;
  const unansweredCount = totalQuestions - answeredCount;

  // Format mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timeSpent = EXAM_DURATION_SECONDS - timeLeft;

  const handleSelectOption = (questionId: number, optionKey: OptionKey) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === optionKey ? null : optionKey,
    }));
  };

  const handleGenerateNewCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setStudentCode(`OGR-${randomNum}`);
  };

  const handleCustomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 10);
    setStudentCode(cleaned);
  };

  const handleFinishClick = () => {
    if (unansweredCount > 0) {
      setShowConfirmModal(true);
    } else {
      onFinishExam(timeSpent);
    }
  };

  const handleTimeUpFinish = () => {
    setShowTimeUpModal(false);
    onFinishExam(EXAM_DURATION_SECONDS);
  };

  // Timer warning style
  const isTimeCritical = timeLeft <= 180; // under 3 mins
  const isTimeWarning = timeLeft <= 600 && timeLeft > 180; // 3 to 10 mins

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner: Student Code, 40-Min Timer & Exam Meta */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              {examData.subject || 'Sınav'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              10 Soru • Her Biri 10 Puan
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
            {examData.examTitle}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 40-Dakikalık Canlı Geri Sayım Sayacı */}
          <div
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all ${
              isTimeCritical
                ? 'bg-rose-50 border-rose-400 text-rose-800 animate-pulse'
                : isTimeWarning
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
            title="Sınav süresi: 40 Dakika"
          >
            <Clock
              className={`w-4 h-4 ${
                isTimeCritical
                  ? 'text-rose-600'
                  : isTimeWarning
                  ? 'text-amber-600'
                  : 'text-blue-600'
              }`}
            />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                Kalan Süre (40 Dk)
              </span>
              <span className="font-mono font-black text-sm sm:text-base leading-none">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Student Code Picker (Anonymous, strictly NO personal data) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2">
            <div className="hidden sm:block">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Öğrenci Kodu
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={studentCode}
                onChange={handleCustomCodeChange}
                placeholder="Kod/No"
                className="w-24 font-mono font-bold text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-2 py-1 text-center text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Öğrencinin anonim sınav kodu"
              />
              <button
                type="button"
                onClick={handleGenerateNewCode}
                title="Yeni Kod Ata"
                className="p-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">
              Cevaplanan: {answeredCount} / {totalQuestions} Soru
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold text-blue-600">
              %{Math.round((answeredCount / totalQuestions) * 100)} Tamamlandı
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setViewMode((prev) => (prev === 'single' ? 'all' : 'single'))
              }
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>
                {viewMode === 'single' ? 'Tüm Soruları Listele' : 'Tek Soru Modu'}
              </span>
            </button>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>

        {/* 1..10 Question Number Selector Buttons */}
        <div className="pt-2">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {examData.questions.map((q, idx) => {
              const isAnswered =
                userAnswers[q.id] !== null && userAnswers[q.id] !== undefined;
              const isCurrent =
                viewMode === 'single' && currentQuestionIndex === idx;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    setViewMode('single');
                    setCurrentQuestionIndex(idx);
                  }}
                  className={`relative flex flex-col items-center justify-center h-11 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'ring-2 ring-blue-600 bg-blue-600 text-white shadow-sm'
                      : isAnswered
                      ? 'bg-blue-50 border border-blue-300 text-blue-800 font-extrabold hover:bg-blue-100'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isAnswered && (
                    <span
                      className={`text-[9px] font-normal leading-none mt-0.5 ${
                        isCurrent ? 'text-blue-100' : 'text-blue-700'
                      }`}
                    >
                      [{userAnswers[q.id]}]
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Questions Display Area */}
      {viewMode === 'single' ? (
        /* SINGLE QUESTION FOCUS MODE (Eye-friendly, spacious, mobile-optimized) */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          {/* Question Header & Learning Outcome badge */}
          <div className="space-y-3 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                Soru {currentQuestion.id} / {totalQuestions}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                10 Puan
              </span>
            </div>

            <div className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg inline-block max-w-full truncate">
              Kazanım: {currentQuestion.learningOutcome}
            </div>

            {/* Question Text */}
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900 leading-relaxed pt-2">
              {currentQuestion.questionText}
            </h3>
          </div>

          {/* 4 Multiple Choice Options (A, B, C, D) */}
          <div className="space-y-3.5">
            {(['A', 'B', 'C', 'D'] as OptionKey[]).map((optKey) => {
              const optionText = currentQuestion.options[optKey];
              const isSelected = userAnswers[currentQuestion.id] === optKey;

              return (
                <button
                  key={optKey}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestion.id, optKey)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-4 active:scale-[0.99] cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {optKey}
                  </div>
                  <div className="pt-1.5 sm:pt-2 flex-1 text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
                    {optionText}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Single Question Navigation Footer */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                currentQuestionIndex === 0
                  ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Önceki Soru</span>
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(totalQuestions - 1, prev + 1)
                  )
                }
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
              >
                <span>Sonraki Soru</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishClick}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Sınavı Bitir ve Sonuçları Gör</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ALL QUESTIONS LIST VIEW */
        <div className="space-y-6">
          {examData.questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                  Soru {idx + 1} / {totalQuestions}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  10 Puan
                </span>
              </div>

              <div className="text-xs text-slate-500">
                Kazanım: {q.learningOutcome}
              </div>

              <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {q.questionText}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['A', 'B', 'C', 'D'] as OptionKey[]).map((optKey) => {
                  const isSelected = userAnswers[q.id] === optKey;
                  return (
                    <button
                      key={optKey}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optKey)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 font-semibold text-blue-900 ring-2 ring-blue-100'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {optKey}
                      </span>
                      <span className="text-sm pt-0.5 leading-snug">
                        {q.options[optKey]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Completion Action Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-lg font-bold">Sınavı Tamamlamaya Hazır mısınız?</h4>
          <p className="text-xs sm:text-sm text-slate-300">
            {answeredCount} / {totalQuestions} soru cevaplandı. Kalan süre:{' '}
            <strong>{formatTime(timeLeft)}</strong> (Toplam 40 Dk).
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBackToOutcomes}
            className="w-1/2 sm:w-auto px-4 py-3 rounded-xl border border-white/20 text-xs sm:text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            Kazanımlara Dön
          </button>

          <button
            type="button"
            onClick={handleFinishClick}
            className="w-1/2 sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Sınavı Bitir ve Sonuçları Gör</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal if questions are unanswered */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Cevaplanmamış Sorular Var!
              </h3>
              <p className="text-sm text-slate-600">
                Toplam 10 sorudan <strong>{unansweredCount} soru</strong> henüz
                cevaplanmadı. Kalan sınav süreniz: <strong>{formatTime(timeLeft)}</strong>.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  onFinishExam(timeSpent);
                }}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all"
              >
                Yine de Sınavı Bitir
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
              >
                Geri Dön ve Soruları Cevapla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time-up Modal (When 40 minutes expire) */}
      {showTimeUpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-center animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Hourglass className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                Süre Doldu! (40 Dakika)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                40 dakikalık sınav süreniz sona erdi. Cevaplarınız kaydedildi ve
                değerlendirme raporunuz hazırlanıyor.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTimeUpFinish}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
            >
              Sonuç Raporunu Gör
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
