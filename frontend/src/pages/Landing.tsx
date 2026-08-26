import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Icon from '../components/Icon'

const FEATURES = [
  {
    icon: 'track_changes',
    iconBg: 'bg-secondary-container text-on-secondary-container',
    title: 'Konu Takibi',
    text: 'İlgilendiğin konulara abone ol, hiçbir gelişmeyi kaçırma.',
  },
  {
    icon: 'auto_awesome',
    iconBg: 'bg-primary-container text-on-primary-container',
    title: 'Yapay Zekâ Seçimi',
    text: 'Gemini destekli sıralama, günün en iyi 10 içeriğini senin için seçer.',
    highlight: true,
  },
  {
    icon: 'forward_to_inbox',
    iconBg: 'bg-tertiary-container text-on-tertiary',
    title: 'Günlük E-posta',
    text: 'Seçilen içerikler her gün otomatik olarak e-posta kutuna gelir.',
  },
]

export default function Landing() {
  const { isAuthenticated } = useAuth()
  const primaryTo = isAuthenticated ? '/dashboard' : '/auth'

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />

      <main className="flex-grow flex flex-col relative w-full">
        {/* Hero */}
        <section className="relative w-full overflow-hidden min-h-[80vh] flex items-center pt-xl pb-xl">
          {/* Dekoratif arka plan çizgileri */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
            <svg
              height="100%"
              preserveAspectRatio="none"
              viewBox="0 0 1000 1000"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="animated-line"
                d="M -100,500 Q 250,200 500,500 T 1100,500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: 'var(--color-primary-container)' }}
              />
              <path
                className="animated-line"
                d="M -100,600 Q 250,300 500,600 T 1100,600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ animationDelay: '-2s' }}
              />
              <circle
                cx="500"
                cy="500"
                fill="none"
                opacity="0.5"
                r="400"
                stroke="currentColor"
                strokeWidth="0.5"
                style={{ color: 'var(--color-tertiary-fixed)' }}
              />
              <circle
                cx="500"
                cy="500"
                fill="none"
                opacity="0.3"
                r="300"
                stroke="currentColor"
                strokeWidth="0.5"
                style={{ color: 'var(--color-tertiary-fixed)' }}
              />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-md w-full relative z-10 grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
            {/* Metin */}
            <div className="flex flex-col gap-sm md:pr-lg">
              <div className="inline-flex items-center gap-xs bg-secondary-container/50 text-on-secondary-container px-sm py-base rounded-full w-max border border-secondary/10 mb-sm">
                <Icon name="visibility" className="text-[16px]" />
                <span className="text-label-sm">Günlük İçerik Takibi</span>
              </div>
              <h1 className="text-headline-lg-mobile md:text-headline-xl text-on-surface tracking-tight text-balance">
                Gündemi{' '}
                <span className="text-primary relative inline-block">
                  Mercek
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-2 text-primary"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 10"
                  >
                    <path
                      d="M0 5 Q 50 10 100 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </span>{' '}
                Altına Al
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-[32rem] mt-base">
                Takip etmek istediğin konuyu gir; Daily Tracker her gün son 24 saatin
                en iyi içeriklerini bulup e-posta kutuna göndersin.
              </p>
              <div className="flex flex-col sm:flex-row gap-sm mt-lg">
                <Link
                  to={primaryTo}
                  className="bg-primary text-on-primary text-label-md px-lg py-sm rounded-lg shadow-sm hover:bg-primary-container hover:shadow-md transition-all flex items-center justify-center gap-xs"
                >
                  Hemen Başla
                  <Icon name="arrow_forward" className="text-[20px]" />
                </Link>
                <a
                  href="#ozellikler"
                  className="bg-surface text-primary border border-primary/20 text-label-md px-lg py-sm rounded-lg hover:bg-surface-container-low transition-all flex items-center justify-center"
                >
                  Nasıl Çalışır?
                </a>
              </div>

              <div className="flex items-center gap-sm mt-xl pt-lg border-t border-outline-variant/20">
                <div className="flex -space-x-2">
                  {['A', 'B', 'C'].map((c) => (
                    <div
                      key={c}
                      className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-label-sm font-bold text-on-surface-variant"
                    >
                      {c}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-label-sm text-on-surface font-bold">
                    10.000+ Kullanıcı
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    Gündemi kaçırmıyor
                  </span>
                </div>
              </div>
            </div>

            {/* Mercek illüstrasyonu */}
            <div className="relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center">
              <div className="relative w-full max-w-[400px] h-[400px]">
                {/* Lens */}
                <div className="absolute top-0 right-0 w-[280px] h-[280px] rounded-full border-[8px] border-primary glass-panel shadow-[0_20px_40px_-15px_rgba(0,107,49,0.2)] flex items-center justify-center z-20 overflow-hidden group hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 transform -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                  <div className="w-full h-full p-lg bg-surface-bright/40 flex flex-col justify-center gap-sm">
                    <div className="w-3/4 h-2 bg-surface-container-highest rounded-full"></div>
                    <div className="w-full h-2 bg-surface-container-highest rounded-full"></div>
                    <div className="w-5/6 h-2 bg-surface-container-highest rounded-full"></div>
                    <div className="mt-sm flex items-end gap-base h-16 w-full">
                      <div className="w-1/5 bg-secondary-container h-1/4 rounded-t-sm"></div>
                      <div className="w-1/5 bg-secondary-container h-2/4 rounded-t-sm"></div>
                      <div className="w-1/5 bg-secondary-container h-1/3 rounded-t-sm"></div>
                      <div className="w-1/5 bg-primary h-full rounded-t-sm shadow-[0_0_15px_rgba(0,107,49,0.5)]"></div>
                      <div className="w-1/5 bg-secondary-container h-3/4 rounded-t-sm"></div>
                    </div>
                  </div>
                </div>
                {/* Sap */}
                <div className="absolute bottom-10 left-10 w-[140px] h-[32px] bg-tertiary rounded-full transform -rotate-45 shadow-lg z-10">
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-on-tertiary-fixed/20 rounded-l-full"></div>
                </div>
                {/* Yüzen etiketler */}
                <div
                  className="absolute top-10 left-0 glass-panel px-sm py-xs rounded-xl shadow-sm z-30 flex items-center gap-xs animate-bounce"
                  style={{ animationDuration: '3s' }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-label-sm text-on-surface">Son 24 Saat</span>
                </div>
                <div
                  className="absolute bottom-20 right-[-20px] glass-panel px-sm py-xs rounded-xl shadow-sm z-30 flex items-center gap-xs animate-bounce"
                  style={{ animationDuration: '4s', animationDelay: '1s' }}
                >
                  <Icon name="trending_up" className="text-[16px] text-primary" />
                  <span className="text-label-sm text-on-surface">Taze İçerik</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Özellik kartları */}
        <section
          id="ozellikler"
          className="max-w-7xl mx-auto px-md w-full mb-xl scroll-mt-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`glass-panel p-md rounded-2xl flex flex-col gap-sm border border-outline-variant/20 hover:shadow-md transition-shadow ${
                  f.highlight ? 'bg-surface-bright' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${f.iconBg}`}
                >
                  <Icon name={f.icon} />
                </div>
                <div>
                  <h3 className="text-body-lg font-semibold text-on-surface">
                    {f.title}
                  </h3>
                  <p className="text-[14px] text-on-surface-variant mt-xs">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
