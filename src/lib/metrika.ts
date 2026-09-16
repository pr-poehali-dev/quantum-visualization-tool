declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...args: unknown[]) => void
  }
}

const COUNTER_ID = 109906587

/** Отправляет достижение цели в Яндекс.Метрику */
export function reachGoal(goal: string, params?: Record<string, unknown>) {
  try {
    window.ym?.(COUNTER_ID, "reachGoal", goal, params)
  } catch {
    // метрика не загрузилась — не мешаем работе сайта
  }
}
