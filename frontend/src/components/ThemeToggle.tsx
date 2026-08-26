import { useTheme } from '../context/ThemeContext'
import Icon from './Icon'

/** Açık/koyu tema arasında geçiş yapan buton. */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      onClick={toggle}
      title={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
      aria-label="Temayı değiştir"
      className={`text-on-surface-variant hover:text-primary transition-colors p-base rounded-full hover:bg-surface-variant/20 flex items-center justify-center ${className}`}
    >
      <Icon name={isDark ? 'light_mode' : 'dark_mode'} />
    </button>
  )
}
