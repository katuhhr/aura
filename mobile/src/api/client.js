// Базовый HTTP-клиент. Все запросы к будущему бэкенду идут через request().

export const API_URL = import.meta.env.VITE_API_URL

const TOKEN_KEY = 'aura_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(API_URL + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    // fetch падает, если сервер выключен или недоступен по сети
    throw new Error('Сервер недоступен. Проверьте, что бэкенд запущен')
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || `Ошибка сервера (${response.status})`)
  }
  return data
}
