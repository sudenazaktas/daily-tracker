import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginRequest, registerRequest } from '../services/auth'
import Icon from '../components/Icon'
import ThemeToggle from '../components/ThemeToggle'
import PasswordStrength from '../components/PasswordStrength'

type Mode = 'login' | 'register'

/** Strapi/axios hata yanıtından okunabilir bir mesaj çıkarır. */
function extractError(err: unknown): string {
  const anyErr = err as {
    response?: { data?: { detail?: { error?: { message?: string } } | string } }
  }
  const detail = anyErr?.response?.data?.detail
  if (typeof detail === 'string') return detail
  const msg = detail?.error?.message
  if (msg) return msg
  return 'Bir hata oluştu. Lütfen bilgilerinizi kontrol edin.'
}

export default function Auth() {
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result =
        mode === 'login'
          ? await loginRequest(email, password)
          : await registerRequest(username, email, password)
      login(result.jwt, result.user, result.refreshToken)
      navigate('/dashboard')
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setError(null)
  }

  const inputClass =
    'w-full bg-surface-container-low border border-outline-variant/50 rounded-full py-sm pl-[48px] pr-sm text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all'
  const passwordInputClass = inputClass.replace('pr-sm', 'pr-[48px]')

  return (
    <div className="relative h-screen w-full flex m-0 p-0 overflow-hidden">
      {/* Tema geçişi */}
      <div className="absolute top-md right-md z-20">
        <ThemeToggle />
      </div>
      {/* Sol panel — marka & grafik */}
      <div className="hidden md:flex md:w-1/2 left-panel-bg flex-col justify-center items-center p-xl relative">
        <div className="flowing-lines"></div>
        <div className="relative z-10 flex flex-col items-center">
          <svg
            className="w-64 h-64 text-primary opacity-80"
            fill="none"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="45"
              cy="45"
              r="30"
              stroke="currentColor"
              strokeOpacity="0.8"
              strokeWidth="4"
            />
            <line
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="8"
              x1="66"
              x2="85"
              y1="66"
              y2="85"
            />
            <path
              d="M30 55 L45 35 L60 55"
              stroke="#6cdd89"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            <circle cx="45" cy="35" fill="#006b31" r="4" />
            <circle cx="30" cy="55" fill="#006b31" r="3" />
            <circle cx="60" cy="55" fill="#006b31" r="3" />
          </svg>
          <div className="mt-lg text-center max-w-[28rem]">
            <h2 className="text-headline-lg text-primary mb-sm">
              En İyi İçerik, Her Gün Kutunda
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              Takip etmek istediğin konuyu gir; gündemi kaçırmadan, özenle seçilmiş
              içeriklerle başla.
            </p>
          </div>
        </div>
      </div>

      {/* Sağ panel — form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-surface-bright p-sm md:p-xl overflow-y-auto">
        <div className="glass-card w-full max-w-[28rem] rounded-xl p-md flex flex-col gap-lg">
          <div className="text-center">
            <h1 className="text-headline-xl text-primary mb-xs">Daily Tracker</h1>
            <p className="text-body-md text-on-surface-variant">
              {mode === 'login'
                ? 'Tekrar hoş geldiniz. Lütfen bilgilerinizi girin.'
                : 'Yeni bir hesap oluşturarak başlayın.'}
            </p>
          </div>

          {/* Sekmeler */}
          <div className="flex border-b border-outline-variant/30 mb-sm">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-sm text-label-md text-center transition-colors ${
                mode === 'login'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-sm text-label-md text-center transition-colors ${
                mode === 'register'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          <form className="flex flex-col gap-sm" onSubmit={handleSubmit}>
            {/* Kullanıcı adı — yalnızca kayıt */}
            {mode === 'register' && (
              <div className="flex flex-col gap-base">
                <label className="text-label-sm text-on-surface" htmlFor="username">
                  Kullanıcı Adı
                </label>
                <div className="relative flex items-center">
                  <Icon
                    name="person"
                    className="absolute left-sm text-outline"
                  />
                  <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="kullanici_adi"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* E-posta */}
            <div className="flex flex-col gap-base">
              <label className="text-label-sm text-on-surface" htmlFor="email">
                E-posta Adresi
              </label>
              <div className="relative flex items-center">
                <Icon name="mail" className="absolute left-sm text-outline" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="siz@ornek.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="flex flex-col gap-base">
              <label className="text-label-sm text-on-surface" htmlFor="password">
                Şifre
              </label>
              <div className="relative flex items-center">
                <Icon name="lock" className="absolute left-sm text-outline" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={passwordInputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  title={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  className="absolute right-sm text-outline hover:text-primary transition-colors flex items-center"
                >
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
                </button>
              </div>
              {mode === 'register' && <PasswordStrength password={password} />}
            </div>

            {mode === 'login' && (
              <div className="flex justify-between items-center mt-xs">
                <label className="flex items-center gap-xs cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary"
                  />
                  <span className="text-label-sm text-on-surface-variant">
                    Beni hatırla
                  </span>
                </label>
                <a href="#" className="text-label-sm text-primary hover:underline">
                  Şifremi unuttum
                </a>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-xs bg-error-container text-on-error-container text-label-sm rounded-lg px-sm py-xs mt-xs">
                <Icon name="error" className="text-[18px]" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-sm w-full bg-primary text-on-primary text-label-md py-sm rounded-full shadow-[0_4px_12px_rgba(0,107,49,0.2)] hover:bg-primary-container hover:text-on-primary-container transition-all flex justify-center items-center gap-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Lütfen bekleyin…'
                : mode === 'login'
                  ? 'Giriş Yap'
                  : 'Hesap Oluştur'}
              {!loading && <Icon name="arrow_forward" />}
            </button>

            <div className="relative flex items-center justify-center my-sm">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30"></div>
              </div>
              <span className="relative bg-surface-bright px-sm text-label-sm text-outline">
                veya şununla devam et
              </span>
            </div>

            <div className="flex gap-sm">
              <button
                type="button"
                className="flex-1 bg-surface-container-lowest border border-outline-variant/50 py-sm rounded-full flex justify-center items-center gap-xs hover:bg-surface-container-low transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-label-sm text-on-surface">Google</span>
              </button>
              <button
                type="button"
                className="flex-1 bg-surface-container-lowest border border-outline-variant/50 py-sm rounded-full flex justify-center items-center gap-xs hover:bg-surface-container-low transition-colors"
              >
                <Icon name="work" className="text-on-surface" />
                <span className="text-label-sm text-on-surface">Kurumsal</span>
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-label-sm text-on-surface-variant">
              Devam ederek{' '}
              <a href="#" className="text-primary hover:underline">
                Kullanım Şartları
              </a>{' '}
              ve{' '}
              <a href="#" className="text-primary hover:underline">
                Gizlilik Politikası
              </a>
              'nı kabul etmiş olursunuz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
