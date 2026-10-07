import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmalısınız.' },
        { status: 401 }
      );
    }

    const results = await query(
      `SELECT id, exam_id, student_code, score, max_score, correct_count, wrong_count, empty_count, percentage, time_spent_seconds, result_data, completed_at 
       FROM exam_results 
       WHERE user_id = $1 
       ORDER BY completed_at DESC`,
      [user.id]
    );

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Sınav sonuçlarını alma hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Sonuçlar yüklenirken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmalısınız.' },
        { status: 401 }
      );
    }

    const { examId, studentCode, score, maxScore, correctCount, wrongCount, emptyCount, percentage, timeSpentSeconds, resultData } = await req.json();

    const result = await query(
      `INSERT INTO exam_results (
        user_id, exam_id, student_code, score, max_score, 
        correct_count, wrong_count, empty_count, percentage, 
        time_spent_seconds, result_data
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING id, completed_at`,
      [
        user.id,
        examId || null,
        studentCode || 'OGR-USER',
        score || 0,
        maxScore || 100,
        correctCount || 0,
        wrongCount || 0,
        emptyCount || 0,
        percentage || 0,
        timeSpentSeconds || 0,
        JSON.stringify(resultData || {}),
      ]
    );

    return NextResponse.json({ success: true, resultRecord: result[0] });
  } catch (error: any) {
    console.error('Sonuç kaydetme hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Sınav sonucu veritabanına kaydedilirken hata oluştu.' },
      { status: 500 }
    );
  }
}
