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

    const exams = await query(
      `SELECT id, title, outcomes_text, exam_data, created_at 
       FROM saved_exams 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [user.id]
    );

    return NextResponse.json({ success: true, exams });
  } catch (error: any) {
    console.error('Kayıtlı sınavları alma hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Sınavlar yüklenirken hata oluştu.' },
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

    const { title, outcomesText, examData } = await req.json();

    if (!examData) {
      return NextResponse.json(
        { error: 'Görünür sınav verisi eksik.' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO saved_exams (user_id, title, outcomes_text, exam_data) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, title, created_at`,
      [
        user.id,
        title || examData.examTitle || 'Kazanım Tabanlı Sınav',
        outcomesText || '',
        JSON.stringify(examData),
      ]
    );

    return NextResponse.json({ success: true, exam: result[0] });
  } catch (error: any) {
    console.error('Sınav kaydetme hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Sınav veritabanına kaydedilirken hata oluştu.' },
      { status: 500 }
    );
  }
}
