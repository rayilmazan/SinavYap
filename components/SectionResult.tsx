'use client';

import React, { useRef, useState } from 'react';
import { ExamData, ExamResult, OptionKey } from '@/lib/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import {
  FileDown,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Printer,
  RotateCcw,
  BookOpen,
  Calendar,
  Hash,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Loader2,
  Check,
  FileSpreadsheet,
  CheckSquare,
} from 'lucide-react';

interface SectionResultProps {
  examData: ExamData;
  result: ExamResult;
  onRetakeExam: () => void;
  onNewExam: () => void;
  onRefreshResult: () => void;
}

export function SectionResult({
  examData,
  result,
  onRetakeExam,
  onNewExam,
  onRefreshResult,
}: SectionResultProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  // Directly generates and downloads an A4-proportioned, black & white PDF with balanced margins
  const handleDownloadPdf = async () => {
    if (!reportRef.current || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    setPdfSuccess(false);

    try {
      const element = reportRef.current;

      // Render the dedicated B&W report with html2canvas-pro at high resolution
      const canvas = await html2canvas(element, {
        scale: 2, // Sharp text and borders
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 800,
        windowWidth: 800,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfPageHeight = pdf.internal.pageSize.getHeight(); // 297mm

      // Standard A4 margins (12mm left, 12mm right, 12mm top, 12mm bottom)
      const marginX = 12;
      const marginY = 12;
      const contentWidth = pdfPageWidth - marginX * 2; // 186mm
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      const pageAvailableHeight = pdfPageHeight - marginY * 2; // 273mm

      let heightLeft = contentHeight;
      let position = marginY;

      // First page with margins
      pdf.addImage(imgData, 'JPEG', marginX, position, contentWidth, contentHeight);
      heightLeft -= pageAvailableHeight;

      // Multi-page splitting with preserved margins
      while (heightLeft > 0) {
        position -= pageAvailableHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', marginX, position, contentWidth, contentHeight);
        heightLeft -= pageAvailableHeight;
      }

      const fileName = `Sinav_Sonuc_Raporu_${result.studentCode}_${result.totalScore}Puan.pdf`;
      pdf.save(fileName);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error('PDF indirme hatası:', err);
      try {
        window.print();
      } catch (printErr) {
        console.error('Yazdırma hatası:', printErr);
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      handleDownloadPdf();
    }
  };

  const getGradeBadge = (score: number) => {
    if (score >= 90) {
      return {
        label: 'Üstün Başarı (Pekiyi)',
        desc: 'Öğrenme çıktıları hedeflenen seviyenin üzerinde kavranmıştır.',
      };
    }
    if (score >= 70) {
      return {
        label: 'Başarılı (İyi)',
        desc: 'Öğrenme çıktılarının büyük bölümü başarıyla tamamlanmıştır.',
      };
    }
    if (score >= 50) {
      return {
        label: 'Geliştirilebilir (Orta)',
        desc: 'Hatalı cevaplanan kazanımların konu tekrarlarıyla pekiştirilmesi önerilir.',
      };
    }
    return {
      label: 'Desteklenmeli (Geliştirilmeli)',
      desc: 'İlgili öğrenme çıktılarının temel kavramları yeniden çalışılmalıdır.',
    };
  };

  const gradeInfo = getGradeBadge(result.totalScore);

  const durationMins = Math.floor(result.timeSpentSeconds / 60);
  const durationSecs = result.timeSpentSeconds % 60;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Sınav Değerlendirme Raporu
            </h2>
            <p className="text-xs text-slate-500">
              Katılımcı Kodu:{' '}
              <strong className="text-slate-800">{result.studentCode}</strong> •{' '}
              Süre: {durationMins} dk {durationSecs} sn / 40 dk
            </p>
          </div>
        </div>

        {/* Action Buttons: "Pdf Olarak Al" and "Sonuç" */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onRefreshResult}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm transition-all shadow-xs"
            title="Sonuç Raporunu Görüntüle ve Güncelle"
          >
            <Award className="w-4 h-4 text-slate-700" />
            <span>Sonuç</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.99] ${
              pdfSuccess
                ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/25'
                : 'bg-black hover:bg-neutral-800 shadow-black/20'
            } ${isGeneratingPdf ? 'opacity-80 cursor-wait' : ''}`}
            title="Siyah-Beyaz Tablo Düzeninde PDF İndir"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>PDF Hazırlanıyor...</span>
              </>
            ) : pdfSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>PDF İndirildi!</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Pdf Olarak Al</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="hidden xs:flex items-center justify-center p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Yazıcıdan Yazdır (Print)"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Success banner if downloaded */}
      {pdfSuccess && (
        <div className="p-3.5 bg-neutral-100 border border-neutral-300 text-neutral-900 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 no-print animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Siyah-beyaz resmi sınav karneniz (PDF) dengeli kenar boşlukları ve tablo düzeniyle indirildi.
          </span>
        </div>
      )}

      {/* DEDICATED BLACK & WHITE OFFICIAL REPORT DOCUMENT CONTAINER */}
      {/* Specifically sized (800px width), with balanced padding and print margins */}
      <div className="flex justify-center">
        <div
          ref={reportRef}
          id="exam-report-container"
          className="print-container w-full max-w-[800px] bg-white text-black p-8 sm:p-10 border-2 border-black rounded-lg shadow-md space-y-6 text-sm font-sans"
          style={{ width: '800px', boxSizing: 'border-box' }}
        >
          {/* 1. RESMİ BAŞLIK VE BİLGİ ALANI */}
          <div className="border-b-2 border-black pb-5 space-y-3">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <div className="text-xs font-bold tracking-wider uppercase text-neutral-700">
                ÖLÇME VE DEĞERLENDİRME MERKEZİ • SINAV SONUÇ BELGESİ
              </div>
              <div className="text-xs font-mono font-bold text-neutral-800">
                {new Date(result.completedAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight uppercase">
                  {examData.examTitle}
                </h1>
                <div className="text-xs font-semibold text-neutral-600 mt-0.5">
                  Ders / Alan: {examData.subject || 'Genel Değerlendirme'}
                </div>
              </div>

              {/* Katılımcı ID ve Süre Damgası */}
              <div className="bg-neutral-100 border border-black p-2.5 rounded text-right shrink-0">
                <div className="text-[11px] font-bold text-neutral-600 uppercase">
                  Katılımcı / Öğrenci Kodu:
                </div>
                <div className="text-base font-mono font-black text-black">
                  {result.studentCode}
                </div>
                <div className="text-[10px] text-neutral-700 font-medium">
                  Süre: {durationMins} dk {durationSecs} sn (Maks 40 Dk)
                </div>
              </div>
            </div>
          </div>

          {/* 2. GENEL PUAN VE SONUÇ ÖZET TABLOSU */}
          <div className="space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-black border-l-4 border-black pl-2">
              GENEL BAŞARI VE PUAN DURUM TABLOSU
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-center text-xs">
                <thead>
                  <tr className="bg-neutral-100 border-b border-black font-black text-black">
                    <th className="border-r border-black p-2.5">TOPLAM PUAN</th>
                    <th className="border-r border-black p-2.5">SORU SAYISI</th>
                    <th className="border-r border-black p-2.5">DOĞRU CEVAP</th>
                    <th className="border-r border-black p-2.5">YANLIŞ CEVAP</th>
                    <th className="border-r border-black p-2.5">BOŞ BIRAKILAN</th>
                    <th className="border-r border-black p-2.5">BAŞARI YÜZDESİ</th>
                    <th className="p-2.5">DERECE</th>
                  </tr>
                </thead>
                <tbody className="font-bold">
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-3 text-lg font-black bg-neutral-50">
                      {result.totalScore} / 100
                    </td>
                    <td className="border-r border-black p-3">10</td>
                    <td className="border-r border-black p-3 text-base">
                      {result.correctCount} (+{result.correctCount * 10} P)
                    </td>
                    <td className="border-r border-black p-3 text-base">
                      {result.wrongCount}
                    </td>
                    <td className="border-r border-black p-3 text-base">
                      {result.emptyCount}
                    </td>
                    <td className="border-r border-black p-3 text-base font-black">
                      %{result.percentage}
                    </td>
                    <td className="p-3 text-xs font-black uppercase bg-neutral-50">
                      {gradeInfo.label}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-neutral-600 italic px-1">
              * Değerlendirme notu: {gradeInfo.desc}
            </div>
          </div>

          {/* 3. ÖĞRENME ÇIKTILARI (KAZANIM) BAŞARI TABLOSU */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-black uppercase tracking-wider text-black border-l-4 border-black pl-2">
              ÖĞRENME ÇIKTILARI (KAZANIM) BAZINDA PERFORMANS ANALİZİ
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-neutral-100 border-b border-black font-black text-black text-center">
                    <th className="border-r border-black p-2 w-10">NO</th>
                    <th className="border-r border-black p-2 text-left">ÖĞRENME ÇIKTISI / KAZANIM</th>
                    <th className="border-r border-black p-2 w-16">SORU</th>
                    <th className="border-r border-black p-2 w-16">DOĞRU</th>
                    <th className="border-r border-black p-2 w-16">YANLIŞ</th>
                    <th className="border-r border-black p-2 w-16">BOŞ</th>
                    <th className="border-r border-black p-2 w-20">BAŞARI</th>
                    <th className="p-2 w-28">GRAFİK</th>
                  </tr>
                </thead>
                <tbody>
                  {result.outcomeStats.map((item, idx) => {
                    const rate = Math.round(item.successRate);
                    return (
                      <tr key={idx} className="border-b border-black/80 font-medium text-center">
                        <td className="border-r border-black p-2 font-bold">{idx + 1}</td>
                        <td className="border-r border-black p-2 text-left font-semibold">
                          {item.outcome}
                        </td>
                        <td className="border-r border-black p-2">{item.total}</td>
                        <td className="border-r border-black p-2 font-bold">{item.correct}</td>
                        <td className="border-r border-black p-2">{item.wrong}</td>
                        <td className="border-r border-black p-2">{item.empty}</td>
                        <td className="border-r border-black p-2 font-black">%{rate}</td>
                        <td className="p-2">
                          <div className="w-full h-3 border border-black bg-neutral-200 rounded-xs overflow-hidden">
                            <div
                              className="h-full bg-black"
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. 10 SORU DETAYLI CEVAP VE ÇÖZÜM KARNESİ TABLOSU */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b-2 border-black pb-1">
              <div className="text-xs font-black uppercase tracking-wider text-black border-l-4 border-black pl-2">
                10 SORULUK DETAYLI CEVAP VE ÇÖZÜM LİSTESİ
              </div>
              <div className="text-[11px] font-bold text-neutral-600">
                Her Soru 10 Puan • Toplam 100 Puan
              </div>
            </div>

            <div className="space-y-4">
              {examData.questions.map((q) => {
                const studentAnswer = result.answers[q.id];
                const isCorrect = studentAnswer === q.correctAnswer;
                const isEmpty = !studentAnswer;

                return (
                  <div
                    key={q.id}
                    className="border border-black rounded p-3.5 space-y-2.5 print-avoid-break bg-white"
                  >
                    {/* Soru Başlık Şeridi */}
                    <div className="flex items-center justify-between border-b border-black/60 pb-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black px-2 py-0.5 border border-black bg-neutral-100">
                          SORU {q.id}
                        </span>
                        <span className="font-bold text-neutral-800 text-[11px]">
                          [{q.learningOutcome}]
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono font-bold">
                        <span className="text-neutral-600">
                          Seçim: <strong>{studentAnswer || 'BOŞ'}</strong>
                        </span>
                        <span>•</span>
                        <span className="text-neutral-900">
                          Doğru: <strong>{q.correctAnswer}</strong>
                        </span>
                        <span>•</span>
                        {isCorrect ? (
                          <span className="px-2 py-0.5 border border-black bg-black text-white text-[11px] font-black">
                            DOĞRU (+10 P)
                          </span>
                        ) : isEmpty ? (
                          <span className="px-2 py-0.5 border border-neutral-400 bg-neutral-200 text-black text-[11px] font-bold">
                            BOŞ (0 P)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 border border-black bg-neutral-100 text-black text-[11px] font-black line-through">
                            YANLIŞ (0 P)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Soru Metni */}
                    <p className="font-bold text-black text-xs sm:text-sm leading-relaxed">
                      {q.questionText}
                    </p>

                    {/* Şıklar Tablosu */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {(['A', 'B', 'C', 'D'] as OptionKey[]).map((optKey) => {
                        const optText = q.options[optKey];
                        const isThisCorrect = q.correctAnswer === optKey;
                        const isThisStudent = studentAnswer === optKey;

                        let rowStyle = 'border border-neutral-300 bg-white text-neutral-800';
                        let tag = null;

                        if (isThisCorrect) {
                          rowStyle = 'border-2 border-black bg-neutral-100 font-bold text-black';
                          tag = (
                            <span className="ml-auto text-[10px] font-black border border-black px-1.5 py-0.5 bg-black text-white">
                              DOĞRU CEVAP
                            </span>
                          );
                        } else if (isThisStudent && !isCorrect) {
                          rowStyle = 'border border-black bg-neutral-50 font-medium text-neutral-900';
                          tag = (
                            <span className="ml-auto text-[10px] font-bold border border-black px-1.5 py-0.5 bg-neutral-200">
                              SEÇİMİNİZ
                            </span>
                          );
                        }

                        return (
                          <div
                            key={optKey}
                            className={`p-2 rounded flex items-start gap-2 ${rowStyle}`}
                          >
                            <span className="font-mono font-black shrink-0 w-4">
                              {optKey})
                            </span>
                            <span className="flex-1 leading-snug">{optText}</span>
                            {tag}
                          </div>
                        );
                      })}
                    </div>

                    {/* Pedagojik Açıklama */}
                    <div className="border-t border-neutral-200 pt-2 text-[11px] text-neutral-700 leading-relaxed">
                      <strong className="text-black font-bold">Açıklama / Çözüm Gerekçesi: </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. RESMİ İMZA VE ONAY ALANI */}
          <div className="border-t-2 border-black pt-6 grid grid-cols-3 gap-4 text-center text-xs print-avoid-break">
            <div className="border-r border-black/40 pr-2">
              <div className="font-bold text-neutral-700 uppercase">Öğrenci / Katılımcı</div>
              <div className="font-mono font-bold mt-1 text-black">{result.studentCode}</div>
              <div className="text-[10px] text-neutral-500 mt-6">(İmza)</div>
            </div>

            <div className="border-r border-black/40 px-2">
              <div className="font-bold text-neutral-700 uppercase">Öğretmen / Değerlendirici</div>
              <div className="font-medium mt-1 text-black">Ölçme ve Değerlendirme</div>
              <div className="text-[10px] text-neutral-500 mt-6">(İmza / Kaşe)</div>
            </div>

            <div className="pl-2">
              <div className="font-bold text-neutral-700 uppercase">Sistem Onayı</div>
              <div className="font-mono font-bold mt-1 text-black">
                Puan: {result.totalScore} / 100
              </div>
              <div className="text-[10px] text-neutral-500 mt-6">Resmi Belge Niteliğindedir</div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen-only Bottom Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs no-print">
        <div className="text-xs text-slate-500 text-center sm:text-left">
          Raporu siyah-beyaz PDF olarak indirebilir, sınavı tekrar çözebilir veya yeni bir öğrenme çıktısı ile sınav başlatabilirsiniz.
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onRetakeExam}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-xs sm:text-sm text-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Sınavı Yeniden Çöz</span>
          </button>

          <button
            type="button"
            onClick={onNewExam}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
          >
            <span>Yeni Sınav Oluştur</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
