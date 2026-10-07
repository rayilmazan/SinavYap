import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // 1. Users Table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Saved Exams Table
    await query(`
      CREATE TABLE IF NOT EXISTS saved_exams (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        outcomes_text TEXT NOT NULL,
        exam_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Exam Results Table
    await query(`
      CREATE TABLE IF NOT EXISTS exam_results (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        exam_id INT REFERENCES saved_exams(id) ON DELETE SET NULL,
        student_code VARCHAR(100) NOT NULL,
        score INT NOT NULL,
        max_score INT NOT NULL,
        correct_count INT NOT NULL,
        wrong_count INT NOT NULL,
        empty_count INT NOT NULL,
        percentage INT NOT NULL,
        time_spent_seconds INT NOT NULL,
        result_data JSONB NOT NULL,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return NextResponse.json({
      success: true,
      message: 'PostgreSQL veritabanı tablosu başarıyla ilklendirildi.',
    });
  } catch (error: any) {
    console.error('Veritabanı ilklendirme hatası:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Veritabanı tabloları oluşturulurken hata meydana geldi.',
      },
      { status: 500 }
    );
  }
}
