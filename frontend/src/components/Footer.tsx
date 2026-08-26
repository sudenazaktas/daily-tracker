export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant w-full py-lg mt-xl">
      <div className="flex flex-col md:flex-row justify-between items-center px-lg max-w-7xl mx-auto gap-sm">
        <span className="text-headline-md text-primary font-bold">Daily Tracker</span>
        <nav className="flex flex-wrap justify-center gap-md">
          <a
            className="text-label-sm text-outline hover:text-primary transition-colors opacity-80 hover:opacity-100"
            href="#"
          >
            Gizlilik Politikası
          </a>
          <a
            className="text-label-sm text-outline hover:text-primary transition-colors opacity-80 hover:opacity-100"
            href="#"
          >
            Kullanım Şartları
          </a>
          <a
            className="text-label-sm text-outline hover:text-primary transition-colors opacity-80 hover:opacity-100"
            href="#"
          >
            Destek
          </a>
        </nav>
        <span className="text-label-sm text-on-surface-variant">
          © 2026 Daily Tracker. Hassasiyet için tasarlandı.
        </span>
      </div>
    </footer>
  )
}
