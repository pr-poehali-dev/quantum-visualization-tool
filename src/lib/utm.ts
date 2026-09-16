const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const

const STORAGE_KEY = "rt_utm"

export type UtmData = Partial<Record<(typeof UTM_KEYS)[number], string>>

/** Сохраняет UTM-метки из URL в localStorage при первом заходе на сайт с рекламы */
export function captureUtmFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const data: UtmData = {}
  let found = false
  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) {
      data[key] = value
      found = true
    }
  }
  if (found) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

/** Возвращает сохранённые UTM-метки текущего визита (если пользователь пришёл с рекламы) */
export function getStoredUtm(): UtmData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
