import './Sponsors.css'

export default function Sponsors({ sponsors }) {
  return (
    <div className="sponsors">
      <span className="sponsors-title">Sponsors</span>
      <ul className="sponsors-list">
        {sponsors.map((sponsor) => (
          <li className="sponsors-item" key={sponsor.name}>
            <span className="sponsors-logo" style={{ background: sponsor.logoBg || '#fff' }}>
              <img src={sponsor.logo} alt={`Logo ${sponsor.name}`} />
            </span>
            <span className="sponsors-name">{sponsor.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
