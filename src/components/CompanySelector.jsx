import './CompanySelector.css'

export default function CompanySelector({ companies, selectedId, onSelect }) {
  return (
    <div className="company-selector" role="radiogroup" aria-label="Empresa">
      {companies.map((company) => (
        <button
          key={company.id}
          type="button"
          role="radio"
          aria-checked={company.id === selectedId}
          className={`company-pill${company.id === selectedId ? ' is-active' : ''}`}
          onClick={() => onSelect(company.id)}
        >
          <span className="company-dot" style={{ background: company.accent }} />
          {company.name}
        </button>
      ))}
    </div>
  )
}
