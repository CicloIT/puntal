import Header from './components/Header'
import Wheel from './components/Wheel'
import CompanyMenu from './components/CompanyMenu'
import { useCompanyData } from './hooks/useCompanyData'
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
        <Wheel key={company.id} company={company} />
      </main>
    </>
  )
}

export default App
