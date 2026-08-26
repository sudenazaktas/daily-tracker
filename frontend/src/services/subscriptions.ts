import api from './api'

/** Backend Category enum değerleri (backend/app/models/subscription.py ile birebir). */
export type Category =
  | 'Technology'
  | 'Business & Finance'
  | 'Science'
  | 'Sports'
  | 'Entertainment'
  | 'Politics'
  | 'Health'
  | 'General'

/** Backend Frequency enum değerleri. */
export type Frequency = 'daily' | 'every_3_days' | 'weekly'

export interface Subscription {
  id: number
  user_id: number
  topic: string
  category: Category
  frequency: Frequency
  last_sent_at: string | null
  created_at: string
}

/** Kategori değeri → Türkçe etiket eşlemesi (UI'da gösterim için). */
export const CATEGORY_LABELS: Record<Category, string> = {
  Technology: 'Teknoloji',
  'Business & Finance': 'İş & Finans',
  Science: 'Bilim',
  Sports: 'Spor',
  Entertainment: 'Eğlence',
  Politics: 'Politika',
  Health: 'Sağlık',
  General: 'Genel',
}

export const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS) as Category[]

/** Sıklık değeri → Türkçe etiket eşlemesi. */
export const FREQUENCY_LABELS: Record<Frequency, string> = {
  daily: 'Günlük (24 saatte bir)',
  every_3_days: '3 günde bir',
  weekly: 'Haftalık',
}

/** Listelerde/çiplerde kullanılacak kısa etiket. */
export const FREQUENCY_SHORT: Record<Frequency, string> = {
  daily: 'Günlük',
  every_3_days: '3 günde bir',
  weekly: 'Haftalık',
}

export const FREQUENCY_OPTIONS = Object.keys(FREQUENCY_LABELS) as Frequency[]

export async function listSubscriptions(): Promise<Subscription[]> {
  const { data } = await api.get('/subscriptions')
  return data
}

export async function createSubscription(
  topic: string,
  category: Category,
  frequency: Frequency,
): Promise<Subscription> {
  const { data } = await api.post('/subscriptions', { topic, category, frequency })
  return data
}

export async function updateSubscription(
  id: number,
  changes: Partial<Pick<Subscription, 'topic' | 'category' | 'frequency'>>,
): Promise<Subscription> {
  const { data } = await api.patch(`/subscriptions/${id}`, changes)
  return data
}

export async function deleteSubscription(id: number): Promise<void> {
  await api.delete(`/subscriptions/${id}`)
}
