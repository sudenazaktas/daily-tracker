import { createContext, useContext, useState, type ReactNode } from 'react'

export interface AuthUser {
  id?: number
  username?: string
  email?: string
}

interface AuthContextType {
  token: string | null
  user: AuthUser | null
  login: (token: string, user?: AuthUser, refreshToken?: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('user')
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt'))
  const [user, setUser] = useState<AuthUser | null>(readStoredUser())

  const login = (newToken: string, newUser?: AuthUser, refreshToken?: string) => {
    localStorage.setItem('jwt', newToken)
    setToken(newToken)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
    }
  }

  const logout = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
