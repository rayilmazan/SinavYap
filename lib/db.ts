import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (pool) return pool;

  const connectionString =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    console.warn(
      'UYARI: POSTGRES_URL veya DATABASE_URL ortam değişkeni tanımlı değil. Lütfen .env.local dosyasını kontrol edin.'
    );
  }

  pool = new Pool({
    connectionString,
    ssl:
      connectionString && !connectionString.includes('localhost')
        ? { rejectUnauthorized: false }
        : false,
  });

  return pool;
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const p = getDbPool();
  const res = await p.query(text, params);
  return res.rows;
}
