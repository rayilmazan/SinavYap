'use client';

import React from 'react';

interface DonutChartProps {
  correct: number;
  wrong: number;
  empty: number;
  total: number;
}

export function DonutChart({ correct, wrong, empty, total }: DonutChartProps) {
  const safeTotal = total || 10;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  const correctPct = (correct / safeTotal);
  const wrongPct = (wrong / safeTotal);
  const emptyPct = (empty / safeTotal);

  const strokeDashCorrect = correctPct * circumference;
  const strokeDashWrong = wrongPct * circumference;
  const strokeDashEmpty = emptyPct * circumference;

  const strokeOffsetCorrect = 0;
  const strokeOffsetWrong = -strokeDashCorrect;
  const strokeOffsetEmpty = -(strokeDashCorrect + strokeDashWrong);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4">
      <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth="20"
          />
          {/* Correct - Green */}
          {correct > 0 && (
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth="20"
              strokeDasharray={`${strokeDashCorrect} ${circumference}`}
              strokeDashoffset={strokeOffsetCorrect}
              strokeLinecap="round"
            />
          )}
          {/* Wrong - Rose/Red */}
          {wrong > 0 && (
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke="#ef4444"
              strokeWidth="20"
              strokeDasharray={`${strokeDashWrong} ${circumference}`}
              strokeDashoffset={strokeOffsetWrong}
              strokeLinecap="round"
            />
          )}
          {/* Empty - Amber/Slate */}
          {empty > 0 && (
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke="#94a3b8"
              strokeWidth="20"
              strokeDasharray={`${strokeDashEmpty} ${circumference}`}
              strokeDashoffset={strokeOffsetEmpty}
              strokeLinecap="round"
            />
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {correct * 10}
          </span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            / 100 Puan
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 w-full max-w-[200px]">
        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-emerald-900">Doğru</span>
          </div>
          <span className="font-bold text-emerald-800">{correct} Soru ({correct * 10} P)</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-100 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="font-medium text-rose-900">Yanlış</span>
          </div>
          <span className="font-bold text-rose-800">{wrong} Soru</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 border border-slate-200 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400"></span>
            <span className="font-medium text-slate-700">Boş</span>
          </div>
          <span className="font-bold text-slate-800">{empty} Soru</span>
        </div>
      </div>
    </div>
  );
}

interface OutcomeBarChartProps {
  stats: {
    outcome: string;
    total: number;
    correct: number;
    wrong: number;
    empty: number;
    successRate: number;
  }[];
}

export function OutcomeBarChart({ stats }: OutcomeBarChartProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="space-y-4 w-full">
      {stats.map((item, idx) => {
        const rate = Math.round(item.successRate);
        const colorClass =
          rate >= 70
            ? 'bg-emerald-500'
            : rate >= 40
            ? 'bg-amber-500'
            : 'bg-rose-500';

        return (
          <div key={idx} className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="font-semibold text-slate-800 line-clamp-1" title={item.outcome}>
                {item.outcome}
              </span>
              <span className="font-bold text-slate-700 shrink-0">
                %{rate} ({item.correct}/{item.total} Doğru)
              </span>
            </div>

            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${colorClass} transition-all duration-500 rounded-full`}
                style={{ width: `${Math.max(rate, 4)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
