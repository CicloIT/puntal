import { useState } from 'react'
import CompanySelector from './CompanySelector'
import EditPanel from './EditPanel'
import './CompanyMenu.css'

export default function CompanyMenu({ companies, selectedId, onSelect, company, setLogo, setPrize, addPrize, removePrize }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)

  function close() {
    setOpen(false)
    setEditing(false)
  }

  return (
    <span className="company-menu">
      <button
        type="button"
        className="company-menu-dot"
        aria-label="Cambiar empresa / editar ruleta"
        onClick={() => setOpen((v) => !v)}
      />

      {open && (
        <>
          <div className="company-menu-backdrop" onClick={close} />
          <div className="company-menu-panel">
            <CompanySelector
              companies={companies}
              selectedId={selectedId}
              onSelect={(id) => {
                onSelect(id)
                setEditing(false)
              }}
            />

            <button type="button" className="edit-toggle" onClick={() => setEditing((v) => !v)}>
              {editing ? 'Cerrar edición' : 'Editar logo y premios'}
            </button>

            {editing && (
              <EditPanel company={company} setLogo={setLogo} setPrize={setPrize} addPrize={addPrize} removePrize={removePrize} />
            )}
          </div>
        </>
      )}
    </span>
  )
}
