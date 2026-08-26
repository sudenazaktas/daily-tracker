import api from './api'
import type { Category } from './subscriptions'

export interface ReportItem {
  title: string
  url: string
  content: string
  score: number | null
  source: string | null
}

export interface Report {
  id: number
  user_id: number
  subscription_id: number | null
  topic: string
  category: string
  results: ReportItem[]
  created_at: string
}

/** Kullanıcının geçmiş raporları (en yeniden eskiye). */
export async function listReports(limit = 50): Promise<Report[]> {
  const { data } = await api.get('/reports', { params: { limit } })
  return data
}

/** 'Şimdi Getir' — bir konu için anlık önizleme (kayıt/e-posta yok). */
export async function previewReport(
  topic: string,
  category: Category | string = 'General',
): Promise<{ topic: string; category: string; results: ReportItem[] }> {
  const { data } = await api.post('/reports/preview', { topic, category })
  return data
}
