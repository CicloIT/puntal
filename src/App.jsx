import { useState } from 'react'
import Header from './components/Header'
import Wheel from './components/Wheel'
import CompanyMenu from './components/CompanyMenu'
import { useCompanyData } from './hooks/useCompanyData'
import './App.css'

function App() {
  const { companies, setLogo, setPrize, addPrize, removePrize } = useCompanyData()
  const [selectedId, setSelectedId] = useState(companies[0].id)

  const company = companies.find((c) => c.id === selectedId) ?? companies[0]

  return (
    <>
      <Header company={company}>
        <CompanyMenu
          companies={companies}
          selectedId={selectedId}
          onSelect={setSelectedId}
          company={company}
          setLogo={setLogo}
          setPrize={setPrize}
          addPrize={addPrize}
          removePrize={removePrize}
        />
      </Header>
      <main id="center">
        <Wheel key={company.id} company={company} />
      </main>
    </>
  )
}

export default App
