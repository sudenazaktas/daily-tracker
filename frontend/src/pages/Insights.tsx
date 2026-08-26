import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Icon from '../components/Icon'
import { listReports, type Report } from '../services/reports'
import { CATEGORY_LABELS, type Category } from '../services/subscriptions'

interface StatTile {
  icon: string
  label: string
  value: string | number
  iconBg: string
}

export default function Insights() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setReports(await listReports(200))
      } catch {
        setError('İçgörüler yüklenemedi. Backend çalışıyor mu?')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const stats = useMemo(() => {
    const totalReports = reports.length
    const totalItems = reports.reduce((sum, r) => sum + r.results.length, 0)

    // Kategori dağılımı
    const byCategory = new Map<string, number>()
    const byTopic = new Map<string, number>()
    for (const r of reports) {
      byCategory.set(r.category, (byCategory.get(r.category) ?? 0) + 1)
      byTopic.set(r.topic, (byTopic.get(r.topic) ?? 0) + 1)
    }

    const categoryRows = [...byCategory.entries()]
      .map(([cat, count]) => ({
        label: CATEGORY_LABELS[cat as Category] ?? cat,
        count,
      }))
      .sort((a, b) => b.count - a.count)

    const topTopic = [...byTopic.entries()].sort((a, b) => b[1] - a[1])[0]
    const avgItems = totalReports ? Math.round(totalItems / totalReports) : 0

    return { totalReports, totalItems, categoryRows, topTopic, avgItems }
  }, [reports])

  const tiles: StatTile[] = [
    {
      icon: 'article',
      label: 'Toplam Rapor',
      value: stats.totalReports,
      iconBg: 'bg-primary-container text-on-primary-container',
    },
    {
      icon: 'auto_stories',
      label: 'Toplam İçerik',
      value: stats.totalItems,
      iconBg: 'bg-secondary-container text-on-secondary-container',
    },
    {
      icon: 'trending_up',
      label: 'Rapor Başına Ortalama',
      value: stats.avgItems,
      iconBg: 'bg-tertiary-container text-on-tertiary',
    },
    {
      icon: 'star',
      label: 'En Aktif Konu',
      value: stats.topTopic ? stats.topTopic[0] : '—',
      iconBg: 'bg-primary-container text-on-primary-container',
    },
  ]

  const maxCat = stats.categoryRows[0]?.count ?? 1

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />

      <main className="flex-grow w-full max-w-5xl mx-auto px-md py-lg flex flex-col gap-lg">
        <div className="flex flex-col gap-xs">
          <div className="inline-flex items-center gap-xs bg-secondary-container/50 text-on-secondary-container px-sm py-base rounded-full w-max border border-secondary/10">
            <Icon name="insights" className="text-[16px]" />
            <span className="text-label-sm">Özet İstatistikler</span>
          </div>
          <h1 className="text-headline-lg text-on-surface tracking-tight">
            <span className="text-primary">İçgörüler</span>
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl">
            Gönderilen raporlarınızdan türetilen genel görünüm. Veriler biriktikçe bu
            sayfa zenginleşir.
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
              <Icon name="query_stats" className="text-[28px]" />
            </div>
            <h3 className="text-body-lg font-semibold text-on-surface">
              Henüz gösterilecek veri yok
            </h3>
            <p className="text-body-md text-on-surface-variant max-w-[24rem]">
              Raporlar gönderilmeye başladıkça istatistikleriniz burada oluşur.
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
          <>
            {/* Stat kartları */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-sm">
              {tiles.map((t) => (
                <div
                  key={t.label}
                  className="glass-panel rounded-2xl p-md flex flex-col gap-sm border border-outline-variant/20"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${t.iconBg}`}
                  >
                    <Icon name={t.icon} />
                  </div>
                  <div>
                    <div className="text-headline-md text-on-surface truncate" title={String(t.value)}>
                      {t.value}
                    </div>
                    <div className="text-label-sm text-on-surface-variant mt-base">
                      {t.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Kategori dağılımı */}
            <div className="glass-card rounded-xl p-md flex flex-col gap-sm">
              <h2 className="text-headline-md text-on-surface flex items-center gap-xs">
                <Icon name="donut_small" className="text-primary" />
                Kategoriye Göre Dağılım
              </h2>
              <div className="flex flex-col gap-sm mt-sm">
                {stats.categoryRows.map((row) => (
                  <div key={row.label} className="flex flex-col gap-base">
                    <div className="flex justify-between text-label-md">
                      <span className="text-on-surface">{row.label}</span>
                      <span className="text-on-surface-variant">{row.count}</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all"
                        style={{ width: `${(row.count / maxCat) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
