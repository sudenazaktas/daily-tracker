import { useEffect, useState, type FormEvent } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Icon from '../components/Icon'
import SubscriptionCard from '../components/SubscriptionCard'
import { useAuth } from '../context/AuthContext'
import {
  listSubscriptions,
  createSubscription,
  deleteSubscription,
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  FREQUENCY_LABELS,
  FREQUENCY_OPTIONS,
  type Subscription,
  type Category,
  type Frequency,
} from '../services/subscriptions'
import { runDailyJob } from '../services/jobs'

export default function Dashboard() {
  const { user } = useAuth()
  const [subs, setSubs] = useState<Subscription[]>([])
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState<Category>('General')
  const [frequency, setFrequency] = useState<Frequency>('daily')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [triggering, setTriggering] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setSubs(await listSubscriptions())
    } catch {
      setError('Abonelikler yüklenemedi. Backend çalışıyor mu?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = topic.trim()
    if (!trimmed) return
    setSubmitting(true)
    setError(null)
    try {
      const created = await createSubscription(trimmed, category, frequency)
      setSubs((prev) => [created, ...prev])
      setTopic('')
      setCategory('General')
      setFrequency('daily')
    } catch {
      setError('Konu eklenemedi. Lütfen tekrar deneyin.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    const prev = subs
    setSubs((s) => s.filter((x) => x.id !== id))
    try {
      await deleteSubscription(id)
    } catch {
      setError('Silme işlemi başarısız oldu.')
      setSubs(prev)
    }
  }

  const handleUpdate = (updated: Subscription) => {
    setSubs((s) => s.map((x) => (x.id === updated.id ? updated : x)))
  }

  const handleRunNow = async () => {
    setTriggering(true)
    try {
      await runDailyJob()
      showToast('Rapor görevi başlatıldı. Zamanı gelen abonelikler için e-postalar arka planda gönderiliyor.')
    } catch {
      showToast('Görev tetiklenemedi. Backend çalışıyor mu?')
    } finally {
      setTriggering(false)
    }
  }

  const greetingName = user?.username || user?.email?.split('@')[0] || 'Kullanıcı'

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-md py-lg flex flex-col gap-lg">
        {/* Başlık */}
        <div className="flex flex-col gap-xs">
          <div className="inline-flex items-center gap-xs bg-secondary-container/50 text-on-secondary-container px-sm py-base rounded-full w-max border border-secondary/10">
            <Icon name="waving_hand" className="text-[16px]" />
            <span className="text-label-sm">Merhaba, {greetingName}</span>
          </div>
          <h1 className="text-headline-lg text-on-surface tracking-tight">
            Takip Ettiğiniz <span className="text-primary">Konular</span>
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl">
            Abone olduğunuz her konu için sistem, seçtiğiniz sıklıkta son 24 saatteki en
            iyi içerikleri arayıp e-posta ile gönderir.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          {/* Konu ekleme formu */}
          <aside className="lg:col-span-1">
            <div className="glass-card rounded-xl p-md flex flex-col gap-sm lg:sticky lg:top-24">
              <div className="flex items-center gap-xs">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                  <Icon name="add_circle" />
                </div>
                <h2 className="text-headline-md text-on-surface">Yeni Konu</h2>
              </div>

              <form className="flex flex-col gap-sm mt-sm" onSubmit={handleAdd}>
                <div className="flex flex-col gap-base">
                  <label className="text-label-sm text-on-surface" htmlFor="topic">
                    Konu
                  </label>
                  <div className="relative flex items-center">
                    <Icon name="search" className="absolute left-sm text-outline" />
                    <input
                      id="topic"
                      type="text"
                      required
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="örn. React 19"
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-full py-sm pl-[48px] pr-sm text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-base">
                  <label className="text-label-sm text-on-surface" htmlFor="category">
                    Kategori
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-full py-sm px-sm text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-base">
                  <label className="text-label-sm text-on-surface" htmlFor="frequency">
                    Gönderim Sıklığı
                  </label>
                  <select
                    id="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as Frequency)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-full py-sm px-sm text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    {FREQUENCY_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {FREQUENCY_LABELS[f]}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-sm w-full bg-primary text-on-primary text-label-md py-sm rounded-full shadow-[0_4px_12px_rgba(0,107,49,0.2)] hover:bg-primary-container hover:text-on-primary-container transition-all flex justify-center items-center gap-xs disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Ekleniyor…' : 'Abone Ol'}
                  {!submitting && <Icon name="arrow_forward" className="text-[20px]" />}
                </button>
              </form>

              {/* Bilgilendirme notu */}
              <div className="mt-sm flex gap-xs bg-tertiary-fixed/40 border border-tertiary-fixed rounded-lg p-sm">
                <Icon name="info" className="text-[18px] text-tertiary flex-shrink-0 mt-base" />
                <p className="text-label-sm text-on-surface-variant leading-relaxed">
                  Sistem <strong className="text-on-surface">her gün</strong> otomatik
                  çalışır. Raporunuz, son gönderimden bu yana seçtiğiniz süre (günlük /
                  3 günde bir / haftalık) geçtiyse iletilir. Varsayılan{' '}
                  <strong className="text-on-surface">günlüktür</strong> — yani içerik
                  her 24 saatte bir gönderilir. İstediğiniz an sıklığı çipe tıklayarak
                  değiştirebilirsiniz.
                </p>
              </div>
            </div>
          </aside>

          {/* Abonelik listesi */}
          <section className="lg:col-span-2 flex flex-col gap-sm">
            {/* Üst araç çubuğu */}
            <div className="flex items-center justify-between gap-sm flex-wrap">
              <span className="text-label-md text-on-surface-variant">
                {subs.length} abonelik
              </span>
              <button
                onClick={handleRunNow}
                disabled={triggering || subs.length === 0}
                title="Zamanı gelen tüm abonelikler için raporları hemen gönder"
                className="inline-flex items-center gap-xs text-label-md text-primary border border-primary/30 bg-surface hover:bg-surface-container-low px-sm py-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon
                  name={triggering ? 'progress_activity' : 'send'}
                  className={`text-[18px] ${triggering ? 'animate-spin' : ''}`}
                />
                {triggering ? 'Gönderiliyor…' : 'Raporu Şimdi Gönder'}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-xs bg-error-container text-on-error-container text-label-md rounded-lg px-sm py-sm">
                <Icon name="error" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="glass-panel rounded-2xl p-xl flex items-center justify-center text-on-surface-variant gap-xs border border-outline-variant/20">
                <Icon name="progress_activity" className="animate-spin" />
                Yükleniyor…
              </div>
            ) : subs.length === 0 ? (
              <div className="glass-panel rounded-2xl p-xl flex flex-col items-center justify-center text-center gap-sm border border-outline-variant/20">
                <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <Icon name="topic" className="text-[28px]" />
                </div>
                <h3 className="text-body-lg font-semibold text-on-surface">
                  Henüz konu eklemediniz
                </h3>
                <p className="text-body-md text-on-surface-variant max-w-[24rem]">
                  Soldaki formdan ilgilendiğiniz bir konuyu ekleyin; günlük raporlar
                  gelmeye başlasın.
                </p>
              </div>
            ) : (
              subs.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  sub={sub}
                  onDelete={handleDelete}
                  onChange={handleUpdate}
                />
              ))
            )}
          </section>
        </div>
      </main>

      {/* Toast bildirimi */}
      {toast && (
        <div className="fixed top-[76px] left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-[32rem]">
          <div className="glass-card rounded-xl px-md py-sm flex items-center gap-sm shadow-lg">
            <Icon name="check_circle" className="text-primary flex-shrink-0" />
            <span className="text-body-md text-on-surface">{toast}</span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
