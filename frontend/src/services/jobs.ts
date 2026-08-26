import api from './api'

/** Günlük rapor görevini manuel tetikler (arka planda çalışır, hemen döner). */
export async function runDailyJob(): Promise<{ message: string }> {
  const { data } = await api.post('/jobs/run-daily')
  return data
}
