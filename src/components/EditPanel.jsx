import { readImageFile } from '../lib/readImageFile'
import './EditPanel.css'

export default function EditPanel({ company, setLogo, setPrize, addPrize, removePrize }) {
  const prizes = company.prizes

  async function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogo(company.id, await readImageFile(file))
    e.target.value = ''
  }

  return (
    <div className="edit-panel">
      <h2>Editando: {company.name}</h2>

      <div className="edit-row edit-row--logo">
        <div className="edit-thumb edit-thumb--round">
          {company.logo ? <img src={company.logo} alt="" /> : <span>Sin logo</span>}
        </div>
        <div className="edit-fields">
          <span className="edit-label">Logo de la empresa</span>
          <div className="edit-actions">
            <label className="edit-file-btn">
              Subir foto
              <input type="file" accept="image/*" onChange={handleLogoChange} />
            </label>
            {company.logo && (
              <button type="button" className="edit-clear-btn" onClick={() => setLogo(company.id, null)}>
                Quitar
              </button>
            )}
          </div>
        </div>
      </div>

      <h3>Premios ({prizes.length})</h3>
      <div className="edit-prizes">
        {prizes.map((prize, index) => (
          <div className="edit-row" key={index}>
            <div className="edit-thumb">
              <span>{index + 1}</span>
            </div>
            <div className="edit-fields">
              <input
                type="text"
                className="edit-text-input"
                value={prize.label}
                onChange={(e) => setPrize(company.id, index, { label: e.target.value }, prizes)}
              />
              {prizes.length > 2 && (
                <div className="edit-actions">
                  <button
                    type="button"
                    className="edit-clear-btn edit-remove-btn"
                    onClick={() => removePrize(company.id, index, prizes)}
                  >
                    Eliminar premio
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="edit-add-btn" onClick={() => addPrize(company.id, prizes)}>
        + Agregar premio
      </button>
    </div>
  )
}
