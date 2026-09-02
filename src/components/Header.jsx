import './Header.css'

export default function Header({ company, children }) {
  const count = company.prizes.length

  return (
    <header className="app-header">
      <span className="app-header-item">{company.name} · Río Cuarto</span>
      <span className="app-header-item app-header-title">Ruleta de premios</span>
      <span className="app-header-item app-header-meta">
        {count} premios · un giro
        {children}
      </span>
    </header>
  )
}
