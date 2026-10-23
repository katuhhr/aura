// Заглушка сервера: те же методы, что и у httpApi, но данные лежат в браузере.
// Пользователи хранятся в localStorage в открытом виде — это только для разработки.

import { products } from '../data/products.js'
import { demoUser } from '../data/demoUser.js'
import { getToken } from './client.js'

const USERS_KEY = 'aura_mock_users'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))
const readStored = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
const readUsers = () => [demoUser, ...readStored()]
const publicUser = ({ id, name, email }) => ({ id, name, email })

export const mockApi = {
  async register({ name, email, password }) {
    await delay()
    const users = readUsers()
    if (users.some((u) => u.email === email)) {
      throw new Error('Пользователь с такой почтой уже зарегистрирован')
    }
    const user = { id: Date.now(), name, email, password }
    localStorage.setItem(USERS_KEY, JSON.stringify([...readStored(), user]))
    return { token: `mock-${user.id}`, user: publicUser(user) }
  },

  async login({ email, password }) {
    await delay()
    const user = readUsers().find((u) => u.email === email && u.password === password)
    if (!user) throw new Error('Неверная почта или пароль')
    return { token: `mock-${user.id}`, user: publicUser(user) }
  },

  async me() {
    await delay(100)
    const id = Number((getToken() || '').replace('mock-', ''))
    const user = readUsers().find((u) => u.id === id)
    if (!user) throw new Error('Сессия истекла')
    return publicUser(user)
  },

  async logout() {
    await delay(100)
  },

  async getProducts({ category, search } = {}) {
    await delay()
    const query = (search || '').trim().toLowerCase()
    return products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!query || p.name.toLowerCase().includes(query)),
    )
  },

  async getProduct(id) {
    await delay()
    const product = products.find((p) => p.id === Number(id))
    if (!product) throw new Error('Товар не найден')
    return product
  },
}
