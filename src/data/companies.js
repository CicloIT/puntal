const BASE_URL = import.meta.env.BASE_URL

export const sponsors = [
  { name: 'Lazo Matero', logo: `${BASE_URL}LazoMate.png` },
  { name: 'Ven a Ver', logo: `${BASE_URL}VenaVer.png`, logoBg: '#201e1d' },
  { name: 'Abriles', logo: `${BASE_URL}Abriles.jpeg` },
]

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
    logo: `${BASE_URL}Puntal.png`,
    prizes: [
      { label: 'Premio Lazo Matero', logo: `${BASE_URL}LazoMate.png` },
      { label: 'Seguí participando', logo: null },
      { label: 'Premio Abriles', logo: `${BASE_URL}Abriles.jpeg` },
      { label: 'Premio Lazo Matero', logo: `${BASE_URL}LazoMate.png` },
      { label: 'Seguí participando', logo: null },
      { label: 'Premio Ven a Ver', logo: `${BASE_URL}VenaVer.png`, logoBg: '#201e1d' },
    ],
  },
]
