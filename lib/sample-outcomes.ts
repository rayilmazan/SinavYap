// lib/sample-outcomes.ts

export interface SampleOutcome {
  id: string;
  title: string;
  subject: string;
  text: string;
}

export const SAMPLE_OUTCOMES: SampleOutcome[] = [
  {
    id: 'fen-bilimleri',
    title: 'Fen Bilimleri - Güneş Sistemi ve Gezegenler',
    subject: 'Fen Bilimleri',
    text: `Öğrenme Çıktısı 1: Güneş Sistemi'ndeki gezegenleri Güneş'e olan yakınlıklarına, büyüklüklerine ve fiziksel özelliklerine (karasal/gaz devi) göre sınıflandırır.
Öğrenme Çıktısı 2: Ay'ın evrelerinin (Yeni Ay, İlk Dördün, Dolunay, Son Dördün) oluşum sebeplerini ve Dünya'dan gözlemlenen döngüsünü açıklar.
Öğrenme Çıktısı 3: Güneş ve Ay tutulmalarını modeller üzerinde göstererek aralarındaki temel farkları açıklar.`,
  },
  {
    id: 'matematik',
    title: 'Matematik - Kesirler ve Yüzdeler',
    subject: 'Matematik',
    text: `Öğrenme Çıktısı 1: Kesirlerle toplama ve çıkarma işlemlerini ortak payda kavramını kullanarak doğru şekilde yapar.
Öğrenme Çıktısı 2: Bir çokluğun belirtilen bir kesir veya yüzde kadarını hesaplayarak günlük hayat problemlerini çözer.
Öğrenme Çıktısı 3: Ondalık gösterim ile kesir ve yüzde gösterimleri arasında dönüşüm yapar.`,
  },
  {
    id: 'turkce',
    title: 'Türkçe - Paragrafta Anlam ve Noktalama',
    subject: 'Türkçe',
    text: `Öğrenme Çıktısı 1: Okuduğu metnin ana fikrini, yardımcı fikirlerini ve yazarın bakış açısını tespit eder.
Öğrenme Çıktısı 2: Noktalama işaretlerinin (nokta, virgül, noktalı virgül, iki nokta) cümledeki işlevlerini doğru uygular.
Öğrenme Çıktısı 3: Metindeki anlatım biçimlerini (öyküleme, betimleme, açıklama, tartışma) ve düşünceyi geliştirme yollarını ayırt eder.`,
  },
  {
    id: 'bilisim',
    title: 'Bilişim Teknolojileri - Algoritmalar ve Siber Güvenlik',
    subject: 'Bilişim Teknolojileri',
    text: `Öğrenme Çıktısı 1: Bir problemin çözüm adımlarını algoritma ve akış şeması mantığıyla adım adım kurgular.
Öğrenme Çıktısı 2: Güçlü parola oluşturma kurallarını ve siber zorbalık/oltalama (phishing) saldırılarına karşı korunma yöntemlerini uygular.
Öğrenme Çıktısı 3: Dijital ayak izi ve telif haklarının dijital ortamdaki önemini açıklar.`,
  },
  {
    id: 'sosyal-bilgiler',
    title: 'Sosyal Bilgiler - Coğrafi Bölgeler ve İklim',
    subject: 'Sosyal Bilgiler',
    text: `Öğrenme Çıktısı 1: Türkiye'nin farklı iklim tiplerini (Karadeniz, Akdeniz, Karasal) ve bitki örtüsü özelliklerini karşılaştırır.
Öğrenme Çıktısı 2: İklim özelliklerinin insanların ekonomik faaliyetleri ve yerleşim tercihleri üzerindeki etkilerini analiz eder.
Öğrenme Çıktısı 3: Doğal afetlerin oluşum nedenlerini ve afet öncesi/sonrası alınacak tedbirleri açıklar.`,
  },
];
