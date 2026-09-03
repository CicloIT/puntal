import { useState } from 'react'
import EditPanel from './EditPanel'
import './CompanyMenu.css'

export default function CompanyMenu({ company, setName, setLogo, setPrize, addPrize, removePrize }) {
  const [open, setOpen] = useState(false)

  return (
    <span className="company-menu">
      <button
        type="button"
        className="company-menu-trigger"
        aria-label="Editar ruleta"
        onClick={() => setOpen((v) => !v)}
      >
        ✎
      </button>

      {open && (
        <>
          <div className="company-menu-backdrop" onClick={() => setOpen(false)} />
          <div className="company-menu-panel">
            <EditPanel
              company={company}
              setName={setName}
              setLogo={setLogo}
              setPrize={setPrize}
              addPrize={addPrize}
              removePrize={removePrize}
            />
          </div>
        </>
      )}
    </span>
  )
}
