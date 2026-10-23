import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/index.js'
import { clearToken, getToken, setToken } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // true, пока проверяем сохранённый токен при запуске
  const [loading, setLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    if (!getToken()) return
    api
      .me()
      .then(setUser)
      .catch(clearToken)
      .finally(() => setLoading(false))
  }, [])

  const authorize = ({ token, user }) => {
    setToken(token)
    setUser(user)
  }

  const login = async (data) => authorize(await api.login(data))
  const register = async (data) => authorize(await api.register(data))

  const logout = () => {
    // Сообщаем серверу, что токен больше не нужен; ответ не ждём
    api.logout().catch(() => {})
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
