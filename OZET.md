# daily_tracker — Proje Özeti

Bu dosya, takımın (ve AI asistanlarının) proje hakkında aynı bilgiye sahip olması için hazırlanmıştır. AI ile konuşurken bu dosyayı paylaşarak context vermiş olursunuz.

---

## 1. Projenin Amacı

Kullanıcı bir konu girer (örn. "React 19"), sisteme "subscribe" olur. Sistem her gün otomatik olarak (kullanıcı müdahalesi olmadan) o konuyla ilgili son 24 saatte yayımlanmış içerikleri web'de arar, en iyi 10 sonucu seçer ve kullanıcıya e-posta ile gönderir.

**Kullanıcı akışı:** Register → Login → Topic Subscribe → Daily Report (otomatik e-posta)

---

## 2. Teknoloji Yığını (Kesinleşenler)

| Katman | Teknoloji | Versiyon | Not |
|---|---|---|---|
| Frontend | React + TypeScript | _(doldurulacak)_ | |
| Backend | Python + FastAPI | Python 3.12 | |
| Kullanıcı Yönetimi | Strapi | _(doldurulacak)_ | Sadece auth/user için, frontend direkt bağlanmıyor |
| Veritabanı | PostgreSQL | 16 | Docker container olarak çalışıyor |
| Web Arama | Tavily | _(doldurulacak)_ | Alternatif: SerpAPI / Bing / Google Search API |
| Scheduler | APScheduler | _(doldurulacak)_ | Alternatif: Celery |
| E-mail | Resend | _(doldurulacak)_ | Alternatif: SendGrid |
| Containerization | Docker + Docker Compose | _(doldurulacak)_ | |
| AI | **Google Gemini** | `gemini-3.5-flash-lite` (başlangıç) | Yetersiz kalırsa `gemini-3.6-flash`'a yükseltilebilir |

## 3. Karar Verilenler — AI ve Sıralama

**AI Sağlayıcısı: Gemini** ✅ (kesinleşti)

**Model:** `gemini-3.5-flash-lite` ile başlanacak — düşük gecikme, yüksek hacimli otomasyon için uygun ve maliyet etkin. Yetersiz kalırsa (sıralama kalitesi düşükse) `gemini-3.6-flash`'a geçilebilir.

> Not: Gemini modelleri sık güncelleniyor/deprecate oluyor. Model adı kod içine hardcode edilmeyecek, `.env` dosyasında tutulacak:
> ```
> GEMINI_MODEL=gemini-3.5-flash-lite
> ```

**Sıralama (Ranking) Yaklaşımı: Hibrit (Kod + AI)**

```
Tavily sonuçları (20-30 adet)
        ↓
1) KOD: relevance score (Tavily'nin verdiği) + tarih filtresi → ~15-20'ye indir
        ↓
2) GEMINI (flash-lite): tekrar tespiti + kaynak güvenilirliği + son sıralama → en iyi 10
        ↓
Email
```

**Neden hibrit:**
- Sadece kodla (formülle) sıralama → öngörülebilir ama nüanssız, "bu haber gerçekten önemli mi" gibi kararları veremez
- Sadece AI ile (tüm sonuçları direkt Gemini'ye atmak) → esnek ama maliyetli/yavaş, tutarsız olabilir
- Hibrit → önce ucuz/hızlı kod filtresiyle kaba eleme, sonra AI'a sadece nüans gerektiren son adımı bırakma

**Gemini'nin görevleri:**
- Aynı haberin farklı sitelerdeki tekrarlarını tespit etmek
- Kaynağın güvenilirliğini değerlendirmek
- İçeriğin konuyla gerçek alakasını kontrol etmek
- En iyi 10'u seçip önem sırasına koymak

**Teknik notlar:**
- Gemini'den **structured output (JSON)** istenecek, serbest metin değil — backend'de parse etmeyi kolaylaştırmak için
- Gemini beklenmeyen formatta dönerse diye `try/except` + fallback mekanizması (örn. sadece relevance score'a göre sırala) kurulacak
- Kod: `backend/app/services/ranking.py` içinde tutulacak

---

## 4. Mimari Akış

```
[React Frontend]
       │  REST API (JWT token ile)
       ▼
[FastAPI Backend]  ←──────────────┐
       │           │              │
       ▼           ▼              ▼
  [Strapi]    [PostgreSQL]   [Scheduler
 (kullanıcı)  (abonelikler)   - APScheduler]
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              [Tavily API]   [AI: Gemini]   [Resend API]
              (web arama)   (sıralama/özet)  (mail gönder)
```

**Önemli kısıt:** Frontend, Strapi'ye **direkt bağlanmıyor**. Tüm trafik FastAPI backend üzerinden geçiyor:
```
Frontend → FastAPI Backend → Strapi
```

---

## 5. Proje Klasör Yapısı

```
daily_tracker/
├── .gitignore
├── README.md
├── docker-compose.yml
├── backend/          # Python / FastAPI
│   ├── .env
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── api/          # Endpoint'ler
│       ├── schemas/       # Pydantic modelleri
│       └── services/      # İş mantığı (AI, Web Search, Mail)
├── frontend/         # React + TypeScript
│   ├── .env
│   ├── package.json
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
└── cms/              # Strapi (kullanıcı yönetimi)
    ├── .env
    ├── package.json
    └── src/
```

---

## 6. Örnek API Endpoint'leri

```
POST   /auth/register
POST   /auth/login
GET    /subscriptions
POST   /subscriptions
DELETE /subscriptions/{id}
```

---

## 7. Şu Ana Kadar Yapılanlar

- [ ] Repo oluşturuldu
- [ ] Klasör yapısı kuruldu
- [ ] Docker Compose ile PostgreSQL + backend ayağa kaldırıldı
- [ ] FastAPI temel iskelet çalışıyor
- [ ] Veritabanı bağlantısı (SQLAlchemy)
- [ ] Strapi kurulumu
- [ ] Auth (register/login) entegrasyonu
- [ ] Subscribe/Unsubscribe endpoint'leri
- [ ] Tavily entegrasyonu
- [ ] Sıralama algoritması
- [ ] E-posta gönderimi
- [ ] Scheduler entegrasyonu
- [ ] Frontend

---

*Son güncelleme: bu dosyayı güncel tutmak için her önemli karar sonrası düzenleyin.*
