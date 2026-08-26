interface Level {
  label: string
  barClass: string
  textClass: string
}

/** Şifreyi 0–4 arası bir güç skoruna dönüştürür. */
function scorePassword(pw: string): number {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 4)
}

const LEVELS: Record<number, Level> = {
  1: { label: 'Zayıf', barClass: 'bg-error', textClass: 'text-error' },
  2: { label: 'Orta', barClass: 'bg-[#d98324]', textClass: 'text-[#d98324]' },
  3: { label: 'İyi', barClass: 'bg-primary-container', textClass: 'text-primary' },
  4: { label: 'Güçlü', barClass: 'bg-primary', textClass: 'text-primary' },
}

export default function PasswordStrength({ password }: { password: string }) {
  if (!password) return null

  const score = scorePassword(password)
  const level = LEVELS[score] ?? LEVELS[1]

  return (
    <div className="flex flex-col gap-base mt-base">
      <div className="flex gap-base">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= score ? level.barClass : 'bg-surface-container-high'
            }`}
          />
        ))}
      </div>
      <span className={`text-label-sm ${level.textClass}`}>
        Şifre gücü: {level.label}
      </span>
    </div>
  )
}
