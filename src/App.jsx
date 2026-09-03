import Header from './components/Header'
import Wheel from './components/Wheel'
import CompanyMenu from './components/CompanyMenu'
import Sponsors from './components/Sponsors'
import { useCompanyData } from './hooks/useCompanyData'
import { sponsors } from './data/companies'
import './App.css'

function App() {
  const { companies, setName, setLogo, setPrize, addPrize, removePrize } = useCompanyData()
  const company = companies[0]

  return (
    <>
      <Header company={company}>
        <CompanyMenu
          company={company}
          setName={setName}
          setLogo={setLogo}
          setPrize={setPrize}
          addPrize={addPrize}
          removePrize={removePrize}
        />
      </Header>
      <main id="center">
        <Sponsors sponsors={sponsors} />
        <div className="wheel-column">
          <Wheel key={company.id} company={company} />
        </div>
      </main>
    </>
  )
}

export default App
