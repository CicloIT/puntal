const STORAGE_KEY = 'puntal-ruleta-data'

export function loadOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveOverrides(overrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // localStorage no disponible (modo privado, cuota llena, etc.) — se ignora.
  }
}
