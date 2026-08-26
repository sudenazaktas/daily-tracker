import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { meRequest } from '../services/auth'

export default function Settings() {
  const { user, login, token, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const me = await meRequest()
        // Context + localStorage'ı güncel bilgiyle tazele
        if (token) login(token, me)
      } catch {
        /* /auth/me başarısızsa mevcut context bilgisini kullan */
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initial = (user?.username || user?.email || 'K').charAt(0).toUpperCase()

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />

      <main className="flex-grow w-full max-w-2xl mx-auto px-md py-lg flex flex-col gap-lg">
        <div className="flex flex-col gap-xs">
          <div className="inline-flex items-center gap-xs bg-secondary-container/50 text-on-secondary-container px-sm py-base rounded-full w-max border border-secondary/10">
            <Icon name="settings" className="text-[16px]" />
            <span className="text-label-sm">Hesap</span>
          </div>
          <h1 className="text-headline-lg text-on-surface tracking-tight">
            Profil & <span className="text-primary">Ayarlar</span>
          </h1>
        </div>

        {/* Profil kartı */}
        <div className="glass-card rounded-xl p-md flex items-center gap-sm">
          <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-headline-md font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="text-headline-md text-on-surface truncate">
              {loading ? '…' : user?.username || 'Kullanıcı'}
            </div>
            <div className="text-body-md text-on-surface-variant truncate flex items-center gap-base">
              <Icon name="mail" className="text-[16px]" />
              {user?.email || '—'}
            </div>
          </div>
        </div>

        {/* Raporlar nasıl çalışır? */}
        <div className="glass-panel rounded-2xl p-md border border-outline-variant/20 flex flex-col gap-sm">
          <h2 className="text-headline-md text-on-surface flex items-center gap-xs">
            <Icon name="schedule" className="text-primary" />
            Raporlar Nasıl Çalışır?
          </h2>
          <ul className="flex flex-col gap-sm text-body-md text-on-surface-variant">
            <li className="flex gap-xs">
              <Icon name="check_circle" className="text-primary text-[20px] flex-shrink-0" />
              <span>
                Sistem <strong className="text-on-surface">her gün otomatik</strong>{' '}
                çalışır ve abone olduğunuz her konuyu kontrol eder.
              </span>
            </li>
            <li className="flex gap-xs">
              <Icon name="check_circle" className="text-primary text-[20px] flex-shrink-0" />
              <span>
                Her konu, seçtiğiniz sıklığa göre gönderilir:{' '}
                <strong className="text-on-surface">
                  günlük (24 saatte bir), 3 günde bir veya haftalık
                </strong>
                . Sıklığı Panel'deki konu çipinden istediğiniz an değiştirebilirsiniz.
              </span>
            </li>
            <li className="flex gap-xs">
              <Icon name="check_circle" className="text-primary text-[20px] flex-shrink-0" />
              <span>
                Rapor, o konuyla ilgili{' '}
                <strong className="text-on-surface">son 24 saatte</strong> yayımlanan en
                iyi içeriklerden derlenir ve e-posta adresinize gönderilir.
              </span>
            </li>
            <li className="flex gap-xs">
              <Icon name="check_circle" className="text-primary text-[20px] flex-shrink-0" />
              <span>
                Beklemeden görmek isterseniz Panel'de bir konunun{' '}
                <strong className="text-on-surface">"Şimdi Getir"</strong> düğmesini
                kullanabilirsiniz.
              </span>
            </li>
          </ul>
        </div>

        {/* Çıkış */}
        <button
          onClick={handleLogout}
          className="self-start inline-flex items-center gap-xs text-label-md text-error border border-error/30 bg-surface hover:bg-error-container/40 px-md py-xs rounded-full transition-colors"
        >
          <Icon name="logout" className="text-[18px]" />
          Çıkış Yap
        </button>
      </main>

      <Footer />
    </div>
  )
}
