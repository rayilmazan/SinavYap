'use client';

import React, { useState } from 'react';
import { SAMPLE_OUTCOMES, SampleOutcome } from '@/lib/sample-outcomes';
import {
  Sparkles,
  ClipboardPaste,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface SectionOutcomesProps {
  outcomesText: string;
  setOutcomesText: (text: string) => void;
  onGenerateExam: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  hasExistingExam: boolean;
  onGoToExam: () => void;
}

export function SectionOutcomes({
  outcomesText,
  setOutcomesText,
  onGenerateExam,
  isLoading,
  error,
  hasExistingExam,
  onGoToExam,
}: SectionOutcomesProps) {
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  const handleApplySample = (sample: SampleOutcome) => {
    setSelectedSample(sample.id);
    setOutcomesText(sample.text);
  };

  const handleClear = () => {
    setSelectedSample(null);
    setOutcomesText('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Intro */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs sm:text-sm font-medium border border-white/15 text-blue-200">
            <GraduationCap className="w-4 h-4" />
            <span>1. Bölüm: Öğrenme Çıktıları Girişi</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Öğrenme Çıktılarını Yapıştırın, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-200 to-white">
              10 Soruluk Sınavı Anında Hazırlayın
            </span>
          </h2>

          <p className="text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed">
            Soru hazırlama uzmanı yapay zekâ, girdiğiniz kazanımları derinlemesine analiz eder;
            araştırarak tamamen özgün, pedagojik, 4 seçenekli ve 10 soruluk bir sınav kurgular.
          </p>

          {/* Quick Rules Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs sm:text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="font-bold text-white">10 Soru</div>
              <div className="text-blue-200 text-xs">Birbirinden farklı</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="font-bold text-white">40 Dk Süre</div>
              <div className="text-blue-200 text-xs">Geri sayım sayacı</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="font-bold text-white">10 Puan / Soru</div>
              <div className="text-blue-200 text-xs">Toplam 100 Puan</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="font-bold text-white">4 Seçenek (A-D)</div>
              <div className="text-blue-200 text-xs">Tek doğru yanıt</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 col-span-2 sm:col-span-1">
              <div className="font-bold text-white">Anonim Kod</div>
              <div className="text-blue-200 text-xs">Kişisel veri yok</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Input Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label
              htmlFor="outcomesInput"
              className="block text-base font-bold text-slate-800"
            >
              Öğrenme Çıktıları Metni:
            </label>
            <div className="flex items-center gap-2">
              {outcomesText && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Metni Temizle
                </button>
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mb-3">
            Öğretmen olarak kazanım metinlerini yapıştırabilirsiniz. &quot;Öğrenme Çıktısı 1:&quot;, &quot;Öğrenme Çıktısı 2:&quot; şeklinde etiketleyebilirsiniz.
          </p>

          <div className="relative">
            <textarea
              id="outcomesInput"
              rows={7}
              value={outcomesText}
              onChange={(e) => setOutcomesText(e.target.value)}
              placeholder={`Örnek Format:
Öğrenme Çıktısı 1: Güneş Sistemi'ndeki gezegenleri Güneş'e olan yakınlıklarına ve özelliklerine göre sınıflandırır.
Öğrenme Çıktısı 2: Ay'ın ana ve ara evrelerini modeller üzerinde açıklar.
Öğrenme Çıktısı 3: Güneş ve Ay tutulmalarının gerçekleşme koşullarını karşılaştırır.`}
              className="w-full rounded-xl border border-slate-300 p-4 font-mono text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-y"
            />
          </div>
        </div>

        {/* Ready Sample Templates */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <ClipboardPaste className="w-4 h-4 text-blue-600" />
            <span>Veya Hazır Müfredat Şablonlarından Birini Seçin:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_OUTCOMES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleApplySample(sample)}
                className={`text-xs font-medium px-3.5 py-2 rounded-lg border transition-all ${
                  selectedSample === sample.id
                    ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold ring-2 ring-blue-100'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-950">Sunucu Bildirimi:</span>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">{error}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onGenerateExam}
              disabled={isLoading}
              className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Yeniden Dene</span>
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Öğrenci isim veya kişisel verisi toplanmaz; sınav anonim kod ile yürütülür.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {hasExistingExam && !isLoading && (
              <button
                type="button"
                onClick={onGoToExam}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 font-semibold text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Mevcut Sınava Git
              </button>
            )}

            <button
              type="button"
              onClick={onGenerateExam}
              disabled={isLoading || !outcomesText.trim()}
              className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
                isLoading || !outcomesText.trim()
                  ? 'bg-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sorular Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Sınavı Hazırla (10 Soru)</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Process Information cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="font-bold text-slate-900 text-sm">1. Öğrenme Çıktısı Analizi</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Metindeki kazanımlar taranır, konunun müfredat derinliği ve kazanım hedefleri pedagojik olarak belirlenir.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="font-bold text-slate-900 text-sm">2. 10 Özgün Soru Üretimi</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Her biri 10 puan değerinde, 4 şıklı ve tek doğru seçenekli 10 soru kurgulanır. Şıklar birbirinden farklıdır.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h3 className="font-bold text-slate-900 text-sm">3. Sonuç Raporu ve PDF</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sınav bittiğinde öğrenci kodu, doğru/yanlış grafikleri ve kazanım bazlı detaylı PDF karnesi anında üretilir.
          </p>
        </div>
      </div>
    </div>
  );
}
