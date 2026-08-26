interface IconProps {
  name: string
  className?: string
}

/** Material Symbols Outlined ikon sarmalayıcısı. */
export default function Icon({ name, className = '' }: IconProps) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}
