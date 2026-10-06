'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { SectionOutcomes } from '@/components/SectionOutcomes';
import { SectionExam } from '@/components/SectionExam';
import { SectionResult } from '@/components/SectionResult';
import { ExamData, ExamResult, OptionKey } from '@/lib/types';
import { SAMPLE_OUTCOMES } from '@/lib/sample-outcomes';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'outcomes' | 'exam' | 'result'>('outcomes');
  const [outcomesText, setOutcomesText] = useState<string>(SAMPLE_OUTCOMES[0].text);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Exam Data
  const [examData, setExamData] = useState<ExamData | null>(null);

  // Student Anonymous Code/ID (Default random 4-digit ID, strictly NO personal data)
  const [studentCode, setStudentCode] = useState<string>(() => {
    return `OGR-${Math.floor(1000 + Math.random() * 9000)}`;
  });

  // User answers mapping: questionId -> OptionKey | null
  const [userAnswers, setUserAnswers] = useState<Record<number, OptionKey | null>>({});

  // Result object
  const [result, setResult] = useState<ExamResult | null>(null);

  // Handle Generate Exam via server-side API route
  const handleGenerateExam = async () => {
    if (!outcomesText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          learningOutcomes: outcomesText,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Sınav soruları oluşturulamadı.');
      }

      setExamData(data.exam);
      // Reset answers and results
      setUserAnswers({});
      setResult(null);
      // Switch to Section 2 (Sınav Hazırla / Çöz)
      setActiveTab('exam');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sınav hazırlanırken bir sorun oluştu.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate results and finish exam
  const handleFinishExam = (timeSpentSeconds: number = 0) => {
    if (!examData) return;

    let correctCount = 0;
    let wrongCount = 0;
    let emptyCount = 0;

    examData.questions.forEach((q) => {
      const answer = userAnswers[q.id];
      if (!answer) {
        emptyCount += 1;
      } else if (answer === q.correctAnswer) {
        correctCount += 1;
      } else {
        wrongCount += 1;
      }
    });

    const totalScore = correctCount * 10; // 10 questions x 10 points = 100 points
    const maxScore = 100;
    const percentage = Math.round((totalScore / maxScore) * 100);

    // Group stats by learning outcome
    const outcomeMap: Record<
      string,
      { total: number; correct: number; wrong: number; empty: number }
    > = {};

    examData.questions.forEach((q) => {
      const outcomeKey = q.learningOutcome || 'Genel Kazanım';
      if (!outcomeMap[outcomeKey]) {
        outcomeMap[outcomeKey] = { total: 0, correct: 0, wrong: 0, empty: 0 };
      }
      outcomeMap[outcomeKey].total += 1;
      const ans = userAnswers[q.id];
      if (!ans) {
        outcomeMap[outcomeKey].empty += 1;
      } else if (ans === q.correctAnswer) {
        outcomeMap[outcomeKey].correct += 1;
      } else {
        outcomeMap[outcomeKey].wrong += 1;
      }
    });

    const outcomeStats = Object.entries(outcomeMap).map(([outcome, counts]) => ({
      outcome,
      total: counts.total,
      correct: counts.correct,
      wrong: counts.wrong,
      empty: counts.empty,
      successRate: counts.total > 0 ? (counts.correct / counts.total) * 100 : 0,
    }));

    const finalResult: ExamResult = {
      studentCode: studentCode.trim() || `OGR-${Math.floor(1000 + Math.random() * 9000)}`,
      totalScore,
      maxScore,
      correctCount,
      wrongCount,
      emptyCount,
      percentage,
      answers: { ...userAnswers },
      completedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpentSeconds > 0 ? timeSpentSeconds : 1,
      outcomeStats,
    };

    setResult(finalResult);
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeExam = () => {
    setUserAnswers({});
    setResult(null);
    setActiveTab('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewExam = () => {
    setActiveTab('outcomes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasExam={!!examData}
        hasResult={!!result}
      />

      {/* Main Content Sections */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* 1. BÖLÜM: ÖĞRENME ÇIKTILARI */}
        {activeTab === 'outcomes' && (
          <SectionOutcomes
            outcomesText={outcomesText}
            setOutcomesText={setOutcomesText}
            onGenerateExam={handleGenerateExam}
            isLoading={isLoading}
            error={error}
            hasExistingExam={!!examData}
            onGoToExam={() => setActiveTab('exam')}
          />
        )}

        {/* 2. BÖLÜM: SINAV HAZIRLA & ÇÖZ */}
        {activeTab === 'exam' && examData && (
          <SectionExam
            examData={examData}
            studentCode={studentCode}
            setStudentCode={setStudentCode}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            onFinishExam={handleFinishExam}
            onBackToOutcomes={() => setActiveTab('outcomes')}
          />
        )}

        {/* 3. BÖLÜM: SONUÇ & PDF */}
        {activeTab === 'result' && examData && result && (
          <SectionResult
            examData={examData}
            result={result}
            onRetakeExam={handleRetakeExam}
            onNewExam={handleNewExam}
            onRefreshResult={() => setActiveTab('result')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Sınav Yap • Öğrenme Çıktılarına Dayalı Çoktan Seçmeli Sınav ve Karne Sistemi</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>10 Soru • 100 Puan</span>
            <span>•</span>
            <span>Kişisel Veri Saklanmaz</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
