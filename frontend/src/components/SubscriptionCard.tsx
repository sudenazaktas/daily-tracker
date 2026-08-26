import { useState } from 'react'
import Icon from './Icon'
import ReportResultList from './ReportResultList'
import {
  CATEGORY_LABELS,
  FREQUENCY_SHORT,
  FREQUENCY_LABELS,
  FREQUENCY_OPTIONS,
  updateSubscription,
  type Subscription,
  type Frequency,
} from '../services/subscriptions'
import { previewReport, type ReportItem } from '../services/reports'

interface Props {
  sub: Subscription
  onDelete: (id: number) => void
  onChange: (updated: Subscription) => void
}

export default function SubscriptionCard({ sub, onDelete, onChange }: Props) {
  const [preview, setPreview] = useState<ReportItem[] | null>(null)
  const [previewing, setPreviewing] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [editingFreq, setEditingFreq] = useState(false)

  const handlePreview = async () => {
    if (preview) {
      setExpanded((v) => !v)
      return
    }
    setPreviewing(true)
    setPreviewError(null)
    try {
      const data = await previewReport(sub.topic, sub.category)
      setPreview(data.results)
      setExpanded(true)
    } catch {
      setPreviewError('İçerik getirilemedi. Lütfen tekrar deneyin.')
    } finally {
      setPreviewing(false)
    }
  }

  const handleFreqChange = async (frequency: Frequency) => {
    setEditingFreq(false)
    if (frequency === sub.frequency) return
    try {
      const updated = await updateSubscription(sub.id, { frequency })
      onChange(updated)
    } catch {
      /* sessizce geç — kullanıcı tekrar deneyebilir */
    }
  }

  return (
    <div className="glass-panel rounded-2xl border border-outline-variant/20 hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-md flex items-center justify-between gap-sm">
        <div className="flex items-center gap-sm min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
            <Icon name="track_changes" />
          </div>
          <div className="min-w-0">
            <h3 className="text-body-lg font-semibold text-on-surface truncate">
              {sub.topic}
            </h3>
            <div className="flex items-center gap-xs mt-base flex-wrap">
              <span className="inline-flex items-center text-label-sm text-on-secondary-container bg-secondary-container px-sm py-base rounded-full">
                {CATEGORY_LABELS[sub.category] ?? sub.category}
              </span>
              {/* Sıklık çipi — tıklayınca düzenlenir */}
              {editingFreq ? (
                <select
                  autoFocus
                  value={sub.frequency}
                  onChange={(e) => handleFreqChange(e.target.value as Frequency)}
                  onBlur={() => setEditingFreq(false)}
                  className="text-label-sm bg-surface-container-low border border-outline-variant/50 rounded-full px-sm py-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {FREQUENCY_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {FREQUENCY_LABELS[f]}
                    </option>
                  ))}
                </select>
              ) : (
                <button
                  onClick={() => setEditingFreq(true)}
                  title="Gönderim sıklığını değiştir"
                  className="inline-flex items-center gap-base text-label-sm text-on-surface-variant bg-surface-container px-sm py-base rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <Icon name="schedule" className="text-[14px]" />
                  {FREQUENCY_SHORT[sub.frequency]}
                  <Icon name="edit" className="text-[13px] opacity-60" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-base flex-shrink-0">
          <button
            onClick={handlePreview}
            disabled={previewing}
            title="Şimdi getir"
            className="inline-flex items-center gap-base text-label-md text-primary bg-secondary-container/60 hover:bg-secondary-container px-sm py-xs rounded-full transition-colors disabled:opacity-60"
          >
            <Icon
              name={previewing ? 'progress_activity' : 'bolt'}
              className={`text-[18px] ${previewing ? 'animate-spin' : ''}`}
            />
            <span className="hidden sm:inline">
              {previewing ? 'Getiriliyor…' : preview ? (expanded ? 'Gizle' : 'Göster') : 'Şimdi Getir'}
            </span>
          </button>
          <button
            onClick={() => onDelete(sub.id)}
            title="Abonelikten çık"
            className="text-on-surface-variant hover:text-error hover:bg-error-container/50 transition-colors p-xs rounded-full flex items-center justify-center"
          >
            <Icon name="delete" />
          </button>
        </div>
      </div>

      {previewError && (
        <div className="px-md pb-sm">
          <p className="text-label-sm text-error">{previewError}</p>
        </div>
      )}

      {expanded && preview && (
        <div className="px-md pb-md pt-base border-t border-outline-variant/10 bg-surface-container-low/40">
          <p className="text-label-md text-on-surface-variant mb-sm flex items-center gap-base">
            <Icon name="bolt" className="text-[16px] text-primary" />
            Anlık önizleme — son 24 saatin öne çıkan içerikleri
          </p>
          <ReportResultList results={preview} />
        </div>
      )}
    </div>
  )
}
