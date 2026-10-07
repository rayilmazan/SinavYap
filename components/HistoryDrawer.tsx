'use client';

import React, { useState, useEffect } from 'react';
import { X, History, FileText, Award, Calendar, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { ExamData, ExamResult } from '@/lib/types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExam: (exam: ExamData) => void;
  onSelectResult: (result: ExamResult, exam: ExamData) => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  onSelectExam,
  onSelectResult,
}: HistoryDrawerProps) {
  const [activeTab, setActiveTab] = useState<'exams' | 'results'>('exams');
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [examsRes, resultsRes] = await Promise.all([
        fetch('/api/exams'),
        fetch('/api/results'),
      ]);

      const examsData = await examsRes.json();
      const resultsData = await resultsRes.json();

      if (examsData.success) setExams(examsData.exams || []);
      if (resultsData.success) setResults(resultsData.results || []);
    } catch (err: any) {
      setError('Geçmiş yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Geçmiş Sınavlarım ve Karneler</h3>
              <p className="text-xs text-slate-500">PostgreSQL veritabanında saklanan kayıtlarınız</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchHistory}
              title="Yenile"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switch */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('exams')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'exams'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Kayıtlı Sınavlar ({exams.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'results'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Sınav Karneleri ({results.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-xs font-medium">Veritabanından veriler getiriliyor...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs text-center">
              {error}
            </div>
          ) : activeTab === 'exams' ? (
            exams.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">Henüz veritabanında kayıtlı sınavınız yok.</p>
              </div>
            ) : (
              exams.map((item) => {
                const examData: ExamData = typeof item.exam_data === 'string' ? JSON.parse(item.exam_data) : item.exam_data;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectExam(examData);
                      onClose();
                    }}
                    className="p-4 border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/30 rounded-xl transition-all cursor-pointer group shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(item.created_at).toLocaleDateString('tr-TR')}
                          </span>
                          <span>•</span>
                          <span>{examData?.questions?.length || 10} Soru</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                );
              })
            )
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Henüz tamamlanmış sınav karneniz bulunmuyor.</p>
            </div>
          ) : (
            results.map((item) => {
              const resData: ExamResult = typeof item.result_data === 'string' ? JSON.parse(item.result_data) : item.result_data;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (resData) {
                      onSelectResult(resData, resData as any);
                      onClose();
                    }
                  }}
                  className="p-4 border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/30 rounded-xl transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 rounded-md">
                          {item.student_code}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(item.completed_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs font-semibold text-slate-700">
                        <span>Puan: <strong className="text-emerald-600">{item.score} / {item.max_score}</strong></span>
                        <span>Doğru: {item.correct_count}</span>
                        <span>Yanlış: {item.wrong_count}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900">{item.percentage}%</span>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 ml-auto mt-1" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
