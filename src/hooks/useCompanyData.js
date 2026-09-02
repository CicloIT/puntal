import { useCallback, useMemo, useState } from 'react'
import { companies as baseCompanies } from '../data/companies'
import { loadOverrides, saveOverrides } from '../lib/storage'

function isValidPrizes(prizes) {
  return Array.isArray(prizes) && prizes.length > 0 && prizes.every((p) => p && typeof p.label === 'string')
}

function applyOverride(company, override) {
  if (!override) return company
  return {
    ...company,
    logo: override.logo ?? company.logo,
    prizes: isValidPrizes(override.prizes) ? override.prizes : company.prizes,
  }
}

export function useCompanyData() {
  const [overrides, setOverrides] = useState(loadOverrides)

  const companies = useMemo(
    () => baseCompanies.map((company) => applyOverride(company, overrides[company.id])),
    [overrides],
  )

  const setLogo = useCallback((companyId, image) => {
    setOverrides((prev) => {
      const next = { ...prev, [companyId]: { ...prev[companyId], logo: image } }
      saveOverrides(next)
      return next
    })
  }, [])

  const setPrizes = useCallback((companyId, prizes) => {
    setOverrides((prev) => {
      const next = { ...prev, [companyId]: { ...prev[companyId], prizes } }
      saveOverrides(next)
      return next
    })
  }, [])

  const setPrize = useCallback(
    (companyId, index, patch, currentPrizes) => {
      const nextPrizes = currentPrizes.map((prize, i) => (i === index ? { ...prize, ...patch } : prize))
      setPrizes(companyId, nextPrizes)
    },
    [setPrizes],
  )

  const addPrize = useCallback(
    (companyId, currentPrizes) => {
      const nextPrizes = [
        ...currentPrizes,
        { label: `Premio ${String(currentPrizes.length + 1).padStart(2, '0')}` },
      ]
      setPrizes(companyId, nextPrizes)
    },
    [setPrizes],
  )

  const removePrize = useCallback(
    (companyId, index, currentPrizes) => {
      if (currentPrizes.length <= 2) return
      const nextPrizes = currentPrizes.filter((_, i) => i !== index)
      setPrizes(companyId, nextPrizes)
    },
    [setPrizes],
  )

  return { companies, setLogo, setPrize, addPrize, removePrize }
}
