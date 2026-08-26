import Icon from './Icon'
import type { ReportItem } from '../services/reports'

/** Bir rapor/önizleme içindeki içerik listesini tasarım diliyle gösterir. */
export default function ReportResultList({ results }: { results: ReportItem[] }) {
  if (!results.length) {
    return (
      <p className="text-body-md text-on-surface-variant py-sm">
        Bu konu için son 24 saatte uygun içerik bulunamadı.
      </p>
    )
  }

  return (
    <ol className="flex flex-col gap-xs">
      {results.map((r, i) => (
        <li
          key={`${r.url}-${i}`}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-sm flex gap-sm"
        >
          <span className="text-label-md text-primary font-bold w-6 flex-shrink-0 pt-base">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body-md font-semibold text-on-surface hover:text-primary transition-colors flex items-start gap-base group"
            >
              <span className="min-w-0">{r.title}</span>
              <Icon
                name="open_in_new"
                className="text-[16px] text-outline group-hover:text-primary flex-shrink-0 mt-base"
              />
            </a>
            {r.content && (
              <p className="text-label-sm text-on-surface-variant mt-base line-clamp-2">
                {r.content}
              </p>
            )}
            {r.source && (
              <span className="inline-flex items-center gap-base text-label-sm text-outline mt-base">
                <Icon name="public" className="text-[14px]" />
                {r.source}
              </span>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
