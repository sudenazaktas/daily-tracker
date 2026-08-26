import api from './api'
import type { AuthUser } from '../context/AuthContext'

export interface AuthResult {
  jwt: string
  refreshToken?: string
  user: AuthUser
}

/** Strapi üzerinden yeni kullanıcı kaydı (FastAPI /auth/register proxy'si). */
export async function registerRequest(
  username: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  const { data } = await api.post('/auth/register', { username, email, password })
  return data
}

/** Giriş — Strapi "identifier" alanı e-posta veya kullanıcı adını kabul eder. */
export async function loginRequest(
  identifier: string,
  password: string,
): Promise<AuthResult> {
  const { data } = await api.post('/auth/login', { identifier, password })
  return data
}

/** Giriş yapan kullanıcının güncel bilgilerini Strapi'den getirir. */
export async function meRequest(): Promise<AuthUser> {
  const { data } = await api.get('/auth/me')
  return data
}
