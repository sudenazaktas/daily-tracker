import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icon from './Icon'
import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { label: 'Panel', to: '/dashboard', icon: 'dashboard' },
  { label: 'Geçmiş', to: '/history', icon: 'history' },
  { label: 'İstatistikler', to: '/insights', icon: 'insights' },
]

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-label-md transition-colors px-xs py-base ${
      isActive
        ? 'text-primary'
        : 'text-on-surface-variant hover:text-primary'
    }`

  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 w-full border-b border-outline-variant/10 shadow-sm transition-all duration-300 ease-in-out z-50">
      <div className="flex justify-between items-center w-full px-md py-xs max-w-7xl mx-auto">
        {/* Marka */}
        <Link to="/" className="flex items-center gap-xs cursor-pointer">
          <span className="text-headline-md font-bold text-primary tracking-tight">
            Daily Tracker
          </span>
        </Link>

        {/* Masaüstü navigasyon */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-sm">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Eylemler */}
        <div className="flex items-center gap-sm">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link
                to="/settings"
                title="Ayarlar"
                className="hidden md:flex text-on-surface-variant hover:text-primary transition-colors p-base rounded-full hover:bg-surface-variant/20 items-center justify-center"
              >
                <Icon name="settings" />
              </Link>
              <Link
                to="/dashboard"
                className="hidden sm:flex bg-primary text-on-primary text-label-md px-sm py-xs rounded-full shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-all items-center gap-xs"
              >
                <Icon name="add" className="text-[18px]" />
                Konu Ekle
              </Link>
              <button
                onClick={handleLogout}
                title="Çıkış yap"
                className="hidden md:flex w-[36px] h-[36px] rounded-full bg-secondary-container text-on-secondary-container items-center justify-center flex-shrink-0 cursor-pointer ml-xs border border-outline-variant/20 hover:bg-primary hover:text-on-primary transition-colors"
              >
                <span className="text-label-md font-bold uppercase">
                  {(user?.username || user?.email || 'K').charAt(0)}
                </span>
              </button>
              {/* Mobil menü butonu */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden text-on-surface-variant hover:text-primary transition-colors p-base rounded-full hover:bg-surface-variant/20 flex items-center justify-center"
                aria-label="Menü"
              >
                <Icon name={menuOpen ? 'close' : 'menu'} />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-primary text-on-primary text-label-md px-sm py-xs rounded-full shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-xs"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </div>

      {/* Mobil açılır menü */}
      {isAuthenticated && menuOpen && (
        <nav className="md:hidden border-t border-outline-variant/10 bg-surface/95 backdrop-blur-md px-md py-sm flex flex-col gap-base">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-xs text-label-md py-xs px-base rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary bg-secondary-container/40'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              <Icon name={link.icon} className="text-[20px]" />
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/settings"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-xs text-label-md py-xs px-base rounded-lg transition-colors ${
                isActive ? 'text-primary bg-secondary-container/40' : 'text-on-surface-variant hover:text-primary'
              }`
            }
          >
            <Icon name="settings" className="text-[20px]" />
            Ayarlar
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-xs text-label-md py-xs px-base rounded-lg text-on-surface-variant hover:text-error transition-colors text-left"
          >
            <Icon name="logout" className="text-[20px]" />
            Çıkış Yap
          </button>
        </nav>
      )}
    </header>
  )
}
