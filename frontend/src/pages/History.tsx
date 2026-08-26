import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Icon from '../components/Icon'
import ReportResultList from '../components/ReportResultList'
import { listReports, type Report } from '../services/reports'
import { CATEGORY_LABELS, type Category } from '../services/subscriptions'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function History() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<number | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await listReports()
        setReports(data)
        if (data.length) setOpenId(data[0].id)
      } catch {
        setError('Geçmiş yüklenemedi. Backend çalışıyor mu?')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />

      <main className="flex-grow w-full max-w-4xl mx-auto px-md py-lg flex flex-col gap-lg">
        <div className="flex flex-col gap-xs">
          <div className="inline-flex items-center gap-xs bg-secondary-container/50 text-on-secondary-container px-sm py-base rounded-full w-max border border-secondary/10">
            <Icon name="history" className="text-[16px]" />
            <span className="text-label-sm">Gönderilen Raporlar</span>
          </div>
          <h1 className="text-headline-lg text-on-surface tracking-tight">
            Rapor <span className="text-primary">Geçmişi</span>
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl">
            Size daha önce gönderilen günlük raporları burada tekrar
            inceleyebilirsiniz.
          </p>
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
        ) : reports.length === 0 ? (
          <div className="glass-panel rounded-2xl p-xl flex flex-col items-center justify-center text-center gap-sm border border-outline-variant/20">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <Icon name="mark_email_unread" className="text-[28px]" />
            </div>
            <h3 className="text-body-lg font-semibold text-on-surface">
              Henüz rapor gönderilmedi
            </h3>
            <p className="text-body-md text-on-surface-variant max-w-[24rem]">
              Bir konuya abone olduğunuzda ve zamanı geldiğinde raporlarınız burada
              birikmeye başlar.
            </p>
            <Link
              to="/dashboard"
              className="mt-xs inline-flex items-center gap-xs bg-primary text-on-primary text-label-md px-md py-xs rounded-full hover:bg-primary-container transition-colors"
            >
              <Icon name="add" className="text-[18px]" />
              Konu Ekle
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            {reports.map((rep) => {
              const open = openId === rep.id
              return (
                <div
                  key={rep.id}
                  className="glass-panel rounded-2xl border border-outline-variant/20 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenId(open ? null : rep.id)}
                    className="w-full p-md flex items-center justify-between gap-sm text-left"
                  >
                    <div className="flex items-center gap-sm min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
                        <Icon name="article" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-body-lg font-semibold text-on-surface truncate">
                          {rep.topic}
                        </h3>
                        <div className="flex items-center gap-xs mt-base flex-wrap">
                          <span className="inline-flex items-center text-label-sm text-on-secondary-container bg-secondary-container px-sm py-base rounded-full">
                            {CATEGORY_LABELS[rep.category as Category] ?? rep.category}
                          </span>
                          <span className="text-label-sm text-on-surface-variant">
                            {formatDate(rep.created_at)}
                          </span>
                          <span className="text-label-sm text-outline">
                            · {rep.results.length} içerik
                          </span>
                        </div>
                      </div>
                    </div>
                    <Icon
                      name={open ? 'expand_less' : 'expand_more'}
                      className="text-on-surface-variant flex-shrink-0"
                    />
                  </button>
                  {open && (
                    <div className="px-md pb-md pt-base border-t border-outline-variant/10 bg-surface-container-low/40">
                      <ReportResultList results={rep.results} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
