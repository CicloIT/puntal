function makePrizes() {
  return Array.from({ length: 8 }, (_, i) => ({
    label: `Premio ${String(i + 1).padStart(2, '0')}`,
  }))
}

// Paleta calcada del diseño original (Claude Design): cada empresa define
// su propio acento, color secundario, color de tinta (bordes/trazos) y el
// color de texto legible sobre cada uno de esos dos fondos.
export const companies = [
  {
    id: 'puntal',
    name: 'Puntal',
    accent: '#0088b0',
    accentText: '#201e1d',
    secondary: '#eae7e7',
    secondaryText: '#201e1d',
    ink: '#201e1d',
    logo: null,
    prizes: makePrizes(),
  },
  {
    id: 'lazo-mate',
    name: 'Lazo Mate',
    accent: '#d6006c',
    accentText: '#f3f2f2',
    secondary: '#eae7e7',
    secondaryText: '#201e1d',
    ink: '#201e1d',
    logo: `${import.meta.env.BASE_URL}logo-lazo-mate.png`,
    prizes: makePrizes(),
  },
  {
    id: 'empresa-03',
    name: 'Empresa 03',
    accent: '#201e1d',
    accentText: '#f3f2f2',
    secondary: '#eae7e7',
    secondaryText: '#201e1d',
    ink: '#201e1d',
    logo: null,
    prizes: makePrizes(),
  },
  {
    id: 'empresa-04',
    name: 'Empresa 04',
    accent: '#edbb00',
    accentText: '#201e1d',
    secondary: '#201e1d',
    secondaryText: '#f3f2f2',
    ink: '#201e1d',
    logo: null,
    prizes: makePrizes(),
  },
  {
    id: 'empresa-05',
    name: 'Empresa 05',
    accent: '#004961',
    accentText: '#e9f8ff',
    secondary: '#99e0ff',
    secondaryText: '#0a303e',
    ink: '#004961',
    logo: null,
    prizes: makePrizes(),
  },
  {
    id: 'empresa-06',
    name: 'Empresa 06',
    accent: '#790e3d',
    accentText: '#fff1f4',
    secondary: '#ffc0d0',
    secondaryText: '#4b1528',
    ink: '#4b1528',
    logo: null,
    prizes: makePrizes(),
  },
]
