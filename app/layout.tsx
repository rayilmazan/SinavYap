import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Sınav Yap - Öğrenme Çıktılarına Göre Sınav Hazırlama ve Değerlendirme',
  description: 'Öğrenme çıktılarına göre yapay zekâ destekli 10 soruluk çoktan seçmeli sınav oluşturma ve PDF karneli sonuç değerlendirme sistemi.',
  openGraph: {
    title: 'Sınav Yap - Öğrenme Çıktılarına Göre Sınav Hazırlama ve Değerlendirme',
    description: 'Öğrenme çıktılarına göre yapay zekâ destekli 10 soruluk çoktan seçmeli sınav oluşturma ve PDF karneli sonuç değerlendirme sistemi.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sınav Yap - Öğrenme Çıktılarına Göre Sınav Hazırlama ve Değerlendirme',
    description: 'Öğrenme çıktılarına göre yapay zekâ destekli 10 soruluk çoktan seçmeli sınav oluşturma ve PDF karneli sonuç değerlendirme sistemi.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
