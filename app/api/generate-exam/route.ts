import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from '@/lib/talimat';
import { ExamData, Question } from '@/lib/types';
import { getAuthUser } from '@/lib/auth';

export const maxDuration = 60; // Allow sufficient time for quality 10-question generation

// List of models to try in sequence: primary model first, followed by fallbacks if free tier quota (429) is exhausted
const MODELS_TO_TRY = [
  GEMINI_MODEL, // Primary constant requested: 'gemini-3.8-flash'
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
];

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        {
          error:
            'Sınav oluşturabilmek için lütfen öncelikle kullanıcı girişi yapınız.',
        },
        { status: 401 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'Gemini API anahtarı sunucu ortam değişkenlerinde (GEMINI_API_KEY) tanımlı değil.',
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { learningOutcomes } = body;

    if (
      !learningOutcomes ||
      typeof learningOutcomes !== 'string' ||
      learningOutcomes.trim().length < 10
    ) {
      return NextResponse.json(
        {
          error:
            'Lütfen geçerli öğrenme çıktıları metni giriniz ("Öğrenme Çıktısı 1:", vb.).',
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const userPrompt = `
Lütfen aşağıdaki öğrenme çıktılarını derinlemesine analiz et ve müfredat ile ilgili konuları araştırarak 10 adet çoktan seçmeli, 4 seçenekli (A, B, C, D) sınav sorusu hazırla.

ÖĞRETMEN TARAFINDAN GİRİLEN ÖĞRENME ÇIKTILARI:
${learningOutcomes.trim()}

KURALLAR:
- Toplam tam 10 soru üret.
- Her soru 10 puan değerindedir.
- 4 seçenek (A, B, C, D) ve tek kesin doğru cevabı olmalıdır.
- Sorular birbirinden tamamen farklı olmalı, seçeneklerde aynı metinler veya anlamsız çeldiriciler bulunmamalıdır.
- Sorular Türkçe karakterlerle temiz, anlaşılır ve rahat okunur olmalıdır.
- Her soru için doğru cevabın gerekçesini ve hangi öğrenme çıktısıyla eşleştiğini belirt.
- Asla öğrenci adı, soyadı, okul no gibi kişisel veriler içeren unsurlar üretme.
`.trim();

    const responseSchemaConfig = {
      type: Type.OBJECT,
      properties: {
        examTitle: {
          type: Type.STRING,
          description: 'Sınavın ders ve konu başlığı',
        },
        subject: {
          type: Type.STRING,
          description: 'Ders veya alan adı',
        },
        totalQuestions: {
          type: Type.INTEGER,
          description: 'Toplam soru sayısı (10)',
        },
        pointsPerQuestion: {
          type: Type.INTEGER,
          description: 'Her sorunun puanı (10)',
        },
        learningOutcomes: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Kapsanan öğrenme çıktıları listesi',
        },
        questions: {
          type: Type.ARRAY,
          description: '10 adet soru',
          items: {
            type: Type.OBJECT,
            properties: {
              id: {
                type: Type.INTEGER,
                description: '1-10 arası soru numarası',
              },
              learningOutcome: {
                type: Type.STRING,
                description: 'İlgili öğrenme çıktısı etiketi veya metni',
              },
              questionText: {
                type: Type.STRING,
                description: 'Soru metni ve soru kökü',
              },
              options: {
                type: Type.OBJECT,
                properties: {
                  A: { type: Type.STRING },
                  B: { type: Type.STRING },
                  C: { type: Type.STRING },
                  D: { type: Type.STRING },
                },
                required: ['A', 'B', 'C', 'D'],
              },
              correctAnswer: {
                type: Type.STRING,
                description: 'Doğru şık: A, B, C veya D',
              },
              explanation: {
                type: Type.STRING,
                description: 'Doğru seçeneğin gerekçeli pedagojik açıklaması',
              },
            },
            required: [
              'id',
              'learningOutcome',
              'questionText',
              'options',
              'correctAnswer',
              'explanation',
            ],
          },
        },
      },
      required: [
        'examTitle',
        'subject',
        'totalQuestions',
        'pointsPerQuestion',
        'questions',
      ],
    };

    let textOutput: string | undefined;
    let lastError: unknown;

    // Try primary model first, fallback to alternate flash models if quota (429) or demand (503) is hit
    for (const modelToTry of MODELS_TO_TRY) {
      try {
        console.log(`Gemini sınav oluşturma deneniyor: Model = ${modelToTry}`);
        const response = await ai.models.generateContent({
          model: modelToTry,
          contents: userPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.6,
            responseMimeType: 'application/json',
            responseSchema: responseSchemaConfig,
          },
        });

        textOutput = response.text;
        if (textOutput) {
          break; // Success!
        }
      } catch (err: unknown) {
        lastError = err;
        const errStr = String(err);
        console.warn(`Model ${modelToTry} çağrısında hata:`, errStr);

        const isQuotaOrTransient =
          errStr.includes('429') ||
          errStr.includes('RESOURCE_EXHAUSTED') ||
          errStr.includes('quota') ||
          errStr.includes('503') ||
          errStr.includes('UNAVAILABLE') ||
          errStr.includes('high demand');

        if (isQuotaOrTransient) {
          // Continue to next available model in MODELS_TO_TRY
          continue;
        } else {
          // If other fatal error (e.g. invalid arguments), throw immediately
          throw err;
        }
      }
    }

    if (!textOutput) {
      const errStr = String(lastError);
      if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED')) {
        return NextResponse.json(
          {
            error:
              'Gemini ücretsiz günlük kota sınırına (Free Tier limit) ulaşıldı. Google AI Studio Secrets/Settings panelinden bir API anahtarı ekleyebilir veya kotanın sıfırlanmasını bekleyebilirsiniz.',
            isQuotaExceeded: true,
          },
          { status: 429 }
        );
      }
      throw lastError || new Error('Modelden yanıt alınamadı.');
    }

    let parsedData: ExamData;
    try {
      parsedData = JSON.parse(textOutput) as ExamData;
    } catch {
      // Try cleaning markdown markers if present
      const cleaned = textOutput
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      parsedData = JSON.parse(cleaned) as ExamData;
    }

    // Validate that we have 10 questions and well-structured options
    if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
      throw new Error('Sınav soruları formatı doğrulanamadı.');
    }

    // Ensure id order and uppercase correct answer
    parsedData.questions = parsedData.questions.map(
      (q: Question, idx: number) => ({
        ...q,
        id: idx + 1,
        correctAnswer: (q.correctAnswer?.toUpperCase() || 'A') as
          | 'A'
          | 'B'
          | 'C'
          | 'D',
      })
    );

    parsedData.totalQuestions = parsedData.questions.length;
    parsedData.pointsPerQuestion = 10;
    parsedData.createdAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      exam: parsedData,
    });
  } catch (error: unknown) {
    const errorStr = String(error);
    console.error('Error generating exam:', error);

    if (errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json(
        {
          error:
            'Ücretsiz günlük kullanım kotası doldu (429 RESOURCE_EXHAUSTED). Lütfen Google AI Studio Secrets bölümünden kendi API anahtarınızı tanımlayın veya kotanın yenilenmesini bekleyin.',
          isQuotaExceeded: true,
        },
        { status: 429 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
    return NextResponse.json(
      {
        error: `Sınav oluşturulurken bir hata meydana geldi: ${errorMessage}`,
        isRetryable: true,
      },
      { status: 500 }
    );
  }
}
