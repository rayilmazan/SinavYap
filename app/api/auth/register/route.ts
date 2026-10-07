import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, signToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Lütfen tüm alanları doldurunuz.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifreniz en az 6 karakter olmalıdır.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // E-posta kullanımda mı kontrol et
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = $1',
      [cleanEmail]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kayıtlı.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name.trim(), cleanEmail, passwordHash]
    );

    const newUser = result[0];

    const token = await signToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Kayıt olma hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Kullanıcı kaydı oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
